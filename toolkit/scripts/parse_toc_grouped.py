#!/usr/bin/env python3
"""
对语雀知识库 toc 的二级菜单按知识点聚类，生成三级菜单结构的 Markdown。

结构：
  ## 一级菜单（原有）
  ### 聚类分组（新增，作为二级菜单）
  - [文章](url)  ← 原二级菜单变为三级

有聚类规则的一级菜单按规则分组；无规则的保持原列表不变。

用法：
    python3 scripts/parse_toc_grouped.py <decoded_json> <output_md>
"""

import json
import re
import sys
from collections import OrderedDict
from pathlib import Path
from typing import Optional

GROUP_RULES: dict[str, list[tuple[str, list[str]]]] = {
    "Java并发": [
        ("线程基础",         ["线程状态", "状态之间", "线程数设定", "创建线程", "守护线程", "上下文切换", "线程安全", "并发", "并行", "run/start", "sleep", "Thread.sleep", "线程调度", "线程存活", "子线程", "线程异常", "进程", "虚拟线程", "操作系统层面", "判断一个线程", "如何被调度", "调度"]),
        ("线程池",           ["线程池", "Executors", "拒绝策略", "ForkJoin", "核心参数", "动态线程池", "顺序执行任务"]),
        ("synchronized",    ["synchronized", "sychronized", "偏向锁", "锁升级", "锁优化", "重量级锁", "锁降级"]),
        ("volatile & JMM",  ["volatile", "JMM", "Java内存模型", "happens-before", "as-if-serial", "内存屏障", "总线嗅探", "总线风暴", "MESI"]),
        ("原子性",           ["原子", "原子性", "int a = 1", "i++"]),
        ("Lock & AQS",      ["AQS", "ReentrantLock", "reentrantLock", "公平锁", "非公平锁", "可重入锁", "独占模式", "共享模式", "同步队列", "条件队列", "双向链表", "等待和唤醒"]),
        ("CAS & Unsafe",    ["CAS", "Unsafe", "AtomicLong", "LongAdder", "自旋", "无锁"]),
        ("并发工具类",       ["CountDownLatch", "CyclicBarrier", "Semaphore", "CompletableFuture", "JUC", "异步编程", "编排", "顺序打印", "T1,T2,T3", "父子线程", "传递数据", "Timer", "定时调度"]),
        ("ThreadLocal",     ["ThreadLocal", "InheritableThreadLocal", "TransmittableThreadLocal", "ScopedValue", "内存泄漏"]),
        ("死锁 & 活锁",     ["死锁", "活锁", "伪共享"]),
        ("锁分类综述",       ["锁", "线程同步"]),
    ],
    "JVM": [
        ("平台无关 & 编译",  ["平台无关", "编译", "反编译", "JIT", "解释型", "编译型", "字节码"]),
        ("内存区域",         ["内存区域", "运行时", "方法区", "直接内存", "堆和栈", "堆外内存", "堆一定", "虚拟机中的堆", "字符串常量池", "safe point", "一个Java进程", "JVM退出", "OutOfMemory", "StackOverflow"]),
        ("GC 垃圾回收",      ["GC", "垃圾回收", "垃圾收集", "回收算法", "CMS", "G1", "ZGC", "STW", "Stop The World", "三色标记", "并发回收", "并行回收", "引用", "finalize", "Full GC", "Young GC", "Minor GC", "分代", "Eden", "Survivor"]),
        ("OOM & 调优",      ["OOM", "内存溢出", "调优", "参数", "kill", "溢出", "永久代", "元空间", "废弃永久代"]),
        ("对象 & 内存",      ["对象", "实例", "逃逸", "指针压缩", "对象头", "new"]),
        ("类加载器",         ["类加载", "ClassLoader", "双亲委派", "类的生命周期", "类什么时候", "同一个类"]),
    ],
    "MySQL": [
        ("基础 & 存储引擎",  ["范式", "char", "varchar", "数据类型", "存储引擎", "InnoDB", "MyISAM", "MySQL 5", "MySQL 8", "NOSQL", "关系型", "硬盘", "emoji", "存储过程", "外键", "OnlineDDL", "join"]),
        ("索引",             ["索引", "B+树", "B树", "覆盖索引", "回表", "最左前缀", "联合索引", "全文索引", "失效", "下推"]),
        ("事务 & MVCC",     ["事务", "ACID", "隔离级别", "幻读", "脏读", "MVCC", "快照读", "当前读", "RC", "RR", "ReadView", "undolog", "undo log"]),
        ("锁",               ["死锁", "行锁", "表锁", "间隙锁", "next-key", "意向锁", "锁"]),
        ("SQL & 执行计划",   ["explain", "慢查询", "执行计划", "查询优化", "order by", "count(", "limit", "select *", "exists", "on和where", "truncate", "delete", "drop", "执行顺序", "执行过程", "SQL调优", "慢SQL", "PK", "UK", "CK", "FK", "驱动表", "小表驱动", "深度分页", "filesort", "耗时", "SQL语句", "insertOrUpdate", "大规模"]),
        ("主键 & 自增",      ["主键", "uuid", "自增"]),
        ("Buffer Pool & 底层", ["buffer pool", "Buffer Pool", "加密", "解密", "模糊查询", "秒杀", "扫表", "死循环", "阿里", "AP", "CP", "内存碎片", "碎片", "BLOB", "TEXT", "热点数据", "行转列", "列转行"]),
        ("日志 & 主从复制",  ["主从", "复制", "binlog", "redo log", "日志", "高可用", "集群", "100%不丢", "写入顺序", "log的写入"]),
    ],
    "Redis": [
        ("数据结构",         ["数据结构", "数据类型", "SDS", "GEO", "Stream", "跳表", "压缩列表", "ziplist", "listpack", "Zset", "ZSet", "zset", "setnx", "setex", "rehash", "hash结构", "范围查询", "权重值"]),
        ("持久化",           ["持久化", "RDB", "AOF", "快照", "数据不丢失", "完全保证"]),
        ("集群 & 高可用",    ["集群", "哨兵", "主从", "Sentinel", "分片", "槽", "AP", "CP", "遍历所有key"]),
        ("缓存问题",         ["缓存穿透", "缓存击穿", "缓存雪崩", "热Key", "热key", "大key", "缓存一致性", "双写", "延迟双删", "数据库和缓存", "一致性问题"]),
        ("Redisson",        ["Redisson", "watchdog", "续期", "误删", "可重入", "加锁", "解锁"]),
        ("分布式锁",         ["分布式锁", "分布锁", "Redlock", "Lua", "乐观锁"]),
        ("高级功能",         ["延迟消息", "延迟队列", "发布/订阅", "限流", "滑动窗口", "事务", "回滚", "Best Practice", "Key和Value", "8.0", "还能用来", "Jedis", "Memcached"]),
        ("性能 & 通信",      ["快", "单线程", "多线程", "IO", "协议", "RESP", "pipeline"]),
        ("内存 & 淘汰",      ["内存", "淘汰", "过期", "TTL", "LRU", "LFU"]),
    ],
    "Spring": [
        ("IOC & 依赖注入",   ["IOC", "依赖注入", "DI", "字段注入", "构造器", "循环依赖", "三级缓存", "Autowired", "Resource", "Map上"]),
        ("Bean 注解 & 扩展", ["Bean", "生命周期", "初始化", "PostConstruct", "afterProperties", "容器", "@Service", "@Component", "@Repository", "shutdownhook", "缓存预热", "多环境", "@Async", "Event", "事件驱动", "设计模式", "常见的使用方式"]),
        ("AOP & 代理",      ["AOP", "切面", "代理", "CGLIB", "JDK动态代理"]),
        ("事务",             ["事务", "Transactional", "传播"]),
        ("SpringMVC",       ["MVC", "DispatcherServlet", "Controller", "请求", "过滤器", "拦截器"]),
        ("SpringBoot",      ["SpringBoot", "自动装配", "starter", "条件注解", "Actuator"]),
        ("定时任务 & 重试",  ["Scheduled", "Spring Task", "XXL-JOB", "Retryable", "重试"]),
        ("新特性",           ["Spring 7", "Spring Boot 4", "新特性"]),
    ],
    "SpringCloud": [
        ("概览 & 对比",      ["什么是SpringCloud", "SpringCloud和Dubbo", "Spring6.0", "SOA", "微服务", "组件"]),
        ("网关",             ["Zuul", "Gateway", "Nginx", "网关"]),
        ("负载均衡",         ["Ribbon", "LoadBalancer", "负载均衡"]),
        ("服务调用",         ["Feign", "OpenFeign", "RestTemplate", "服务间的通信", "超时", "日志", "异常", "Dubbo和Feign", "第一次调用", "调用慢", "不支持了"]),
        ("熔断 & 限流",      ["Hystrix", "Sentinel", "熔断", "隔离策略", "熔断器"]),
        ("注册中心",         ["Eureka", "Zookeeper", "注册", "服务发现", "缓存机制", "自我保护", "Spring Boot 3.x", "替代"]),
        ("配置",             ["application.yml", "bootstrap.yml", "配置", "区别"]),
    ],
    "Java基础": [
        ("面向对象",         ["面向对象", "面向过程", "多继承", "接口", "抽象类", "多态", "封装", "继承", "重载", "重写", "Java和C"]),
        ("基本类型 & 包装类", ["基本类型", "包装类", "自动装箱", "拆箱", "Integer", "浮点数", "金额", "BigDecimal", "负数取绝对值", "char能存", "while(true)", "for(;;)"]),
        ("String & 编码",   ["String", "字符串", "StringBuilder", "StringBuffer", "字符编码", "编码", "UUID", "uuid"]),
        ("异常",             ["异常", "Exception", "Error", "try", "catch", "finally"]),
        ("泛型 & 反射",      ["泛型", "类型擦除", "反射", "注解", "动态代理", "SPI", "语法糖"]),
        ("IO & 序列化",      ["IO", "序列化", "NIO", "BIO", "AIO", "流", "深拷贝", "浅拷贝"]),
        ("对象 & 类",        ["创建对象", "hashCode", "equals", "值传递", "引用传递", "枚举", "static", "main方法", "无参构造", "JDK不同版本", "协程"]),
        ("日期 & 工具",      ["SimpleDateFormat", "Arrays.sort", "排序算法", "日期", "时间", "Timer", "定时调度"]),
        ("新特性",           ["Lambda", "Stream", "Optional", "函数式", "Record", "Sealed", "switch", "新特性", "Java 8", "Java8", "Java 11", "Java 17", "Java 21", "最新版本"]),
    ],
}


