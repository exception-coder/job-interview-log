# ✅线程池中使用ThreadLocal会有哪些潜在风险？

> 题号：0135 ｜ 分类：03_并发编程

---

## 典型回答

> 📎 相关：[✅ThreadLocal为什么会导致内存泄漏？如何解决的？](https://www.yuque.com/hollis666/fsn3og/bueq7weva8ha9f1p)

其实这个问题就是上面这个问题的变形。（请仔细看上面这篇文章之后再学习本文，不然可能看不懂。）

如果在线程池中使用ThreadLocal，线程就要复用，就不会被销毁，ThreadLocal 变量不会自动清理，容易造成内存泄漏！

![image.png](https://cdn.nlark.com/yuque/0/2023/png/5378072/1703300655575-0cb5f021-ca9d-49b9-893d-7f4be614edd4.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_63%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

因为`ThreadLocal` 绑定在线程的 `ThreadLocalMap` 里。如上图的引用链。如果线程一直被复用，那么Thread Ref就会一直在，那么他关联的Thread对象，ThreadLocalMap和其中的Value就会一直在，无法被回收。

随着线程不断服用，不断的往ThreadLocalMap中加东西，就会导致Value越来越多。最终导致OOM。

ThreadLocalMap底层使用数组来保存元素，使用“线性探测法”来解决hash冲突的，在每次调用ThreadLocal的get、set、remove等方法的时候，内部会实际调用ThreadLocalMap的get、set、remove等操作。

而ThreadLocalMap的每次get、set、remove，都会清理key为null,但是value还存在的Entry。

**所以，当我们在一个ThreadLocal用完之后，手动调用一下remove，就可以在下一次GC的时候，把Entry清理掉。**

**(装B时刻：现在是2025年9月19日，JDK25在两天前发布了，新出了一个ScopedValue，可以解决这个内存泄漏的问题，你如果面试的时候主动提一句，会让面试官觉得你很有技术热情。很加分！！！）**

> 📎 相关：[✅JDK25的ScopedValue是什么？为什么可以替代ThreadLocal？](https://www.yuque.com/hollis666/fsn3og/acwiha67w8oklohg)

##
