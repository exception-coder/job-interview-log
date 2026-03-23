# ✅实现一个LRU缓存淘汰策略，支持get和put操作

# 典型回答

LRU算法的思想是：如果一个数据在最近一段时间没有被访问到，那么可以认为在将来它被访问的可能性也很小。因此，当空间满时，最久没有访问的数据最先被淘汰。
​

一般实现有两种方式，首先是**通过继承LinkedHashMap可以实现这个功能**。
​

LinkedHashMap内部维护了一个双向链表，用于存储元素的顺序信息。当accessOrder参数为true时，LinkedHashMap会按照访问顺序来维护元素，即最近访问的元素会被移到链表尾部，而最久未使用的元素会被移到链表头部。当accessOrder参数为false时，LinkedHashMap会按照插入顺序来维护元素。
​

​

LinkedHashMap和HashMap一样提供了put、get等方法，实现细节稍有不同（以下特点为当accessOrder为true时）：
​

- put方法：- 如果指定的键已经存在，则更新对应的值，并将该元素移动到链表末尾- 如果指定的键不存在，则将新元素插入到哈希表中，并将其插入到链表末尾- get方法：- 如果指定的键不存在，则返回null；- 如果指定的键存在，则返回对应的值，并将该元素移动到链表末尾​

但是，需要注意的是，LinkedHashMap默认情况下不会移除元素的，不过，LinkedHashMap中预留了方法afterNodeInsertion，在插入元素之后这个方法会被回调，这个方法的默认实现如下：
​

可以看到，如果我们可以实现removeEldestEntry方法， 让他返回true的话，就可以执行删除节点的动作。所以，一个基于**LinkedHashMap的LRU实现如下：**
**​**

以上，就是一个最简单的LRU 缓存的实现方式了。
​

除此之外，还有一些其他的方式也可以实现，比如**基于LinkedList+HashMap也可以简单的实现**：
​

​

借助LinkedList来保存key的访问情况，将新的key或者刚刚被访问的key放在末尾，这样在移除的时候，可以从队头开始移除元素。
