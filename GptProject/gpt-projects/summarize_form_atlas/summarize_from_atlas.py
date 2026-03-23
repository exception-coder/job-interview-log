from openai import OpenAI

client = OpenAI()

def load_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def build_prompt(content):
    rules = load_file("prompts/summary_rules.md")
    format_template = load_file("prompts/formats/4_sections.md")

    return f"""
你现在要总结我当前 Atlas 页面正在查看的 Markdown 文档。

# 总结规则
{rules}

# 输出格式
{format_template}

# 文档内容
{content}
"""

def summarize(content):
    prompt = build_prompt(content)
    res = client.chat.completions.create(
        model="gpt-5.1",
        messages=[{"role": "user", "content": prompt}]
    )
    return res.choices[0].message["content"]


if __name__ == "__main__":
    # Atlas 会把当前页面内容作为 context 传给模型
    content = "请总结当前页面内容"  # AI 会自动读取当前页面
    print(summarize(content))