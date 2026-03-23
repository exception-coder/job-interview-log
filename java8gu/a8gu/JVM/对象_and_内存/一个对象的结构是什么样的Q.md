# ✅一个对象的结构是什么样的？

Java是一种面向对象的语言，而Java对象在JVM中的存储也是有一定的结构的。而这个关于Java对象自身的存储模型称之为Java对象模型。
​

HotSpot JVM设计了一个**OOP-Klass Model**。OOP（Ordinary Object Pointer）指的是普通对象指针，而Klass用来描述对象实例的具体类型。
​

每一个Java类，在被JVM加载的时候，JVM会给这个类创建一个instanceKlass，保存在方法区，用来在JVM层表示该Java类。当我们在Java代码中，使用new创建一个对象的时候，JVM会创建一个instanceOopDesc对象，**这个对象中包含了对象头、实例数据以及对齐填充。**
**​**

​

- 对象头（Object Header）： 对象头是每个Java对象的固定部分，它包含了用于管理对象的元数据信息。对象头的结构在HotSpot中是根据对象的类型（即是否是数组对象、是否启用偏向锁等）而变化的，但一般情况下，对象头包含以下信息：- Mark Word（标记字）：用于存储对象的标记信息，包括对象的锁状态、GC标记等。- Class Metadata Address（类元数据地址）：指向对象所属类的元数据信息，包括类的类型、方法、字段等。

- 实例数据（Instance Data）： 实例数据是对象的成员变量（字段）的实际存储区域，它包含了对象的各个字段的值。实例数据的大小取决于对象所包含的字段数量和字段类型。

- 对齐填充（Padding）： 对齐填充是为了使得对象的起始地址符合特定的对齐要求，以提高访问效率。由于虚拟机要求对象的起始地址必须是8字节的倍数（在某些平台上要求更大），因此可能需要在对象的实例数据末尾添加额外的字节来对齐。​

下面以一段代码段为例：
当上面的代码段执行完后，会在JVM呈现出如下模式：

从上图中可以看到，在方法区的instantKlass中有一个`int a=1`的数据存储。在堆内存中的两个对象的oop中，分别维护着`int b=3,int b=2`的实例数据。和oopDesc一样，instantKlass也维护着一些fields，用来保存类中定义的类数据，比如`int a=1`。

# 扩展知识

## 为什么设计oop-klass

HotSpot是基于c++实现，而c++是一门面向对象的语言，本身是具备面向对象基本特征的，所以Java中的对象表示，最简单的做法是为每个Java类生成一个c++类与之对应。但HotSpot JVM并没有这么做，而是设计了一个OOP-Klass Model。OOP（Ordinary Object Pointer）指的是普通对象指针，而Klass用来描述对象实例的具体类型。
​

为什么HotSpot要设计一套oop-klass model呢？答案是：HotSopt JVM的设计者不想让每个对象中都含有一个vtable（虚函数表）
​

众所周知，C++和Java都是面向对象的语言，面向对象语言有一个很重要的特性就是多态。关于多态的实现，C++和Java有着本质的区别。
​

多态是面向对象的最主要的特性之一，是一种方法的动态绑定，实现运行时的类型决定对象的行为。多态的表现形式是父类指针或引用指向子类对象，在这个指针上调用的方法使用子类的实现版本。多态是IOC、模板模式实现的关键。
​

在C++中通过虚函数表的方式实现多态，每个包含虚函数的类都具有一个虚函数表（virtual table），在这个类对象的地址空间的最靠前的位置存有指向虚函数表的指针。在虚函数表中，按照声明顺序依次排列所有的虚函数。由于C++在运行时并不维护类型信息，所以在编译时直接在子类的虚函数表中将被子类重写的方法替换掉。
​

在Java中，在运行时会维持类型信息以及类的继承体系。每一个类会在方法区中对应一个数据结构用于存放类的信息，可以通过Class对象访问这个数据结构。其中，类型信息具有superclass属性指示了其超类，以及这个类对应的方法表（其中只包含这个类定义的方法，不包括从超类继承来的）。而每一个在堆上创建的对象，都具有一个指向方法区类型信息数据结构的指针，通过这个指针可以确定对象的类型。

## oop

**上面列出的是整个Oops模块的组成结构，其中包含多个子模块。每一个子模块对应一个类型，每一个类型的OOP都代表一个在JVM内部使用的特定对象的类型。**
**​**

从上面的代码中可以看到，有一个变量opp的类型是oppDesc ，OOPS类的共同基类型为oopDesc。
​

**在Java程序运行过程中，每创建一个新的对象，在JVM内部就会相应地创建一个对应类型的OOP对象。**在HotSpot中，根据JVM内部使用的对象业务类型，具有多种oopDesc的子类。除了oppDesc类型外，opp体系中还有很多instanceOopDesc、arrayOopDesc 等类型的实例，他们都是oopDesc的子类。
​

