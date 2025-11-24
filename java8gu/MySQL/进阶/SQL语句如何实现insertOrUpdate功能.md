总结标题：insert_or_update_sql_mechanism

---

## 1）10 行极简速记版（纯文本）

✔ insert…on duplicate key update = MySQL 官方 upsert
🔥 必须依赖主键或唯一索引冲突触发更新
⚠️ RR 隔离级别下会加临键锁，易造成死锁
📌 插入失败但仍会消耗自增主键（主键跳跃）
🚀 底层流程：尝试插入 → 冲突 → 改为更新
🧠 replace into 更暴力：先删后插
➤ insert ignore：忽略冲突，不更新
✨ 可用 values() 引用待插入值用于更新
🔍 使用唯一键可控触发更新逻辑
📈 高并发写场景需注意锁冲突与主键空洞

---

## 2）折叠式知识卡片版（Markdown）

<details>
<summary>定义</summary>

`INSERT INTO ... ON DUPLICATE KEY UPDATE` 是 MySQL 原生的 **Upsert（插入或更新）** 机制。
当插入数据发生 **主键或唯一索引** 冲突时，不插入新行，而是执行 UPDATE 指定列。

</details>

<details>
<summary>原理</summary>

* MySQL 先尝试执行 INSERT。
* 若命中主键/唯一键冲突，INSERT 失败但不抛异常，转而执行 UPDATE。
* UPDATE 阶段可使用 `VALUES(col)` 取刚才尝试插入的值。
* InnoDB RR 级别下，冲突检查会触发 **间隙锁 + 临键锁**，容易与并发写竞争形成死锁。
* 自增主键值在 INSERT 阶段已经分配，即便之后走 UPDATE，自增计数也不会回滚（主键跳跃）。

</details>

<details>
<summary>关键点</summary>

* 必须满足：

    * 表存在主键或唯一索引
    * 插入语句包含这些索引列
    * 索引列值不能为 NULL
* 与替代语句对比：

    * **REPLACE INTO**：冲突时先 DELETE 原行，再 INSERT 新行（影响触发器、副作用大）
    * **INSERT IGNORE**：冲突时忽略，不更新数据
* 自增主键跳跃源于 InnoDB 的“先分配再判断冲突”的设计。
* 高并发下不推荐滥用 upsert，需要评估锁冲突与更新热点。

</details>

<details>
<summary>扩展知识</summary>

* 类似 PostgreSQL 的 `INSERT ... ON CONFLICT DO UPDATE`，但 MySQL 的触发条件完全依赖唯一约束。
* 主键跳跃不会影响数据正确性，但会导致主键不连续，进而影响页分裂概率。
* 复杂场景（如非主键判断更新）可以通过 **INSERT…ON DUPLICATE KEY** + 业务唯一键配合实现。

</details>

---

## 3）面试官追问（Q&A）

**问：为什么 INSERT…ON DUPLICATE KEY UPDATE 会导致死锁？
答：RR 下需要检查唯一键冲突，会加间隙锁和行锁；并发写入同一区域容易产生锁交叉。**

**问：主键跳跃的根本原因是什么？
答：InnoDB 插入前必须先分配自增值，而该值不会因为后续冲突转 UPDATE 而回滚。**

**问：REPLACE INTO 与 ON DUPLICATE KEY UPDATE 核心区别？
答：REPLACE 是“删旧插新”，而 ON DUPLICATE KEY UPDATE 是“更新旧行”。**

**问：INSERT IGNORE 是否安全？
答：不会报错，但可能吞掉冲突并导致数据未更新，不适用于需要数据一致性的场景。**

**问：如果唯一键冲突很多，如何优化？
答：减少冲突热点（分片、hash 唯一键）、使用行锁更小的约束、或改成先查再更新。**

**问：VALUES(col) 可以做什么？
答：引用原本准备插入的值，实现按插入值更新，如累计、覆盖、条件更新等。**

**问：高并发写场景中如何降低死锁？
答：统一写入顺序、使用更合理的唯一键分布、降低 RR 隔离级别或引入重试机制。**

**问：on duplicate key 能否用于普通字段冲突？
答：不能。必须依赖主键或唯一索引冲突。**

**问：主键跳跃是否影响业务？
答：对功能无影响，但会导致主键不连续，影响存储结构和审计可读性。**

---

## 4）示意图（ASCII）

```
INSERT ... ON DUPLICATE KEY UPDATE 流程

                  +---------------------+
                  |    尝试 INSERT      |
                  +----------+----------+
                             |
                  无冲突     |     冲突（唯一键/主键）
                             v
                        +----+-----------------------+
                        |        执行 UPDATE         |
                        |  使用 VALUES(col) 等更新   |
                        +----------------------------+

自增流程（即便不插入成功也会前进）：

    INSERT 尝试
       |
       v
 分配 self-inc id  --->  发现冲突 ---> 改为 UPDATE
       |
       v
   id 已消耗（主键跳跃）
```

---
