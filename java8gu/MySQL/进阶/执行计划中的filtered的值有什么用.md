explain_filtered_field

（1）10 行极简速记版
✔ filtered=索引扫描后剩余行的“预估百分比”
📌 rows×filtered≈真正参与下一步的行数
🔥 单表查询几乎没参考价值
⚠️ filtered 大不代表索引好，小也不代表索引差
🧠 filtered 描述的是“索引之后的 WHERE 剩余量”
➤ 优化应关注 type/key/extra 而非 filtered
🚀 多表 join 中，filtered 才是关键参考
📈 join 时 filtered 决定传给下一表的行数
✨ filtered 小可能提示联合索引可加强
✘ 面试爱问，生产常忽略

---

## （2）折叠式知识卡片版

<details>
<summary><strong>1）定义</strong></summary>

* **filtered** 是 EXPLAIN 输出的估计值，表示：
  “索引扫描后的 rows 中，预计能通过剩余 WHERE 条件过滤的比例（0~100%）”。
* filtered 不表示真实扫描量，也不反映索引本身优劣，仅是优化器的估算。

</details>

<details>
<summary><strong>2）原理</strong></summary>

### 1）filtered 的计算模型

* rows：基于选中索引的“预估扫描行数”。
* filtered：WHERE 剩余条件过滤后的预计保留比例。
* rows × filtered ≈ 进入下一阶段（如 join）的行数。

### 2）单表下过滤分析

* filtered 高：说明“索引过滤之后剩下的行很多”。
* filtered 低：说明“剩下的行很少”。
* 但高/低都不代表索引优秀或糟糕，因为它仅统计“索引后过滤”，不关心索引本身是否选得对。

### 3）多表 join 下的作用

* MySQL 手册特别强调：filtered 在 join 规划中用于估算“本表输出多少行给下一表”。
* filtered 越大 → join 输入越多
* filtered 越小 → join 可能更高效

</details>

<details>
<summary><strong>3）关键点</strong></summary>

* filtered 不是执行效果，只是预估值，会受统计信息质量影响。
* 单表查询几乎无优化意义，应关注 type、key、extra。
* join 时 filtered 用于决定 join 顺序与驱动表选择。
* filtered 小可能意味着加强联合索引能让索引阶段过滤更多数据。
* filtered 不等于实际过滤比例，执行时可能差距巨大。

</details>

<details>
<summary><strong>4）扩展知识</strong></summary>

* rows 与 filtered 都来自统计信息（cardinality），统计过期会导致估计不准。
* join 过程中真正决定性能的是：驱动表选择、索引覆盖、连接类型（NLJ/HJ）、extra 中是否 filesort/temp table。
* filtered 代表的是“索引过滤之后的二次过滤效果”，属于优化器成本模型一部分。
* MySQL 8 的 histograms 可改善 filtered 的估算准确度。

</details>

---

## （3）面试官追问（Q&A）

**问：filtered 是否越大越好？
答：单表无意义，join 时 filtered 大意味着传给下一表的行更多，通常反而更慢。**

**问：filtered=10.00 代表什么？
答：说明 rows 中预计只有 10% 的行满足剩余 WHERE 条件，例如 rows=10000 → 预计 1000 行继续参与查询。**

**问：为什么单表查询不看 filtered？
答：filtered 代表的是索引过滤后的剩余量，不影响索引选择，也不反映索引效率，分析价值极低。**

**问：join 中 filtered 有何关键作用？
答：优化器用 rows×filtered 评估本表输出行数，决定 join 顺序与是否适合做驱动表。**

**问：filtered 能否用于判断索引是否需要调整？
答：间接可以。若 filtered 很小，说明还能在索引中提前过滤更多，提示可以考虑扩展联合索引。**

**问：filtered 为什么不准确？
答：完全依赖统计信息，统计陈旧或分布倾斜都会导致错误估计。**

**问：filtered 与 type/key 什么关系？
答：type/key 决定索引使用方式（核心），filtered 只是索引之后的附加过滤估计。**

**问：为什么会有 rows×filtered 的计算？
答：因为 join 需要知道“这个表输出多少行”，以便决定下一个表的计算量。**

**问：filtered 是真实值吗？
答：不是，仅是估算。实际执行可能与 EXPLAIN 显示相差甚远。**

---

## （4）示意图（ASCII）

```
EXPLAIN 行示例
rows = 10000
filtered = 10.00

索引扫描行：10000
WHERE 剩余筛选：10%
预计输出：10000 × 10% = 1000 行
```

```
JOIN 场景

Table A  → rows=5000, filtered=20% → 输出 1000 行
Table B  ← 仅对这 1000 行做 join
```

```
filtered 在执行计划中的位置

       ┌───────────┐
rows → │ 索引阶段   │ → filtered → WHERE 过滤后行数 → join 下一表
       └───────────┘
```
