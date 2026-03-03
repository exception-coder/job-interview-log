# App.vue 数据迁移完整指南

## 目标

将 App.vue 第336行开始的 `architectureLayers` computed 中的所有知识图谱数据迁移到新架构。

## 当前状态

### App.vue 中的数据结构

```typescript
const architectureLayers = computed(() => {
  if (panoramaCategory.value.id === 'java-concurrent') {
    return [
      {
        name: '线程基础',
        blocks: [
          {
            id: 'thread-types',
            title: '线程类型',
            subtitle: 'Daemon/User/Virtual',
            description: `...`,  // 大量内容
            code: `...`          // 大量代码
          },
          // ... 更多 blocks
        ]
      },
      // ... 更多 layers
    ]
  }
  return []
})
```

### 新架构目标

```
配置文件 (panorama/javaConcurrent.ts)
└── 只包含元数据和文件引用

内容文件 (content/java-concurrent/*.ts)
└── 每个知识点一个独立文件
```

## 迁移步骤

### 方式一：自动化脚本（推荐）

我已经创建了自动提取脚本，但由于 App.vue 中的数据格式复杂，建议手动迁移以确保准确性。

### 方式二：手动迁移（推荐）

#### 步骤 1：识别所有知识块

从 App.vue 第336行开始，找到所有的 blocks：

**线程基础层**：
- ✅ thread-types (已创建)
- ✅ thread-states (已创建)
- ⏳ thread-creation (待创建)

**同步机制层**：
- ✅ synchronized (已创建)
- ⏳ volatile (待创建)
- ⏳ lock (待创建)

**线程池层**：
- ⏳ executor (待创建)
- ⏳ common-pools (待创建)

**并发工具层**：
- ⏳ atomic (待创建)
- ⏳ concurrent-collections (待创建)
- ⏳ aqs (待创建)

**JMM内存模型层**：
- ⏳ jmm (待创建)
- ⏳ happens-before (待创建)

#### 步骤 2：创建内容文件

对于每个知识块，创建对应的内容文件：

**模板**：

```typescript
// src/data/content/java-concurrent/[block-id].ts
import type { KnowledgeBlockContent } from '../../types'

/**
 * [标题] - 详细内容
 */
export const [blockId]Content: KnowledgeBlockContent = {
  id: '[block-id]',
  title: '[标题]',
  description: `从 App.vue 中复制的 description 或 content 的前半部分`,
  code: `从 App.vue 中复制的 code 或 content 的后半部分`
}
```

**示例：创建 volatile.ts**

1. 从 App.vue 中找到 volatile 的数据：

```typescript
{
  id: 'volatile',
  title: 'volatile',
  subtitle: '可见性/禁止重排序',
  content: `
**volatile关键字**
- 保证可见性和有序性
...

**代码示例：**

public class VolatileDemo {
  ...
}
  `
}
```

2. 拆分 content 为 description 和 code：

```typescript
// src/data/content/java-concurrent/volatile.ts
import type { KnowledgeBlockContent } from '../../types'

export const volatileContent: KnowledgeBlockContent = {
  id: 'volatile',
  title: 'volatile',
  description: `**volatile关键字**
- 保证可见性和有序性
- 不保证原子性
- 禁止指令重排序
- 适用于状态标志、双重检查锁定

**实现原理**
- 内存屏障（Memory Barrier）
- 强制刷新到主内存
- 禁止编译器优化`,
  
  code: `public class VolatileDemo {
    // 1. 状态标志示例（最常见用法）
    private volatile boolean running = true;
    
    public void startTask() {
        new Thread(() -> {
            System.out.println("任务开始执行...");
            while (running) { // volatile保证可见性
                // 执行任务
            }
            System.out.println("任务停止");
        }).start();
    }
    
    public void stopTask() {
        running = false; // 修改立即对其他线程可见
    }
}`
}
```

#### 步骤 3：更新配置文件

在 `panorama/javaConcurrent.ts` 中添加 contentFile 字段：

```typescript
{
  id: 'volatile',
  title: 'volatile',
  subtitle: '可见性/禁止重排序',
  contentFile: 'java-concurrent/volatile'  // 添加这一行
}
```

#### 步骤 4：注册到内容加载器

在 `content/index.ts` 中添加：

```typescript
const contentModules = {
  'java-concurrent/volatile': () => import('./java-concurrent/volatile'),
  // ... 其他
}
```

