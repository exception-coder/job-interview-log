import type { KnowledgeBlockContent } from '../../types'

/**
 * ACID特性 - 详细内容
 */
export const acidContent: KnowledgeBlockContent = {
  id: 'acid',
  title: 'ACID特性',
  description: `**事务的ACID特性**

**1. 原子性（Atomicity）**
- 事务是不可分割的最小单位
- 要么全部成功，要么全部失败回滚
- 实现机制：undo log（回滚日志）

**2. 一致性（Consistency）**
- 事务执行前后，数据库从一个一致性状态到另一个一致性状态
- 数据完整性约束不被破坏
- 例如：转账前后总金额不变

**3. 隔离性（Isolation）**
- 多个事务并发执行时，相互隔离互不干扰
- 通过锁机制和MVCC实现
- 四种隔离级别：RU、RC、RR、Serializable

**4. 持久性（Durability）**
- 事务一旦提交，对数据库的改变是永久的
- 即使系统崩溃，数据也不会丢失
- 实现机制：redo log（重做日志）

**实现机制**
- 原子性：undo log
- 持久性：redo log
- 隔离性：锁 + MVCC
- 一致性：以上三者保证`,
  
  code: `-- 1. 原子性示例：转账操作
START TRANSACTION;

-- 扣减A账户余额
UPDATE account SET balance = balance - 100 WHERE user_id = 1;

-- 增加B账户余额
UPDATE account SET balance = balance + 100 WHERE user_id = 2;

-- 如果中间出错，整个事务回滚
COMMIT; -- 或 ROLLBACK;

-- 2. 原子性：部分失败自动回滚
START TRANSACTION;
INSERT INTO orders (user_id, amount) VALUES (1, 100);
INSERT INTO orders (user_id, amount) VALUES (2, 200);
-- 假设这里发生错误（如违反约束）
INSERT INTO orders (user_id, amount) VALUES (NULL, 300); -- 失败
COMMIT; -- 整个事务回滚，前两条INSERT也不会生效

-- 3. 一致性示例：保证数据完整性
START TRANSACTION;

-- 检查余额是否足够
SELECT balance FROM account WHERE user_id = 1 FOR UPDATE;

-- 如果余额足够才执行转账
UPDATE account SET balance = balance - 100 WHERE user_id = 1 AND balance >= 100;
UPDATE account SET balance = balance + 100 WHERE user_id = 2;

COMMIT;

-- 4. 一致性：外键约束保证
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- 无法插入不存在的user_id
INSERT INTO orders (id, user_id, amount) VALUES (1, 999, 100); -- 失败

-- 5. 隔离性示例：避免脏读
-- 会话1
START TRANSACTION;
UPDATE account SET balance = balance - 100 WHERE user_id = 1;
-- 未提交

-- 会话2（READ COMMITTED隔离级别）
SELECT balance FROM account WHERE user_id = 1; -- 看不到未提交的修改

-- 会话1
COMMIT; -- 提交后会话2才能看到

-- 6. 持久性示例：提交后数据永久保存
START TRANSACTION;
INSERT INTO user (name, age) VALUES ('张三', 25);
COMMIT; -- 提交后，即使MySQL崩溃重启，数据也不会丢失

-- 7. 查看事务隔离级别
SELECT @@transaction_isolation;
SHOW VARIABLES LIKE 'transaction_isolation';

-- 8. 设置事务隔离级别
-- 会话级别
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- 全局级别
SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- 9. 查看InnoDB事务信息
SELECT * FROM information_schema.INNODB_TRX;

-- 10. 查看redo log和undo log配置
SHOW VARIABLES LIKE 'innodb_log%';
SHOW VARIABLES LIKE 'innodb_undo%';

-- 11. 保存点（Savepoint）
START TRANSACTION;
INSERT INTO user (name) VALUES ('张三');
SAVEPOINT sp1;

INSERT INTO user (name) VALUES ('李四');
SAVEPOINT sp2;

INSERT INTO user (name) VALUES ('王五');

-- 回滚到sp2，只撤销"王五"
ROLLBACK TO sp2;

-- 回滚到sp1，撤销"李四"和"王五"
ROLLBACK TO sp1;

COMMIT; -- 只提交"张三"`
}

