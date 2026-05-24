# ✅Java中的类什么时候会被加载？

# 典型回答

Java中的类在以下几种情况中会被加载：

- **当创建类的实例时，如果该类还没有被加载，则会触发类的加载。**例如，通过关键字new创建一个类的对象时，JVM会检查该类是否已经加载，如果没有加载，则会调用类加载器进行加载。

- **当使用类的静态变量或静态方法时，如果该类还没有被加载，则会触发类的加载。**例如，当调用某个类的静态方法时，JVM会检查该类是否已经加载，如果没有加载，则会调用类加载器进行加载。

- **当使用反射机制访问类时，如果该类还没有被加载，则会触发类的加载。**例如，当使用Class.forName()方法加载某个类时，JVM会检查该类是否已经加载，如果没有加载，则会调用类加载器进行加载。

- 当JVM启动时，会自动加载一些基础类，例如java.lang.Object类和java.lang.Class类等。​

总之，**Java中的类加载其实是延迟加载的，除了一些基础的类以外，其他的类都是在需要使用类时才会进行加载。**同时，Java还支持动态加载类，即在运行时通过程序来加载类，这为Java程序带来了更大的灵活性。
​

# 扩展知识

## Java中的类什么时候会被卸载

Java中类的卸载是由Java虚拟机（JVM）自动进行的，JVM会在满足以下3个条件时对一个类进行卸载：
​

- 该类所有的实例都已被GC回收。- 该类的ClassLoader已经被GC回收。- 该类对应的Class对象没有在任何地方被引用，也就无法在任何地方通过反射访问该类方法。

在Java中，每一个类都会由ClassLoader加载到内存中，并在运行期间一直存在。当一个类不再被使用时，它的实例对象被GC回收后，如果ClassLoader也被GC回收，那么这个类就可以被卸载了。
​

需要注意的是，Java虚拟机并不会在程序运行过程中频繁地卸载类，因为类卸载是一个比较耗时的操作，会影响程序的性能。通常情况下，Java虚拟机会在需要释放内存空间时才会对不再使用的类进行卸载。
​

另外，Java SE 9引入了一个新的特性，即“模块化”，通过模块化可以对Java类进行更加精细的控制，包括对类的卸载。在模块化环境下，如果一个模块中的类不再被引用，那么这个模块就可以被卸载。模块化可以使Java应用程序更加安全、可靠和可维护。

## Java在类的加载步骤中做了哪些操作对于Java自带的类加载器来说，当一个类被加载的时候，需要用到类加载器将类从外部加载到Jvm的内存当中，如下代码所示：
那么最后一步的findClass是什么意思呢？我们可以通过JDK8的classLoader源码的注释中发现这么一个例子：
再结合`ClassLoader#findClass`是protect的且为空实现，所以我们可以发现，findClass的作用就是给子类去加载其他二进制文件使用的，同时，还应该调用`ClassLoader#defineClass`去将二进制文件加载为Class类
通过上面的代码，我们可以发现如下几个步骤：
- 缓存思想，如果该类已经被加载过，则不加载- 使用双亲委派模型，对该类进行加载- 如果通过CLASSPATH找不到该类的定义，则会通过findClass让子类自定义的去获取类定义的二进制文件- 然后通过defineClass将二进制文件加载为类​

## 类加载的过程线程安全吗是线程安全的，如上文所示，在loadClass方法中，是被synchronized加了锁的
​

## 数组是怎么被加载的？

首先我们要明白，数组也是一种类，而不是基本数据类型。所以数组也和其他正常的类一样，需要被加载。
但是，Java规范中有如下表示：
> Class objects for array classes are not created by class loaders, but are created automatically as required by the Java runtime. The class loader for an array class, as returned by Class.getClassLoader() is the same as the class loader for its element type; if the element type is a primitive type, then the array class has no class loader.翻译过来就是：
> 数组类的类对象不是由类加载器创建的，而是根据 Java 运行时的要求自动创建的。 Class.getClassLoader()返回的数组类的类加载器与其元素类型的类加载器相同；如果元素类型是原始类型，则数组类没有类加载器。此时我们可以知道，数组不通过类加载器加载，而是根据 Java 运行时的要求自动创建的。如果元素类型是原始类型，则数组类没有类加载器。
