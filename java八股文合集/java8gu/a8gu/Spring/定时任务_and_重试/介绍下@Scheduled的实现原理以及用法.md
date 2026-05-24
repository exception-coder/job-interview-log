# ✅介绍下@Scheduled的实现原理以及用法

# 典型回答Spring 的 `@Scheduled` 注解用于在 Spring 应用中配置和执行定时任务。

Spring 的定时任务调度框架在 spring-context 包中，所有的类都在 scheduling 包中：

ScheduledAnnotationBeanPostProcessor是和这个定时任务调度有关的一个 bean 的后置处理器，这里面有着处理`@Scheduled`的逻辑：

上面的第9-33行，就是针对`@Scheduled`的处理逻辑，并且在第27行，我们看到，他把找到的标注了`@Scheduled`的方法交给了`processScheduled`方法进行处理。最终会执行到`processScheduledTask`方法，这个方法内容有点长，这里贴一下截图 （[https://github.com/spring-projects/spring-framework/blob/main/spring-context/src/main/java/org/springframework/scheduling/annotation/ScheduledAnnotationBeanPostProcessor.java#L392](https://github.com/spring-projects/spring-framework/blob/main/spring-context/src/main/java/org/springframework/scheduling/annotation/ScheduledAnnotationBeanPostProcessor.java#L392) ）：
​

从上图可以看到，这里根据不同的任务类型，调用了 registrar 的不同的调度方法，这个registrar是啥呢？其实就是`ScheduledTaskRegistrar`，
​

比如我们看下fixedRate类型的任务调度方式：
​

​

这里面是将任务给到taskScheduler进行调度执行了，这里的taskScheduler，默认是ConcurrentTaskScheduler。
**​**

ConcurrentTaskScheduler 是 TaskScheduler 接口的一个实现，可以并发调度多个任务，确保任务能够按时执行，它是借助 ScheduledExecutorService作为线程池来进行并发调度的。
​

**

**
在 Spring 6.1之前，如果没有指定线程池，这里默认会创建一个单线程的线程池。但是这个方法在6.1之后已经废弃了，现在使用的是要传入ScheduledExecutorService的构造函数来指定一个线程池。
**​**

## 扩展知识
### @Scheduled用法

- 定义一线程池

- 启用定时任务并指定线程池

- 定义定时任务：

- `fixedRate`：以固定的时间间隔执行任务，从上一个任务开始时间算起。- `fixedDelay`：以上一个任务的完成时间算起，延迟固定的时间间隔后执行。- `cron`：使用 Cron 表达式定义复杂的定时任务。
