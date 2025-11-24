varchar_len_diff

（1）10 行极简速记版
✔ VARCHAR(n) 限制“最大字符数”而非字节
📌 存“Hollis”时 VARCHAR(10) = VARCHAR(100)
🔥 真正差异出在排序与临时表内存占用
⚠️ 排序时按最大长度分配内存：100 明显更重
🧠 VARCHAR(100) 更容易触发 rowid sort 与磁盘 sort
📈 GROUP BY 同理，字段越长越容易落盘
➤ InnoDB 索引存实际长度，不按定义长度分配
✨ 索引页占用与 VARCHAR(10)/VARCHAR(100) 无关
🚀 最佳实践：长度按实际业务需要而非无限放大

---

## （2）折叠式知识卡片版

<details>
<summary><strong>1）定义</strong></summary>

* VARCHAR(n) 表示最大可存储 n 个“字符”，非字节。
* 存储真实数据时只占实际字符长度 + 长度字节，不会按 n 预留空间。
* VARCHAR(10) 与 VARCHAR(100) 若存同样字符，行存储无差异。

</details>

<details>
<summary><strong>2）原理</strong></summary>

### 1）存储层

* InnoDB 对 VARCHAR 采用变长存储，仅存实际长度；不会因为定义 100 就占 100 字节。

### 2）排序与临时表（核心差异）

* 排序（ORDER BY、GROUP BY）时，MySQL 会在 sort_buffer 或临时表中为字段按“定义长度”预留空间：

    * VARCHAR(10) → 预留 10 chars
    * VARCHAR(100) → 预留 100 chars
* 影响：

    * sort_buffer 更容易被撑爆
    * 超限触发 rowid sort（需回表）
    * 更容易触发磁盘临时表与磁盘排序

### 3）索引层

* InnoDB 索引存的是**实际长度**的变长字段，而非 n 个字符的最大空间。
* 因此 VARCHAR(100) 不会比 VARCHAR(10) 增加 B+Tree 页空间（若数据长度相同）。

</details>

<details>
<summary><strong>3）关键点</strong></summary>

* VARCHAR(n) 最大长度越大，排序/分组时消耗内存越大。
* 大长度字段更易触发 filesort → 性能变差。
* 索引占用由实际数据长度决定，与定义最大值无关。
* 宽 VARCHAR 字段对 ORDER BY、GROUP BY 性能影响显著。
* 行存储无性能差异，但临时表与排序成本差异巨大。

</details>

<details>
<summary><strong>4）扩展知识</strong></summary>

* MySQL 排序策略受 max_length_for_sort_data、sort_buffer_size 影响。
* 当排序字段定义过大时，优化器更倾向使用 rowid sort（需要二次回表）。
* VARCHAR 长度越大，字符集越重（如 utf8mb4），排序成本倍增。
* 生产表设计中推荐：字符串长度按实际业务最大值合理配置，不要无脑 VARCHAR(255)。

</details>

---

## （3）面试官追问（Q&A）

**问：VARCHAR(100) 和 VARCHAR(10) 在相同数据下占用空间是否不同？
答：不不同。InnoDB 按实际长度存储，二者存“Hollis”占用相同空间。**

**问：为什么 VARCHAR(100) 排序更慢？
答：排序需要在内存（sort_buffer）中按定义长度预留空间，100 字符明显比 10 字符占用更多内存，导致更容易落盘或 rowid sort。**

**问：rowid sort 是什么？为何性能差？
答：当单行排序字段太大时，MySQL 不拷贝全字段，只拷贝 rowid，排序后再回表取数据，多一次随机 IO，因此慢。**

**问：VARCHAR(100) 是否会导致索引页更大？
答：不会。InnoDB 索引对变长字段仅存实际长度，不按定义最大长度扩展。**

**问：GROUP BY 为什么也会受 VARCHAR 长度影响？
答：分组键也需要进入临时表，其内存/磁盘行为与排序完全一致，同样受定义长度影响。**

**问：VARCHAR 过大可能引发哪些性能问题？
答：sort_buffer 爆、临时表落盘、rowid sort、磁盘排序频率上升、CPU 复制开销增大。**

**问：设计 VARCHAR 长度的合理标准是什么？
答：根据业务字段最大长度 + 安全余量，避免宽泛定义如 VARCHAR(255)。**

**问：宽 VARCHAR 是否影响索引选择？
答：不会影响 B+Tree 本身，但排序与 group by 性能会恶化，从侧面影响执行计划选择。**

---

## （4）示意图（ASCII）

```
行存储（InnoDB）
实际存储：len + data
VARCHAR(10):  [len][Hollis]
VARCHAR(100): [len][Hollis]
→ 相同

```

```
排序内存占用
sort_buffer:
VARCHAR(10)  → |----------10 chars---------|
VARCHAR(100) → |------------------100 chars------------------|
→ 长字段更易溢出导致磁盘排序
```

```
索引结构（仅存实际长度）
B+Tree Leaf:
[pk][len][data]  ← data 为实际字节数，与定义无关
```
