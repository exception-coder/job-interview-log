# ✅Feign调用超时，会自动重试吗？如何设置？

# 典型回答

默认情况下 **Feign 调用超时不会自动重试**。 发生超时或其他错误时，Feign 会抛异常 。 当然，我们可以通过 `**Retryer**` 来启用重试机制。  

`Retryer` 允许你配置请求失败后的重试策略。`Retryer` 可以配置重试次数、重试间隔等参数。你可以通过 `@FeignClient` 注解的 `configuration` 属性来配置 Feign 的重试行为。  
​

1、 定义一个 `Retryer` 配置类  ：

2、在 `@FeignClient` 注解中应用配置：
