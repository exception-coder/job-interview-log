# ✅Zookeeper是如何保证创建的节点是唯一的？

# 典型回答

Zookeeper通过两个手段来保证节点创建的唯一性：
​

1、所有的写请求都会由Leader进行，即使是请求到Follower节点，也会被转发到Leader节点上执行。
2、在Leader上写入数据的时候，通过加锁(synchronized)和CAS（ConcurrentHashMap）操作，保证了并发情况下只有一个线程可以添加成功。
​

第一点我们就不展开讲了，这个是ZK中的角色天然具备的特性，我们重点展开说说第二点原因。我们来看下ZK的源码，看看到底是如何创建节点的。
​

以下代码在[github](https://github.com/apache/zookeeper/blob/15f29b51a22bc51b9d6074cb7f3e72bb00a9753a/zookeeper-server/src/main/java/org/apache/zookeeper/server/DataTree.java#L416)中可以看到，在DataTree的createNode方法就是进行节点创建的：
​

以上代码中，第10 行，针对当前要创建的节点的父节点添加了互斥锁，主要是用来避免并发，这样就可以在同一时刻，只有一个线程可以在父节点下写内容。
​

那么，接下来，就只需要保证当前获得锁的线程，不会多创建出节点就好了。
​

首先，第24-27行，做校验，判断当前父节点的所有子节点中，是否包含我们此次要创建的节点，如果已经包含，直接抛异常即可。
​

如果通过了这几行的校验，那么就继续向下执行节点的创建就行了。
​

以上，一锁、二判、三更新，是不是很像我们介绍的幂等问题的解决思路？
​

接下来会创建一个节点，并把它放到nodes中：
​

这里的nodes是ZK自定义的一个NodeHashMap类型，他其实就是维护了ZK中的节点的一个数据结构。他的实现其实是基于ConcurrentHashMap实现的：
​

可以看到，他的put方法其实就是调用的ConcurrentHashMap的put方法实现的，而ConcurrentHashMap的并发安全性不需要我们过多介绍了。
​

以上，就是ZK中创建节点的方法的主要实现。
​

先是通过synchronized锁，将父节点锁住，然后再在锁里面判断是否已经存在节点，如果已存在，直接抛异常，如果不存在，则向维护了节点的map——NodeHashMap中添加当前节点。
