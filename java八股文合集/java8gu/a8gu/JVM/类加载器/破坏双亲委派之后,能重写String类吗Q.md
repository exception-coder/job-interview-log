# ✅破坏双亲委派之后，能重写String类吗？

# 典型回答
Java通过双亲委派模型保证了java核心包中的类不会被破坏，但破坏双亲委派能够脱离加载范围的限制，增强第三方组件的能力。
​

但是我们虽然可以通过破坏双亲委派屏蔽Bootstrap ClassLoader，但无法重写`java.`包下的类，如`java.lang.String`。

我们知道，要破坏双亲委派模型是需要`extends ClassLoader`并重写其中的`loadClass()`和`findClass()`方法。

之所以无法替换`java.`包的类，主要原因是即使我们破坏双亲委派模型，依然需要调用父类中（`java.lang.ClassLoader.java`）的`defineClass()`方法来把字节流转换为一个JVM识别的class。而`defineClass()`方法中通过`preDefineClass()`方法限制了类全限定名不能以`java.`开头。
​

如下代码所示：

注意，`defineClassX`三兄弟是三个本地方法，用于不同参数长度的方法调用。

对应到JDK源码中分别为：

这三个C++方法会调用到`SystemDictionary::resolve_from_stream`检查全限定名是否包含`java.`

但是，如果破坏双亲委派的时候自己将字节流转换为一个jvm可识别的class，那确实绕过`defineClass()`中的校验全限定名的逻辑，也就可以改写`java.lang.String`，并加载到JVM中。
