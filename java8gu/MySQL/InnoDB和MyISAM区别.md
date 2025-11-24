## 1）10 行极简速记版（小红书爆款风）

✔ InnoDB = 事务安全；MyISAM = 查询暴力快
🔥 InnoDB 行锁更细；MyISAM 表锁一锁锁全表
📌 InnoDB 聚簇索引存数据；MyISAM 索引和数据分离
🚀 MyISAM 读密集极快，但不安全、不支持事务
🧠 InnoDB 保证崩溃恢复；MyISAM 宕机可能数据损坏
✨ InnoDB 支持外键，MyISAM 完全不支持
📈 MyISAM 记录行数 O(1)，InnoDB 需要扫描或统计信息
🔍 自增字段：InnoDB 必须独立索引；MyISAM 可联合索引
⚠️ MyISAM 适合历史库/只读库，不适合业务数据库
➤ 现代业务：默认全用 InnoDB，MyISAM 已退出主舞台

## 2）折叠式知识卡片版

<details>
<summary>定义</summary>

InnoDB 和 MyISAM 是 MySQL 提供的两种主要存储引擎：

* **InnoDB**：事务型、行级锁、聚簇索引、强一致性。
* **MyISAM**：非事务型、表级锁、索引与数据分离、高查询性能。

</details>

<details>
<summary>原理</summary>

* **事务支持**：InnoDB 提供 ACID 事务，通过 Undo/Redo 保证一致性；MyISAM 无事务机制。
* **索引结构**：InnoDB 聚簇索引（叶子节点存放数据），MyISAM 索引指向数据文件偏移。
* **锁机制**：InnoDB 行锁并支持 MVCC；MyISAM 仅表锁，写入会阻塞整个表。
* **恢复能力**：InnoDB 支持 crash-safe；MyISAM 宕机可能导致表损坏。
* **记录行数**：MyISAM 直接存储行数；InnoDB 需统计或遍历索引。

</details>

<details>
<summary>关键点</summary>

* InnoDB 更适合 OLTP，高并发读写、数据安全要求高的业务。
* MyISAM 适合只读或读取密集场景，不适合事务与高并发写场景。
* 全文索引：MyISAM 原生支持；InnoDB 从 5.6 起支持。
* 数据文件结构差异导致索引特性与查询路径不同。

</details>

<details>
<summary>扩展知识</summary>

文档未提但可补充：

* MyISAM 不支持 foreign key 的原因是其不维护关系约束。
* InnoDB 更适合分布式与主从复制，因为事务和 crash-safe 更可靠。

</details>

## 3）面试官追问（Q&A）

问：为什么 InnoDB 是默认引擎？
答：提供事务、安全性、崩溃恢复、行锁、高并发，更契合现代业务。

问：InnoDB 的聚簇索引有什么优势？
答：查询主键非常高效，数据和索引同页减少一次 IO。

问：MyISAM 为什么查询快？
答：不需要事务开销、表锁简单、索引结构更轻量。

问：MyISAM 为什么不适合写入密集？
答：表锁导致写操作阻塞整个表，扩展性差。

问：MyISAM 行数查询为什么快？
答：存储了行数元数据，直接读取即可；InnoDB 需遍历或基于统计信息估算。

问：什么时候适合继续使用 MyISAM？
答：日志分析、全文检索、低写入量的历史归档库。

问：InnoDB 的缺点是什么？
答：元数据更复杂、占用空间大、写入路径较 MyISAM 偏重。

问：外键的使用为什么只有 InnoDB 支持？
答：因为 MyISAM 不维护事务一致性，无法保证外键约束。

## 4）示意图（ASCII）

```
InnoDB vs MyISAM（核心差异）

InnoDB
 ├── 支持事务
 ├── 行级锁 & MVCC
 ├── 聚簇索引（索引=数据）
 ├── Crash-Safe
 └── 无行数存储

MyISAM
 ├── 无事务
 ├── 表级锁
 ├── 索引和数据分离（叶子节点存地址）
 ├── 宕机易损坏
 └── 行数存储 O(1)
```
