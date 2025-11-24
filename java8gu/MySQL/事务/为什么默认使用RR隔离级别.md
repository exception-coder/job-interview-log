## 1）10 行极简速记版（小红书爆款风）

✔ MySQL 选 RR，不是因为更强，而是历史兼容
🔥 statement binlog = SQL 原文回放，顺序错就凉
⚠️ RC + statement 会让主从数据直接不一致
📌 RR 的 Gap/Next-Key Lock 能“强行同步提交顺序”
🧠 Oracle 默认 RC，因为它根本没 statement 问题
🚀 SERIALIZABLE 太重，RU 太脏，只能在 RR/RC 里选
📈 MySQL 初期定位 = 稳，不是并发冠军
✨ RR 下 UPDATE 自动加临键锁，阻止写写冲突
🔍 大厂后来切 RC，是“宁要并发，不要死锁”取舍
➤ 结论：MySQL 默认 RR，本质是为了主从复制正确性

## 2）折叠式知识卡片版

<details>
<summary>定义</summary>

文档解释了 MySQL 选用 **Repeatable Read（RR）** 作为默认隔离级别的原因，重点围绕 **历史 binlog 的 statement 格式** 和主从复制一致性问题。

</details>

<details>
<summary>原理</summary>

* **Oracle 仅支持 RC、Serializable、Read-Only** → 无法选 RR，因此默认 RC。
* **MySQL 拥有四类隔离级别**，可在 RC、RR 中自由选择。
* statement binlog 记录“SQL 原文”，按提交顺序写入 binlog，再发给从库回放。
* 在 RC 中，多事务的写入逻辑顺序可能与 binlog 顺序不一致，导致 **回放后主从内容不一致**。
* 在 RR 中，InnoDB 的 **Gap Lock + Next-Key Lock** 会强制事务串行化同一范围内写入，保证 binlog 顺序与实际写入一致。
* 因此 MySQL 为了兼容旧版 binlog statement 格式，只能将默认隔离级别定为 RR。

</details>

<details>
<summary>关键点</summary>

* statement 格式 binlog 是 RR 默认隔离级别的根本原因
* RC 在 statement binlog 下会导致主从复制错乱
* RR 更新时会自动加行锁 + Gap Lock + Next-Key Lock
* MySQL 禁止 “RC + statement binlog” 组合
* 如用户强行设置 RC + statement，会直接报错
* 大厂切到 RC 是现代应用追求更高并发性和更少死锁

</details>

<details>
<summary>扩展知识</summary>

文档未写但可补充：

* MySQL 8.0 默认 binlog_format=ROW，理论上不再依赖 RR，但仍沿用历史默认。
* 如果服务以“读多写少”为主，RC 并发显著优于 RR。
* RR 的范围锁对热点更新、按范围写入的场景（如订单表）会显著增加死锁概率。

</details>

## 3）面试官追问（Q&A）

问：为什么 RC 会导致主从不一致？
答：因为 RC 下两个事务可并发看到不同版本，写入顺序可能与提交顺序不一致，而 binlog 记录的是提交顺序，回放后就乱了。

问：RR 是如何避免上述问题的？
答：RR 的 Next-Key Lock 会锁定记录及其间隙，强制写写顺序严格一致，从而保证 binlog 可重放。

问：为什么 MySQL 不能默认 RC？
答：为了兼容早期大量使用 statement binlog 的部署，否则复制必挂。

问：现代 binlog（ROW/MIXED）是否还需要 RR？
答：严格来说不需要，但默认值不能轻易变，以避免影响旧系统兼容性。

问：为什么大厂仍会主动切到 RC？
答：RR 会导致更多锁冲突与死锁；RC 并发更高且不影响 read 逻辑。

问：RR 与 RC 的核心差别是什么？
答：RC 每次读生成新 ReadView；RR 整个事务复用同一 ReadView。

问：RR 能完全解决幻读吗？
答：快照读能避免，当前读不能完全避免。

问：是否能在 RR 下关闭 Gap Lock？
答：可通过 `READ-COMMITTED` 或特定 DDL/索引模式减少，但不能彻底关闭。

## 4）示意图（ASCII）

```
为什么 MySQL 选 RR？

事务写入顺序 (RC)
  T1: DELETE ...
  T2: INSERT ...
  提交顺序：T2 → T1
  binlog 回放：INSERT → DELETE
  从库结果：空表  ❌ 数据不一致

事务写入顺序 (RR)
  T1 先锁住范围
  T2 阻塞等待
  提交顺序 = 实际写入顺序
  binlog 可安全重放  ✔
```
