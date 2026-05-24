# ✅什么是fail-fast？什么是fail-safe？

# 典型回答

在系统设计中，快速失效(fail-fast)系统是一种可以立即报告任何可能表明故障的情况的系统。快速失效系统通常设计用于停止正常操作，而不是试图继续可能存在缺陷的过程。
​

其实，这是一种理念，说白了就是在做系统设计的时候先考虑异常情况，一旦发生异常，直接停止并上报。
举一个最简单的fail-fast的例子：
​

    
上面的代码是一个对两个整数做除法的方法，在divide方法中，我们对除数做了个简单的检查，如果其值为0，那么就直接抛出一个异常，并明确提示异常原因。这其实就是fail-fast理念的实际应用。
​

这样做的好处就是可以预先识别出一些错误情况，一方面可以避免执行复杂的其他代码，另外一方面，这种异常情况被识别之后也可以针对性的做一些单独处理。
​

在Java中，集合类中有用到fail-fast机制进行设计，一旦使用不当，触发fail-fast机制设计的代码，就会发生非预期情况。
​

在集合类中，为了避免并发修改，会维护一个expectedModCount属性，他表示这个迭代器预期该集合被修改的次数。还有一个modCount属性，他表示该集合实际被修改的次数。在集合被修改时，会去比较modCount和expectedModCount的值，如果不一致，则会触发fail-fast机制，抛出ConcurrentModificationException。
​

fail-safe 机制是为线程安全的集合准备的，可以避免像 fail-fast 一样在并发使用集合的时候，不断地抛出异常。 

# 扩展知识
## 集合类中的fail-fast我们通常说的Java中的fail-fast机制，默认指的是Java集合的一种错误检测机制。当多个线程对部分集合进行结构上的改变的操作时，有可能会产生fail-fast机制，这个时候就会抛出ConcurrentModificationException
​

ConcurrentModificationException，当方法检测到对象的并发修改，但不允许这种修改时就抛出该异常。
​

在Java中， 如果在foreach 循环里对某些集合元素进行元素的 remove/add 操作的时候，就会触发fail-fast机制，进而抛出ConcurrentModificationException。
​

如以下代码：
以上代码，使用增强for循环遍历元素，并尝试删除其中的Hollis字符串元素。运行以上代码，会抛出以下异常：

同样的，读者可以尝试下在增强for循环中使用add方法添加元素，结果也会同样抛出该异常。
在深入原理之前，我们先尝试把foreach进行解语法糖，看一下foreach具体如何实现的。
我们使用jad工具，对编译后的class进行反编译，得到以下代码：

可以发现，foreach其实是依赖了while循环和Iterator实现的。

### 异常原理通过以上代码的异常堆栈，我们可以跟踪到真正抛出异常的代码是：
该方法是在iterator.next()方法中调用的。我们看下该方法的实现：

如上，在该方法中对modCount和expectedModCount进行了比较，如果二者不相等，则抛出ConcurrentModificationException。
那么，modCount和expectedModCount是什么？是什么原因导致他们的值不相等的呢？
modCount是ArrayList中的一个成员变量。它表示该集合实际被修改的次数。

当使用以上代码初始化集合之后该变量就有了。初始值为0。
expectedModCount 是 ArrayList中的一个内部类——Itr中的成员变量。

以上代码，即可得到一个 Itr类，该类实现了Iterator接口。
expectedModCount表示这个迭代器预期该集合被修改的次数。其值随着Itr被创建而初始化。只有通过迭代器对集合进行操作，该值才会改变。
那么，接着我们看下userNames.remove(userName);方法里面做了什么事情，为什么会导致expectedModCount和modCount的值不一样。
通过翻阅代码，我们也可以发现，remove方法核心逻辑如下：

可以看到，它只修改了modCount，并没有对expectedModCount做任何操作。
简单画一张图描述下以上场景：

​

简单总结一下，之所以会抛出CMException异常，是因为我们的代码中使用了增强for循环，而在增强for循环中，集合遍历是通过iterator进行的，但是元素的add/remove却是直接使用的集合类自己的方法。这就导致iterator在遍历的时候，会发现有一个元素在自己不知不觉的情况下就被删除/添加了，就会抛出一个异常，用来提示用户，可能发生了并发修改！
所以，在使用Java的集合类的时候，如果发生CMException，优先考虑fail-fast有关的情况，实际上这里并没有真的发生并发，只是Iterator使用了fail-fast的保护机制，只要他发现有某一次修改是未经过自己进行的，那么就会抛出异常。

## fail-safe为了避免触发fail-fast机制，导致异常，我们可以使用Java中提供的一些采用了fail-safe机制的集合类。
这样的集合容器在遍历时不是直接在集合内容上访问的，而是先复制原有集合内容，在拷贝的集合上进行遍历。
java.util.concurrent包下的容器都是fail-safe的，可以在多线程下并发使用，并发修改。同时也可以在foreach中进行add/remove 。
我们拿CopyOnWriteArrayList这个fail-safe的集合类来简单分析一下。

以上代码，使用CopyOnWriteArrayList代替了ArrayList，就不会发生异常。
fail-safe集合的所有对集合的修改都是先拷贝一份副本，然后在副本集合上进行的，并不是直接对原集合进行修改。并且这些修改方法，如add/remove都是通过加锁来控制并发的。
所以，CopyOnWriteArrayList中的迭代器在迭代的过程中不需要做fail-fast的并发检测。（因为fail-fast的主要目的就是识别并发，然后通过异常的方式通知用户）
但是，虽然基于拷贝内容的优点是避免了ConcurrentModificationException，但同样地，迭代器并不能访问到修改后的内容。如以下代码：

我们得到CopyOnWriteArrayList的Iterator之后，通过for循环直接删除原数组中的值，最后在结尾处输出Iterator，结果发现内容如下：

迭代器遍历的是开始遍历那一刻拿到的集合拷贝，在遍历期间原集合发生的修改迭代器是不知道的。

## 什么是Copy-On-Write在了解了CopyOnWriteArrayList之后，不知道大家会不会有这样的疑问：他的add/remove等方法都已经加锁了，还要copy一份再修改干嘛？多此一举？同样是线程安全的集合，这玩意和Vector有啥区别呢？
Copy-On-Write简称COW，是一种用于程序设计中的优化策略。其基本思路是，从一开始大家都在共享同一个内容，当某个人想要修改这个内容的时候，才会真正把内容Copy出去形成一个新的内容然后再改，这是一种延时懒惰策略。
CopyOnWrite容器即写时复制的容器。通俗的理解是当我们往一个容器添加元素的时候，不直接往当前容器添加，而是先将当前容器进行Copy，复制出一个新的容器，然后往新的容器里添加元素，添加完元素之后，再将原容器的引用指向新的容器。
CopyOnWriteArrayList中add/remove等写方法是需要加锁的，目的是为了避免Copy出N个副本出来，导致并发写。
但是，CopyOnWriteArrayList中的读方法是没有加锁的。

这样做的好处是我们可以对CopyOnWrite容器进行并发的读，当然，这里读到的数据可能不是最新的。因为写时复制的思想是通过延时更新的策略来实现数据的最终一致性的，并非强一致性。
**所以CopyOnWrite容器是一种读写分离的思想，读和写不同的容器。**而Vector在读写的时候使用同一个容器，读写互斥，同时只能做一件事儿。
