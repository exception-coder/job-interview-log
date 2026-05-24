# ✅为什么不能在try-catch中捕获子线程的异常?

> 题号：0694 ｜ 分类：01_Java基础

---

## 典型回答

在Java中，主线程不能直接捕获子线程抛出的异常的！主要是因为子线程和主线程是独立的执行单元，它们的执行是并发的，因此主线程无法捕获子线程的异常。子线程的异常通常由子线程自己处理或通过适当的异常处理机制处理。

线程隔离，这也是Java保证线程出现异常不会影响整个进程的一个主要原理。

> 📎 相关：[Java线程出现异常，进程为啥不会退出？](https://www.yuque.com/hollis666/fsn3og/vhge9qann70zsrag)

那么也就是说，以下代码是无法生效的：

```java
public class Main {
    public static void main(String[] args) {
        Thread childThread = new Thread(() -> {
            try {
                // 子线程抛出异常
                int result = 10 / 0;
            } catch (ArithmeticException e) {
                System.out.println("子线程捕获到异常");
                throw e;
            }
        });

        try {
            // 主线程等待子线程执行完成
            childThread.start();
        } catch (InterruptedException e) {
            System.out.println("主线程捕获到异常");
        }

        System.out.println("主线程继续执行");
    }
}

```

以上代码输出结果：

```java
子线程捕获到异常
主线程继续执行
```

说明子线程中发生的异常，在主线程中是无法直接捕获的。但是也不是毫无办法的！

## 扩展知识

## 如何实现主线程捕获子线程异常

> 📎 相关：[✅如何实现主线程捕获子线程异常](https://www.yuque.com/hollis666/fsn3og/iao166g9qgzld9e3)
