# ✅Spring的事务在多线程下生效吗？为什么？

# 典型回答

Spring 的事务有多种实现，主要包括了声明式事务和编程式事务。
​

​

**如果是我们常用的@Transactional这种声明式事务的话，在多线程情况下是无法生效的**。主要是因为@Transactional 的事务管理使用的是 ThreadLocal 机制来存储事务上下文，而** ThreadLocal 变量是线程隔离的**，即每个线程都有自己的事务上下文副本。因此，在多线程环境下，Spring 的声明式事务会“失效”，即新线程中的操作不会被包含在原有的事务中。
​

不过，**如果需要管理跨线程的事务，我们可以使用编程式事务**，即自己用 TransactionTemplate 或PlatformTransactionManager 来控制事务的提交。
​

# 扩展知识

## 源码解析

@Transactional 的事务管理入口在TransactionManager的实现中，如我们看一下[DataSourceTransactionManager类的实现](https://github.com/spring-projects/spring-framework/blob/main/spring-jdbc/src/main/java/org/springframework/jdbc/datasource/DataSourceTransactionManager.java#L304)。
​

看一下他的doBegin方法：
​

重点是上面的第47-49行代码，这里是把一个connection和当前线程进行绑定。看下[绑定代码的实现](https://github.com/spring-projects/spring-framework/blob/main/spring-tx/src/main/java/org/springframework/transaction/support/TransactionSynchronizationManager.java#L76)：
​

这里面关键的一部就是第11行， resources.set(map);这个resources是啥呢？
​

​

看到了吧，ThreadLocal ！！！这个[NamedThreadLocal](https://github.com/spring-projects/spring-framework/blob/main/spring-core/src/main/java/org/springframework/core/NamedThreadLocal.java)其实就是可以定义一个名字的ThreadLocal而已。
