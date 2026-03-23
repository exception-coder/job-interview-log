# ✅Redis 的事务机制是怎样的？

# 典型回答

Redis中是支持事务的，他的事务主要目的是保证多个命令执行的原子性，即要在一个原子操作中执行，不会被打断。
​

需要注意的是，**Redis的事务是不支持回滚的**。从 Redis 2.6.5 开始，服务器将会在累积命令的过程中检测到错误。然后，在执行 EXEC 期间会拒绝执行事务，并返回一个错误，同时丢弃该事务。如果事务执行过程中发生错误，Redis会继续执行剩余的命令而不是回滚整个事务。

> Errors happening after EXEC instead are not handled in a special way: all the other commands will be executed even if some command fails during the transaction.  [https://redis.io/docs/interact/transactions/#errors-inside-a-transaction](https://redis.io/docs/interact/transactions/#errors-inside-a-transaction)​

更多原子性的解释参考：
​

Redis事务相关的命令主要有以下几个：
​

- MULTI：标记一个事务块的开始。- DISCARD：取消事务，放弃执行事务块内的所有命令。- EXEC：执行所有事务块内的命令。- UNWATCH：取消 WATCH 命令对所有 key 的监视。- WATCH key [key ...]：监视一个(或多个) key ，如果在事务执行之前这个(或这些) key 被其他命令所改动，那么事务将被打断。
### 
### 事务执行时会有什么错误？

前面我们提到过，从 Redis 2.6.5 开始，服务器将会在累积命令的过程中检测到错误。但是后面又说事务执行时也会有错误。这里是不是矛盾了？
​

其实并不矛盾。
​

Redis错误有两种情况，一种是在命令排队的过程就就检测到的错误，比如语法错误，比如内存不够了，等等。在这种错误，会在调用 EXEC 后，命令可能会直接失败。
​

还有一种错误，是在调用 EXEC 后，命令执行过程中出现的错误，最常见的就是操作类型不一致，比如对字符串进行列表相关的操作。这种就是在执行过程中才会出现的。
​

而后面这种错误，Redis认为是不应该出现的。所以需要在开发阶段就避免，这也是他没有提供回滚的一个重要原因。
​

# 扩展知识

## 例子**​**

下面是一个使用Jedis客户端，借助事务实现电商下单的例子：
​

## 事务和pipeline的区别

## 事务和Lua的区别
