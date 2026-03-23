# ✅OpenFeign如何处理超时？如何处理异常？如何记录客户端日志？

# 典型回答

在 Spring Cloud 中，OpenFeign 的超时配置可以通过 `application.yml` 或 `application.properties` 文件来设置：  
​

OpenFeign 提供了 `ErrorDecoder` 接口来处理请求异常的情况。我们可以自定义 `ErrorDecoder` 来捕获不同的 HTTP 状态码并处理相应的逻辑。  
​

可以在 `application.yml` 或 `application.properties` 中配置 Feign 的日志级别， 还可以自定义日志记录  
​
