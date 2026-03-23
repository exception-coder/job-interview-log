# ✅SpringBoot的启动流程是怎么样的？

# 典型回答

以下就是一个SpringBoot启动的入口，想要了解SpringBoot（本文代码基于SpringBoot 3）的启动过程，就从这里开始。
​

​

这里我们直接看重重点的`SpringApplication.run(Application.class, args);`方法。他的实现细节如下：
​

最终就是`new SpringApplication(sources).run(args)`这部分代码了。那么接下来就需要分两方面介绍SpringBoot的启动过程。一个是`new SpringApplication`的初始化过程，一个是`SpringApplication.run`的启动过程。
​

### new SpringApplication()

在SpringApplication的构造函数中，调用了一个initialize方法，所以他的初始化逻辑直接看这个initialize方法就行了。流程图及代码如下：
​

- **添加源**：将提供的源（通常是配置类）添加到应用的源列表中。- **设置 Web 环境**：判断应用是否应该运行在 Web 环境中，这会影响后续的 Web 相关配置。- **加载初始化器**：从 `spring.factories` 文件中加载所有列出的 `ApplicationContextInitializer` 实现，并将它们设置到 `SpringApplication` 实例中，以便在应用上下文的初始化阶段执行它们。- **设置监听器**：加载和设置 `ApplicationListener`  实例，以便应用能够响应不同的事件。- **确定主应用类**：确定主应用类，这个主应用程序类通常是包含 `public static void main(String[] args)` 方法的类，是启动整个 `Spring Boot `应用的入口点。

**这里面第三步，加载初始化器这一步是Spring Boot的自动配置的核心**，因为在这一步会从 spring.factories 文件中加载并实例化指定类型的类。
​

具体实现的代码和流程如下：

以下就是new SpringApplication的主要流程，主要依赖initialize 方法初始化 Spring Boot 应用的关键组件和配置。
​

这个过程确保了在应用上下文被创建和启动之前，所有关键的设置都已就绪，包括环境设置、初始化器和监听器的配置，以及主应用类的识别。
​

​

### SpringApplication.run

看完了new SpringApplication接下来就在看看run方法做了哪些事情。这个方法是 SpringApplication 类的核心，用于启动 Spring Boot 应用。
​

​

以上的过程太复杂了，我们挑几个关键的介绍一下他们的主要作用。
​

**启动&停止计时器**：在代码中，用到stopWatch来进行计时。所以在最开始先要启动计时，在最后要停止计时。这个计时就是最终用来统计启动过程的时长的。最终在应用启动信息输出的实时打印出来，如以下内容：
​

**获取和启动监听器：**这一步从spring.factories中解析初始所有的SpringApplicationRunListener 实例，并通知他们应用的启动过程已经开始。
​

> SpringApplicationRunListener 是 Spring Boot 中的一个接口，用于在应用的启动过程中的不同阶段提供回调。实现这个接口允许监听并响应应用启动周期中的关键事件。SpringApplicationRunListener 接口定义了多个方法，每个方法对应于启动过程中的一个特定阶段。这些方法包括：- starting()：在运行开始时调用，此时任何处理都未开始，可以用于初始化在启动过程中需要的资源。- environmentPrepared()：当 SpringApplication 准备好 Environment（但在创建 ApplicationContext 之前）时调用，这是修改应用环境属性的好时机。- contextPrepared()：当 ApplicationContext 准备好但在它加载之前调用，可以用于对上下文进行一些预处理。- contextLoaded()：当 ApplicationContext 被加载（但在它被刷新之前）时调用，这个阶段所有的 bean 定义都已经加载但还未实例化。- started()：在 ApplicationContext 刷新之后、任何应用和命令行运行器被调用之前调用，此时应用已经准备好接收请求。- running()：在运行器被调用之后、应用启动完成之前调用，这是在应用启动并准备好服务请求时执行某些动作的好时机。- failed()：如果启动过程中出现异常，则调用此方法。

**装配环境参数：**这一步主要是用来做参数绑定的，prepareEnvironment 方法会加载应用的外部配置。这包括 application.properties 或 application.yml 文件中的属性，环境变量，系统属性等。所以，我们自定义的那些参数就是在这一步被绑定的。
​

**打印Banner：**这一步的作用很简单，就是在控制台打印应用的启动横幅Banner。如以下内容：
​

**创建应用上下文：**到这一步就真的开始启动了，第一步就是先要创建一个Spring的上下文出来，只有有了这个上下文才能进行Bean的加载、配置等工作。
​

**准备上下文**：这一步非常关键，很多核心操作都是在这一步完成的：
​

在这一步，会打印启动的信息日志，主要内容如下：

**刷新上下文**：这一步，是Spring启动的核心步骤了，这一步骤包括了实例化所有的 Bean、设置它们之间的依赖关系以及执行其他的初始化任务。
​

所以，这一步中，主要就是创建BeanFactory，然后再通过BeanFactory来实例化Bean。
​

但是，很多人都会忽略一个关键的步骤（网上很多介绍SpringBoot启动流程的都没提到），那就是Web容器的启动，及Tomcat的启动其实也是在这个步骤。
​

在refresh-> onRefresh中，这里会调用到ServletWebServerApplicationContext的onRefresh中：
​

​

这里面的createWebServer方法中，调用到factory.getWebServer(getSelfInitializer());的时候，factory有三种实现，分别是JettyServletWebServerFactory、TomcatServletWebServerFactory、UndertowServletWebServerFactory这三个，默认使用TomcatServletWebServerFactory。
​

TomcatServletWebServerFactory的getWebServer方法如下，这里会创建一个Tomcat
​

在最后一步getTomcatWebServer(tomcat);的代码中，会创建一个TomcatServer，并且把他启动：
​

​

接下来在initialize中完成了tomcat的启动。
​

最后，SpringBoot的启动过程主要流程如下：
​
