import type { KnowledgeBlockContent } from '../../types'

/**
 * 索引类型 - 详细内容
 */
export const indexTypesContent: KnowledgeBlockContent = {
  id: 'index-types',
  title: '索引类型',
  description: `**MySQL索引类型详解**

**1. 主键索引（PRIMARY KEY）**
- 唯一且非空
- 一个表只能有一个主键
- InnoDB中是聚簇索引，叶子节点存储完整数据
- 自动创建，无需手动指定

**2. 唯一索引（UNIQUE）**
- 列值必须唯一，但允许NULL
- 可以有多个唯一索引
- 用于保证数据唯一性（如用户名、邮箱）

**3. 普通索引（INDEX/KEY）**
- 最基本的索引类型
- 没有唯一性限制
- 用于加速查询

**4. 全文索引（FULLTEXT）**
- 用于全文搜索
- 支持InnoDB（5.6+）和MyISAM
- 适用于TEXT、VARCHAR类型
- 使用MATCH AGAINST语法

**5. 组合索引（复合索引）**
- 多个列组合成一个索引
- 遵循最左前缀原则
- 可以减少索引数量

**6. 前缀索引**
- 只索引字符串的前N个字符
- 节省空间，但可能降低选择性`,
  
  code: `-- 1. 主键索引
CREATE TABLE user (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)
);
-- 或
ALTER TABLE user ADD PRIMARY KEY (id);

-- 2. 唯一索引
CREATE UNIQUE INDEX idx_email ON user(email);
-- 或
ALTER TABLE user ADD UNIQUE KEY idx_username (username);
-- 或在创建表时
CREATE TABLE user (
    id BIGINT PRIMARY KEY,
    email VARCHAR(100) UNIQUE,
    username VARCHAR(50),
    UNIQUE KEY idx_username (username)
);

-- 3. 普通索引
CREATE INDEX idx_age ON user(age);
CREATE INDEX idx_status ON user(status);
-- 或
ALTER TABLE user ADD INDEX idx_city (city);

-- 4. 全文索引
CREATE FULLTEXT INDEX idx_content ON article(content);
-- 使用全文索引查询
SELECT * FROM article 
WHERE MATCH(content) AGAINST('MySQL 索引' IN NATURAL LANGUAGE MODE);

-- 布尔模式
SELECT * FROM article 
WHERE MATCH(content) AGAINST('+MySQL -Oracle' IN BOOLEAN MODE);

-- 5. 组合索引（复合索引）
CREATE INDEX idx_name_age_city ON user(name, age, city);

-- 最左前缀原则示例
-- 可以使用索引：
SELECT * FROM user WHERE name = '张三';
SELECT * FROM user WHERE name = '张三' AND age = 25;
SELECT * FROM user WHERE name = '张三' AND age = 25 AND city = '北京';
SELECT * FROM user WHERE name = '张三' AND city = '北京'; -- 只用到name

-- 不能使用索引：
SELECT * FROM user WHERE age = 25; -- 跳过了name
SELECT * FROM user WHERE city = '北京'; -- 跳过了name和age

-- 6. 前缀索引
CREATE INDEX idx_email_prefix ON user(email(10)); -- 只索引前10个字符
CREATE INDEX idx_url_prefix ON article(url(50));

-- 查看前缀索引选择性
SELECT 
    COUNT(DISTINCT LEFT(email, 10)) / COUNT(*) AS prefix_selectivity,
    COUNT(DISTINCT email) / COUNT(*) AS full_selectivity
FROM user;

-- 7. 查看表的所有索引
SHOW INDEX FROM user;
SHOW CREATE TABLE user;

-- 8. 删除索引
DROP INDEX idx_age ON user;
ALTER TABLE user DROP INDEX idx_name_age_city;

-- 9. 查看索引使用情况
EXPLAIN SELECT * FROM user WHERE name = '张三' AND age = 25;

-- 10. 索引统计信息
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    SEQ_IN_INDEX,
    COLUMN_NAME,
    CARDINALITY
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'your_database' AND TABLE_NAME = 'user';`
}

