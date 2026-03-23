# 💯💯💯我该看哪些东西？

这份文档内容很多，你到底该看哪些东西呢？
​

我试着根据工作年限，整理了一下我认为不同年限需要掌握的内容。这个年限我是参考一个在中大厂工作对应年限的人应该掌握的内容。

所以大家在看的时候，可以根据自己的实际情况适当的做调整。不过，这个东西没有绝对的，并不是说我没写的，就一定不会被问到，只不过概率没那么高而已。肯定是尽可能看更多东西。

如果你确实是精力都有限，或者有些东西不一定看得懂，那么就尽可能先看自己需要掌握的。
​

对应的年限，会50%是保底的。达到70%-80%，那么大部分面试都可以通过了。能达到100%，那么你已经比很多同龄人要优秀了。
​

这里列了应届，1年，3年，5年，和8年，如果你是4年，那就麻烦结合着3年和5年看吧。

# 应届生（入门）

八股占比（包含场景题、线上问题排查、非技术问题等）：70%以上

**Java基础（全部要看。重点是：多继承、String、泛型、序列化、IO、深拷贝&浅拷贝、异常、BigDecimal、Stream、函数式编程）**
**集合类（全部要看。重点是：Hash数据结构、HashMap扩容、ConcurrentHashMap、HashMap&ConcurrentHashMap1.8、fail-fast、cow）**
**Java并发（线程、线程池、synchronized、volatile、JMM、CAS、AQS、JMM、线程通信、虚拟线程）**
**JVM（编译原理、运行时区域、堆栈、GC算法、垃圾回收器——CMS/G1、类加载机制、双亲委派、双亲委派破坏——Tomcat、JIT）**
**Spring（AOP、IOC、bean生命周期、初始化过程、常用注解、SpringBoot原理、事务、循环依赖、三级缓存）**
SpringCloud（知道是干嘛的：Ribbon、Feign、Eureka、LoadBalancer）
**MySQL（Innodb&MyISAM、索引原理、索引失效、锁原理、事务&隔离级别、日志、回表、死锁、join、乐观锁&悲观锁、意向锁、B+树索引、回表）**
MyBatis（优点、#和$、缓存机制、连接池）
Tomcat（过滤器&拦截器、tomcat&apache）
分布式（概念、分布式锁-setnx\redisson、幂等问题）
**redis（数据结构、持久化、事务机制、内存淘汰、缓存穿透击穿雪崩、分布式锁、redisson-lock\tryLock\jedis）**
dubbo（rpc&http、协议支持）
kafka&rocketmq&rabbitmq（区别、作用、可靠性）
Maven&Git（全部）
IDEA（全部） 
本地缓存（guava）
**设计模式（单例、策略、模板、工厂）**
单元测试（全部）
**计算机网络（OSI、TCP、三次握手、HTTP2、Cookie&Session&Token、HTTPS、DNS、CDN）**
**操作系统（IO模型、进程通信、用户态&内核态、LOAD、CPU利用率、时间片、Linux命令、PageCache、硬连接&软连接、进程调度算法）**
**数据结构（二叉树、堆、B+树、图、bitmap、堆）**
**网络安全（加密算法、SQL注入、水平&垂直越权、DNS污染、DDOS）**
**非技术问题（最近看书、你有什么缺点、你有offe吗、发展规划、对自己评价、单身么）**
**编程题（全部）**
**智商题（全部）**
**线上问题排查（OOM、fullGC）**
**场景题（尽可能多看）**
​

​

# 工作1年（初级）

八股占比（包含场景题、线上问题排查、非技术问题等）：60%以上

