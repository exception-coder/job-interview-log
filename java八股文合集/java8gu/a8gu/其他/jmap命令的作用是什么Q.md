# ✅jmap命令的作用是什么？

# 典型回答

jmap是JDK自带的工具软件，主要用于打印指定Java进程的内存细节。也就是说可以使用jmap生成Heap Dump。**如果程序内存不足或者频繁GC，很有可能存在内存泄露情况，这时候就要借助Java堆Dump查看对象的情况。**
​

> 堆Dump是反应Java堆使用情况的内存镜像，其中主要包括系统信息、虚拟机属性、完整的线程Dump、所有类和对象的状态等。 一般，在内存不足、GC异常等情况下，我们就会怀疑有内存泄露。这个时候我们就可以制作堆Dump来查看具体情况。分析原因。

需要注意：对线程/堆进行Dump时（执行jstack、jmap等命令时），是想要获取线程或者堆在特定时刻的状态和信息。为了确保这些信息的准确性和一致性，JVM在进行Dump时会暂停所有线程。也需要进入安全点才行。

# 扩展知识

## 使用

**用法摘要**
指定进程号(pid)的进程 jmap [ option ] 指定核心文件 jmap [ option ] 指定远程调试服务器 jmap [ option ] [server-id@]

参数：
- option- 选项参数是互斥的(不可同时使用)。想要使用选项参数，直接跟在命令名称后即可。- pid- 需要打印配置信息的进程ID。该进程必须是一个Java进程。想要获取运行的Java进程列表，你可以使用jps。- executable- 产生核心dump的Java可执行文件。- core- 需要打印配置信息的核心文件。- remote-hostname-or-IP- 远程调试服务器的(请查看jsadebugd)主机名或IP地址。- server-id- 可选的唯一id，如果相同的远程主机上运行了多台调试服务器，用此选项参数标识服务器。​

选项:
- <no option>- 如果使用不带选项参数的jmap打印共享对象映射，将会打印目标虚拟机中加载的每个共享对象的起始地址、映射大小以及共享对象文件的路径全称。这与Solaris的pmap工具比较相似。- -dump:[live,]format=b,file=<filename>- 以hprof二进制格式转储Java堆到指定filename的文件中。live子选项是可选的。如果指定了live子选项，堆中只有活动的对象会被转储。想要浏览heap dump，你可以使用jhat(Java堆分析工具)读取生成的文件。- -finalizerinfo- 打印等待终结的对象信息。- -heap- 打印一个堆的摘要信息，包括使用的GC算法、堆配置信息和generation wise heap usage。- -histo[:live]- 打印堆的柱状图。其中包括每个Java类、对象数量、内存大小(单位：字节)、完全限定的类名。打印的虚拟机内部的类名称将会带有一个'*'前缀。如果指定了live子选项，则只计算活动的对象。- -permstat- 打印Java堆内存的永久保存区域的类加载器的智能统计信息。对于每个类加载器而言，它的名称、活跃度、地址、父类加载器、它所加载的类的数量和大小都会被打印。此外，包含的字符串数量和大小也会被打印。- -F- 强制模式。如果指定的pid没有响应，请使用jmap -dump或jmap -histo选项。此模式下，不支持live子选项。- -h- 打印帮助信息。- -help- 打印帮助信息。- -J<flag>- 指定传递给运行jmap的JVM的参数​

## 典型用法

**查看java 堆（heap）使用情况**，执行命令： hollis@hos:~/workspace/design_apaas/apaasweb/control/bin$ jmap -heap 31846
​

**查看堆内存(histogram)中的对象数量及大小**。执行命令： hollis@hos:~/workspace/design_apaas/apaasweb/control/bin$ jmap -histo 3331

jmap -histo:live 这个命令执行，JVM会先触发gc，然后再统计信息。
​

**将内存使用的详细情况输出到文件**，执行命令： hollis@hos:~/workspace/design_apaas/apaasweb/control/bin$ jmap -dump:format=b,file=heapDump 6900
​

然后用jhat命令可以参看 jhat -port 5000 heapDump 在浏览器中访问：http://localhost:5000/ 查看详细信息
