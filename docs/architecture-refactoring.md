# 架构重构日志

## 2025-02-27 - 知识库前端架构重构

### 重构目标
将数据与视图分离，实现职责单一、模块清晰的架构设计。

### 问题分析
**原架构问题：**
1. **数据与视图耦合**：App.vue 包含 3666 行代码，其中大量是知识图谱数据
2. **职责不单一**：knowledgeTree.ts 只有知识清单，但详细架构数据却在 App.vue 中
3. **可维护性差**：数据和视图混在一起，难以独立维护和测试
4. **扩展性差**：添加新的知识板块需要修改 App.vue

### 重构方案

#### 新的目录结构
```
src/
├── data/                    # 数据层（纯数据）
│   ├── types.ts            # 类型定义
│   ├── knowledgeTree.ts    # 知识清单
│   └── panorama/           # 知识图谱数据
│       ├── index.ts        # 统一导出和查询接口
│       ├── javaConcurrent.ts    # Java并发架构数据
│       ├── collections.ts       # 集合类架构数据（待添加）
│       ├── jvm.ts              # JVM架构数据（待添加）
│       └── ...                 # 其他板块
├── composables/            # 组合式函数（业务逻辑）
│   ├── usePanorama.ts     # 知识图谱业务逻辑
│   └── useHighlight.ts    # 代码高亮逻辑
├── components/             # 视图层（纯展示）
│   ├── Sidebar.vue
│   └── ContentViewer.vue
└── App.vue                 # 主应用（仅布局和路由）
```

#### 架构分层

**1. 数据层 (data/)**
- **职责**：存储纯数据，不包含任何业务逻辑
- **文件**：
  - `types.ts`：定义数据类型接口
  - `knowledgeTree.ts`：知识清单数据
  - `panorama/`：各板块的知识图谱数据

**2. 业务逻辑层 (composables/)**
- **职责**：封装可复用的业务逻辑
- **文件**：
  - `usePanorama.ts`：知识图谱相关逻辑（显示/隐藏、数据获取）
  - `useHighlight.ts`：代码高亮逻辑

**3. 视图层 (components/ & App.vue)**
- **职责**：纯展示，通过 props 接收数据
- **特点**：不包含业务逻辑和数据

### 关键设计决策

#### 1. 数据查询接口设计
在 `panorama/index.ts` 中提供统一的数据查询接口：
```typescript
// 根据分类ID获取知识图谱配置
getPanoramaConfig(categoryId: string): PanoramaConfig | null

// 获取所有支持知识图谱的分类ID列表
getSupportedPanoramaCategories(): string[]

// 检查某个分类是否支持知识图谱
hasPanoramaSupport(categoryId: string): boolean
```

**优势**：
- 数据访问统一，易于维护
- 支持懒加载和按需导入
- 便于后续扩展（如从 API 加载）

#### 2. 组合式函数设计
使用 Vue 3 的 Composition API 封装业务逻辑：

**usePanorama.ts**：
- 管理全景视图的状态
- 提供显示/隐藏全景的方法
- 处理知识块详情的展示逻辑

**useHighlight.ts**：
- 封装代码高亮逻辑
- 可独立测试和复用

**优势**：
- 逻辑复用性强
- 易于单元测试
- 关注点分离

#### 3. 类型定义
在 `types.ts` 中定义清晰的类型接口：
```typescript
interface KnowledgeBlock {
  id: string
  title: string
  subtitle: string
  description?: string
  content?: string
  code?: string
}

interface ArchitectureLayer {
  name: string
  blocks: KnowledgeBlock[]
}

interface PanoramaConfig {
  categoryId: string
  layers: ArchitectureLayer[]
}
```

**优势**：
- 类型安全
- IDE 智能提示
- 便于重构

### 重构后的优势

1. **职责单一**：每个文件只负责一件事
   - 数据文件只包含数据
   - 组合式函数只包含业务逻辑
   - 视图组件只负责展示

2. **易于维护**：
   - 添加新的知识板块：只需在 `panorama/` 下新增文件
   - 修改业务逻辑：只需修改对应的 composable
   - 调整样式：只需修改视图组件

3. **可测试性强**：
   - 数据层可以独立验证
   - 业务逻辑可以单元测试
   - 视图组件可以快照测试

4. **扩展性好**：
   - 支持按需加载知识图谱数据
   - 可以轻松切换数据源（本地 → API）
   - 便于添加新功能

### 迁移指南

#### 从原 App.vue 迁移数据到新架构

1. **提取知识图谱数据**：
   - 找到 `architectureLayers` computed 中的数据
   - 按分类创建对应的文件（如 `javaConcurrent.ts`）
   - 将数据复制到新文件中

2. **更新 App.vue**：
   - 删除数据定义
   - 导入 composables
   - 使用组合式函数提供的状态和方法

3. **测试验证**：
   - 确保全景视图正常显示
   - 确保知识块详情正常打开
   - 确保代码高亮正常工作

### 后续优化建议

1. **数据迁移**：
   - 将原 App.vue 中的其他板块数据逐步迁移到 `panorama/` 目录
   - 每迁移一个板块，进行测试验证

2. **组件拆分**：
   - 将全景视图提取为独立组件 `PanoramaView.vue`
   - 将知识块模态框提取为独立组件 `KnowledgeModal.vue`

3. **性能优化**：
   - 实现知识图谱数据的懒加载
   - 使用虚拟滚动优化长列表

4. **功能增强**：
   - 添加知识图谱的搜索功能
   - 支持知识块之间的关联跳转
   - 添加学习进度追踪

### 文件清单

**新增文件**：
- `src/data/types.ts` - 类型定义
- `src/data/panorama/index.ts` - 数据查询接口
- `src/data/panorama/javaConcurrent.ts` - Java并发数据
- `src/composables/usePanorama.ts` - 全景视图逻辑
- `src/composables/useHighlight.ts` - 代码高亮逻辑
- `src/App_refactored.vue` - 重构后的主应用

**备份文件**：
- `src/App.vue.backup` - 原始 App.vue 备份

### 设计原则总结

1. **单一职责原则 (SRP)**：每个模块只负责一个功能
2. **开闭原则 (OCP)**：对扩展开放，对修改关闭
3. **依赖倒置原则 (DIP)**：依赖抽象而非具体实现
4. **关注点分离 (SoC)**：数据、逻辑、视图分离
5. **DRY 原则**：不重复自己，逻辑复用

---

**重构完成时间**：2025-02-27  
**重构人员**：AI Assistant  
**代码审查**：待进行

