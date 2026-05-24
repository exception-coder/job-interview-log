# ✅javap命令的作用是什么？

# 典型回答

javap是jdk自带的一个工具，可以对代码反编译，也可以查看java编译器生成的字节码。
​

​

一般情况下，很少有人使用javap对class文件进行反编译，因为有很多成熟的反编译工具可以使用，比如jad。但是，javap还可以查看java编译器为我们生成的字节码。通过它，可以对照源代码和字节码，从而了解很多编译器内部的工作。
​

# 扩展知识

## 使用

javap命令分解一个class文件，它根据options来决定到底输出什么。如果没有使用options，那么javap将会输出包，类里的protected和public域以及类里的所有方法。javap将会把它们输出在标准输出上。来看这个例子，先编译(javac)下面这个类。
​

在命令行上键入javap DocFooter后，输出结果如下：
​

如果加入了-c，即javap -c JavapTest，那么输出结果如下：
​

其中的ldf dup astore都是一条条指令。
​

如果想要查看编译后的class文件中的常量池信息，可以加上-v
​

上面的Constant pool部分就是常量池，可以看到其中包含了两个字符串常量：
​

## 

通过上面的结果我们也可以知道，javap并没有将字节码反编译成java文件，而是生成了一种我们可以看得懂字节码。其实javap生成的文件仍然是字节码，只是程序员可以稍微看得懂一些。如果你对字节码有所掌握，还是可以看得懂以上的代码的。其实就是把String转成hashcode，然后进行比较。
​

一般情况下我们会用到javap命令的时候不多，一般只有在真的需要看字节码的时候才会用到。但是字节码中间暴露的东西是最全的，你肯定有机会用到，比如我在分析synchronized的原理的时候就有是用到javap。通过javap生成的字节码，我发现synchronized底层依赖了ACC_SYNCHRONIZED标记和monitorenter、monitorexit两个指令来实现同步。
