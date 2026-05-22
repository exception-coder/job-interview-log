# -*- coding: utf-8 -*-
"""Convert 1356 java8gu JSON files (Lake HTML content) into categorized Markdown."""
import json
import os
import re
import sys
from html import unescape
from html.parser import HTMLParser
from urllib.parse import unquote

SRC = r"D:\Users\zhangkai\Downloads\2026-05-22_07-06-02_java8gu_f72014df\2026-05-22_07-06-02_java8gu_f72014df"
DST = r"D:\Users\zhangkai\Downloads\2026-05-22_07-06-02_java8gu_f72014df\_markdown"

# -----------------------------
# 1) Discard rules
# -----------------------------
DISCARD_PATTERNS = [
    re.compile(r"^更新Timeline_"),
    re.compile(r"^🔥+更新Timeline_"),
    re.compile(r"^AI课优惠券$"),
    re.compile(r"^新增面试题$"),
    re.compile(r"^新增面经$"),
    re.compile(r"^❗+必读❗+$"),
    re.compile(r"^To读者&交流群$"),
    re.compile(r"^🧣+项目实战课介绍.*"),
    re.compile(r"^💯+我该看哪些东西"),
    re.compile(r"^2023网易技术分享$"),
    re.compile(r"^简历模板——"),
    re.compile(r"^✅简历模板——"),
    re.compile(r"^阿里的简历多久可以投递"),
]

def should_discard(title: str) -> bool:
    t = title.strip()
    return any(p.search(t) for p in DISCARD_PATTERNS)

