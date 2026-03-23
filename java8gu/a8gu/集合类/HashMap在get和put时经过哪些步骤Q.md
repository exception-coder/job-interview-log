# ✅HashMap在get和put时经过哪些步骤？

# 典型回答对于HashMap来说，底层是基于散列算法实现，散列算法分为散列再探测和拉链式。HashMap 则使用了拉链式的散列算法，即采用数组+链表/红黑树来解决hash冲突，数组是HashMap的主体，链表主要用来解决哈希冲突。这个数组是Entry类型，它是HashMap的内部类，每一个Entry包含一个key-value键值对

## get方法下面是JDK 1.8中HashMap的get方法的简要实现过程：
- 首先，需要计算键的哈希值，并通过哈希值计算出在数组中的索引位置。- 如果该位置上的元素为空，说明没有找到对应的键值对，直接返回null。- 如果该位置上的元素不为空，遍历该位置上的元素，如果找到了与当前键相等的键值对，那么返回该键值对的值，否则返回null。​

​

get 方法看起来很简单，就是通过同样的 hash 得到 key 的hash 值。重点看下 getNode方法：
​

  

## put方法下面是JDK 1.8中HashMap的put方法的简要实现过程：
- 首先，put方法会计算键的哈希值(通过调用hash方法)，并通过哈希值计算出在数组中的索引位置。- 如果该位置上的元素为空，那么直接将键值对存储在该位置上。- 如果该位置上的元素不为空，那么遍历该位置上的元素，如果找到了与当前键相等的键值对，那么将该键值对的值更新为当前值，并返回旧值。- 如果该位置上的元素不为空，但没有与当前键相等的键值对，那么将键值对插入到链表或红黑树中（如果该位置上的元素数量超过了一个阈值，就会将链表转化为红黑树来提高效率）。- 如果插入成功，返回被替换的值；如果插入失败，返回null。- 插入成功后，如果需要扩容，那么就进行一次扩容操作。​

put方法的代码很简单，就一行代码：

核心其实是通过 `putValue`方法实现的，在传给`putValue`的参数中，先调用`hash`获取了一下hashCode。

**putVal 方法主要实现如下，给大家增加了注释：**

# 知识扩展
## HashMap如何定位key先通过 `(table.length - 1) & (key.hashCode ^ (key.hashCode >>> 16))`定位到key位于哪个table中，然后再通过`key.equals(rowKey)`来判断两个key是否相同，综上，是先通过hashCode和equals来定位KEY的。
源码如下：
所以，在使用HashMap的时候，尽量用String和Enum等已经实现过hashCode和equals方法的官方库类，如果一定要自己的类，就一定要实现hashCode和equals方法

### HashMap定位tableIndex的骚操作通过源码发现，hashMap定位tableIndex的时候，是通过`(table.length - 1) & (key.hashCode ^ (key.hashCode >> 16))`，而不是常规的`key.hashCode % (table.length)`呢？
- 为什么是用&而不是用%：因为&是基于内存的二进制直接运算，比转成十进制的取模快的多。以下运算等价：`X % 2^n = X & (2^n – 1)`。这也是hashMap每次扩容都要到2^n的原因之一- 为什么用key.hash ^ (key.hash >> 16)而不是用key.hash：这是因为增加了扰动计算，使得hash分布的尽可能均匀。因为hashCode是int类型，虽然能映射40亿左右的空间，但是，HashMap的table.length毕竟不可能有那么大，所以为了使hash%table.length之后，分布的尽可能均匀，就需要对实例的hashCode的值进行扰动，说白了，就是将hashCode的高16和低16位，进行异或，使得hashCode的值更加分散一点。
## HashMap的key为null时，没有hashCode是如何存储的？HashMap对key=null的case做了特殊的处理，key值为null的kv对，总是会放在数组的第一个元素中，如下源码所示：

## HashMap的value可以为null吗？有什么优缺点？HashMap的key和value都可以为null，优点很明显，不会因为调用者的粗心操作就抛出NPE这种RuntimeException，但是缺点也很隐蔽，就像下面的代码一样：
虽然`map.contains(key)`，但是`map.get(key)==null`，就会导致后面的业务逻辑出现NPE问题
