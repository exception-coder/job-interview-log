# ✅有了InheritableThreadLocal为啥还需要TransmittableThreadLocal？

# 典型回答

InheritableThreadLocal是用于主子线程之间参数传递的，因为`InheritableThreadLocal`的实现原理是，**当创建一个新线程时，子线程会从父线程拷贝一份 **`**InheritableThreadLocal**`** 的值。这个拷贝发生在线程创建时（即 **`**Thread.init()**`** 阶段）。**
​

但是，这种方式有一个问题，那就是必须要是在主线程中手动创建的子线程才可以，而现在池化技术非常普遍了，很多时候线程都是通过线程池进行创建和复用的，这时候InheritableThreadLocal就不行了。
​

因为线程池中的线程是预先创建好并复用的，任务提交时并不会创建新线程。因此，即使主线程设置了 `InheritableThreadLocal` 的值，在线程池中的工作线程早已创建完毕，不会再次执行“继承拷贝”逻辑。所以，**在线程池中使用 **`**InheritableThreadLocal**`** 无法传递上下文。**
​

TransmittableThreadLocal是阿里开源的一个方案 （开源地址：[https://github.com/alibaba/transmittable-thread-local](https://github.com/alibaba/transmittable-thread-local) ） ，这个类继承并加强InheritableThreadLocal类。用来实现线程之间的参数传递，一经常被用在以下场景中：
​

- 分布式跟踪系统 或 全链路压测（即链路打标）- 日志收集记录系统上下文- Session级Cache- 应用容器或上层框架跨应用代码给下层SDK传递信息​

**TTL不是靠线程创建时继承，而是通过装饰任务（Runnable/Callable） 的方式，在任务提交到线程池前捕获当前线程的上下文，在任务执行时还原到工作线程，执行完后再清除。**
**​**

使用 `TtlRunnable.get(runnable)` 或 `TtlCallable.get(callable)` 包装原始任务；在 `run()` 方法开始前，将捕获的上下文 set 到当前线程；执行完后 restore 原有状态。 因此，TTL 在线程池场景下也是有效的。
​

# 扩展知识
## 使用方式

先需要导入依赖：
​

对于简单的父子线程之间参数传递，可以用以下方式：
​

如果在线程池中，可以用如下方式使用：
​

除了Runnable，Callable也支持：
​

也可以直接用在线程池上，而不是Runnable和Callable上：
​
