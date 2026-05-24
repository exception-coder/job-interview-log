# -*- coding: utf-8 -*-
"""
将 java8gu/ 下 1301 道题的详细 .md 转为速记版（每题 80~200 字核心要点），
输出到 java8gu-速记版/ 镜像目录。

用法：
    pip install anthropic
    set ANTHROPIC_API_KEY=sk-ant-xxx
    python summarize.py                 # 全量
    python summarize.py --limit 10      # 先跑 10 个试水
    python summarize.py --category 02_JVM   # 只跑某个分类
    python summarize.py --workers 16    # 并发数（默认 8）

特性：
- 输出已存在的文件自动跳过 → 可中断/续跑
- system prompt 启用 prompt caching，节省 90% 输入 token 成本
- README.md / INDEX.md 直接复制，不调用 LLM
"""
import argparse
import concurrent.futures
import os
import shutil
import sys
import time
from pathlib import Path

try:
    from anthropic import Anthropic
except ImportError:
    print("缺少依赖：pip install anthropic")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent          # java8gu/
DST_ROOT = ROOT.parent / "java8gu-速记版"
MODEL = "claude-sonnet-4-6"

SYSTEM_PROMPT = """你是 Java 八股面试题速记版编辑。

你的任务：把一道详细面试题的 markdown 改写成速记版，让人 30 秒内能扫完抓住所有得分点。

【输入】一份完整 .md 面试题，包含 # 标题、> 题号/分类元信息、## 典型回答（可能还有 ## 扩展知识）。

【输出】纯 markdown，无 ``` 包裹。结构严格如下：

# <保留原标题，包含 ✅ 前缀>

> <保留原题号/分类元信息行>

---

## 速记

- 第一条核心要点
- 第二条核心要点
- ...

（必要时追加二级要点：）

### <小标题>

- 要点
- 要点

【硬性规则】
1. 单题总字数控制在 80~250 中文字。简单题（如某关键字含义）80~150 字即可；复杂题（如 MVCC、分布式事务）可以到 250 字。
2. 全部用要点 / 短句，禁止整段叙述、禁止"首先...其次...最后"等连接词。
3. 保留关键代码片段（SQL、注解、配置）但精简到最短，只留核心一行。
4. 保留数字、阈值、版本号、关键 API 名（如 HashMap 容量 2^n、Cap=16、loadFactor=0.75）。
5. 删除：举例铺垫、背景故事、"我们知道..."、"接下来介绍..."、内容重复的解释。
6. 涉及对比（A vs B）时，用表格或并列要点，禁止两段叙述。
7. 直接输出 markdown 内容，不要任何前后解释、不要"以下是速记版"等开场白。"""


def collect_files(only_category: str | None) -> list[Path]:
    """收集所有需要 LLM 处理的题目 .md（不含 README / INDEX）。"""
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


def collect_passthrough() -> list[Path]:
    """收集需要原样复制（不走 LLM）的 markdown：INDEX.md + 每个分类的 README.md。"""
    files: list[Path] = []
    index = ROOT / "INDEX.md"
    if index.exists():
        files.append(index)
    for category_dir in sorted(ROOT.iterdir()):
        if not category_dir.is_dir():
            continue
        if category_dir.name.startswith(("_", ".")) or category_dir.name == "docs":
            continue
        readme = category_dir / "README.md"
        if readme.exists():
            files.append(readme)
    return files


def dst_path_for(src: Path) -> Path:
    return DST_ROOT / src.relative_to(ROOT)


def summarize_one(client: Anthropic, src: Path) -> tuple[Path, str, int, int]:
    raw = src.read_text(encoding="utf-8")
    resp = client.messages.create(
        model=MODEL,
        max_tokens=1024,
        system=[{
            "type": "text",
            "text": SYSTEM_PROMPT,
            "cache_control": {"type": "ephemeral"},
        }],
        messages=[{"role": "user", "content": raw}],
    )
    text = "".join(block.text for block in resp.content if block.type == "text")
    return src, text.strip() + "\n", resp.usage.input_tokens, resp.usage.output_tokens


def process(src: Path, client: Anthropic) -> tuple[str, int, int]:
    dst = dst_path_for(src)
    if dst.exists() and dst.stat().st_size > 0:
        return "skip", 0, 0
    dst.parent.mkdir(parents=True, exist_ok=True)
    try:
        _, text, in_tok, out_tok = summarize_one(client, src)
        dst.write_text(text, encoding="utf-8")
        return "ok", in_tok, out_tok
    except Exception as e:
        sys.stderr.write(f"[err] {src.name}: {e}\n")
        return "err", 0, 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="只处理前 N 个（试水用）")
    ap.add_argument("--category", type=str, default=None, help="只跑某个分类目录名")
    ap.add_argument("--workers", type=int, default=8, help="并发线程数")
    args = ap.parse_args()

    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("未设置 ANTHROPIC_API_KEY")
        sys.exit(1)

    client = Anthropic()
    DST_ROOT.mkdir(exist_ok=True)

    for f in collect_passthrough():
        d = dst_path_for(f)
        d.parent.mkdir(parents=True, exist_ok=True)
        if not d.exists():
            shutil.copy2(f, d)

    files = collect_files(args.category)
    if args.limit:
        files = files[: args.limit]

    print(f"待处理：{len(files)} 个文件，输出到 {DST_ROOT}")
    print(f"并发：{args.workers}，模型：{MODEL}")

    start = time.time()
    counts = {"ok": 0, "skip": 0, "err": 0}
    in_tok_sum = out_tok_sum = 0

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {pool.submit(process, f, client): f for f in files}
        for i, fut in enumerate(concurrent.futures.as_completed(futures), 1):
            status, in_tok, out_tok = fut.result()
            counts[status] += 1
            in_tok_sum += in_tok
            out_tok_sum += out_tok
            if i % 20 == 0 or i == len(files):
                elapsed = time.time() - start
                rate = i / elapsed if elapsed else 0
                eta = (len(files) - i) / rate if rate else 0
                print(
                    f"[{i}/{len(files)}] ok={counts['ok']} skip={counts['skip']} err={counts['err']} "
                    f"in={in_tok_sum} out={out_tok_sum} 用时={elapsed:.0f}s 预计剩余={eta:.0f}s"
                )

    print(f"\n完成。ok={counts['ok']} skip={counts['skip']} err={counts['err']}")
    print(f"输入 token={in_tok_sum} 输出 token={out_tok_sum}")
    cost = in_tok_sum / 1_000_000 * 3 + out_tok_sum / 1_000_000 * 15
    print(f"预估成本（不计 cache 折扣）≈ ${cost:.2f}")


if __name__ == "__main__":
    main()
