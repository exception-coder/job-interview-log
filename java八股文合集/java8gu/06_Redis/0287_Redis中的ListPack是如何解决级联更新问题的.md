# ✅Redis中的ListPack是如何解决级联更新问题的？

> 题号：0287 ｜ 分类：06_Redis

---

## 典型回答

> 📎 相关：[✅介绍下Redis中的ZipList和他的级联更新问题](https://www.yuque.com/hollis666/fsn3og/pbnk0e7d4dhpzg1v)

上面的文章中，介绍过ZipList的级联更新问题。为了解决这个问题，Redis在5.0中推出了一个新的数据结构，那就是我们要介绍的ListPack了。

我们知道，ZipList之所以会出现级联更新，主要是因为他的Entry中有个prevlen字段，记录的是上一个Entry的长度，并且在长度不同的情况下可能会用1个或者5个字节表示。

那么ListPack为了解决这个问题，其实只要把prevlen干掉就行了，他也正是这么干的， 看下ListPack的结构：

![image.png](https://cdn.nlark.com/yuque/0/2025/png/5378072/1751644923235-f46799da-bb71-41aa-aa4d-651fac0d751b.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_39%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

主要改动是Entry这里，废弃了原来的prevlen，而是改用了新的方式，用一个backlen来记录整个Entry的字节数。并且位于元素末尾。他同样采用变成存储，可以用1-5个字节来存储。

就这样，因为ListPack的每个数据项都只会记录自己的长度，而不是再记录上一个节点的长度了，那么，在ListPack中新增或者删除元素，只会影响到这个元素自己，而不需要其他的元素进行级联更新了。也就解决了级联更新的问题了。
