# ✅MySQL单表一千万条数据怎么做分页查询？

> 题号：0812 ｜ 分类：05_MySQL

---

## 典型回答

这其实是一个大数据量查询的问题，一千万级别数据量的表的话，MySQL还是可以扛得住的，即使是单表也问题不大，但是也需要注意查询的性能以及深分页的问题。

所以，这个问题主要是需要从以下几个方面来做思考和优化。

### 索引使用

首先是查询的方式，首先可以确定的是，我们一定要走索引查询。千万级数据量，如果不走索引的话，那妥妥是个慢SQL了，所以必须要走索引。

在索引上，尽可能的选择唯一索引（包括主键索引），因为唯一性索引的话查询起来会更快一点。

其次的话，如果能用到索引覆盖，尽可能通过索引覆盖来查询，这样就可以避免回表带来的消耗了。

> 📎 相关：[✅什么是索引覆盖、索引下推？](https://www.yuque.com/hollis666/fsn3og/gpg6mivy21wg0r55)

### 避免深分页

这个问题中，比较重要的就是一个分页的前提，我们想要做分页，就需要考虑深分页的问题：

> 📎 相关：[✅MySQL的深度分页如何优化](https://www.yuque.com/hollis666/fsn3og/et8lo7l10rg7g7iy)

而针对1000万的数据，当我们查询后面的部分页的时候，就会出现深分页的问题，所以我们需要想办法来避免。

比如通过记录上一页的最大ID的方式来实现查询：

```java
-- 第 1 页
SELECT * FROM large_table WHERE id > 0 ORDER BY id ASC LIMIT 100;

-- 第 N 页（假设上一页最后一条数据的 id 为 500）
SELECT * FROM large_table WHERE id > 500 ORDER BY id ASC LIMIT 100;

```

还可以通过子查询来实现分页：

```java
-- 定位第 N 页起点
SELECT *
FROM large_table
WHERE id >= (
    SELECT id FROM large_table ORDER BY id ASC LIMIT 1000, 1
)
ORDER BY id ASC
LIMIT 100;
```

这样可以避免因OFFSET导致的大量无效扫描（具体原理见上文）。但是这个方案不适合ID不连续的场景。

以上都是我们常用的一些解决深分页的方案。

另外，还有就是当需要查询后几页的数据时，倒序查询可以减少扫描数据量：

```java
-- 查询最后一页
SELECT *
FROM large_table
ORDER BY id DESC
LIMIT 100;
```
