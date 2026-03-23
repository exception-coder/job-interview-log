# ✅undolog会一直存在吗？什么时候删除？

# 典型回答

undolog是innodb中重要的一种日志，他的主要作用有两个：
​

1、**事务回滚**：当事务执行过程中需要执行ROLLBACK操作时，InnoDB可以使用undolog将数据恢复到事务开始前的状态。

2、**MVCC**：InnoDB使用undolog为实现MVCC提供支持，使得不同事务可以看到数据在不同时间点的一致性快照，从而提高并发性。
​

当事务对数据进行修改（插入、更新、删除）时，会生成相应的undolog。每条记录会包含操作前的旧值。所以，根据操作类型，undolog分成两种类型：
​

insert undolog：用于记录insert操作，用于事务回滚

update undolog：用于记录update和delete操作，不仅在事务回滚时需要，在快照读时也需要
​

对于insert undolog来说，它主要用于在事务回滚时。这种日志在事务提交就不再需要了。而update undolog还要用在MVCC场景用于做快照读，所以他是不能被立即清理的。

在mysql官网中（[https://dev.mysql.com/doc/refman/8.4/en/optimizing-innodb-transaction-management.html](https://dev.mysql.com/doc/refman/8.4/en/optimizing-innodb-transaction-management.html) ）是这么描述的：
​

> 当行被update或delete时，行和关联的undolog不会立即物理删除，甚至不会在事务提交后立即删除。旧数据会一直保留到较早开始或同时开始的事务完成，以便这些事务可以访问修改或删除行的先前状态。因此，长时间运行的事务可以防止InnoDB清除由不同事务更改的数据。

InnoDB会在合适的时间进行统一清理，释放空间。这个过程称为**purge**。其实背后就是一个purge线程，purge线程在调度进行清理时，会做判断，对于insert undolog就直接清理了，但是对于update undolog，必须确保没有活跃事务需要这些日志用于一致性读。也就是说，即使事务已经提交，但只要还有其他事务在进行一致性读操作并依赖这些日志，update undolog就不能被清理。
​

那update undolog是如何判断有没有被其他事物依赖的呢？
​

其实很简单，就一句话：**如果一个事务在所有当前活跃的读事务开始之前就已经完成并提交，那么这个事务的Undo Log就可以清理，因为这些读事务不需要它来查看历史数据。**
**​**

具体来说就是，每当一个写事务开始时，InnoDB会分配一个递增的事务编号（trx_no），当写事务结束并提交时，这个事务的编号（trx_no）被用作提交序号。
​

当一个读事务开始时，它会创建一个读取视图（ReadView）。这个读取视图会记录当前看到的最大的事务提交序号，称为m_low_limit_no。这是这个读事务开始时数据库中已经提交的最大事务编号。
​

如果某个事务的编号（trx_no）小于所有活跃读事务的m_low_limit_no，说明这个事务在所有读事务开始之前就已经提交了。这意味着所有活跃的读事务都可以看到这个事务的结果，不需要再通过Undo Log来构建数据的历史版本。因此，这些Undo Log可以被清理。
