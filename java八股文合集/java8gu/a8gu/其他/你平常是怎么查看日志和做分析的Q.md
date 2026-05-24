# ✅你平常是怎么查看日志和做分析的？

# 典型回答

通常我们会使用ELK收集并查看日志，查询日志通过ES语法实现。但是有的时候，还是免不了要去服务器上查看日志。在Linux下，常用的有2种方式查看日志：

- 使用`tail -f 日志文件名`滚动输出日志文件。适用于实时观察日志的场景。

- 使用`less 日志文件名`查看整个日志文件，并按`空格`向下翻页，按`ctrl+b`向上翻页，按`/`并输入`关键词`向下搜索，按`?`并输入`关键词`向上搜索，按`q`退出。适用于通篇查看日志的场景。

除了日志的查看，有的时候我们还需要做一些分析，比如统计QPS，按照耗时排序等。
​

在不用ELK或者其他第三方日志平台的情况下，我们使用Linux命令是完全可以做到的。但只是`tail`和`less`命令完成不了上述需求，此时我们需要使用`grep`、`awk`、`sort`、`uniq`、`wc`等命令进行组合才能达到目的。这些命令组合不只用于分析日志，也可以用到其他分析场景（如统计磁盘、CPU使用情况）。
​

如以下需要做数据分析场景：

- 统计httpClient日志文件http_access.log中，某个接口的一天总请求量是多少。- 统计客户端访问日志access.log中，返回http状态码为500的接口平均QPS是多少。- 统计access.log中，某个接口耗时大于500ms，并按照耗时排序。​

下面介绍几个常用的命令及使用方式。

# 扩展知识

- `grep`命令：用于查找关键词，常用玩法：

- `wc`命令：用于字词统计，常用玩法：

- `sort`命令：用于排序，常用玩法：

- `uniq`命令：用于去重，常用玩法：

- `awk`命令：用于处理文本，awk是个非常强大的命令，能够处理输入的每一行字符串，玩法众多（够写一本书了），这里只介绍常用的：

我们利用以上的命令，来回答扩展阅读开头的三个问题：

> 说明：access.log和http_access.log遵循如下格式：`[日志级别] 请求时间年月日 请求时间时分秒 [请求线程名称] - 请求方法 响应状态码 耗时 请求URL requestID`每组信息中间用空格分开。如：`[INFO] 20231023 13:00:27.049 [abcService-exec-1] - 2 GET 200 600 http://xxx.com/abc/xxx.json d7af416bc1390dc4d9124f147bab4e53 [INFO] 20231023 13:00:27.049 [abcService-exec-1] - 2 GET 500 800 http://xxx.com/abc/yyy.json e7af416bc1390dc4d9124f147bab4e52 [INFO] 20231023 13:00:27.049 [abcService-exec-1] - 2 GET 200 810 http://xxx.com/abc/yyy.json e7af416bc1390dc4d9124f147bab4e52 [INFO] 20231023 13:00:27.050 [abcService-exec-1] - 2 GET 500 210 http://xxx.com/abc/yyy.json e7af416bc1390dc4d9124f147bab4e52 [INFO] 20231023 13:00:27.049 [abcService-exec-1] - 2 GET 200 550 http://xxx.com/abc/aaa.json f7af416bc1390dc4d9124f147bab4e51 [INFO] 20231023 13:00:27.049 [abcService-exec-1] - 2 GET 200 50 http://xxx.com/abc/zzz.json f7af416bc1390dc4d9124f147bab4e51`

**统计httpClient日志文件http_access.log中，某个接口的一天总请求量是多少。**

**统计客户端访问日志access.log中，返回http状态码为500的接口平均QPS是多少。**

**统计access.log中，某个接口耗时大于500ms，并按照耗时排序。**

awk命令比较复杂，有一本书叫做《sed与awk》，详细讲解俩个命令如何处理文本的。也可以多敲多练，遇到不会的拿样本数据问问chatgpt，会给出正确的命令和详细的解释。
