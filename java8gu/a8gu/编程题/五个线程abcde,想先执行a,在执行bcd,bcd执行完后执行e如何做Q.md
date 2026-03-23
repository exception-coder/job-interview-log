# ✅五个线程abcde，想先执行a，在执行bcd，bcd执行完后执行e如何做？

# 典型回答

这也是一个典型的多线程之间通信的问题， 需要控制多个线程的执行顺序，即：**a ➔ (b、c、d并发完成) ➔ e**
**​**

这个场景中，用 CountDownLatch  就比较合适，大致流程如下：
- `a`线程执行，执行完后 `latchA.countDown()`- `b/c/d`线程在 `latchA.await()` 处等待，直到a执行完一起开始- `b/c/d`各自执行，完成后各自 `latchBCD.countDown()`- `e`线程在 `latchBCD.await()` 处等，等bcd都完成后执行​

具体代码如下：
​
