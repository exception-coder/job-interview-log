# ✅如何自定义一个starter？

# 典型回答

在Spring Boot中，创建一个自定义starter可以简化特定功能或组件的配置过程，让其他项目能够轻松地重用这些功能。

这里我们以自定义一个xxl-job的starter为例，介绍下如何简化配置。
​

### 添加依赖

添加Spring Boot的依赖：

### 实现自动配置

在starter项目中，创建自动配置类。这个类要使用`@Configuration`注解，并根据条件使用`@ConditionalOn...`注解来条件化地配置beans。（例如，可以使用`@ConditionalOnMissingBean`来只在用户没有定义特定bean时才提供一个默认实现。）
​

如果你的starter需要配置属性，可以通过定义一个配置属性类来实现，使用**@ConfigurationProperties**注解。
​

接下来定义Configuration，并且在其中创建需要的bean：

这里面用@Bean 注解声明了一个bean，并且使用`@ConditionalOnMissingBean`类指定这个bean的创建条件，即在缺失的时候创建。
​

`@ConditionalOnProperty(prefix = XxlJobProperties.PREFIX, value = "enabled", havingValue = "true")`约定了当我们配置了`spring.xxl.job.enable=true`的时候才会生效。

### 创建配置类入口文件

在你的starter项目的src/main/resources下，创建META-INF/spring目录，并且创建一个
org.springframework.boot.autoconfigure.AutoConfiguration.imports文件，内容如下：
​

​

以上就定义好了一个starter，只需要在需要的地方引入，并且配置上相应的配置项就行了，配置项内容就是我们定义在XxlJobProperties中的。
​

以前，我们配置这些Configuration的时候会用spring.factories，但是这个已经被官方标记为过期，不建议使用了。

​

​

​

​
