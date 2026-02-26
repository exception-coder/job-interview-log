# Markdown Summary Project（工程化版本）

这是一个面向技术文档的 **工程化 Markdown 总结项目**，可自动从 Atlas 中读取当前页面内容，并根据可维护的 Prompt 模块进行总结。

目标是以可扩展、可长期维护的方式生成高质量总结，包括：
- 极简速记版
- 知识卡片
- 面试官追问（Q&A）
- ASCII 示意图

---

## 📁 项目结构

```
md-summary-project/
│
├── prompts/                     # 所有 Prompt 规则与模板
│   ├── summary_rules.md         # 主规则文件（最常修改）
│   ├── styles/
│   │    └── interview_rules.md  # 面试 Q&A 专属规则
│   └── formats/
│        └── 4_sections.md       # 4 大固定输出格式模板
│
├── summarize_from_atlas.py      # 主入口：读取 Atlas 页面并生成总结
│
└── README.md
```

---

## 🚀 使用方法

### 1. 打开你需要总结的 Atlas 文档
无需复制粘贴，无需上传文件。

### 2. 在项目中打开 summarize_from_atlas.py
点击 “Run”。

### 3. 生成的总结将在输出窗口显示
内容包含 4 大块结构化总结（可直接用于学习与面试准备）。

---

## 🛠 如何维护/扩展规则？

你只需要修改下面几个文件：

### 1）修改总结风格
编辑：
```
prompts/summary_rules.md
```

### 2）修改输出格式
编辑：
```
prompts/formats/4_sections.md
```

### 3）修改面试官追问的规则
编辑：
```
prompts/styles/interview_rules.md
```

### 4）添加新的总结模式（可选）
例如你要增加：

- “教学模式总结”
- “深度解释”
- “关键词抽取”
- “反向提问生成”

直接在 prompts 下增加文件即可（不用改 summarize_from_atlas.py）。

---

## 📌 注意
- summarize_from_atlas.py **永远不需要改**
- 你所有对总结规则的调整都在 prompts 下进行
- 这样可以保持项目长期可用，避免脚本混乱

---

## 🧩 常见扩展（建议）

你可以新增以下模板：

- prompts/formats/teaching_style.md
- prompts/styles/diff_rules.md
- prompts/styles/architecture_rules.md

只要扩展文件，系统即可读到。

---

## 📞 支持
如果你需要扩展为：
- 批量总结多个文档
- 自动生成 PDF
- 接入你自己的监控/自动化系统
- 按主题自动分类总结

可以继续告诉我，我会直接给你工程增强版。