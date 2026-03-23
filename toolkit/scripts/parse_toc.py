#!/usr/bin/env python3
"""
解析语雀知识库 JSON 中的 toc 节点，生成一二级菜单的 Markdown 文件。

归类逻辑：
- parent_uuid 为空字符串 → 一级菜单（只记录 title）
- parent_uuid 非空 → 二级菜单，归属到对应的一级菜单（记录 title + url）

URL 格式：https://www.yuque.com/{namespace}/{doc_url}

用法：
    # 列表模式（默认）
    python3 scripts/parse_toc.py <decoded_json> <output_md>

    # 表格模式：每个一级菜单一张表，列为二级菜单条目
    python3 scripts/parse_toc.py <decoded_json> <output_md> --table

示例：
    python3 scripts/parse_toc.py java8gu/java8gu_decoded.json java8gu/toc.md
    python3 scripts/parse_toc.py java8gu/java8gu_decoded.json java8gu/toc_table.md --table
"""

import json
import sys
from pathlib import Path


def load_toc(json_path: str) -> tuple[str, str, list]:
    """读取 JSON，返回 (book_name, namespace, toc列表)。"""
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)
    book = data.get("book", {})
    return book.get("name", ""), book.get("namespace", ""), book.get("toc", [])


def build_menu(toc: list, namespace: str) -> dict[str, dict]:
    """
    两遍扫描 toc，构建有序的一二级菜单结构。

    返回：{uuid: {title, children: [{title, url}]}}
    """
    # 第一遍：收集一级菜单（parent_uuid 为空且可见）
    level1: dict[str, dict] = {}
    for item in toc:
        if item.get("parent_uuid", "") == "" and item.get("visible", 1) == 1:
            level1[item["uuid"]] = {"title": item["title"], "children": []}

    # 第二遍：将二级菜单归到对应的一级菜单
    for item in toc:
        parent = item.get("parent_uuid", "")
        if parent and parent in level1 and item.get("visible", 1) == 1:
            url = item.get("url", "")
            full_url = f"https://www.yuque.com/{namespace}/{url}" if url else ""
            level1[parent]["children"].append({"title": item["title"], "url": full_url})

    return level1


def render_list(book_name: str, level1: dict) -> str:
    """渲染列表模式 Markdown：## 一级标题 + 无序列表二级条目。"""
    lines = [f"# {book_name}\n"]
    for entry in level1.values():
        lines.append(f"## {entry['title']}\n")
        for child in entry["children"]:
            if child["url"]:
                lines.append(f"- [{child['title']}]({child['url']})")
            else:
                lines.append(f"- {child['title']}")
        lines.append("")
    return "\n".join(lines)


def render_table(book_name: str, level1: dict) -> str:
    """
    渲染表格模式 Markdown：每个一级菜单生成一张两列表格。
    | 序号 | 文章 |
    |------|------|
    | 1    | [标题](url) |
    """
    lines = [f"# {book_name}\n"]
    for entry in level1.values():
        lines.append(f"## {entry['title']}\n")
        if not entry["children"]:
            lines.append("")
            continue

        # 表头
        lines.append("| 序号 | 文章 |")
        lines.append("|------|------|")

        # 表格行
        for idx, child in enumerate(entry["children"], start=1):
            if child["url"]:
                cell = f"[{child['title']}]({child['url']})"
            else:
                cell = child["title"]
            lines.append(f"| {idx} | {cell} |")

        lines.append("")
    return "\n".join(lines)


def parse_toc(json_path: str, output_path: str, table_mode: bool = False) -> None:
    """主入口：解析 toc 并按指定模式写出 Markdown。"""
    book_name, namespace, toc = load_toc(json_path)
    level1 = build_menu(toc, namespace)

    # 按模式渲染
    content = render_table(book_name, level1) if table_mode else render_list(book_name, level1)

    # 写出文件
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)

    total_l1 = len(level1)
    total_l2 = sum(len(e["children"]) for e in level1.values())
    mode_label = "表格" if table_mode else "列表"
    print(f"[Done][{mode_label}模式] 一级菜单: {total_l1}，二级菜单: {total_l2}")
    print(f"输出文件: {Path(output_path).resolve()}")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("用法: python3 scripts/parse_toc.py <decoded_json> <output_md> [--table]")
        sys.exit(1)
    table_mode = "--table" in sys.argv
    parse_toc(sys.argv[1], sys.argv[2], table_mode)
