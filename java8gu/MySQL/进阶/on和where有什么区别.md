ON_vs_WHERE
✔ ON 决定“如何 JOIN”，WHERE 决定“JOIN 完成后如何过滤”
📌 ON 作用于连接阶段，WHERE 作用于结果集阶段
🔥 LEFT JOIN 中：ON 保留左表行，WHERE 可能把 NULL 行过滤掉
➤ 相同条件放在不同位置，结果可能完全不同
🧠 ON 决定行匹配关系，WHERE 决定输出哪些行
⚠️ 把过滤条件误写在 WHERE 会导致 LEFT JOIN 变 INNER JOIN
📈 JOIN 语义 > 过滤语义，这是根本区别

---

## 折叠式知识卡片版

<details>
<summary>① 定义</summary>

* **ON 子句**：用于 JOIN 阶段指定表之间的匹配条件，只影响连接过程。
* **WHERE 子句**：JOIN 完成后对结果集再做过滤，不参与表连接逻辑。

</details>

<details>
<summary>② 原理</summary>

* **JOIN 阶段（ON）**：决定两张表如何组合行；对 LEFT JOIN 来说，ON 不会过滤左表行，右表无匹配则补 NULL。
* **过滤阶段（WHERE）**：仅对 JOIN 完成后的“临时结果集”过滤，条件不满足的整行被丢弃。

典型行为差异：

* 在 LEFT JOIN 中若条件放在 WHERE，会导致本应保留的 NULL 行被过滤掉 → 退化成 INNER JOIN。

</details>

<details>
<summary>③ 关键点</summary>

* ON 是连接条件；WHERE 是行级过滤条件。
* ON 不会破坏 LEFT JOIN 对左表的保留语义，WHERE 会。
* ON 适合写 join 关系；WHERE 适合写业务过滤条件。
* 对同样的表达式（如 dept.name='IT'），放在 ON 和 WHERE 中结果完全不同。

</details>

<details>
<summary>④ 扩展知识</summary>

* MySQL 优化器可能重写 JOIN 顺序，但 **ON 与 WHERE 的语义不变**。
* 在复杂查询中，将 JOIN 过滤放到 ON 里能减少中间结果集的行数（推断补充）。
* WHERE 与 HAVING 的类似区别：WHERE 在 GROUP BY 之前，HAVING 在之后（类比理解）。

</details>

---

## 面试官追问（Q&A）

**问：为什么 LEFT JOIN 的筛选条件放在 WHERE 会导致数据被过滤掉？**
答：WHERE 在 JOIN 后执行，会直接过滤掉右表为 NULL 的行，破坏 LEFT JOIN 的保留特性。

**问：ON 中的过滤与 WHERE 有什么本质差异？**
答：ON 是“连接前过滤”，WHERE 是“连接后过滤”。前者不影响左表行的保留，后者会影响最终输出。

**问：何时应该把条件写在 ON 而不是 WHERE？**
答：当条件用于描述表之间的关联关系，且希望保留 LEFT JOIN 左表所有行时。

**问：是否 ON 始终优先于 WHERE 执行？**
答：逻辑上是，物理执行可能被优化器重写，但语义效果始终一致。

**问：RIGHT JOIN 与 LEFT JOIN 中 ON/WHERE 有什么差异？**
答：规则相同，但保留的一侧换成右表：WHERE 过滤会破坏 RIGHT JOIN 的右表保留性。

---

## 示意图（ASCII）

```
LEFT JOIN 流程对比

        ON 条件过滤                     WHERE 条件过滤
   -----------------------         ---------------------------
   employees   departments         (JOIN 后结果集)
        │           │                   │
   [连接匹配失败]   │                   │
        │           │                   ▼
   保留员工 + NULL   │           WHERE 过滤掉 NULL 行
        ▼           ▼                   ▼
   输出所有员工       输出减少，只剩匹配行
```

（完）
