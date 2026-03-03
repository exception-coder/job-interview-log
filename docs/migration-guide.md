# 数据迁移指南

## 目标
将原 App.vue 中的所有知识图谱数据迁移到新的架构中。

## 迁移步骤

### 1. 识别需要迁移的板块

原 App.vue 的 `architectureLayers` computed 中包含多个板块的数据，需要逐个迁移。

已完成：
- ✅ Java并发 (java-concurrent)

待迁移：
- ⏳ 集合类 (collections)
- ⏳ JVM (jvm)
- ⏳ Spring (spring)
- ⏳ SpringCloud (springcloud)
- ⏳ MySQL (mysql)
- ⏳ Redis (redis)
- ⏳ 其他板块...

### 2. 迁移单个板块的步骤

#### 步骤 1: 从 App.vue 中提取数据

1. 打开 `App.vue.backup`
2. 找到 `architectureLayers` computed 函数
3. 定位到对应板块的数据（例如：`if (panoramaCategory.value.id === 'collections')`）
4. 复制整个数据结构

#### 步骤 2: 创建新的数据文件

在 `src/data/panorama/` 目录下创建新文件，命名规则：
- 集合类 → `collections.ts`
- JVM → `jvm.ts`
- Spring → `spring.ts`

#### 步骤 3: 编写数据文件

模板：

```typescript
import type { PanoramaConfig } from '../types'

/**
 * [板块名称]知识图谱数据
 */
export const [板块名称]Panorama: PanoramaConfig = {
  categoryId: '[板块ID]',
  layers: [
    {
      name: '层次名称',
      blocks: [
        {
          id: 'block-id',
          title: '知识块标题',
          subtitle: '副标题',
          description: `知识讲解内容`,
          code: `代码示例`
        }
        // ... 更多知识块
      ]
    }
    // ... 更多层次
  ]
}
```

#### 步骤 4: 注册到索引文件

在 `src/data/panorama/index.ts` 中：

1. 导入新的数据文件：
```typescript
import { collectionsPanorama } from './collections'
```

2. 添加到映射表：
```typescript
const panoramaMap: Record<string, PanoramaConfig> = {
  'java-concurrent': javaConcurrentPanorama,
  'collections': collectionsPanorama,  // 新增
  // ...
}
```

#### 步骤 5: 测试验证

1. 启动开发服务器：`npm run dev`
2. 点击对应的分类卡片
3. 点击"全景"按钮
4. 验证知识图谱是否正确显示
5. 点击知识块，验证详情是否正确显示

### 3. 批量迁移脚本（可选）

如果需要快速迁移，可以编写脚本自动提取数据：

```bash
# 提取所有板块ID
grep -o "panoramaCategory.value.id === '[^']*'" App.vue.backup | \
  sed "s/panoramaCategory.value.id === '//g" | \
  sed "s/'//g" | \
  sort -u
```

### 4. 数据格式说明

#### description vs content

- **description**: 纯文本描述，用于"知识讲解"标签页
- **content**: 包含代码示例的完整内容，会自动拆分
- **code**: 代码示例，用于"代码示例"标签页

如果原数据使用 `content` 字段，`usePanorama.ts` 会自动拆分：
- 查找 `**代码示例：**` 标记
- 标记前的内容作为 description
- 标记后的内容作为 code

建议：新数据直接使用 `description` 和 `code` 分开定义。

### 5. 常见问题

#### Q: 如何处理没有代码示例的知识块？

A: 只提供 `description` 或 `content` 字段，不提供 `code` 字段。系统会自动显示"暂无代码示例"。

#### Q: 如何处理特别长的代码示例？

A: 可以使用模板字符串的多行语法：
```typescript
code: `
// 第一部分
public class Example1 {
  // ...
}

// 第二部分
public class Example2 {
  // ...
}
`
```

#### Q: 迁移后原 App.vue 怎么处理？

A: 
1. 保留 `App.vue.backup` 作为参考
2. 所有数据迁移完成后，可以删除 `App.vue` 中的 `architectureLayers` computed
3. 最终用 `App_refactored.vue` 替换 `App.vue`

### 6. 迁移检查清单

每完成一个板块的迁移，检查以下项目：

- [ ] 数据文件已创建
- [ ] 数据格式符合 `PanoramaConfig` 接口
- [ ] 已在 `index.ts` 中注册
- [ ] 全景视图能正常显示
- [ ] 知识块详情能正常打开
- [ ] 代码高亮正常工作
- [ ] 没有TypeScript类型错误

### 7. 优先级建议

按使用频率和重要性排序：

**高优先级**（核心技术栈）：
1. Java并发 ✅
2. 集合类
3. JVM
4. Spring
5. MySQL

**中优先级**（常用中间件）：
6. Redis
7. SpringCloud
8. MyBatis
9. 分布式

**低优先级**（其他板块）：
10. 其他剩余板块

### 8. 完成后的清理工作

所有板块迁移完成后：

1. 删除 `App.vue` 中的 `architectureLayers` computed
2. 将 `App_refactored.vue` 重命名为 `App.vue`
3. 删除 `App.vue.backup`（或移到归档目录）
4. 运行完整测试
5. 更新文档

### 9. 示例：迁移集合类板块

```typescript
// src/data/panorama/collections.ts
import type { PanoramaConfig } from '../types'

export const collectionsPanorama: PanoramaConfig = {
  categoryId: 'collections',
  layers: [
    {
      name: 'List集合',
      blocks: [
        {
          id: 'arraylist',
          title: 'ArrayList',
          subtitle: '动态数组',
          description: `**ArrayList特点**
- 基于动态数组实现
- 支持随机访问，查询快O(1)
- 插入删除慢O(n)
- 非线程安全`,
          code: `// ArrayList基本使用
List<String> list = new ArrayList<>();
list.add("Java");
list.add("Python");
String first = list.get(0);
list.remove(0);`
        }
        // ... 更多知识块
      ]
    }
    // ... 更多层次
  ]
}
```

然后在 `index.ts` 中注册：
```typescript
import { collectionsPanorama } from './collections'

const panoramaMap: Record<string, PanoramaConfig> = {
  'java-concurrent': javaConcurrentPanorama,
  'collections': collectionsPanorama,
}
```

---

**提示**：建议每迁移完一个板块就提交一次代码，便于回滚和追踪进度。

