#!/usr/bin/env python3
"""Fetch yuque docs via Playwright and build markdown files."""

import re  # 正则表达式，用于清洗文件名、解析目录和替换 HTML
import json  # 处理 JSON 数据（读写索引、解析接口返回）
import time  # 控制请求节奏，避免过快访问
from pathlib import Path  # 跨平台路径处理
from playwright.sync_api import sync_playwright  # Playwright 同步 API

# 目录结构说明：
# - toc_grouped.md：目录文件，包含文档标题和链接
# - a8gu/：输出目录，保存生成的 Markdown
# - .doc_index.json：抓取索引，避免重复下载
TOC_FILE = Path(__file__).parent / "toc_grouped.md"
OUTPUT_DIR = Path(__file__).parent / "a8gu"
BOOK_ID = "63622563"  # 书籍 ID（当前脚本未使用，可作为标识保留）
USER_DATA_DIR = Path.home() / "Library" / "Caches" / "playwright-yuque-profile"  # 浏览器登录态缓存
INDEX_FILE = OUTPUT_DIR / ".doc_index.json"


def sanitize_filename(name: str) -> str:
    """把标题清洗成安全的文件名（适用于 macOS/Windows/Linux）。"""
    # 1) 去掉首尾空白
    name = name.strip()
    # 2) 去掉一些 emoji（先删大范围，再补充常见符号）
    name = re.sub(r'[\U0001F000-\U0001FFFF\U00002600-\U000027FF\U0000FE00-\U0000FEFF]', '', name)
    name = re.sub(r'[✅❗📮✓×·•🔥💯🧣]', '', name)
    # 3) 再次去掉首尾空白（避免上一步留下空格）
    name = name.strip()
    # 4) 把系统不允许的字符替换成下划线
    name = re.sub(r'[<>:"/\\|?*\x00-\x1f]', '_', name)
    # 5) 用 and 替换 &，避免某些系统/工具识别问题
    name = name.replace('&', 'and')
    # 6) 连续空白/下划线收敛为单个下划线
    name = re.sub(r'[_\s]+', '_', name)
    # 7) 去掉首尾下划线
    name = name.strip('_')
    # 8) 控制长度（按 UTF-8 字节数），防止文件名过长
    while len(name.encode('utf-8')) > 200:
        name = name[:-1]
    # 9) 兜底：若清洗后为空，给一个默认名
    return name or 'untitled'


