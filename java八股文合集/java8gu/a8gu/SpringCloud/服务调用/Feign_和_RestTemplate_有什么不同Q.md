# ✅Feign 和 RestTemplate 有什么不同？

# 典型回答

Feign和RestRemplate都是用于在 Java 中进行 HTTP 请求的客户端，经常被拿来对比。
​

**RestTemplate是传统的 HTTP 客户端**，提供了更多的灵活性，但需要手动编写 HTTP 请求的细节（如 URL、请求方法等）。你需要使用代码编写具体的 HTTP 请求，并手动处理响应。  
​

**Feign 是声明式的 HTTP 客户端，**允许你通过接口定义服务调用，Feign 自动实现 HTTP 请求的细节。这种方式通常与 Spring Cloud 结合使用，可以简化微服务间的调用。
**​**

用Feign的场景中，先通过@FeignClient来声明了一个HTTP服务接口，其中指明了方法、请求方式、url等信息。
**​**

这样在调用的时候，只需要用Feign的工具直接调用对应的方法即可:
​

相比之下，Feign 通过声明式接口定义，并自动处理 HTTP 请求的。RestTemplate需要自己手动控制 HTTP 请求。 另外RestTemplate需要手动处理响应状态码、错误信息等。  Feign允许开发者自定义如何处理不同的 HTTP 错误响应。  而且Feign内置支持Ribbon等负载均衡，而RestTemplate需要做额外的配置。
​

但是，Feign只能做内部的调用，因为要有人给你定义API和服务注册的提供。而别人提供外部的HTTP接口的话，就只能用RestTemplate调用了，所以RestTemplate更加通用一些。
