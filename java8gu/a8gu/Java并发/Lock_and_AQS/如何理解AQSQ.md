# ✅如何理解AQS？

# 典型回答

AbstractQueuedSynchronizer （抽象队列同步器，以下简称 AQS）出现在 JDK 1.5 中。AQS 是很多同步器的基础框架，比如 ReentrantLock、CountDownLatch 和 Semaphore 等都是基于 AQS 实现的。除此之外，我们还可以基于 AQS，定制出我们所需要的同步器。
​

​

**在AQS内部，维护了一个FIFO队列和一个volatile的int类型的state变量。在state=1的时候表示当前对象锁已经被占有了，state变量的值修改的动作通过CAS来完成。**
**​**

**​**

**FIFO队列用来实现多线程的排队工作，当线程加锁失败时，该线程会被封装成一个Node节点来置于队列尾部。**
**​**

**当持有锁的线程释放锁时，AQS会将等待队列中的第一个线程唤醒，并让其重新尝试获取锁。**

> 上图展示的是一个非公平锁，如果是公平锁则第一步只进行判断队列中是否有前序节点，如果有的话，直接入队列，不会进行第一次的CAS。**​**

#### 同步状态——state

AQS使用一个volatile int类型的成员变量来表示同步状态，在state=1的时候表示当前对象锁已经被占有了。它提供了三个基本方法来操作同步状态：getState(), setState(int newState), 和 compareAndSetState(int expect, int update)。这些方法允许在不同的同步实现中自定义资源的共享和独占方式。
​

#### FIFO队列——Node

AQS内部通过一个内部类——Node，AQS就是借助他来实现同步队列的功能的。
​

当线程尝试获取资源失败时，AQS 会将该线程包装成一个 Node 节点，并将其插入同步队列的尾部。在资源可用时，队列头部的节点会尝试再次获取资源。（在 AQS 中，Node 也用于构建条件队列。当线程需要等待某个条件时，它会被加入到条件队列中。当条件满足时，线程会被转移回同步队列。）
​

​

就这样，一个又一个Node被连接在一起，就成为了一个FIFO的队列。
​

> AQS中的阻塞队列是一个CLH队列。CLH（Craig, Landin, and Hagersten）队列是一种用于实现自旋锁的有效数据结构。它是由Craig, Landin和Hagersten首次提出的，因此得名。

# 扩展知识
## AQS有哪些实现？​

AQS全称为AbstractQueuedSynchronizer，它提供了一个FIFO队列，可以看成是一个用来实现同步锁以及其他涉及到同步功能的核心组件，常见的有：ReentrantLock、CountDownLatch、Semaphore等。
​

从本质上来说，AQS提供了两种锁机制，分别是排它锁和共享锁。
​

排它锁就是存在多线程竞争同一共享资源时，同一时刻只允许一个线程访问该共享资源，也就是多个线程中只能有一个线程获得锁资源，比如Lock中的ReentrantLock重入锁实现就是用到了AQS中的排它锁功能。
​

共享锁也称为读锁，就是在同一时刻允许多个线程同时获得锁资源，比如CountDownLatch和Semaphore都是用到了AQS中的共享锁功能。
​

### CountDownLatch、CyclicBarrier、Semaphore

### ReentrantLock

## 同步队列&条件队列

AQS 总共有两种队列，一种是**同步队列**，用于实现锁的获取和释放。还有一种是**条件队列**，条件队列也是一个FIFO队列，用于在特定条件下管理线程的等待和唤醒。
​

## 独占模式&共享模式

AQS提供了两种模式来支持不同类型的同步器：独占模式和共享模式。
​
