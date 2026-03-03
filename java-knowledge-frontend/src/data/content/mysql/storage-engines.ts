import type { KnowledgeBlockContent } from '../../types'

/**
 * 存储引擎 - 详细内容
 */
export const storageEnginesContent: KnowledgeBlockContent = {
  id: 'storage-engines',
  title: '存储引擎',
  description: `**InnoDB vs MyISAM 对比**

**InnoDB（默认引擎）**
- 事务支持：支持ACID事务
- 锁机制：行级锁，并发性能好
- 外键：支持外键约束
- 崩溃恢复：支持自动崩溃恢复
- MVCC：支持多版本并发控制
- 索引：聚簇索引（主键索引包含数据）
- 适用场景：高并发、需要事务、数据一致性要求高

**MyISAM**
- 事务支持：不支持事务
- 锁机制：表级锁，并发性能差
- 外键：不支持外键
- 崩溃恢复：需要手动修复
- 索引：非聚簇索引（索引和数据分离）
- 全文索引：支持全文索引（InnoDB 5.6+也支持）
- 适用场景：读多写少、不需要事务

**其他存储引擎**
- Memory：数据存储在内存，速度快但重启丢失
- Archive：压缩存储，适合归档数据
- CSV：以CSV格式存储，可直接编辑
- Federated：访问远程MySQL表`,
  
  code: `-- 1. 查看所有存储引擎
SHOW ENGINES;

-- 2. 查看默认存储引擎
SHOW VARIABLES LIKE 'default_storage_engine';

-- 3. 创建表时指定存储引擎
CREATE TABLE user_innodb (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    age INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_myisam (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    age INT
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

-- 4. 修改表的存储引擎
ALTER TABLE user_myisam ENGINE=InnoDB;

-- 5. 查看表的存储引擎和详细信息
SHOW TABLE STATUS LIKE 'user%';
SHOW CREATE TABLE user_innodb;

-- 6. InnoDB特性：事务支持
START TRANSACTION;
INSERT INTO user_innodb (name, age) VALUES ('张三', 25);
UPDATE user_innodb SET age = 26 WHERE name = '张三';
COMMIT; -- 或 ROLLBACK;

-- 7. InnoDB特性：外键约束
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES user_innodb(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 8. InnoDB特性：行级锁演示
-- 会话1
START TRANSACTION;
SELECT * FROM user_innodb WHERE id = 1 FOR UPDATE; -- 锁定id=1的行
-- ... 执行其他操作
COMMIT;

-- 会话2（可以同时执行，不会阻塞）
START TRANSACTION;
SELECT * FROM user_innodb WHERE id = 2 FOR UPDATE; -- 锁定id=2的行
COMMIT;

-- 9. MyISAM特性：表级锁演示
LOCK TABLES user_myisam WRITE;
INSERT INTO user_myisam (name, age) VALUES ('李四', 30);
UNLOCK TABLES;

-- 10. 查看InnoDB状态
SHOW ENGINE INNODB STATUS;

-- 11. Memory引擎示例（临时表）
CREATE TABLE temp_data (
    id INT PRIMARY KEY,
    data VARCHAR(100)
) ENGINE=Memory;`
}

