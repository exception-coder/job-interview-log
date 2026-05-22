# ✅如果SQL中一定要有join，该如何优化？

> 题号：0291 ｜ 分类：01_Java基础

---

## 典型回答

我们知道多表join效率很低，也介绍过通过一些方式避免join的出现，那么一定要用join的话，该如何优化，减少查询耗时呢？

> 📎 相关：[✅为什么大厂不建议使用多表join？](https://www.yuque.com/hollis666/fsn3og/qt4krg)

### 优化一，使用索引做join

MySQL是使用了嵌套循环（Nested-Loop Join）的方式来实现关联查询的，具体到算法上面主要有simple nested loop join，block nested loop join和index nested loop join这三种。

其中index nested loop，当Inner Loop的表用到字段有索引的话，可以用到索引进行查询数据，因为索引是B+树的，复杂度可以近似认为是N*logM。

 比如：`ON a.user_id = b.user_id`，那么 `a.user_id` 和 `b.user_id` 都应该有索引会更好。

### 优化二，小表驱动大表

> 📎 相关：[✅MySQL 为什么是小表驱动大表，为什么能提高查询性能？](https://www.yuque.com/hollis666/fsn3og/lxb1s5pqizgaib0k)

小表放在前面，大表放在后面的话，会使得整体的查询性能有很大提升。（当然也使用了索引的情况下）

### 优化三，数据过滤后再join

参考小表驱动大表的思路，我们可以先把表中的数据做一下where筛选过滤，把无关的数据过滤掉，这样就能尽量避免把大表和大表直接 `JOIN`，所以，一般是先使用子查询或临时表缩小数据量。

如：

```java
SELECT o.id, o.order_date, c.name
FROM (
    SELECT id, order_date, customer_id
    FROM orders
    WHERE order_date >= '2024-01-01'
) AS o
JOIN customers c ON o.customer_id = c.id;
```

```java
-- 第一步：创建临时表（或中间结果表）
CREATE TEMPORARY TABLE recent_orders AS
SELECT id, order_date, customer_id
FROM orders
WHERE order_date >= '2024-01-01';

-- 第二步：再做 JOIN
SELECT o.id, o.order_date, c.name
FROM recent_orders o
JOIN customers c ON o.customer_id = c.id;
```

### 优化四，优先使用内连接

如果不需要保留所有左表或右表数据，用 `INNER JOIN` 更高效。 因为`INNER JOIN` 的执行逻辑更加简单，他只需要保留 **两个表中都存在匹配记录的行**。而且`INNER JOIN` 在两侧字段上都容易使用到索引。`LEFT JOIN` 如果右表字段为 `NULL`，某些场景下索引会失效。

### 优化五，使用MySQL 8的hash join

> 📎 相关：[✅MySQL的Hash Join是什么？](https://www.yuque.com/hollis666/fsn3og/ci3ae75ktzkmz1dw)

hash join 是 MySQL 8.0.18版本中新推出的一种多表join的算法。Hash Join的出现就是要优化传统的Nested-Loop Join的。

Hash Join 是一种针对 equal-join 场景的优化，他的基本思想是将驱动表数据加载到内存，并建立 hash 表，这样只要遍历一遍非驱动表，然后再去通过哈希查找在哈希表中寻找匹配的行，就可以完成 join 操作了。
