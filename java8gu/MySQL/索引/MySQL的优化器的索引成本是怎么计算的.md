总结标题：mysql_optimizer_index_cost

---

## 1）10 行极简速记版（纯文本）

🔥 MySQL 优化器选索引的核心依据：成本（Cost）
✔ 总成本 = CPU Cost + IO Cost
📌 CPU 成本来自 server 层：比较、行评估、临时表等
🧠 IO 成本来自引擎层：磁盘页读取最贵（4 倍于内存）
⚠️ 临时表创建成本极高，是 SQL 性能杀手
🔍 EXPLAIN FORMAT=json 可看到 cost_info
📈 read_cost（IO）与 eval_cost（CPU）是关键指标
✨ 索引选择错误常因统计信息不准导致成本估计偏差
🚀 找到高成本环节 → 可定位回表多、临时表多、排序重等问题
✘ 不理解成本模型 = 无法判断 MySQL 为什么选错索引

---

## 2）折叠式知识卡片版（Markdown）

<details>
<summary>定义</summary>

文档介绍 MySQL 优化器（CBO）如何根据成本模型选择最优索引。成本由**CPU 成本 + IO 成本**组成，是优化器估算执行计划优劣的主要依据。理解成本模型可解释为什么 SQL 走某个索引、为何出现索引误判等问题。

</details>

<details>
<summary>原理</summary>

### CPU 成本（Server 层）

通过 `mysql.server_cost` 可查看 CPU 成本项，主要包括：

* **memory_temptable_create_cost**：创建内存临时表的成本
* **memory_temptable_row_cost**：内存临时表写入每行成本
* **disk_temptable_create_cost**：创建磁盘临时表的成本（极高）
* **disk_temptable_row_cost**：磁盘临时表每行成本
* **key_compare_cost**：索引键比较成本
* **row_evaluate_cost**：行间比较、条件计算成本

CPU 成本主要反映排序、GROUP BY、JOIN、过滤等操作的代价。

### IO 成本（存储引擎层）

通过 `mysql.engine_cost` 查看 IO 相关成本：

* **io_block_read_cost**：从磁盘读取一个页的成本（通常为 1）
* **memory_block_read_cost**：从内存读取页的成本（约 0.25）

磁盘 IO 成本 ≈ 内存 IO 4 倍，是查询慢的主要来源。

---

优化器最终使用：

```
Cost = IO_cost + CPU_cost
```

来评估每个执行计划，并选择成本最低的路径（可能导致“选错索引”）。

</details>

<details>
<summary>关键点</summary>

* 创建临时表是高成本操作（尤其是磁盘临时表）。
* 回表次数越多，IO 成本越高，导致执行计划劣化。
* 索引键比较成本低，因此索引过滤通常比全表扫描好。
* 统计信息错误会导致成本估算偏差 → 优化器误选索引。
* 执行 JSON explain 的 cost_info 是分析瓶颈的关键入口。
* CPU 成本明显高 → 多为排序、分组、表达式计算导致。
* IO 成本高 → 多为回表、随机读、缺乏覆盖索引的问题。

</details>

<details>
<summary>扩展知识</summary>

* `ANALYZE TABLE` 可更新统计信息，减少索引误判。
* CBO 模型属于近似估算，不是精准成本；实际执行可能偏离预估。
* 覆盖索引、减少回表、减少临时表是降低成本的核心手段。
* 使用 EXPLAIN ANALYZE 可查看真实而非估算执行成本。
* 高基数列适合作为索引前缀，因为过滤率高，成本低。

</details>

---

## 3）面试官追问（Q&A）

**问：为什么磁盘 IO 成本远高于内存？**
答：磁盘随机读延迟高，MySQL 将其成本设为 1，而内存成本仅为 0.25，优化器会优先选择减少磁盘 IO 的计划。

**问：临时表成本为何如此高？**
答：临时表需要额外分配空间、写入、排序甚至落盘，是 SQL 性能的大杀器，尤其是 GROUP BY / ORDER BY / DISTINCT。

**问：如何判断 SQL 的主要成本在哪？**
答：使用 `EXPLAIN FORMAT=JSON`，关注 cost_info 中 `read_cost`（IO）与 `eval_cost`（CPU）。

**问：为什么优化器会选错索引？**
答：统计信息陈旧或不准确导致行数估算错误，进而计算出的成本偏差，使优化器误以为某索引成本更低。

**问：覆盖索引为什么性能好？**
答：不用回表，可避免磁盘随机 IO，大幅降低 read_cost。

**问：row_evaluate_cost 高代表什么？**
答：说明过滤表达式较复杂，或扫描行数大，需要频繁计算谓词。

**问：cost 中的 prefix_cost 表示什么？**
答：SQL 执行至当前节点的累计总成本，是优化器最终用于排序执行计划的指标。

---

## 4）示意图（ASCII）

```
                 MySQL 成本模型

           ┌───────────────┐
           │   总成本 Cost  │
           └───────┬───────┘
                   │
     ┌─────────────┴──────────────┐
     │                            │
┌────────────┐             ┌───────────────┐
│ CPU Cost    │             │  IO Cost      │
└─────┬──────┘             └───────┬───────┘
      │                            │
  row_evaluate_cost        memory_block_read_cost
  key_compare_cost         io_block_read_cost
  temp_table_cost          (磁盘 > 内存)
  ...                      ...

优化器根据 CPU+IO 估算执行计划，
选择成本最低的索引方案。
```
