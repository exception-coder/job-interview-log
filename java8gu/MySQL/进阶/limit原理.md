### mysql_limit_principle

#### 1）10 行极简速记版（纯文本）

✔ LIMIT 是最终阶段执行的结果集裁剪
📌 LIMIT offset,n 会先查 offset+n 再丢弃
🔥 深分页本质是扫描大量无用行
⚠️ ORDER BY 存在时必须先排序再截取
🚀 LIMIT n+ORDER BY 可提前停止排序
🧠 LIMIT offset,n+ORDER BY 必须全量排序
✨ DISTINCT+LIMIT 找到 n 个唯一值就停
📈 LIMIT 0 是快速空结果校验技巧
🔍 索引可显著优化 LIMIT 小范围查询
✘ 深分页建议使用“延迟关联”或“游标式分页”

---

#### 2）折叠式知识卡片版

<details>
<summary>定义</summary>

LIMIT 用于限制最终结果集返回的数量，属于 SQL 语句执行链路的最后阶段。常见形式包括 `LIMIT n` 和 `LIMIT offset,n`，其中 offset 表示跳过行数，n 表示返回的行数。

</details>

<details>
<summary>原理</summary>

* MySQL 查询执行顺序中，LIMIT 在所有过滤、分组、排序之后执行。
* 对于 `LIMIT offset,n`，MySQL 会先读出 offset+n 行，并完成排序，然后丢弃前 offset 行。
* 无排序条件时仍需遍历足量记录，但可利用索引顺序读取。
* LIMIT 受 ORDER BY、DISTINCT 影响，行为由优化器决定是否提前终止扫描或排序。

</details>

<details>
<summary>关键点</summary>

* LIMIT 本身不加速查询，只限制结果返回量。
* offset 越大，扫描量越大，是深分页慢的本质。
* ORDER BY + LIMIT n 可提前停止排序，而 ORDER BY + LIMIT offset,n 必须对所有候选数据排序。
* DISTINCT + LIMIT n 在找到 n 个唯一值即可终止扫描。
* LIMIT 0 用于语法检查或快速返回空结果。
* 在无 HAVING 情况下且 LIMIT 很小，MySQL 会优先利用索引减少扫描量。

</details>

<details>
<summary>扩展知识</summary>

* 深分页常用优化：延迟关联、基于索引的“定位+取数”、游标式分页（基于主键）。
* 当 ORDER BY 无法走索引时，会触发 filesort，受限于内存、临时文件。
* MySQL 对 LIMIT 的内部优化策略详见官方文档（文中已引用）。
* 对 offset 很大的分页接口，可通过返回“下一页游标”替代 offset，提高性能。

</details>

---

#### 3）面试官追问（Q&A）

**问：为什么 LIMIT offset,n 性能差？
答：因为 MySQL 必须扫描 offset+n 行，前 offset 行都会被丢弃，扫描量线性增加。**

**问：LIMIT 在执行链路中为什么必须放最后？
答：LIMIT 是作用于最终结果集的裁剪，必须在 ORDER BY、GROUP BY 等操作完成后才能应用。**

**问：ORDER BY + LIMIT n 为什么能提前停止？
答：若排序基于索引，MySQL 在按序扫描过程中找到前 n 行即可终止扫描，无需全量排序。**

**问：ORDER BY + LIMIT offset,n 为什么必须完全排序？
答：因为必须确定最终排序结果的前 offset+n 行，否则无法知道哪 n 行是正确的返回集。**

**问：如何优化深分页？
答：使用延迟关联（先查主键再回表）、基于索引的游标式分页、记录上次位置替代 offset。**

**问：DISTINCT + LIMIT 如何提速？
答：在找到 n 个唯一值后即可停止扫描，不必遍历全部记录。**

**问：LIMIT 是否能避免全表扫描？
答：取决于 WHERE 和 ORDER BY 是否使用索引；本质是索引决定扫描范围，LIMIT 只减少返回量。**

**问：LIMIT 会影响 filesort 行为吗？
答：会。filesort 会在找到前 n 行后停止，但 offset 存在时必须排序全部候选数据。**

---

#### 4）示意图（ASCII）

```
SQL 执行顺序（简化版）
FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT
                                                    ↑
                                           最终结果裁剪
```

```
LIMIT offset,n 执行流程：
读取 offset+n 行
        ↓
排序（ORDER BY 场景）
        ↓
丢弃前 offset 行
        ↓
返回 n 行
```

```
LIMIT n + ORDER BY（可提前停止）：
索引顺序扫描 → 收集前 n 行 → 停止排序/扫描
```

如需，我可以继续补充「深分页优化最佳实践」或提供可直接用于项目的分页查询模板。
