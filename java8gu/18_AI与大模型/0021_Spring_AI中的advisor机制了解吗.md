# ✅Spring AI中的advisor机制了解吗？

> 题号：0021 ｜ 分类：18_AI与大模型

---

## 典型回答

（本文内容来自我出的[AI课](https://www.yuque.com/hollis666/fsn3og/dkm70gxmurvgph0z)，详细的代码演示和视频讲解可以从课程中学习。）

Spring AI 中提供了一个灵活且强大的方式，可以用于拦截、修改和增强 Spring 应用中的 AI 交互功能，那就是Advisor，通过利用Advisor，开发者可以创建更复杂、可重用且易于维护的 AI 组件。

可以把Advisor理解为插件，比如我们想要实现记忆功能，就可以用到Memory相关的Advisor

![](https://cdn.nlark.com/yuque/0/2025/png/5378072/1763040381877-8a1cb357-0c09-4223-88cc-89ae1ac49c80.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_23%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

实现日志记录相关的功能，我们就可以添加一个日志的Advisor：

![](https://cdn.nlark.com/yuque/0/2025/png/5378072/1763040381903-98c2c7bd-c48a-43d4-86b8-91f888b2859e.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_17%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

Spring AI中也提供了一些列内置的Advisor

![](https://cdn.nlark.com/yuque/0/2025/png/5378072/1763040381926-21c6e08c-9035-452d-9dc1-5dd43b21d196.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_20%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

我们看一下Advisor接口的定义，其实没啥东西，主要是他继承自Ordered，需要在他的所有视线中实现`int getOrder();` 这个方法。这个方法主要是用来设置各个Advisor的顺序的。

```text
public interface Advisor extends Ordered {
    int DEFAULT_CHAT_MEMORY_PRECEDENCE_ORDER = -2147482648;

    String getName();
}
```

他还有几个子接口。主要就是CallAdvisor、StreamAdvisor以及BaseAdvisor。

![](https://cdn.nlark.com/yuque/0/2025/png/5378072/1763040381916-f7ce0f9a-63ef-441f-90e2-75b80389dcbf.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_32%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

其中最基础的两个接口，一个是CallAdvisor一个是StreamAdvisor，一个是给同步调用使用的，另一个是给流式调用使用的。别贴提供了adviseCall和adviseStream方法。

```text
public interface CallAdvisor extends Advisor {
    ChatClientResponse adviseCall(ChatClientRequest chatClientRequest, CallAdvisorChain callAdvisorChain);
}

public interface StreamAdvisor extends Advisor {
    Flux<ChatClientResponse> adviseStream(ChatClientRequest chatClientRequest, StreamAdvisorChain streamAdvisorChain);
}
```

其实Advisor的执行过程，就和AOP是一样的，他会把所有注册到一个chatClient上的Advisor都找出来，然后按顺序执行。

在DefaultChatClient中会有一个advisorChain，这里面就是所有注册进来的advisor，以此调用这些advisor的adviseCall方法。（如果是流式调用，就是调用adviseStream方法）

![](https://cdn.nlark.com/yuque/0/2025/png/5378072/1763040382006-6daa4b11-1b48-4d8f-a85a-bb655fc0a817.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_28%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

![](https://cdn.nlark.com/yuque/0/2025/png/5378072/1763040383534-99ed796b-8b84-45e9-b146-f8277612bd5f.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_32%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

这个adviseCall方法是怎么实现的呢(adviseStream类似，拿adviseCall为例）？其实主要分4类：

![](https://cdn.nlark.com/yuque/0/2025/png/5378072/1763040383721-80a2ffed-c348-4dc2-8942-85ece5e84355.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_40%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

- ChatModelCallAdvisor
- SimpleLoggerAdvisor
- SafeGuardAdvisor
- BaseAdvisor

### ChatModelCallAdvisor

ChatModelCallAdvisor的adviseCall的实现很简单，就是直接调用chatModel的call方法，可以理解为直接和大模型交互了。

![](https://cdn.nlark.com/yuque/0/2025/png/5378072/1763040383819-69d9a020-cfac-4ba5-afed-9428ffa7af92.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_28%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

因为直接直接要和大模型交互，其实这个advisor的话理论上应该是最后执行的，所以他的getOrder设置的是最低优先级。

```text
@Override
public int getOrder() {
    return Ordered.LOWEST_PRECEDENCE;
}
```

### SimpleLoggerAdvisor

这个是一个内置的日志打印的advisor，adviseCall实现如下：

![](https://cdn.nlark.com/yuque/0/2025/png/5378072/1763040383830-d0d40e04-84ad-4ade-a25d-aed31a4b843d.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_26%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

其实就是在调用下一个advisor之前先记录一下request的日志，在调用之后，再记录一下response的日志。

### SafeGuardAdvisor

这是一个spring ai内置的安全审查的advisor，其实主要的实现内容就是做敏感词拦截：

![](https://cdn.nlark.com/yuque/0/2025/png/5378072/1763040383918-61bbff19-bcfc-455b-b86d-bddfcb4e73d8.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_29%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

### BaseAdvisor

这个是除了以上几个advisor之外，所有其他advisor的接口，他的实现充分的体现了AOP的机制：

![](https://cdn.nlark.com/yuque/0/2025/png/5378072/1763040384062-b164ce2b-2a51-4074-a131-b22cb528997f.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_26%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

在调用下一个advisor之前，先调用自己的before方法，再调用拿到结果之后，再调用自己的after方法。

那么也就是说，我们可以自定义advisor的话，如果想在模型调用前或者调用后做一些其他事情，都可以实现这个接口，比如我们前面用到过很多次的MessageChatMemoryAdvisor

他的before和after实现如下，就是做记忆的记录。

![](https://cdn.nlark.com/yuque/0/2025/png/5378072/1763040384189-2efb24c6-043b-48cf-b924-b621ac4723ff.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_25%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

最后，再贴一张spring ai官方给出的advisor的调用流程图：

![](https://cdn.nlark.com/yuque/0/2025/png/5378072/1763040384309-d03bb992-9af3-4b49-be80-ca20bbc81594.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_56%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)
