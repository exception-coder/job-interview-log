InnoDB_ru_he_jie_jue_zang_du_bu_ke_chong_fu_du_he_huan_du

## 1）10 行极简速记版（小红书爆款风）

✔ 脏读靠 RC：每次读都新建 ReadView
🔥 不可重复读靠 RR：同事务复用同一 ReadView
📌 幻读靠 MVCC + 间隙锁，但仍非 100% 解决
🚀 快照读 = MVCC；当前读 = 锁 → 幻读关键点
🧠 MVCC 本质：版本链 + undo + ReadView
✨ RR 解决大部分幻读，但 INSERT 仍可能“钻空”
📈 Serializable 才是真·彻底无幻读
🔍 Gap Lock/Next-Key Lock = 锁住“记录之间的空隙”
⚠️ MVCC 解决修改问题，不解决新增问题
➤ 一句话总结：读一致性靠 MVCC，范围一致性靠锁

## 2）折叠式知识卡片版

<details>
<summary>定义</summary>

文档解释了 InnoDB 如何分别应对三种读异常：

* **脏读**：读到未提交数据
* **不可重复读**：同一行的值前后变化
* **幻读**：范围查询的行数前后变化

InnoDB 通过 **MVCC + 锁机制（间隙锁）** 组合消除大部分异常。

</details>

<details>
<summary>原理</summary>

* **脏读（解决机制：RC + 每次生成新 ReadView）**
  RC 下，读操作只看到已经提交的版本，通过 *版本链 + 提交状态判断* 实现。

* **不可重复读（解决机制：RR + 固定 ReadView）**
  RR 下，第一次快照读生成的 ReadView 在整个事务期间复用，保证行值一致。

* **幻读（部分解决机制：MVCC + 间隙锁）**

    * 快照读因不读最新版本，无幻读
    * 当前读（for update / lock in share mode）需要锁
    * 间隙锁锁住“记录之间的空隙”，防止插入导致幻读
    * 仍不能 100% 避免，需要 **Serializable** 才能完全根除

</details>

<details>
<summary>关键点</summary>

* MVCC 主要解决“读旧版本 vs 写新版本”的冲突
* MVCC 完全解决脏读、不可重复读
* 幻读的根因是“新增记录”，仅靠 MVCC 不够
* InnoDB 的 RR 通过 Next-Key Lock 解决大部分幻读，但非所有
* 当前读是产生幻读的核心场景

</details>

<details>
<summary>扩展知识</summary>

文档未写但可补充：

* Next-Key Lock = 行锁 + 间隙锁
* 如果使用唯一索引精确匹配，则可能退化为仅行锁，不加间隙锁
* MySQL 8.0 中对间隙锁策略进行了优化，减少锁冲突

</details>

## 3）面试官追问（Q&A）

问：为什么 MVCC 不能解决幻读？
答：MVCC 只管“行的版本变化”，无法阻止插入新行，因此范围内行数会变。

问：RR 与 RC 的 ReadView 差异是什么？
答：RC 每次读都创建新 ReadView；RR 整个事务只创建一次并复用。

问：当前读为何会产生幻读？
答：当前读需要读最新版本，无法依赖快照，因此必须依赖锁，不然 INSERT 会穿透。

问：Gap Lock 与 Next-Key Lock 的区别？
答：Gap Lock 只锁空隙；Next-Key Lock 锁空隙 + 相邻记录，用于防止插入。

问：哪种隔离级别能彻底避免幻读？
答：Serializable，通过强制串行执行所有查询。

问：RR 下哪些场景仍可能出现幻读？
答：使用唯一索引精确查询、范围锁未覆盖、当前读无锁范围等。

问：MVCC 是如何判定可见版本的？
答：根据 undo 链、事务 ID、ReadView 中的活跃事务列表判断。

问：为什么 RR 能避免不可重复读？
答：因为读同一事务始终使用同一 ReadView，视图一致。

## 4）示意图（ASCII）

```
InnoDB 应对三大读异常

脏读：
  RC: 每次读创建新 ReadView → 只读已提交版本

不可重复读：
  RR: 第一次快照→固定 ReadView → 多次读一致

幻读：
  RR 快照读：无幻读（读旧版本）
  RR 当前读：需 Gap/Next-Key Lock
  Serializable：全锁，绝对无幻读
```
