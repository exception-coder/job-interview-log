suoyin_zuozuo_pipei_biyiding

✔ MySQL 传统规则：联合索引必须遵循最左前缀
🚀 MySQL 8.0.13 起引入 Index Skip Scan，可“跳过最左列”用索引
📌 Skip Scan 适用于第一列区分度极低时
🧠 Skip Scan 会构造多个“f1=const AND f2=条件”子范围
⚠️ 区分度高时反而更慢，优化器会自动放弃
🔥 explain 出现 “Using index for skip scan” 表示已启用
🔍 Skip Scan 只能用于单表查询、索引字段非空、满足约束
📈 本质为 B+Tree 多次小范围扫描 → 行数少时有性能优势
➤ 不可依赖 Skip Scan 设计索引，最左前缀仍是主流原则
✔ MySQL 8.0 能更智能地利用联合索引，但不改变索引构建方式

---

## 2）折叠式知识卡片版

<details>
<summary>定义</summary>

* **最左前缀匹配**：
  联合索引只能从最左字段开始连续匹配 (a,b,c) → 需从 a 开始。

* **索引跳跃扫描（Index Skip Scan）**：
  MySQL 8.0.13 引入的优化，在缺失最左前缀时仍可利用联合索引。
  通过“按最左列的唯一值依次枚举 + 构造子范围扫描”来做到部分利用索引。

</details>

<details>
<summary>原理</summary>

执行 `WHERE f2 = 40` 时，联合索引 (f1,f2) 正常无法命中最左前缀。
但 MySQL 8.0 会：

1. 获取 f1 的所有不同值（如 1,2）
2. 构造子查询：

    * `f1=1 AND f2=40`
    * `f1=2 AND f2=40`
3. 对每个子范围执行 range scan
4. 合并结果集

优势：避免 full index scan，仅扫描需要的子范围。
前提：f1 的区分度低，否则枚举成本太高。

</details>

<details>
<summary>关键点</summary>

* MySQL 5.7 → 必须遵循最左前缀
* MySQL 8.0 → 有 skip scan，但并非所有情况都启用
* skip scan 是 range 类扫描，rows 明显少于 index scan
* 只能用于 **单表查询**
* 不支持 GROUP BY / DISTINCT
* 查询列必须全部来自索引字段
* 列值必须非 NULL
* 性能依赖第一列的 **低基数（低区分度）**

</details>

<details>
<summary>扩展知识</summary>

* Skip Scan 常用于“性别、类型、状态”等低区分度字段作为联合索引前导列时的补救措施。
* 不建议利用 skip scan 反向设计索引；正确做法仍是保证最左前缀构造合理。
* 数据倾斜严重的场景，skip scan 能显著减少扫描行数。
* 优化器基于代价模型决定是否启用 skip scan。

</details>

---

## 3）面试官追问（Q&A）

**问：Skip Scan 是否破坏最左前缀匹配原则？**
答：不破坏。原理仍基于最左列，只是优化器自动枚举最左列的取值来构造子范围。

**问：为什么只有 MySQL 8.0 支持跳跃扫描？**
答：5.7 及之前的优化器不支持基于多子范围自动展开的代价模型。

**问：skip scan 什么时候会比全表/全索引扫描更慢？**
答：当联合索引第一列区分度高时，枚举次数巨大，代价更高。

**问：skip scan 能否用于模糊匹配 like '%xxx%'？**
答：不能，前缀未知仍然无序，跳跃扫描也无法确定搜索区域。

**问：skip scan 与 index condition pushdown 有何区别？**
答：ICP 负责减少回表；skip scan 负责让“缺失前导列”的查询也能利用索引。

**问：explain 哪些关键字表示启用 skip scan？**
答：Extra 字段出现 `Using index for skip scan`。

**问：skip scan 能否适用于联合索引 (a,b,c) 中跳过 a,b？**
答：不行。只能跳过最左一列，不能跳多列。

</details>

---

## 4）示意图（ASCII）

```
联合索引 (f1,f2)
-------------------------
 f1=1 → f2 排序
 f1=2 → f2 排序
 f1=3 → f2 排序
 ...

Skip Scan 执行：
for each distinct f1:
    scan range (f1=?, f2=40)

最终合并结果
```
