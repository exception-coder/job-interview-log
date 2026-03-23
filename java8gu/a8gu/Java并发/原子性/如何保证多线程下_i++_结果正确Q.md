# ✅如何保证多线程下 i++ 结果正确？

# 典型回答

想要保证多线程情况下，i++的正确性，需要考虑可见性、原子性及有序性。
​

在并发编程中，我们能用到的并发工具无非就是synchronized，volatile，reentrantLock以及并发工具类如AtomicInteger等。
​

这里面，除了volatile不可以以外（因为他没办法保证原子性），其他几种方式都可以。
​

使用 AtomicInteger 类：
​

使用synchronized：
​

使用reentrantLock：
​
