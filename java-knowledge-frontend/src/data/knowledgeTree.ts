export interface KnowledgeNode {
  id: string
  name: string
  type: 'category' | 'article'
  path?: string
  children?: KnowledgeNode[]
  icon?: string
}

export const knowledgeTree: KnowledgeNode[] = [
  {
    id: 'must-read',
    name: '📮 必读',
    type: 'category',
    icon: '📮',
    children: [
      { id: 'interview-prep', name: '面试必备', type: 'article' },
      { id: 'scenario', name: '场景题', type: 'article' },
      { id: 'troubleshooting', name: '线上问题排查', type: 'article' }
    ]
  },
  {
    id: 'java-basics',
    name: 'Java基础',
    type: 'category',
    icon: '☕',
    children: [
      { id: 'java-oop', name: '面向对象', type: 'article' },
      { id: 'java-exception', name: '异常处理', type: 'article' },
      { id: 'java-io', name: 'IO流', type: 'article' }
    ]
  },
  {
    id: 'java-concurrent',
    name: 'Java并发',
    type: 'category',
    icon: '🔄',
    children: [
      { id: 'thread-safety', name: '线程安全', type: 'article' },
      { id: 'thread-pool', name: '线程池', type: 'article' },
      { id: 'lock', name: '锁机制', type: 'article' }
    ]
  },
  {
    id: 'collections',
    name: '集合类',
    type: 'category',
    icon: '📦',
    children: [
      { id: 'list', name: 'List集合', type: 'article' },
      { id: 'map', name: 'Map集合', type: 'article' },
      { id: 'hashmap', name: 'HashMap原理', type: 'article' }
    ]
  },
  {
    id: 'jvm',
    name: 'JVM',
    type: 'category',
    icon: '⚙️',
    children: [
      { id: 'jvm-memory', name: '内存模型', type: 'article' },
      { id: 'jvm-gc', name: '垃圾回收', type: 'article' },
      { id: 'jvm-tuning', name: '性能调优', type: 'article' }
    ]
  },
  {
    id: 'spring',
    name: 'Spring',
    type: 'category',
    icon: '🍃',
    children: [
      { id: 'spring-ioc', name: 'IOC容器', type: 'article' },
      { id: 'spring-aop', name: 'AOP切面', type: 'article' },
      { id: 'spring-transaction', name: '事务传播', type: 'article' }
    ]
  },
  {
    id: 'springcloud',
    name: 'SpringCloud',
    type: 'category',
    icon: '☁️',
    children: [
      { id: 'sc-gateway', name: '网关', type: 'article' },
      { id: 'sc-config', name: '配置中心', type: 'article' },
      { id: 'sc-discovery', name: '服务发现', type: 'article' }
    ]
  },
  {
    id: 'mysql',
    name: 'MySQL',
    type: 'category',
    icon: '🐬',
    children: [
      { id: 'mysql-index', name: '索引优化', type: 'article' },
      { id: 'mysql-transaction', name: '事务隔离', type: 'article' },
      { id: 'mysql-lock', name: '锁机制', type: 'article' }
    ]
  },
  {
    id: 'redis',
    name: 'Redis',
    type: 'category',
    icon: '🔴',
    children: [
      { id: 'redis-data-types', name: '数据类型', type: 'article' },
      { id: 'redis-cache', name: '缓存策略', type: 'article' },
      { id: 'redis-cluster', name: '集群方案', type: 'article' }
    ]
  },
  {
    id: 'mybatis',
    name: 'MyBatis',
    type: 'category',
    icon: '🗄️',
    children: [
      { id: 'mybatis-cache', name: '缓存机制', type: 'article' },
      { id: 'mybatis-dynamic-sql', name: '动态SQL', type: 'article' }
    ]
  },
  {
    id: 'netty',
    name: 'Netty',
    type: 'category',
    icon: '🌐',
    children: [
      { id: 'netty-nio', name: 'NIO模型', type: 'article' },
      { id: 'netty-eventloop', name: 'EventLoop机制', type: 'article' }
    ]
  },
  {
    id: 'microservices',
    name: '微服务',
    type: 'category',
    icon: '🔧',
    children: [
      { id: 'ms-architecture', name: '微服务架构', type: 'article' },
      { id: 'ms-governance', name: '服务治理', type: 'article' }
    ]
  },
  {
    id: 'distributed',
    name: '分布式',
    type: 'category',
    icon: '🌍',
    children: [
      { id: 'dist-transaction', name: '分布式事务', type: 'article' },
      { id: 'dist-lock', name: '分布式锁', type: 'article' },
      { id: 'cap-theorem', name: 'CAP定理', type: 'article' }
    ]
  },
  {
    id: 'dubbo',
    name: 'Dubbo',
    type: 'category',
    icon: '🔌',
    children: [
      { id: 'dubbo-spi', name: 'SPI机制', type: 'article' },
      { id: 'dubbo-loadbalance', name: '负载均衡', type: 'article' }
    ]
  },
  {
    id: 'kafka',
    name: 'Kafka',
    type: 'category',
    icon: '📨',
    children: [
      { id: 'kafka-architecture', name: 'Kafka架构', type: 'article' },
      { id: 'kafka-performance', name: '高性能原理', type: 'article' }
    ]
  },
  {
    id: 'rocketmq',
    name: 'RocketMQ',
    type: 'category',
    icon: '🚀',
    children: [
      { id: 'rocketmq-transaction', name: '事务消息', type: 'article' },
      { id: 'rocketmq-reliability', name: '消息可靠性', type: 'article' }
    ]
  },
  {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    type: 'category',
    icon: '🐰',
    children: [
      { id: 'rabbitmq-exchange', name: '交换机类型', type: 'article' },
      { id: 'rabbitmq-reliability', name: '消息可靠性', type: 'article' }
    ]
  },
  {
    id: 'elasticsearch',
    name: 'ElasticSearch',
    type: 'category',
    icon: '🔍',
    children: [
      { id: 'es-index', name: '索引原理', type: 'article' },
      { id: 'es-search', name: '搜索原理', type: 'article' }
    ]
  },
  {
    id: 'zookeeper',
    name: 'Zookeeper',
    type: 'category',
    icon: '🦁',
    children: [
      { id: 'zk-zab', name: 'ZAB协议', type: 'article' },
      { id: 'zk-watcher', name: 'Watcher机制', type: 'article' }
    ]
  },
  {
    id: 'high-performance',
    name: '高性能',
    type: 'category',
    icon: '⚡',
    children: [
      { id: 'hp-cache', name: '缓存设计', type: 'article' },
      { id: 'hp-async', name: '异步处理', type: 'article' }
    ]
  },
  {
    id: 'high-availability',
    name: '高可用',
    type: 'category',
    icon: '🛡️',
    children: [
      { id: 'ha-degradation', name: '服务降级', type: 'article' },
      { id: 'ha-circuit-breaker', name: '熔断机制', type: 'article' }
    ]
  },
  {
    id: 'high-concurrency',
    name: '高并发',
    type: 'category',
    icon: '💥',
    children: [
      { id: 'hc-thread-pool', name: '线程池设计', type: 'article' },
      { id: 'hc-seckill', name: '秒杀系统', type: 'article' }
    ]
  },
  {
    id: 'sharding',
    name: '分库分表',
    type: 'category',
    icon: '🗂️',
    children: [
      { id: 'sharding-strategy', name: '分片策略', type: 'article' },
      { id: 'sharding-migration', name: '数据迁移', type: 'article' }
    ]
  },
  {
    id: 'scheduled-task',
    name: '定时任务',
    type: 'category',
    icon: '⏰',
    children: [
      { id: 'task-quartz', name: 'Quartz', type: 'article' },
      { id: 'task-xxl-job', name: 'XXL-Job', type: 'article' }
    ]
  },
  {
    id: 'ddd',
    name: 'DDD',
    type: 'category',
    icon: '🏗️',
    children: [
      { id: 'ddd-concept', name: 'DDD概念', type: 'article' },
      { id: 'ddd-aggregate', name: '聚合根', type: 'article' }
    ]
  },
  {
    id: 'maven-git',
    name: 'Maven & Git',
    type: 'category',
    icon: '🔨',
    children: [
      { id: 'maven-lifecycle', name: 'Maven生命周期', type: 'article' },
      { id: 'git-workflow', name: 'Git工作流', type: 'article' }
    ]
  },
  {
    id: 'local-cache',
    name: '本地缓存',
    type: 'category',
    icon: '💾',
    children: [
      { id: 'cache-caffeine', name: 'Caffeine', type: 'article' },
      { id: 'cache-guava', name: 'Guava Cache', type: 'article' }
    ]
  },
  {
    id: 'file-processing',
    name: '文件处理',
    type: 'category',
    icon: '📄',
    children: [
      { id: 'file-upload', name: '文件上传', type: 'article' },
      { id: 'file-excel', name: 'Excel处理', type: 'article' }
    ]
  },
  {
    id: 'idea',
    name: 'IDEA',
    type: 'category',
    icon: '💡',
    children: [
      { id: 'idea-shortcuts', name: '快捷键', type: 'article' },
      { id: 'idea-plugins', name: '插件推荐', type: 'article' }
    ]
  },
  {
    id: 'logging',
    name: '日志',
    type: 'category',
    icon: '📝',
    children: [
      { id: 'log-slf4j', name: 'SLF4J', type: 'article' },
      { id: 'log-logback', name: 'Logback', type: 'article' }
    ]
  },
  {
    id: 'design-patterns',
    name: '设计模式',
    type: 'category',
    icon: '🎨',
    children: [
      { id: 'pattern-singleton', name: '单例模式', type: 'article' },
      { id: 'pattern-factory', name: '工厂模式', type: 'article' },
      { id: 'pattern-strategy', name: '策略模式', type: 'article' }
    ]
  },
  {
    id: 'unit-test',
    name: '单元测试',
    type: 'category',
    icon: '🧪',
    children: [
      { id: 'test-junit', name: 'JUnit', type: 'article' },
      { id: 'test-mockito', name: 'Mockito', type: 'article' }
    ]
  },
  {
    id: 'cloud-computing',
    name: '云计算',
    type: 'category',
    icon: '☁️',
    children: [
      { id: 'cloud-docker', name: 'Docker', type: 'article' },
      { id: 'cloud-k8s', name: 'Kubernetes', type: 'article' }
    ]
  },
  {
    id: 'computer-network',
    name: '计算机网络',
    type: 'category',
    icon: '🌐',
    children: [
      { id: 'network-tcp', name: 'TCP协议', type: 'article' },
      { id: 'network-http', name: 'HTTP协议', type: 'article' },
      { id: 'network-https', name: 'HTTPS原理', type: 'article' }
    ]
  },
  {
    id: 'network-security',
    name: '网络安全',
    type: 'category',
    icon: '🔒',
    children: [
      { id: 'security-xss', name: 'XSS攻击', type: 'article' },
      { id: 'security-csrf', name: 'CSRF攻击', type: 'article' },
      { id: 'security-jwt', name: 'JWT认证', type: 'article' }
    ]
  },
  {
    id: 'operating-system',
    name: '操作系统',
    type: 'category',
    icon: '🖥️',
    children: [
      { id: 'os-process', name: '进程与线程', type: 'article' },
      { id: 'os-memory', name: '内存管理', type: 'article' },
      { id: 'os-linux', name: 'Linux命令', type: 'article' }
    ]
  },
  {
    id: 'data-structure',
    name: '数据结构',
    type: 'category',
    icon: '📊',
    children: [
      { id: 'ds-array', name: '数组', type: 'article' },
      { id: 'ds-linkedlist', name: '链表', type: 'article' },
      { id: 'ds-tree', name: '树', type: 'article' },
      { id: 'ds-sort', name: '排序算法', type: 'article' }
    ]
  },
  {
    id: 'container',
    name: '容器',
    type: 'category',
    icon: '🐳',
    children: [
      { id: 'container-docker', name: 'Docker基础', type: 'article' },
      { id: 'container-k8s', name: 'Kubernetes', type: 'article' }
    ]
  },
  {
    id: 'architecture-design',
    name: '架构设计',
    type: 'category',
    icon: '🏛️',
    children: [
      { id: 'arch-principles', name: '架构原则', type: 'article' },
      { id: 'arch-patterns', name: '架构模式', type: 'article' },
      { id: 'arch-microservice', name: '微服务架构', type: 'article' }
    ]
  },
  {
    id: 'coding-problems',
    name: '编程题',
    type: 'category',
    icon: '💻',
    children: [
      { id: 'code-array', name: '数组问题', type: 'article' },
      { id: 'code-string', name: '字符串问题', type: 'article' },
      { id: 'code-dp', name: '动态规划', type: 'article' },
      { id: 'code-hot100', name: 'LeetCode Hot 100', type: 'article' }
    ]
  },
  {
    id: 'iq-problems',
    name: '智商题',
    type: 'category',
    icon: '🧠',
    children: [
      { id: 'iq-logic', name: '逻辑推理', type: 'article' },
      { id: 'iq-math', name: '数学问题', type: 'article' }
    ]
  },
  {
    id: 'non-technical',
    name: '非技术问题',
    type: 'category',
    icon: '💬',
    children: [
      { id: 'nt-self-intro', name: '自我介绍', type: 'article' },
      { id: 'nt-project', name: '项目介绍', type: 'article' },
      { id: 'nt-career', name: '职业规划', type: 'article' }
    ]
  },
  {
    id: 'others',
    name: '其他',
    type: 'category',
    icon: '📚',
    children: [
      { id: 'other-resume', name: '简历优化', type: 'article' },
      { id: 'other-interview-tips', name: '面试技巧', type: 'article' }
    ]
  },
  {
    id: 'interview-experience',
    name: '面经实战',
    type: 'category',
    icon: '📝',
    children: [
      { id: 'exp-alibaba', name: '阿里巴巴', type: 'article' },
      { id: 'exp-tencent', name: '腾讯', type: 'article' },
      { id: 'exp-bytedance', name: '字节跳动', type: 'article' },
      { id: 'exp-meituan', name: '美团', type: 'article' }
    ]
  },
  {
    id: 'big-company-practice',
    name: '大厂实践',
    type: 'category',
    icon: '🏢',
    children: [
      { id: 'practice-architecture', name: '大厂架构', type: 'article' },
      { id: 'practice-performance', name: '性能优化', type: 'article' }
    ]
  },
  {
    id: 'ai-llm',
    name: 'AI & 大模型',
    type: 'category',
    icon: '🤖',
    children: [
      { id: 'ai-basics', name: 'AI基础', type: 'article' },
      { id: 'ai-llm-intro', name: '大模型介绍', type: 'article' },
      { id: 'ai-prompt', name: 'Prompt工程', type: 'article' },
      { id: 'ai-rag', name: 'RAG技术', type: 'article' },
      { id: 'ai-agent', name: 'AI Agent', type: 'article' }
    ]
  }
]