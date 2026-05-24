# -*- coding: utf-8 -*-
"""
离线启发式精简：不依赖 LLM API，纯 Python 规则抽取每题的核心内容。

策略：
- 保留 # 标题、> 题号/分类元信息
- 保留 ## / ### 小标题（精简到主干）
- 保留代码块（## 典型回答 / ### 段内的代码块）
- 保留表格行（| ... |）
- 保留含 **加粗** 的整段（视为关键点）
- 保留以 - / * / 数字. 开头的列表
- 丢弃：纯叙述段、"📎 相关:"、"举例" / "我们" / "比如" 开头的过渡句、图片引用、扩展知识/学习资料/背景章节
- 输出已存在 → skip（保留前面手工写的精品版）

用法：
    python summarize_offline.py
    python summarize_offline.py --category 02_JVM
    python summarize_offline.py --overwrite        # 强制覆盖已存在的
"""
import argparse
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DST_ROOT = ROOT.parent / "java8gu-速记版"

# 丢弃整段的章节标题（次级标题，## / ###）
DROP_SECTION_TITLES = {
    "扩展知识", "学习资料", "背景", "技术选型", "你做了什么", "具体实现",
}

# 一行属于过渡叙述时丢弃；同时支持子串匹配
LINE_DROP_PATTERNS = [
    re.compile(r"^>\s*📎\s*相关"),          # 相关链接
    re.compile(r"^!\[.*?\]\("),               # 图片
    re.compile(r"^\[.*?\]:\s*http"),          # 参考链接
    re.compile(r"^来自\s+"),                  # "来自 tables_xxl_job.sql"
    re.compile(r"^感兴趣的"),
    re.compile(r"^大家可以"),
    re.compile(r"^我们?(?:接下来|这里|可以|不妨)"),
    re.compile(r"^(?:首先|其次|然后|接着|另外|再者|最后)，?"),
    re.compile(r"^那么(?:，|，)?(?:这|该|如何)"),
    re.compile(r"^这其实是"),
    re.compile(r"^看上去"),
    re.compile(r"^说人话"),
    re.compile(r"^举个例子"),
    re.compile(r"^比如说?"),
    re.compile(r"^一般来说"),
    re.compile(r"^这个问题"),
    re.compile(r"^所谓.*只是"),
    re.compile(r"PS：|ps："),
    re.compile(r"^据说"),
    re.compile(r"^以下是"),
    re.compile(r"^下面是"),
    re.compile(r"^可以看到"),
    re.compile(r"^可见"),
    re.compile(r"^如下：?$"),
    re.compile(r"^如下所示"),
    re.compile(r"^这里(?:面)?(?:用|有|主要|做|的)"),
    re.compile(r"^代码如下"),
    re.compile(r"^实现如下"),
    re.compile(r"^具体实现"),
    re.compile(r"^运行.*?输出"),
    re.compile(r"^运行结果"),
    re.compile(r"^得到结果"),
    re.compile(r"^最终.*?调用到"),
    re.compile(r"^最终会"),
    re.compile(r"^来看一下"),
    re.compile(r"^看看"),
    re.compile(r"^看下面"),
    re.compile(r"^看上去"),
    re.compile(r"^文档.*?给出"),
    re.compile(r"^官方文档"),
    re.compile(r"^他山之石"),
    re.compile(r"^大家.*?(?:都|可以)"),
    re.compile(r"^这其实"),
    re.compile(r"^其实.*?就是"),
    re.compile(r"^这个.*?就是"),
    re.compile(r"^那么.*?如何"),
    re.compile(r"^这就是"),
    re.compile(r"^这样.*?就"),
    re.compile(r"^请看"),
]

# 段首关键词标记"关键点"段（强保留）
KEEP_PREFIXES = (
    "**", "- ", "* ", "1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "0.",
    "| ",  # 表格行
)


def is_drop_section_heading(line: str) -> bool:
    """### 或 ## 标题如果是要丢弃的章节名，返回 True。"""
    m = re.match(r"^#{2,3}\s+(.+?)\s*$", line)
    if not m:
        return False
    title = m.group(1).strip().lstrip("*").rstrip("*").strip()
    return title in DROP_SECTION_TITLES


