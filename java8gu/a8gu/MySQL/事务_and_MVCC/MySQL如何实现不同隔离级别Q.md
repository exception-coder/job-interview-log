# ✅MySQL如何实现不同隔离级别？

# 典型回答

MySQL 通过 **多版本并发控制（MVCC）** 和 **锁机制** 实现不同的事务隔离级别。以下是各隔离级别的实现原理及对应的并发控制手段：

| 隔离级别 | 脏读 | 不可重复读 | 幻读 | **实现机制** |
| **READ UNCOMMITTED** | 可能 | 可能 | 可能 | **直接读取最新数据（无版本控制）** |
| **READ COMMITTED** | 不可能 | 可能 | 可能 | **每次查询生成新 Read View** |
| **REPEATABLE READ** | 不可能 | 不可能 | 可能 | **事务开始时生成 Read View + Next-Key 锁** |
| **SERIALIZABLE** | 不可能 | 不可能 | 不可能 | **所有读操作加共享锁，写操作加排他锁** |

# 扩展知识
## MVCCInnoDB 通过 **Undo Log** 和 **Read View** 实现 MVCC：
​

​

- **Undo Log**：记录数据修改前的旧版本（版本链），用于构建历史快照。

- **Read View**：事务启动时生成，包含以下信息：- **trx_ids**，表示在生成ReadView时当前系统中活跃的读写事务的事务id列表。- **low_limit_id**，应该分配给下一个事务的id 值。- **up_limit_id**，未提交的事务中最小的事务 ID。- **creator_trx_id**，创建这个 Read View 的事务 ID。

**数据可见性规则**：
通过遍历版本链，选择符合以下条件的版本：
- 版本 `trx_id (最新修改该行的事务ID) < up_limit_id`→ 可见（已提交）。- 版本 `trx_id >= low_limit_id`→ 不可见（未来事务）。- 版本 `trx_id` 在 `tr_ids` 中 → 不可见（未提交）。- 其他情况 → 可见。

## 锁机制与幻读处理- **Next-Key 锁**（REPEATABLE READ 默认）：组合 **记录锁（行锁）** 和 **间隙锁（Gap Lock）**，防止幻读。（并不能完全解决）

- **SERIALIZABLE**：所有读操作隐式转换为 `SELECT ... FOR SHARE`，加共享锁。

​
