# ✅为什么不建议通过Executors构建线程池

# 典型回答

Executors类看起来功能还是比较强大的，又用到了工厂模式、又有比较强的扩展性，重要的是用起来还比较方便，如：

即可创建一个固定大小的线程池。

但是为什么在阿里巴巴Java开发手册中也明确指出，不允许使用Executors创建线程池呢

### Executors存在什么问题

在阿里巴巴Java开发手册中提到，使用Executors创建线程池可能会导致OOM(OutOfMemory ,内存溢出)，但是并没有说明为什么，那么接下来我们就来看一下到底为什么不允许使用Executors？

我们先来一个简单的例子，模拟一下使用Executors导致OOM的情况。

通过指定JVM参数：`-Xmx8m -Xms8m` 运行以上代码，会抛出OOM:

以上代码指出，`ExecutorsDemo.java`的第16行，就是代码中的`executor.execute(new SubThread());`。

### Executors为什么存在缺陷

通过上面的例子，我们知道了`Executors`创建的线程池存在OOM的风险，那么到底是什么原因导致的呢？我们需要深入`Executors`的源码来分析一下。

其实，在上面的报错信息中，我们是可以看出蛛丝马迹的，在以上的代码中其实已经说了，真正的导致OOM的其实是`LinkedBlockingQueue.offer`方法。

如果读者翻看代码的话，也可以发现，其实底层确实是通过`LinkedBlockingQueue`实现的：

如果读者对Java中的阻塞队列有所了解的话，看到这里或许就能够明白原因了。

Java中的`BlockingQueue`主要有两种实现，分别是`ArrayBlockingQueue` 和 `LinkedBlockingQueue`。

`ArrayBlockingQueue`是一个用数组实现的有界阻塞队列，必须设置容量。

`LinkedBlockingQueue`是一个用链表实现的有界阻塞队列，容量可以选择进行设置，不设置的话，将是一个无边界的阻塞队列，最大长度为`Integer.MAX_VALUE`。

这里的问题就出在：**不设置的话，将是一个无边界的阻塞队列，最大长度为Integer.MAX_VALUE。**也就是说，如果我们不设置`LinkedBlockingQueue`的容量的话，其默认容量将会是`Integer.MAX_VALUE`。

而`newFixedThreadPool`中创建`LinkedBlockingQueue`时，并未指定容量。此时，`LinkedBlockingQueue`就是一个无边界队列，对于一个无边界队列来说，是可以不断的向队列中加入任务的，这种情况下就有可能因为任务过多而导致内存溢出问题。

上面提到的问题主要体现在`newFixedThreadPool`和`newSingleThreadExecutor`两个工厂方法上，并不是说`newCachedThreadPool`和`newScheduledThreadPool`这两个方法就安全了，这两种方式创建的最大线程数可能是`Integer.MAX_VALUE`，而创建这么多线程，必然就有可能导致OOM。
​

# 扩展知识
## 如何正确创建线程池

避免使用Executors创建线程池，主要是避免使用其中的默认实现，那么我们可以自己直接调用`ThreadPoolExecutor`的构造函数来自己创建线程池。在创建的同时，给`BlockQueue`指定容量就可以了。
​

这种情况下，一旦提交的线程数超过当前可用线程数时，就会抛`java.util.concurrent.RejectedExecutionException，这是因为当前线程池使用的队列是有边界队列，队列已经满了便无法继续处理新的请求。但是异常（Exception）总比发生错误（Error）要好。
​

除了自己定义`ThreadPoolExecutor`外。还有其他方法。这个时候第一时间就应该想到开源类库，如apache和guava等。
​

作者推荐使用guava提供的ThreadFactoryBuilder来创建线程池。
​

​

​

通过上述方式创建线程时，不仅可以避免OOM的问题，还可以自定义线程名称，更加方便的出错的时候溯源。
​