def is_drop_line(line: str) -> bool:
    s = line.strip()
    if not s:
        return False
    return any(p.search(s) for p in LINE_DROP_PATTERNS)


def first_sentence(text: str) -> str:
    """从一段叙述中抽第一句话作为代表。仅按中文标点切，避免 Thread.yield() 被切坏。"""
    s = text.strip()
    if not s:
        return ""
    m = re.search(r"[。？！；]", s)
    if m:
        return s[: m.end()].strip()
    return s


def clean_inline(line: str) -> str:
    """清理行内噪音。"""
    # 删除 yuque 跳转链接 [文字](https://www.yuque.com/...)
    line = re.sub(r"\[([^\]]+)\]\(https://www\.yuque\.com[^\)]+\)", r"\1", line)
    # 删除嵌入的"> 📎 相关:" 引用
    return line.rstrip()


def summarize(src_text: str) -> str:
    lines = src_text.splitlines()
    out: list[str] = []
    i = 0

    # 1) 提取头部：# 标题 + > 元信息 + ---
    while i < len(lines) and not lines[i].startswith("# "):
        i += 1
    if i >= len(lines):
        return src_text  # 异常文件，原样返回
    out.append(lines[i].rstrip())   # # 标题
    i += 1
    # 收集 > 题号/分类 行
    while i < len(lines) and not lines[i].startswith("---"):
        line = lines[i].strip()
        if line.startswith(">"):
            out.append("")
            out.append(line)
        i += 1
    if i < len(lines) and lines[i].startswith("---"):
        out.append("")
        out.append("---")
        i += 1

    # 2) 跳过 ## 典型回答 标题本身，用 ## 速记 替代
    out.append("")
    out.append("## 速记")
    out.append("")

    in_code_block = False
    in_drop_section = False
    code_lines: list[str] = []
    code_lang = ""
    paragraph_buf: list[str] = []

    def flush_paragraph():
        if not paragraph_buf:
            return
        para = " ".join(s.strip() for s in paragraph_buf if s.strip())
        paragraph_buf.clear()
        if not para:
            return
        # 短段直接保留
        if len(para) <= 80:
            out.append(f"- {para}")
            return
        # 长段抽第一句（按中文标点）
        s = first_sentence(para)
        if s and len(s) <= 160:
            out.append(f"- {s}")
        elif len(para) <= 200:
            # 没找到合适断句但段不太长，整段保留
            out.append(f"- {para}")

    while i < len(lines):
        raw = lines[i]
        line = clean_inline(raw)
        s = line.strip()

        # 代码块
        if s.startswith("```"):
            if not in_code_block:
                in_code_block = True
                code_lang = s[3:].strip() or "text"
                code_lines = []
            else:
                in_code_block = False
                # 输出代码块（去掉空白行只保留前 30 行避免过长）
                flush_paragraph()
                code_body = [ln for ln in code_lines if ln.strip()]
                if 0 < len(code_body) <= 30 and not in_drop_section:
                    out.append("")
                    out.append(f"```{code_lang}")
                    out.extend(code_lines[:30])
                    out.append("```")
                    out.append("")
                elif code_body and not in_drop_section:
                    # 长代码截取
                    out.append("")
                    out.append(f"```{code_lang}")
                    out.extend(code_lines[:15])
                    out.append("// ...省略")
                    out.append("```")
                    out.append("")
            i += 1
            continue
        if in_code_block:
            code_lines.append(raw)
            i += 1
            continue

        # 标题切换
        if s.startswith("##"):
            flush_paragraph()
            if is_drop_section_heading(line):
                in_drop_section = True
            else:
                in_drop_section = False
                # 规范化为 ### 子标题
                title = s.lstrip("#").strip().lstrip("*").rstrip("*").strip()
                if title and title not in ("典型回答",):
                    out.append("")
                    out.append(f"### {title}")
                    out.append("")
            i += 1
            continue

        if in_drop_section:
            i += 1
            continue

        # 单独丢弃的行
        if is_drop_line(line):
            i += 1
            continue

        # 表格
        if s.startswith("|") and s.endswith("|"):
            flush_paragraph()
            out.append(line)
            i += 1
            continue

        # 列表项
        if s.startswith(("- ", "* ", "1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.")):
            flush_paragraph()
            # 清理列表项内容
            content = re.sub(r"^[-*]\s+", "", s)
            content = re.sub(r"^\d+\.\s*", "", content)
            content = content.replace("**", "")
            if content:
                out.append(f"- {content}")
            i += 1
            continue

        # 空行 → flush 段落
        if not s:
            flush_paragraph()
            i += 1
            continue

        # 引用块（非相关链接）
        if s.startswith(">"):
            i += 1
            continue

        # 默认按段落累积
        paragraph_buf.append(line)
        i += 1

    flush_paragraph()

    # 清理空 ### 小节（标题下面没有实质内容）
    pruned: list[str] = []
    j = 0
    while j < len(out):
        line = out[j]
        if line.startswith("### "):
            # 向后看直到下一个 ### / ## 或结尾，看中间有没有非空非"###"行
            k = j + 1
            has_content = False
            while k < len(out) and not out[k].startswith(("### ", "## ")):
                if out[k].strip():
                    has_content = True
                    break
                k += 1
            if not has_content:
                j = k
                continue
        pruned.append(line)
        j += 1

    # 清理连续空行
    cleaned: list[str] = []
    prev_blank = False
    for ln in pruned:
        if not ln.strip():
            if prev_blank:
                continue
            prev_blank = True
        else:
            prev_blank = False
        cleaned.append(ln)
    # 去掉末尾空行
    while cleaned and not cleaned[-1].strip():
        cleaned.pop()
    return "\n".join(cleaned) + "\n"


