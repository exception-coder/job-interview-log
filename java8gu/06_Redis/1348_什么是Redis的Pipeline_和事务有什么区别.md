# ✅什么是Redis的Pipeline，和事务有什么区别？

> 题号：1348 ｜ 分类：06_Redis

---

## 典型回答

**Redis 的 Pipeline 机制是一种用于优化网络延迟的技术**，主要用于在单个请求/响应周期内执行多个命令。在没有 Pipeline 的情况下，每执行一个 Redis 命令，客户端都需要等待服务器响应之后才能发送下一个命令。这种往返通信尤其在网络延迟较高的环境中会显著影响性能。

在 Pipeline 模式下，客户端可以一次性发送多个命令到 Redis 服务器，而无需等待每个命令的响应。Redis 服务器接收到这批命令后，会依次执行它们并返回响应。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/5378072/1700987066911-c1bb3104-3b52-40aa-a52d-907056a830d1.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_32%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

所以，Pipeline通过减少客户端与服务器之间的往返通信次数，可以显著提高性能，特别是在执行大量命令的场景中。

但是，需要注意的是，**Pipeline是不保证原子性的**，他的多个命令都是独立执行的，Redis并不保证这些命令可以以不可分割的原子操作进行执行。这是Pipeline和Redis的事务的最大的区别。

虽然都是执行一些相关命令，但是Redis的事务提供了原子性保障，保证命令执行以不可分割、不可中断的原子性操作进行，而Pipeline则没有原子性保证。

但是他们在命令执行上有一个相同点，那就是如果执行多个命令过程中，有一个命令失败了，其他命令还是会被执行，而不会回滚的。

> 📎 相关：[✅Redis 的事务机制是怎样的？](https://www.yuque.com/hollis666/fsn3og/xxxz79)

## 扩展知识

## 如何使用Pipeline

在 Java 中，可以用Jedis来使用pipeline：

```java
import redis.clients.jedis.Jedis;
import redis.clients.jedis.Pipeline;

public class RedisPipelineExample {
    public static void main(String[] args) {
        // 连接到 Redis 服务器
        try (Jedis jedis = new Jedis("localhost", 6379)) {
            // 创建 Pipeline
            Pipeline pipeline = jedis.pipelined();

            // 向 Pipeline 添加命令
            pipeline.set("foo", "bar");
            pipeline.get("foo");
            pipeline.incr("counter");

            // 执行 Pipeline 中的所有命令，并获取响应
            List<Object> responses = pipeline.syncAndReturnAll();

            // 输出响应
            for (Object response : responses) {
                System.out.println(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```
