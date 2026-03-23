#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
遍历 a8gu/ 目录下的所有 .md 文件，将文件名中不跨平台友好的字符替换为安全字符，
并将变更记录写入 rename_log.md。

最佳实践命名规则（保留：字母/数字/中文/- _ .）：
  全角/半角问号 ？?  → Q
  全角逗号 ，        → ,（保留半角逗号）
  全角括号 （）      → 删除括号，保留括号内内容
  半角括号 ()        → 删除括号，保留括号内内容
  顿号 、            → -
  全角/半角冒号 ：:  → -
  全角/半角分号 ；;  → -
  全角/半角感叹号 ！! → 删除
  书名号 《》        → 删除
  方括号 【】        → 删除
  引号 ''""         → 删除
  间隔号 ·           → -
  空格               → _
  Windows非法字符 * \ " < > | → 删除
  连续 -- / __       → 压缩为单个
  首尾 - _           → 去除
"""

import os
import re
from datetime import datetime

BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "a8gu")
LOG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rename_log.md")


def sanitize_name(name: str) -> str:
    """对文件名 stem 应用跨平台最佳实践替换规则。"""
    # 1. 问号（全角/半角）→ Q
    name = name.replace("？", "Q").replace("?", "Q")

    # 2. 全角逗号 → 半角逗号
    name = name.replace("，", ",")

    # 3. 括号（全角/半角）→ 删除括号保留内容
    name = name.replace("（", "").replace("）", "")
    name = name.replace("(", "").replace(")", "")

    # 4. 书名号、方括号 → 删除
    name = name.replace("《", "").replace("》", "")
    name = name.replace("【", "").replace("】", "")

    # 5. 引号（全角中文引号）→ 删除
    name = name.replace("\u2018", "").replace("\u2019", "")  # ' '
    name = name.replace("\u201c", "").replace("\u201d", "")  # " "

    # 6. 顿号 → -
    name = name.replace("、", "-")

    # 7. 冒号（全角/半角）→ -
    name = name.replace("：", "-").replace(":", "-")

    # 8. 分号（全角/半角）→ -
    name = name.replace("；", "-").replace(";", "-")

    # 9. 感叹号（全角/半角）→ 删除
    name = name.replace("！", "").replace("!", "")

    # 10. 间隔号 → -
    name = name.replace("·", "-")

    # 11. 空格 → _
    name = name.replace(" ", "_")

    # 12. Windows 非法字符 → 删除（/ 不会出现在文件名中，但保险起见处理）
    for ch in ['*', '"', '<', '>', '|', '\\']:
        name = name.replace(ch, "")

    # 13. 压缩连续分隔符
    name = re.sub(r'-{2,}', '-', name)
    name = re.sub(r'_{2,}', '_', name)

    # 14. 去除首尾 - 和 _
    name = name.strip("-_")

    return name


def collect_renames(base_dir: str):
    """遍历目录，返回需要重命名的 (old_path, new_path) 列表。"""
    renames = []
    for root, dirs, files in os.walk(base_dir):
        dirs.sort()
        for filename in sorted(files):
            if not filename.endswith(".md"):
                continue
            stem, ext = os.path.splitext(filename)
            new_stem = sanitize_name(stem)
            if new_stem == stem:
                continue
            old_path = os.path.join(root, filename)
            new_path = os.path.join(root, new_stem + ext)
            renames.append((old_path, new_path))
    return renames


def resolve_conflicts(renames):
    """若目标文件名已存在，在 stem 末尾追加 _N。"""
    seen_targets = set()
    resolved = []
    for old_path, new_path in renames:
        candidate = new_path
        if candidate in seen_targets or (os.path.exists(candidate) and candidate != old_path):
            stem, ext = os.path.splitext(new_path)
            n = 2
            while True:
                candidate = f"{stem}_{n}{ext}"
                if candidate not in seen_targets and not os.path.exists(candidate):
                    break
                n += 1
        seen_targets.add(candidate)
        resolved.append((old_path, candidate))
    return resolved


def write_log(renames, log_file: str):
    lines = [
        "# 文件名重命名记录",
        "",
        f"生成时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        "",
        f"共重命名 **{len(renames)}** 个文件。",
        "",
        "## 命名规则",
        "",
        "| 原字符 | 替换为 | 说明 |",
        "| --- | --- | --- |",
        "| `？` `?` | `Q` | Windows非法，语义保留 |",
        "| `，` | `,` | 全角→半角 |",
        "| `（）` `()` | 删除括号 | 保留括号内内容 |",
        "| `、` | `-` | 顿号无ASCII对应 |",
        "| `：` `:` | `-` | Windows非法 |",
        "| `；` `;` | `-` | 跨平台不友好 |",
        "| `！` `!` | 删除 | 跨平台不友好 |",
        "| `《》【】''\"\"·` | 删除或`-` | 无语义，不友好 |",
        "| 空格 | `_` | 跨平台最常见问题 |",
        "| `*` `\"` `<` `>` `\\|` `\\\\` | 删除 | Windows非法 |",
        "",
        "## 变更明细",
        "",
        "| 原文件名 | 新文件名 | 所在目录 |",
        "| --- | --- | --- |",
    ]
    log_dir = os.path.dirname(log_file)
    for old_path, new_path in renames:
        directory = os.path.relpath(os.path.dirname(old_path), log_dir)
        old_name = os.path.basename(old_path)
        new_name = os.path.basename(new_path)
        lines.append(f"| `{old_name}` | `{new_name}` | `{directory}` |")
    with open(log_file, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def main():
    renames = collect_renames(BASE_DIR)
    if not renames:
        print("没有需要重命名的文件。")
        return

    renames = resolve_conflicts(renames)
    print(f"共发现 {len(renames)} 个文件需要重命名")
    print("预览（前20条）：")
    for old_path, new_path in renames[:20]:
        print(f"  {os.path.basename(old_path)}")
        print(f"  -> {os.path.basename(new_path)}")
        print()

    confirm = input(f"确认对全部 {len(renames)} 个文件执行重命名？(y/N): ").strip().lower()
    if confirm != "y":
        print("已取消。")
        return

    errors = []
    done = []
    for old_path, new_path in renames:
        try:
            os.rename(old_path, new_path)
            done.append((old_path, new_path))
        except Exception as e:
            errors.append((old_path, new_path, str(e)))

    write_log(done, LOG_FILE)
    print(f"\n完成：{len(done)} 个文件已重命名")
    print(f"日志：{LOG_FILE}")
    if errors:
        print(f"失败 {len(errors)} 个：")
        for old, new, err in errors:
            print(f"  {old} -> {new}: {err}")


if __name__ == "__main__":
    main()