def load_toc(json_path: str) -> tuple[str, str, list]:
    """读取 JSON，返回 (book_name, namespace, toc列表)。"""
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)
    book = data.get("book", {})
    return book.get("name", ""), book.get("namespace", ""), book.get("toc", [])


def build_menu(toc: list, namespace: str) -> dict[str, dict]:
    """两遍扫描 toc，构建有序的一二级菜单结构。"""
    level1: dict[str, dict] = {}
    for item in toc:
        if item.get("parent_uuid", "") == "" and item.get("visible", 1) == 1:
            level1[item["uuid"]] = {"title": item["title"], "children": []}
    for item in toc:
        parent = item.get("parent_uuid", "")
        if parent and parent in level1 and item.get("visible", 1) == 1:
            url = item.get("url", "")
            full_url = f"https://www.yuque.com/{namespace}/{url}" if url else ""
            level1[parent]["children"].append({"title": item["title"], "url": full_url})
    return level1


def find_group(title: str, rules: list[tuple[str, list[str]]]) -> str:
    """按关键词规则匹配标题所属分组，未命中返回「其他」。"""
    clean = re.sub(r'^[\W]+', '', title)
    for group_name, keywords in rules:
        for kw in keywords:
            if kw.lower() in clean.lower():
                return group_name
    return "其他"


