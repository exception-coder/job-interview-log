# ✅慢SQL问题排查

### 问题发现​

线上有一个反欺诈相关的定时任务执行连续多次失败：
​

于是紧急排查日志，发现在任务执行的时间段，有大量报错：
​

在这个日志的上下文不远处就定位到这条慢SQL：
​

这条SQL的主要目的是找到是否有买卖家之间存在关联关系的数据。
​

通过执行explain，我们看了一下执行计划：
| id | 1 |
| select_type | SIMPLE |
| table | fraud_risk_case |
| partitions | *NULL* |
| **type** | **index** |
| possible_keys | idx_byr_slr_product |
| **key** | idx_byr_slr_product |
| key_len | 1546 |
| ref | *NULL* |
| **rows** | **4133627** |
| filtered | 0.19 |
| **Extra** | **Using where; Using index** |

通过这个执行计划可以发现，type = index ，extra = Using where; Using index ，表示SQL因为不符合最左前缀匹配，而扫描了整颗索引树，故而很慢。
​

于是查看这张表的建表语句，确实存在subject_id_enum和product_type_enum字段的联合索引，但是这个字段并不是前导列：
​

### 问题解决

定位到问题之后，那解决起来就很简单了，只需要增加正确的索引或者修改SQL就行了。于是修改表结构，增加新的索引：
	

经过修改后，再执行以下执行计划：
​

| id | 1 |
| select_type | SIMPLE |
| table | fraud_risk_case |
| partitions | *NULL* |
| **type** | **ref** |
| possible_keys | idx_byr_slr_product,idx_subject_type_product_user |
| key | **idx_subject_type_product_user** |
| key_len | 516 |
| ref | const,const |
| rows | 1 |
| filtered | 19.00 |
| Extra | **Using where; Using index; Using temporary; Using filesort** |
​

可以看到，type=ref，说明用到了普通索引，你并且rows也变少了，整个SQL大大提升了查询速度，任务失败的问题得到解决。
​

参考：
​
