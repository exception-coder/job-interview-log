# ✅MySQL的优化器的索引成本是怎么算出来的？

# 典型回答

在上面的文章中，我们介绍过，MySQL 是基于成本来选择索引的，并且也列举了一些可能会影响成本的因素，那么具体到细节上，这个成本是如何计算出来的呢？包括哪些内容呢？
​

其实在 MySQL中，一条 SQL 的成本主要就是包含了 CPU 的成本和 IO的成本两部分
**​**

CPU Cost 表示计算的开销，通过`select * from mysql.server_cost`查看（MySQL 8.0）
​

主要包含了：
​

- disk_temptable_create_cost：创建磁盘临时表的成本- disk_temptable_row_cost：磁盘临时表中每条记录的成本- key_compare_cost：索引键值比较的成本- memory_temptable_create_cost：创建内存临时表的成本- memory_temptable_row_cost：内存临时表中每条记录的成本- row_evaluate_cost：记录间的比较成本​

可以看到，创建临时表的成本是最高的，索引键值比较的成本比较低。
​

IO Cost 表示引擎层 IO 的开销，通过`select * from mysql.engine_cost`查看（MySQL 8.0）
​

主要包含了：
​

- io_block_read_cost：从磁盘读取一个页的成本- memory_block_read_cost：从内存读取一个页的成本​

可以看到，从磁盘中读取一个页的成本（1）是从内存中读取一个页的成本（0.25）的4倍。
​

当我们想看一个 SQL 的执行成本时，可以通过 `explain  FORMAT=json `的方式来查看，得到的结果如下：
​

主要关注 cost_info 即可，
- read_cost 表示就是从Engine读取数据的 IO 成本；- eval_cost 表示 Server 层的 CPU 成本；- prefix_cost 表示这条 SQL 的总成本；- data_read_per_join 表示总的读取记录的字节数。
通过这几个指标，我们就能大致分析出，一个 SQL在执行过程中，哪部分成本最高，然后再具体去分析他进一步的原因。比如发现是 IO 成本高，那么就继续分析可能是因为发生了大量的回表，导致磁盘读取的次数比较多，导致了 IO 成本高，进而导致了 SQL 变慢！
