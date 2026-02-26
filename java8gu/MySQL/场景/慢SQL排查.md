总结标题：mysql_slow_sql_diagnosis

---

## 1）10 行极简速记版（纯文本）

✔ 慢 SQL 排查从“发现 → 定位 → 解决”三步走
🔥 慢日志/中间件/监控是发现问题的核心入口
📌 explain 可直接看出索引、join、回表等瓶颈
🚀 大部分慢 SQL 都是索引问题或 join 问题
⚠️ select *、深分页、多表 join 是高危操作
🧠 常见根因：索引失效、字段过多、回表多、数据量大
➤ 业务字段不合理也会导致 SQL 天生慢
🔍 join 次数越多，嵌套循环带来的放大越明显
✨ 经常慢 SQL 的库要检查 CPU、IO、连接池耗尽情况
📈 定位比优化更重要，找到瓶颈后优化往往非常快

---

## 2）折叠式知识卡片版（Markdown）

<details>
<summary>定义</summary>

慢 SQL：执行时间超过设定阈值（如 1s）的 SQL。
来源包括业务监控、中间件（如 TDDL）日志、MySQL 慢查询日志（通过 slow_query_log 打开）。

</details>

<details>
<summary>原理</summary>

慢 SQL 排查思路分三步：
1）**发现问题**：监控报警、慢日志、业务失败/超时
2）**定位问题**：找到具体 SQL，分析执行计划，判断瓶颈
3）**解决问题**：根据根因进行针对性的 SQL/索引/结构优化

MySQL 慢日志可记录：执行时长、锁等待、扫描行数、SQL 本体等关键信息，可直接从 slow-query.log 排查。

</details>

<details>
<summary>关键点</summary>

常见造成 SQL 变慢的原因包括：

* **没有索引 / 索引失效**（最常见）
* **用错索引**（不满足最左前缀、区分度差、选择错误索引）
* **查询字段过多**（select * 或大字段）
* **回表次数过多**（未使用覆盖索引）
* **多表 join**（Nested Loop 被放大）
* **深分页**（LIMIT offset,n）
* **表数据量过大**（>千万级）
* **连接池耗尽**（慢 SQL/长事务导致）
* **锁等待**（竞争热点行或 gap lock 阻塞）
* **事务过大/过长**
* **数据库 CPU/IO 压力高**
* **参数不合理**（buffer_pool_size/log_file_size）

排查重点：

* 先看执行计划（type/key/rows/extra）
* 扫描行数是否异常
* 是否出现 Using filesort / Using temporary / ALL 扫描
* 判断是否回表太多或索引无效

</details>

<details>
<summary>扩展知识</summary>

常用排查工具与手段：

* MySQL 慢日志 + pt-query-digest
* explain / explain analyze
* show processlist 分析阻塞
* performance_schema 查询资源热点
* 中间件 SQL 超时日志

典型优化方式：

* 加索引/改索引，使其覆盖查询
* 消除深分页
* 拆 join 或冗余字段
* 归档/分表减小数据量
* 控制事务范围避免长事务
* 调优参数（buffer pool、log size）
* 利用缓存、读写分离、搜索引擎（ES/TiDB）

</details>

---

## 3）面试官追问（Q&A）

**问：慢 SQL 排查第一步是什么？**
答：找到具体 SQL，从监控、中间件日志或慢日志中定位。

**问：为何 explain 是排查慢 SQL 的核心？**
答：它能直接告诉你是否走索引、扫描多少行、是否 filesort/temporary、是否回表。

**问：如果 type=ALL 且 key=NULL，说明了什么？**
答：全表扫描 + 无可用索引 → 慢 SQL 高危。

**问：深分页为什么慢？**
答：limit offset,n 会扫描 offset 行并丢弃，成本线性增长。

**问：多表 join 为什么经常变慢？**
答：Nested loop 放大扫描；驱动表选择错误时扫描量成倍增加。

**问：如何判断慢 SQL 是否由锁引起？**
答：看慢日志的 Lock_time 或通过 show processlist 查看阻塞链。

**问：业务慢 SQL 频发时需要看哪些系统指标？**
答：连接数、CPU、IO、锁等待、buffer pool 命中率。

**问：select * 为什么容易导致慢 SQL？**
答：无法使用覆盖索引，增加回表和网络传输负载。

---

## 4）示意图（ASCII）

```
慢 SQL 排查三段式

         +-------------------+
         |   1. 发现慢 SQL    |
         | 监控/慢日志/中间件 |
         +---------+---------+
                   |
                   v
         +-------------------+
         |   2. 定位根因     |
         |  explain/锁/IO    |
         +---------+---------+
                   |
                   v
         +-------------------+
         |   3. 解决问题     |
         | 索引/SQL/结构优化 |
         +-------------------+
```

---
