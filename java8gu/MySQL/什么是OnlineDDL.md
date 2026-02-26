OnlineDDL
✔ OnlineDDL 目标是“尽量不停写”完成 DDL
📌 但 Prepare/Commit 阶段仍需短暂 EXCLUSIVE-MDL
⚠️ 并非所有 ALTER 都支持在线执行
🧠 COPY/INPLACE/INSTANT 三大算法
🔥 INSTANT 仅改元数据，速度近乎秒级
➤ 在线 DDL 失败回滚成本高
📈 长事务会阻塞 OnlineDDL 的锁获取
✨ online 阶段靠 row_log 记录增量 DML

---

## 折叠式知识卡片版

<details>
<summary>① 定义</summary>

* **Online DDL** 是 MySQL 5.6 引入的 DDL 加速机制，目的是在执行 ALTER TABLE 时尽量不阻塞业务读写。
* 通过 “在线可重建/不可重建算法 + 行变更日志（row_log）” 让 DDL 与 DML 并发进行。
* 但并非所有操作都能做到真正在线，DDL 开头/结束仍需短暂 EXCLUSIVE-MDL。

</details>

<details>
<summary>② 原理</summary>

### 几种算法模式

* **COPY**：创建临时表、拷贝数据、最终 rename → 最慢，必锁写。
* **INPLACE**：原地构建索引，允许读写，但部分操作仍需 rebuild 原表。

    * *inplace-no-rebuild*：不重建原表（如普通索引变更）。
    * *inplace-rebuild*：需重建表（如修改主键、增加列、字符集变更等）。
* **INSTANT**：MySQL 8.0.12+，仅改元数据，不重建、无数据扫描（仅少数字段操作支持）。

### OnlineDDL 执行三阶段

1. **Prepare 阶段**

    * 获取短暂 MDL-X，更新字典元数据，创建临时 frm/ibd 行变更日志 row_log。
2. **Execute 阶段（在线阶段）**

    * 降级为 MDL-S，允许读写并发。
    * 扫描原表构建新索引/新结构。
    * 将并发 DML 写入 row_log，后续重放。
3. **Commit 阶段**

    * 再次获取 MDL-X，重放最后增量，rename 临时文件，提交事务。

</details>

<details>
<summary>③ 关键点</summary>

* OnlineDDL 不是无锁，而是 **减锁**：Prepare/Commit 仍要 MDL-X。
* row_log 记录 DDL 运行中的增量 DML，使读写得以并发。
* 执行失败时，回滚可能非常昂贵。
* 长事务可能阻塞 OnlineDDL 的 MDL 获取 → 造成线上长时间卡死。
* 不同 ALTER 类型对应 COPY/INPLACE/INSTANT 的适配矩阵（文档附阿里云表格）。
* OnlineDDL 会导致主从延迟，因为从库要按顺序执行耗时的 DDL。

</details>

<details>
<summary>④ 扩展知识</summary>

* MySQL 8.0 的元数据体系完全重构，因此 INSTANT 场景逐步扩大。
* 与 pt-online-schema-change/gh-ost 相比：前两者是“逻辑层在线复制表”方案，OnlineDDL 是引擎级方案。
* 线上执行 DDL 应配合：低峰期、监控 MDL、限流、避免长事务（补充）。

</details>

---

## 面试官追问（Q&A）

**问：OnlineDDL 为什么还能被长事务阻塞？**
答：因为 Prepare/Commit 阶段必须获取 EXCLUSIVE-MDL，只要有 MDL-S 未释放（如长事务），DDL 无法继续。

**问：INSTANT 与 INPLACE 最大区别是什么？**
答：INSTANT 不重建表、不扫描数据，仅修改元数据；INPLACE 仍需扫描聚簇索引和构建索引页。

**问：哪些操作无法 Online？**
答：修改数据类型、字符集、删除列、部分主键操作等需要 COPY/重建，无法在线。

**问：为什么 OnlineDDL 会导致主从延迟？**
答：从库执行 DDL 时需串行完成整个 DDL 扫描/构建流程，无法跳过。

**问：Execute 阶段如何保证一致性？**
答：通过 row_log 捕获并发 DML，并在 Commit 阶段重放，确保新表/新索引与原表一致。

**问：ALTER 加上 LOCK=NONE 是否就绝对安全？**
答：不，依赖于 ALGORITHM 的可支持性；若实际 fallback 到 COPY，仍会锁表。

**问：为什么 OnlineDDL 的回滚代价高？**
答：DDL 可能已经创建了大量中间索引页、结构文件，回滚需要清理临时对象，并撤销字典修改。

---

## 示意图（ASCII）

```
              Online DDL 执行流程

         ┌──────────┐
         │ Prepare  │  短暂 MDL-X
         └─────┬────┘
               │ 创建临时结构 / row_log
               ▼
         ┌──────────┐
         │ Execute  │  MDL-S, 允许读写
         └─────┬────┘
               │ 扫描原表 + 记录增量DML
               ▼
         ┌──────────┐
         │ Commit   │  短暂 MDL-X
         └──────────┘
           重放增量 + rename 完成变更
```

（完）
