# ✅Spring中创建Bean有几种方式?

# 典型回答

Spring 的 Bean 的创建有以下几种方式，从常见到不常见开始逐一列举：
​

### 通过@Component系列注解

Spring 中提供了很多注解，可以直接把一个类的实例定义成 Bean。常见的有：
​

- @Component​- @Service​- @Repository​- @Controller​

代码实现如下：
​

​

​

### 通过@Bean 注解

在 SpringBoot 的应用中，我们通常会见到通过`@Bean` 注解来定义 Bean 的代码，尤其是在我们自己需要封装 Starter 的时候。
​

​

通过在类上使用 `@Configuration` 注解，然后类内部的方法上增加 `@Bean` 注解，来用该方法来定义一个 Bean。
​

### 通过 xml 配置

在SpringBoot 流行以前，这种方式挺多的， SpringBoot 流行起来之后，这么用的越来越少了。通过 xml 的方式来定义 Bean。

这种方式会调用HollisChuangServiceImpl的无参构造函数创建 Bean，同时还没用工厂 ：
​

### 使用 @Import 注解

@Import注解的作用是快速导入某一个或多个类，使这些类能够被Spring加载到IOC容器中进行管理。让类被 Spring 的 IOC 容器管理，这不就是创建 Bean 么，所以，这种方式也可以。
​

### 其他注解

先说一个大家可能都用过（或者见过，或者听说过）的一种 bean 注入的方式：
​

这就是直接没有用前面提到的任何一种方式，而是直接用了@DubboService注解，这个其实是 RPC框架 Dubbo 提供的一个注解，他也能把一个类的实例创建出来，并且放到 Spring 的容器中作为一个 Bean，等待后续被远程调用。
​

在 Spring 应用启动过程中，Dubbo 通过自定义的 `BeanDefinitionRegistryPostProcessor` 和 `BeanFactoryPostProcessor` 来扫描配置的包路径，识别出带有 `@DubboService` 注解的类。这些处理器解析注解中的属性（如接口类、版本号、超时时间等），并基于这些信息创建 Spring 的 `BeanDefinition`。
