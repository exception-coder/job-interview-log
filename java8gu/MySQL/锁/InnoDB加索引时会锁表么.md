✔ 5.6 之前加索引会锁表
🚀 5.6+ 引入 Online DDL，大幅降低阻塞
📌 CREATE/DROP/RENAME INDEX 走 INPLACE
🧠 Online DDL 仍可能等待未提交事务
⚠️ COPY/INPLACE/INSTANT 不同操作支持度不同
🔥 Online DDL 不是无锁，只是“可并行 DML”
🔍 未提交事务会阻塞 DDL 开始
📈 建议低峰期执行索引构建
➤ DDL 前务必备份/规划回滚
✔ 官方文档区分不同索引类型的并发支持

---

## 2）折叠式知识卡片版

<details>
<summary>定义</summary>

* **Online DDL**：从 MySQL 5.6 引入的在线结构变更机制，支持在执行 DDL（如建索引）期间并发执行 DML。
* **INPLACE/COPY/INSTANT**：Online DDL 的三类实现路径，影响是否拷贝数据、是否阻塞读写。

</details>

<details>
<summary>原理</summary>

* MySQL 5.6 前建索引需要表级排他锁（X），阻塞所有 DML。
* Online DDL 将结构变更拆解为 **元数据修改 + 后台构建过程**：

    * 元数据变更短暂持表锁。
    * 后台构建过程中允许大多数 DML 并发。
* 添加索引通常使用 **INPLACE** 模式，不复制整表，但仍可能对部分阶段加内部锁。
* 若表上存在长事务未提交，DDL 必须等待这些事务结束，避免版本冲突。

</details>

<details>
<summary>关键点</summary>

* Online DDL ≠ 无锁，它只是 **缩短强锁持有时间**，并允许部分阶段并发读写。
* 创建、删除、重命名二级索引一般支持并发 DML。
* 若涉及 FULLTEXT、SPATIAL、主键调整等操作，可能退化到 COPY 或阻塞 DML。
* DDL 会受未提交事务影响，开始执行前必须等待。
* 生产环境中索引变更仍需低峰期执行。

</details>

<details>
<summary>扩展知识</summary>

* MySQL 8.0 引入更多 INSTANT DDL（如快速增加列），但建索引依旧是 INPLACE。
* 对于分区表或超大表，构建索引会造成 I/O 和 redo/undo 压力。
* 可通过 `ALTER TABLE ... LOCK=NONE` 明确要求最小阻塞模式（不保证一定成功）。
* 复杂 DDL 通常建议配合 gh-ost / pt-online-schema-change 等工具。

</details>

---

## 3）面试官追问（Q&A）

**问：Online DDL 是否完全无锁？**
答：不是。元数据变更依旧需要短暂表锁，部分阶段也可能加内部锁，只是整体阻塞大幅缩短。

**问：为什么建索引前需要等待未提交事务？**
答：为了确保 DDL 生效时的表结构版本一致，避免与长事务的快照视图产生冲突。

**问：INPLACE 与 COPY 的本质区别？**
答：COPY 会构建新表再重写数据，阻塞严重；INPLACE 在原表结构内部操作，较少阻塞。

**问：为什么 Online DDL 可以并发 DML？**
答：后台构建索引时不阻塞对已有数据行的读写，只在关键阶段短暂加锁。

**问：哪些索引操作不支持 Online？**
答：FULLTEXT、SPATIAL、部分主键变更等可能退化为 COPY 或阻塞 DML。

**问：生产加索引最重要的风险是什么？**
答：长事务阻塞、I/O 暴涨、DDL 回滚极慢、元数据锁（MDL）导致雪崩。

**问：Online DDL 期间 select 是否可能被阻塞？**
答：极短暂阶段可能被 MDL S/X 锁影响，但非构建期间一般不阻塞读。

**问：加索引和删索引，哪个风险更大？**
答：删除索引通常锁持有时间更短，但都会产生 MDL，实际差异取决于表大小与操作方式。

---

## 4）示意图（ASCII）

```
          +--------------------------+
          |       Online DDL 流程     |
          +--------------------------+
                   |
         [短暂 MDL 表锁]
                   |
                   v
        后台构建索引（INPLACE）
        | 允许 SELECT/INSERT/UPDATE |
                   |
                   v
         [元数据切换，短暂锁]
                   |
                   v
                完成 DDL
```
