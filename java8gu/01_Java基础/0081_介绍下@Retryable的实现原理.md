# ✅介绍下@Retryable的实现原理

> 题号：0081 ｜ 分类：01_Java基础

---

## 典型回答

`@Retryable` 是 Spring Retry 框架提供的一个注解（Spring 7中已内置），**用于在方法调用失败时自动进行重试。**它通常用于处理临时性故障（如网络抖动、数据库连接短暂中断等），提高系统的容错能力。

```text
@Service
public class MyService {

    @Retryable(value = {SQLException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public void doSomething() throws SQLException {
        // 可能抛出 SQLException 的操作
    }
}
```

如果重试最终失败，可以配合 `@Recover` 提供降级逻辑：

```text
@Recover
public void recover(SQLException e) {
    // 处理最终失败的情况
}
```

首先，@Retryable实现的这种重试，他是JVM级别的，基于JVM内存的，如果JVM挂了，或者应用重启了，那么他的重试任务就丢失了，所以，如果想要避免这种情况，需要用定时任务框架。

因为@Retryable是一个注解，所以可想而知，他首先就是先用到AOP了，当应用启动的时候，会扫描到增加了这个注解的类或者方法，然后给这个bean创建代理对象。

有了代理对象之后，后续的方法调用都会调用到对应的代理对象。那么，重试逻辑，包括异常判断、重试次数、退避策略等等都是在这个代理对象中实现的。

以下是上面的过程的书面一点的说法 （Spring Retry）：

- `@EnableRetry` 会注册一个 `RetryConfiguration`，该配置会向 Spring 容器中注册一个 `BeanPostProcessor`（具体是 `RetryConfiguration$RetryableMethodsInterceptor`）。
- 这个`BeanPostProcessor`会扫描所有带有`@Retryable`注解的 Bean，并为其创建代理，织入`RetryOperationsInterceptor`。
- `RetryOperationsInterceptor` 内部使用 `RetryTemplate` 来执行重试逻辑。

以下是上面的过程的书面一点的说法 （Spring 7）：

- 在Spring 7的resilience包中（Spring 7刚出的，一个内置的韧性能力，包括了重试、限流等），新增了一个`RetryAnnotationBeanPostProcessor `，他会扫描所有带有 `@Retryable` 注解的 Bean，并为其创建代理，织入 `RetryAnnotationInterceptor` 。
- `RetryAnnotationInterceptor` 内部使用 `RetryTemplate` 来执行重试逻辑。

