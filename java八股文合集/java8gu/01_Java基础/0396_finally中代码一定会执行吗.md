# ✅finally中代码一定会执行吗？

> 题号：0396 ｜ 分类：01_Java基础

---

## 典型回答

> 📎 相关：[✅final、finally、finalize有什么区别](https://www.yuque.com/hollis666/fsn3og/aptpcugzork18qpx)

通常情况下，finally的代码一定会被执行，但是这是有一个前提的，：

1、对应 try 语句块被执行，

2、程序正常运行。

如果没有符合这两个条件的话，finally中的代码就无法被执行，如发生以下情况，都会导致finally不会执行：

1、System.exit()方法被执行

2、Runtime.getRuntime().halt()方法被执行

3、try或者catch中有死循环

4、操作系统强制杀掉了JVM进程，如执行了kill -9

5、其他原因导致的虚拟机崩溃了

6、虚拟机所运行的环境挂了，如计算机电源断了

7、如果一个finally是由守护线程执行的，那么是不保证一定能执行的，如果这时候JVM要退出，JVM会检查其他非守护线程，如果都执行完了，那么就直接退出了。这时候finally可能就没办法执行完。

> 📎 相关：[✅什么是守护线程，和普通线程有什么区别？](https://www.yuque.com/hollis666/fsn3og/dlg6vw)

## 扩展知识

## finally执行顺序

> 📎 相关：[✅try中return A，catch中return B，finally中return C，最终返回值是什么？](https://www.yuque.com/hollis666/fsn3og/ltw8ngs7yntrdk3a)
