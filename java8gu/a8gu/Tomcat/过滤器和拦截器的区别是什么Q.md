# ✅过滤器和拦截器的区别是什么？

# 典型回答

一般这个问题，主要是因为在SpringMVC的应用中，过滤器和拦截器都是用来对请求进行预处理、过滤、拦截的，所以经常会放在一起比较。不过他们其实还有一些区别的。
​

他们的主要区别在于作用和生效的位置不同，过滤器是在请求进入Servlet容器之前拦截请求并对请求进行处理，而拦截器是在请求进入Servlet容器之后，但在进入Controller之前拦截请求并对请求进行处理，也可以在响应返回客户端之前，拦截响应并对响应进行处理。
​

**在Tomcat中，一次请求会先进入到Tomcat容器，然后经过Filter的处理，处理通过之后才会进入到Servlet容器，进入到Servlet容器之后，才会在Servlet执行的前后执行Intercepter。**
​

过滤器在请求进入Servlet容器之前拦截请求并对请求进行处理，比如对请求进行安全验证、日志记录等，之后将请求转发给对应的Servlet进行处理。**过滤器是基于Java Servlet规范实现的，可以通过配置web.xml文件进行实现。**
​

拦截器是在请求进入Servlet容器之后，拦截请求并对请求进行处理，也可以在响应返回客户端之前，拦截响应并对响应进行处理。拦截器可以对请求进行更加精细的控制，例如进行AOP、权限控制、事务管理等操作。**拦截器是基于Spring框架实现的，可以通过定义拦截器类实现。**
​

​

# 扩展知识

## 代码实现

定义一个过滤器，需要实现javax.servlet.Filter接口：
​

并且需要在web.xml文件中把他配置上:
​

或者通过注解也可以。
​

在 LoginFilter上添加@WebFilter注解，并在启动类上增加@ServletComponentScan("com.hollis.filter.LoginFilter")注解。也可替代xml文件中的配置。

想要定义一个拦截器，需要实现org.springframework.web.servlet.HandlerInterceptor接口：
​

​

并且在SpringMVC中进行配置：
​

​

或者
​
