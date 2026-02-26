总结标题：mysql_readview_mvcc

---

## 1）10 行极简速记版（纯文本）

🔥 ReadView 决定“当前事务能看到哪些版本”
✔ RR 只创建一次快照，RC 每次查询都重新生成
📌 trx_ids = 当前活跃事务列表，是可见性判断核心
🧠 up_limit_id = 最低水位；low_limit_id = 最高水位
🚀 trx_id < up_limit_id → 一定可见（已提交）
⚠️ trx_id ≥ low_limit_id → 一定不可见（未来事务）
🔍 up < trx_id < low 时需查 trx_ids 决定可见性
✨ creator_trx_id 自己的修改永远可见
📈 不可见版本依赖 undo log 回溯
✘ ReadView 不等于隔离级别，但决定隔离行为

---

## 2）折叠式知识卡片版（Markdown）

<details>
<summary>定义</summary>

**ReadView** 是 InnoDB 多版本并发控制（MVCC）的核心结构，用于判定一个事务在执行“快照读”时可见的行版本。不同事务隔离级别（RC、RR）通过 ReadView 的创建时机不同来实现不同的一致性规则。

</details>

<details>
<summary>原理</summary>

ReadView 本质上记录了生成快照时系统中活跃事务的边界信息，关键字段：

* **trx_ids**：当前系统中所有活跃读写事务 ID 列表；决定哪些事务未提交。
* **up_limit_id（最小活跃事务 ID，下水位）**：trx_ids 中最小的 ID。
* **low_limit_id（下一可分配事务 ID，上水位）**：表示生成 ReadView 时系统的最大事务 ID 界限。
* **creator_trx_id**：创建该 ReadView 的事务 ID。

基于 ReadView 的可见性判断规则：

1. **trx_id < up_limit_id**
   → 在快照生成时已经提交 → 可见
2. **trx_id ≥ low_limit_id**
   → 快照之后才出现的事务 → 不可见
3. **up_limit_id ≤ trx_id < low_limit_id**

    * 若 trx_id ∈ trx_ids → 未提交 → 不可见
    * 若 trx_id ∉ trx_ids → 已提交 → 可见
4. creator_trx_id 产生的数据对自身永远可见。

不可见版本将通过 **undo log** 继续回溯，直到找到一个可见版本。

</details>

<details>
<summary>关键点</summary>

* 在 **RC** 隔离级别下，每次 SELECT 都会生成新的 ReadView → 读到最新提交数据。
* 在 **RR** 隔离级别下，一个事务只在第一次查询时生成 ReadView → 实现可重复读。
* ReadView 的快照逻辑完全基于事务 ID（trx_id）而非时间戳。
* ReadView 决定了是否需要回溯 undo log，以及回溯深度。
* ReadView 才是 MVCC 的核心，而非 undo log 本身。

</details>

<details>
<summary>扩展知识</summary>

* RR 在 MySQL 中可以避免幻读依赖的是“Next-Key Lock + ReadView”，并非 ReadView 单独实现。
* ReadView 不会记录语句级信息，仅记录活跃事务的 ID。
* 二级索引访问时也使用 ReadView 判断版本可见性。
* MySQL 使用“递增事务 ID + undo 链”来实现多版本链表。
* 事务 ID 不保证连续，因此 trx_ids 可能为稀疏分布。

</details>

---

## 3）面试官追问（Q&A）

**问：ReadView 与 MVCC 的关系是什么？**
答：ReadView 负责“判断可见性”，undo log 负责“提供历史版本”，两者共同构成 MVCC。

**问：RR 为什么能做到可重复读？**
答：因为 RR 隔离级别下 ReadView 在事务中只创建一次，后续所有查询共享同一快照。

**问：为什么 RC 会读到最新提交的数据？**
答：RC 每条 SELECT 都会重新生成一个新的 ReadView，自然看到最新已提交版本。

**问：trx_ids 为什么只包含活跃读写事务？**
答：只有未提交事务才会影响当前快照的可见性，已提交事务不需要记录。

**问：如果一个事务的 trx_id 不在 trx_ids，但在区间中，它为何可见？**
答：说明该事务在当前事务生成快照前已提交，因此版本可见。

**问：如何判断是否需要回溯 undo log？**
答：当某行的 db_trx_id 被判为不可见时，必须沿 undo 链回溯旧版本。

**问：creator_trx_id 的记录为什么永远可见？**
答：因为事务对自身修改具备 read-your-write 保证，属于事务规范的基础要求。

---

## 4）示意图（ASCII）

```
          ReadView 可见性判定逻辑

                low_limit_id (上水位)
                        │
        不可见区：未来事务（>= low_limit）
                        │
        ┌──────────────────────────┐
        │ up_limit_id ~ low_limit_id │
        │     中间区                 │
        └──────────────────────────┘
                        │
        可见区：历史已提交事务（< up_limit）
                        │
                up_limit_id (下水位)

判断流程：
db_trx_id < up_limit_id                    → 可见
db_trx_id >= low_limit_id                  → 不可见
up_limit < db_trx_id < low_limit:
     若 db_trx_id ∈ trx_ids                → 不可见
     若 db_trx_id ∉ trx_ids                → 可见
creator_trx_id                             → 永远可见
```
