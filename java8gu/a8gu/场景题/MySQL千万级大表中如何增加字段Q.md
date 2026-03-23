# ✅MySQL千万级大表中如何增加字段？

# 典型回答

这个问题其实考察的是数据库在增加字段过程中可能会存在的锁表导致影响到正常的业务的增删改查操作如何解决，因为千万级大表的话，增加字段的过程会耗时比较长，所以如果处理不好，影响可能就格外的大。

### OnlineDDL**首先，如果你用的是MySQL，并且版本是大于等于5.6的，并且你用的是InnoDB，那么这个事儿就很简单到，简单到你直接找一个非业务高峰期执行ALTER TABLE就行了。因为这个版本开始有了一个新特性，叫做****OnlineDDL**
​

Online DDL（在线DDL）简单点说就是允许在表上执行DDL的操作的同时不阻塞并发的DML操作和查询操作。
​

有了OnlineDDL之后，在表上增加列就可以用到其中的inplace的方式（原理上文有介绍），这个过程中是允许并发的增删改查的。
​

使用OnlineDDL进行增加字段的SQL如下：

但是也需要注意，即使有了OnlineDDL，也需要注意不要在业务高峰期执行增加字段的操作。因为Online DDL 在执行过程中还是会占用系统资源，如 CPU、内存和 I/O的，尤其是在某些复杂操作（如涉及索引重建、大量数据的表结构更改）中，可能仍会有短暂的锁表情况。
​

### pt-online-schema-change

如果不能用OnlineDDL，比如不是MySQL，或者不是InnoDB，或者是版本低于5.6那么，**可以使用Percona的**
`**pt-online-schema-change**`**工具来操作。**这里不展开讲，只说下简单原理和用法，详见：[https://docs.percona.com/percona-toolkit/pt-online-schema-change.html](https://docs.percona.com/percona-toolkit/pt-online-schema-change.html)
​

这是 Percona 提供的工具，用于 **在线无锁修改大表结构**。它的原理是：
- 创建一个带新字段的临时表。- 增量复制原表数据到新表（通过触发器）。- 切换表名。​

​

- `**--alter**`：新增字段的SQL语句。- `**--no-drop-old-table**`：保留旧表（便于回滚）。- `**--max-load**`：当负载超过阈值时暂停操作。​

### 其他工具

除了以上方案之外，还有一些其他的第三方工具也能实现类似的功能比如：
​

[https://github.com/github/gh-ost](https://github.com/github/gh-ost)
