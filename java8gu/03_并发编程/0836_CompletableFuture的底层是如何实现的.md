# ✅CompletableFuture的底层是如何实现的？

> 题号：0836 ｜ 分类：03_并发编程

---

## 典型回答

CompletableFuture是Java 8中引入的一个新特性，它提供了一种简单的方法来实现异步编程和任务组合。他的底层实现主要涉及到了几个重要的技术手段，**如Completion链式异步处理、事件驱动、ForkJoinPool线程池、以及CountDownLatch控制计算状态、通过CompletionException捕获异常等。**

**CompletableFuture 内部采用了一种链式的结构来处理异步计算的结果**，每个 CompletableFuture 都有一个与之关联的 Completion 链，它可以包含多个 Completion 阶段，每个阶段都代表一个异步操作，并且可以指定它所依赖的前一个阶段的计算结果。（在 CompletableFuture 类中，定义了一个内部类 Completion，它表示 Completion 链的一个阶段，其中包含了前一个阶段的计算结果、下一个阶段的计算操作以及执行计算操作的线程池等信息。）

**CompletableFuture 还使用了一种事件驱动的机制来处理异步计算的完成事件。**在一个 CompletableFuture 对象上注册的 Completion 阶段完成后，它会触发一个完成事件，然后 CompletableFuture 对象会执行与之关联的下一个 Completion 阶段。

CompletableFuture 的异步计算是通过线程池来实现的。**CompletableFuture在内部使用了一个ForkJoinPool线程池来执行异步任务。**当我们创建一个CompletableFuture对象时，它会在内部创建一个任务，并提交到ForkJoinPool中去执行。

## 扩展知识

## CompletableFuture应用场景

CompletableFuture可以用在多个场景中，比如我们有**多线程编排**的需求的话，可以使用CompletableFuture实现。

CompletableFuture非常适合实现**异步计算**，在异步计算过程中，可以将计算任务提交到线程池中，并等待计算结果。在计算完成后，可以将结果传递给下一个阶段，以继续进行计算。

```java
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class CompletableFutureDemo {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        List<CompletableFuture<Integer>> futures = nums.stream()
        .map(value -> CompletableFuture.supplyAsync(() -> {
            // 这里是每个异步任务要执行的操作，
            return value;
        }))
        .collect(Collectors.toList());

        CompletableFuture<Integer> sumFuture = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
        .thenApplyAsync(v -> {
            // 所有异步计算任务完成后，将它们的结果进行合并
            int sum = futures.stream()
            .mapToInt(CompletableFuture::join)
            .sum();
            return sum;
        });

        int sum = sumFuture.join();
        System.out.println(sum);
    }
}

```

在上面的示例中，首先定义了一个包含 10 个整数的 List 对象 nums。接下来，使用 CompletableFuture.supplyAsync 方法将计算任务提交到线程池中进行并行计算。在使用join等待计算结果并输出。

CompletableFuture还可以用来实现批量执行异步任务，所有任务都执行成功后，执行下一个动作：

```java
//异步通知下游系统
CompletableFuture<Void> allFutures = CompletableFuture.allOf(noticeDetails.stream()
                                                             .map(detail -> CompletableFuture.supplyAsync(() -> {
                                                                 notice(detail);
                                                                 return null;
                                                             })).toArray(CompletableFuture[]::new));

//所有任务通知成功后，更新代还通知单
allFutures.whenComplete((v, e) -> {
    if (e == null) {
        noticeOrder.setState("SUCCESS");
        Boolean res = noticeOrderService.updateById(noticeOrder);
        Assert.isTrue(res, "update failed");
    } else {
        log.error("notice failed", e);
    }
});
```

CompletableFuture 可以非常方便地实现**事件驱动编程**。在事件驱动编程中，可以使用 CompletableFuture 来实现事件处理、回调函数等。在事件处理中，可以将事件处理任务提交到线程池中，并等待事件处理结果。在事件处理完成后，可以将结果传递给下一个事件处理器，以继续进行事件处理。

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class CompletableFutureDemo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        CompletableFuture<String> future = new CompletableFuture<>();
        future.thenAcceptAsync(result -> System.out.println("Event 1 processed: " + result));
        future.thenAcceptAsync(result -> System.out.println("Event 2 processed: " + result));
        future.thenAcceptAsync(result -> System.out.println("Event 3 processed: " + result));
        future.complete("Hello, CompletableFuture!");
    }
}
```

在上面的示例中，首先定义了一个 CompletableFuture 对象 future。接下来，使用 future.thenAcceptAsync 方法定义了三个回调函数，用于处理事件。在事件触发后，使用 future.complete 方法将事件结果传递给回调函数进行处理。最后，使用 thenAcceptAsync 方法输出事件处理结果。
