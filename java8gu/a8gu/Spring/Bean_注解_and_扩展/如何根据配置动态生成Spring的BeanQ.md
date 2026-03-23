# ✅如何根据配置动态生成Spring的Bean？

# 典型回答

在 Spring 应用中，根据运行时的配置（比如数据库配置、配置文件、配置中心等）动态生成 Spring Bean 是一种常见需求，特别是在面对多环境配置或者需要根据不同条件创建不同实例时。
​

Spring 提供了几种方式来实现这一需求。
​

### 基于条件的 Bean 注册

Spring提供了@Conditional（或者@ConditionalOnProperty）注解，允许你在满足特定条件时才创建Bean。你可以定义自己的条件，这些条件实现了Condition接口。
​

`my.condition.enabled`可以通过配置文件或者配置中心进行配置，然后当`my.condition.enabled`属性为true时，MyBean才会被创建。
​

### 使用@ConfigurationProperties

`@ConfigurationProperties`注解可以将配置文件中的属性绑定到Bean的属性上，然后就可以基于他做动态配置了。
​

### 编程式Bean注册我们还可以通过实现BeanDefinitionRegistryPostProcessor接口来编程式地注册Bean。
​

### 使用@Profile

**@**Profile注解允许根据活动的Spring Profiles来创建Bean。**一般是用于区分开发、测试和生产环境的。**
​

​
