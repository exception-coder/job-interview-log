MySQL_isolation_levels

（1）10 行极简速记版
✔ MySQL 隔离级别核心：MVCC + 锁
🚀 ReadView 决定“你能看到哪个版本”
📌 RU 无视版本链，直接读最新数据
✔ RC 每次读都造新 ReadView，避免脏读
🔥 RR 读快照 + Next-Key 锁压幻读
⚠️ 幻读并非 RR 全部能挡，当前读仍可能中枪
🧠 Undo Log 维护版本链，是 MVCC 的地基
🔍 Gap Lock 锁间隙，不锁记录
✨ Serializable 全读加 S 锁，暴力但干净
📈 并发越高，需要越依赖 MVCC 的版本可见性规则

---

## （2）折叠式知识卡片版

<details>
<summary><strong>1）定义</strong></summary>

* MySQL/InnoDB 通过 **MVCC（Undo Log + Read View）** 与 **锁机制（记录锁、间隙锁、Next-Key 锁）** 实现四种隔离级别：RU、RC、RR、Serializable。
* 目标是处理三类异常：**脏读、不可重复读、幻读**。

</details>

<details>
<summary><strong>2）原理</strong></summary>

* **Undo Log**：记录旧版本，形成版本链，用于构造历史快照。
* **Read View**：定义当前事务可见版本规则，四关键字段：trx_ids / up_limit_id / low_limit_id / creator_trx_id。
* **可见性判定**：

    * trx_id < up_limit_id → 可见
    * trx_id ≥ low_limit_id → 不可见
    * trx_id 属于 trx_ids 活跃事务 → 不可见
    * 否则可见
* **隔离级别差异**：

    * **RU**：无 MVCC，直接读最新版本
    * **RC**：每次查询生成新的 Read View
    * **RR**：事务启动时生成 Read View + Next-Key 锁
    * **Serializable**：所有读操作转为共享锁
* **Next-Key 锁**：记录锁 + Gap Lock，用于避免插入型幻读。

</details>

<details>
<summary><strong>3）关键点</strong></summary>

* MVCC 只作用于“快照读”，当前读仍需依赖锁避免写冲突与幻读。
* RR 不完全杜绝幻读，只能挡“插入型幻读”，某些情形仍需 Serializable。
* RC 性能优于 RR，但需承担不可重复读。
* Serializable 本质是悲观锁序列化，吞吐下降明显。
* Undo Log 多版本链过长会导致回溯成本升高（推断：源文未写）。

</details>

<details>
<summary><strong>4）扩展知识</strong></summary>

* MVCC 提升并发能力，使读无需阻塞写，写无需阻塞读。
* Gap Lock 仅出现在 RR 下，且只在当前读时生效（如 SELECT ... FOR UPDATE）。
* InnoDB 的版本链按时间倒序，ReadView 会向后遍历找到可见版本。
* 若需绝对避免幻读（特别是范围写场景），应使用 Serializable。

</details>

---

## （3）面试官追问（Q&A）

**问：RC 为什么能避免脏读但不能避免不可重复读？
答：因为 RC 每次读都会生成新 ReadView，看的是“最新已提交版本”，写事务提交后下次读会看到新版本，导致不可重复读。**

**问：RR 下为什么还可能出现幻读？
答：RR 通过 Next-Key 锁避免插入型幻读，但对于快照读场景仍可能读取到不同版本链，从而产生逻辑幻读。**

**问：Undo Log 为什么能支持历史快照？
答：每次更新都会记录旧值及其 trx_id，形成版本链。查询根据 ReadView 判断可见版本，回溯链上找到满足条件的一项即可。**

**问：Gap Lock 和 Next-Key Lock 的本质区别是什么？
答：Gap Lock 锁定间隙不锁记录；Next-Key 是“记录锁 + 间隙锁”的组合，用于阻止插入并维持范围一致性。**

**问：快照读和当前读的本质差异？
答：快照读使用 MVCC，不加锁；当前读需要加锁（如 SELECT … FOR UPDATE），并读最新记录以保证写一致性。**

**问：为什么 RU 可能出现脏读？
答：RU 不遵循 MVCC，可直接读取未提交事务生成的最新数据版本。**

**问：Serializable 如何彻底解决幻读？
答：其将所有读操作升级为共享锁，使读写严格串行化，不允许并发插入同范围内记录。**

**问：为什么长事务会让 MVCC 变慢？
答：长事务保持老 ReadView，Undo Log 不能清理，会导致版本链增长，回溯成本上升（推断补充）。**

**问：版本链遍历的终止条件是什么？
答：当找到一个满足 ReadView 可见性规则的版本节点即可停止。**

---

## （4）示意图（ASCII）

```
                ┌───────────────┐
                │ InnoDB 行记录  │
                └───────┬───────┘
                        │
                最新版本 (trx_id=300)
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
      Undo Log v2             Undo Log v1
   (trx_id=200, old)       (trx_id=100, older)
             │                     │
             └──────────┬──────────┘
                        ▼
                版本链向后回溯
```

```
隔离级别 → 读视图/锁模型

RU:            直接读最新版本
RC:       每次查询生成新 ReadView
RR:   事务级 ReadView + Next-Key 锁
Serializable:   所有读加 S 锁，强制串行
```
