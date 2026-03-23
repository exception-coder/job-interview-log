# ✅什么是ReadView，什么样的ReadView可见？

# 典型回答ReadView 是 InnoDB 中一个至关重要的概念，他是实现MVCC的基础，同时他也是支持不同的事务隔离级别的基础，同时提高系统的并发能力和性能。
​

他到底是干啥的？简单来说，其实就是一句话：**Read View 主要来帮我们解决可见性的问题的, 即他会来告诉我们本次事务应该看到哪个快照，不应该看到哪个****快照****。**
​

快照？
​

我们都知道，MySQL中用不同的事务隔离级别，比如我们常见的RR和RC，RR要求在一个事务中，多次读取的结果是保持一致的，而RC则要求每次都要读取到最新的值。
​

那么，具体如何实现的RR和RC的读数据的时候的不同现象，就是这个快照。
​

在可重复读（Repeatable Read）级别下，快照（ReadView）在事务开始后第一次查询时创建一次，并在整个事务期间保持不变。

在读已提交（Read Committed）级别下，快照（ReadView）会在每次查询时重新创建，以反映数据库中的最新提交更改。
​

ReadView的定义在MySQL的不同版本中不一样，拿MySQL 5.7 （8.0也一样）举例，ReadView定义如下
（[https://github.com/xiaowei520/mysql-5.7.23-source-read/blob/0d99c6709f1d982aa8674dab3fc40848908478fb/storage/innobase/read/read0read.cc#L175](https://github.com/xiaowei520/mysql-5.7.23-source-read/blob/0d99c6709f1d982aa8674dab3fc40848908478fb/storage/innobase/read/read0read.cc#L175) ）：

这几个东西是干嘛的，有啥用，代表了啥？其实，在5.6（[https://github.com/zhujzhuo/MySQL-5.6/blob/mysql-5.6.11/storage/innobase/include/read0read.h](https://github.com/zhujzhuo/MySQL-5.6/blob/mysql-5.6.11/storage/innobase/include/read0read.h) ） 中的ReadView的定义更加直观：
​

也就是说，在 Read View 中有几个重要的属性：
- **trx_ids**，表示在生成ReadView时当前系统中活跃的读写事务的事务id列表。- **low_limit_id**，应该分配给下一个事务的id 值。- **up_limit_id**，未提交的事务中最小的事务 ID。- **creator_trx_id**，创建这个 Read View 的事务 ID。​

trx_ids中包含了low_limit_id和up_limit_id的信息，其实`trx_ids = [up_limit_id,low_limit_id)`（但是需要注意，他并不一定连续，只是会包含up_limit_id，并且小于low_limit_id，比如他可能是5,7,8,11） ，并且你没看错，up_limit_id就是表示最低水位，low_limit_id就是表示最高水位，至于为啥这么叫，我也不知道。。。
​

> 网上还有些资料这里有min_trx_id、max_trx_id、m_ids等的说法，我翻了下源码5.6、5.7、8.0，并没有找到出处。就先不纠结了，以源码为准。目前看到有关于max_trx_id的定义，但是是用在二级索引的MVCC支持中的。

也就是说，每一次读取数据的时候（RC情况下），都会生成一个ReadView，并且在其中记录上trx_ids（包含了[up_limit_id,low_limit_id)）和creator_trx_id。
​

那么，一个事务应该看到哪些快照，不应该看到哪些快照该如何判断呢？
​

假如一个ReadView的内容为：
​

假设当前事务要读取某一个记录行，该记录行的 db_trx_id（即最新修改该行的事务ID）为 trx_id，那么，就有以下几种情况了：
​

- 1、trx_id< up_limit_id，即小于5的事务，说明这些事务在生成ReadView之前就已经提交了，那么该事务的结果就是可见的。

- 2、trx_id>=low_limit_id，即大于8的事务，说明该事务在生成 ReadView 后才生成，所以该事务的结果就是不可见的。

- 3、up_limit_id<trx_id<low_limit_id，即大于等于5，小于8，这种情况下，会再拿事务ID和Read View中的trx_ids进行逐一比较。- 如果，事务ID在trx_ids列表中，如6，那么表示在当前事务开启时，这个事务还是活跃的，那么这个记录对于当前事务来说应该是不可见的。- 如果，事务id不在trx_ids列表中，如7，那么表示的是在当前事务开启之前，其他事务对数据进行修改并提交了，所以，这条记录对当前事务就应该是可见的。- 当然这里有个例外情况，那就是这个trx_id=creator_trx_id，那么就肯定是可见的

总结一下就是，**一个事务，能看到的是在他开始之前就已经提交的事务的结果，而未提交的结果都是不可见的。**
**​**

那不可见的话，怎么办呢？这时候就需要用到undolog了。
​

​

​
