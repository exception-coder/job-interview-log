# ✅创建线程有几种方式？

# 典型回答在Java中，共有四种方式可以创建线程，分别是
- 继承**Thread**类创建线程- 实现**Runnable**接口创建线程- 通过**Callable和FutureTask**创建线程- 通过**线程池**创建线程​

> 其实，归根结底最终就两种，一个是继承**Thread**类，一个是实现**Runnable**接口，至于其他的。也是基于这两个方式实现的。但是有的时候面试官更关注的是实际写代码过程中，有几种方式可以实现。所以一般回答4种也没啥毛病。

# 扩展知识
## Runnable和Callable区别

Runnable接口和Callable接口都可以用来创建新线程，实现Runnable的时候，需要实现run方法；实现Callable接口的话，需要实现call方法。
​

**Runnable的run方法无返回值，Callable的call方法有返回值，类型为Object**
​

Callable中可以够抛出checked exception,而Runnable不可以。
​

Callable和Runnable都可以应用于executors。而Thread类只支持Runnable。
​

## Future

Future是一个接口，代表了一个异步执行的结果。接口中的方法用来检查执行是否完成、等待完成和得到执行的结果。当执行完成后，只能通过get()方法得到结果，get方法会阻塞直到结果准备好了。如果想取消，那么调用cancel()方法。

FutureTask是Future接口的一个实现，它实现了一个可以提交给Executor执行的任务，并且可以用来检查任务的执行状态和获取任务的执行结果。
​

​

### FutureTask和Callable示例

# 线程池

### 线程池和Callable的示例
