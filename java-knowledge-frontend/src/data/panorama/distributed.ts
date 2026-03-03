import type { PanoramaConfig } from '../types'

/**
 * 分布式 知识图谱配置
 */
export const distributedPanorama: PanoramaConfig = {
  categoryId: 'distributed',
  layers: [
    {
      name: '理论基础',
      blocks: [
        {
          id: 'cap-theorem',
          title: 'CAP理论',
          subtitle: '一致性/可用性/分区容错',
          contentFile: 'distributed/cap-theorem.ts'
        },
        {
          id: 'base-theory',
          title: 'BASE理论',
          subtitle: '基本可用/软状态/最终一致性',
          contentFile: 'distributed/base-theory.ts'
        },
        {
          id: 'consistency',
          title: '一致性模型',
          subtitle: '强一致性/弱一致性/最终一致性',
          contentFile: 'distributed/consistency.ts'
        },
        {
          id: 'consensus',
          title: '共识算法',
          subtitle: 'Paxos/Raft/ZAB',
          contentFile: 'distributed/consensus.ts'
        }
      ]
    },
    {
      name: '分布式事务',
      blocks: [
        {
          id: '2pc',
          title: '两阶段提交',
          subtitle: '2PC协议/优缺点',
          contentFile: 'distributed/2pc.ts'
        },
        {
          id: '3pc',
          title: '三阶段提交',
          subtitle: '3PC协议/改进点',
          contentFile: 'distributed/3pc.ts'
        },
        {
          id: 'tcc',
          title: 'TCC模式',
          subtitle: 'Try/Confirm/Cancel',
          contentFile: 'distributed/tcc.ts'
        },
        {
          id: 'saga',
          title: 'Saga模式',
          subtitle: '长事务/补偿机制',
          contentFile: 'distributed/saga.ts'
        },
        {
          id: 'message-transaction',
          title: '消息事务',
          subtitle: '本地消息表/事务消息',
          contentFile: 'distributed/message-transaction.ts'
        },
        {
          id: 'seata',
          title: 'Seata框架',
          subtitle: 'AT/TCC/Saga/XA模式',
          contentFile: 'distributed/seata.ts'
        }
      ]
    },
    {
      name: '分布式锁',
      blocks: [
        {
          id: 'redis-lock',
          title: 'Redis分布式锁',
          subtitle: 'SETNX/Redlock/Redisson',
          contentFile: 'distributed/redis-lock.ts'
        },
        {
          id: 'zk-lock',
          title: 'Zookeeper锁',
          subtitle: '临时顺序节点/Watch机制',
          contentFile: 'distributed/zk-lock.ts'
        },
        {
          id: 'db-lock',
          title: '数据库锁',
          subtitle: '悲观锁/乐观锁',
          contentFile: 'distributed/db-lock.ts'
        },
        {
          id: 'lock-comparison',
          title: '锁方案对比',
          subtitle: '性能/可靠性/适用场景',
          contentFile: 'distributed/lock-comparison.ts'
        }
      ]
    },
    {
      name: '分布式ID',
      blocks: [
        {
          id: 'snowflake',
          title: '雪花算法',
          subtitle: '时间戳/机器ID/序列号',
          contentFile: 'distributed/snowflake.ts'
        },
        {
          id: 'segment',
          title: '号段模式',
          subtitle: 'Leaf-segment/批量获取',
          contentFile: 'distributed/segment.ts'
        },
        {
          id: 'uuid',
          title: 'UUID方案',
          subtitle: 'UUID/GUID/优缺点',
          contentFile: 'distributed/uuid.ts'
        },
        {
          id: 'database-id',
          title: '数据库方案',
          subtitle: '自增ID/序列/多主',
          contentFile: 'distributed/database-id.ts'
        }
      ]
    },
    {
      name: '服务治理',
      blocks: [
        {
          id: 'load-balance',
          title: '负载均衡',
          subtitle: '轮询/随机/一致性哈希',
          contentFile: 'distributed/load-balance.ts'
        },
        {
          id: 'service-discovery',
          title: '服务发现',
          subtitle: 'Eureka/Nacos/Consul',
          contentFile: 'distributed/service-discovery.ts'
        },
        {
          id: 'circuit-breaker',
          title: '熔断降级',
          subtitle: 'Hystrix/Sentinel',
          contentFile: 'distributed/circuit-breaker.ts'
        },
        {
          id: 'rate-limiting',
          title: '限流策略',
          subtitle: '令牌桶/漏桶/滑动窗口',
          contentFile: 'distributed/rate-limiting.ts'
        }
      ]
    },
    {
      name: '数据一致性',
      blocks: [
        {
          id: 'idempotence',
          title: '接口幂等',
          subtitle: 'Token/状态机/去重表',
          contentFile: 'distributed/idempotence.ts'
        },
        {
          id: 'eventual-consistency',
          title: '最终一致性',
          subtitle: '异步补偿/定时对账',
          contentFile: 'distributed/eventual-consistency.ts'
        },
        {
          id: 'data-sync',
          title: '数据同步',
          subtitle: 'Canal/Binlog/CDC',
          contentFile: 'distributed/data-sync.ts'
        },
        {
          id: 'distributed-session',
          title: '分布式Session',
          subtitle: 'Redis/JWT/Token',
          contentFile: 'distributed/distributed-session.ts'
        }
      ]
    }
  ]
}

