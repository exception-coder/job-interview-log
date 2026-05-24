# ✅RocketMQ的消息是推还是拉？

# 典型回答

MQ的消费模式可以一共有3种，分别是推Push、拉Pull以及5.0中推出的 POP 模式。本文主要介绍下 pull 和 push，pop 单独介绍。

Push是服务端主动推送消息给客户端，Pull是客户端需要主动到服务端轮询获取数据。
​

他们各自有各自的优缺点，推优点是及时性较好，但如果客户端没有做好流控，一旦服务端推送大量消息到客户端时，就会导致客户端消息堆积甚至崩溃。
​

拉优点是客户端可以依据自己的消费能力进行消费，但是频繁拉取会给服务端造成压力，并且可能会导致消息消费不及时。
​

**RocketMQ既提供了Push模式也提供了Pull模式**，开发者可以自行选择，主要有两个Consumer可以供开发者选择：
​

其中DefaultMQPullConsumer已经不建议使用了，建议使用DefaultLitePullConsumer。Lite Pull Consumer是RocketMQ 4.6.0推出的Pull Consumer，相比于原始的Pull Consumer更加简单易用，它提供了Subscribe和Assign两种模式。
​

> /** * @deprecated Default pulling consumer. This class will be removed in 2022, and a better implementation {@link * DefaultLitePullConsumer} is recommend to use in the scenario of actively pulling messages. */

但是，我们需要注意的是，**RocketMQ的push模式其实底层的实现还是基于pull实现的，**只不过他把pull给封装的比较好，让你以为是在push。
**​**

​

在下面这篇文章中我们介绍过长轮询，其实RocketMQ的push就是通过长轮询来实现的。
​

以下是关于RocketMQ中实现长轮询的代码（基于5.1.4），关键入口PullMessageProcessor的processRequest方法的部分代码：
​

其中这部分代码，就是通过创建一个轮询任务。
​

​

[ColdDataPullRequestHoldService](https://github.com/apache/rocketmq/blob/develop/broker/src/main/java/org/apache/rocketmq/broker/coldctr/ColdDataPullRequestHoldService.java) （[PullRequestHoldService](https://github.com/apache/rocketmq/blob/develop/broker/src/main/java/org/apache/rocketmq/broker/longpolling/PullRequestHoldService.java)）是一个子线程，他的run方法如下：
​

就是说，每隔一段时间（5秒或者20秒），执行一次数据拉取`checkColdDataPullRequest`，看下这个方法的具体实现：
​

# 扩展知识

## 用法

以下实例来自RocketMQ官网：[https://rocketmq.apache.org/](https://rocketmq.apache.org/)

### Push模式

### Pull模式
