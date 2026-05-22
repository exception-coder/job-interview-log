# ✅2年985硕，直播业务，redis，kafka，

> 题号：0341 ｜ 分类：22_面经与项目分享

---

## 面试者背景

**2年985硕，直播业务，JAVA技术，redis，kafka，**

**直播什么业务，哪部分复杂一点？点赞****&****连麦事件、****spring****消费事件，顺序消息，**

**Spring****的事件和****MQ****区别，各自有什么好处？****Spring****的事件默认是异步的吗？如何实现异步？**

**为什么用事件驱动的方案？好处是啥？异步通信、非阻塞，**

**Kafka****如果消费失败了怎么办？应用挂了怎么办？**

**如何能避免丢消息问题？落表，如何设计这张消息表？eventid、state、body、eventType，failReason、times、lastExTime**

**如果用了消息表了，有序如何保证？消息表如何设计索引？事件****id****唯一索引、状态索引，**

**状态区分度不高加索引有用吗？****event****执行会用什么设计模式？**

**策略模式好处是啥，公共的逻辑如何处理？模板方法模式。**

**点赞是每一次都会发个事件吗？靠****kafka****消息合并、**

**连麦有什么特别的难点吗？消息的严格有序是如何保障的？发送到同一分区、单线程消费、**

**如果发生了重平衡，有序还能保障吗？重平衡会带来什么问题？****stw****、消息堆积、重复消费、**

**Kafka****的渐进式重平衡知道吗？**

**你们的连麦支持同时连麦？如何支持优先连麦？最多同时可以连多少人？**

**如果避免并发操作连多？****redis****记录连麦人数？为啥用****redis****可以解决并发问题？单线程**

**工作中有封装过一些公共的组件吗？****SimpleDateFormat****做日期转换？**

**SDF****的线程安全问题知道吗。如何解决？**

**日志框架用的哪个？****log4j****，同步日志还是异步日志？你自己配置过****log4j****的配置文件吗？**

**看过哪些源码么？****Spring****、****Spring****的****bean****的初始化过程，实例化和初始化区别，**

**Bean****实例化的入口的方法和类名知道么。**

**有什么情况会导致一个bean无法被初始化么？构造器注入&循环依赖，@Lazy**

**Spring****之前用的哪个版本？****SpringBoot 3.0****知道么？****AOT****编译，定义****starter****，**

**定义一个****starter****需要做什么？在****starter****里面如何做个开关控制****bean****的实例化？**

**Spring****的事务机制了解么？编程式****&****声明式，你觉得声明式事务有啥缺点。**

**声明式事务，事务失效了，可能有哪些情况？****private****调用、****this****调用为啥不生效？****AOP****、****final****、****rollbackFor****、数据库不支持、多线程会导致事务失效吗？为什么？**

**Threadlocal****在哪些框架有应用？****Spring****、****Mybatis****有吗？全链路追踪框架**

**如何在线程池之间传递****ThreadLocal****？****ITL****、****TTL****，****TTL****的原理知道么？**

**有最近看过哪些框架、技术的新版本么？****JDK ****新版本有啥新特性？虚拟线程。用了虚拟线程后还有必要用线程池吗？守护线程、**

**堆上还有很大内存，但是还是有频繁的fullgc，可能是什么原因？system.gc被调用、CMS搞不定了要用G1？**

## 题目解析

**Spring****的事件和****MQ****区别，各自有什么好处？****Spring****的事件默认是异步的吗？如何实现异步？**

**为什么用事件驱动的方案？好处是啥？异步通信、非阻塞，**

