### mysql_transaction_acid

#### 1）10 行极简速记版（纯文本）

✔ 原子性靠 Undo Log 回滚前镜像
🔥 持久性靠 Redo Log 崩溃恢复
📌 隔离性由 MVCC + 各类锁共同实现
🧠 RR 用 ReadView 固定版本防不可重复读
⚠️ 幻读需 next-key lock 参与解决
📈 一致性依赖 ACID 全链路 + 约束校验
🔍 Undo 记录“旧值”，Redo 记录“新值”
✨ Redo 是先写日志后落盘的 WAL 机制
🚀 ReadView 决定可见版本范围
✘ 缺一则 ACID 性质无法完整成立

---

#### 2）折叠式知识卡片版

<details>
<summary>定义</summary>

MySQL 的 ACID 包含原子性、一致性、隔离性、持久性。InnoDB 以多种日志机制、锁机制、版本控制机制共同保证事务正确执行，使数据库从一致状态转换到新的稳定一致状态。

</details>

<details>
<summary>原理</summary>

* **原子性（Undo Log）**：更新前先写入旧值快照，事务失败可完全撤销。
* **隔离性（MVCC + 锁）**：通过 ReadView、版本链、共享锁/排他锁/间隙锁实现不同隔离级别的读写隔离。
* **持久性（Redo Log）**：采用 WAL（Write-Ahead Logging），先写日志再落盘，系统崩溃后根据 Redo 重放。
* **一致性（综合保证）**：由约束（主键/外键/唯一/NOT NULL）+ Undo/Redo + MVCC + 锁共同保障。

</details>

<details>
<summary>关键点</summary>

* Undo 是回滚日志，Redo 是持久化日志；二者配合形成 crash-safe 能力。
* MVCC 通过版本链避免读写锁竞争。
* RC + RR 差异在 ReadView 生命周期：RC 每次生成；RR 事务开始生成一次。
* RR 下防幻读依赖 next-key lock（Record+Gap）。
* 一致性并非单独机制，而是 ACID 整体效果。

</details>

<details>
<summary>扩展知识</summary>

* 二阶段提交（2PC）确保 binlog 与 redo log 的一致性。
* Undo 记录逻辑旧值，Redo 记录物理修改的页面 change。
* MVCC 只对普通 SELECT 有效，UPDATE/DELETE 仍需加行锁。
* Redo Log 使用循环写 + checkpoint 降低刷盘成本。

</details>

---

#### 3）面试官追问（Q&A）

**问：Undo Log 和 Redo Log 的核心区别是什么？
答：Undo 保存旧值用于回滚；Redo 保存新值用于崩溃恢复，二者方向相反、作用完全不同。**

**问：为什么 RR 能避免不可重复读？
答：因为 RR 在事务开始就创建固定的 ReadView，后续读都基于相同版本链视图。**

**问：幻读为什么必须用 next-key lock？
答：MVCC 无法阻止其他事务插入新记录，必须锁住记录间隙防止“新增”导致的幻影出现。**

**问：Redo Log 为什么能保证持久性？
答：因为采用 WAL：先写 redo，崩溃后可重放日志恢复修改，确保已提交数据不丢。**

**问：一致性是否由某个机制单独实现？
答：不是，它是原子性+隔离性+持久性再加上约束共同导致的全局属性。**

**问：RC 与 RR 在 ReadView 上的最大差别是什么？
答：RC 每次 SELECT 都新建 ReadView；RR 全事务复用同一个 ReadView。**

**问：为什么需要两阶段提交？
答：保证 binlog 与 redo log 的一致性，避免主从复制与 crash recovery 数据不一致。**

**问：MVCC 是否适用于所有查询？
答：不，更新操作需加锁；MVCC 只优化一致性读（普通 SELECT）。**

---

#### 4）示意图（ASCII）

```
ACID 实现结构

┌──────────────┐
│ 原子性 → Undo Log          │
├──────────────┤
│ 隔离性 → MVCC + 各类锁       │
├──────────────┤
│ 持久性 → Redo Log + WAL     │
├──────────────┤
│ 一致性 → ACID 全部 + 约束    │
└──────────────┘
```

```
MVCC 版本链 & ReadView

   最新版本 → V4
                 ↑
   不可见 ← ReadView(事务开始)
                 ↓
   可见版本 → V2 → V1 → V0
```

若你需要，我还能继续生成《Undo/Redo 底层页结构》《MVCC 快照构造流程》《2PC 时序图》等扩展总结。
