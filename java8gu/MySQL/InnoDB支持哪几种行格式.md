## 1）10 行极简速记版（小红书爆款风）

✔ 行格式 = 一行数据的“物理长相”，影响性能的大杀器
🔥 COMPACT = 默认稳健，适合大量变长字段
📌 REDUNDANT = 远古格式，兼容性强但空间浪费
🚀 DYNAMIC = COMPACT 升级版，大字段存储更灵活
🧠 COMPRESSED = 压缩省空间，但 CPU 开销更高
✨ 超 768 字节的大字段会被拆出去放溢出页
📈 DYNAMIC/COMPRESSED 基于 Barracuda，更现代
🔍 COMPACT/REDUNDANT 基于 Antelope，功能受限
⚠️ COMPRESSED 查询要解压，读性能可能下降
➤ 本质取舍：空间占用 vs 查询性能 vs 更新开销

## 2）折叠式知识卡片版

<details>
<summary>定义</summary>

InnoDB 行格式定义了数据行在数据页中的具体存储方式。不同格式对可变长度列、溢出页、空间利用和 CPU 开销有不同权衡。

</details>

<details>
<summary>原理</summary>

* **REDUNDANT**：最旧格式，字段长度偏移列表冗余，空间利用差。
* **COMPACT**：更紧凑，使用 NULL 值列表及变长字段长度列表，节省空间。
* **DYNAMIC**：COMPACT 升级，可变长字段（如 TEXT、BLOB）更多地存放在页外，减少页内膨胀。
* **COMPRESSED**：在 DYNAMIC 基础上增加压缩能力，页内/页外数据按需压缩。
* **大字段策略**：可变字段前 768 字节放页内，其余溢出页存储。

</details>

<details>
<summary>关键点</summary>

* COMPACT 是 5.0 后主流默认格式，适合大多数 OLTP 场景。
* REDUNDANT 主要用于兼容历史版本，不适合现代应用。
* DYNAMIC 空间管理更灵活，适合 BLOB/TEXT 很多的场景。
* COMPRESSED 可节省磁盘空间，适合 SSD 成本敏感或大量归档。
* 使用 COMPRESSED 会带来压缩/解压 CPU 成本。

</details>

<details>
<summary>扩展知识</summary>

文档未提但可补充：

* COMPRESSED 页常见 8K/4K 压缩模式，用于减少数据页 I/O。
* Barracuda 文件格式是现代 InnoDB 行格式的基础（DYNAMIC、COMPRESSED）。
* 选择行格式时要考虑：大字段比例、IO 开销、存储成本与业务读写模式。

</details>

## 3）面试官追问（Q&A）

问：为什么要有多种行格式？
答：为了在空间占用、访问性能、兼容性之间提供不同的权衡。

问：COMPACT 与 DYNAMIC 的核心区别是什么？
答：DYNAMIC 针对大字段存储优化，会更多放在页外，减少页内膨胀。

问：COMPRESSED 为什么会降低查询性能？
答：因为访问数据时需要解压缩，增加 CPU 消耗。

问：REDUNDANT 为什么被淘汰？
答：字段结构冗余、空间利用率低，无法支持新特性。

问：大字段存放在溢出页有什么影响？
答：减少页内部膨胀，但访问该字段需要额外 I/O。

问：哪些行格式需要 Barracuda？
答：DYNAMIC、COMPRESSED。

问：COMPACT 行格式适合什么场景？
答：普通业务系统、变长字段存在但不大量的场景。

问：为什么要记录变长字段长度？
答：因为页内数据紧凑存储，需要利用长度列表快速定位列偏移。

## 4）示意图（ASCII）

```
InnoDB 行格式族谱

REDUNDANT（旧）
 └─字段长度偏移列表冗余
COMPACT（主流）
 ├─变长长度列表
 └─NULL 列表
DYNAMIC（现代）
 ├─基于 COMPACT 改进
 └─大字段更多存页外
COMPRESSED（压缩）
 ├─基于 DYNAMIC
 └─增加页压缩功能

页外超大字段：
[页内前 768 字节] → [溢出页存剩余部分]
```
