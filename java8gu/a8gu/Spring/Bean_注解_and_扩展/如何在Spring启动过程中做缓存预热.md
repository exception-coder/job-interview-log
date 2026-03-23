# ✅如何在Spring启动过程中做缓存预热

# 典型回答

这个问题其实是考察如何在Spring启动过程中做额外操作，其实有挺多做法的，这里就介绍几种比较常用的：

### ApplicationReadyEvent

在应用程序启动时，可以通过监听应用启动事件，或者在应用的初始化阶段，将需要缓存的数据加载到缓存中。
​

ApplicationReadyEvent 是 Spring Boot 框架中的一个事件类，它表示应用程序已经准备好接收请求，即应用程序已启动且上下文已刷新。这个事件是在 ApplicationContext 被初始化和刷新，并且应用程序已经准备好处理请求时触发的。
​

基于ApplicationReadyEvent，我们可以在应用程序完全启动并处于可用状态后执行一些初始化逻辑。使用 @EventListener 注解或实现 ApplicationListener 接口来监听这个事件。例如，使用 @EventListener 注解：
​

### Runner

如果你不想直接监听**ApplicationReadyEvent，在SpringBoot中，也可以通过****CommandLineRunner** 和 **ApplicationRunner** 来实现这个功能。
​

**CommandLineRunner** 和 **ApplicationRunner** 是 Spring Boot 中用于在应用程序启动后执行特定逻辑的接口。这解释听上去就像是专门干这个事儿的。
​

CommandLineRunner 和 ApplicationRunner的调用，是在SpringApplication的run方法中，这个我们在下面这个介绍过：

其实就是callRunners(context, applicationArguments);的实现：
​

### 使用InitializingBean接口

实现 InitializingBean 接口，并在 afterPropertiesSet 方法中执行缓存预热的逻辑。这样，Spring 在初始化 Bean 时会调用 afterPropertiesSet 方法。
​

这个方法的调用我们在Spring的启动流程中也介绍过，不再展开了。
​

**使用****@PostConstruct****注解**
​

类似的，我们还可以使用 @PostConstruct 注解标注一个方法，该方法将在 Bean 的构造函数执行完毕后立即被调用。在这个方法中执行缓存预热的逻辑。
​

​

这个我们也介绍过，也不展开了。
​
