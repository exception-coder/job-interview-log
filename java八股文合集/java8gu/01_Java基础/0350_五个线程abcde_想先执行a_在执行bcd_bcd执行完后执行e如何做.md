# ✅五个线程abcde，想先执行a，在执行bcd，bcd执行完后执行e如何做？

> 题号：0350 ｜ 分类：01_Java基础

---

## 典型回答

这也是一个典型的多线程之间通信的问题， 需要控制多个线程的执行顺序，即：**a ➔ (b、c、d并发完成) ➔ e**

这个场景中，用 CountDownLatch  就比较合适，大致流程如下：

- `a`线程执行，执行完后 `latchA.countDown()`
- `b/c/d`线程在 `latchA.await()` 处等待，直到a执行完一起开始
- `b/c/d`各自执行，完成后各自 `latchBCD.countDown()`
- `e`线程在 `latchBCD.await()` 处等，等bcd都完成后执行

具体代码如下：

```text
import java.util.concurrent.CountDownLatch;

public class ThreadOrderControl {
    public static void main(String[] args) throws InterruptedException {
        CountDownLatch latchA = new CountDownLatch(1); // 控制bcd等待a完成
        CountDownLatch latchBCD = new CountDownLatch(3); // 控制e等待bcd完成

        Thread a = new Thread(() -> {
            System.out.println("A start");
            // do something...
            System.out.println("A done");
            latchA.countDown(); // 通知bcd可以开始了
        });

        Runnable bcdTask = (String name) -> {
            try {
                latchA.await(); // 等a完成
                System.out.println(name + " start");
                // do something...
                System.out.println(name + " done");
                latchBCD.countDown(); // bcd每个线程做完都countDown一次
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        };

        Thread b = new Thread(() -> bcdTask.run("B"));
        Thread c = new Thread(() -> bcdTask.run("C"));
        Thread d = new Thread(() -> bcdTask.run("D"));

        Thread e = new Thread(() -> {
            try {
                latchBCD.await(); // 等bcd全部完成
                System.out.println("E start");
                // do something...
                System.out.println("E done");
            } catch (InterruptedException ex) {
                ex.printStackTrace();
            }
        });

        // 启动所有线程
        a.start();
        b.start();
        c.start();
        d.start();
        e.start();
    }
}
```
