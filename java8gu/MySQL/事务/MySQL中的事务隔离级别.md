## 1）10 行极简速记版（小红书爆款风）

✔ 隔离级别 = 并发与一致性的终极 trade-off
🔥 RU：野蛮模式，脏读/幻读/不可重复读全来
📌 RC：Oracle 默认，读已提交，但“不稳定”
🚀 RR：MySQL 默认，MVCC 加持，读一致性更强
🧠 幻读是 RR 最大“痛点”，需靠锁补齐
✨ Serializable：锁满全场，强一致但并发塌
📈 级别越高，锁越重，并发越低
🔍 隔离级别 ≠ 数据库实现，MySQL 与 SQL-92 有差异
⚠️ MVCC 只解决快照读，不解决当前读幻读
➤ 核心：用多少锁换多少一致性

## 2）折叠式知识卡片版

<details>
<summary>定义</summary>

事务隔离级别定义了“一个事务能看到其他事务哪些修改”。是数据库调节 **一致性 vs 并发性** 的核心机制。

SQL-92 定义四种隔离级别，从低到高：

* **Read Uncommitted（RU）**
* **Read Committed（RC）**
* **Repeatable Read（RR）**
* **Serializable（SER）**

</details>

<details>
<summary>原理</summary>

* **RU**：可读未提交数据，零隔离 → 可能脏读、不可重复读、幻读。
* **RC**：必须读已提交版本 → 阻止脏读，但不可重复读、幻读仍可能。
* **RR（MySQL 默认）**：同一事务多次读取同一行返回相同结果（快照读基于 MVCC）。但当前读仍会遇到幻读。
* **Serializable**：所有操作串行化，避免所有读异常，但并发极差。

不同数据库实现 RR 的方式不同：

* Oracle 的 RR ≈ MySQL 的 RC
* MySQL 的 RR + MVCC + Gap Lock/Next-Key Lock 才接近标准 RR

</details>

<details>
<summary>关键点</summary>

* 幻读是 “范围变化”，仅 MVCC 不能完全解决，需要范围锁。
* MySQL 默认 RR 是因为读多写少场景下更安全。
* RC 在 OLTP 场景下更高并发，但一致性较弱。
* Serializable 一般只用于强一致场景（如银行总账）。
* 可通过 SET SESSION / GLOBAL 修改隔离级别。

</details>

<details>
<summary>扩展知识</summary>

文档未写但可补充：

* RR 下的快照读由 MVCC 实现，通过 Undo + ReadView 保证一致性。
* 当前读（例如 SELECT ... FOR UPDATE）不走快照，因此需要锁机制避免幻读。
* 高版本 MySQL 8.0 中 read-view 创建策略优化以降低冲突。

</details>

## 3）面试官追问（Q&A）

问：RR 能完全解决幻读吗？
答：快照读能，当前读不能，需要 Gap Lock / Next-Key Lock 才能避免。

问：为什么 MySQL 默认 RR？
答：为了减少不可重复读风险，提高读一致性，同时通过 MVCC 保留高并发能力。

问：RC 与 RR 的核心差别是什么？
答：RC 每次读的是“最新提交版本”；RR 读的是“事务开始时的版本”。

问：Serializable 为什么并发差？
答：所有读都加锁，事务串行化，锁冲突激增。

问：RU 适用于什么？
答：基本不推荐，仅适合对一致性完全不敏感的场景。

问：MySQL 实现 RC 用了什么机制？
答：MVCC + 每次重新生成 ReadView。

问：幻读与不可重复读的根本区别是什么？
答：不可重复读影响行内容；幻读影响行数量。

问：如何查看当前隔离级别？
答：`SELECT @@transaction_isolation;`

## 4）示意图（ASCII）

```
事务隔离级别与读异常对应表

隔离级别        脏读   不可重复读   幻读
-----------------------------------------
RU               Y        Y           Y
RC               N        Y           Y
RR               N        N           Y*
SERIALIZABLE     N        N           N

* RR 快照读无幻读；当前读仍可能出现
```
