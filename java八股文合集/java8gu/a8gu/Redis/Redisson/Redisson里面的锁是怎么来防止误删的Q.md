# ✅Redisson里面的锁是怎么来防止误删的？

# 典型回答

先看问题，Redisson怎么误删，其实所谓的误删其实就是删除了别的线程加的锁，为什么会发生这种情况呢？假如两个线程的执行顺序是如下的：
​

| **线程1** | **线程2** |
| 加锁成功（设置了超时时间） |  |
| 执行业务逻辑 |  |
| 锁到期，被自动删除 | ​ |
| ​ | 加锁成功 |
| ​ | 执行业务逻辑 |
| 业务逻辑执行完，解锁 |  |
​

那么，如果没有在解锁的时候做一些额外的判断，是可能会线程1把线程2的锁给解了的。那么，Redisson作为一个成熟的框架，他是如何解决这个问题的呢？
​

> Redisson一旦设置了超时时间，watchdog就不会续期了，就可能出现上面的情况。[https://www.yuque.com/hollis666/fsn3og/fg0f0wh41g8eu5ik](https://www.yuque.com/hollis666/fsn3og/fg0f0wh41g8eu5ik)

这种题，就是**讲源码**最有说服力了。
​

先来看Redisson加锁的核心lua相关的代码，在[RedissonLock#tryLockInnerAsync](https://github.com/redisson/redisson/blob/master/redisson/src/main/java/org/redisson/RedissonLock.java)中。
​

​

这段lua脚本执行之后，最终会在Redis中存一个Hash结构，key就是我们指定的加锁的key的名字，比如Hollis666，然后存储的hash的key是一个真正的lockName，存储的值是这个锁被重入的次数。
​

啥叫真正的lockName呢，其实就是上面的getLockName方法的实现：
​

其实就是用当前RedissonClient实例的UUID拼上当前线程的ID，如`b983c153-8e53-4c04-beb8-0c34d6e0237d:132`。
​

而为了**避免误删，也就是把别人的锁给解了，这就需要解锁的时候也需要用到这个lockName了。看一下解锁的代码，在在**[**RedissonLock#unlockInnerAsync**](https://github.com/redisson/redisson/blob/master/redisson/src/main/java/org/redisson/RedissonLock.java)**中。**
**​**

可以看到，这里面也把getLockName(threadId)的结果传到lua脚本中了，作为ARGV[3] 
​

可以看到，上面的代码中，Lua 脚本首先会检查 Redis 中锁 Key 对应的 Hash 结构中，是否存在一个 Field 等于 `ARGV[3]`（即当前客户端的 `UUID:threadId`）。
- 如果不存在：说明在当前客户端准备解锁时，这把锁已经不属于它了。此时，脚本直接返回 `nil`，而不是执行删除操作。这直接防止了误删他人锁的行为。不存在可能的原因有：- 锁早已过期被自动删除（设置了超时时间，就不自动续期了），然后被其他客户端获取。- 客户端试图释放一个它从未持有的锁。- 如果存在：- 说明是锁的所有者， then 将重入次数减 1。- 如果减 1 后重入次数大于 0，说明当前线程多次锁（可重入），还没有完全释放。此时只刷新过期时间，不删除 Key。- 只有重入次数减到 0 时，才执行 `del KEYS[1]` 删除整个锁 Key。​

**所以，总结一下，就是在加锁的时候，Redisson并没有单纯用一个string类型来存储一个固定值，比如和key相同，或者存个固定数字，而是存储了一个hash结构，然后针对这个hash结构中的元素的的key设置为lockName，lockName其中包含了当前的线程id，并且在解锁的时候也会通过同样的这个lockName来做解锁判断，如果不一致，则不执行解锁的动作。**（为什么要用hash结构？主要是为了更方便的实现可重入：[https://www.yuque.com/hollis666/fsn3og/ucarmoyv1belggn0](https://www.yuque.com/hollis666/fsn3og/ucarmoyv1belggn0)）
**​**
