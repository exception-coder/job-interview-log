# ✅介绍下@Retryable的实现原理

# 典型回答

`@Retryable` 是 Spring Retry 框架提供的一个注解（Spring 7中已内置），**用于在方法调用失败时自动进行重试。**它通常用于处理临时性故障（如网络抖动、数据库连接短暂中断等），提高系统的容错能力。

​

如果重试最终失败，可以配合 `@Recover` 提供降级逻辑：
​

首先，@Retryable实现的这种重试，他是JVM级别的，基于JVM内存的，如果JVM挂了，或者应用重启了，那么他的重试任务就丢失了，所以，如果想要避免这种情况，需要用定时任务框架。
​

因为@Retryable是一个注解，所以可想而知，他首先就是先用到AOP了，当应用启动的时候，会扫描到增加了这个注解的类或者方法，然后给这个bean创建代理对象。
​

有了代理对象之后，后续的方法调用都会调用到对应的代理对象。那么，重试逻辑，包括异常判断、重试次数、退避策略等等都是在这个代理对象中实现的。
​

以下是上面的过程的书面一点的说法 （Spring Retry）：
​

- `@EnableRetry` 会注册一个 `RetryConfiguration`，该配置会向 Spring 容器中注册一个 `BeanPostProcessor`（具体是 `RetryConfiguration$RetryableMethodsInterceptor`）。- 这个 `BeanPostProcessor` 会扫描所有带有 `@Retryable` 注解的 Bean，并为其创建代理，织入 `RetryOperationsInterceptor`。- `RetryOperationsInterceptor` 内部使用 `RetryTemplate` 来执行重试逻辑。​

​

以下是上面的过程的书面一点的说法 （Spring 7）：
​

- 在Spring 7的resilience包中（Spring 7刚出的，一个内置的韧性能力，包括了重试、限流等），新增了一个`RetryAnnotationBeanPostProcessor `，他会扫描所有带有 `@Retryable` 注解的 Bean，并为其创建代理，织入 `RetryAnnotationInterceptor` 。- `RetryAnnotationInterceptor` 内部使用 `RetryTemplate` 来执行重试逻辑。​

​

### RetryTemplate实现逻辑

不管是原来的Spring retry，还是最新的Spring 7，最终都是在RetryTemplate中实现的重试逻辑。这里我直接拿最新的，前几天刚出的Spring 7中的源码来介绍吧。（[https://github.com/spring-projects/spring-framework/blob/main/spring-core/src/main/java/org/springframework/core/retry/RetryTemplate.java](https://github.com/spring-projects/spring-framework/blob/main/spring-core/src/main/java/org/springframework/core/retry/RetryTemplate.java) ）
​

其中最关键的就是execute方法，主要逻辑如下：
- 首次尝试执行业务逻辑。成功则直接返回；失败则捕获 `Throwable`（包括 Error 和 Exception），进入重试流程。

- 失败的情况下，进入重试循环：- 检查是否还能重试（`retryPolicy.shouldRetry()`）。（这里是个while循环）- 如果能，先退避等待（backoff），再重试。（其实就是线程sleep一段时间，然后再继续执行）- 每次重试前后会通知监听器（`retryListener`）。​

> “退避”（Backoff）是在系统发生失败或异常后，延迟一段时间再重试的一种策略。比如RokcetMQ消息投递，用的就是一种叫做"指数退避"的退避策略。[https://www.yuque.com/hollis666/fsn3og/pazm66bo3u2990ln](https://www.yuque.com/hollis666/fsn3og/pazm66bo3u2990ln)​

- 如果重试次数用尽 → 抛出 `RetryException`，包含最后一次异常作为主因，其余异常作为 suppressed exceptions（被抑制的异常）。​

增加注释后的代码如下（注释由QWen帮忙添加，我做了微调）：
