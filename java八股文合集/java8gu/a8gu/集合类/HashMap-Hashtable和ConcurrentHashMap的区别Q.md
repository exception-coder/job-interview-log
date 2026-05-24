# ✅HashMap、Hashtable和ConcurrentHashMap的区别？

# 典型回答**线程安全：**
**​**

HashMap是非线程安全的。
Hashtable 中的方法是同步的，所以它是线程安全的。
ConcurrentHashMap在JDK 1.8之前使用分段锁保证线程安全， ConcurrentHashMap默认情况下将hash表分为16个桶（分片），在加锁的时候，针对每个单独的分片进行加锁，其他分片不受影响。锁的粒度更细，所以他的性能更好。
ConcurrentHashMap在JDK 1.8中，采用了一种新的方式来实现线程安全，即使用了CAS+synchronized，这个实现被称为"分段锁"的变种，也被称为"锁分离"，它实现的锁的粒度更细。
​

​

**继承关系：**
Hashtable是基于陈旧的Dictionary类继承来的。
HashMap继承了抽象类AbstractMap实现了Map接口。
ConcurrentHashMap同样继承了抽象类AbstractMap，并且实现了ConcurrentMap接口。
​

**允不允许null值：**
HashTable中，key和value都不允许出现null值，否则会抛出NullPointerException异常。 
HashMap中，null可以作为键或者值都可以。
ConcurrentHashMap中，key和value都不允许为null。
​

​

**默认初始容量和扩容机制：**
​

HashMap的默认初始容量为16，默认的加载因子为0.75，即当HashMap中元素个数超过容量的75%时，会进行扩容操作。扩容时，容量会扩大为原来的两倍，并将原来的元素重新分配到新的桶中。
​

Hashtable，默认初始容量为11，默认的加载因子为0.75，即当Hashtable中元素个数超过容量的75%时，会进行扩容操作。扩容时，容量会扩大为原来的两倍加1，并将原来的元素重新分配到新的桶中。
​

ConcurrentHashMap，默认初始容量为16，默认的加载因子为0.75，即当ConcurrentHashMap中元素个数超过容量的75%时，会进行扩容操作。扩容时，容量会扩大为原来的两倍，并会采用分段锁机制，将ConcurrentHashMap分为多个段(segment)，每个段独立进行扩容操作，避免了整个ConcurrentHashMap的锁竞争。
 
​

**遍历方式的内部实现上不同 ：**
​

HashMap使用EntrySet进行遍历，即先获取到HashMap中所有的键值对(Entry)，然后遍历Entry集合。支持fail-fast，也就是说在遍历过程中，若HashMap的结构被修改（添加或删除元素），则会抛出ConcurrentModificationException。如果只需要遍历HashMap中的key或value，可以使用KeySet或Values来遍历。
​

Hashtable使用Enumeration进行遍历，即获取Hashtable中所有的key，然后遍历key集合。这个过程也会判断是否存在并发修改：
​

​

ConcurrentHashMap使用分段锁机制，因此在遍历时需要注意，遍历时ConcurrentHashMap的某个段被修改不会影响其他段的遍历。可以使用EntrySet、KeySet或Values来遍历ConcurrentHashMap，其中EntrySet遍历时效率最高。遍历过程中，ConcurrentHashMap的结构发生变化时，不会抛出ConcurrentModificationException异常，但是在遍历时可能会出现数据不一致的情况，因为遍历器仅提供了弱一致性保障。
​

​

| 特性/集合类 | HashMap | Hashtable | ConcurrentHashMap |
| 线程安全 | 否 | 是，基于方法锁 | 是，基于分段锁（分段锁是个概念，并不是说只有Segment那种才叫分段锁，详见CHM的不同版本介绍的文章。） |
| 继承关系 | AbstractMap | Dictionary | AbstractMap，ConcurrentMap |
| 允许null值 | K-V都允许 | K-V都不允许 | K-V都不允许 |
| 默认初始容量 | 16 | 11 | 16 |
| 默认加载因子 | 0.75 | 0.75 | 0.75 |
| 扩容后容量 | 原来的两倍 | 原来的两倍加1 | 原来的两倍 |
| 是否支持fail-fast | 支持 | 支持 | fail-safe |
