# ✅如何将集合变成线程安全的？

# 典型回答- 在调用集合前，使用synchronized或者ReentrantLock对代码加锁（读写都要加锁）​

​

- 使用ThreadLocal，将集合放到线程内访问，但是这样集合中的值就不能被其他线程访问了​

​

- 使用Collections.synchronizedXXX()方法，可以获得一个线程安全的集合​

​

- 使用不可变集合进行封装，当集合是不可变的时候，自然是线程安全的

或者：
​

# 扩展知识
## Java有哪些线程安全的集合？Java1.5并发包（java.util.concurrent）包含线程安全集合类，允许在迭代时修改集合。
Java并发集合类主要包含以下几种：
- ConcurrentHashMap- ConcurrentLinkedDeque- ConcurrentLinkedQueue- ConcurrentSkipListMap- ConcurrentSkipListSet- CopyOnWriteArrayList- CopyOnWriteArraySet
## 什么是写时复制？
