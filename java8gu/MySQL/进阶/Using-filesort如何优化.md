using_filesort_optimization

✔ filesort 是排序不足用索引时的兜底方案
🔥 真正能优化的是“减少排序量”
📌 复合索引顺序必须与 ORDER BY 完全一致
🚀 sort_buffer_size 影响是否落盘排序
⚠️ filesort≠一定慢，要看数据量
➤ 让查询走索引排序是最优解
📈 内存排序远快于磁盘临时文件
🧠 索引无法覆盖排序列必然触发 filesort
🔍 多列 ORDER BY 建索引时要遵守最左前缀
✘ 用不到索引排序时任何 ORDER BY 都要付成本

---

<details>
<summary>定义</summary>

**Using filesort**：执行计划 Extra 中出现该提示，表示 MySQL 无法使用索引完成排序，需要额外的排序操作。排序过程可能在内存中，也可能写临时文件到磁盘，是影响 ORDER BY 性能的核心因素。

</details>

<details>
<summary>原理</summary>

* 若 ORDER BY 的字段顺序与可用索引一致，则可直接按索引顺序返回结果，无需额外排序。
* 无法使用索引排序时，MySQL 会将待排序结果写入 sort buffer；超过 buffer 后写临时文件，性能显著下降。
* filesort 本质是“额外排序阶段”，优化点在于减少排序数据量或让排序发生在内存。

</details>

<details>
<summary>关键点</summary>

* 索引排序永远优于 filesort（无回表 + 无额外排序）。
* ORDER BY 多列时应建立与排序字段顺序一致的复合索引。
* sort_buffer_size 决定排序走内存还是落盘，越大越能避免磁盘 I/O。
* filesort 本身并非错误，部分场景排序数据量小，可接受。
* 查询条件、索引字段、排序字段不匹配时必触发 filesort。

</details>

<details>
<summary>扩展知识</summary>

* filesort 有双路排序（旧）和单路排序（新算法），MySQL 会根据内存情况选择（合理补充）。
* limit + order by 大多仍需排序，只是排序数据量可降低（合理补充）。
* 索引排序要求同时满足字段、顺序、方向一致（ASC/ASC 或 DESC/DESC），否则仍然 filesort（合理补充）。

</details>

---

**问：为什么会出现 Using filesort？
答：ORDER BY 无法利用索引排序，MySQL 必须额外做排序动作，发生在 sort buffer 或磁盘临时文件。**

**问：如何让 ORDER BY 不触发 filesort？
答：确保排序字段完全匹配索引顺序，如 ORDER BY a,b,c 对应 idx(a,b,c)。**

**问：sort_buffer_size 调大是否一定更快？
答：只在排序数据量接近 buffer 边界时有帮助，过大反而可能造成内存浪费。**

**问：filesort 一定慢吗？
答：不一定，小结果集或内存排序情况下性能可接受。**

**问：为什么复合索引顺序必须与 ORDER BY 一致？
答：索引的有序性基于字段排列顺序，不一致将导致无法按索引直接取出有序结果。**

**问：ORDER BY 多列时复合索引如何设计？
答：按排序字段顺序做索引，例如 ORDER BY a desc, b desc → idx(a,b)。**

**问：使用 WHERE + ORDER BY 是否能部分利用索引？
答：WHERE 命中过滤列但排序列不匹配索引顺序时，仍会 filesort。**

**问：如何判断是否需要优化 filesort？
答：看排序数据量、落盘次数、延迟与 QPS 压力，不是所有 filesort 都要优化。**

---

```
             ┌───────────────────────┐
             │        ORDER BY        │
             └──────────┬────────────┘
                        │
        ┌───────────────┴────────────────┐
        │                                  │
┌───────────────┐                 ┌─────────────────┐
│ 索引可直接排序 │                 │ Using filesort    │
├───────────────┤                 ├─────────────────┤
│ 复合索引匹配   │                 │ 排序额外开销       │
│ 顺序一致       │                 │ sort buffer/磁盘   │
└───────────────┘                 └─────────────────┘
```
