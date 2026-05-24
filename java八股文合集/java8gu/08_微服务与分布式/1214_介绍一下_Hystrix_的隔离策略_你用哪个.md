# ✅介绍一下 Hystrix 的隔离策略，你用哪个？

> 题号：1214 ｜ 分类：08_微服务与分布式

---

## 典型回答

Hystrix提供两种主要的隔离策略来控制服务之间的交互，防止系统中一个组件的失败影响到其他组件。分别是**线程池隔离**和**信号量隔离**。基本上大多数场景，都是使用线程池隔离的！

### 线程池隔离

这是Hystrix的默认隔离策略，也是推荐方式。在这种策略中，每一个依赖服务调用都在一个单独的线程中执行，这个线程从专门为每个Hystrix命令或服务依赖配置的线程池中获取。如果线程池已满，新的请求将会被立即拒绝，不会继续等待或阻塞调用者线程。

优点：

- 提供了真正的任务隔离；如果依赖服务变得缓慢或无响应，只会影响到运行在同一个线程池中的请求。
- 可以限制并发调用的数量，避免系统过载。

```java
import com.netflix.hystrix.HystrixCommand;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandProperties;
import com.netflix.hystrix.HystrixThreadPoolProperties;

public class RemoteServiceCommand extends HystrixCommand<String> {
    protected RemoteServiceCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("HollisExampleGroup"))
                .andThreadPoolPropertiesDefaults(HystrixThreadPoolProperties.Setter()
                        .withCoreSize(10) // 核心线程数
                        .withMaxQueueSize(5)) // 等待队列长度
                .andCommandPropertiesDefaults(HystrixCommandProperties.Setter()
                        .withExecutionTimeoutInMilliseconds(1000)));
    }

    @Override
    protected String run() {
        // 远程服务调用
    }
}

```

### 信号量隔离

信号量隔离使用Java的信号量来限制并发访问的数量，而不是在不同的线程中执行命令。当请求达到信号量计数的限制时，新的请求会被立即拒绝，而不会导致线程的创建或切换。

优点：

- 开销较小，没有线程切换和创建的成本。
- 适用于执行非常快但需要频繁访问的操作。

### 适用场景

- 线程池隔离：适合99%场景，尤其是外部调用的场景，，尤其是那些可能会慢或失败的服务（如外部API、数据库访问等）
- 信号量：适合轻量级操作，不太可能导致长时间延迟的服务调用，如内存或缓存服务访问。

```java
import com.netflix.hystrix.HystrixCommand;
import com.netflix.hystrix.HystrixCommandGroupKey;
import com.netflix.hystrix.HystrixCommandProperties;

public class LocalServiceCommand extends HystrixCommand<String> {
    protected LocalServiceCommand() {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("HollisExampleGroup"))
                .andCommandPropertiesDefaults(HystrixCommandProperties.Setter()
                        .withExecutionIsolationStrategy(HystrixCommandProperties.ExecutionIsolationStrategy.SEMAPHORE)
                        .withExecutionIsolationSemaphoreMaxConcurrentRequests(5)));
    }

    @Override
    protected String run() {
        // 轻量级操作，如访问本地缓存
    }
}

```
