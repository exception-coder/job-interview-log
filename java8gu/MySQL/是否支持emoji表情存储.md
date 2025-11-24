总结标题：mysql_emoji_storage_utf8mb4

---

## 1）10 行极简速记版（纯文本）

✔ MySQL 能存 emoji，但必须用 utf8mb4
✘ utf8/utf8mb3 不能存补充字符（emoji 会报错）
📌 utf8mb4 是 utf8mb3 的超集
🧠 BMP 只覆盖 U+0000～U+FFFF，emoji 属于补充字符区
🔥 utf8mb3 已弃用，未来版本将移除
🚀 utf8mb4 单字符最多 4 字节，可完整存储 Unicode
➤ 生僻字/emoji 全依赖 utf8mb4
📈 表、库、连接编码需全链路改为 utf8mb4
✨ utf8 和 utf8mb4 二选一时务必指定 utf8mb4

---

## 2）折叠式知识卡片版（Markdown）

<details>
<summary>定义</summary>

MySQL 是否支持 emoji 取决于使用的字符集。emoji 属于 Unicode 补充字符（码点大于 U+FFFF），只有 **utf8mb4** 能完整编码。
**utf8/utf8mb3 只能编码 BMP（基本多文种平面），无法存储 emoji、生僻字等补充字符。**

</details>

<details>
<summary>原理</summary>

* Unicode 将字符分为 **BMP（基本平面）** 与 **补充平面**。
* utf8mb3（utf8）最多 3 字节，只能覆盖 BMP；补充字符需要 4 字节，无法表示 → 报错。
* utf8mb4 扩展为 4 字节编码，覆盖全部 Unicode 字符。
* MySQL 8.0 中 utf8 = utf8mb3，但官方已明示 utf8mb3 即将废弃。
* 字符集支持比较：

| 字符集                 | 支持字符       | 字节  |
| ------------------- | ---------- | --- |
| utf8/utf8mb3        | BMP        | 1–3 |
| utf8mb4             | BMP + 补充字符 | 1–4 |
| utf16/utf16le/utf32 | 同样支持补充字符   |     |

</details>

<details>
<summary>关键点</summary>

* emoji 是补充字符 → 必须 **utf8mb4**。
* utf8mb3 结构中不存在补充字符，升级到 utf8mb4 无数据损失。
* MySQL 8 默认 utf8mb3，所以建表需要显式 `CHARSET=utf8mb4`。
* 全链路必须一致：

    * 数据库字符集
    * 表与列字符集
    * 客户端连接字符集（`SET NAMES utf8mb4`）

</details>

<details>
<summary>扩展知识</summary>

* utf8mb4 比 utf8mb3 占用更大空间，但兼容性强且覆盖完整 Unicode。
* 业务对 emoji、生僻字、国际字符支持越来越普遍，utf8mb3 不再现实。
* 大表从 utf8 → utf8mb4 可在线转换，BMP 兼容无需额外处理：

  示例：

  ```
  ALTER TABLE t1 CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```

</details>

---

## 3）面试官追问（Q&A）

**问：为什么 utf8（MySQL）不能存 emoji？**
答：MySQL 的 utf8 = utf8mb3，只支持 3 字节，而 emoji 需要 4 字节。

**问：utf8mb4 与 utf8mb3 的关系是什么？**
答：utf8mb4 是 utf8mb3 的超集，覆盖补充字符并完全兼容 BMP。

**问：是否可以安全地把 utf8 升级为 utf8mb4？**
答：可以。BMP 编码一致，补充字符之前不存在，不会出现转换损坏。

**问：为什么 MySQL 8 还用 utf8mb3 而不是 utf8mb4？**
答：历史兼容性。官方文档已声明 utf8mb3 将被移除。

**问：utf8mb4 会不会带来性能问题？**
答：空间略增，但索引前缀/存储结构可通过合理设计缓解，现代系统普遍采用。

**问：不改客户端连接字符集会怎样？**
答：即使表支持 utf8mb4，连接为 utf8 仍无法插入 emoji，会报错或乱码。

**问：存 emoji 时最常见的报错是什么？**
答：`Incorrect string value`，表示字符无法被当前字符集编码。

**问：补充字符除了 emoji 还有什么？**
答：生僻汉字、辅助平面表情、特殊符号、大量国际字符等。

**问：为什么 utf8mb4 字符数目比 utf8 大很多？**
答：扩展编码范围（U+10000～U+10FFFF），支持所有 Unicode 字符。

---

## 4）示意图（ASCII）

```
Unicode 字符平面划分

            BMP 平面 (U+0000 ~ U+FFFF)
        +----------------------------------+
        | 常用字符、常用汉字、英文、符号    |
        +----------------------------------+

            补充平面 (U+10000 ~ U+10FFFF)
        +----------------------------------+
        | Emoji / 生僻字 / 特殊符号等      |
        +----------------------------------+

MySQL 字符集能力

utf8/utf8mb3  -->  支持 BMP（3 字节），✘ 不支持补充字符  
utf8mb4       -->  支持全部 Unicode（4 字节），✔ Emoji 支持  
```

---