**Java基础（全部）**
**集合类（全部）**
**Java并发（线程、线程池、synchronized、volatile、JMM、CAS、AQS、ThreadLocal、锁升级CompletableFuture、无锁化编程、）**
**JVM（编译原理、运行时区域、堆栈、GC、类加载机制、字符串池&intern、垃圾回收器——CMS/G1/ZGC、双亲委派、双亲委派破坏——Tomcat/SpringBoot）**
**Spring（AOP、IOC、bean生命周期、初始化过程、设计模式、常用注解、SpringBoot原理、事务、循环依赖、三级缓存、优雅停机、设计模式、事件、预热、线程安全）**
**SpringCloud（会用：Ribbon、Feign、Eureka、LoadBalancer、SpringCloudGateway）**
**MySQL（Innodb、索引原理、锁原理、事务&隔离级别、日志、回表、索引失效、乐观锁&悲观锁、orderby、buffer pool、死锁、慢SQL排查、join、意向锁、B+树索引、回表）**
MyBatis（工作原理、优点、#和$、插件机制、动态SQL、字段映射、缓存机制、延迟加载、分页、mybatis-plus）
Tomcat（过滤器&拦截器、tomcat&apache、启动流程、处理过程）
**微服务（微服务概念、限流&降级&熔断、概念）**
**分布式（概念、分布式锁-setnx\redisson\zk、CAP、分布式事务概念、分布式Session、分布式ID、幂等问题、一致性hash）**
**redis（线程模型、数据结构、lua、虚拟内存、持久化、事务机制、内存淘汰、缓存穿透击穿雪崩、分布式锁、redisson-watchdog\lock\tryLock\jedis、key过期）**
**dubbo（rpc&http、缓存、协议支持、架构、调用过程）**
**kafka&rocketmq&rabbitmq（区别、作用、可靠性、重平衡、消息堆积、消息丢失、死信队列、重复消费）**
Zookeeper（使用场景、数据结构）
本地缓存（guava、caffeine）
**文件处理（poi、问题）**
Maven&Git（全部）
IDEA（全部）
**设计模式（单例、策略、模板、工厂、责任链、破坏单例）**
非技术问题（全部）
**编程题（全部）**
**智商题（全部）**
单元测试（全部）
**计算机网络（OSI、TCP、三次握手、HTTP2、Cookie&Session&Token、HTTPS、DNS、CDN、跨域、网络分区、长连接&短链接）**
**操作系统（零拷贝、IO模型、进程通信、用户态&内核态、LOAD、CPU利用率、时间片、Linux命令、PageCache、硬连接&软连接、进程调度算法）**
**数据结构（二叉树、堆、B+树、图、bitmap、堆）**
**网络安全（加密算法、SQL注入、水平&垂直越权、DNS污染）**
非技术问题（最近看书、你有什么缺点、你有offer吗、发展规划、加班怎么看、对自己评价、单身么）
**线上问题排查（消息堆积、死锁、OOM、fullGC、慢SQL）**
**场景题（尽可能多看）**
**​**

# 工作3年（中级）

八股占比（包含场景题、线上问题排查、非技术问题等）：45%以上

