总结标题：mysql_sql_exec_time

---

## 1）10 行极简速记版（纯文本）

✔ MySQL 查看 SQL 耗时分版本：8.0 前后两套方案
🔥 MySQL 8.0 前靠 SHOW PROFILES，轻量但已废弃
🚀 MySQL 8.0+ 用 EXPLAIN ANALYZE，可查真实执行时长
📌 profiling 需手动开启，否则无法记录
🔍 SHOW PROFILE 可拆分阶段耗时定位瓶颈
🧠 Opening tables / optimizing / statistics / sending data 是关键阶段
⚠️ SHOW PROFILES 仅在当前会话有效，跨连接失效
📈 EXPLAIN ANALYZE 可看到每步 loops、rows、actual time
✨ 更适合优化器调优与慢 SQL 分析
✘ 千万别把 EXPLAIN 当静态分析，ANALYZE 才是真实执行

---

## 2）折叠式知识卡片版（Markdown）

<details>
<summary>定义</summary>

文档介绍 MySQL 中获取 SQL 执行耗时的两种方式：

* **SHOW PROFILES**（MySQL 8.0 之前的运行时性能统计）
* **EXPLAIN ANALYZE**（8.0.18+ 的真实执行计划 + 实际耗时分析）
  用于诊断 SQL 性能瓶颈、解析执行阶段耗时。

</details>

<details>
<summary>原理</summary>

* **SHOW PROFILES 原理**

    * profiling 开启后记录当前会话内所有 SQL 的执行耗时。
    * SHOW PROFILE FOR QUERY 可展示 SQL 每个阶段的 Duration，如 `Opening tables`、`optimizing`、`statistics`、`Sending data`。
    * 阶段统计来自执行引擎内部 hook。

* **EXPLAIN ANALYZE 原理**

    * 在执行计划基础上实际运行 SQL，将真实的执行耗时、扫描行数、循环次数写入计划节点。
    * `actual time=xx..xx rows=xx loops=xx` 体现真实执行路径。
    * 可观察 optimizer 估算与实际执行的偏差，定位代价源头。

</details>

<details>
<summary>关键点</summary>

* profiling 仅对当前连接有效，关闭后记录丢失。
* SHOW PROFILE 能拆分阶段耗时，是调试复杂 SQL 的工具。
* EXPLAIN ANALYZE 能展示真实执行，避免静态 EXPLAIN 的“估算误差”。
* 实际时间包含 I/O、buffer read、行过滤、回表等成本。
* `Sending data` 阶段往往最长，因为包括行扫描 + 传输 + 计算。
* EXPLAIN ANALYZE 会真正执行 SQL（注意副作用）。

</details>

<details>
<summary>扩展知识</summary>

* SHOW PROFILES 已在 MySQL 8.0 中移除，不推荐生产依赖。
* 性能排查常结合 performance_schema 和慢日志分析。
* `Opening tables` 阶段过长可能与 table_cache 配置或元数据锁有关。
* `statistics` 过长可尝试 ANALYZE TABLE 更新统计信息。
* EXPLAIN ANALYZE 与 PostgreSQL 的 analyze 模式类似，但更偏执行器特征。

</details>

---

## 3）面试官追问（Q&A）

**问：SHOW PROFILES 为什么在 MySQL 8.0 后被废弃？**
答：性能数据逐步集中到 performance_schema，SHOW PROFILES 重复能力且难以扩展，因此官方标记废弃并推荐更现代的性能采集机制。

**问：EXPLAIN 与 EXPLAIN ANALYZE 的本质区别是什么？**
答：EXPLAIN 仅是优化器计划展示，不执行 SQL；EXPLAIN ANALYZE 会真实执行 SQL，并记录实际耗时、行数、回表次数等真实数据。

**问：为什么 Sending data 阶段通常占最高耗时？**
答：该阶段包含行扫描、过滤、回表、函数计算、网络传输等步骤，是查询执行的核心工作段。

**问：如何利用 EXPLAIN ANALYZE 判断索引是否被正确使用？**
答：观察实际扫描行数（rows）与 loops，如果行数远高于预估，说明优化器判断错误或索引不适配。

**问：SHOW PROFILE 的每个阶段都有什么作用？**
答：Opening tables 反映表元数据与缓存、optimizing 是优化器阶段、statistics 涉及统计信息收集、Sending data 涉及结果集生成与返回。

**问：EXPLAIN ANALYZE 为什么更适合慢 SQL 排查？**
答：它展示真实执行路径与实际耗时，可直观看到计划偏差、过滤效率、回表是否频繁，远胜仅估算的 EXPLAIN。

**问：profiling 为什么必须手动开启？**
答：profiling 会增加执行开销，默认关闭以避免对生产性能影响。

---

## 4）示意图（ASCII）

```
SHOW PROFILES（8.0 前）
┌──────────┬────────────┐
│ Query_ID │ Duration    │
└──────────┴────────────┘
        │
        ▼
SHOW PROFILE FOR QUERY N
┌──────────────────────┬───────────┐
│ Status               │ Duration   │
├──────────────────────┼───────────┤
│ Opening tables       │ 0.000124   │
│ optimizing           │ 0.000013   │
│ statistics           │ ...        │
│ Sending data         │ ...        │
└──────────────────────┴───────────┘


EXPLAIN ANALYZE（8.0+）
┌──────────────────────────────────────────────┐
│ id | select_type | ... | actual time | rows  │
└──────────────────────────────────────────────┘
                │
                ▼
真实执行 SQL 并返回每步实际耗时
```
