# ✅Redisson的watchdog机制是怎么样的？

# 典型回答

为了避免Redis实现的分布式锁超时，Redisson中引入了watch dog的机制，他可以帮助我们在Redisson实例被关闭前，不断的延长锁的有效期。
​

**自动续租**：当一个Redisson客户端实例获取到一个分布式锁时，如果没有指定锁的超时时间，Watchdog会基于Netty的时间轮启动一个后台任务，定期向Redis发送命令，重新设置锁的过期时间，通常是锁的租约时间的1/3。这确保了即使客户端处理时间较长，所持有的锁也不会过期。
**续期时长**：默认情况下，每10s钟做一次续期，续期时长是30s。
**停止续期**：当锁被释放或者客户端实例被关闭时，Watchdog会自动停止对应锁的续租任务。

核心流程图如下：

​

# 扩展知识

## 实现原理​

**那么，它是如何实现的呢？**
​

在Redisson中，watch dog的主要实现在[scheduleExpirationRenewal](https://github.com/redisson/redisson/blob/master/redisson/src/main/java/org/redisson/RedissonBaseLock.java#L155)方法中：
​

可以看到，上面的代码的主要逻辑就是用了一个TimerTask来实现了一个定时任务，设置了`internalLockLeaseTime / 3`的时长进行一次锁续期。默认的超时时长是30s，那么他会每10s进行一次续期，通过LUA脚本进行续期，再续30s

不过，这个续期也不是无脑续，他也是有条件的，其中`ExpirationEntry ent = EXPIRATION_RENEWAL_MAP.get(getEntryName());`这个值得我们关注，他会从`EXPIRATION_RENEWAL_MAP`中尝试获取一个KV对，如果查不到，就不续期了。
​

`EXPIRATION_RENEWAL_MAP`这个东西，会在unlock的时候操作的，对他进行remove，所以一个锁如果被解了，那么就不会再继续续期了：
​

以上代码，第4行->16行->22行->57行。就是一次unlock过程中，对EXPIRATION_RENEWAL_MAP进行移除，进而取消下一次锁续期的实现细节。
​

并且在unlockAsync方法中，不管unlockInnerAsync是否执行成功，还是抛了异常，都不影响cancelExpirationRenewal的执行，也可以理解为，只要unlock方法被调用了，即使解锁未成功，那么也可以停止下一次的锁续期。

## 什么情况会进行续期

当我们使用Redisson创建一个分布式锁的时候，并不是所有情况都会续期的，我们可以看下以下加锁过程的代码实现：
​

注意看第15-19行，只有当leaseTime <= 0的时候，Redisson才会进行续期，所以，当我们加锁时，如果指定了超时时间，那么是不会被续期的。
​

## 什么情况会停止续期

首先，就是我们上面讲过的那种，如果一个锁的unlock方法被调用了，那么就会停止续期。
​

那么，取消续期的核心代码如下：
​

​

主要就是通过EXPIRATION_RENEWAL_MAP.remove来做的。那么cancelExpirationRenewal还有下面一处调用：
​

​

也就是说，在尝试开启续期的过程中，如果线程被中断了，那么就会取消续期动作了。
​

目前，Redisson是没有针对最大续期次数和最大续期时间的支持的。所以，正常情况下，如果没有解锁，是会一直续期下去的。
​

但是需要注意的是，Redisson的续期是Netty的时间轮（TimerTask、Timeout、Timer）的，并且操作都是基于JVM的，所以，当应用宕机、下线或者重启后，续期任务就没有了。这样也能在一定程度上避免机器挂了但是锁一直不释放导致的死锁问题。
​

## watchdog一直续期，客户端挂了怎么办？

## watchdog解锁失败，会不会导致一直续期下去？
