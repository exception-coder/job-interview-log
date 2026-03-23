# ✅SpringCloud 在Spring6.0后有哪些变化

# 典型回答

继SpringBoot 3.0和SpringFramework 6.0之后，Spring Cloud 推出了一个重要的新版本——2022.0.0，官网把这个版本命名为Kilburn。

主要有以下几个变化，首先Spring Cloud 2022.0.0是构建在Spring Framework 6.0和Spring Boot 3.0 之上的一个主要版本。所以，**他对JDK要求同样是最低需要是Java 17，对J2EE的要求最低需要Jakarta EE 9。**

Spring Cloud 2022.0.0中的组件各个版本做了一些升级，并**移除了Spring Cloud CLI 和 Spring Cloud Cloudfoundry 这两个模块。**

> Spring Boot CLI是一个命令行工具，用于使用Spring快速开发。 它允许运行Groovy脚本，Groovy脚本类似于没有任何样板代码的java代码。 Spring CLI有助于引导新项目或编写自定义命令。

> Spring Cloud for Cloudfoundry可以轻松地在Cloud Foundry 中运行Spring Cloud应用程序。 Cloud Foundry具有“服务”的概念，即“绑定”到应用程序的中间件，实质上为其提供包含凭据的环境变量。

Spring Boot 3.0 中两个重要的升级就是开始支持AOT编译和引入了Spring Native。

**在本次升级的SpringCloud 2022.0.0中，多个组件也都增加了对AOT和Native的支持**，如Spring Cloud Function、Spring Cloud Stream、Spring Cloud OpenFeign、Spring Cloud Commons、Spring Cloud Consul以及Spring Cloud Gateway等。

由于Spring现在提供了自己的接口HTTP客户端解决方案，从2022.0.0开始，Spring Cloud OpenFeign将被视为功能完整。这意味着**Spring Cloud团队将不再向模块添加新特性。只会修复bug和安全问题。**

**更新到Eureka 2.0.0**，Eureka 2.0.0 是 Eureka 的一个新分支，与 7 年前的旧 2.x-archive 分支实验无关。新的 2.x 分支是为了与 JakartaEE 兼容，这也使得 Spring Cloud Netflix 与 Spring Framework 6.0 和 Spring Boot 3.0 兼容。

同时，**本次版本升级还迁移Apache HttpClient到Apache HC5 HttpClient。**
