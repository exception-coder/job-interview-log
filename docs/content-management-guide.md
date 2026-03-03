# 内容文件管理指南

## 新架构设计

### 核心理念
**知识图谱配置与详细内容完全分离**

- **配置文件**：只包含结构和元数据（标题、副标题、文件路径）
- **内容文件**：独立维护每个知识点的详细内容（知识讲解 + 代码示例）

### 目录结构

```
src/data/
├── types.ts                    # 类型定义
├── panorama/                   # 知识图谱配置（结构）
│   ├── index.ts               # 查询接口
│   ├── javaConcurrent.ts      # Java并发配置
│   └── ...                    # 其他板块配置
│
└── content/                    # 知识点详细内容
    ├── index.ts               # 内容加载器
    ├── java-concurrent/       # Java并发内容
    │   ├── thread-types.ts
    │   ├── thread-states.ts
    │   ├── synchronized.ts
    │   └── ...
    ├── collections/           # 集合类内容
    └── ...                    # 其他板块内容
```

## 工作流程

### 1. 添加新知识点（3步）

#### 步骤 1：在配置文件中添加元数据

```typescript
// src/data/panorama/javaConcurrent.ts
export const javaConcurrentPanorama: PanoramaConfig = {
  categoryId: 'java-concurrent',
  layers: [
    {
      name: '同步机制',
      blocks: [
        {
          id: 'volatile',
          title: 'volatile',
          subtitle: '可见性/禁止重排序',
          contentFile: 'java-concurrent/volatile.ts'  // 指向内容文件
        }
      ]
    }
  ]
}
```

#### 步骤 2：创建内容文件

```typescript
// src/data/content/java-concurrent/volatile.ts
import type { KnowledgeBlockContent } from '../../types'

export const volatileContent: KnowledgeBlockContent = {
  id: 'volatile',
  title: 'volatile',
  description: `**volatile关键字**
- 保证可见性和有序性
- 不保证原子性
- 禁止指令重排序`,
  
  code: `public class VolatileDemo {
    private volatile boolean running = true;
    
    public void stop() {
        running = false;
    }
}`
}
```

#### 步骤 3：注册到内容加载器

```typescript
// src/data/content/index.ts
const contentModules: Record<string, () => Promise<any>> = {
  'java-concurrent/volatile': () => import('./java-concurrent/volatile'),
  // ... 其他内容文件
}
```

### 2. 修改现有知识点

只需修改对应的内容文件，无需改动配置文件：

```typescript
// src/data/content/java-concurrent/volatile.ts
export const volatileContent: KnowledgeBlockContent = {
  id: 'volatile',
  title: 'volatile',
  description: `更新后的知识讲解...`,  // 修改这里
  code: `更新后的代码示例...`          // 或修改这里
}
```

## 优势对比

### 旧架构 ❌
```typescript
// 配置和内容混在一起
{
  id: 'volatile',
  title: 'volatile',
  subtitle: '可见性/禁止重排序',
  description: `很长的知识讲解内容...`,  // 混在配置中
  code: `很长的代码示例...`            // 混在配置中
}
```

**问题**：
- 配置文件过大（数千行）
- 修改内容需要编辑大文件
- 难以维护和查找
- 无法按需加载

### 新架构 ✅

**配置文件**（简洁）：
```typescript
{
  id: 'volatile',
  title: 'volatile',
  subtitle: '可见性/禁止重排序',
  contentFile: 'java-concurrent/volatile.ts'  // 只有引用
}
```

**内容文件**（独立）：
```typescript
export const volatileContent: KnowledgeBlockContent = {
  id: 'volatile',
  title: 'volatile',
  description: `详细的知识讲解...`,
  code: `完整的代码示例...`
}
```

**优势**：
- ✅ 配置文件简洁（几十行）
- ✅ 内容独立维护
- ✅ 易于查找和修改
- ✅ 支持按需加载
- ✅ 更好的代码组织

## 内容文件模板

### 标准模板

```typescript
import type { KnowledgeBlockContent } from '../../types'

/**
 * [知识点名称] - 详细内容
 */
export const [知识点ID]Content: KnowledgeBlockContent = {
  id: '[知识点ID]',
  title: '[知识点标题]',
  
  description: `**核心概念**
- 要点1
- 要点2
- 要点3