def collect_files(only_category: str | None) -> list[Path]:
    files: list[Path] = []
    for category_dir in sorted(ROOT.iterdir()):
        if not category_dir.is_dir():
            continue
        if category_dir.name.startswith(("_", ".")) or category_dir.name == "docs":
            continue
        if only_category and category_dir.name != only_category:
            continue
        for md in sorted(category_dir.glob("*.md")):
            if md.name in ("README.md", "INDEX.md"):
                continue
            files.append(md)
    return files


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--category", type=str, default=None)
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--overwrite", action="store_true")
    args = ap.parse_args()

    # 复制 INDEX 和各分类 README
    DST_ROOT.mkdir(exist_ok=True)
    if (ROOT / "INDEX.md").exists():
        target = DST_ROOT / "INDEX.md"
        if not target.exists() or args.overwrite:
            shutil.copy2(ROOT / "INDEX.md", target)
    for cat in sorted(ROOT.iterdir()):
        if not cat.is_dir() or cat.name.startswith(("_", ".")) or cat.name == "docs":
            continue
        (DST_ROOT / cat.name).mkdir(parents=True, exist_ok=True)
        rd = cat / "README.md"
        if rd.exists():
            target = DST_ROOT / cat.name / "README.md"
            if not target.exists() or args.overwrite:
                shutil.copy2(rd, target)

    files = collect_files(args.category)
    if args.limit:
        files = files[: args.limit]

    print(f"待处理：{len(files)} 个文件，输出到 {DST_ROOT}")

    ok = skip = err = 0
    for idx, src in enumerate(files, 1):
        dst = DST_ROOT / src.relative_to(ROOT)
        if dst.exists() and dst.stat().st_size > 0 and not args.overwrite:
            skip += 1
            continue
        try:
            text = src.read_text(encoding="utf-8")
            result = summarize(text)
            dst.parent.mkdir(parents=True, exist_ok=True)
            dst.write_text(result, encoding="utf-8")
            ok += 1
        except Exception as e:
            sys.stderr.write(f"[err] {src.name}: {e}\n")
            err += 1
        if idx % 100 == 0:
            print(f"[{idx}/{len(files)}] ok={ok} skip={skip} err={err}")

    print(f"\n完成。ok={ok} skip={skip} err={err}")


if __name__ == "__main__":
    main()
