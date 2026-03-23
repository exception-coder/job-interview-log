# ✅有用过Dubbo的异步调用吗？

# 典型回答

Dubbo是支持异步进行调用的，有多种方式，大的方面分为Provider异步调用和Consumer异步调用。
​

### Consumer异步调用Consumer的异步调用比较容易理解，就是在调用方的地方自己做一个异步的处理。比如使用CompletableFuture来实现。
​

这种调用中，服务提供者提供的还是一个同步的同步接口，只不过调用方在调用的时候不需要同步等待结果，可以先去做其他事情，在需要用这个结果的时候再获取即可：
​

### Provider异步调用还有一种方式就是Provider的异步调用，也就是说本身提供的就是一个异步接口。如：
​

asyncInvoke方法的返回值就是一个CompletableFuture，调用者在调用这个方法时拿到的也是一个Future，在需要结果的时候调用Future的whenComplete方法即可：
​

> Dubbo 2.6.x及之前版本中是使用的Future进行异步调用的，在java 8中引入的CompletableFuture之后，Dubbo 2.7开始使用CompletableFuture。

除了用CompletableFuture之外，Dubbo还提供了一个类似 Servlet 3.0 的异步接口AsyncContext也能用来实现异步调用。
​

​

这里用了 RpcContext.startAsync()，可以把一个同步接口转为异步调用。