**例，****arrayOopDesc****表示数组。**也就是说，**当我们使用****new****创建一个Java对象实例的时候，JVM会创建一个****instanceOopDesc****对象来表示这个Java对象。同理，当我们使用****new****创建一个Java数组实例的时候，JVM会创建一个****arrayOopDesc****对象来表示这个数组对象。**
**​**

在HotSpot中，oopDesc类定义在[oop.hpp](https://github.com/openjdk-mirror/jdk7u-hotspot/blob/50bdefc3afe944ca74c3093e7448d6b889cd20d1/src/share/vm/oops/oop.hpp)中，instanceOopDesc定义在[instanceOop.hpp](https://github.com/openjdk-mirror/jdk7u-hotspot/blob/50bdefc3afe944ca74c3093e7448d6b889cd20d1/src/share/vm/oops/instanceOop.hpp)中，arrayOopDesc定义在[arrayOop.hpp](https://github.com/openjdk-mirror/jdk7u-hotspot/blob/50bdefc3afe944ca74c3093e7448d6b889cd20d1/src/share/vm/oops/arrayOop.hpp)中。
​

简单看一下相关定义：
​

​

通过上面的源码可以看到，instanceOopDesc实际上就是继承了oopDesc，并没有增加其他的数据结构，也就是说instanceOopDesc中主要包含以下几部分数据：markOop _mark和union _metadata 以及一些不同类型的 field。
​

**HotSpot虚拟机中，对象在内存中存储的布局可以分为三块区域：对象头、实例数据和对齐填充。**在虚拟机内部，一个Java对象对应一个instanceOopDesc的对象。其中对象头包含了两部分内容：_mark和_metadata，而实例数据则保存在oopDesc中定义的各种field中。

## 对象头

上面代码中的_mark和_metadata其实就是对象头的定义。
​

对象头信息是与对象自身定义的数据无关的额外存储成本，考虑到虚拟机的空间效率，Mark Word被设计成一个非固定的数据结构以便在极小的空间内存储尽量多的信息，它会根据对象的状态复用自己的存储空间。
​

对markword的设计方式上，非常像网络协议报文头：将mark word划分为多个比特位区间，并在不同的对象状态下赋予比特位不同的含义。下图描述了在32位虚拟机上，在对象不同状态时 mark word各个比特位区间的含义。
​

同样，在HotSpot的源码中我们可以找到关于对象头对象的定义，会一一印证上图的描述。对应与[markOop.hpp](https://github.com/openjdk-mirror/jdk7u-hotspot/blob/50bdefc3afe944ca74c3093e7448d6b889cd20d1/src/share/vm/oops/markOop.hpp)类。
​

从上面的枚举定义中可以看出，对象头中主要包含了GC分代年龄、锁状态标记、哈希码、epoch等信息。
​

从上图中可以看出，对象的状态一共有五种，分别是无锁态、轻量级锁、重量级锁、GC标记和偏向锁。在32位的虚拟机中有两个Bits是用来存储锁的标记为的，但是我们都知道，两个bits最多只能表示四种状态：00、01、10、11，那么第五种状态如何表示呢 ，就要额外依赖1Bit的空间，使用0和1来区分。
​

​

## klass

和oopDesc是其他oop类型的父类一样，Klass类是其他klass类型的父类。

Klass向JVM提供两个功能：
- 实现语言层面的Java类（在Klass基类中已经实现）- 实现Java对象的分发功能（由Klass的子类提供虚函数实现）文章开头的时候说过：之所以设计oop-klass模型，是因为HotSopt JVM的设计者不想让每个对象中都含有一个虚函数表。
HotSopt JVM的设计者把对象一拆为二，分为klass和oop，其中oop的职能主要在于表示对象的实例数据，所以其中不含有任何虚函数。而klass为了实现虚函数多态，所以提供了虚函数表。所以，关于Java的多态，其实也有虚函数的影子在。
_metadata是一个共用体，其中_klass是普通指针，_compressed_klass是压缩类指针。这两个指针都指向instanceKlass对象，它用来描述对象的具体类型。
​

### instanceKlass

JVM在运行时，需要一种用来标识Java内部类型的机制。在HotSpot中的解决方案是：为每一个已加载的Java类创建一个instanceKlass对象，用来在JVM层表示Java类。
​

来看下[instanceKlass](https://github.com/openjdk-mirror/jdk7u-hotspot/blob/50bdefc3afe944ca74c3093e7448d6b889cd20d1/src/share/vm/oops/instanceKlass.hpp)的内部结构：
​

可以看到，一个类该具有的东西，这里面基本都包含了。
这里还有个点需要简单介绍一下。
在JVM中，对象在内存中的基本存在形式就是oop。那么，对象所属的类，在JVM中也是一种对象，因此它们实际上也会被组织成一种oop，即klassOop。同样的，对于klassOop，也有对应的一个klass来描述，它就是klassKlass，也是klass的一个子类。klassKlass作为oop的klass链的端点。关于对象和数组的klass链大致如下图：
​

在这种设计下，JVM对内存的分配和回收，都可以采用统一的方式来管理。oop-klass-klassKlass关系如图：
​