# -----------------------------
# 2) Classification rules (ordered by priority)
# -----------------------------
RULES = [
    # 面经与项目分享
    (re.compile(r"(面经|\d+面$|一面$|二面$|三面$|hr面$|HR面$|面试流程$|项目实战课)"), "22_面经与项目分享"),
    (re.compile(r"^✅?\d+年(经验|后端)|^✅?\d+届[，,]|^✅?工作\d+年|^✅?\d+本[，,]|^✅?最强应届生"), "22_面经与项目分享"),
    (re.compile(r"^✅?(24届|25届|26届|27届|22年毕业|23年毕业|2年985硕|985应届生|大模型应用开发[，,]RAG)"), "22_面经与项目分享"),
    (re.compile(r"^✅?简历自查$|^✅?简历指导$"), "22_面经与项目分享"),
    (re.compile(r"大厂程序员能力模型|你的项目有哪些难点|交易主链路提供风控决策"), "22_面经与项目分享"),

    # 软技能与面试准备
    (re.compile(r"反问|离职原因|加班|成就感|未来发展|最近在学|项目介绍如何准备|最近在看什么书|你有什么缺点|对自己的评价|团队合作中解决冲突|阿里巴巴面试流程|字节跳动面试流程|腾讯面试流程|面试前必须|大厂对学历"), "23_软技能与面试准备"),
    (re.compile(r"^✅?CodeReview都会关注"), "23_软技能与面试准备"),

    # AI 与大模型
    (re.compile(r"(AI Agent|Agent Skill|Skill的|什么是Skill|MCP$|什么是MCP|Skill和MCP|A2A|大模型|向量数据库|RAG|Vibe Coding|氛围编程|Cursor|Claude Code|SpringAI|Spring AI|DeepSeek|Function Calling|Prompt工程|Harness工程|Context工程|ReAct|微调|你平时用过哪些AI|集成大模型|对接大模型|advisor|ChatModel|ChatClient)"), "18_AI与大模型"),

    # 性能调优与故障排查 (problem investigation scenarios)
    (re.compile(r"(OOM问题排查|FullGC问题排查|频繁FullGC|CPU飙高|RT飙高|Load飙高|数据倾斜导致的频繁|挖矿木马|端口冲突|磁盘满|连接池满|RocketMQ消费堆积|Sort aborted|POI导致内存|回表导致慢|日志打印导致CPU|索引失效的问题是如何排查|索引失效的问题如何排查|慢SQL问题排查|慢SQL.*问题排查|数据库死锁问题排查|数据库CPU被打满|线上接口如果响应很慢如何去排查|服务器突然 ?ssh|应用启动后前几分钟)"), "16_性能调优与故障排查"),
    (re.compile(r"(服务器有多个节点.*用户进入缓慢|压测600|内存泄漏|StackOverflow|应用占用内存持续增长|进程突然挂了|RT在什么范围内|网络问题|如何排查网络)"), "16_性能调优与故障排查"),

    # 业务场景题
    (re.compile(r"(秒杀|订单到期关闭|订单号|订单重复|订单生成|抢红包|敏感词过滤|附近的人|短链服务|短链地址|登录拉黑|登录锁定|百万级会员|点赞系统|点赞功能|朋友圈点赞|百万级排行榜|排行榜|抢[到]?优惠券|有100个优惠券|购物车|库存秒杀|库存系统|库存扣减|库存.*超卖|超卖|超花|外卖系统|酒店价格|敏感词|订单系统|实现一个支付|防止接口被恶意|防止用户重复点击|防止订单重复提交|12306|订单超时关闭|订单关闭|支付单|关单|实现一个抢|赛马|实现一个RPC框架|实现消息队列|让你设计.*消息队列|让你设计一个订单号|让你实现|让你设计一个秒杀|让你设计.*分库分表|要存IP地址|存储这些号码|手机号码.*骚扰电话|实现.*登录|实现.*查找附近|商品预约|存储一亿|存储1亿|亿级商品|百万级数据从Excel导入|百万级数据导入|Excel导入到数据库|批量插入实现百万级|账户里面只有十块钱|银行系统.*实时性|实现.*抢|快到期的会员|网络高效的商品|发送到RabbitMQ|不超花|实现一个抢)"), "15_业务场景题"),
    (re.compile(r"(预约|预热.*数据接口|多渠道同时支付|11:00超时关闭|11:00也支付成功|跨境电商|车企区块链|分布式项目，实时数据分析|实时数据分析功能|风控决策|抢红包功能|订单设计|抢券|超时关闭|超时.*订单)"), "15_业务场景题"),

    # 分库分表
    (re.compile(r"(分库分表|分库|分表|分片|ShardingJDBC|基因法|二次分表|分表字段|分表算法|分表后|分库后|大型电商的订单系统|分库.*多少个|分表.*多少|分表.*分页查询|跨库join|跨库.*join)"), "11_分库分表"),

    # 分布式锁与 ID
    (re.compile(r"(分布式锁|Redisson|RedLock|watchdog|setnx|SETNX|Redis分布式锁|ZK分布式锁|一锁二)"), "10_分布式锁与ID"),
    (re.compile(r"(分布式ID|雪花算法|UUID|号段|Leaf生成|订单号生成|全局.*ID|分布式命名|分布式.*ID|主键.*自增|自增主键|时钟回拨)"), "10_分布式锁与ID"),

    # 分布式事务
    (re.compile(r"(TCC|Seata|2PC|3PC|2阶段提交|两阶段提交|三阶段提交|本地消息表|事务消息|最大努力通知|分布式事务|柔性事务|事务的2阶段)"), "09_分布式事务"),

    # 任务调度 (XXL-JOB vs @Scheduled etc — must come before Spring so XXL-JOB-related titles aren't grabbed by Spring)
    (re.compile(r"(XXL-JOB|xxl-job|PowerJob|Quartz|^✅?定时任务|扫表|^✅?Timer|时间轮|Spring Task|MapReduce动态分片|@Scheduled.*分片|@Scheduled.*集群)"), "20_任务调度"),

    # Spring 体系 (must come BEFORE MySQL/Redis/MQ — Spring titles often contain English short words that those rules would steal)
    (re.compile(r"(Spring|SpringBoot|SpringMVC|@Transactional|@Async|@Scheduled|@Autowired|@Resource|@Lazy|@PostConstruct|@Service|@Component|IOC|AOP|^✅?Bean|循环依赖|^✅?starter|自定义.*starter|bootstrap\.yml|application\.yml|FactoryBean|BeanFactory|事务传播|事务事件|事务失效|三级缓存|^✅?MVC$|^✅?MVC和|^✅?MVC模式|^✅?Servlet)"), "04_Spring体系"),

    # 消息队列
    (re.compile(r"(Kafka|RocketMQ|RabbitMQ|ActiveMQ|消息队列|MQ出现消息|MQ的重平衡|消息.*(丢|重复|顺序|堆积|分发)|延迟队列|死信队列|顺序消息|事务消息|延时消息|事件驱动)"), "07_消息队列"),

    # Redis
    (re.compile(r"(Redis|Redisson|Lua|ZSet|Zset|SkipList|SDS|ZipList|ListPack|缓存(击穿|穿透|雪崩|一致性)|热Key|大Key|布隆过滤器|布谷鸟|setnx|setex|RDB|AOF|Redis Cluster|Redis集群|Pipeline|Memcached|延迟双删|缓存预热|本地缓存|多级缓存|GEO)"), "06_Redis"),

    # MySQL — short English keywords (in/exists/union/drop/delete/count) removed; they false-match prose like "Spring"
    (re.compile(r"(MySQL|InnoDB|MyISAM|B\+树|B-树|索引|MVCC|ReadView|隔离级别|binlog|redolog|undolog|buffer pool|^✅?主从|^✅?SQL|^✅?数据库|^✅?limit|order by|^✅?join|回表|跳页|执行计划|Oracle|PL/SQL|聚簇索引|二级索引|前缀索引|索引覆盖|索引下推|索引合并|索引跳跃|最左前缀|Innodb|预编译|外键|位图索引|函数索引|反向键|count\(|脏读|不可重复读|幻读|当前读|快照读|意向锁|字典锁|存储过程|^✅?视图|^✅?数据库范式|^✅?BLOB|emoji.*存储|Hash Join|RR.*RC|^✅?on和where|^✅?truncate|^✅?delete|^✅?drop|like.*模糊|like|^✅?Innodb|^✅?新生代和老年代的GC|执行计划|主键索引|唯一索引|联合索引|Mybatis|InnoDB的|InnoDB中|MySQL.*存储|MySQL.*函数|MySQL.*主键|MySQL.*的|union)"), "05_MySQL"),
    (re.compile(r"(数据库的锁升级|数据库乐观锁|数据库范式|数据库连接池满|数据库.*存储引擎|数据库.*一致性|表中只有.*字段|读写分离|读写分离遇到|存储碎片|on和where|数据库逻辑删除|数据库加密|数据库扫表|数据库怎么做|数据库怎样|数据库死锁|数据库主键|数据库锁|大事务|长事务|数据归档|大表.*查询|大表中如何|OnlineDDL|insertOrUpdate|MyBatis.*分页|RowBounds|^✅?主键|^✅?自增|select\s|表.*用户和时间|表.*建立索引|select.*from|MySQL如何|MySQL的|MySQL中)"), "05_MySQL"),

    # ES / Zookeeper / Nacos / MyBatis / Netty / Tomcat -> 12_其他中间件
    (re.compile(r"(Elasticsearch|^✅?ES |ES支持|ES不支持|ES的|ES为什么|ElasticSearch|倒排索引|ILM|Hot-Warm-Cold|索引生命周期管理)"), "12_其他中间件"),
    (re.compile(r"(Zookeeper|ZK的|^✅?watch机制|拜占庭|脑裂)"), "12_其他中间件"),
    (re.compile(r"(Nacos|Eureka|配置中心|配置.*客户端可以感知)"), "12_其他中间件"),
    (re.compile(r"(MyBatis|Mybatis|PageHelper|^✅?ORM|^✅?#和\$|MyBatis-Plus|Hibernate)"), "12_其他中间件"),
    (re.compile(r"(Netty)"), "12_其他中间件"),
    (re.compile(r"(Tomcat)"), "12_其他中间件"),

    # 微服务与分布式
    (re.compile(r"(服务雪崩|限流|熔断|降级|滑动窗口限流|漏桶|令牌桶|Hystrix|Sentinel|Gateway|网关|Zuul|Ribbon|LoadBalancer|Feign|OpenFeign|Dubbo|SpringCloud|Spring Cloud|RPC|微服务|链路追踪|服务治理|注册中心|^✅?Service ?Mesh|ServiceMesh|服务发现|服务注册|远程方法|泛化调用)"), "08_微服务与分布式"),

    # POI / Excel
    (re.compile(r"(POI|EasyExcel|SXSSFWorkbook|^✅?Excel|大文件|大Excel)"), "21_Excel与文件处理"),

    # 网络 / OS
    (re.compile(r"(HTTP/?[123]|HTTPS|^✅?TCP|^✅?UDP|^✅?DNS|^✅?OSI|^✅?IPV?[46]|epoll|select.*poll|零拷贝|协程|进程间通信|进程.*线程.*协程|进程和线程|内核态|用户态|^✅?加密|MD5|国密|SM[234]|OAuth|CSRF|XSS|SQL注入|Page Cache|CDN|DDoS|^✅?ping|网络抓包|Linux命令|Linux下|^✅?Docker|K8s|Kubernetes|墙|梯子|对称加密|非对称加密|加签|验签|网络分区|公有云|私有云|混合云|IaaS|PaaS|SaaS|Serverless|云原生|云计算|跨域|越权|撞库|拖库|洗库|中间人|多级缓存(?!.*一致性)|操作系统|页表|分段|分页(?!.*MyBatis)|长连接|短连接|半双工|全双工|Cookie|Session|^✅?Token|cookie|session|路由器|交换机|ARP|RARP|TCP重传|三次握手|四次挥手|流式输出|TCP.*粘包|TCP.*拆包|时间片|字符编码|计算机网络|计算机|浏览器输入|闰秒|国际化|进入电梯|端口冲突)"), "13_网络与操作系统"),
    (re.compile(r"(分布式Session|不相关的网站|GPU|^✅?HTTP|^✅?HTTPS|^✅?CDN|^✅?https?$|登录拉黑功能)"), "13_网络与操作系统"),
    (re.compile(r"(IO模型|IO 模型|IO多路复用|多路复用|^✅?AIO|^✅?BIO|^✅?NIO|同步.*异步.*阻塞)"), "13_网络与操作系统"),

    # 并发编程
    (re.compile(r"(线程池|^✅?Synchronized|^✅?synchronized|^✅?Volatile|^✅?volatile|^✅?CAS|什么是CAS|有了CAS|AQS|ConcurrentHashMap|ThreadLocal|JUC|CompletableFuture|^✅?并发|虚拟线程|ForkJoinPool|可重入锁|公平锁|非公平锁|乐观锁(?!.*悲观锁)|悲观锁|读写锁|MESI|JMM|happens-before|内存屏障|Unsafe|^✅?原子|AtomicLong|LongAdder|无锁化|信号量|Semaphore|CountDownLatch|CyclicBarrier|TransmittableThreadLocal|InheritableThreadLocal|TTL.*线程池|多线程|线程的状态|主线程捕获子线程|父子线程|run/start|wait/sleep|notify|停止.*线程|线程数设定|线程数.*合适|线程出现异常|线程是如何被调度|线程同步|线程.*存活|i\+\+|创建线程|new Thread|while\(true\)|for\(;;\)|线程.*超时|高并发场景|高并发情况|并发调三个|并发编排|奇数.*偶数|顺序打印|交替输出|0-100|1A2B3C|动态线程池|拒绝策略|顺序执行|活锁|死锁|伪共享|总线嗅探|总线风暴|as-if-serial|Java协程|线程安全|fail-safe|fail-fast|^✅?守护线程|^✅?线程|双锁单例|乐观.*悲观)"), "03_并发编程"),

    # JVM
    (re.compile(r"(JVM|类加载|双亲委派|垃圾回收|GC机制|CMS|G1|ZGC|永久代|元空间|AOT|JIT|Java Dump|jstack|jmap|jhat|jps|jstat|javap|Arthas|safe point|safepoint|三色标记|^✅?STW|Stop The World|逃逸分析|安全点|字节码|Class常量池|字符串常量池|运行时常量池|JVM调优|JIT优化|新生代|老年代|YoungGC|FullGC|Eden|Survivor|跨代引用|分代|堆是如何分代|堆.*线程共享|堆和栈|栈溢出|堆溢出|元空间满|Java发生了OOM|JVM 中一次完整的 GC|JVM如何创建|JVM保证|对象分配|对象的结构|对象一定在堆上|对象是否存活|可达性分析|引用计数|强引用|软引用|弱引用|虚引用|VM参数|JVM启动参数|JVM退出|kill -9|哪些语言有GC|^✅?编译和反编译|^✅?Java是编译型还是解释型|^✅?为什么这段代码在JDK不同版本|ClassNotFoundException|NoClassDefFoundError|Class.*同一个类|方法区|GC算法|StackOverflow|OutOfMemory|内存泄漏|内存溢出|^✅?javap|^✅?jstat|^✅?jmap|^✅?jstack|^✅?jps)"), "02_JVM"),

    # 工具与工程
    (re.compile(r"(Maven|^✅?Git|GitLab|Docker|Kubernetes|IDEA|单元测试|Mock怎么做|jar包和war|jar 包|war 包|fat jar|DevOps|CI/CD|灰度发布|蓝绿|金丝雀|JDBC.*单元测试|集成测试|项目组长.*规范|阿里巴巴.*Java开发手册|你平常用哪些idea|你认为Cursor|你平时用过哪些AI Coding|你掌握哪些Linux|你平常是怎么查看日志|你平时是怎么做单元测试|IDEA如何做远程Debug|对多线程进行Debug|Lombok|无状态.*Serverless|代码评审|代码规范)"), "19_工具与工程"),

    # 系统设计与高并发
    (re.compile(r"(CAP|BASE|一致性哈希|高可用|高并发|SLA|P99|P95|P90|p99|p95|p90|^✅?压测|异地多活|^✅?读写分离|单元化|架构设计|^✅?分布式系统|^✅?分布式架构|^✅?单体架构|^✅?微服务架构|架构师|什么是分布式|什么样的架构|架构是设计|什么是技术债务|什么是银弹|康威定律|分布式BASE|分布式CAP|微服务的循环依赖|微服务的拆分|分布式和微服务|SOA和微服务|拜占庭|^✅?分布式一致性|^✅?分布式数据库|^✅?分布式$|^✅?集群|做架构|^✅?QPS|^✅?RT|预估.*QPS|预估.*机器|3000QPS|^✅?接口性能|服务端接口性能)"), "14_系统设计与高并发"),

    # 数据结构与算法
    (re.compile(r"(^✅?堆\?$|^✅?什么是堆|前缀树|^✅?布隆|布谷鸟|^✅?跳表|^✅?时间轮|^✅?位图|^✅?BitMap|^✅?图\?|^✅?什么是图|有向图|无向图|二叉树|^✅?红黑树|^✅?树\?$|^✅?什么是树|栈和队列|^✅?队列|^✅?栈\?|链表|^✅?数组|^✅?排序|海量数据.*K|TOP K|topk|查找电话号码|搜索量最高|搜索日志|^✅?40亿|^✅?5亿|限制1G内存|100M内存下|1TB|1 TB|N个整数|二叉搜索树|栈实现|队列实现|^✅?数组和链表|^✅?LRU|^✅?LFU|缓存失效算法|过滤黑名单|过滤.*网址|质数|斐波那契|找出.*整数|两个元素.*差最小|猴子.*桃子|乒乓球盒子|7g和2g|约定.*生男孩|1000瓶药水|8个球|水桶.*4升|位运算|按位与|分页查询|分页.*MySQL|MySQL.*分页)"), "17_数据结构与算法"),

    # Java 基础 (fallback)
    (re.compile(r"(Java|String|StringBuilder|StringBuffer|HashMap|ArrayList|LinkedList|Vector|TreeMap|^✅?Set|^✅?Map|^✅?List|集合|泛型|反射|枚举|^✅?注解|Lambda|Stream|^✅?异常|序列化|equals|hashCode|^✅?Object|^✅?final|finally|finalize|^✅?static|设计模式|^✅?代理|^✅?工厂|^✅?单例|^✅?观察者|^✅?责任链|^✅?策略|^✅?模板方法|^✅?SPI|享元|^✅?不可变|^✅?状态模式|^✅?面向对象|面向过程|继承|多态|抽象类|接口和抽象|包装类|基本类型|BigDecimal|^✅?int |Integer|平台无关|^✅?随机|JDK|JDK1|JDK 1|JDK 8|JDK8|JDK 9|JDK9|JDK 11|JDK 17|JDK 21|JDK21|JDK 25|JDK25|^✅?Java|^✅?Class|^✅?Object|Throwable|throws|^✅?javap|^✅?javac|代码复用|可维护性|^✅?MVC|三层架构|DDD|^✅?DO|^✅?DTO|^✅?VO|领域驱动|领域事件|^✅?实体|值对象|聚合|聚合根|充血模型|贫血模型|^✅?Servlet)"), "01_Java基础"),
]