**使用场景**
- 场景1
- 场景2`,
  
  code: `// 代码示例
public class Example {
    public void demo() {
        // 实现代码
    }
}`
}
```

### 复杂示例模板

```typescript
import type { KnowledgeBlockContent } from '../../types'

export const complexContent: KnowledgeBlockContent = {
  id: 'complex-topic',
  title: '复杂主题',
  
  description: `**第一部分：基础概念**
- 概念1
- 概念2

**第二部分：实现原理**
- 原理1
- 原理2

**第三部分：最佳实践**
- 实践1
- 实践2

**第四部分：常见问题**
- 问题1及解决方案
- 问题2及解决方案`,
  
  code: `// 示例1：基础用法
public class BasicExample {
    // 代码...
}

// 示例2：高级用法
public class AdvancedExample {
    // 代码...
}

// 示例3：完整示例
public class CompleteExample {
    public static void main(String[] args) {
        // 完整的可运行示例
    }
}`
}
```

## 内容编写规范

### 知识讲解 (description)

1. **使用 Markdown 格式**
   - 使用 `**粗体**` 标记重点
   - 使用 `-` 列表组织要点
   - 使用空行分隔段落

2. **结构化组织**
   ```
   **核心概念**
   - 简洁的要点说明
   
   **实现原理**
   - 原理说明
   
   **使用场景**
   - 适用场景
   
   **注意事项**
   - 需要注意的点
   ```

3. **保持简洁**
   - 每个要点一行
   - 避免过长的段落
   - 突出关键信息

### 代码示例 (code)

1. **完整可运行**
   - 提供完整的类定义
   - 包含必要的导入语句
   - 确保代码可以直接运行

2. **添加注释**
   - 关键代码添加注释
   - 说明代码的作用
   - 标注重要的知识点

3. **多个示例**
   ```java
   // 示例1：基础用法
   // 代码...
   
   // 示例2：进阶用法
   // 代码...
   
   // 示例3：实际应用
   // 代码...
   ```

## 批量迁移

### 从旧格式迁移

如果已有内联的内容数据，可以批量提取：

```bash
# 1. 创建内容目录
mkdir -p src/data/content/java-concurrent

# 2. 提取每个知识点的内容
# （需要手动或编写脚本）

# 3. 更新配置文件，添加 contentFile 字段

# 4. 注册到内容加载器
```

### 迁移检查清单

- [ ] 内容文件已创建
- [ ] 导出的变量名符合规范（xxxContent）
- [ ] 配置文件已更新（添加 contentFile）
- [ ] 已注册到内容加载器
- [ ] 测试加载是否正常
- [ ] 代码高亮显示正常

## 性能优化

### 按需加载

内容文件只在用户点击知识块时才加载：

```typescript
// 用户点击 -> 动态加载内容
const content = await loadBlockContent('java-concurrent/volatile.ts')
```

**优势**：
- 减少初始加载时间
- 降低内存占用
- 提升用户体验

### 预加载

可以预加载常用内容：

```typescript
// 预加载热门知识点
preloadContents([
  'java-concurrent/synchronized.ts',
  'java-concurrent/volatile.ts',
  'java-concurrent/lock.ts'
])
```

## 常见问题

### Q: 如何处理没有代码示例的知识点？

A: 提供简短的说明：
```typescript
code: `// 此知识点主要是理论概念，无需代码示例`
```

### Q: 内容文件可以有多大？

A: 建议单个文件不超过 500 行。如果内容过多，考虑拆分成多个知识点。

### Q: 如何组织复杂的代码示例？

A: 使用注释分隔不同的示例：
```java
// ========== 示例1：基础用法 ==========
// 代码...

// ========== 示例2：高级用法 ==========
// 代码...
```

### Q: 修改内容后需要重启服务器吗？

A: 开发模式下，Vite 会自动热更新，无需重启。

## 最佳实践

1. **一个知识点一个文件** - 便于维护和查找
2. **统一命名规范** - 使用 kebab-case 命名文件
3. **添加详细注释** - 说明知识点的核心内容
4. **保持内容更新** - 定期review和更新内容
5. **代码可运行** - 确保示例代码可以直接运行
6. **结构化组织** - 使用统一的内容结构

---

**维护者**：开发团队  
**最后更新**：2026-02-27

