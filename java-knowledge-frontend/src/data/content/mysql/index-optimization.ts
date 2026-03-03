import type { KnowledgeBlockContent } from '../../types'

/**
 * 索引优化 - 详细内容
 */
export const indexOptimizationContent: KnowledgeBlockContent = {
  id: 'index-optimization',
  title: '索引优化',
  description: `**索引优化核心技术**

**1. 覆盖索引（Covering Index）**
- 查询的列都在索引中，无需回表
- Extra显示"Using index"
- 大幅提升查询性能

**2. 索引下推（Index Condition Pushdown, ICP）**
- MySQL 5.6+支持
- 将WHERE条件下推到存储引擎层过滤
- 减少回表次数
- Extra显示"Using index condition"

**3. 最左前缀原则**
- 组合索引从最左列开始匹配
- 中间不能跳过列
- 范围查询后的列无法使用索引

**4. 索引选择性**
- 选择性 = 不重复值数量 / 总记录数
- 选择性越高，索引效果越好
- 性别字段选择性低，不适合建索引

**5. 索引失效场景**
- 使用函数或表达式
- 隐式类型转换
- 使用!=、<>、NOT IN
- LIKE以%开头
- OR条件中有未建索引的列`,
  
  code: `-- 1. 覆盖索引示例
CREATE INDEX idx_age_name ON user(age, name);

-- 使用覆盖索引（无需回表）
EXPLAIN SELECT age, name FROM user WHERE age = 25;
-- Extra: Using index

-- 需要回表
EXPLAIN SELECT * FROM user WHERE age = 25;
-- Extra: NULL（需要回表获取其他列）

-- 2. 索引下推示例
CREATE INDEX idx_name_age ON user(name, age);

-- 有索引下推
EXPLAIN SELECT * FROM user WHERE name LIKE '张%' AND age = 25;
-- Extra: Using index condition

-- 无索引下推（MySQL 5.6之前）
-- 会先通过name索引找到所有"张%"的记录，然后回表过滤age=25

-- 3. 最左前缀原则
CREATE INDEX idx_a_b_c ON table1(a, b, c);

-- 可以使用索引
SELECT * FROM table1 WHERE a = 1;
SELECT * FROM table1 WHERE a = 1 AND b = 2;
SELECT * FROM table1 WHERE a = 1 AND b = 2 AND c = 3;
SELECT * FROM table1 WHERE a = 1 AND c = 3; -- 只用到a

-- 不能使用索引
SELECT * FROM table1 WHERE b = 2;
SELECT * FROM table1 WHERE c = 3;
SELECT * FROM table1 WHERE b = 2 AND c = 3;

-- 范围查询后的列无法使用索引
SELECT * FROM table1 WHERE a > 1 AND b = 2; -- 只用到a

-- 4. 计算索引选择性
SELECT 
    COUNT(DISTINCT age) / COUNT(*) AS age_selectivity,
    COUNT(DISTINCT name) / COUNT(*) AS name_selectivity,
    COUNT(DISTINCT gender) / COUNT(*) AS gender_selectivity
FROM user;

-- 5. 索引失效场景

-- 失效：使用函数
EXPLAIN SELECT * FROM user WHERE YEAR(create_time) = 2024;
-- 优化：
EXPLAIN SELECT * FROM user 
WHERE create_time >= '2024-01-01' AND create_time < '2025-01-01';

-- 失效：表达式计算
EXPLAIN SELECT * FROM user WHERE age + 1 = 26;
-- 优化：
EXPLAIN SELECT * FROM user WHERE age = 25;

-- 失效：隐式类型转换
EXPLAIN SELECT * FROM user WHERE phone = 13800138000; -- phone是VARCHAR
-- 优化：
EXPLAIN SELECT * FROM user WHERE phone = '13800138000';

-- 失效：LIKE以%开头
EXPLAIN SELECT * FROM user WHERE name LIKE '%张三%';
-- 优化：使用全文索引或搜索引擎

-- 失效：使用!=或<>
EXPLAIN SELECT * FROM user WHERE status != 1;
-- 优化：使用IN或范围查询
EXPLAIN SELECT * FROM user WHERE status IN (0, 2, 3);

-- 失效：OR条件中有未建索引的列
EXPLAIN SELECT * FROM user WHERE age = 25 OR address = '北京';
-- 优化：都建索引或改用UNION
EXPLAIN SELECT * FROM user WHERE age = 25
UNION
SELECT * FROM user WHERE address = '北京';

-- 6. 索引合并（Index Merge）
CREATE INDEX idx_age ON user(age);
CREATE INDEX idx_city ON user(city);

EXPLAIN SELECT * FROM user WHERE age = 25 OR city = '北京';
-- type: index_merge
-- Extra: Using union(idx_age,idx_city)

-- 7. 强制使用索引
EXPLAIN SELECT * FROM user FORCE INDEX(idx_age) WHERE age = 25;
EXPLAIN SELECT * FROM user USE INDEX(idx_age) WHERE age = 25;
EXPLAIN SELECT * FROM user IGNORE INDEX(idx_age) WHERE age = 25;

-- 8. 查看索引使用统计
SELECT * FROM sys.schema_unused_indexes;
SELECT * FROM sys.schema_redundant_indexes;`
}

