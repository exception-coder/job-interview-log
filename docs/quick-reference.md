# 快速参考

## 目录结构速查

```
src/
├── data/                    # 📦 数据层
│   ├── types.ts            # 类型定义
│   ├── knowledgeTree.ts    # 知识清单
│   └── panorama/           # 知识图谱
│       ├── index.ts        # 查询接口
│       └── *.ts            # 各板块数据
│
├── composables/            # 🔧 业务逻辑层
│   ├── usePanorama.ts     # 全景逻辑
│   └── useHighlight.ts    # 高亮逻辑
│
└── App.vue                 # 🎨 视图层
```

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 类型检查
npm run type-check
```

## 添加新板块（3步）

### 1. 创建数据文件
```typescript
// src/data/panorama/collections.ts
import type { PanoramaConfig } from '../types'

export const collectionsPanorama: PanoramaConfig = {
  categoryId: 'collections',
  layers: [
    {
      name: '层次名称',
      blocks: [
        {
          id: 'block-id',
          title: '标题',
          subtitle: '副标题',
          description: '描述',
          code: '代码'
        }
      ]
    }
  ]
}
```

### 2. 注册到索引
```typescript
// src/data/panorama/index.ts
import { collectionsPanorama } from './collections'

const panoramaMap = {
  'collections': collectionsPanorama,
}
```

### 3. 测试验证
- 启动 `npm run dev`
- 点击"全景"按钮
- 验证显示

## 数据查询 API

```typescript
import { getPanoramaConfig } from '@/data/panorama'

// 获取配置
const config = getPanoramaConfig('java-concurrent')

// 检查支持
const supported = hasPanoramaSupport('collections')

// 获取所有支持的分类
const categories = getSupportedPanoramaCategories()
```

## 组合式函数使用

```vue
<script setup lang="ts">
import { usePanorama } from '@/composables/usePanorama'
import { useHighlight } from '@/composables/useHighlight'

// 全景视图
const { 
  showPanorama,           // 是否显示
  architectureLayers,     // 架构数据
  showPanoramaView,       // 显示方法
  closePanorama           // 关闭方法
} = usePanorama()

// 代码高亮
const { highlightCode } = useHighlight()
</script>
```

## 类型定义

```typescript
// 知识块
interface KnowledgeBlock {
  id: string
  title: string
  subtitle: string
  description?: string
  content?: string
  code?: string
}

// 架构层次
interface ArchitectureLayer {
  name: string
  blocks: KnowledgeBlock[]
}

// 全景配置
interface PanoramaConfig {
  categoryId: string
  layers: ArchitectureLayer[]
}
```

## 文件命名规范

| 类型 | 命名规则 | 示例 |
|------|---------|------|
| 数据文件 | camelCase.ts | `javaConcurrent.ts` |
| 组合式函数 | use*.ts | `usePanorama.ts` |
| 组件 | PascalCase.vue | `PanoramaView.vue` |
| 类型文件 | types.ts | `types.ts` |

## 常见问题

### Q: 如何处理没有代码示例的知识块？
A: 只提供 `description` 字段，不提供 `code` 字段

### Q: 如何处理长代码？
A: 使用模板字符串多行语法
```typescript
code: `
// 第一部分
...

// 第二部分
...
`
```

### Q: 如何调试？
A: 使用 Vue DevTools 查看组件状态

## 设计原则记忆口诀

- **S**ingle Responsibility - 单一职责
- **O**pen/Closed - 开闭原则
- **L**iskov Substitution - 里氏替换
- **I**nterface Segregation - 接口隔离
- **D**ependency Inversion - 依赖倒置

## 重要文档

- 📖 [架构重构文档](./architecture-refactoring.md)
- 📋 [数据迁移指南](./migration-guide.md)
- 📝 [开发日志](./dev-log.md)
- 📊 [重构总结](./refactoring-summary.md)
- 📘 [项目 README](../java-knowledge-frontend/README.md)

## 联系方式

遇到问题？查看文档或联系开发团队。

---

**最后更新**：2026-02-27

