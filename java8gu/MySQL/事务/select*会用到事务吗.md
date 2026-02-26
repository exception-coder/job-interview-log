## 1）10 行极简速记版（小红书爆款风）

✔ SELECT 也在事务里跑，只是你没感觉到
🔥 InnoDB 所有操作都在事务上下文执行
📌 SELECT 默认触发“隐式事务”
🚀 无写操作 → 不加锁 → 查完立即自动提交
🧠 autocommit=1 时，每条语句都是一个独立事务
✨ 只读事务不产生日志、不持锁
📈 真正需要事务一致性时可手动 START TRANSACTION
🔍 MVCC 让 SELECT 更像“读快照”
⚠️ SELECT * 不会保持事务长时间占锁
➤ 结论：SELECT 用事务，但成本极低、无锁、即刻提交

## 2）折叠式知识卡片版

<details>
<summary>定义</summary>

* 在 InnoDB 中，不论是读还是写操作，都属于事务的一部分。
* 当用户未显式开启事务时，MySQL 会自动为每条语句开启 **隐式事务（autocommit 事务）**。

</details>

<details>
<summary>原理</summary>

* 当执行 `SELECT *` 时：

    1. InnoDB 自动开启一个短事务
    2. 执行查询（基于 MVCC 的快照读）
    3. 不持有锁
    4. 查询结束后自动提交
* 因为没有写操作，所以不会触发加锁，不影响其他会话的并发性。

</details>

<details>
<summary>关键点</summary>

* SELECT 属于事务，但属于 **自动提交的短事务**
* 不持锁、不阻塞，不参与行锁竞争
* 依赖 MVCC 保证隔离级别下的数据一致性
* 写入类操作必须依赖显式或隐式事务才能落盘

</details>

<details>
<summary>扩展知识</summary>

文档未写但可补充：

* InnoDB 中“快照读”不加锁，因此 SELECT 无阻塞
* 若 SELECT 使用 `FOR UPDATE` 或 `LOCK IN SHARE MODE`，则成为 **当前读**，会真正加锁
* 只读事务 (`START TRANSACTION READ ONLY`) 可进一步提升性能

</details>

## 3）面试官追问（Q&A）

问：为什么 SELECT 也要在事务里？
答：因为需要版本一致性（MVCC），事务 ID 与 ReadView 才能决定可见数据。

问：SELECT 会不会加锁？
答：普通快照读不会；当前读（FOR UPDATE）才会。

问：自动提交事务和手动事务有什么区别？
答：自动提交是“一条语句一个事务”；手动事务可跨多条语句。

问：SELECT 在 RR 下读到什么版本？
答：事务创建 ReadView 时的快照。

问：SELECT 会产生 redo/undo 吗？
答：不会产生 redo，但可能依赖 undo 版本链读取旧数据。

问：在 autocommit=0 下执行 SELECT 会怎样？
答：事务不会自动结束，ReadView 会保持一致，可能导致一致性读性能更高但影响版本回收。

问：什么情况下 SELECT 会阻塞？
答：执行当前读、或遇到其他会话持有 incompatible 锁。

问：隐式事务的开始点在哪里？
答：每条语句执行前自动开启，每条执行后自动提交。

## 4）示意图（ASCII）

```
普通 SELECT 执行流程（autocommit=1）

START IMPLICIT TX
     ↓
MVCC 快照读（无锁）
     ↓
返回结果
     ↓
AUTO COMMIT
```
