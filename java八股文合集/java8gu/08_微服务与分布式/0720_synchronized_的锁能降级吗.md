# ✅synchronized 的锁能降级吗？

> 题号：0720 ｜ 分类：08_微服务与分布式

---

## 典型回答

> 📎 相关：[✅synchronized的锁升级过程是怎样的？](https://www.yuque.com/hollis666/fsn3og/cv5kt1)

我们知道，synchronized 是有锁升级的过程的，会从偏向锁升级到轻量级锁和重量级锁，那么synchronized的锁有降级的过程吗？（这个问题，网上也有很多文章，五花八门。。。）

**大家理解的锁降级，如果是指锁从重量级状态回退到轻量级或偏向锁状态的过程，那么可以明确的说，当前的HotSpot虚拟机实现是不支持的。**

因为锁一旦升级为重量级锁，它将保持在这个状态，直到锁被完全释放。

但是，**你要说，一旦一个锁从偏向、到轻量级锁、再到重量级锁加锁之后，后面的所有加锁都是以重量级锁的方式加锁了，这么说也不对！**

**因为有一种特殊情况的"降级"，那就是重量级锁的Monitor对象在不再被任何线程持有时，被清理和回收的过程。**这一过程确实可以在Stop-the-World（STW）暂停期间进行，这时所有Java线程都停在安全点（SafePoint）。这个过程会做以下事情：

1. 锁状态检查：在STW停顿期间，JVM会检查所有的Monitor对象。
2. 确定降级对象：JVM识别出那些没有被任何线程持有的Monitor对象。这通常是通过检查Monitor对象的锁计数器或者所有权信息来实现的。
3. "降级"操作：对于那些确定未被使用的Monitor对象，JVM会进行所谓的“deflation”操作，即清理这些对象的状态，使其不再占用系统资源。在某些情况下，这可能涉及到重置Monitor状态，释放与其相关的系统资源等。

以上，说的是 HotSpot，并不是所有虚拟机都这样，有的虚拟机还真支持从重量级锁降级到轻量级锁，比如 JRocket 这个虚拟机。

下面是关于JRocket 的锁的降级的说明( [https://docs.oracle.com/cd/E13188_01/jrockit/docs142/usingJRA/applocks.html](https://docs.oracle.com/cd/E13188_01/jrockit/docs142/usingJRA/applocks.html))

![image.png](https://cdn.nlark.com/yuque/0/2024/png/5378072/1714541306562-862ad765-ee44-4da9-ad41-2fa170638b19.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_100%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

翻译一下就是，当最后一个争用线程释放重量级锁时，锁通常仍然保持为重量级。即使没有争用，获取重量级锁的代价也比获取轻量级锁（thin lock）更高。如果JRockit认为锁会从变轻中受益，它可能会再次将其“压缩”为轻量级锁。
