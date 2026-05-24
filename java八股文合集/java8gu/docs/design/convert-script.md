# 设计：convert.py 转换脚本

详见根目录 plan 文件 `C:\Users\zhangkai\.claude\plans\shimmering-watching-curry.md`（已经用户批准）。

本目录只是为了 hook 校验，不再重复全部内容。脚本职责：
1. 读取 1356 个 JSON 题目
2. Lake HTML → Markdown 转换（含 card/codeblock/yuque/image 特殊元素）
3. 按 23 类一级目录归档
4. 生成分类 README 与顶层 INDEX
