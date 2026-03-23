# ✅如何基于Redisson实现一个延迟队列

# 典型回答

Redisson中定义了分布式延迟队列**RDelayedQueue**，这是一种基于我们前面介绍过的zset结构实现的延时队列，它允许以指定的延迟时长将元素放到目标队列中。

其实就是在zset的基础上增加了一个基于内存的延迟队列。当我们要添加一个数据到延迟队列的时候，redisson会把数据+超时时间放到zset中，并且起一个延时任务，当任务到期的时候，再去zset中把数据取出来，返回给客户端使用。
​

定义一个Redisson客户端：
​

接下来，在想要使用延迟队列的地方做如下方式：
​

​

​

使用offer方法将两条延迟消息添加到RDelayedQueue中，使用take方法从RQueue中获取消息，如果没有消息可用，该方法会阻塞等待，直到消息到达。
​

我们使用 RDelayedQueue 的 offer 方法将元素添加到延迟队列，并指定延迟的时间。当元素的延迟时间到达时，Redisson 会将元素从 RDelayedQueue 转移到关联的 RBlockingDeque 中。
​

使用 RBlockingDeque 的 take 方法从关联的 RBlockingDeque 中获取元素。这是一个阻塞操作，如果没有元素可用，它会等待直到有元素可用。
​

所以，为了从延迟队列中取出元素，使用 RBlockingDeque 的 take 方法，因为 Redisson 的 RDelayedQueue 实际上是通过转移元素到关联的 RBlockingDeque 来实现延迟队列的。
