# ✅你掌握哪些Linux常用命令？

> 题号：0492 ｜ 分类：19_工具与工程

---

## 典型回答

列一下我觉得我们比较常用的Linux命令。***需要注意的是，本文并不是命令详解，所以并不包含每个命令的所有参数的详细展开介绍，这里只介绍我自己工作中常用的一些用法。相信大家在工作中也基本都是会这么用。如果想要了解具体某个命令，可以单独学习即可。***

### 系统信息

1. **top**：实时显示系统进程和资源使用情况。当线上报警CPU占用率过高，load飙高的时候，我们通常会先上去使用top命令看一下具体哪些进程耗费了资源。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/5378072/1702089650506-29faa34a-9c93-4640-a599-6a9dc37a2f92.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_41%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

1. **df**：显示磁盘空间使用情况。当线上服务器报警磁盘满的时候，需要上去查看磁盘占用情况，可以使用这个命令

![image.png](https://cdn.nlark.com/yuque/0/2023/png/5378072/1702089414016-be73b5d4-3335-4eb1-9dcd-169d45586dff.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_30%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

**-h**（--human-readable）：以易于阅读的格式（如MB、GB）显示信息。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/5378072/1702089512659-a8c07ae8-d971-41a3-8619-a4aa29110912.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_26%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

1. **du**：显示目录或文件的磁盘使用量。

这个命令可以查看目录的磁盘占用情况，常用的几个命令如下图：

![image.png](https://cdn.nlark.com/yuque/0/2023/png/5378072/1702089959701-271a7939-f7fc-4d05-ad38-6fd0082b340b.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_29%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

1. date：查看和设置系统的日期和时间

![image.png](https://cdn.nlark.com/yuque/0/2023/png/5378072/1702091273463-7cfc9e94-2415-4336-b4b4-d94437966fed.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_25%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

### 系统管理

1. **ps**：查看当前进程。通常用来查看Java进程的情况以及检查JVM参数：

```text
//查找java进程，相当于jps命令，但是有的时候线上服务器没办法执行jps，可以用以下命令代替
ps aux|grep java
//查询java进程，并高亮显示Xmx参数部分
ps aux|grep java | grep --color Xmx
```

![image.png](https://cdn.nlark.com/yuque/0/2023/png/5378072/1702091116260-da1b5700-b93f-4e36-8038-0dc587ff290a.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_96%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

1. **kill**：杀死进程，慎用，尤其是在生产环境中，尤其是kill -9。

> 📎 相关：[✅对JDK进程执行kill -9有什么影响？](https://www.yuque.com/hollis666/fsn3og/kmlq81)

1. **chmod**：更改文件或目录权限。
2. **chown**：更改文件或目录的所有者和群组。

### 文件操作

这里就是一些非常常用的文件操作命令了，每一个都不展开讲了，都比较简单，都是必会的。

1. **ls**：列出目录内容。当需要显示隐藏文件的时候用`ls -a`
2. **ll**：**ll**是**ls -l**命令的一个别名，用于以详细列表格式显示当前目录中的文件和目录。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/5378072/1702090099317-9624e98c-bff8-45a0-8570-7a2b42c15366.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_27%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

1. **cd**：更改当前目录。
2. **pwd**：显示当前目录路径。
3. **open**：直接打开当前文件夹，这个命令在linux中用的不多，但是我在mac中用的比较多，当我在idea中的时候，想要打开当前目录的文件夹，我就会Terminal中使用open命令。这个命令会通过文件管理器打开当前目录。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/5378072/1702090447547-f92bb300-a1be-4ce3-8412-fd9393328824.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_35%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

1. **mkdir**：创建新目录。
2. **rmdir**：删除空目录。
3. **rm**：删除文件或目录。
4. **cp**：复制文件或目录。
5. **mv**：移动或重命名文件或目录。
6. **touch**：创建空文件或更新文件时间戳。
7. **find**：搜索文件和目录。find非常好用，介绍下我常见的用法：

```text
// 在当前目录及其子目录中查找名为filename.txt的文件：
find . -name filename.txt
//查找所有目录
find . -type d
//查找所有普通文件
find . -type f
//查找大于10MB的文件
find . -size +10M
//查找修改时间在过去7天内的.log文件
find . -name "*.log" -mtime -7
```

### 日志查看

日志查看是一个非常高频的命令，我常用的日志查看命令有以下这些：

1. **vi/vim：**
2. **cat**：查看文件内容。用于查看较小的文本文件
3. **more** / **less**：分页查看文件内容。less可以翻页，more不能翻页。查看较大的文本文件。
4. **tail**：查看文件末尾内容，通常用来实时监视日志文件的新增内容：

```text
tail -f application.log
//只滚动输出ERROR的日志
tail -f application.log |grep ERROR
```

1. **head**：查看文件开始部分的内容。用于快速查看文件的开头部分。
2. **grep**：搜索文件中的文本行，并显示匹配的行。通常用来查找包含特定关键词的日志条目。

```text
//查询日志中有ERROR的行
grep "ERROR" application.log
//查询日志中有ERROR和Biz的行
grep "ERROR" application.log | grep "Biz"
```

### 网络和通信

1. **ping**：检测网络到另一台主机的连接。
2. **curl** / **wget**：从网络上下载文件。
3. **netstat**：显示网络连接、路由表、接口统计等信息。
4. **ssh**：安全远程登录。
5. **scp**：通过SSH复制远程文件。
6. **telnet：**主要被用于创建到远程主机的终端会话，或者测试远程主机上特定端口的可达性和服务的响应性。（我之所以这个命令用的多，是因为我们自己的web容器会在本地起一个端口记录我们的应用提供了哪些RPC服务和暴露了哪些RPC服务，所以有时候检查服务的时候需要用到它。）
7. **ifconfig**：查看和更改网络接口的配置，例如IP地址、子网掩码和广播地址。有的时候我们需要做远程debug，需要知道远程机器的ip地址，就可以通过这个命令来查看。

![image.png](https://cdn.nlark.com/yuque/0/2023/png/5378072/1702091439959-72c489fc-cc5f-433e-bb73-54b6142eb70c.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_33%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

### 压缩与解压

1. **tar**：压缩和解压tar文件。
2. **gzip** / **gunzip**：压缩和解压gzip文件。
3. **zip** / **unzip**：压缩和解压zip文件。

### 包管理

1. **apt-get**（Debian系）、**yum**（RedHat系）：软件包的安装、更新和管理（根据你的Linux发行版而定）。

### Git&Maven

1. **git**：版本控制工具，常用于代码管理。

```text
git add
git fetch
git commit
git pull
git push
git checkout
git merge
```

1. **maven：**包管理，仲裁管理

```text
//删除之前构建生成的所有文件（例如，target目录下的文件）
mvn clean
//将最终的包（如JAR、WAR等）部署到配置的远程仓库
mvn deploy
//先清理项目，然后执行构建并安装到本地仓库，同时跳过测试。
mvn clean install -Dmaven.test.skip=true
//-U参数会强制Maven更新依赖，即检查远程仓库中是否有更新的snapshot版本，并下载更新。
mvn clean install -Dmaven.test.skip=true -U
//生成项目依赖树，并将输出重定向到名为tree的文件
mvn dependency:tree > tree
```

### 系统监控和性能分析

1. **vmstat**：显示虚拟内存统计信息。
2. **iostat**：显示CPU和输入/输出统计信息。
3. **dmesg**：显示内核相关的日志信息。

掌握这些基本命令可以帮助你更高效地管理和维护Linux环境，对于Java Web开发来说尤其重要。随着经验的积累，你可能还会需要学习更多高级命令和脚本来处理复杂的任务。
