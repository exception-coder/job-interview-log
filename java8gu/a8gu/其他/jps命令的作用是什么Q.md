# ✅jps命令的作用是什么？

# 典型回答

我们知道，很多Java命令都在jdk的`JAVA_HOME/bin/`目录下面，jps也不例外，他就在bin目录下，所以，他是java自带的一个命令。

jps(Java Virtual Machine Process Status Tool)是JDK 1.5提供的一个**显示当前所有java进程pid**的命令，简单实用，非常适合在linux/unix平台上简单察看当前java进程的一些简单情况。
​

# 扩展知识

## 原理

jdk中的jps命令可以显示当前运行的java进程以及相关参数，它的实现机制如下：

java程序在启动以后，会在java.io.tmpdir指定的目录下，就是临时文件夹里，生成一个类似于hsperfdata_User的文件夹，这个文件夹里（在Linux中为/tmp/hsperfdata_{userName}/），有几个文件，名字就是java进程的pid，因此列出当前运行的java进程，只是把这个目录里的文件名列一下而已。 至于系统的参数什么，就可以解析这几个文件获得。
​

上面的内容就是我机器中/tmp/hsperfdata_hollis目录下的内容，其中2679就是我机器上当前运行中的java的进程的pid，我们执行jps验证一下：
​

执行了jps命令之后，我们发现有两个java进程，一个是pid为2679的eclipse运行的进程，另外一个是pid为4445的jps使用的进程（他也是java命令，也要开一个进程）
​

## 使用

想要学习一个命令，先来看看帮助，使用jps -help查看帮助：
​

接下来，为了详细介绍这些参数，我们编写几个类，在main方法里写一个while(true)的循环，查看java进程情况。代码如下：
​

-q 只显示pid，不显示class名称,jar文件名和传递给main 方法的参数
​

-m 输出传递给main 方法的参数，在嵌入式jvm上可能是null， 在这里，在启动main方法的时候，我给String[] args传递两个参数。hollis,chuang,执行jsp -m:
​

-l 输出应用程序main class的完整package名 或者 应用程序的jar文件完整路径名
​

-v 输出传递给JVM的参数 在这里，在启动main方法的时候，我给jvm传递一个参数：-Dfile.encoding=UTF-8,执行jps -v：
​

PS:jps命令有个地方很不好，似乎只能显示当前用户的java进程，要显示其他用户的还是只能用unix/linux的ps命令。
​

​
