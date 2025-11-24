select_star_vs_explicit_columns

（1）10 行极简速记版
✔ select * 与 select a,b,c 结果一致（字段相同情况下）
📌 性能差距几乎可忽略（字段少时映射成本低）
🔥 真正差异在“可维护性”与“可预期性”
⚠️ select * 对表结构变动极其敏感
🧠 显式列名能避免新增字段导致的隐性风险
➤ ORM、API 返回结构强依赖字段顺序时更应避免 *
✔ 明确列名更利于索引覆盖查询（虽然此处字段少无差别）
📈 大表、多字段场景下 select * 会显著拖慢 IO
✨ 小表场景差异不大，但规范设计仍应避免使用 *
🚀 select a,b,c = 可控；select * = 不可控

---

## （2）折叠式知识卡片版

<details>
<summary><strong>1）定义</strong></summary>

* **select ***：返回表中所有字段。
* **select a,b,c**：显示指定字段，返回固定字段集合。
* 在字段仅有 a、b、c 的场景，两者查询结果相同。

</details>

<details>
<summary><strong>2）原理</strong></summary>

* select * 执行时需要做字段列表展开（Column Expansion），但字段数量极少时（a,b,c）成本几乎为零。
* select a,b,c 直接使用固定字段列表，无需做额外展开或映射。
* 真正差距来自后续生态影响，而非 SQL 本身：序列化、反序列化、网络传输、接口解析等。

</details>

<details>
<summary><strong>3）关键点</strong></summary>

* select * 依赖表结构，增删字段会改变返回结果，存在隐患。
* select a,b,c 具备强稳定性，不受 schema 变化影响。
* 在仅有 3 个字段的情况下，性能差异基本忽略不计。
* 若未来字段增加，select * 可能导致：

    * 传输数据量增加
    * ORM 绑定报错
    * 接口 JSON 多字段泄漏
    * 覆盖索引策略失效
* 所以 select * 是“可维护性风险点”，不是当前性能问题。

</details>

<details>
<summary><strong>4）扩展知识</strong></summary>

* 大表或宽表（几十上百列）中 select * 会显著增加 IO、网络与行解析成本。
* 在覆盖索引场景（index only scan）中 select * 会导致无法纯索引读取。
* 微服务 API 中，大量 select * 会导致无意暴露内部字段。
* select a,b,c 是最佳实践，尤其是对 schema 演进频繁的系统。

</details>

---

## （3）面试官追问（Q&A）

**问：select * 为什么通常不推荐？
答：因为对表结构高度敏感，字段新增/删除会改变查询结果，带来不可控隐患，且在宽表下性能明显变差。**

**问：本题字段只有 a,b,c，为何性能几乎一致？
答：字段极少，字段展开和映射的成本几乎为零，传输数据量也相同，因此差别可以忽略。**

**问：使用 select a,b,c 有什么长期收益？
答：结构清晰、可维护性强、不受 schema 演进影响，并支持覆盖索引优化。**

**问：select * 会导致索引失效吗？
答：会导致“覆盖索引”无法工作，从而引发回表；但不会导致 where 索引失效。**

**问：宽表情况下 select * 有什么风险？
答：读取无用列、增加 IO、增加网络传输、序列化成本翻倍甚至破坏缓存策略。**

**问：哪些场景强烈要求不用 select *？
答：API 输出、ORM auto mapping、宽表 join、大吞吐读服务。**

**问：select 列是否影响执行计划？
答：影响覆盖索引使用，但不影响 where 条件的索引匹配。**

**问：为什么 select * 可能导致线上事故？
答：新增字段可能包含敏感信息或巨型字段（TEXT/BLOB）， select * 会自动返回并拖慢链路。**

**问：select * 为什么更难排查问题？
答：返回列不可控，日志和抓包中字段变动不易察觉，调试成本高。**

---

## （4）示意图（ASCII）

```
表结构：a | b | c

select *        →  [a, b, c]   （随字段变化而变化）
select a,b,c    →  [a, b, c]   （固定字段，不随结构变化）

    未来表结构变化：增加 d
select *        →  [a, b, c, d]   ← 风险点
select a,b,c    →  [a, b, c]     ← 稳定
```

```
性能差异（字段越多越明显）

字段数:   3     10      50     200
select *  ≈     +       ++      ++++
select a,b,c  固定成本（小）
```
