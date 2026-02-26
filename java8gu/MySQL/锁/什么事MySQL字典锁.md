MySQL_Metadata_Lock
✔ MDL 保护“元数据”而非数据本身
⚠️ DDL 会阻塞 DML，常成生产卡点
📌 SHARED 允许读元数据、EXCLUSIVE 独占修改
🧠 MDL 会自动升级：读→写
🔥 修改表结构前必须拿到排他MDL
➤ 竞争表结构元数据时易出现锁等待链
📈 多连接长事务最容易阻塞 DDL
✨ MDL 是 MySQL 元数据一致性的最后防线

---

## 折叠式知识卡片版

<details>
<summary>① 定义</summary>

* **字典锁（MetaData Lock, MDL）** 用于保护数据库的**元数据**（表、索引、列、视图等），避免在 DDL 和 DML 并发时出现结构与数据不一致。
* 与行锁/表锁不同，MDL 不锁数据，不影响查询本身，但会影响元数据访问。

</details>

<details>
<summary>② 原理</summary>

* 任意访问表（SELECT/INSERT/UPDATE）都会自动申请 **共享 MDL（MDL-S）**。
* 任何结构变更（ALTER/CREATE/DROP…）需要申请 **排他 MDL（MDL-X）**。
* 若表上存在未提交的事务持有 MDL-S，DDL 端无法获得 MDL-X，就会**阻塞**。
* 若正在执行 DDL，则新 DML 也无法获取 MDL-S，会形成“排队”。

</details>

<details>
<summary>③ 关键点</summary>

* **MDL 由 MySQL 内核自动维护**，无法关闭。
* DDL 必须获取 MDL-X → 会被任意长事务阻塞。
* MDL 申请顺序严格排队，一旦阻塞可能形成长链，影响线上业务。
* 查询也会持有 MDL-S（直到事务结束），即使只读也会阻塞 DDL。
* 长事务 + 高并发 = 最容易触发 MDL 队列堆积。

</details>

<details>
<summary>④ 扩展知识</summary>

* 补充：MySQL 5.7+ 已优化 MDL 等待可视化（`performance_schema.metadata_locks` 可查）。
* Online DDL 仍然需要获取短暂 MDL-X（文档未提及，此为合理补充）。
* 常见事故场景：一个未提交的大事务阻塞 ALTER，后续所有请求被堆死。

</details>

---

## 面试官追问（Q&A）

**问：MDL 为什么必须存在？**
答：若无 MDL，DML 与 DDL 可同时修改结构和数据，会导致元数据与物理结构错乱。

**问：为什么 SELECT 也会加 MDL？**
答：需要保证查询过程中表结构不发生变更，否则解析计划与真实结构不一致。

**问：MDL 与表锁/行锁的区别？**
答：MDL 锁元数据；表锁/行锁锁数据本身，两者互不替代。

**问：MDL 阻塞的根本原因是什么？**
答：DDL 需要排他锁，只要任意连接持有“共享 MDL”未释放（常见：长事务），DDL 就会 hang。

**问：MDL 为什么容易形成阻塞链？**
答：DDL 阻塞后，新的 DML 也无法获取 MDL-S，导致所有后续访问排队。

**问：如何避免 MDL 事故？**
答：避免长事务；DDL 使用低峰期执行；监控 MDL 队列；必要时 kill 阻塞连接。

**问：MDL 升级的场景是什么？**
答：当事务开始时先获取 MDL-S，执行结构修改时尝试升级到 MDL-X。

---

## 示意图（ASCII）

```
            MDL 加锁流程

      客户端1 (SELECT)
            │
         获取 MDL-S
            │
      ──────────────────
      客户端2 (ALTER TABLE)
            │
      需要 MDL-X → 被阻塞
            │
      ──────────────────
      客户端3 新查询
            │
      无法获取 MDL-S → 排队
```

（完）