Java基础（不咋问）
集合类（不咋问）
**Java并发（线程、线程池、synchronized、volatile、JMM、CAS、AQS、ThreadLocal、锁升级、锁降级、CompletableFuture、无锁化编程、偏向锁废弃）**
**JVM（编译原理、运行时区域、堆栈、GC、类加载机制、JVM优化、字符串池&intern、AOT&JIT、safe-point、三色标记法、栈上OOM、垃圾回收器——CMS/G1/ZGC、双亲委派、双亲委派破坏——Tomcat/SpringBoot）**
**Spring（AOP、IOC、bean生命周期、初始化过程、设计模式、常用注解、SpringBoot原理、事务原理、编程式事务、事务失效、循环依赖、三级缓存、优雅停机、设计模式、事件、预热、线程安全、源码、各种奇技淫巧）**
**SpringCloud（了解原理：Ribbon负载均衡机制、Feign的优点、Feign的负载均衡、Feign的超时处理、Eureka缓存机制、LoadBalancer和Ribbon区别、LB的原理、SpringCloudGateway原理）**
**MySQL（Innodb、MySQL8.0、索引原理、锁原理、事务&隔离级别、大厂为什么用RC、幻读的解决、乐观锁&悲观锁、MVCC、日志、回表、索引失效&选错索引、SQL调优、orderby、深分页、buffer pool、死锁、慢SQL排查、join、主从复制、加解密、onlineddl、2阶段提交、索引覆盖、前缀索引）**
**MyBatis（工作原理、优点、#和$、插件机制、动态SQL、字段映射、缓存机制、延迟加载、分页、mybatis-plus）**
Tomcat（全部）
**微服务（限流&降级&熔断、概念、服务治理）**
**分布式（概念、分布式锁-setnx\redisson\redlock\zk、CAP、基于MQ实现分布式事务、分布式Session、分布式ID、幂等问题、一致性hash）**
**redis（集群模式、线程模型、数据结构、lua、原子性问题、虚拟内存、持久化、事务机制、过期策略、内存淘汰、热key、大key、缓存穿透击穿雪崩、一致性-延迟双删、分布式锁、redisson-watchdog\lock\tryLock\jedis、key过期、滑动窗口、pipeline）**
**dubbo（rpc&http、泛化调用、缓存、协议支持、架构、调用过程、优雅上下线）**
**kafka&rocketmq&rabbitmq（区别、作用、可靠性、重平衡、消息堆积、消息丢失、延迟消息、死信队列、重复消费）**
**配置中心（nacos、推拉模式）**
ES（为啥快、倒排索引、一致性）
Zookeeper（使用场景、CAP、角色、数据结构、脑裂、原理、分布式锁）
本地缓存（guava、caffeine、二级缓存）
分库分表（为啥做、字段、全局ID、分表算法）
定时任务（实现、时间轮、扫表方案、xxl-job）
文件处理（poi、问题、easyexcel、大文件读写）
Maven&Git（不咋考）
IDEA（不咋考）
单元测试（不咋考）
计算机网络（不咋考）
操作系统（不咋考）
数据结构（不咋考）
**网络安全（加密算法、SQL注入、水平&垂直越权、国密算法、DNS污染、DDOS）**
**设计模式（单例、策略、模板、工厂、责任链、破坏单例、享元、不可变）**
**线上问题排查（消息堆积、RT飙高、死锁、CPU飙高、OOM、fullGC、load飙高）**
**非技术问题（最近看书、你有什么缺点、你有offe吗、发展规划、加班怎么看、对自己评价、单身么）**
**场景题（尽可能多看）**
​

# 工作5年（高级）

八股占比（包含场景题、线上问题排查、非技术问题等）：30%以上