def parse_toc(toc_file: Path):
    """解析 toc_grouped.md，提取每篇文章的分组与 doc_id。"""
    sections = []  # 保存结果：每个元素是一篇文章的信息
    current_h2 = None  # 当前二级标题（##）
    current_h3 = None  # 当前三级标题（###），可能为空

    # 逐行读取目录文件
    with open(toc_file, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.rstrip('\n')

            # 1) 匹配二级标题（## xxx）
            m2 = re.match(r'^## (.+)$', line)
            if m2:
                current_h2 = m2.group(1).strip()
                current_h3 = None  # 新的二级标题出现，三级标题重置
                continue

            # 2) 匹配三级标题（### xxx）
            m3 = re.match(r'^### (.+)$', line)
            if m3:
                current_h3 = m3.group(1).strip()
                continue

            # 3) 匹配链接行：- [标题](https://www.yuque.com/.../doc_id)
            ml = re.match(r'^- \[(.+?)\]\(https://www\.yuque\.com/hollis666/fsn3og/([^)]+)\)', line)
            if ml and current_h2:
                title = ml.group(1).strip()
                doc_id = ml.group(2).strip()
                sections.append({
                    'h2': current_h2,
                    'h3': current_h3,
                    'title': title,
                    'doc_id': doc_id,
                })
    return sections


def lake_to_markdown(title: str, content: str) -> str:
    """把语雀的 lake/HTML 内容转换成可读的 Markdown。"""
    # 如果接口没拿到内容，直接返回提示
    if not content:
        return f"# {title}\n\n> 内容获取失败\n"

    text = content  # 原始 HTML 字符串

    # 1) 先处理代码块：<pre><code>...</code></pre> -> ```...```
    text = re.sub(
        r'<pre[^>]*><code[^>]*>(.*?)</code></pre>',
        lambda m: '```\n' + re.sub(r'<[^>]+>', '', m.group(1)).strip() + '\n```',
        text,
        flags=re.DOTALL
    )

    # 2) 处理标题：<h1>..</h1> -> # ..（从 h6 到 h1，避免嵌套影响）
    for level in range(6, 0, -1):
        text = re.sub(
            rf'<h{level}[^>]*>(.*?)</h{level}>',
            lambda m, l=level: '\n' + '#' * l + ' ' + re.sub(r'<[^>]+>', '', m.group(1)).strip(),
            text,
            flags=re.DOTALL
        )

    # 3) 粗体/斜体
    text = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', text, flags=re.DOTALL)
    text = re.sub(r'<b[^>]*>(.*?)</b>', r'**\1**', text, flags=re.DOTALL)
    text = re.sub(r'<em[^>]*>(.*?)</em>', r'*\1*', text, flags=re.DOTALL)

    # 4) 行内代码：<code>...</code> -> `...`
    text = re.sub(r'<code[^>]*>(.*?)</code>', r'`\1`', text, flags=re.DOTALL)

    # 5) 链接：<a href="url">text</a> -> [text](url)
    text = re.sub(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', r'[\2](\1)', text, flags=re.DOTALL)

    # 6) 列表：<li>...</li> -> - ...
    text = re.sub(
        r'<li[^>]*>(.*?)</li>',
        lambda m: '- ' + re.sub(r'<[^>]+>', '', m.group(1)).strip(),
        text,
        flags=re.DOTALL
    )

    # 7) 表格：把 th/td 转成 Markdown 的 | 单元格
    text = re.sub(
        r'<th[^>]*>(.*?)</th>',
        lambda m: '| ' + re.sub(r'<[^>]+>', '', m.group(1)).strip() + ' ',
        text,
        flags=re.DOTALL
    )
    text = re.sub(
        r'<td[^>]*>(.*?)</td>',
        lambda m: '| ' + re.sub(r'<[^>]+>', '', m.group(1)).strip() + ' ',
        text,
        flags=re.DOTALL
    )
    text = re.sub(r'</tr>', '|\n', text)

    # 8) 引用：<blockquote>...</blockquote> -> > ...
    text = re.sub(
        r'<blockquote[^>]*>(.*?)</blockquote>',
        lambda m: '> ' + re.sub(r'<[^>]+>', '', m.group(1)).strip(),
        text,
        flags=re.DOTALL
    )

    # 9) 换行：<br> -> \n；段落/Div 结束也换行
    text = re.sub(r'<br\s*/?>', '\n', text)
    text = re.sub(r'</p>|</div>', '\n', text)

    # 10) 清理剩余 HTML 标签
    text = re.sub(r'<[^>]+>', '', text)

    # 11) 处理常见 HTML 实体
    text = (
        text.replace('&nbsp;', ' ')
            .replace('&lt;', '<')
            .replace('&gt;', '>')
            .replace('&amp;', '&')
            .replace('&quot;', '"')
            .replace('&#39;', "'")
    )

    # 12) 压缩多余空行
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = text.strip()

    # 最终统一加上文章标题
    return f"# {title}\n\n{text}\n"


def main():
    """脚本入口：解析目录、批量抓取、写入 Markdown。"""
    print("Parsing TOC...")
    sections = parse_toc(TOC_FILE)
    print(f"Found {len(sections)} items")

    # 确保输出目录与浏览器缓存目录存在
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    USER_DATA_DIR.mkdir(parents=True, exist_ok=True)

    # 读取索引文件：记录已抓取 doc_id，避免重复请求
    if INDEX_FILE.exists():
        try:
            index = json.loads(INDEX_FILE.read_text(encoding='utf-8'))
        except Exception:
            # 索引损坏时重建（空字典）
            index = {}
    else:
        index = {}

    # 启动 Playwright，并复用本地浏览器缓存（保存登录态）
    with sync_playwright() as p:
        print("Launching browser...")
        context = p.chromium.launch_persistent_context(
            user_data_dir=str(USER_DATA_DIR),
            headless=True,
        )
        page = context.new_page()

        # 确认登录状态：访问 dashboard，如果被跳转到登录页则报错
        page.goto('https://www.yuque.com/dashboard', wait_until='domcontentloaded', timeout=30000)
        if 'login' in page.url:
            raise RuntimeError('未检测到登录状态，请先用有头模式登录一次以保存会话')
        print("Login confirmed")

        total = len(sections)
        for i, item in enumerate(sections, 1):
            h2 = item['h2']
            h3 = item['h3']
            title = item['title']
            doc_id = item['doc_id']

            # 已抓取过就跳过
            if doc_id in index:
                print(f"[{i}/{total}] Skip doc_id: {title}")
                continue

            # 目标目录：按 H2/H3 分组
            h2_dir = OUTPUT_DIR / sanitize_filename(h2)
            target_dir = h2_dir / sanitize_filename(h3) if h3 else h2_dir
            target_dir.mkdir(parents=True, exist_ok=True)

            # 目标文件路径
            filename = sanitize_filename(title) + '.md'
            filepath = target_dir / filename

            print(f"[{i}/{total}] Fetching: {title}")

            # 访问页面，并等待对应的接口返回（/api/docs/{doc_id}）
            content = ''
            try:
                with page.expect_response(
                    lambda r, d=doc_id: f'/api/docs/{d}' in r.url and r.status == 200,
                    timeout=20000
                ) as response_info:
                    page.goto(
                        f'https://www.yuque.com/hollis666/fsn3og/{doc_id}',
                        wait_until='domcontentloaded',
                        timeout=20000
                    )
                response = response_info.value
                data = json.loads(response.text())
                content = data.get('data', {}).get('content', '')
            except Exception as e:
                print(f"  Error: {e}")

            # 转成 Markdown 并写文件
            md = lake_to_markdown(title, content)
            filepath.write_text(md, encoding='utf-8')

            # 更新索引：记录 doc_id -> 相对路径
            index[doc_id] = str(filepath.relative_to(OUTPUT_DIR))
            INDEX_FILE.write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding='utf-8')
            print(f"  -> {filepath.relative_to(OUTPUT_DIR)} ({len(content)} chars)")

            # 适当放慢速度，避免触发服务端限流
            time.sleep(0.2)

        context.close()
    print("\nDone!")


if __name__ == '__main__':
    main()
