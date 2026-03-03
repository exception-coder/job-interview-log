# Java 知识库前端 - 架构说明

## 项目概述

这是一个基于 Vue 3 + TypeScript 的 Java 知识库前端项目，采用现代化的架构设计，实现了数据与视图的完全分离。

## 架构设计

### 核心原则

1. **职责单一**：每个模块只负责一件事
2. **关注点分离**：数据、逻辑、视图完全分离
3. **易于维护**：清晰的目录结构，便于定位和修改
4. **高可扩展**：添加新功能无需修改现有代码
5. **类型安全**：完整的 TypeScript 类型定义

### 目录结构

```
src/
├── data/                    # 数据层（纯数据，无逻辑）
│   ├── types.ts            # TypeScript 类型定义
│   ├── knowledgeTree.ts    # 知识清单数据
│   └── panorama/           # 知识图谱数据
│       ├── index.ts        # 统一导出和查询接口
│       ├── javaConcurrent.ts    # Java并发架构数据
│       ├── collections.ts       # 集合类架构数据
│       ├── jvm.ts              # JVM架构数据
│       └── ...                 # 其他板块数据
│
├── composables/            # 业务逻辑层（可复用逻辑）
│   ├── usePanorama.ts     # 知识图谱业务逻辑
│   └── useHighlight.ts    # 代码高亮逻辑
│
├── components/             # 视图层（纯展示组件）
│   ├── Sidebar.vue
│   └── ContentViewer.vue
│
└── App.vue                 # 主应用（布局和路由）
```

### 架构分层

#### 1. 数据层 (data/)

**职责**：存储纯数据，不包含任何业务逻辑

**文件说明**：
- `types.ts`：定义数据结构的 TypeScript 接口
- `knowledgeTree.ts`：知识分类和清单数据
- `panorama/`：各个知识板块的详细架构数据

**示例**：
```typescript
// types.ts
export interface KnowledgeBlock {
  id: string
  title: string
  subtitle: string
  description?: string
  code?: string
}

// panorama/javaConcurrent.ts
export const javaConcurrentPanorama: PanoramaConfig = {
  categoryId: 'java-concurrent',
  layers: [...]
}
```

#### 2. 业务逻辑层 (composables/)

**职责**：封装可复用的业务逻辑，使用 Vue 3 Composition API

**文件说明**：
- `usePanorama.ts`：管理知识图谱的状态和交互逻辑
- `useHighlight.ts`：封装代码高亮功能

**优势**：
- 逻辑复用：可在多个组件中使用
- 易于测试：可独立进行单元测试
- 关注点分离：业务逻辑与视图解耦

**示例**：
```typescript
// 在组件中使用
const { 
  showPanorama, 
  architectureLayers,
  showPanoramaView,
  closePanorama 
} = usePanorama()
```

#### 3. 视图层 (components/ & App.vue)

**职责**：纯展示，通过 props 接收数据，通过事件通知父组件

**特点**：
- 不包含业务逻辑
- 不直接操作数据
- 专注于 UI 展示和用户交互

## 数据查询接口

### panorama/index.ts

提供统一的数据查询接口：

```typescript
// 根据分类ID获取知识图谱配置
getPanoramaConfig(categoryId: string): PanoramaConfig | null

// 获取所有支持知识图谱的分类ID列表
getSupportedPanoramaCategories(): string[]

// 检查某个分类是否支持知识图谱
hasPanoramaSupport(categoryId: string): boolean
```

**使用示例**：
```typescript
import { getPanoramaConfig } from '@/data/panorama'

const config = getPanoramaConfig('java-concurrent')
if (config) {
  // 使用配置数据
}
```

## 组合式函数

### usePanorama()

管理知识图谱的所有状态和逻辑。

**返回值**：
```typescript
{
  // 状态
  panoramaCategory: Ref<KnowledgeNode | null>
  showPanorama: Ref<boolean>
  selectedKnowledge: Ref<any>
  showKnowledgeModal: Ref<boolean>
  architectureLayers: ComputedRef<ArchitectureLayer[]>
  
  // 方法
  showPanoramaView: (category: KnowledgeNode) => void
  closePanorama: () => void
  openKnowledgeDetail: (block: any) => void
  closeKnowledgeModal: () => void
}
```

### useHighlight()

封装代码高亮逻辑。

**返回值**：
```typescript
{
  highlightCode: (code: string) => string
}
```

## 添加新的知识板块

### 步骤 1：创建数据文件

在 `src/data/panorama/` 下创建新文件，例如 `collections.ts`：

```typescript
import type { PanoramaConfig } from '../types'

export const collectionsPanorama: PanoramaConfig = {
  categoryId: 'collections',
  layers: [
    {
      name: '层次名称',
      blocks: [
        {
          id: 'block-id',
          title: '知识块标题',
          subtitle: '副标题',
          description: '知识讲解内容',
          code: '代码示例'
        }
      ]
    }
  ]
}
```

### 步骤 2：注册到索引

在 `src/data/panorama/index.ts` 中：

```typescript
import { collectionsPanorama } from './collections'

const panoramaMap: Record<string, PanoramaConfig> = {
  'java-concurrent': javaConcurrentPanorama,
  'collections': collectionsPanorama,  // 新增
}
```

### 步骤 3：测试验证

启动开发服务器，点击对应分类的"全景"按钮，验证显示是否正确。

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 类型检查

```bash
npm run type-check
```

## 技术栈

- **Vue 3**：渐进式 JavaScript 框架
- **TypeScript**：类型安全的 JavaScript 超集
- **Vite**：下一代前端构建工具
- **Markdown-it**：Markdown 渲染库

## 设计模式

### 1. 策略模式

通过 `panoramaMap` 实现不同板块的数据策略：

```typescript
const panoramaMap: Record<string, PanoramaConfig> = {
  'java-concurrent': javaConcurrentPanorama,
  'collections': collectionsPanorama,
}
```

### 2. 组合模式

使用 Composition API 组合不同的业务逻辑：

```typescript
const panorama = usePanorama()
const highlight = useHighlight()
```

### 3. 工厂模式

`getPanoramaConfig` 作为工厂方法，根据 ID 返回对应的配置。

## 最佳实践

### 1. 数据定义

- 使用 TypeScript 接口定义数据结构
- 数据文件只包含数据，不包含逻辑
- 使用有意义的命名

### 2. 业务逻辑

- 封装为组合式函数
- 保持函数职责单一
- 提供清晰的接口

### 3. 视图组件

- 保持组件简洁
- 通过 props 接收数据
- 通过 emit 通知父组件
- 避免在组件中直接操作数据

### 4. 代码风格

- 使用 ESLint 和 Prettier
- 遵循 Vue 3 风格指南
- 添加必要的注释

## 性能优化

### 1. 懒加载

知识图谱数据支持按需加载：

```typescript
// 只在需要时导入
const config = getPanoramaConfig(categoryId)
```

### 2. 计算属性缓存

使用 `computed` 缓存计算结果：

```typescript
const architectureLayers = computed(() => {
  // 只在依赖变化时重新计算
})
```

### 3. 虚拟滚动

对于长列表，可以使用虚拟滚动优化性能。

## 测试

### 单元测试

```bash
npm run test:unit
```

### 测试覆盖率

```bash
npm run test:coverage
```

## 文档

- [架构重构文档](./docs/architecture-refactoring.md)
- [数据迁移指南](./docs/migration-guide.md)
- [开发日志](./docs/dev-log.md)

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

---

**维护者**：开发团队  
**最后更新**：2026-02-27