Java基础（全部，但是不一定问）
集合类（全部，但是不一定问）
Java并发（全部）
JVM（全部）
Spring（源码、各种奇技淫巧）
SpringCloud（原理）
**MySQL（Innodb、MySQL8.0、索引原理、锁原理、事务&隔离级别、大厂为什么用RC、幻读的解决、乐观锁&悲观锁、MVCC、日志、回表、索引失效&选错索引、SQL调优、orderby、深分页、buffer pool、死锁、慢SQL排查、join、热更新、主从复制、加解密、onlineddl、2阶段提交、索引覆盖、前缀索引、热点更新、组提交、inventory_hint、索引合并、索引跳跃扫描、函数索引）**
MyBatis（全部）
Tomcat（全部）
Netty（全部）
**微服务（限流&降级&熔断、概念、服务治理、康威定律、微服务拆分、循环依赖问题、Devops）**
**分布式（概念、分布式锁-setnx\redisson\redlock\zk、CAP、基于MQ实现分布式事务、TCC、2PC、SEATA、分布式Session、分布式ID、幂等问题、一致性hash）**
**redis（集群模式、分片、线程模型、数据结构、lua、原子性问题、虚拟内存、持久化、事务机制、为什么不支持回滚、过期策略、内存淘汰、热key、大key、缓存穿透击穿雪崩、一致性-延迟双删\cache-aside、分布式锁、redisson-watchdog\lock\tryLock\jedis、渐进式hash、key过期、滑动窗口、pipeline、乐观锁、lua在集群下影响）**
**dubbo（全部）**
**kafka&rocketmq&rabbitmq（区别、作用、可靠性、顺序消息、重平衡、消息堆积、消息丢失、事务消息、延迟消息、死信队列、重复消费）**
**配置中心（nacos、推拉模式、CAP、选型）**
**ES（为啥快、倒排索引、一致性、深分页、优化）**
**Zookeeper（使用场景、CAP、角色、数据结构、原理、分布式锁）**
**三高（高性能-设计\常用方案、高并发-限流算法\限流落地经验\预热、高可用-SLA\压测）**
本地缓存（guava、caffeine、二级缓存、一致性）
**分库分表（为啥做、分表算法、字段、全局ID、问题、数据迁移）**
定时任务（全部）
文件处理（全部）
DDD（聚合&聚合根、充血模型、领域事件、架构分层）
Maven&Git（不咋考）
单元测试（不咋考）
计算机网络（不咋考）
操作系统（不咋考）
数据结构（不咋考）
IDEA（不咋考）
**设计模式（单例、策略、模板、工厂、责任链、破坏单例、享元、不可变、生产者消费者、观察者）**
**架构设计（原则、选型、单元化）**
**非技术问题（最近看书、你有什么缺点、你有offe吗、发展规划、加班怎么看、对自己评价、单身么）**
**线上问题排查（全部）**
**场景题（尽可能多看）**
​

​

# 工作8年（架构）

八股占比（包含场景题、线上问题排查、非技术问题等）：30%以上

Java基础（不咋考）
集合类（不咋考）
Java并发（全部，但是不一定问）
JVM（全部，但是不一定问）
Spring（全部，但是不一定问）
**SpringCloud（全部）**
**MySQL（全部）**
MyBatis（全部）
Tomcat（全部）
Netty（全部）
**微服务（限流&降级&熔断、概念、服务治理、康威定律、微服务拆分、循环依赖问题、Devops、服务治理、ServiceMesh）**
**分布式（概念、分布式锁-setnx\redisson\redlock\zk、RedLock被废弃问题、CAP权衡、各种分布式事务方案对比和选择、）**
**redis（集群模式、分片、线程模型、数据结构、lua、原子性问题、虚拟内存、持久化、事务机制、为什么不支持回滚、过期策略、内存淘汰、热key、大key、缓存穿透击穿雪崩、一致性-延迟双删\cache-aside、分布式锁、redisson-watchdog\lock\tryLock\jedis、渐进式hash、key过期、滑动窗口、pipeline、乐观锁、lua在集群下影响、最佳实践、设计原则、挂了怎么办、脑裂问题）**
**kafka&rocketmq&rabbitmq（全部）**
**三高（高性能-设计\常用方案\优化、高并发-限流算法\限流落地经验\预热、高可用-SLA\压测\全链路压测、异地多活、单元化）**
**分库分表（为啥做、分表算法、字段、全局ID、问题、数据迁移、数据倾斜、为啥不建议用）**
定时任务（全部）
**DDD（聚合&聚合根、充血模型、领域事件、架构分层、落地实践、你的看法）**
**设计模式（单例、策略、模板、工厂、责任链、破坏单例、享元、不可变、生产者消费者、观察者、给场景设计）**
Maven&Git（不咋考）
IDEA（不咋考）
单元测试（不咋考）
计算机网络（不咋考）
操作系统（不咋考）
数据结构（不咋考）
架构设计（全部）
**线上问题排查（全部）**
**非技术问题（最近看书、你有什么缺点、你有offe吗、发展规划、加班怎么看、对自己评价、单身么）**
**场景题（尽可能多看）**
​
