export interface KnowledgeNode {
  id: string
  name: string
  type: 'category' | 'article'
  path?: string
  children?: KnowledgeNode[]
  icon?: string
}

export const knowledgeTree: KnowledgeNode[] = [
  {
    id: 'java-basics',
    name: 'Java基础',
    type: 'category',
    icon: '☕',
    children: [
      { id: 'java-oop', name: '面向对象', type: 'article' },
      { id: 'java-exception', name: '异常处理', type: 'article' },
      { id: 'java-io', name: 'IO流', type: 'article' }
    ]
  },
  {
    id: 'java-concurrent',
    name: 'Java并发',
    type: 'category',
    icon: '🔄',
    children: [
      { id: 'concurrent-1', name: '多线程上下文切换是什么？', type: 'article' },
      { id: 'concurrent-2', name: '如何理解线程安全？', type: 'article' },
      { id: 'concurrent-3', name: '并发和并行的区别？', type: 'article' },
      { id: 'concurrent-4', name: '线程有几种状态，状态之间的流转是怎样的？', type: 'article' },
      { id: 'concurrent-5', name: '守护线程和普通线程的区别？', type: 'article' },
      { id: 'concurrent-6', name: 'JDK21中的虚拟线程是什么？', type: 'article' },
      { id: 'concurrent-7', name: 'Java中有哪些方式可以创建线程？', type: 'article' },
      { id: 'concurrent-8', name: 'run和start的区别是什么？', type: 'article' },
      { id: 'concurrent-9', name: 'wait和sleep的区别是什么？', type: 'article' },
      { id: 'concurrent-10', name: 'notify和notifyAll的区别是什么？', type: 'article' },
      { id: 'concurrent-11', name: '线程池的实现原理是什么？', type: 'article' },
      { id: 'concurrent-12', name: '线程池中核心线程数量如何设定？', type: 'article' },
      { id: 'concurrent-13', name: 'ThreadLocal是如何实现的？', type: 'article' },
      { id: 'concurrent-14', name: '有哪些线程同步方式？', type: 'article' },
      { id: 'concurrent-15', name: 'Java中的死锁，怎么避免死锁？', type: 'article' },
      { id: 'concurrent-16', name: 'JMM是什么？', type: 'article' },
      { id: 'concurrent-17', name: '原子性和ACID中的原子性一个意思吗？', type: 'article' },
      { id: 'concurrent-18', name: 'synchronized的底层实现是什么？', type: 'article' },
      { id: 'concurrent-19', name: 'synchronized到底锁的是什么？', type: 'article' },
      { id: 'concurrent-20', name: '如何保证原子性、可见性和有序性？', type: 'article' },
      { id: 'concurrent-21', name: 'synchronized锁升级的过程是什么？', type: 'article' },
      { id: 'concurrent-22', name: '有了synchronized为什么还需要volatile？', type: 'article' },
      { id: 'concurrent-23', name: '怎么理解AQS？', type: 'article' },
      { id: 'concurrent-24', name: 'CAS会有哪些问题？', type: 'article' },
      { id: 'concurrent-25', name: '什么是自旋？', type: 'article' },
      { id: 'concurrent-26', name: '什么是Unsafe？', type: 'article' },
      { id: 'concurrent-27', name: 'CAS如何保证原子性的？', type: 'article' },
      { id: 'concurrent-28', name: 'synchronized和reentrantLock区别？', type: 'article' },
      { id: 'concurrent-29', name: '公平锁和非公平锁有什么区别？', type: 'article' },
      { id: 'concurrent-30', name: 'LongAdder和AtomicLong有什么区别？为什么适用于高并发？', type: 'article' },
      { id: 'concurrent-31', name: 'CountDownLatch、CyclicBarrier、Semaphore的区别？', type: 'article' },
      { id: 'concurrent-32', name: '在Java多线程中，父子线程如何共享数据？', type: 'article' },
      { id: 'concurrent-33', name: 'T1，T2，T3三个线程如何按顺序执行？', type: 'article' },
      { id: 'concurrent-34', name: '如何进行多线程编排？', type: 'article' },
      { id: 'concurrent-35', name: '三个线程按顺序打印0~100怎么实现？', type: 'article' },
      { id: 'concurrent-36', name: '总线嗅探和总线风暴是啥？和JMM有什么关系？', type: 'article' },
      { id: 'concurrent-37', name: 'CompletableFuture底层实现是什么？', type: 'article' },
      { id: 'concurrent-38', name: 'ForkJoinPool和ThreadPoolExecutor区别？', type: 'article' },
      { id: 'concurrent-39', name: 'InheritableThreadLocal和TransmittableThreadLocal区别？', type: 'article' },
      { id: 'concurrent-40', name: 'AQS的等待唤醒机制是什么？', type: 'article' },
      { id: 'concurrent-41', name: '怎么保证多线程下i++可以正确执行？', type: 'article' },
      { id: 'concurrent-42', name: 'Java是如何判断一个线程是否存活的？', type: 'article' },
      { id: 'concurrent-43', name: '什么是可重入锁，怎么实现可重入锁？', type: 'article' },
      { id: 'concurrent-44', name: '如何实现主线程捕获子线程异常？', type: 'article' },
      { id: 'concurrent-45', name: '为什么不能在try-catch中捕获子线程的异常？', type: 'article' },
      { id: 'concurrent-46', name: 'Java线程出现异常，进程为啥不会退出？', type: 'article' },
      { id: 'concurrent-47', name: '什么是happens-before原则？', type: 'article' },
      { id: 'concurrent-48', name: 'happens-before和as-if-serial有啥区别和联系？', type: 'article' },
      { id: 'concurrent-49', name: '如何让Java的线程池顺序执行任务？', type: 'article' },
      { id: 'concurrent-50', name: 'ThreadLocal的应用场景有哪些？', type: 'article' },
      { id: 'concurrent-51', name: 'ThreadLocal为什么会导致内存泄漏？如何解决？', type: 'article' },
      { id: 'concurrent-52', name: '到底啥是内存屏障？到底怎么加的？', type: 'article' },
      { id: 'concurrent-53', name: '有了CAS为啥还需要volatile？', type: 'article' },
      { id: 'concurrent-54', name: 'AQS的同步队列和条件队列原理？', type: 'article' },
      { id: 'concurrent-55', name: '什么是AQS的独占模式和共享模式？', type: 'article' },
      { id: 'concurrent-56', name: 'AQS为什么采用双向链表？', type: 'article' },
      { id: 'concurrent-57', name: '有了MESI为啥还需要JMM？', type: 'article' },
      { id: 'concurrent-58', name: '为什么虚拟线程不能用synchronized？', type: 'article' },
      { id: 'concurrent-59', name: '为什么虚拟线程不要和线程池一起用？', type: 'article' },
      { id: 'concurrent-60', name: '为什么虚拟线程尽量避免使用ThreadLocal？', type: 'article' },
      { id: 'concurrent-61', name: 'sychronized是非公平锁吗，那么是如何体现的？', type: 'article' },
      { id: 'concurrent-62', name: '什么是伪共享，如何解决伪共享？', type: 'article' },
      { id: 'concurrent-63', name: '介绍下JUC，都有哪些工具类？', type: 'article' },
      { id: 'concurrent-64', name: '什么是活锁，和死锁有什么区别？', type: 'article' },
      { id: 'concurrent-65', name: 'Java中有哪些锁？', type: 'article' },
      { id: 'concurrent-66', name: 'JDK25的ScopedValue是什么？为什么可以替代ThreadLocal？', type: 'article' },
      { id: 'concurrent-67', name: '线程池有哪些核心参数？', type: 'article' },
      { id: 'concurrent-68', name: 'new Thread().start() 创建一个线程时，操作系统层面发生了什么？', type: 'article' }
    ]
  },
  {
    id: 'collections',
    name: '集合类',
    type: 'category',
    icon: '📦',
    children: [
      { id: 'collections-1', name: 'Java中的集合类有哪些？如何分类的？', type: 'article' },
      { id: 'collections-2', name: '你能说出几种集合的排序方式？', type: 'article' },
      { id: 'collections-3', name: '什么是 fail-fast？什么是 fail-safe？', type: 'article' },
      { id: 'collections-4', name: '遍历的同时修改一个 List 有几种方式？', type: 'article' },
      { id: 'collections-5', name: 'Set 是如何保证元素不重复的？', type: 'article' },
      { id: 'collections-6', name: 'ArrayList、LinkedList 与 Vector 的区别？', type: 'article' },
      { id: 'collections-7', name: 'ArrayList 的 subList 方法有什么需要注意的地方吗？', type: 'article' },
      { id: 'collections-8', name: 'ArrayList 的序列化是怎么实现的？', type: 'article' },
      { id: 'collections-9', name: 'hash 冲突通常怎么解决？', type: 'article' },
      { id: 'collections-10', name: 'HashMap 的数据结构是怎样的？', type: 'article' },
      { id: 'collections-11', name: 'HashMap、Hashtable 和 ConcurrentHashMap 的区别？', type: 'article' },
      { id: 'collections-12', name: 'HashMap 在 get 和 put 时经过哪些步骤？', type: 'article' },
      { id: 'collections-13', name: '为什么 HashMap 的 Cap 是 2^n，如何保证？', type: 'article' },
      { id: 'collections-14', name: '为什么 HashMap 的默认负载因子设置成 0.75？', type: 'article' },
      { id: 'collections-15', name: 'Stream 的并行流是如何实现的？', type: 'article' },
      { id: 'collections-16', name: 'HashMap 的 remove 方法是如何实现的？', type: 'article' },
      { id: 'collections-17', name: 'ConcurrentHashMap 是如何保证线程安全的？', type: 'article' },
      { id: 'collections-18', name: 'ConcurrentHashMap 在哪些地方做了并发控制？', type: 'article' },
      { id: 'collections-19', name: 'ConcurrentHashMap 是如何保证 fail-safe 的？', type: 'article' },
      { id: 'collections-20', name: '如何将集合变成线程安全的？', type: 'article' },
      { id: 'collections-21', name: 'HashMap 用在并发场景中有什么问题？', type: 'article' },
      { id: 'collections-22', name: '什么是 COW，如何保证线程安全？', type: 'article' },
      { id: 'collections-23', name: 'Java 8 中的 Stream 用过吗？都能干什么？', type: 'article' },
      { id: 'collections-24', name: '为什么 ConcurrentHashMap 不允许 null 值？', type: 'article' },
      { id: 'collections-25', name: 'JDK1.8 中 HashMap 有哪些改变？', type: 'article' },
      { id: 'collections-26', name: 'ConcurrentHashMap 为什么在 JDK 1.8 中废弃分段锁？', type: 'article' },
      { id: 'collections-27', name: 'ConcurrentHashMap 为什么在 JDK1.8 中使用 synchronized 而不是 ReentrantLock？', type: 'article' }
    ]
  },
  {
    id: 'jvm',
    name: 'JVM',
    type: 'category',
    icon: '⚙️',
    children: [
      { id: 'jvm-1', name: 'Java 是如何实现的平台无关？', type: 'article' },
      { id: 'jvm-2', name: 'Java 是编译型还是解释型？', type: 'article' },
      { id: 'jvm-3', name: '什么是编译和反编译？', type: 'article' },
      { id: 'jvm-4', name: '简单介绍一下 JIT 优化技术？', type: 'article' },
      { id: 'jvm-5', name: '对 JDK 进程执行 kill -9 有什么影响？', type: 'article' },
      { id: 'jvm-6', name: 'JVM 的运行时内存区域是怎样的？', type: 'article' },
      { id: 'jvm-7', name: 'Java 中的对象一定在堆上分配内存吗？', type: 'article' },
      { id: 'jvm-8', name: 'Java 的堆是如何分代的？为什么分代？', type: 'article' },
      { id: 'jvm-9', name: '新生代如果只有一个 Eden + 一个 Survivor 可以吗？', type: 'article' },
      { id: 'jvm-10', name: 'YoungGC 和 FullGC 的触发条件是什么？', type: 'article' },
      { id: 'jvm-11', name: '什么是 Stop The World？', type: 'article' },
      { id: 'jvm-12', name: 'JVM 有哪些垃圾回收算法？', type: 'article' },
      { id: 'jvm-13', name: 'JVM 如何判断对象是否存活？', type: 'article' },
      { id: 'jvm-14', name: '什么是三色标记算法？', type: 'article' },
      { id: 'jvm-15', name: '什么是强引用、软引用、弱引用和虚引用？', type: 'article' },
      { id: 'jvm-16', name: 'Java 8 和 Java 11 的 GC 有什么区别？', type: 'article' },
      { id: 'jvm-17', name: '类的生命周期是怎么样的？', type: 'article' },
      { id: 'jvm-18', name: 'Java 中类加载的过程是怎么样的？', type: 'article' },
      { id: 'jvm-19', name: 'Java 中的类什么时候会被加载？', type: 'article' },
      { id: 'jvm-20', name: '什么是双亲委派？如何破坏？', type: 'article' },
      { id: 'jvm-21', name: '如何判断 JVM 中类和其他类是不是同一个类？', type: 'article' },
      { id: 'jvm-22', name: 'JVM 如何保证给对象分配内存过程的线程安全？', type: 'article' },
      { id: 'jvm-23', name: '虚拟机中的堆一定是线程共享的吗？', type: 'article' },
      { id: 'jvm-24', name: '常见的 JVM 调优工具有哪些', type: 'article' },
      { id: 'jvm-25', name: '有哪些常用的 JVM 启动参数？', type: 'article' },
      { id: 'jvm-26', name: '哪些语言有 GC 机制', type: 'article' },
      { id: 'jvm-27', name: '一个对象的结构是什么样的？', type: 'article' },
      { id: 'jvm-28', name: 'JVM 是如何创建对象的？', type: 'article' },
      { id: 'jvm-29', name: '字符串常量池是如何实现的？', type: 'article' },
      { id: 'jvm-30', name: '什么是方法区？是如何实现的？', type: 'article' },
      { id: 'jvm-31', name: 'JVM 中一次完整的 GC 流程是怎样的？', type: 'article' },
      { id: 'jvm-32', name: 'JVM 为什么要把堆和栈区分出来呢？', type: 'article' },
      { id: 'jvm-33', name: '破坏双亲委派之后，能重写 String 类吗？', type: 'article' },
      { id: 'jvm-34', name: 'OutOfMemory 和 StackOverflow 的区别是什么', type: 'article' },
      { id: 'jvm-35', name: '什么是 Class 常量池，和运行时常量池关系是什么？', type: 'article' },
      { id: 'jvm-36', name: 'Java 发生了 OOM 一定会导致 JVM 退出吗？', type: 'article' },
      { id: 'jvm-37', name: '什么是 safe point，有啥用？', type: 'article' },
      { id: 'jvm-38', name: 'JDK1.8 和 1.9 中类加载器有哪些不同', type: 'article' },
      { id: 'jvm-39', name: '什么是逃逸分析？', type: 'article' },
      { id: 'jvm-40', name: '什么是 AOT 编译？和 JIT 有啥区别？', type: 'article' },
      { id: 'jvm-41', name: '一个 Java 进程占用的内存都哪些部分？', type: 'article' },
      { id: 'jvm-42', name: '说一说 JVM 的并发回收和并行回收', type: 'article' },
      { id: 'jvm-43', name: '为什么初始标记和重新标记需要 STW，而并发标记不需要？', type: 'article' },
      { id: 'jvm-44', name: '介绍下 CMS 的垃圾回收过程', type: 'article' },
      { id: 'jvm-45', name: 'Java 一定就是平台无关的吗？', type: 'article' },
      { id: 'jvm-46', name: '什么是 STW？有什么影响？', type: 'article' },
      { id: 'jvm-47', name: '什么情况会导致 JVM 退出？', type: 'article' },
      { id: 'jvm-48', name: '项目中如何选择垃圾回收器？为啥选择这个？', type: 'article' }
    ]
  },
  {
    id: 'spring',
    name: 'Spring',
    type: 'category',
    icon: '🍃',
    children: [
      { id: 'spring-1', name: '介绍一下Spring的IOC', type: 'article' },
      { id: 'spring-2', name: '介绍一下Spring的AOP', type: 'article' },
      { id: 'spring-3', name: '为什么Spring不建议使用基于字段的依赖注入？', type: 'article' },
      { id: 'spring-4', name: 'Spring Bean的生命周期是怎么样的？', type: 'article' },
      { id: 'spring-5', name: 'Spring Bean的初始化过程是怎么样的？', type: 'article' },
      { id: 'spring-6', name: '@PostConstruct、init-method和afterPropertiesSet执行顺序', type: 'article' },
      { id: 'spring-7', name: 'Spring 6.0和SpringBoot 3.0有什么新特性？', type: 'article' },
      { id: 'spring-8', name: 'Spring的事务传播机制有哪些？', type: 'article' },
      { id: 'spring-9', name: 'Autowired和Resource的关系？', type: 'article' },
      { id: 'spring-10', name: 'BeanFactory和FactroyBean的关系？', type: 'article' },
      { id: 'spring-11', name: 'Spring在业务中常见的使用方式', type: 'article' },
      { id: 'spring-12', name: 'Spring中如何开启事务？', type: 'article' },
      { id: 'spring-13', name: 'Spring中用到了哪些设计模式', type: 'article' },
      { id: 'spring-14', name: '什么是Spring的循环依赖问题？', type: 'article' },
      { id: 'spring-15', name: 'Spring事务失效可能是哪些原因？', type: 'article' },
      { id: 'spring-16', name: '什么是MVC', type: 'article' },
      { id: 'spring-17', name: 'SpringMVC是如何将不同的Request路由到不同Controller中的？', type: 'article' },
      { id: 'spring-18', name: 'Spring Boot 如何让你的 bean 在其他 bean 之前加载', type: 'article' },
      { id: 'spring-19', name: '如何统计一个Bean中的方法调用次数', type: 'article' },
      { id: 'spring-20', name: 'Springboot是如何实现自动配置的？', type: 'article' },
      { id: 'spring-21', name: 'SpringBoot是如何实现main方法启动Web项目的？', type: 'article' },
      { id: 'spring-22', name: 'SpringBoot的启动流程是怎么样的？', type: 'article' },
      { id: 'spring-23', name: 'Spring中shutdownhook作用是什么？', type: 'article' },
      { id: 'spring-24', name: 'Spring的AOP在什么场景下会失效？', type: 'article' },
      { id: 'spring-25', name: 'SpringBoot和Spring的区别是什么？', type: 'article' },
      { id: 'spring-26', name: '在Spring中如何使用Spring Event做事件驱动', type: 'article' },
      { id: 'spring-27', name: 'Spring中的事务事件如何使用？', type: 'article' },
      { id: 'spring-28', name: '为什么不建议直接使用Spring的@Async', type: 'article' },
      { id: 'spring-29', name: '什么是Spring的三级缓存', type: 'article' },
      { id: 'spring-30', name: '三级缓存是如何解决循环依赖的问题的？', type: 'article' },
      { id: 'spring-31', name: 'Spring解决循环依赖一定需要三级缓存吗？', type: 'article' },
      { id: 'spring-32', name: 'SpringBoot如何做优雅停机？', type: 'article' },
      { id: 'spring-33', name: 'Spring中@Service 、@Component、@Repository等注解区别是什么？', type: 'article' },
      { id: 'spring-34', name: '如何在Spring启动过程中做缓存预热', type: 'article' },
      { id: 'spring-35', name: '@Lazy注解能解决循环依赖吗？', type: 'article' },
      { id: 'spring-36', name: 'Spring 中的 Bean 是线程安全的吗？', type: 'article' },
      { id: 'spring-37', name: 'Spring 中的 Bean 作用域有哪些？', type: 'article' },
      { id: 'spring-38', name: 'Spring中如何实现多环境配置？', type: 'article' },
      { id: 'spring-39', name: '如何自定义一个starter？', type: 'article' },
      { id: 'spring-40', name: '为什么SpringBoot 3中移除了spring.factories', type: 'article' },
      { id: 'spring-41', name: 'Spring的事务在多线程下生效吗？为什么？', type: 'article' },
      { id: 'spring-42', name: '如何根据配置动态生成Spring的Bean？', type: 'article' },
      { id: 'spring-43', name: 'Spring的@Autowired能用在Map上吗？', type: 'article' },
      { id: 'spring-44', name: '知道Spring Task吗，和XXL-JOB有啥区别？', type: 'article' },
      { id: 'spring-45', name: 'SpringBoot和传统的双亲委派有什么不一样吗？', type: 'article' },
      { id: 'spring-46', name: '有什么情况会导致一个bean无法被初始化么？', type: 'article' },
      { id: 'spring-47', name: 'SpringMVC中如何实现流式输出', type: 'article' },
      { id: 'spring-48', name: 'Spring中@Transactional事务的实现原理', type: 'article' },
      { id: 'spring-49', name: 'Spring 7 和Spring Boot 4 都有哪些新特性？', type: 'article' },
      { id: 'spring-50', name: '介绍下@Retryable的实现原理', type: 'article' }
    ]
  },
  {
    id: 'springcloud',
    name: 'SpringCloud',
    type: 'category',
    icon: '☁️',
    children: [
      { id: 'sc-1', name: '什么是SpringCloud，有哪些组件？', type: 'article' },
      { id: 'sc-2', name: 'SpringCloud和Dubbo有什么区别？', type: 'article' },
      { id: 'sc-3', name: 'SpringCloud 在Spring6.0后有哪些变化', type: 'article' },
      { id: 'sc-4', name: '什么是Zuul网关，有什么用？', type: 'article' },
      { id: 'sc-5', name: 'Ribbon和Nginx的区别是什么？', type: 'article' },
      { id: 'sc-6', name: 'Zuul、Gateway和Nginx有什么区别？', type: 'article' },
      { id: 'sc-7', name: 'Ribbon是怎么做负载均衡的？', type: 'article' },
      { id: 'sc-8', name: 'Hystrix和Sentinel的区别是什么？', type: 'article' },
      { id: 'sc-9', name: '介绍一下Eureka的缓存机制', type: 'article' },
      { id: 'sc-10', name: '什么是Eureka的自我保护模式？', type: 'article' },
      { id: 'sc-11', name: 'Feign 第一次调用为什么很慢？可能的原因是什么？', type: 'article' },
      { id: 'sc-12', name: 'Hystrix熔断器的工作原理是什么？', type: 'article' },
      { id: 'sc-13', name: '介绍一下 Hystrix 的隔离策略，你用哪个？', type: 'article' },
      { id: 'sc-14', name: 'Eureka 在 Spring Boot 3.x 之后被移除了，如何替代？', type: 'article' },
      { id: 'sc-15', name: 'LoadBalancer支持哪些负载均衡策略？如何修改？', type: 'article' },
      { id: 'sc-16', name: 'Feign 和 RestTemplate 有什么不同？', type: 'article' },
      { id: 'sc-17', name: 'Feign和OpenFeign 有什么区别？', type: 'article' },
      { id: 'sc-18', name: 'OpenFeign 是如何实现负载均衡的？', type: 'article' },
      { id: 'sc-19', name: 'OpenFeign如何处理超时？如何处理异常？如何记录客户端日志？', type: 'article' },
      { id: 'sc-20', name: 'Feign调用超时，会自动重试吗？如何设置？', type: 'article' },
      { id: 'sc-21', name: 'application.yml 和 bootstrap.yml 这两个配置文件有什么区别？', type: 'article' }
    ]
  },
  {
    id: 'mysql',
    name: 'MySQL',
    type: 'category',
    icon: '🐬',
    children: [
      { id: 'mysql-1', name: '有了关系型数据库，为什么还需要NOSQL？', type: 'article' },
      { id: 'mysql-2', name: 'MySQL的数据存储一定是基于硬盘的吗？', type: 'article' },
      { id: 'mysql-3', name: 'InnoDB和MyISAM有什么区别？', type: 'article' },
      { id: 'mysql-4', name: 'char和varchar的区别？', type: 'article' },
      { id: 'mysql-5', name: 'MySQL 5.x和8.0有什么区别？', type: 'article' },
      { id: 'mysql-6', name: '什么是数据库范式，为什么要反范式？', type: 'article' },
      { id: 'mysql-7', name: '为什么大厂不建议使用多表join？', type: 'article' },
      { id: 'mysql-8', name: '说一说MySQL一条SQL语句的执行过程？', type: 'article' },
      { id: 'mysql-9', name: 'InnoDB支持哪几种行格式？', type: 'article' },
      { id: 'mysql-10', name: '什么是数据库事务机制？', type: 'article' },
      { id: 'mysql-11', name: 'InnoDB的一次更新事务过程是怎么样的？', type: 'article' },
      { id: 'mysql-12', name: '什么是脏读、幻读、不可重复读？', type: 'article' },
      { id: 'mysql-13', name: 'MySQL中的事务隔离级别？', type: 'article' },
      { id: 'mysql-14', name: '当前读和快照读有什么区别？', type: 'article' },
      { id: 'mysql-15', name: '介绍下InnoDB的锁机制？', type: 'article' },
      { id: 'mysql-16', name: 'MySQL的行级锁锁的到底是什么？', type: 'article' },
      { id: 'mysql-17', name: '什么是排他锁和共享锁？', type: 'article' },
      { id: 'mysql-18', name: '什么是意向锁？', type: 'article' },
      { id: 'mysql-19', name: '乐观锁与悲观锁如何实现？', type: 'article' },
      { id: 'mysql-20', name: 'Innodb加索引，这个时候会锁表吗？', type: 'article' },
      { id: 'mysql-21', name: 'InnoDB中的索引类型？', type: 'article' },
      { id: 'mysql-22', name: 'InnoDB为什么使用B+树实现索引？', type: 'article' },
      { id: 'mysql-23', name: 'MySQL是如何保证唯一性索引的唯一性的？', type: 'article' },
      { id: 'mysql-24', name: '什么是聚簇索引和非聚簇索引？', type: 'article' },
      { id: 'mysql-25', name: '什么是回表，怎么减少回表的次数？', type: 'article' },
      { id: 'mysql-26', name: '什么是索引覆盖、索引下推？', type: 'article' },
      { id: 'mysql-27', name: '设计索引的时候有哪些原则（考虑哪些因素）？', type: 'article' },
      { id: 'mysql-28', name: '什么是最左前缀匹配？为什么要遵守？', type: 'article' },
      { id: 'mysql-29', name: 'MySQL索引一定遵循最左前缀匹配吗？', type: 'article' },
      { id: 'mysql-30', name: 'MySQL的主键一定是自增的吗？', type: 'article' },
      { id: 'mysql-31', name: 'uuid和自增id做主键哪个好，为什么？', type: 'article' },
      { id: 'mysql-32', name: 'order by 是怎么实现的？', type: 'article' },
      { id: 'mysql-33', name: 'count(1)、count(*) 与 count(列名) 的区别', type: 'article' },
      { id: 'mysql-34', name: '是否支持emoji表情存储，如果不支持，如何操作？', type: 'article' },
      { id: 'mysql-35', name: '如何优化一个大规模的数据库系统？', type: 'article' },
      { id: 'mysql-36', name: 'MySQL只操作同一条记录，也会发生死锁吗？', type: 'article' },
      { id: 'mysql-37', name: '数据库死锁如何解决？', type: 'article' },
      { id: 'mysql-38', name: '索引失效的问题如何排查？', type: 'article' },
      { id: 'mysql-39', name: '如何进行SQL调优？', type: 'article' },
      { id: 'mysql-40', name: '区分度不高的字段建索引一定没用吗？', type: 'article' },
      { id: 'mysql-41', name: '慢SQL的问题如何排查？', type: 'article' },
      { id: 'mysql-42', name: 'MySQL主从复制的过程', type: 'article' },
      { id: 'mysql-43', name: '介绍一下InnoDB的数据页，和B+树的关系是什么？', type: 'article' },
      { id: 'mysql-44', name: 'MySQL的驱动表是什么？MySQL怎么选的？', type: 'article' },
      { id: 'mysql-45', name: 'MySQL的Hash Join是什么？', type: 'article' },
      { id: 'mysql-46', name: 'MySQL执行大事务会存在什么问题？', type: 'article' },
      { id: 'mysql-47', name: 'MySQL怎么做热点数据高效更新？', type: 'article' },
      { id: 'mysql-48', name: 'SQL中PK、UK、CK、FK、DF是什么意思？', type: 'article' },
      { id: 'mysql-49', name: '什么是buffer pool？', type: 'article' },
      { id: 'mysql-50', name: 'buffer pool的读写过程是怎么样的？', type: 'article' },
      { id: 'mysql-51', name: '什么是InnoDB的页分裂和页合并', type: 'article' },
      { id: 'mysql-52', name: 'MySQL自增主键用完了会怎么样？', type: 'article' },
      { id: 'mysql-53', name: '执行计划中，key有值，还是很慢怎么办？', type: 'article' },
      { id: 'mysql-54', name: '数据库乐观锁的过程中，完全没有加任何锁吗？', type: 'article' },
      { id: 'mysql-55', name: '什么是事务的2阶段提交？', type: 'article' },
      { id: 'mysql-56', name: '介绍下MySQL 5.7中的组提交', type: 'article' },
      { id: 'mysql-57', name: '为什么MySQL 8.0要取消查询缓存？', type: 'article' },
      { id: 'mysql-58', name: 'MyISAM 的索引结构是怎么样的，它存在的问题是什么？', type: 'article' },
      { id: 'mysql-59', name: 'MySQL中like的模糊查询如何优化', type: 'article' },
      { id: 'mysql-60', name: '为什么不建议使用存储过程？', type: 'article' },
      { id: 'mysql-61', name: '数据库怎么做加密和解密？', type: 'article' },
      { id: 'mysql-62', name: '数据库加密后怎么做模糊查询？', type: 'article' },
      { id: 'mysql-63', name: 'where条件的顺序影响使用索引吗？', type: 'article' },
      { id: 'mysql-64', name: '什么是MySQL的字典锁？', type: 'article' },
      { id: 'mysql-65', name: '什么是OnlineDDL', type: 'article' },
      { id: 'mysql-66', name: '为什么不推荐使用外键？', type: 'article' },
      { id: 'mysql-67', name: '为什么MySQL会选错索引，如何解决？', type: 'article' },
      { id: 'mysql-68', name: '唯一索引和主键索引的区别？', type: 'article' },
      { id: 'mysql-69', name: '联合索引是越多越好吗？', type: 'article' },
      { id: 'mysql-70', name: '阿里的数据库能抗秒杀的原理', type: 'article' },
      { id: 'mysql-71', name: '一个查询语句的执行顺序是怎么样的？', type: 'article' },
      { id: 'mysql-72', name: 'on和where有什么区别？', type: 'article' },
      { id: 'mysql-73', name: 'InnoDB中的表级锁、页级锁、行级锁？', type: 'article' },
      { id: 'mysql-74', name: 'truncate、delete、drop的区别？', type: 'article' },
      { id: 'mysql-75', name: '什么是索引合并，原理是什么？', type: 'article' },
      { id: 'mysql-76', name: 'a,b两个单独索引，where a=xx and b=xx 走哪个索引？为什么？', type: 'article' },
      { id: 'mysql-77', name: 'MySQL为什么会有存储（内存）碎片？有什么危害？', type: 'article' },
      { id: 'mysql-78', name: 'MySQL 中如何查看一个 SQL 的执行耗时', type: 'article' },
      { id: 'mysql-79', name: '怎么比较两个索引的好坏？', type: 'article' },
      { id: 'mysql-80', name: 'MySQL 获取主键 id 的瓶颈在哪里？如何优化？', type: 'article' },
      { id: 'mysql-81', name: 'MySQL 为什么是小表驱动大表，为什么能提高查询性能？', type: 'article' },
      { id: 'mysql-82', name: '什么是数据库的锁升级，Innodb 支持吗？', type: 'article' },
      { id: 'mysql-83', name: '数据库扫表任务如何避免出现死循环', type: 'article' },
      { id: 'mysql-84', name: 'A,B,C的联合索引，按照 AB,AC,BC查询，能走索引吗？', type: 'article' },
      { id: 'mysql-85', name: '什么是索引跳跃扫描', type: 'article' },
      { id: 'mysql-86', name: 'MySQL是AP的还是CP的系统？', type: 'article' },
      { id: 'mysql-87', name: 'MySQL的优化器的索引成本是怎么算出来的？', type: 'article' },
      { id: 'mysql-88', name: '什么是ReadView，什么样的ReadView可见？', type: 'article' },
      { id: 'mysql-89', name: 'undolog会一直存在吗？什么时候删除？', type: 'article' },
      { id: 'mysql-90', name: '二级索引在索引覆盖时如何使用MVCC？', type: 'article' },
      { id: 'mysql-91', name: 'MySQL的BLOB和TEXT有什么区别?', type: 'article' },
      { id: 'mysql-92', name: '什么是MySQL的内存碎片？如何清理？', type: 'article' },
      { id: 'mysql-93', name: 'MySQL做索引更新的时候，会锁表吗？', type: 'article' },
      { id: 'mysql-94', name: 'MySQL如何实现行转列和列转行？', type: 'article' },
      { id: 'mysql-95', name: '一次insert操作，MySQL的几种log的写入顺序？', type: 'article' },
      { id: 'mysql-96', name: '为什么要尽量避免使用select * ？', type: 'article' },
      { id: 'mysql-97', name: 'MySQL建了abc的联合索引，底层会建a,ab, abc这3个索引么？', type: 'article' },
      { id: 'mysql-98', name: 'MySQL如何实现不同隔离级别？', type: 'article' },
      { id: 'mysql-99', name: '如果SQL中一定要有join，该如何优化？', type: 'article' },
      { id: 'mysql-100', name: '表中只有a,b,c 三个字段，比较select * 与 select a,b,c有什么区别。', type: 'article' },
      { id: 'mysql-101', name: 'MySQL能保证数据100%不丢吗？', type: 'article' },
      { id: 'mysql-102', name: 'exists和in有什么区别？如何选择？', type: 'article' },
      { id: 'mysql-103', name: 'varchar(100)和varchar(10)有什么区别？', type: 'article' },
      { id: 'mysql-104', name: '执行计划中的filtered的值有啥用？', type: 'article' }
    ]
  },
  {
    id: 'redis',
    name: 'Redis',
    type: 'category',
    icon: '🔴',
    children: [
      { id: 'redis-data-types', name: '数据类型', type: 'article' },
      { id: 'redis-cache', name: '缓存策略', type: 'article' },
      { id: 'redis-cluster', name: '集群方案', type: 'article' }
    ]
  },
  {
    id: 'mybatis',
    name: 'MyBatis',
    type: 'category',
    icon: '🗄️',
    children: [
      { id: 'mybatis-cache', name: '缓存机制', type: 'article' },
      { id: 'mybatis-dynamic-sql', name: '动态SQL', type: 'article' }
    ]
  },
  {
    id: 'netty',
    name: 'Netty',
    type: 'category',
    icon: '🌐',
    children: [
      { id: 'netty-nio', name: 'NIO模型', type: 'article' },
      { id: 'netty-eventloop', name: 'EventLoop机制', type: 'article' }
    ]
  },
  {
    id: 'microservices',
    name: '微服务',
    type: 'category',
    icon: '🔧',
    children: [
      { id: 'ms-architecture', name: '微服务架构', type: 'article' },
      { id: 'ms-governance', name: '服务治理', type: 'article' }
    ]
  },
  {
    id: 'distributed',
    name: '分布式',
    type: 'category',
    icon: '🌍',
    children: [
      { id: 'dist-1', name: '什么是分布式系统？和集群的区别？', type: 'article' },
      { id: 'dist-2', name: '什么是分布式系统的一致性？', type: 'article' },
      { id: 'dist-3', name: '什么是CAP理论，为什么不能同时满足？', type: 'article' },
      { id: 'dist-4', name: '什么是分布式BASE理论？', type: 'article' },
      { id: 'dist-5', name: '什么是拜占庭将军问题', type: 'article' },
      { id: 'dist-6', name: '什么是分布式事务中的两阶段提交（2PC）', type: 'article' },
      { id: 'dist-7', name: '分布式锁有几种实现方式？', type: 'article' },
      { id: 'dist-8', name: '什么是分布式事务？', type: 'article' },
      { id: 'dist-9', name: '常见的分布式事务有哪些？', type: 'article' },
      { id: 'dist-10', name: '什么是TCC，和2PC有什么区别？', type: 'article' },
      { id: 'dist-11', name: '什么是柔性事务？', type: 'article' },
      { id: 'dist-12', name: '如何基于MQ实现分布式事务', type: 'article' },
      { id: 'dist-13', name: '如何基于本地消息表实现分布式事务？', type: 'article' },
      { id: 'dist-14', name: '什么是最大努力通知？', type: 'article' },
      { id: 'dist-15', name: '最大努力通知&事务消息&本地消息表三者区别是什么？', type: 'article' },
      { id: 'dist-16', name: '分布式ID生成方案都有哪些？', type: 'article' },
      { id: 'dist-17', name: '怎么实现分布式Session？', type: 'article' },
      { id: 'dist-18', name: '什么是雪花算法，怎么保证不重复的？', type: 'article' },
      { id: 'dist-19', name: '分布式命名方案都有哪些？', type: 'article' },
      { id: 'dist-20', name: '什么是负载均衡，有哪些常见算法？', type: 'article' },
      { id: 'dist-21', name: '如何解决接口幂等的问题？', type: 'article' },
      { id: 'dist-22', name: 'Leaf生成分布式ID的原理？', type: 'article' },
      { id: 'dist-23', name: 'Seata的实现原理是什么', type: 'article' },
      { id: 'dist-24', name: '什么是一致性哈希？', type: 'article' },
      { id: 'dist-25', name: 'TCC的空回滚和悬挂是什么？如何解决？', type: 'article' },
      { id: 'dist-26', name: '如何实现应用中的链路追踪？', type: 'article' },
      { id: 'dist-27', name: '实现一个分布式锁需要考虑哪些问题？', type: 'article' },
      { id: 'dist-28', name: '定时任务扫表的缺点有什么？', type: 'article' },
      { id: 'dist-29', name: '什么是Canal，他的工作原理是什么？', type: 'article' },
      { id: 'dist-30', name: '什么是分布式数据库，有什么优势？', type: 'article' },
      { id: 'dist-31', name: '锁和分布式锁的核心区别是什么？', type: 'article' },
      { id: 'dist-32', name: 'TCC中，Confirm或者Cancel失败了怎么办？', type: 'article' },
      { id: 'dist-33', name: 'TCC是强一致性还是最终一致性？', type: 'article' },
      { id: 'dist-34', name: '为什么不建议用数据库唯一性约束做幂等控制？', type: 'article' },
      { id: 'dist-35', name: 'Seata的4种事务模式，各自适合的场景是什么？', type: 'article' },
      { id: 'dist-36', name: 'Seata的AT模式的实现原理', type: 'article' },
      { id: 'dist-37', name: 'Seata的AT模式和XA有什么区别？', type: 'article' },
      { id: 'dist-38', name: 'Redis 的分布式锁和 Zookeeper 的分布式锁有啥区别？', type: 'article' },
      { id: 'dist-39', name: 'Redis 分布式锁和zk分布式锁哪个对死锁友好?', type: 'article' },
      { id: 'dist-40', name: '什么是OAuth2？有什么用？', type: 'article' },
      { id: 'dist-41', name: '什么是事务消息，为什么需要事务消息？', type: 'article' },
      { id: 'dist-42', name: '详细介绍下号段模式生成分布式ID的原理和优缺点？', type: 'article' },
      { id: 'dist-43', name: 'Seata的AT模式会不会出现脏读？为什么？', type: 'article' },
      { id: 'dist-44', name: '什么是雪花算法的时钟回拨问题，如何解决？', type: 'article' },
      { id: 'dist-45', name: '什么是分布式事务中的三阶段提交（3PC）', type: 'article' }
    ]
  },
  {
    id: 'dubbo',
    name: 'Dubbo',
    type: 'category',
    icon: '🔌',
    children: [
      { id: 'dubbo-spi', name: 'SPI机制', type: 'article' },
      { id: 'dubbo-loadbalance', name: '负载均衡', type: 'article' }
    ]
  },
  {
    id: 'kafka',
    name: 'Kafka',
    type: 'category',
    icon: '📨',
    children: [
      { id: 'kafka-architecture', name: 'Kafka架构', type: 'article' },
      { id: 'kafka-performance', name: '高性能原理', type: 'article' }
    ]
  },
  {
    id: 'rocketmq',
    name: 'RocketMQ',
    type: 'category',
    icon: '🚀',
    children: [
      { id: 'rocketmq-transaction', name: '事务消息', type: 'article' },
      { id: 'rocketmq-reliability', name: '消息可靠性', type: 'article' }
    ]
  },
  {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    type: 'category',
    icon: '🐰',
    children: [
      { id: 'rabbitmq-exchange', name: '交换机类型', type: 'article' },
      { id: 'rabbitmq-reliability', name: '消息可靠性', type: 'article' }
    ]
  },
  {
    id: 'elasticsearch',
    name: 'ElasticSearch',
    type: 'category',
    icon: '🔍',
    children: [
      { id: 'es-index', name: '索引原理', type: 'article' },
      { id: 'es-search', name: '搜索原理', type: 'article' }
    ]
  },
  {
    id: 'zookeeper',
    name: 'Zookeeper',
    type: 'category',
    icon: '🦁',
    children: [
      { id: 'zk-zab', name: 'ZAB协议', type: 'article' },
      { id: 'zk-watcher', name: 'Watcher机制', type: 'article' }
    ]
  },
  {
    id: 'high-performance',
    name: '高性能',
    type: 'category',
    icon: '⚡',
    children: [
      { id: 'hp-cache', name: '缓存设计', type: 'article' },
      { id: 'hp-async', name: '异步处理', type: 'article' }
    ]
  },
  {
    id: 'high-availability',
    name: '高可用',
    type: 'category',
    icon: '🛡️',
    children: [
      { id: 'ha-degradation', name: '服务降级', type: 'article' },
      { id: 'ha-circuit-breaker', name: '熔断机制', type: 'article' }
    ]
  },
  {
    id: 'high-concurrency',
    name: '高并发',
    type: 'category',
    icon: '💥',
    children: [
      { id: 'hc-thread-pool', name: '线程池设计', type: 'article' },
      { id: 'hc-seckill', name: '秒杀系统', type: 'article' }
    ]
  },
  {
    id: 'sharding',
    name: '分库分表',
    type: 'category',
    icon: '🗂️',
    children: [
      { id: 'sharding-strategy', name: '分片策略', type: 'article' },
      { id: 'sharding-migration', name: '数据迁移', type: 'article' }
    ]
  },
  {
    id: 'scheduled-task',
    name: '定时任务',
    type: 'category',
    icon: '⏰',
    children: [
      { id: 'task-quartz', name: 'Quartz', type: 'article' },
      { id: 'task-xxl-job', name: 'XXL-Job', type: 'article' }
    ]
  },
  {
    id: 'ddd',
    name: 'DDD',
    type: 'category',
    icon: '🏗️',
    children: [
      { id: 'ddd-concept', name: 'DDD概念', type: 'article' },
      { id: 'ddd-aggregate', name: '聚合根', type: 'article' }
    ]
  },
  {
    id: 'maven-git',
    name: 'Maven & Git',
    type: 'category',
    icon: '🔨',
    children: [
      { id: 'maven-lifecycle', name: 'Maven生命周期', type: 'article' },
      { id: 'git-workflow', name: 'Git工作流', type: 'article' }
    ]
  },
  {
    id: 'local-cache',
    name: '本地缓存',
    type: 'category',
    icon: '💾',
    children: [
      { id: 'cache-caffeine', name: 'Caffeine', type: 'article' },
      { id: 'cache-guava', name: 'Guava Cache', type: 'article' }
    ]
  },
  {
    id: 'file-processing',
    name: '文件处理',
    type: 'category',
    icon: '📄',
    children: [
      { id: 'file-upload', name: '文件上传', type: 'article' },
      { id: 'file-excel', name: 'Excel处理', type: 'article' }
    ]
  },
  {
    id: 'idea',
    name: 'IDEA',
    type: 'category',
    icon: '💡',
    children: [
      { id: 'idea-shortcuts', name: '快捷键', type: 'article' },
      { id: 'idea-plugins', name: '插件推荐', type: 'article' }
    ]
  },
  {
    id: 'logging',
    name: '日志',
    type: 'category',
    icon: '📝',
    children: [
      { id: 'log-slf4j', name: 'SLF4J', type: 'article' },
      { id: 'log-logback', name: 'Logback', type: 'article' }
    ]
  },
  {
    id: 'design-patterns',
    name: '设计模式',
    type: 'category',
    icon: '🎨',
    children: [
      { id: 'pattern-singleton', name: '单例模式', type: 'article' },
      { id: 'pattern-factory', name: '工厂模式', type: 'article' },
      { id: 'pattern-strategy', name: '策略模式', type: 'article' }
    ]
  },
  {
    id: 'unit-test',
    name: '单元测试',
    type: 'category',
    icon: '🧪',
    children: [
      { id: 'test-junit', name: 'JUnit', type: 'article' },
      { id: 'test-mockito', name: 'Mockito', type: 'article' }
    ]
  },
  {
    id: 'cloud-computing',
    name: '云计算',
    type: 'category',
    icon: '☁️',
    children: [
      { id: 'cloud-docker', name: 'Docker', type: 'article' },
      { id: 'cloud-k8s', name: 'Kubernetes', type: 'article' }
    ]
  },
  {
    id: 'computer-network',
    name: '计算机网络',
    type: 'category',
    icon: '🌐',
    children: [
      { id: 'network-tcp', name: 'TCP协议', type: 'article' },
      { id: 'network-http', name: 'HTTP协议', type: 'article' },
      { id: 'network-https', name: 'HTTPS原理', type: 'article' }
    ]
  },
  {
    id: 'network-security',
    name: '网络安全',
    type: 'category',
    icon: '🔒',
    children: [
      { id: 'security-xss', name: 'XSS攻击', type: 'article' },
      { id: 'security-csrf', name: 'CSRF攻击', type: 'article' },
      { id: 'security-jwt', name: 'JWT认证', type: 'article' }
    ]
  },
  {
    id: 'operating-system',
    name: '操作系统',
    type: 'category',
    icon: '🖥️',
    children: [
      { id: 'os-process', name: '进程与线程', type: 'article' },
      { id: 'os-memory', name: '内存管理', type: 'article' },
      { id: 'os-linux', name: 'Linux命令', type: 'article' }
    ]
  },
  {
    id: 'data-structure',
    name: '数据结构',
    type: 'category',
    icon: '📊',
    children: [
      { id: 'ds-array', name: '数组', type: 'article' },
      { id: 'ds-linkedlist', name: '链表', type: 'article' },
      { id: 'ds-tree', name: '树', type: 'article' },
      { id: 'ds-sort', name: '排序算法', type: 'article' }
    ]
  },
  {
    id: 'container',
    name: '容器',
    type: 'category',
    icon: '🐳',
    children: [
      { id: 'container-docker', name: 'Docker基础', type: 'article' },
      { id: 'container-k8s', name: 'Kubernetes', type: 'article' }
    ]
  },
  {
    id: 'architecture-design',
    name: '架构设计',
    type: 'category',
    icon: '🏛️',
    children: [
      { id: 'arch-principles', name: '架构原则', type: 'article' },
      { id: 'arch-patterns', name: '架构模式', type: 'article' },
      { id: 'arch-microservice', name: '微服务架构', type: 'article' }
    ]
  },
  {
    id: 'coding-problems',
    name: '编程题',
    type: 'category',
    icon: '💻',
    children: [
      { id: 'code-array', name: '数组问题', type: 'article' },
      { id: 'code-string', name: '字符串问题', type: 'article' },
      { id: 'code-dp', name: '动态规划', type: 'article' },
      { id: 'code-hot100', name: 'LeetCode Hot 100', type: 'article' }
    ]
  },
  {
    id: 'iq-problems',
    name: '智商题',
    type: 'category',
    icon: '🧠',
    children: [
      { id: 'iq-logic', name: '逻辑推理', type: 'article' },
      { id: 'iq-math', name: '数学问题', type: 'article' }
    ]
  },
  {
    id: 'non-technical',
    name: '非技术问题',
    type: 'category',
    icon: '💬',
    children: [
      { id: 'nt-self-intro', name: '自我介绍', type: 'article' },
      { id: 'nt-project', name: '项目介绍', type: 'article' },
      { id: 'nt-career', name: '职业规划', type: 'article' }
    ]
  },
  {
    id: 'others',
    name: '其他',
    type: 'category',
    icon: '📚',
    children: [
      { id: 'other-resume', name: '简历优化', type: 'article' },
      { id: 'other-interview-tips', name: '面试技巧', type: 'article' }
    ]
  },
  {
    id: 'interview-experience',
    name: '面经实战',
    type: 'category',
    icon: '📝',
    children: [
      { id: 'exp-alibaba', name: '阿里巴巴', type: 'article' },
      { id: 'exp-tencent', name: '腾讯', type: 'article' },
      { id: 'exp-bytedance', name: '字节跳动', type: 'article' },
      { id: 'exp-meituan', name: '美团', type: 'article' }
    ]
  },
  {
    id: 'big-company-practice',
    name: '大厂实践',
    type: 'category',
    icon: '🏢',
    children: [
      { id: 'practice-architecture', name: '大厂架构', type: 'article' },
      { id: 'practice-performance', name: '性能优化', type: 'article' }
    ]
  },
  {
    id: 'ai-llm',
    name: 'AI & 大模型',
    type: 'category',
    icon: '🤖',
    children: [
      { id: 'ai-basics', name: 'AI基础', type: 'article' },
      { id: 'ai-llm-intro', name: '大模型介绍', type: 'article' },
      { id: 'ai-prompt', name: 'Prompt工程', type: 'article' },
      { id: 'ai-rag', name: 'RAG技术', type: 'article' },
      { id: 'ai-agent', name: 'AI Agent', type: 'article' }
    ]
  }
]