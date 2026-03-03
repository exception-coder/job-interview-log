import type { PanoramaConfig } from '../types'

/**
 * MySQL 知识图谱配置
 */
export const mysqlPanorama: PanoramaConfig = {
  categoryId: 'mysql',
  layers: [
    {
      name: '基础架构',
      blocks: [
        {
          id: 'mysql-architecture',
          title: 'MySQL架构',
          subtitle: '连接器/查询缓存/分析器/优化器/执行器',
          contentFile: 'mysql/mysql-architecture.ts'
        },
        {
          id: 'storage-engines',
          title: '存储引擎',
          subtitle: 'InnoDB/MyISAM对比',
          contentFile: 'mysql/storage-engines.ts'
        }
      ]
    },
    {
      name: '索引体系',
      blocks: [
        {
          id: 'btree-index',
          title: 'B+树索引',
          subtitle: '为什么选择B+树',
          contentFile: 'mysql/btree-index.ts'
        },
        {
          id: 'index-types',
          title: '索引类型',
          subtitle: '主键/唯一/普通/全文索引',
          contentFile: 'mysql/index-types.ts'
        },
        {
          id: 'index-optimization',
          title: '索引优化',
          subtitle: '覆盖索引/索引下推/最左前缀',
          contentFile: 'mysql/index-optimization.ts'
        }
      ]
    },
    {
      name: '事务机制',
      blocks: [
        {
          id: 'acid',
          title: 'ACID特性',
          subtitle: '原子性/一致性/隔离性/持久性',
          contentFile: 'mysql/acid.ts'
        },
        {
          id: 'isolation-levels',
          title: '隔离级别',
          subtitle: 'RU/RC/RR/Serializable',
          contentFile: 'mysql/isolation-levels.ts'
        },
        {
          id: 'mvcc',
          title: 'MVCC机制',
          subtitle: '多版本并发控制',
          contentFile: 'mysql/mvcc.ts'
        }
      ]
    },
    {
      name: '锁机制',
      blocks: [
        {
          id: 'lock-types',
          title: '锁类型',
          subtitle: '表锁/行锁/间隙锁/临键锁',
          contentFile: 'mysql/lock-types.ts'
        },
        {
          id: 'deadlock',
          title: '死锁处理',
          subtitle: '死锁检测与预防',
          contentFile: 'mysql/deadlock.ts'
        }
      ]
    },
    {
      name: '性能优化',
      blocks: [
        {
          id: 'sql-optimization',
          title: 'SQL优化',
          subtitle: 'EXPLAIN/慢查询/索引优化',
          contentFile: 'mysql/sql-optimization.ts'
        },
        {
          id: 'table-optimization',
          title: '表设计优化',
          subtitle: '字段类型/范式/分区',
          contentFile: 'mysql/table-optimization.ts'
        }
      ]
    }
  ]
}

