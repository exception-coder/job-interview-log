# ✅Netty 中用了哪些设计模式？

# 典型回答

Netty作为一个使用广泛的网络通信框架，他的代码也是值得学习的，在Netty中也用到了很多种设计模式。比如单例模式、工厂模式、责任链模式、观察者模式、策略模式、装饰者模式等。
​

# 扩展知识
## 单例模式

NioEventLoop 通过核心方法 select() 不断轮询注册的 I/O 事件，Netty 提供了选择策略 SelectStrategy 对象，这个对象就是个单例：
​

​

还有其中定义的异常：
​

## 工厂模式

工厂模式是一个比较常见的设计模式，在很多框架中都会用到，Netty也不例外，只要我们的Netty中搜索Factory，得到的类几乎都是和工厂模式有关的。
​

如我们前面提到的SelectStrategy也是用工厂创建的：
​

## 装饰者模式Netty中的WrappedByteBuf就是你对ByteBuf的装饰。来实现对他的增强：

## 责任链模式

责任链在Netty中用的比较多，Netty中有大量的[ChannelPipeline](https://github.com/netty/netty/blob/d34212439068091bcec29a8fad4df82f0a82c638/transport/src/main/java/io/netty/channel/ChannelPipeline.java)，而这些Pipeline就是通过责任链来驱动的。

## 策略模式

Netty 在多处地方使用了策略模式，例如 [EventExecutorChooser](https://github.com/netty/netty/blob/d34212439068091bcec29a8fad4df82f0a82c638/common/src/main/java/io/netty/util/concurrent/DefaultEventExecutorChooserFactory.java) 提供了不同的策略选择 NioEventLoop，newChooser() 方法会根据线程池的大小情况来动态选择取模运算的方式：
​

而这里的PowerOfTwoEventExecutorChooser和GenericEventExecutorChooser是是EventExecutorChooser的两种具体策略实现：
​
