# ✅Redisson里面的锁是如何实现可重入的？

# 典型回答

所谓可重入，就是同一个线程在运行过程中，如果多次拿同一把锁，需要让他可以获取成功。可重入的锁可以有效的避免死锁的问题。

这种题，就是**讲源码**最有说服力了。（这句话好像在哪见过，确实，Redisson讲不误删的也有这句话，而且下面的代码也都一样的。因为这俩问题是一段代码解决的。[https://www.yuque.com/hollis666/fsn3og/ucarmoyv1belggn0](https://www.yuque.com/hollis666/fsn3og/ucarmoyv1belggn0)）
​

先来看Redisson加锁的核心lua相关的代码，在[RedissonLock#tryLockInnerAsync](https://github.com/redisson/redisson/blob/master/redisson/src/main/java/org/redisson/RedissonLock.java)中。
​

​

这段lua脚本执行之后，最终会在Redis中存一个Hash结构，key就是我们指定的加锁的key的名字，比如Hollis666，然后存储的hash的key是一个真正的lockName（不展开了，在介绍误删的文章中有），存储的值是这个锁被重入的次数。
​

那么也就是说，如果同一个线程，多次加锁的话，lockName是一样的，那么这段lua都能执行成功，每次执行都会给hash中存的value的值+1。这样就实现了可重入。
​

而每一次都+1了，什么时候可以真正的解锁，也就是把和这个key彻底删除呢。**看一下解锁的代码，在**[**RedissonLock#unlockInnerAsync**](https://github.com/redisson/redisson/blob/master/redisson/src/main/java/org/redisson/RedissonLock.java)**中。**
**​**

可以看到，这里面也把getLockName(threadId)的结果传到lua脚本中了，作为ARGV[3] 
​

可以看到，上面的代码中，Lua 脚本首先会检查 Redis 中锁 Key 对应的 Hash 结构中，是否存在一个 Field 等于 `ARGV[3]`（即当前客户端的 `UUID:threadId`）。
- 如果不存在：说明在当前客户端准备解锁时，这把锁已经不属于它了。此时，脚本直接返回 `nil`，而不是执行删除操作。这直接防止了误删他人锁的行为。不存在可能的原因有：- 锁早已过期被自动删除（设置了超时时间，就不自动续期了），然后被其他客户端获取。- 客户端试图释放一个它从未持有的锁。- 如果存在：- 说明是锁的所有者， then 将重入次数减 1。- 如果减 1 后重入次数大于 0，说明当前线程多次锁（可重入），还没有完全释放。此时只刷新过期时间，不删除 Key。- 只有重入次数减到 0 时，才执行 `del KEYS[1]` 删除整个锁 Key。​

**所以，总结一下，就是在加锁的时候，Redisson并没有单纯用一个string类型来存储一个固定值，比如和key相同，或者存个固定数字，而是存储了一个hash结构，然后针对这个hash结构中的元素的的key设置为lockName，lockName其中包含了当前的线程id，value为加锁次数。从0开始，第一次加锁就设置为1。每一次加锁的时候如果对应的lockName已经存在了，则次数+1，并且在解锁的时候也会通过同样的这个lockName来做解锁判断，如果已经有值了，则-1，然后再判断剩余的次数是否大于0，如果不大于0了，则删除对应的key-value。**
**​**
