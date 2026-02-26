### mysql_insert_log_order

#### 1）10 行极简速记版（纯文本）

✔ Insert 也需要 UndoLog 记录可回滚
📌 Undo 最先写，保存变更前镜像
🔥 Redo Log 两次写：prepare → commit
🚀 Binlog 写在 redo prepare 之后
⚠️ Redo 与 Binlog 顺序影响主从一致性
🧠 两阶段提交保证 Binlog/Redo 原子一致
🔍 Insert 的 UndoLog 类型为 INSERT_REC
📈 Redo 基于 WAL，先日志后落盘
✨ Undo 记录旧值，Redo 记录新值
✘ 顺序错误会导致崩溃恢复不一致

---

#### 2）折叠式知识卡片版

<details>
<summary>定义</summary>

一次 INSERT 涉及 Undo Log、Redo Log、Binlog 三类日志。为保证崩溃恢复正确性和主从复制一致性，MySQL 采用严格的日志写入顺序，并通过两阶段提交保持 binlog 与 redo 的原子一致。

</details>

<details>
<summary>原理</summary>

* **Undo Log**：记录变更前镜像，使 INSERT 可回滚（UNDO 类型为 `TRX_UNDO_INSERT_REC`）。
* **Redo Log**：WAL 机制，记录页修改操作，用于崩溃恢复。
* **Binlog**：记录逻辑变更，用于主从复制、备份恢复。
* INSERT 的完整数据变更为：写 Undo → 写 Redo Prepare → 写 Binlog → Redo Commit。

</details>

<details>
<summary>关键点</summary>

* UndoLog 保存“删除操作”信息以便撤销 INSERT。
* RedoLog 是物理日志，binlog 是逻辑日志。
* Binlog 必须在 redo prepare 后写，否则主从会不一致。
* Redo commit 必须在 binlog 写入后，否则崩溃恢复失败。
* 写顺序严格依赖两阶段提交（2PC），保证一致性。

</details>

<details>
<summary>扩展知识</summary>

* Undo 支持 MVCC，提供历史版本链。
* Redo 使用循环写 + checkpoint，提高持续写性能。
* binlog 与 redo 不一致会导致：主从复制错误 / 崩溃后数据丢失或脏数据。
* 两阶段提交核心：prepare（保证 redo）＋ commit（保证 binlog + redo 可见）。

</details>

---

#### 3）面试官追问（Q&A）

**问：为什么 INSERT 也要写 UndoLog？**
答：因为事务可能回滚，Undo 用于撤销 insert，将新增记录标记为删除。

**问：Undo 和 Redo 有何本质区别？**
答：Undo 是回滚旧值，Redo 是恢复新值；方向相反、目标不同。

**问：为什么 Redo 和 Binlog 必须用两阶段提交？**
答：为保证 binlog 与 redo 一致，否则主从复制和崩溃恢复会互相矛盾。

**问：Redo Prepare 阶段的意义是什么？**
答：表示事务已修改内存页并写入 redo，但未提交，可安全进行崩溃恢复。

**问：如果 binlog 写完但 redo 未 commit 就崩溃？**
答：恢复时会丢失事务，但 binlog 已同步给从库 → 主从不一致，属于灾难性问题。

**问：如果 redo commit 了但 binlog 未写完崩溃？**
答：主库恢复成功，但 binlog 无记录 → 主从仍不一致。**

**问：2PC 如何解决上述问题？**
答：确保 redo 与 binlog 在 prepare/commit 阶段严格绑定，崩溃后状态可被正确判定。**

**问：UndoLog 在 MVCC 中扮演什么角色？**
答：提供历史版本，使读操作能看到事务前快照数据。**

---

#### 4）示意图（ASCII）

```
INSERT 日志写入顺序（2PC）

        ┌─────────────────────────┐
        │       Undo Log（旧值）      │
        └─────────────────────────┘
                    ↓
        ┌─────────────────────────┐
        │   Redo Log Prepare 阶段   │
        └─────────────────────────┘
                    ↓
        ┌─────────────────────────┐
        │        写 Binlog        │
        └─────────────────────────┘
                    ↓
        ┌─────────────────────────┐
        │   Redo Log Commit 阶段  │
        └─────────────────────────┘
```

如果需要，我还能继续输出“Undo/Redo 物理结构图”“2PC 时序精讲”“主从复制一致性典型案例”。
