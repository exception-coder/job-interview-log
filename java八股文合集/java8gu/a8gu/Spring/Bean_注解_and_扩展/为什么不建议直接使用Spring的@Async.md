# ✅为什么不建议直接使用Spring的@Async

# 典型回答

@Async中关于线程池的使用部分在AsyncExecutionInterceptor中，在这个类中有一个getDefaultExecutor方法， 当我们没有做过自定义线程池的时候，就会用SimpleAsyncTaskExecutor这个线程池。
​

​

> 但是这里需要注意的是，他并不是无脑的的直接创建一个新的，这部分在扩展知识中讲​

SimpleAsyncTaskExecutor这玩意坑很大，其实他并不是真的线程池，它是不会重用线程的，每次调用都会创建一个新的线程，也没有最大线程数设置。并发大的时候会产生严重的性能问题。
​

他的doExecute核心逻辑如下：

所以，我们应该自定义线程池来配合@Async使用，而不是直接就用默认的。
​

# 扩展知识

## 自定义线程池

我们可以通过如下方式，自定义一个线程池：
​

例子用的是这篇的改造的：
​

并且把他声明为@Configuration，然后也可以把Application.java中的 @EnableAsync放到这里。
​

接下来在使用@Async的时候，指定一下即可：
​

在@Async中指定registerSuccessExecutor即可。这样在后续执行时，就会用到我们自定义的线程池了。
​

​

## 不是无脑创建SimpleAsyncTaskExecutor

在getDefaultExecutor的实现中，并不是一上来就直接new SimpleAsyncTaskExecutor()的，而是先尝试着获取默认的执行器。
​

看一下这个`super.getDefaultExecutor(beanFactory);`代码：
​

简单总结一下，就是会先尝试获取TaskExecutor的实现类，这里如果能且仅能找到唯一一个，那么就用这个，如果找不到，或者找到了多个，那么就会走到`catch (NoUniqueBeanDefinitionException ex) `和`catch (NoSuchBeanDefinitionException ex)`的分支中，这里就是获取beanName为taskExecutor的Bean
​

以上查询如果还是没查到，那么再创建SimpleAsyncTaskExecutor。
​

**所以，也就是说Spring给了我们一个机会，他也知道SimpleAsyncTaskExecutor这玩意性能不行，所以他会尝试获取一个我们自定义的线程池，如果我们定义了一个，那么他就会用我们定义的这个，如果我们定义了多个，那么他就不用了。**
**​**

**所以，这也是为什么有的时候我们自定义了一个线程池，但是没有在@Async中指定，他也能用到他的原因，但是这种方式并不靠谱，万一后面又新定义了一个，那就凉凉了。或者我们可以把一个线程池的BeanName设置成taskExecutor也行。**
