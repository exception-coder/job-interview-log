# summarize.py 速记版生成脚本设计

## 目标

把 `java8gu/` 下 1301 道详细面试题转成 80~250 字的速记版，输出到 `java8gu-速记版/` 镜像目录，让人 30 秒内扫完一题抓住所有得分点。

## 输入与输出

| 项 | 路径 |
|---|---|
| 源目录 | `java8gu/` |
| 输出目录 | `java8gu-速记版/`（脚本自动创建，与 `java8gu/` 同级） |
| 处理对象 | 23 个分类下的 1301 道题 .md |
| 原样复制 | 各分类 `README.md`、根 `INDEX.md` |
| 不处理 | `_build/`、`docs/`、`.gitignore` 等非题目内容 |

## 关键设计点

### 1. 模型选择：claude-sonnet-4-6

- 1301 次调用规模，Opus 成本过高、Haiku 4.5 在结构化重写任务上偶尔会丢要点
- Sonnet 4.6 单题预估 input ~1K + output ~300 token → 全量约 \$10

### 2. 提示词策略

System prompt 一次性写死输出结构（标题/元信息/速记/要点），用户消息只塞原文，避免每题都重复输出规范。

### 3. Prompt caching

System prompt 启用 `cache_control: ephemeral`。1301 次调用里，第一次写入缓存后续全部命中，输入 token 成本下降到 1/10。

### 4. 并发与续跑

- `ThreadPoolExecutor` 默认 8 并发，可 `--workers 16` 拉满
- 输出文件已存在 → skip。中断后重新运行不会重复花钱

### 5. 试水流程

正式跑全量前推荐：

```bash
python summarize.py --category 02_JVM --limit 5
```

抽样看一下风格是否符合预期，再决定是否调提示词或全量跑。

## 不做的事

- 不自动 commit 输出。生成后由人 review、手工 `git add`
- 不做内容质量校验。如果某题输出明显跑偏，删掉对应文件重跑即可
- 不维护"速记版 INDEX"。原 INDEX.md 直接复制，链接相对路径在镜像目录里依然成立