> 📎 相关：[✅Spring Event和MQ有什么区别？各自适用场景是什么？](https://www.yuque.com/hollis666/fsn3og/eugy3gggbymf6gp3)

> 📎 相关：[✅在Spring中如何使用Spring Event做事件驱动](https://www.yuque.com/hollis666/fsn3og/lgs78ulq6l3cg1qk)

**Kafka****如果消费失败了怎么办？应用挂了怎么办？**

**如何能避免丢消息问题？落表，如何设计这张消息表？eventid、state、body、eventType，failReason、times、lastExTime**

**如果用了消息表了，有序如何保证？消息表如何设计索引？事件id唯一索引、状态索引，**

> 📎 相关：[✅Kafka如何保证消息不丢失？](https://www.yuque.com/hollis666/fsn3og/imx4a7z8zq65erlo)

> 📎 相关：[✅为了避免丢消息问题需要落表，如何设计这张消息表？](https://www.yuque.com/hollis666/fsn3og/iw138sersv6ocx6u)

**状态区分度不高加索引有用吗？event执行会用什么设计模式？**

> 📎 相关：[✅区分度不高的字段建索引一定没用吗？](https://www.yuque.com/hollis666/fsn3og/nr83t255g22gu3v7)

**策略模式好处是啥，公共的逻辑如何处理？模板方法模式。**

**点赞是每一次都会发个事件吗？靠kafka消息合并、**

> 📎 相关：[✅策略模式和if-else相比有什么好处？](https://www.yuque.com/hollis666/fsn3og/elzv4u)

**连麦有什么特别的难点吗？消息的严格有序是如何保障的？发送到同一分区、单线程消费、**

**如果发生了重平衡，有序还能保障吗？重平衡会带来什么问题？****stw****、消息堆积、重复消费、**

**Kafka的渐进式重平衡知道吗？**

> 📎 相关：[✅什么是Kafka的重平衡机制？](https://www.yuque.com/hollis666/fsn3og/rqzepcxvq2a1w2e9)

> 📎 相关：[✅什么是Kafka的渐进式重平衡？](https://www.yuque.com/hollis666/fsn3og/kpvazhtr1ukqoyx7)

**你们的连麦支持同时连麦？如何支持优先连麦？最多同时可以连多少人？**

**如果避免并发操作连多？redis记录连麦人数？为啥用redis可以解决并发问题？单线程**

> 📎 相关：[✅Redis为什么被设计成是单线程的？](https://www.yuque.com/hollis666/fsn3og/og6nf4)

**工作中有封装过一些公共的组件吗？****SimpleDateFormat****做日期转换？**

**SDF的线程安全问题知道吗。如何解决？**

> 📎 相关：[✅SimpleDateFormat是线程安全的吗？使用时应该注意什么？](https://www.yuque.com/hollis666/fsn3og/gyz59h)

**看过哪些源码么？****Spring****、****Spring****的****bean****的初始化过程，实例化和初始化区别，**

**Bean****实例化的入口的方法和类名知道么。**

**有什么情况会导致一个bean无法被初始化么？构造器注入&循环依赖，@Lazy**

> 📎 相关：[✅Spring Bean的生命周期是怎么样的？](https://www.yuque.com/hollis666/fsn3og/gpl60ga0c996vmw3)

> 📎 相关：[✅Spring Bean的初始化过程是怎么样的？](https://www.yuque.com/hollis666/fsn3og/zlvhpz)

**Spring****之前用的哪个版本？****SpringBoot 3.0****知道么？****AOT****编译，定义****starter****，**

**定义一个starter需要做什么？在starter里面如何做个开关控制bean的实例化？**

> 📎 相关：[✅Spring 6.0和SpringBoot 3.0有什么新特性？](https://www.yuque.com/hollis666/fsn3og/gvwpq6q0h4ixd9g1)

> 📎 相关：[✅如何自定义一个starter？](https://www.yuque.com/hollis666/fsn3og/sn0vo662fz3r7aux)

> 📎 相关：[✅如何根据配置动态生成Spring的Bean？](https://www.yuque.com/hollis666/fsn3og/ptv9g0c665boyd5g)

**Spring****的事务机制了解么？编程式****&****声明式，你觉得声明式事务有啥缺点。**

**声明式事务，事务失效了，可能有哪些情况？private调用、this调用为啥不生效？AOP、final、rollbackFor、数据库不支持、多线程会导致事务失效吗？为什么？**

> 📎 相关：[✅Spring中的事务事件如何使用？](https://www.yuque.com/hollis666/fsn3og/wleqh7dyg2c20uqq)

> 📎 相关：[✅Spring事务失效可能是哪些原因？](https://www.yuque.com/hollis666/fsn3og/bz0tulziboigw24b)

**Threadlocal****在哪些框架有应用？****Spring****、****Mybatis****有吗？全链路追踪框架**

**如何在线程池之间传递ThreadLocal？ITL、TTL，TTL的原理知道么？**

> 📎 相关：[✅ThreadLocal的应用场景有哪些？](https://www.yuque.com/hollis666/fsn3og/bpm9cgs19qwlgc1k)

> 📎 相关：[✅有了InheritableThreadLocal为啥还需要TransmittableThreadLocal？](https://www.yuque.com/hollis666/fsn3og/fucuuyqoqv8rdkpr)

**有最近看过哪些框架、技术的新版本么？****JDK ****新版本有啥新特性？虚拟线程。用了虚拟线程后还有必要用线程池吗？守护线程、**

**堆上还有很大内存，但是还是有频繁的fullgc，可能是什么原因？system.gc被调用、CMS搞不定了要用G1？**

> 📎 相关：[✅JDK新版本中都有哪些新特性？](https://www.yuque.com/hollis666/fsn3og/htgm9p3vbpx85p6n)

> 📎 相关：[✅JDK21 中的虚拟线程是怎么回事？](https://www.yuque.com/hollis666/fsn3og/ac1a0q)

> 📎 相关：[✅假设还有很多内存，有什么情况还会频繁fullgc？](https://www.yuque.com/hollis666/fsn3og/su3bwvxsop67g8oq)
