import type { KnowledgeBlockContent } from '../../types'

/**
 * CAP理论 - 详细内容
 */
export const capTheoremContent: KnowledgeBlockContent = {
  id: 'cap-theorem',
  title: 'CAP理论',
  description: `**CAP理论（布鲁尔定理）**

**三个特性**

**1. 一致性（Consistency）**
- 所有节点在同一时间看到相同的数据
- 写操作完成后，所有读操作都能读到最新数据
- 强一致性：立即一致
- 弱一致性：最终一致

**2. 可用性（Availability）**
- 每个请求都能得到响应（成功或失败）
- 系统持续可用，不会因为某个节点故障而整体不可用
- 响应时间要在合理范围内

**3. 分区容错性（Partition Tolerance）**
- 系统在网络分区（节点间通信失败）时仍能继续工作
- 分布式系统必须满足的特性
- 网络故障是常态，必须容忍

**CAP不可能三角**
- 分布式系统最多只能同时满足两个特性
- 由于网络分区不可避免，实际上是在C和A之间权衡
- CP：牺牲可用性，保证一致性（如ZooKeeper）
- AP：牺牲一致性，保证可用性（如Cassandra）
- CA：不存在（分布式系统必须容忍分区）

**常见系统的选择**
- ZooKeeper：CP（强一致性）
- Eureka：AP（高可用）
- Redis：AP（最终一致性）
- MySQL：CA（单机）`,
  
  code: `// 1. CP系统示例：ZooKeeper
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.retry.ExponentialBackoffRetry;

public class ZooKeeperCPDemo {
    public static void main(String[] args) throws Exception {
        // ZooKeeper选择CP：保证强一致性
        CuratorFramework client = CuratorFrameworkFactory.builder()
            .connectString("localhost:2181")
            .retryPolicy(new ExponentialBackoffRetry(1000, 3))
            .build();
        client.start();
        
        // 写操作：必须过半节点确认才返回成功
        // 如果网络分区，少数派节点不可用（牺牲可用性）
        client.create()
            .creatingParentsIfNeeded()
            .forPath("/config/database", "mysql://localhost:3306".getBytes());
        
        // 读操作：保证读到最新数据（强一致性）
        byte[] data = client.getData().forPath("/config/database");
        System.out.println(new String(data));
        
        client.close();
    }
}

// 2. AP系统示例：Eureka
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableEurekaClient
public class EurekaAPDemo {
    // Eureka选择AP：保证高可用性
    // 特点：
    // 1. 每个节点都可以提供服务（高可用）
    // 2. 节点间异步复制，可能读到旧数据（最终一致性）
    // 3. 网络分区时，各分区独立工作（容忍分区）
    
    public static void main(String[] args) {
        SpringApplication.run(EurekaAPDemo.class, args);
    }
}

// 3. CAP权衡示例：配置中心
public class ConfigCenterDemo {
    
    // CP模式：使用ZooKeeper
    public String getConfigCP(String key) {
        // 优点：保证读到最新配置
        // 缺点：网络分区时可能不可用
        return zookeeperClient.getData(key);
    }
    
    // AP模式：使用本地缓存
    private Map<String, String> localCache = new ConcurrentHashMap<>();
    
    public String getConfigAP(String key) {
        // 优点：始终可用，即使网络分区
        // 缺点：可能读到旧配置
        return localCache.getOrDefault(key, "default");
    }
}

// 4. 网络分区模拟
public class NetworkPartitionDemo {
    
    // 场景：3个节点的集群发生网络分区
    // 分区1：Node1, Node2（多数派）
    // 分区2：Node3（少数派）
    
    // CP系统的处理
    public void cpSystemBehavior() {
        // 多数派（Node1, Node2）：继续提供服务
        // 少数派（Node3）：拒绝服务，返回错误
        // 结果：牺牲可用性，保证一致性
        
        if (isInMajorityPartition()) {
            // 继续服务
            processRequest();
        } else {
            // 拒绝服务
            throw new ServiceUnavailableException("Not in majority partition");
        }
    }
    
    // AP系统的处理
    public void apSystemBehavior() {
        // 多数派（Node1, Node2）：继续提供服务
        // 少数派（Node3）：也继续提供服务
        // 结果：牺牲一致性，保证可用性
        
        // 所有节点都继续服务
        processRequest();
        
        // 网络恢复后，通过冲突解决机制达到最终一致性
    }
}

// 5. 一致性级别选择
public class ConsistencyLevelDemo {
    
    // 强一致性：读操作必须返回最新写入的数据
    public String readWithStrongConsistency(String key) {
        // 实现：读取时需要联系多数派节点
        // 性能：慢，但保证一致性
        return readFromMajority(key);
    }
    
    // 最终一致性：读操作可能返回旧数据，但最终会一致
    public String readWithEventualConsistency(String key) {
        // 实现：从本地节点读取
        // 性能：快，但可能读到旧数据
        return readFromLocal(key);
    }
    
    // 会话一致性：同一会话内保证一致性
    public String readWithSessionConsistency(String key, String sessionId) {
        // 实现：同一会话的请求路由到同一节点
        Node node = getNodeBySession(sessionId);
        return node.read(key);
    }
}

// 6. 实际应用：分布式配置中心
@Service
public class DistributedConfigService {
    
    @Autowired
    private ZooKeeperClient zkClient; // CP
    
    @Autowired
    private RedisTemplate redisTemplate; // AP
    
    // 关键配置：使用CP系统（ZooKeeper）
    public String getCriticalConfig(String key) {
        // 保证强一致性，宁可不可用也不能读到错误配置
        return zkClient.get(key);
    }
    
    // 普通配置：使用AP系统（Redis）
    public String getNormalConfig(String key) {
        // 保证高可用，可以容忍短暂的不一致
        return (String) redisTemplate.opsForValue().get(key);
    }
}

// 7. CAP理论在微服务中的应用
@RestController
public class MicroserviceController {
    
    // 服务注册：选择AP（Eureka）
    // 原因：服务注册信息允许短暂不一致，但必须高可用
    
    // 分布式锁：选择CP（ZooKeeper/Redis RedLock）
    // 原因：锁必须保证一致性，否则会出现并发问题
    
    // 配置中心：根据配置重要性选择
    // 关键配置：CP（ZooKeeper）
    // 普通配置：AP（Nacos/Apollo）
}`
}