DEFAULT_CATEGORY = "01_Java基础"

def classify(title: str) -> str:
    t = title.strip()
    for pat, cat in RULES:
        if pat.search(t):
            return cat
    return DEFAULT_CATEGORY

# -----------------------------
# 3) Lake HTML -> Markdown
# -----------------------------
class LakeToMd(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []
        self.list_stack = []
        self.a_stack = []
        # bold/italic: stack of marks recording the index in `out` where the open `**` was placed,
        # plus a flag indicating whether content was emitted inside.
        self.bold_stack = []   # list of [out_index_of_open_marker, has_content]
        self.italic_stack = []
        self.code_inline_depth = 0

        self.in_table = False
        self.in_thead = False
        self.table_rows = []
        self.current_row = []
        self.current_cell = []
        self.cell_capture_depth = 0

        self.in_card = 0
        self.in_pre = False

    def _emit(self, s):
        if self.cell_capture_depth > 0:
            self.current_cell.append(s)
        else:
            self.out.append(s)

    def _emit_newline(self):
        if self.cell_capture_depth > 0:
            if self.current_cell and not self.current_cell[-1].endswith(" "):
                self.current_cell.append(" ")
            return
        if not self.out:
            return
        last = self.out[-1]
        if last.endswith("\n\n"):
            return
        if last.endswith("\n"):
            self.out.append("\n")
        else:
            self.out.append("\n")

    def _emit_break(self):
        if self.cell_capture_depth > 0:
            self.current_cell.append("<br>")
            return
        self.out.append("\n")

    def _handle_card(self, attrs):
        name = attrs.get("name", "")
        value = attrs.get("value", "")
        if not value.startswith("data:"):
            return
        raw = value[5:]
        try:
            decoded = unquote(raw)
            data = json.loads(decoded)
        except Exception:
            return

        if name == "image":
            src = data.get("src", "")
            alt = (data.get("name") or data.get("title") or "").replace("\n", " ")
            if src:
                self._emit_newline(); self._emit_newline()
                self._emit("![{}]({})".format(alt, src))
                self._emit_newline()
            return

        if name == "yuque":
            detail = data.get("detail") or {}
            title = (detail.get("title") or data.get("title") or "").strip()
            url = detail.get("url") or data.get("url") or data.get("src") or ""
            if url:
                self._emit_newline()
                self._emit("> 📎 相关：[{}]({})".format(title or url, url))
                self._emit_newline()
            return

        if name == "codeblock":
            code = data.get("code", "")
            mode = (data.get("mode") or "text").strip().lower()
            if mode == "plain":
                mode = "text"
            if self.cell_capture_depth > 0:
                cleaned = code.replace("\n", " ").strip()
                self._emit("`{}`".format(cleaned))
                return
            self._emit_newline(); self._emit_newline()
            self._emit("```{}\n{}\n```".format(mode, code))
            self._emit_newline()
            return

        if name in ("video", "file", "bookmark", "link"):
            src = data.get("src") or data.get("url", "")
            title = data.get("title") or data.get("name") or "附件"
            if src:
                self._emit_newline()
                self._emit("📎 [{}]({})".format(title, src))
                self._emit_newline()
            return

        title = (data.get("title") or "").strip()
        url = data.get("url") or data.get("src") or ""
        if url and title:
            self._emit_newline()
            self._emit("[{}]({})".format(title, url))
            self._emit_newline()

    def handle_starttag(self, tag, attrs):
        if tag == "meta":
            return
        a = dict(attrs)

        if tag == "card":
            self._handle_card(a)
            self.in_card += 1
            return

        if tag == "br":
            self._emit_break()
            return

        if tag == "img":
            src = a.get("src", "")
            alt = a.get("alt", "")
            if src:
                self._emit("![{}]({})".format(alt, src))
            return

        if tag == "p":
            if self.cell_capture_depth > 0:
                if self.current_cell and not self.current_cell[-1].endswith("<br>"):
                    self.current_cell.append("<br>")
            else:
                self._emit_newline(); self._emit_newline()
            return

        if tag in ("strong", "b"):
            # record the open-marker index inside the appropriate buffer
            if self.cell_capture_depth > 0:
                self.current_cell.append("**")
                idx = len(self.current_cell) - 1
                self.bold_stack.append([idx, False, True])  # True = in_cell
            else:
                self.out.append("**")
                idx = len(self.out) - 1
                self.bold_stack.append([idx, False, False])
            return
        if tag in ("em", "i"):
            if self.cell_capture_depth > 0:
                self.current_cell.append("*")
                idx = len(self.current_cell) - 1
                self.italic_stack.append([idx, False, True])
            else:
                self.out.append("*")
                idx = len(self.out) - 1
                self.italic_stack.append([idx, False, False])
            return
        if tag == "code":
            self._emit("`")
            self.code_inline_depth += 1
            return

        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._emit_newline(); self._emit_newline()
            level = int(tag[1])
            level = max(2, level + 1) if level == 1 else level
            self._emit("#" * level + " ")
            return

        if tag in ("ul", "ol"):
            self.list_stack.append({"type": tag, "idx": 0})
            self._emit_newline()
            return

        if tag == "li":
            self._emit_newline()
            if self.list_stack:
                ls = self.list_stack[-1]
                indent = "  " * (len(self.list_stack) - 1)
                if ls["type"] == "ol":
                    ls["idx"] += 1
                    self._emit("{}{}. ".format(indent, ls["idx"]))
                else:
                    self._emit("{}- ".format(indent))
            return

        if tag == "a":
            href = a.get("href", "")
            self.a_stack.append(href)
            self._emit("[")
            return

        if tag == "table":
            self.in_table = True
            self.table_rows = []
            self._emit_newline(); self._emit_newline()
            return
        if tag == "thead":
            self.in_thead = True; return
        if tag == "tbody":
            return
        if tag == "tr":
            self.current_row = []
            return
        if tag in ("td", "th"):
            self.current_cell = []
            self.cell_capture_depth += 1
            return

        if tag == "pre":
            self.in_pre = True
            self._emit_newline(); self._emit_newline()
            self._emit("```\n")
            return
        return

    def handle_endtag(self, tag):
        if tag == "card":
            if self.in_card > 0:
                self.in_card -= 1
            return

        if tag in ("strong", "b") and self.bold_stack:
            idx, has_content, in_cell = self.bold_stack.pop()
            if has_content:
                if in_cell:
                    self.current_cell.append("**")
                else:
                    self.out.append("**")
            else:
                # empty <strong></strong> — remove the opening marker
                buf = self.current_cell if in_cell else self.out
                if idx < len(buf) and buf[idx] == "**":
                    buf.pop(idx)
                    # also adjust any later bold stack entries' indices
                    for entry in self.bold_stack + self.italic_stack:
                        if entry[2] == in_cell and entry[0] > idx:
                            entry[0] -= 1
            return
        if tag in ("em", "i") and self.italic_stack:
            idx, has_content, in_cell = self.italic_stack.pop()
            if has_content:
                if in_cell:
                    self.current_cell.append("*")
                else:
                    self.out.append("*")
            else:
                buf = self.current_cell if in_cell else self.out
                if idx < len(buf) and buf[idx] == "*":
                    buf.pop(idx)
                    for entry in self.bold_stack + self.italic_stack:
                        if entry[2] == in_cell and entry[0] > idx:
                            entry[0] -= 1
            return
        if tag == "code" and self.code_inline_depth > 0:
            self._emit("`")
            self.code_inline_depth -= 1
            return

        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self._emit_newline(); self._emit_newline()
            return

        if tag in ("ul", "ol"):
            if self.list_stack:
                self.list_stack.pop()
            self._emit_newline()
            return

        if tag == "p":
            if self.cell_capture_depth > 0:
                if self.current_cell and not self.current_cell[-1].endswith("<br>"):
                    self.current_cell.append("<br>")
            else:
                self._emit_newline()
            return

        if tag == "a" and self.a_stack:
            href = self.a_stack.pop()
            self._emit("]({})".format(href))
            return

        if tag == "table":
            self.in_table = False
            self._render_table()
            return
        if tag == "thead":
            self.in_thead = False; return

        if tag == "tr":
            self.table_rows.append({"cells": self.current_row, "thead": self.in_thead})
            return

        if tag in ("td", "th"):
            cell_text = "".join(self.current_cell)
            cell_text = re.sub(r"(\s*<br>\s*)+", "<br>", cell_text)
            cell_text = cell_text.strip()
            while cell_text.startswith("<br>"):
                cell_text = cell_text[4:].strip()
            while cell_text.endswith("<br>"):
                cell_text = cell_text[:-4].strip()
            cell_text = cell_text.replace("|", "\\|").replace("\n", " ")
            cell_text = re.sub(r"\s+", " ", cell_text)
            self.current_row.append(cell_text)
            self.cell_capture_depth -= 1
            return

        if tag == "pre":
            self.in_pre = False
            self._emit_newline()
            self._emit("```")
            self._emit_newline()
            return
        return

    def handle_data(self, data):
        if self.in_card > 0:
            return
        if not data:
            return
        data = data.replace("​", "").replace("﻿", "")
        data = data.replace("\xa0", " ")
        if self.in_pre:
            self._emit(data)
            # pre is a content carrier — mark current bold/italic as having content
            for entry in self.bold_stack + self.italic_stack:
                entry[1] = True
            return
        if not data.strip():
            return
        self._emit(data)
        # mark all open bold/italic as having content
        for entry in self.bold_stack + self.italic_stack:
            entry[1] = True

    def _render_table(self):
        if not self.table_rows:
            return
        rows = self.table_rows
        if any(r["thead"] for r in rows):
            header_rows = [r for r in rows if r["thead"]]
            body_rows = [r for r in rows if not r["thead"]]
            header = header_rows[0]["cells"] if header_rows else []
        else:
            header = rows[0]["cells"]
            body_rows = [{"cells": r["cells"]} for r in rows[1:]]

        if not header:
            return
        col_count = max([len(header)] + [len(b["cells"]) for b in body_rows] + [1])
        def pad(row):
            return (row + [""] * col_count)[:col_count]
        header = pad(header)
        body = [pad(b["cells"]) for b in body_rows]
        self._emit("| " + " | ".join(header) + " |\n")
        self._emit("|" + "|".join(["---"] * col_count) + "|\n")
        for b in body:
            self._emit("| " + " | ".join(b) + " |\n")
        self._emit("\n")

    def get_markdown(self):
        text = "".join(self.out)
        text = re.sub(r"[ \t]+\n", "\n", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        text = text.strip() + "\n"
        return text


def lake_html_to_md(html_str):
    parser = LakeToMd()
    try:
        parser.feed(html_str)
        parser.close()
    except Exception as e:
        return "<!-- parse error: {} -->\n\n".format(e)
    return parser.get_markdown()


# -----------------------------
# 4) Filename sanitization
# -----------------------------
EMOJI_PREFIX_RE = re.compile(r"^[✅\U0001F525\U0001F4AF\U0001F9E3❗\U0001F48E\U0001F4CC⭐\U0001F31F\U0001F3AF\U0001F381\U0001F680]+")
EMOJI_ANY_RE = re.compile(
    "[" "\U0001F300-\U0001FAFF" "\U00002600-\U000027BF" "\U0001F1E6-\U0001F1FF" "✀-➿" "]+",
    re.UNICODE,
)
FORBIDDEN_FN = re.compile(r'[\\/:*?"<>|\r\n\t]')

def slugify(title):
    s = EMOJI_PREFIX_RE.sub("", title).strip()
    s = EMOJI_ANY_RE.sub("", s)
    s = FORBIDDEN_FN.sub("_", s)
    s = s.replace("。", "_").replace("，", "_").replace("、", "_").replace(" ", "_")
    s = s.replace("（", "_").replace("）", "_").replace("【", "_").replace("】", "_")
    s = s.replace("？", "").replace("！", "")
    s = re.sub(r"_+", "_", s).strip("_.")
    if len(s) > 80:
        s = s[:80].rstrip("_")
    if not s:
        s = "untitled"
    return s


# -----------------------------
# 5) Main
# -----------------------------
def main():
    if not os.path.isdir(SRC):
        print("SRC not found: {}".format(SRC), file=sys.stderr)
        return 1
    os.makedirs(DST, exist_ok=True)

    categories = {}
    discarded = []
    total = 0
    used_names = set()

    files = sorted(f for f in os.listdir(SRC) if f.endswith(".json") and f != "_meta.json")
    for fn in files:
        total += 1
        path = os.path.join(SRC, fn)
        try:
            d = json.load(open(path, "r", encoding="utf-8"))
        except Exception as e:
            print("ERROR reading {}: {}".format(fn, e), file=sys.stderr)
            continue
        title = (d.get("title") or "").strip()
        content = d.get("content") or ""
        qid = os.path.splitext(fn)[0]

        if not title or should_discard(title):
            discarded.append((qid, title))
            continue

        cat = classify(title)
        cat_dir = os.path.join(DST, cat)
        os.makedirs(cat_dir, exist_ok=True)

        md_body = lake_html_to_md(content)
        slug = slugify(title)
        out_name = "{}_{}.md".format(qid, slug)
        out_path = os.path.join(cat_dir, out_name)

        header = (
            "# {}\n\n"
            "> 题号：{} ｜ 分类：{}\n\n"
            "---\n\n"
        ).format(title, qid, cat)

        try:
            with open(out_path, "w", encoding="utf-8") as fp:
                fp.write(header + md_body)
        except Exception as e:
            print("ERROR writing {}: {}".format(out_path, e), file=sys.stderr)
            continue

        categories.setdefault(cat, []).append((qid, title, out_name))

    for cat, items in categories.items():
        items.sort(key=lambda x: x[0])
        readme = os.path.join(DST, cat, "README.md")
        with open(readme, "w", encoding="utf-8") as fp:
            fp.write("# {}\n\n共 {} 题。\n\n".format(cat, len(items)))
            fp.write("| 题号 | 标题 | 文件 |\n|---|---|---|\n")
            for qid, title, rel in items:
                safe_title = title.replace("|", "\\|")
                fp.write("| {} | {} | [{}]({}) |\n".format(qid, safe_title, rel, rel))

    cats_sorted = sorted(categories.keys())
    with open(os.path.join(DST, "INDEX.md"), "w", encoding="utf-8") as fp:
        fp.write("# Java 八股面试题知识库\n\n")
        fp.write("共收录 **{}** 道题，分为 **{}** 个一级分类。\n\n".format(
            sum(len(v) for v in categories.values()), len(categories)))
        fp.write("## 分类导航\n\n")
        fp.write("| 分类 | 题数 | 入口 |\n|---|---|---|\n")
        for c in cats_sorted:
            fp.write("| {} | {} | [{}/README.md]({}/README.md) |\n".format(c, len(categories[c]), c, c))
        fp.write("\n## 全量题目索引\n\n")
        fp.write("| 题号 | 分类 | 标题 |\n|---|---|---|\n")
        all_items = []
        for c, items in categories.items():
            for qid, title, rel in items:
                all_items.append((qid, c, title, rel))
        all_items.sort(key=lambda x: x[0])
        for qid, c, title, rel in all_items:
            safe_title = title.replace("|", "\\|")
            fp.write("| {} | {} | [{}]({}/{}) |\n".format(qid, c, safe_title, c, rel))

    print("Total source files: {}".format(total))
    print("Discarded: {}".format(len(discarded)))
    print("Produced: {}".format(sum(len(v) for v in categories.values())))
    print("Per-category counts:")
    for c in cats_sorted:
        print("  {}: {}".format(c, len(categories[c])))

    return 0


if __name__ == "__main__":
    sys.exit(main())
