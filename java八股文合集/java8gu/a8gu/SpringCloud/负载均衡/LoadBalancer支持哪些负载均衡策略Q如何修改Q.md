# ✅LoadBalancer支持哪些负载均衡策略？如何修改？

# 典型回答

Spring Cloud LoadBalancer 内置其实只提供了以下2种默认策略：
| **策略** | **类** | **描述** |
| **轮询 (Round-Robin)** | `RoundRobinLoadBalancer` | **默认策略**，每个请求依次分配到不同的实例 |
| **随机 (Random)** | `RandomLoadBalancer` | 随机选择一个可用实例 |

默认情况下，Spring Cloud LoadBalancer 使用`RoundRobinLoadBalancer` 进行轮询调度（向下兼容了Ribbon的轮询策略），即请求会依次轮流分配到可用的服务实例。  定义在`LoadBalancerClientConfiguration` 中：
​

​

以上，就可以看到，这里是使用了RoundRobinLoadBalancer来作为默认的负载均衡策略的。
​

如果想要修改负载均衡策略，需要自己定义 `ReactorLoadBalancer<ServiceInstance>` Bean。  比如使用随机策略：
​

# 扩展知识

## Nacos负载均衡策略使用

当然，除了默认的这两种之外，其实我们还可以用其他的负载均衡策略，比如Nacos提供的 NacosLoadBalancer，用如下方式即可开启Nacos的负载均衡策略了。
​

## 自定义负载均衡策略

在 **Spring Cloud LoadBalancer** 中自定义负载均衡策略，通常需要实现 `ReactorServiceInstanceLoadBalancer` 接口，并在其中自定义实例选择逻辑。Spring Cloud LoadBalancer 会根据你的负载均衡策略来决定如何选择服务实例。  
​

1、 实现 `ReactorServiceInstanceLoadBalancer`
​

2、 配置自定义负载均衡器。
​

​
