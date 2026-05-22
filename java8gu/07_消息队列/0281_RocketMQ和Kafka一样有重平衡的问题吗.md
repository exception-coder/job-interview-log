# ✅RocketMQ和Kafka一样有重平衡的问题吗？

> 题号：0281 ｜ 分类：07_消息队列

---

## 典型回答

> 📎 相关：[✅什么是Kafka的重平衡机制？](https://www.yuque.com/hollis666/fsn3og/rqzepcxvq2a1w2e9)

关于Kafka的重平衡问题请看上面这篇，那么RocketMQ也有这样的问题吗？这要看是哪种消费方式，RocketMQ 支持两种消息模式：**广播消费（ Broadcasting ）**和**集群消费（ Clustering ）**。

> 📎 相关：[✅RocketMQ怎么实现消息分发的？](https://www.yuque.com/hollis666/fsn3og/qxu868f094az60aa)

**广播模式下，每个消费者都会消费所有消息，不存在重平衡问题。 但是如果实在默认的集群模式下，消费者在一个消费组中，多个消费者会均摊消费，这时候就涉及重平衡的问题。**

**不过和Kafka不同的是，RocketMQ他只有个定时重平衡的机制，他会自动的每 20s 进行一次重平衡检查，如果发现有消费者新增或离开时，会触发重新分配队列。**

```text
// 默认20秒，可以通过rocketmq.client.rebalance.waitInterval配置调整
private static long waitInterval =
    Long.parseLong(System.getProperty(
        "rocketmq.client.rebalance.waitInterval", "20000"));
@Override
public void run() {
    log.info(this.getServiceName() + " service started");
    while (!this.isStopped()) {
        // 等待20秒
        this.waitForRunning(waitInterval);
        // 执行重平衡
        this.mqClientFactory.doRebalance();
    }
    log.info(this.getServiceName() + " service end");
}
```

正是因为RocketMQ 定时进行重平衡的，而不是像 Kafka 依赖心跳机制做实时重平衡，那么就会出现如果一个消费者宕机，最多需要 20s 才能触发重平衡，导致这段时间内消息堆积在已宕机的消费者上，影响吞吐。不过定时也有个好处就是避免很多网络抖动，或者频繁增加、退出消费者等导致的频繁的重平衡。

**但是相比于Kafka，RocketMQ的重平衡机制最大的好处是STW的影响很小。**

由于 RocketMQ 的消费者是通过 **异步拉取**然后再放到**本地队列**处理消息的，即使重平衡发生，每个消费者仍然可以继续消费它当前的队列中的消息，只要重平衡的时间足够短，就可以完全消除STW的发生，因为这段时间本地队列中消息还是在正常处理的。一旦重平衡好了，拉取的时候拉取新的队列的消息就行了。

还有就是RocketMQ 在消费者重平衡时是通过默认就是通过局部调整来完成的。当消费者变化时，只有受影响的消费者会重新分配消息队列，其他消费者不受影响。  （类似kafka的渐进式重平衡，但是RocketMQ默认就是这样的）
