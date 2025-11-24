总结标题
MySQL_Hash_Join

---

## 1）10 行极简速记版（纯文本）

✔ Hash Join 8.0.18 才加入
🔥 专为等值 join 加速设计
📌 构建阶段：驱动表做哈希表
➤ 探测阶段：被驱动表逐行哈希匹配
🧠 内存决定是否能全量构建 hash 表
⚠️ join_buffer_size 不足会落盘分片
📈 磁盘分片 hash join 通过分区避免内存爆
🚀 只需遍历一次被驱动表
📌 优化 Nested Loop 的高开销场景
✨ 大表 join 性能提升显著

---

## 2）折叠式知识卡片版（Markdown）

<details>
<summary>① 定义</summary>

* **Hash Join**：MySQL 8.0.18 新增的 join 算法，通过哈希匹配优化等值 join。
* **适用场景**：仅适用于 equal-join（例如 `a.id = b.id`），尤其适合大表 join。

</details>

<details>
<summary>② 原理</summary>

**两个阶段：**

1. **构建（Build）**

    * 选择驱动表，将其所有行加载入内存并建立哈希表（受 `join_buffer_size` 限制）。

2. **探测（Probe）**

    * 遍历被驱动表的每一行，通过哈希函数定位匹配 bucket，完成 join。

**优势：**
避免 Nested Loop 的双层循环，只需单层遍历 + 哈希查找。

</details>

<details>
<summary>③ 关键点</summary>

* Hash Join 关键在于 **驱动表必须构建哈希表**。
* 内存不足时启用 **磁盘分区 Hash Join**（分片构建与分片探测）。
* 对每个分区使用相同的哈希算法保证可寻址性。
* Hash Join 不依赖被驱动表索引，对无索引大表 join 提升极明显。
* MySQL 自动选择是否使用 Hash Join（成本模型决定）。

</details>

<details>
<summary>④ 扩展知识</summary>

* **磁盘 Hash Join 流程**：

    1. 先按哈希值对驱动表分区并落盘；
    2. 被驱动表同样分区；
    3. 分区逐次加载到内存构建小哈希表，再对被驱动表同分区进行匹配；
    4. 避免一次性大内存开销。

* Hash Join 与 Nested Loop Join 的优势互补：

    * 前者擅长大表联结
    * 后者在强索引场景中依旧高效

</details>

---

## 3）面试官追问（Q&A）

**问：Hash Join 为什么只适用于等值 join？**
答：哈希函数只对等值匹配有效，无法处理范围条件；范围 join 仍需 Nested Loop 或索引策略。

**问：Hash Join 与 Nested Loop Join 的核心差异是什么？**
答：前者构建一次哈希表并进行单次扫描；后者需要外层循环，每行都触发内层查找。

**问：如何判断是否触发磁盘 Hash Join？**
答：驱动表大小超过 `join_buffer_size` 时，MySQL 会自动对驱动表进行分片落盘。

**问：为何不总是使用 Hash Join？**
答：对于可利用高选择性索引的 join，Nested Loop 可能更快；Hash Join 会有构建开销。

**问：驱动表如何选择？**
答：构建哈希表需要内存，因此 MySQL 会选择较小的表作为驱动表以减少构建成本。

**问：Hash Join 对 JOIN ON 字段是否需要索引？**
答：不依赖索引，但被驱动表没有索引时效果更理想；有索引时 Nested Loop 也可能更快。

**问：Hash Join 会导致排序或范围查询更快吗？**
答：不会；Hash Join 不保证顺序，常导致结果无序，范围查询需要 B+tree 才有优势。

---

## 4）示意图（ASCII）

```
        Hash Join 总体流程

          [ Driving Table ]
                 |
       构建哈希表 (Build Phase)
                 |
            +-----------+
            |  HASH     |
            +-----------+
                   ^
                   |
     遍历 (Probe)  |
                   |
          [ Driven Table ]
```

```
磁盘 Hash Join 分片示意

  驱动表：            被驱动表：
  A1 -> bucket 0     B1 -> bucket 0
  A2 -> bucket 1     B2 -> bucket 1
  A3 -> bucket 2     B3 -> bucket 2

分片写盘 -> 分片加载 -> 局部匹配
```

---

（总结完毕）
