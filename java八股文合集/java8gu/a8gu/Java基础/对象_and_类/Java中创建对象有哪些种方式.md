# ✅Java中创建对象有哪些种方式

# 典型回答​

### 使用new关键字这是我们最常见的也是最简单的创建对象的方式，通过这种方式我们还可以调用任意的构造函数（无参的和有参的）。 
`User user = new User();`

### 使用反射机制运用反射手段，调用Java.lang.Class或者java.lang.reflect.Constructor类的newInstance()实例方法。
1 使用Class类的newInstance方法
可以使用Class类的newInstance方法创建对象。这个newInstance方法调用无参的构造函数创建对象。
​

​

2 使用Constructor类的newInstance方法
和Class类的newInstance方法很像， java.lang.reflect.Constructor类里也有一个newInstance方法可以创建对象。我们可以通过这个newInstance方法调用有参数的和私有的构造函数。
​

这两种newInstance方法就是大家所说的反射。事实上Class的newInstance方法内部调用Constructor的newInstance方法。

### 使用clone方法无论何时我们调用一个对象的clone方法，jvm就会创建一个新的对象，将前面对象的内容全部拷贝进去。用clone方法创建对象并不会调用任何构造函数。 
​

要使用clone方法，我们需要先实现Cloneable接口并实现其定义的clone方法。如果只实现了Cloneable接口，并没有重写clone方法的话，会默认使用Object类中的clone方法，这是一个native的方法。

### 
### 使用反序列化当我们序列化和反序列化一个对象，jvm会给我们创建一个单独的对象。其实反序列化也是基于反射实现的。
​

​

​

### 使用方法句柄

通过使用方法句柄，可以间接地调用构造函数来创建对象
​

使用了MethodHandles.lookup().findConstructor()方法获取构造函数的方法句柄，然后通过invoke()方法调用构造函数来创建对象。

### 使用Unsafe分配内存

在Java中，可以使用sun.misc.Unsafe类来进行直接的内存操作，包括内存分配和对象实例化。然而，需要注意的是，sun.misc.Unsafe类是Java的内部API，它并不属于Java标准库的一部分，也不建议直接在生产环境中使用。

这种方式有以下几个缺点：
​

- 不可移植性：Unsafe类的行为在不同的Java版本和不同的JVM实现中可能会有差异，因此代码在不同的环境下可能会出现不可移植的问题。- 安全性问题：Unsafe类的功能是非常强大和危险的，可以绕过Java的安全机制，可能会导致内存泄漏、非法访问、数据损坏等安全问题。- 不符合面向对象的原则：Java是一门面向对象的语言，鼓励使用构造函数和工厂方法来创建对象，以确保对象的正确初始化和维护对象的不变性。
