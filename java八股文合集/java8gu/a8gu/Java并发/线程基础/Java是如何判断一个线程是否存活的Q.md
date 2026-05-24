# ✅Java是如何判断一个线程是否存活的？

# 典型回答
在Java中，我们自己想要判断线程是否存活，可以通过Thread下的isAlive()方法：

运行结果：

但是事情并没有这么简单，先来看一下以下代码执行后t1的isAlive()方法返回：

运行结果：

可以看到t1已经结束了，但t1的isAlive()方法返回的是true。

**产生这个现象的原因是isAlive()需要拿到当前对象的锁，注意上面代码中t2里对t1对象进行了synchronized，即t1线程在结束时需要修改自己的状态，而t1的被t2锁住，所以无法修改状态，导致isAlive()返回true。**

上述具体原因，我们可以看java.lang.Thread.isAlive()方法的实现。

可以看到这是个本地方法，对应到jdk源码中`java_lang_Thread::is_alive`方法调用。其底层实现是取当前线程对象中_eetop_offset的值。不为空则返回true。

_eetop_offset会在调用java.lang.Thread.start()方法时，在jdk源码中，通过`native_thread->prepare(jthread)`的prepare方法设置为当前线程对象

java线程结束时，jvm会调用`JavaThread::exit`方法

`ObjectLocker`就是传说中的synchronized的实现，其构造函数如下

**所以，在执行线程的退出过程中，需要拿到当前对象的锁之后才能设置_eetop_offset，上面的例子中，由于t1的锁被t2持有，所以t1无法设置_eetop_offset值为空。所以这时候isAlive()方法返回的就还是true，当然线程状态也无法修改为TERMINATED终止。**
