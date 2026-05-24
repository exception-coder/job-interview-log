# ✅Feign调用超时，会自动重试吗？如何设置？

> 题号：1158 ｜ 分类：08_微服务与分布式

---

## 典型回答

默认情况下 **Feign 调用超时不会自动重试**。 发生超时或其他错误时，Feign 会抛异常 。 当然，我们可以通过 `**Retryer**` 来启用重试机制。

`Retryer` 允许你配置请求失败后的重试策略。`Retryer` 可以配置重试次数、重试间隔等参数。你可以通过 `@FeignClient` 注解的 `configuration` 属性来配置 Feign 的重试行为。

1、 定义一个 `Retryer` 配置类  ：

```java
import feign.Retryer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.TimeUnit;

@Configuration
public class FeignRetryConfig {

    @Bean
    public Retryer retryer() {
        // 设置最大重试次数为 3，重试间隔为 1 秒
        return new Retryer.Default(100, TimeUnit.SECONDS.toMillis(1), 3);
    }
}

```

2、在 `@FeignClient` 注解中应用配置：

```java
@FeignClient(name = "hollis-service", configuration = FeignRetryConfig.class)
public interface ExampleServiceClient {
    @GetMapping("/api/data")
    String getData();
}

```