> 📎 相关：[✅Spring 7 和Spring Boot 4 都有哪些新特性？](https://www.yuque.com/hollis666/fsn3og/laf96d7hlyaoe5wh)

### `RetryTemplate`实现逻辑

不管是原来的Spring retry，还是最新的Spring 7，最终都是在RetryTemplate中实现的重试逻辑。这里我直接拿最新的，前几天刚出的Spring 7中的源码来介绍吧。（[https://github.com/spring-projects/spring-framework/blob/main/spring-core/src/main/java/org/springframework/core/retry/RetryTemplate.java](https://github.com/spring-projects/spring-framework/blob/main/spring-core/src/main/java/org/springframework/core/retry/RetryTemplate.java) ）

其中最关键的就是execute方法，主要逻辑如下：

1. 首次尝试执行业务逻辑。成功则直接返回；失败则捕获 `Throwable`（包括 Error 和 Exception），进入重试流程。

1. 失败的情况下，进入重试循环：

- 检查是否还能重试（`retryPolicy.shouldRetry()`）。（这里是个while循环）
- 如果能，先退避等待（backoff），再重试。（其实就是线程sleep一段时间，然后再继续执行）
- 每次重试前后会通知监听器（`retryListener`）。

“退避”（Backoff）是在系统发生失败或异常后，延迟一段时间再重试的一种策略。比如RokcetMQ消息投递，用的就是一种叫做"指数退避"的退避策略。[https://www.yuque.com/hollis666/fsn3og/pazm66bo3u2990ln](https://www.yuque.com/hollis666/fsn3og/pazm66bo3u2990ln)

1. 如果重试次数用尽 → 抛出 `RetryException`，包含最后一次异常作为主因，其余异常作为 suppressed exceptions（被抑制的异常）。

增加注释后的代码如下（注释由QWen帮忙添加，我做了微调）：

```text
@Override
public <R extends @Nullable Object> R execute(Retryable<R> retryable) throws RetryException {
    // 获取当前可重试操作的名称，用于日志追踪
    String retryableName = retryable.getName();

    // ========== 第一次尝试执行 ==========
    try {
        logger.debug(() -> "Preparing to execute retryable operation '%s'".formatted(retryableName));
        R result = retryable.execute(); // 执行业务逻辑
        logger.debug(() -> "Retryable operation '%s' completed successfully".formatted(retryableName));
        return result; // 成功则直接返回结果
    }
    catch (Throwable initialException) {
        // 首次执行失败，记录异常并开始重试流程
        logger.debug(initialException,
                () -> "Execution of retryable operation '%s' failed; initiating the retry process".formatted(retryableName));

        // 初始化退避策略执行器（用于控制每次重试之间的等待时间）
        BackOffExecution backOffExecution = this.retryPolicy.getBackOff().start();

        // 使用双端队列保存所有失败的异常（最多预估4次，可动态扩容）
        Deque<Throwable> exceptions = new ArrayDeque<>(4);
        exceptions.add(initialException); // 保存首次异常

        // 记录最近一次失败的异常，用于判断是否继续重试
        Throwable lastException = initialException;

        // ========== 重试循环 ==========
        while (this.retryPolicy.shouldRetry(lastException)) {
            try {
                // 获取下一次重试前需要等待的时间（毫秒）
                long duration = backOffExecution.nextBackOff();
                // 如果退避策略返回 STOP，表示不再重试，直接退出循环
                if (duration == BackOffExecution.STOP) {
                    break;
                }
                logger.debug(() -> "Backing off for %dms after retryable operation '%s'".formatted(duration, retryableName));
                Thread.sleep(duration); // 线程休眠，实现退避
            }
            catch (InterruptedException interruptedException) {
                // 如果线程在 sleep 期间被中断，恢复中断状态（良好实践）
                Thread.currentThread().interrupt();

                // 构造“重试被中断”异常，并将之前所有异常作为被抑制异常附加
                RetryException retryException = new RetryInterruptedException(
                        ""Unable to back off for retryable operation '%s".formatted(retryableName),
                        interruptedException);
                exceptions.forEach(retryException::addSuppressed);

                // 通知监听器：重试过程被中断
                this.retryListener.onRetryPolicyInterruption(this.retryPolicy, retryable, retryException);

                // 抛出中断异常，终止重试
                throw retryException;
            }

            // 准备进行下一次重试
            logger.debug(() -> "Preparing to retry operation '%s".formatted(retryableName));

            try {
                // 通知监听器：即将开始一次重试（可用于监控、埋点等）
                this.retryListener.beforeRetry(this.retryPolicy, retryable);

                // 再次执行业务逻辑
                R result = retryable.execute();

                // 通知监听器：重试成功
                this.retryListener.onRetrySuccess(this.retryPolicy, retryable, result);

                logger.debug(() -> "Retryable operation '%s' completed successfully after retry".formatted(retryableName));
                return result; // 成功，返回结果
            }
            catch (Throwable currentException) {
                // 本次重试再次失败
                logger.debug(currentException,
                        () -> Retry attempt for operation '%s' failed due to '%s'".formatted(retryableName, currentException));

                // 通知监听器：本次重试失败
                this.retryListener.onRetryFailure(this.retryPolicy, retryable, currentException);

                // 保存本次异常
                exceptions.add(currentException);
                // 更新最近一次异常，供下一轮 shouldRetry 判断
                lastException = currentException;
            }
        }

        // ========== 重试策略已耗尽（所有重试机会用完）==========
        // 取出最后一次异常作为主异常（cause）
        Throwable lastFailedException = exceptions.removeLast();
        RetryException retryException = new RetryException(
                "Retry policy for operation '%s' exhausted; aborting execution".formatted(retryableName),
                lastFailedException);

        // 将之前所有失败的异常作为“被抑制的异常”附加到主异常中
        // 这样调用者可以通过 getSuppressed() 查看完整失败历史
        exceptions.forEach(retryException::addSuppressed);

        // 通知监听器：重试策略已完全耗尽
        this.retryListener.onRetryPolicyExhaustion(this.retryPolicy, retryable, retryException);

        // 最终抛出重试失败异常
        throw retryException;
    }
}
```
