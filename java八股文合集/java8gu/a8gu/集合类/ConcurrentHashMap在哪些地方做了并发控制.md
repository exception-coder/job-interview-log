# ✅ConcurrentHashMap在哪些地方做了并发控制

# 典型回答对于JDK1.8来说，如果用一句话来讲的话，ConcurrentHashMap是通过synchronized和CAS自旋保证的线程安全，要想知道ConcurrentHashMap是如何加锁的，就要知道HashMap在哪些地方会导致线程安全问题，如初始化桶数组阶段和设置桶，插入链表，树化等阶段，都会有并发问题。
​

解决这些问题的前提，就要知道到底有多少线程在对map进行写入操作，这里ConcurrentHashMap通过sizeCtl变量完成，如果其为负数，则说明有多线程在操作，且Math.abs(sizeCtl)即为线程的数目。

## 初始化桶阶段

如果在此阶段不做并发控制，那么极有可能出现多个线程都去初始化桶的问题，导致内存浪费。所以Map在此处采用自旋操作和CAS操作，如果此时没有线程初始化，则去初始化，否则当前线程让出CPU时间片，等待下一次唤醒，源码如下：

## 
## put元素阶段如果hash后发现桶中没有值，则会直接采用CAS插入并且返回
如果发现桶中有值，则对流程按照当前的桶节点为维度进行加锁，将值插入链表或者红黑树中，源码如下：

## 
## 扩容阶段多线程最大的好处就是可以充分利用CPU的核数，带来更高的性能，所以ConcurrentHashMap并没有一味的通过CAS或者锁去限制多线程，在扩容阶段，ConcurrentHashMap就通过多线程来加速扩容。
在分析之前，我们需要知道两件事情：
​

- ConcurrentHashMap通过ForwardingNode来记录当前已经桶是否被迁移，如果`oldTable[i] instanceOf ForwardingNode`则说明处于i节点的桶已经被移动到newTable中了。它里面有一个变量nextTable，指向的是下一次扩容后的table- transferIndex记录了当前扩容的桶索引，最开始为oldTable.length，它给下一个线程指定了要扩容的节点得知到这两点后，我们可以梳理出如下扩容流程：
- 通过CPU核数为每个线程计算划分任务，每个线程最少的任务是迁移16个桶- 将当前桶扩容的索引transferIndex赋值给当前线程，如果索引小于0，则说明扩容完毕，结束流程，否则- 再将当前线程扩容后的索引赋值给transferIndex，譬如，如果transferIndex原来是32，那么赋值之后transferIndex应该变为16，这样下一个线程就可以从16开始扩容了。这里有一个小问题，如果两个线程同时拿到同一段范围之后，该怎么处理？答案是ConcurrentHashMap会通过CAS对transferIndex进行设置，只可能有一个成功，所以就不会存在上面的问题- 之后就可以对真正的扩容流程进行加锁操作了

# 知识扩展
## ConcurrentSkipListMap和ConcurrentHashMap有什么区别ConcurrentSkipListMap是一个内部使用跳表，并且支持排序和并发的一个Map，是线程安全的。一般很少会被用到，也是一个比较偏门的数据结构。
​

简单介绍下跳表（跳表是一种允许在一个有顺序的序列中进行快速查询的数据结构。在普通的顺序链表中查询一个元素，需要从链表头部开始一个一个节点进行遍历，然后找到节点。如图1。跳表可以解决这种查询时间过长，其元素遍历的图示如图2，跳表是一种使用”空间换时间”的概念用来提高查询效率的链表。）；
​

ConcurrentSkipListMap 和 ConcurrentHashMap 的主要区别：
- 底层实现方式不同。C**oncurrentSkipListMap底层基于跳表。ConcurrentHashMap底层基于Hash桶和红黑树**- **ConcurrentHashMap不支持排序。ConcurrentSkipListMap支持排序。**

## 
## SynchronizedList和Vector的区别Vector是java.util包中的一个类。 SynchronizedList是java.util.Collections中的一个静态内部类。
在多线程的场景中可以直接使用Vector类，也可以使用Collections.synchronizedList(List list)方法来返回一个线程安全的List。
1.如果使用add方法，那么他们的扩容机制不一样。 
2.SynchronizedList可以指定锁定的对象。即锁粒度是同步代码块。而Vector的锁粒度是同步方法。
3.SynchronizedList有很好的扩展和兼容功能。他可以将所有的List的子类转成线程安全的类。 
4.使用SynchronizedList的时候，进行遍历时要手动进行同步处理。
5.SynchronizedList可以指定锁定的对象。