def group_children(children: list[dict], rules: list[tuple[str, list[str]]]) -> OrderedDict:
    """将二级菜单按规则分组，空组不输出。"""
    grouped: OrderedDict = OrderedDict()
    for group_name, _ in rules:
        grouped[group_name] = []
    grouped["其他"] = []
    for child in children:
        grouped[find_group(child["title"], rules)].append(child)
    return OrderedDict((k, v) for k, v in grouped.items() if v)


def render_section(title: str, children: list[dict], rules: Optional[list[tuple[str, list[str]]]]) -> list[str]:
    """
    渲染单个一级菜单区块。
    有规则 → ## 一级 / ### 聚类分组 / - 文章（三级结构）
    无规则 → ## 一级 / - 文章（保持原有两级）
    """
    lines = [f"## {title}\n"]
    if not children:
        lines.append("")
        return lines

    if rules:
        grouped = group_children(children, rules)
        for group_name, items in grouped.items():
            lines.append(f"### {group_name}\n")
            for item in items:
                if item["url"]:
                    lines.append(f"- [{item['title']}]({item['url']})")
                else:
                    lines.append(f"- {item['title']}")
            lines.append("")
    else:
        for item in children:
            if item["url"]:
                lines.append(f"- [{item['title']}]({item['url']})")
            else:
                lines.append(f"- {item['title']}")
        lines.append("")

    return lines


def parse_grouped(json_path: str, output_path: str) -> None:
    """主入口：解析 toc 并输出聚类三级结构的 Markdown。"""
    book_name, namespace, toc = load_toc(json_path)
    level1 = build_menu(toc, namespace)

    lines = [f"# {book_name}\n"]
    for entry in level1.values():
        clean_title = re.sub(r'^[\W]+', '', entry['title'])
        matched_rules = None
        for rule_key, rules in GROUP_RULES.items():
            if rule_key == clean_title:
                matched_rules = rules
                break
        lines.extend(render_section(entry['title'], entry['children'], matched_rules))

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))

    total_l1 = len(level1)
    total_l2 = sum(len(e['children']) for e in level1.values())
    print(f'[Done][聚类模式] 一级菜单: {total_l1}，原二级菜单: {total_l2}')
    print(f'输出文件: {Path(output_path).resolve()}')


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('用法: python3 scripts/parse_toc_grouped.py <decoded_json> <output_md>')
        sys.exit(1)
    parse_grouped(sys.argv[1], sys.argv[2])
