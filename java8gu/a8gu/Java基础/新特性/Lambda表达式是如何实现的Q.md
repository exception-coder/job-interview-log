# ✅Lambda表达式是如何实现的？

关于lambda表达式，有人可能会有质疑，因为网上有人说他并不是语法糖。其实我想纠正下这个说法。**Labmda表达式不是匿名内部类的语法糖，但是他也是一个语法糖。实现方式其实是依赖了几个JVM底层提供的lambda相关api。**

先来看一个简单的lambda表达式。遍历一个list：

为啥说他并不是内部类的语法糖呢，前面讲内部类我们说过，内部类在编译之后会有两个class文件，但是，包含lambda表达式的类编译后只有一个文件。
​

反编译后代码如下:

可以看到，在`forEach`方法中，其实是调用了`java.lang.invoke.LambdaMetafactory#metafactory`方法，该方法的第5个参数implMethod指定了方法实现。可以看到这里其实是调用了一个`lambda$main$0`方法进行了输出。

再来看一个稍微复杂一点的，先对List进行过滤，然后再输出：

反编译后代码如下：

两个lambda表达式分别调用了`lambda$main$1`和`lambda$main$0`两个方法。

**所以，lambda表达式的实现其实是依赖了一些底层的api，在编译阶段，编译器会把lambda表达式进行解糖，转换成调用内部api的方式。**
