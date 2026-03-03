import type { KnowledgeBlockContent } from '../../types'

/**
 * B+树索引 - 详细内容
 */
export const btreeIndexContent: KnowledgeBlockContent = {
  id: 'btree-index',
  title: 'B+树索引',
  description: `**为什么MySQL选择B+树而不是B树或二叉树？**

**B+树的优势**
1. 所有数据都在叶子节点，非叶子节点只存储键值
2. 叶子节点之间有指针连接，支持范围查询
3. 树的高度更低，减少磁盘I/O次数
4. 非叶子节点可以存储更多索引，提高扇出度

**与其他数据结构对比**

**vs 二叉搜索树/AVL树/红黑树**
- 二叉树高度太高，磁盘I/O次数多
- 每个节点只有2个子节点，扇出度小
- B+树一个节点可以有上千个子节点

**vs B树**
- B树非叶子节点也存储数据，导致扇出度降低
- B+树所有数据在叶子节点，非叶子节点只存索引
- B+树叶子节点有链表，范围查询效率高

**vs Hash索引**
- Hash只支持等值查询，不支持范围查询
- Hash不支持排序
- Hash不支持最左前缀匹配

**B+树特点**
- 高度通常为3-4层（千万级数据）
- 每个节点大小为16KB（InnoDB页大小）
- 叶子节点存储完整数据行（聚簇索引）或主键值（非聚簇索引）
- 支持顺序访问和范围查询`,
  
  code: `-- 1. 创建索引（底层使用B+树）
CREATE INDEX idx_age ON user(age);
CREATE INDEX idx_name_age ON user(name, age);

-- 2. 查看索引信息
SHOW INDEX FROM user;
SHOW CREATE TABLE user;

-- 3. 分析索引使用情况
EXPLAIN SELECT * FROM user WHERE age = 25;
EXPLAIN SELECT * FROM user WHERE age > 20 AND age < 30;

-- 4. B+树高度计算示例
-- 假设：
-- - InnoDB页大小：16KB
-- - 主键bigint：8字节
-- - 指针：6字节
-- - 每个非叶子节点可存储：16KB / (8+6) ≈ 1170个索引
-- 
-- 高度为3的B+树可以存储：
-- 1170 * 1170 * 16 ≈ 2000万条记录

-- 5. 聚簇索引（主键索引）
-- 叶子节点存储完整数据行
SELECT * FROM user WHERE id = 1; -- 直接通过主键查询

-- 6. 非聚簇索引（二级索引）
-- 叶子节点存储主键值，需要回表查询
SELECT * FROM user WHERE age = 25; 
-- 步骤：
-- 1) 通过age索引找到主键id
-- 2) 通过主键id回表查询完整数据

-- 7. 覆盖索引（避免回表）
CREATE INDEX idx_age_name ON user(age, name);
SELECT age, name FROM user WHERE age = 25; -- 不需要回表

-- 8. 范围查询（利用B+树叶子节点链表）
SELECT * FROM user WHERE age BETWEEN 20 AND 30;
SELECT * FROM user WHERE age > 20 ORDER BY age;

-- 9. 查看索引统计信息
ANALYZE TABLE user;
SELECT * FROM mysql.innodb_index_stats WHERE table_name = 'user';

-- 10. 索引碎片整理
OPTIMIZE TABLE user;
ALTER TABLE user ENGINE=InnoDB;`
}

