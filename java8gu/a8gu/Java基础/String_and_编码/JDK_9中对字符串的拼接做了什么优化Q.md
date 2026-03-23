# ✅JDK 9中对字符串的拼接做了什么优化？

# 典型回答

在JDK 9之前，字符串拼接通常使用`+`进行（也有其他的，我们不做展开了），`+`的实现其实是基于`StringBuilder`的。具体参考：
​

​

这个过程其实是比较低效的，因为整个过程包含了创建`StringBuilder`对象，通过调用`append`方法拼接字符串，最后通过`toString`方法转换成最终的字符串等多个操作。所以才有个规范说不要在 for 循环中用+来拼接字符串的。
​

但是，这个其实在 JDK 9中已经被修改了。JDK 9引入了`StringConcatFactory`。这玩意被推出的的主要目标是提供一种灵活且高效的方式来拼接字符串，代替之前的 `StringBuilder` 或 `StringBuffer` 的静态编译方法。
​

`StringConcatFactory`是基于`invokedynamic`指令实现的。
​

> 是 Java 7 中引入的一种动态类型指令，允许 JVM 在运行时动态解析和调用方法。​

也就说，利用`invokedynamic`的特性，将字符串拼接的操作**延迟到运行时**，而不是在编译时固定使用`StringBuilder`。（前面的链接中我们做过反编译，可见+转成 StringBuilder是编译的时候就确定了的。）

这就使得，JVM可以在运行时根据实际的场景选择最优的拼接策略，可能是使用`StringBuilder`、`StringBuffer`、或者其他更高效的方法。

在 [JDK 9](https://github.com/zxiaofan/JDK/blob/master/JDK1.9/src/java.base/java/lang/invoke/StringConcatFactory.java#L126)中（后续版本会有所变化，1.9 看的比较清楚），支持的拼接策略有以下几个：

StringBuilder你不陌生，`MethodHandle` 是啥？他 Java 7 开始引入的特性，它提供了一种灵活且高效的方法来直接操作方法、构造函数和字段的调用。
​

它与反射相似，但提供了更高的性能和更低的使用限制。`MethodHandle` 是一种非常底层的机制，允许开发者在运行时动态查找和调用方法，无论方法的访问权限如何。
​

使用 `MethodHandles.lookup()` 获取一个 `Lookup` 实例，然后使用这个实例来查找特定的方法。
​

使用 `invoke`, `invokeExact`, 或者其他形式的 `invoke` 方法来调用 `MethodHandle`。
