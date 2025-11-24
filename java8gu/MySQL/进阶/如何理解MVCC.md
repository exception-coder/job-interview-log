10 行极简速记版（纯文本）
✔ MVCC 核心：ReadView 判可见性 + UndoLog 存快照
🚀 快照读看历史，当前读看最新，本质乐观 vs 悲观
📌 UndoLog 串成快照链，用 db_roll_ptr 向后找版本
🔍 db_trx_id 决定版本“是谁改的”
🧠 ReadView 的 trx_ids 才是决定可见性的关键
⚠️ trx_id 落在活跃区间需再比对是否活跃
🔥 RR 只生成一次 ReadView，天然解决不可重复读
✨ RC 每次读都生成 ReadView，可重复读无法保证
🚀 MVCC 仅作用于快照读，不参与当前读
📈 RU/Serializable 都不使用 MVCC（要么太松要么全加锁）

---

折叠式知识卡片版

<details>
<summary>定义</summary>

MVCC（Multiversion Concurrency Control）即多版本并发控制，用于在高并发场景下解决 **读-写冲突**。其核心思想是：**写生成新版本，读选择可见版本**，从而避免读阻塞写，提升系统并发能力。
其机制依赖两个关键：**Undo Log（历史快照链）** 与 **Read View（可见性规则）**。

</details>

<details>
<summary>原理</summary>

1. **快照存储**：每次数据变更前，将旧值写入 UndoLog，形成链式快照（通过 `db_roll_ptr` 串联）。
2. **事务标识**：每行记录含 `db_trx_id`（最后写入者 ID），UndoLog 版本也同时保存该值。
3. **可见性判断（ReadView）**：根据 `up_limit_id / low_limit_id / trx_ids / creator_trx_id` 判断该版本对当前事务是否可见。
4. **回溯查找**：若当前版本不可见，则顺着 UndoLog 链找更早版本，直到找到可见快照或返回空。
5. 合并机制在不同隔离级别采用不同 ReadView 生成时机，实现 RC、RR 的差异化行为。

</details>

<details>
<summary>关键点</summary>

* **快照读 vs 当前读**：快照读使用 MVCC；当前读使用锁。
* **三段区间判断**：`trx_id < up_limit_id` 可见；`trx_id > low_limit_id` 不可见；介于中间需对比 `trx_ids`。
* **RR 只创建一次 ReadView** → 保证可重复读。
* **RC 每次 SELECT 创建新的 ReadView** → 不可重复读。
* 隐式字段仅存在于聚簇索引；二级索引的 MVCC 需回表（文中指向相关扩展）。

</details>

<details>
<summary>扩展知识</summary>

* **RU / Serializable** 不使用 MVCC：前者直接读最新，后者全锁。
* **UndoLog 属于逻辑日志**，用于 rollback 和版本链，实现“历史可追溯”。
* **可见性与提交顺序深度绑定**，事务 ID 单调递增确保快照时间线可靠。
* 文中未展开的二级索引 MVCC、Gap Lock 等，可参考作者链接（补充说明：此处为延伸内容）。

</details>

---

面试官追问（Q&A）

**问：为什么快照读不需要加锁？**
答：快照读基于快照版本链，不读取当前最新物理行，因此不与写操作争抢锁，避免阻塞。但当前读涉及最新版本修改，需要加锁保证并发安全。

**问：InnoDB 如何通过 UndoLog 构造快照链？**
答：每次更新先写旧版本到 UndoLog，并保存旧记录的 `db_trx_id`、`db_roll_ptr`，形成向后指针链；当前行的 `db_roll_ptr` 指向最新快照。链表反向即历史版本序列。

**问：ReadView 为什么能决定版本可见性？**
答：ReadView 用活跃事务列表和事务 ID 范围（up/low limit）构建了“可见事务时间窗口”。版本的 `db_trx_id` 若未提交（活跃）则不可见，若已提交则可见，从而保证一致性视图。

**问：RR 为什么能避免不可重复读？**
答：RR 在第一次快照读时创建一个固定 ReadView，整个事务复用同一个视图，后续写入的新版本均不可见，因此两次查询结果一致。

**问：RC 下为什么仍然存在不可重复读？**
答：RC 每次 SELECT 都生成新的 ReadView，因此第二次查询可能看到其他事务新提交的版本，导致不可重复读。

**问：MVCC 能解决幻读吗？**
答：文档未涉及细节，但 MVCC 本身不能阻止插入型幻读，需要依赖 Gap Lock / Next-Key Lock（推断补充）。

**问：UndoLog 会无限增长吗？**
答：不会，随着事务提交且没有其他事务需要其快照，旧版本可被 purge 线程清理。快照链走完并确认无可见需求才可删除。

**问：为什么需要 db_trx_id + db_roll_ptr 两个字段？**
答：前者标识版本作者用于可见性判断；后者用于串联历史快照链，缺一不可。

**问：MVCC 对二级索引如何生效？**
答：文档指出二级索引无隐式字段，需回表到聚簇索引走版本链（原文未展开，这里为补充说明）。

---

示意图（ASCII）

```
          当前行记录
 ┌───────────────────────────┐
 │ data | db_trx_id | db_roll_ptr ──────────┐
 └───────────────────────────┘               │
                                             ▼
                      UndoLog 快照链（历史版本）
        ┌───────────────────────────┐
        │ data_v1 | trx_id | roll_ptr ────────┐
        └───────────────────────────┘         │
                                              ▼
        ┌───────────────────────────┐
        │ data_v0 | trx_id | null   │  ← 最早版本
        └───────────────────────────┘
```

```
ReadView 可见性判定
┌──────────────────────────────┐
│ trx_ids: [5,7]                │
│ up_limit_id = 5               │
│ low_limit_id = 8              │
│ creator_trx_id = 10           │
└──────────────────────────────┘

判定流程：
1. trx_id < up_limit_id → 可见
2. trx_id > low_limit_id → 不可见
3. 否则在不在 trx_ids 内决定可见性
```

---

（总结完毕）
