总结标题：mysql_blob_vs_text

---

## 1）10 行极简速记版（纯文本）

✔ BLOB 存二进制，TEXT 存文本
🔥 BLOB 不做字符集转换，TEXT 会按字符集处理
📌 BLOB 不支持排序，TEXT 可排序
🧠 两者底层结构相似，但语义完全不同
🚀 都有 Tiny / Normal / Medium / Long 四种规格
⚠️ TEXT 会受 collation 影响，BLOB 不会
✨ BLOB 更适合图片/音频/文件等二进制大对象
📈 TEXT 更适合文章/描述/JSON 字符串
🔍 大对象字段会存溢出页，访问成本高
✘ 误用 BLOB 存文本会失去排序与字符集语义

---

## 2）折叠式知识卡片版（Markdown）

<details>
<summary>定义</summary>

BLOB（Binary Large Object）与 TEXT 都用于存储大字段：

* **BLOB**：存储二进制数据，不做字符集处理
* **TEXT**：存储文本数据，会按字符集与排序规则（collation）处理

两者在 MySQL 中底层存储结构类似，但语义完全不同。

</details>

<details>
<summary>原理</summary>

### 1. 字符集 & 排序行为差异

* **BLOB**

    * 完全按字节处理
    * 不参与字符集转换
    * 无法排序（排序按二进制比较意义不大）

* **TEXT**

    * 存储文本数据
    * 在读写时按表/列字符集处理
    * 可以排序、比较、LIKE 匹配

### 2. 存储规格

MySQL 为两类大字段提供统一的四种容量规格：

| 类型                      | 最大长度      |
| ----------------------- | --------- |
| TINYBLOB / TINYTEXT     | 255 Bytes |
| BLOB / TEXT             | 64 KB     |
| MEDIUMBLOB / MEDIUMTEXT | 16 MB     |
| LONGBLOB / LONGTEXT     | 4 GB      |

### 3. 存储结构特点

大对象字段通常存储在溢出页（overflow pages）中：

* 主记录页存指针（20 字节左右）
* 真正数据放在独立页中
* 访问代价高，不适用于频繁查询/排序字段

</details>

<details>
<summary>关键点</summary>

* TEXT 受 collation、字符集影响，会参与字符比较
* BLOB 是字节流，适合多媒体/加密数据/压缩数据
* LIKE/排序/全文索引等需求 → 优先 TEXT
* 大字段应避免出现在频繁过滤或排序条件中
* 尽量避免在主表中存储巨大的 BLOB/TEXT，必要时可拆为外部存储

</details>

<details>
<summary>扩展知识</summary>

* TEXT 字段可建立全文索引（MySQL 5.6+）
* BLOB 通常不可全文索引
* 若存储 JSON，优先用 JSON 类型而非 TEXT
* 使用 UTF8/UTF8MB4 会扩大 TEXT 实际字节长度
* 过大对象可能触发行溢出，导致额外 I/O

</details>

---

## 3）面试官追问（Q&A）

**问：为什么 BLOB 不支持字符集转换？**
答：它被设计为二进制类型，数据不具备字符语义，不应参与字符集解析。

**问：TEXT 字段排序为什么比 BLOB 慢？**
答：TEXT 排序需要使用 collation 执行字符级比较，比二进制比较更复杂。

**问：选择 BLOB 或 TEXT 的标准是什么？**
答：是否需要字符语义：存文件用 BLOB，存可读文本用 TEXT。

**问：TEXT 和 VARCHAR 的区别是什么？**
答：TEXT 存在溢出页，不能存储在行内；VARCHAR 小且可变长，通常行内存储。

**问：TEXT 是否适合做索引前缀？**
答：可做索引前缀，但需小心行溢出导致额外 I/O。

**问：存储图片用 TEXT 会怎样？**
答：容易损坏，字符集转换后内容会变形，不建议。

**问：BLOB 会受 collation 影响吗？**
答：不会，比较基于字节序。

---

## 4）示意图（ASCII）

```
           BLOB vs TEXT

        ┌──────────┬────────────┐
        │  BLOB     │   TEXT     │
────────┼──────────┼────────────┤
语义     │ 二进制     │ 文本语义     │
字符集   │ 不参与     │ 参与解析与排序 │
排序     │ 不支持     │ 支持          │
用途     │ 图片/音频  │ 文章/描述     │
规格     │ Tiny/Normal/Medium/Long (4类相同)
────────┴──────────┴────────────┘

溢出页结构：
主记录页 → 指针 → 大对象页链 → 数据页
```
