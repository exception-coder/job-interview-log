import type { KnowledgeBlockContent } from '../../types'

/**
 * MySQL架构 - 详细内容
 */
export const mysqlArchitectureContent: KnowledgeBlockContent = {
  id: 'mysql-architecture',
  title: 'MySQL架构',
  description: `**MySQL整体架构分为三层**

**1. 连接层（Connection Layer）**
- 连接器：负责客户端连接管理、权限验证
- 连接池：管理和复用数据库连接
- 线程处理：为每个连接分配线程

**2. 服务层（Server Layer）**
- 查询缓存：缓存SELECT查询结果（MySQL 8.0已移除）
- 分析器：词法分析和语法分析，生成语法树
- 优化器：选择最优执行计划（索引选择、JOIN顺序）
- 执行器：调用存储引擎API执行SQL

**3. 存储引擎层（Storage Engine Layer）**
- InnoDB：默认引擎，支持事务、行锁、外键
- MyISAM：不支持事务，表锁，适合读多写少
- Memory：数据存储在内存，速度快但不持久化

**SQL执行流程**
1. 客户端发送SQL → 连接器验证权限
2. 查询缓存检查（8.0已移除）
3. 分析器解析SQL语法
4. 优化器生成执行计划
5. 执行器调用存储引擎接口
6. 存储引擎返回数据`,
  
  code: `-- 1. 查看MySQL版本和存储引擎
SHOW VARIABLES LIKE 'version';
SHOW ENGINES;

-- 2. 查看当前连接信息
SHOW PROCESSLIST;
SELECT * FROM information_schema.PROCESSLIST;

-- 3. 查看表的存储引擎
SHOW TABLE STATUS LIKE 'user';
SHOW CREATE TABLE user;

-- 4. 修改表的存储引擎
ALTER TABLE user ENGINE = InnoDB;

-- 5. 查看SQL执行计划（优化器选择）
EXPLAIN SELECT * FROM user WHERE id = 1;
EXPLAIN SELECT * FROM user u 
JOIN orders o ON u.id = o.user_id 
WHERE u.status = 1;

-- 6. 查看优化器追踪信息
SET optimizer_trace='enabled=on';
SELECT * FROM user WHERE age > 20;
SELECT * FROM information_schema.OPTIMIZER_TRACE;
SET optimizer_trace='enabled=off';

-- 7. 查看连接数和线程信息
SHOW STATUS LIKE 'Threads%';
SHOW VARIABLES LIKE 'max_connections';

-- 8. 查看查询缓存配置（MySQL 5.7及以下）
SHOW VARIABLES LIKE 'query_cache%';
SHOW STATUS LIKE 'Qcache%';`
}

