# job-interview-log — 项目规则

## 项目概览

Java 面试知识图谱前端，基于 Vue 3 + TypeScript + Vite 构建。

主要子目录：
- `java-knowledge-frontend/` — 前端应用（本规则主要约束此目录）
- `docs/` — 文档与思维导图
- `GptProject/` — GPT 辅助脚本
- `java8gu/` — Java 8 知识原始数据

---

## 前端架构：Feature-Sliced + Composable-Driven

数据、操作、视图、样式、API、工具函数严格分层，职责单一，禁止跨层直接依赖。

```
src/
├── data/
│   ├── types.ts          # 全局 TS 类型与接口定义
│   ├── knowledgeTree.ts  # 知识树静态数据
│   ├── panorama/         # 全景图数据，按领域切片（jvm.ts / mysql.ts ...）
│   └── content/          # 知识块详细内容，按领域切片
│       ├── index.ts      # 统一导出 & loadBlockContent
│       └── {domain}/     # 领域子目录（jvm/ mysql/ spring/ ...）
├── composables/          # 业务逻辑层（Vue Composable）
│   ├── usePanorama.ts    # 全景图状态 & 操作
│   └── useHighlight.ts   # 代码高亮逻辑
├── components/           # 纯展示组件，无业务状态
│   ├── Sidebar.vue
│   └── ContentViewer.vue
├── style.css             # 全局样式
├── main.ts               # 应用入口
└── App.vue               # 根组件，仅负责组装
```

### 分层规则

**data 层**
- `types.ts` 只放类型/接口，不含逻辑
- `panorama/` 和 `content/` 按领域拆文件，每个领域一个文件
- 新增知识领域时，在对应子目录新建文件，并在 `index.ts` 注册
- data 层不得 import composables 或 components

**composables 层**
- 每个 composable 对应一个独立业务场景，用 `use` 前缀命名
- 只在此层持有响应式状态（`ref` / `reactive`）
- 异步操作（数据加载）放在 composable 中，不放在组件内
- composables 可 import data 层，不得 import components

**components 层**
- 组件只负责渲染，接收 props / emit events
- 业务状态通过 composable 注入，组件内不写 `ref` 业务状态
- 样式写在组件 `<style scoped>` 内，全局样式写 `style.css`

**App.vue**
- 仅做组合：引入 composables，传递给 components
- 不写业务逻辑，不直接操作 data 层

---

## 编码规范

- 语言：TypeScript，禁止 `any`（兼容旧数据的临时转型需注释说明）
- 组件：Vue 3 `<script setup>` 语法
- 命名：组件 PascalCase，composable `useCamelCase`，data 文件 camelCase
- 不引入新的 UI 组件库，保持轻量
- 不做过度抽象，三处重复再提取公共逻辑

## 新增知识领域 checklist

1. `src/data/types.ts` — 确认类型已定义
2. `src/data/panorama/{domain}.ts` — 添加全景图层次数据
3. `src/data/panorama/index.ts` — 注册新领域
4. `src/data/content/{domain}/` — 添加内容文件
5. `src/data/content/index.ts` — 注册加载映射
6. `src/data/knowledgeTree.ts` — 添加知识树节点
