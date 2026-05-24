# ✅Kafka如何实现顺序消费？

# 典型回答

Kafka的消息是存储在指定的topic中的某个partition中的。并且一个topic是可以有多个partition的。同一个partition中的消息是有序的，但是跨partition，或者跨topic的消息就是无序的了。
​

**为什么同一个partition的消息是有序的？**
​

因为当生产者向某个partition发送消息时，消息会被追加到该partition的日志文件（log）中，并且被分配一个唯一的 offset，文件的读写是有顺序的。而消费者在从该分区消费消息时，会从该分区的最早 offset 开始逐个读取消息，保证了消息的顺序性。
​

**基于此，想要实现消息的顺序消费，可以有以下几个办法：**
​

1、在一个topic中，只创建一个partition，这样这个topic下的消息都会按照顺序保存在同一个partition中，这就保证了消息的顺序消费。
​

2、发送消息的时候指定partition，如果一个topic下有多个partition，那么我们可以把需要保证顺序的消息都发送到同一个partition中，这样也能做到顺序消费。
​

# 扩展知识

## 如何发到同一个partition​

当我们发送消息的时候，如果key为null，那么Kafka 默认采用 Round-robin 策略，也就是轮转，实现类是 DefaultPartitioner。那么如果想要指定他发送到某个partition的话，有以下三个方式：
​

### 指定partition

我们可以在发送消息的时候，可以直接在ProducerRecord中指定partition
​

### 指定key

在没有指定 Partition(null 值) 时, 如果有 Key, Kafka 将依据 Key 做hash来计算出一个 Partition 编号来。如果key相同，那么也能分到同一个partition中：
​

### 自定义Partitioner

除了以上两种方式，我们还可以实现自己的分区器（Partitioner）来指定消息发送到特定的分区。
​

我们需要创建一个类实现Partitioner接口，并且重写partition()方法。

在partition()方法中，我们使用了一个简单的逻辑，根据键的哈希值将消息发送到相应的分区。为了在Kafka生产者中使用自定义的分区器，你需要在生产者的配置中指定分区器类：
​
