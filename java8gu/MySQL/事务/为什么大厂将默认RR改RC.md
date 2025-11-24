## 1）10 行极简速记版

✔ RC 并发更猛，RR 天生偏“保守锁”
🚀 RC 减锁粒度，update 冲突直接降维
🔥 RR 自带 Gap/Next-Key，死锁体质更强
📌 RC 半一致读，失败行提前放锁超丝滑
🧠 主从同步 row 格式配 RC 更稳
⚠️ RR 虽一致性强，但高并发场景拖后腿
📈 RC 牺牲一点一致性，换巨大吞吐提升
➤ 幻读不是高并发核心痛点，锁冲突才是
✨ 大厂选 RC，本质是并发与锁成本的战略取舍
🚀 稳定性工程实践：乐观锁+RC = 线上黄金组合

---

## 2）折叠式知识卡片版

<details>
<summary><strong>定义</strong></summary>
RR（Repeatable Read）与 RC（Read Committed）是 MySQL 主流隔离级别。RR 默认会触发 Gap Lock 与 Next-Key Lock，而 RC 只加行锁并允许读取提交后的最新版本。本文讨论大型系统为何将默认 RR 替换为 RC。
</details>

<details>
<summary><strong>原理</strong></summary>
- **一致性读**：RR 首次查询生成稳定 ReadView；RC 每次查询生成新快照。  
- **加锁差异**：RR = Record Lock + Gap Lock + Next-Key Lock；RC = 仅 Record Lock；RC 还支持“半一致读”。  
- **主从复制约束**：RC 下必须 row 格式 binlog；RR 支持 statement/mixed/row。  
- **并发模型**：RR 大量范围锁导致锁冲突、死锁频发；RC 锁粒度小并发更高。
</details>

<details>
<summary><strong>关键点</strong></summary>
- RC **不加 Gap/Next-Key**，高并发写场景更友好。  
- RC **半一致读**减少锁等待，非命中行提前释放锁。  
- RR 会扩大锁范围，导致 **死锁更高概率**。  
- 大厂采用乐观锁和业务校验解决不可重复读，因此 RC 更现实。  
- 使用 RC 时必须避免 statement binlog（MySQL 新版本几乎都用 row）。
</details>

<details>
<summary><strong>扩展知识</strong></summary>
- RC 是 Oracle 默认隔离级别，所以行业实践丰富。  
- 互联网主流模式是“读多写多高并发”，范围锁是吞吐杀手。  
- RR 虽然一致性更强，但 MVCC+业务层幂等机制通常足够。  
- RC 在分布式场景中与行级锁/乐观锁体系更契合。
</details>

---

## 3）面试官追问（Q&A）

**问：为什么 RR 会导致更多死锁？**
答：RR 中 Next-Key Lock 与 Gap Lock 会锁定范围而非单行，一旦两个事务的范围互相交叉，就极容易形成循环等待，死锁概率呈倍数增长。

**问：RC 的半一致读具体优化了什么？**
答：当 update 命中被锁记录时，RC 会返回最新已提交版本做条件判断，不会直接阻塞；若条件不满足可立即释放行锁，大幅减少锁持有时间。

**问：使用 RC 如何保证业务一致性？**
答：通过乐观锁（版本号）、幂等更新、条件更新（where 条件带版本/状态）确保写入基于正确前置状态，从业务维度规避不可重复读问题。

**问：RC 为什么并发比 RR 高？**
答：RC 不做 Gap/Next-Key 范围锁，只对命中记录加行锁，锁竞争大幅下降；update miss 情况可提前释放锁，整体 TPS 明显提升。

**问：RR 为什么能避免更多异常读？**
答：RR 使用稳定的 ReadView 和范围锁，避免插入间隙导致的幻读，并保证所有快照读在事务生命周期中可重复。

**问：RC 为什么不能使用 statement binlog？**
答：RC 下不同事务可看到不同的数据版本，statement 回放可能导致主从执行顺序错误；row 格式记录行级变更可避免该问题。

**问：大厂改成 RC 后如何控制幻读？**
答：核心写路径多为当前读（for update），MySQL 行锁可控制插入/更新竞争；读路径可接受轻度幻读或由业务层过滤处理。

**问：选择 RC 有哪些前置条件？**
答：业务可容忍非严格快照一致；写操作具备乐观锁/条件控制；binlog 使用 row/mixed；对高并发场景性能要求高。

---

## 4）示意图（结构图）

```
隔离级别选择策略
├─ RR（默认）
│  ├─ 特性：Record+Gap+Next-Key Lock
│  ├─ 优点：强一致性、减少幻读
│  └─ 缺点：锁范围大、死锁概率高、并发低
│
└─ RC（大厂常用）
   ├─ 特性：仅行锁 + 半一致读
   ├─ 优点：并发高、行锁冲突低、死锁少
   ├─ 缺点：可能不可重复读、需要业务保证一致性
   └─ 使用前提：row binlog + 业务层乐观锁
```