#### 步骤 5：测试

1. 启动开发服务器：`npm run dev`
2. 点击 Java并发 的"全景"按钮
3. 点击 volatile 知识块
4. 验证内容是否正确显示

## 批量迁移工具

### 使用 Python 脚本

```bash
cd /Users/zhangkai/IdeaProjects/job-interview-log/java-knowledge-frontend
python3 extract-content.py
```

**注意**：脚本可能无法完美处理所有格式，建议手动检查生成的文件。

### 使用 Shell 脚本

```bash
cd /Users/zhangkai/IdeaProjects/job-interview-log/java-knowledge-frontend
./create-content-files.sh
```

## 迁移检查清单

对于每个知识块：

- [ ] 从 App.vue 中复制内容
- [ ] 创建内容文件 `content/java-concurrent/[id].ts`
- [ ] 拆分 description 和 code
- [ ] 导出变量名符合规范（xxxContent）
- [ ] 更新配置文件添加 contentFile
- [ ] 注册到内容加载器
- [ ] 测试加载是否正常
- [ ] 验证代码高亮
- [ ] 检查格式是否正确

## 完成后的清理工作

### 1. 删除 App.vue 中的数据

找到 `architectureLayers` computed，删除 java-concurrent 的数据：

```typescript
const architectureLayers = computed(() => {
  if (!panoramaCategory.value) return []
  
  // 删除这部分 ↓
  // if (panoramaCategory.value.id === 'java-concurrent') {
  //   return [ ... 大量数据 ... ]
  // }
  
  // 改为从配置中获取
  const config = getPanoramaConfig(panoramaCategory.value.id)
  return config?.layers || []
})
```

### 2. 更新 App.vue 导入

```typescript
import { usePanorama } from './composables/usePanorama'
import { useHighlight } from './composables/useHighlight'

// 使用组合式函数
const { 
  architectureLayers,  // 这个已经从 usePanorama 中获取
  // ...
} = usePanorama()
```

### 3. 替换 App.vue

```bash
# 备份已完成
mv App.vue App.vue.old
mv App_refactored.vue App.vue
```

## 预期效果

### 迁移前

```
App.vue: 3666 行
└── 包含所有数据
```

### 迁移后

```
App.vue: 250 行
└── 只有视图逻辑

panorama/javaConcurrent.ts: 98 行
└── 只有配置

content/java-concurrent/
├── thread-types.ts: 68 行
├── thread-states.ts: 50 行
├── synchronized.ts: 50 行
├── volatile.ts: 50 行
├── lock.ts: 50 行
├── executor.ts: 50 行
├── common-pools.ts: 50 行
├── atomic.ts: 50 行
├── concurrent-collections.ts: 50 行
├── aqs.ts: 50 行
├── jmm.ts: 50 行
└── happens-before.ts: 50 行
```

## 常见问题

### Q: content 字段如何拆分？

A: 查找 `**代码示例：**` 标记：
- 标记前的内容 → description
- 标记后的内容 → code

### Q: 有些块只有 description 和 code，怎么办？

A: 直接使用，无需拆分：

```typescript
{
  id: 'xxx',
  title: 'xxx',
  description: `...`,  // 直接复制
  code: `...`          // 直接复制
}
```

### Q: 迁移后如何验证？

A: 
1. 检查文件是否创建
2. 启动开发服务器
3. 点击全景按钮
4. 逐个点击知识块验证

### Q: 发现内容有误怎么办？

A: 直接修改对应的内容文件，无需重启服务器（热更新）。

## 进度追踪

创建一个进度文件 `migration-progress.md`：

```markdown
# Java并发知识点迁移进度

## 线程基础 (3/3)
- [x] thread-types
- [x] thread-states  
- [x] thread-creation

## 同步机制 (1/3)
- [x] synchronized
- [ ] volatile
- [ ] lock

## 线程池 (0/2)
- [ ] executor
- [ ] common-pools

## 并发工具 (0/3)
- [ ] atomic
- [ ] concurrent-collections
- [ ] aqs

## JMM内存模型 (0/2)
- [ ] jmm
- [ ] happens-before

总进度: 4/13 (30.8%)
```

---

**开始迁移时间**：2026-02-27  
**预计完成时间**：根据进度而定  
**负责人**：开发团队

