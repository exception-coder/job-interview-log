总结标题：mysql_small_table_drives_big_table

---

## 1）10 行极简速记版（纯文本）

✔ MySQL join 默认是 Nested Loop，本质是双层循环
🔥 小表驱动大表 = 减少外层循环次数
📌 外层越小，整体执行次数越低
🧠 有索引时内层查询复杂度降为 O(log n)
📈 小表驱动大表：O(small) * O(log big)
✘ 大表驱动小表：O(big) * O(log small) → 成本高
🚀 优化器会优先选小结果集表做驱动表
🔍 选择性高的索引也可影响驱动表选择
✨ “小”指扫描结果集小，不一定是物理行数少
⚠️ 无索引时等价于全表嵌套循环，性能灾难

---

## 2）折叠式知识卡片版（Markdown）

<details>
<summary>定义</summary>

文档介绍了 MySQL 在执行 JOIN 时为何采用“小表驱动大表”的策略：Nested Loop Join 的外层循环越小，内层查找总次数越少；配合索引，整体复杂度能从笛卡尔积降到 O(n * log m)，因此小表作为驱动表能显著提升性能。

</details>

<details>
<summary>原理</summary>

* **MySQL 的 JOIN 主要是 Nested Loop Join**：

    * 外层表（驱动表）逐行迭代；
    * 每一行到内层表（被驱动表）根据连接条件查询匹配记录。

* **成本模型**：

    * 无索引：O(N * M)（笛卡尔积过滤）
    * 有索引：O(N) * O(log M)
    * 因此 N 尽可能小（小表做驱动表），成本显著降低。

* **大小的判断**：

    * 优化器根据统计信息选择“预期扫描行数更少”的表作为驱动表，未必是物理行数最少。

</details>

<details>
<summary>关键点</summary>

* 外层循环越小，循环次数越低，是性能关键点。
* 索引让被驱动表查找成本从全扫描降到 O(log n)。
* 小表驱动大表 = 全局成本最低。
* 优化器通过基数（Cardinality）和过滤率估算驱动表。
* 对 join 条件列建立索引是必要前提。
* 无索引时，无论谁驱动谁都很慢，但小表驱动仍稍优。

</details>

<details>
<summary>扩展知识</summary>

* Hash Join 在 MySQL 8.0 适用范围有限，因此 Nested Loop 仍是主流。
* 使用复合索引可进一步减少被驱动表的扫描范围。
* 可以通过 STRAIGHT_JOIN 强制指定驱动表（调优时常用）。
* 关联条件不走索引可能导致驱动策略失效。
* 统计信息不准时可能选错驱动表，需手动分析执行计划。

</details>

---

## 3）面试官追问（Q&A）

**问：MySQL 为什么默认使用 Nested Loop 而不是 Hash Join？**
答：InnoDB 的行格式与 Buffer Pool 结构更适合随机访问索引记录；且 Hash Join 内存开销大，在 MySQL 体系下不如 Nested Loop 稳定。

**问：如何判断哪张表被选为驱动表？**
答：看 EXPLAIN 中 id 值最小的表，通常是行数更少、过滤率更高、基数更小的那个。

**问：物理行数少就一定是小表吗？**
答：不一定。优化器依据预估“需要访问的行数”，与 where 条件过滤、索引选择性强相关。

**问：为什么被驱动表必须有索引？**
答：否则内层循环会退化为全表扫描，使得复杂度回到 O(N*M)，性能极差。

**问：如何强制小表驱动大表？**
答：使用 STRAIGHT_JOIN；或通过调整 where 条件、索引、统计信息影响优化器选择。

**问：连接顺序影响性能的根本原因是什么？**
答：外层表决定了循环次数，循环次数直接影响对被驱动表的访问次数。

**问：过滤率对驱动表选择有什么影响？**
答：高过滤率意味着扫描行数少，更可能被选为驱动表。

---

## 4）示意图（ASCII）

```
Nested Loop Join 结构

驱动表（外层）
for each row in SmallTable:       ← 小表更优
    被驱动表（内层）
    index_lookup(BigTable, key)   ← O(log N)
    output result

复杂度：
小表驱动大表：O(small * log(big))
大表驱动小表：O(big * log(small))
```