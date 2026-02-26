总结标题：mysql_undo_log_purge

---

## 1）10 行极简速记版（纯文本）

🔥 Undo Log 两大作用：回滚 + MVCC 多版本
✔ insert undo 提交即可清理
📌 update undo 需等待无事务再依赖其旧版本
⚠️ 长事务会阻塞 purge，导致 undo 堆积
🚀 purge 线程负责统一清理历史版本
🔍 清理条件：undo.trx_no < 所有活跃读事务的 m_low_limit_no
🧠 ReadView 决定哪些旧版本仍需保留
✨ update undo 是快照读构建历史版本的唯一来源
📈 写事务越多、读事务越长 → undo 越难释放
✘ undo 不是永久存在，但清理延迟完全取决于事务执行状态

---

## 2）折叠式知识卡片版（Markdown）

<details>
<summary>定义</summary>

InnoDB 的 **Undo Log** 用于记录数据修改前的旧值，支撑两大核心能力：

1. **事务回滚**：保证原子性
2. **MVCC 快照读**：根据 ReadView 提供历史版本

Undo Log 分两类：

* **Insert Undo**：仅用于回滚
* **Update Undo**：用于回滚 + MVCC（快照读）

</details>

<details>
<summary>原理</summary>

### Insert Undo 清理机制

* insert undo 在事务提交后不再被任何事务使用
* 可立即被 purge 线程清理

### Update Undo 清理机制

update undo 承担 MVCC 的历史版本职责，因此不能立即清理。清理条件依赖活跃事务的 ReadView 状态：

核心判断：

```
undo.trx_no < 全部活跃读事务的 m_low_limit_no
```

解释：

* 每个写事务有递增的事务号 trx_no
* 活跃读事务持有 ReadView，其中 m_low_limit_no 为“截至当前已提交的最大事务号”
* 若某 undo 所属事务在所有活跃读事务之前就已提交，则这些读事务不再需要它
* → undo 可安全清理

### Purge 过程

* purge 线程后台异步运行
* 负责扫描 undo 链，删除满足条件的 update undo
* 保证旧版本不会影响当前事务一致性

</details>

<details>
<summary>关键点</summary>

* **Update undo 不能马上清理**，因为快照读依赖它构建旧版本
* purge 的清理速度取决于“活跃时间最长的读事务”（长事务是最大敌人）
* undo 保留时间取决于 ReadView，而非事务提交时间
* update undo 堆积可能导致：

    * undo tablespace 膨胀
    * DML 变慢
    * 扫描成本增高
* 清理逻辑完全基于事务号（trx_no），与行内容无关

</details>

<details>
<summary>扩展知识</summary>

* undo tablespace 在 MySQL 8.0 可以自动 truncate，5.7 以前难以收缩
* purge 线程数量可调（innodb_purge_threads）
* 长事务常见来源：未提交的应用事务、死循环 cursor、未关闭的会话
* MVCC 的“历史版本链”即由 update undo 连接而成
* redo log 与 undo log 服务于不同方向：redo→重做，undo→回滚

</details>

---

## 3）面试官追问（Q&A）

**问：update undo 为什么不能提交后马上删除？**
答：因为其他事务的快照读可能还依赖它来访问历史版本，立即删除会破坏一致性。

**问：长事务会带来什么问题？**
答：长事务会阻止 purge 清理旧版本，导致 undo log 无限膨胀，甚至影响全局性能。

**问：purge 如何判断一个 undo 是否可以清理？**
答：判断 undo 所属事务号是否小于所有活跃读事务的 m_low_limit_no。

**问：insert undo 和 update undo 最大区别是什么？**
答：insert undo 只用于回滚，不参与 MVCC；update undo 参与 MVCC 历史链表。

**问：undo log 是如何参与 MVCC 的？**
答：不可见版本通过沿着 undo 链回溯得到更早版本，直到满足 ReadView 可见性为止。

**问：undo 为什么会导致空间膨胀？**
答：purge 受长事务阻塞时，旧版本无法清理，形成大量堆积。

**问：提交顺序与 undo 清理顺序一致吗？**
答：不一定。清理顺序基于事务号与 ReadView，而不是实际提交顺序。

---

## 4）示意图（ASCII）

```
               Undo Log 生命周期

       ┌───────────┐
       │ 写事务修改 │
       └─────┬─────┘
             │ 生成 undo（旧版本）
             ▼
     ┌───────────────┐
     │ 事务提交       │
     └─────┬─────────┘
           │
   ┌───────▼──────────────────┐
   │ insert undo → 可立即清理 │
   └──────────────────────────┘

   ┌──────────────────────────┐
   │ update undo → 是否还有读事务需要？ │
   └───────┬──────────────────┘
           │否（trx_no < all m_low_limit_no）
           ▼
     清理（purge）
           │
           ▼
     释放 undo 空间
```
