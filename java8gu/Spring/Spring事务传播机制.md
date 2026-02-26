spring_tx_propagation

（1）10 行极简速记版
✔ Spring 事务传播 = 嵌套调用时的“事务接力规则”
📌 REQUIRED：默认，能合并就合并，一个大事务
🔥 REQUIRES_NEW：强制新事务，外层挂起
✨ SUPPORTS：有就跟，没有就裸跑
⚠️ NOT_SUPPORTED：暂停事务，纯非事务运行
✘ NEVER：一旦在事务中调用直接报错
📈 MANDATORY：必须要有事务，否则异常
🧠 NESTED：子事务带 savepoint，可部分回滚
➤ 读写分离场景：末尾读用 NOT_SUPPORTED，中间读用 REQUIRED
🚀 传播机制 = 构建复杂业务一致性的核心

---

##（2）折叠式知识卡片版

<details>
<summary><strong>1）定义</strong></summary>

Spring **事务传播机制（Transaction Propagation）** 用于控制方法在**已有事务上下文中的行为**。

适用于业务方法相互嵌套调用时，决定：

* 是否加入现有事务
* 是否新建事务
* 是否挂起事务
* 是否允许事务存在

用于保证调用链的一致性与数据完整性。

</details>

<details>
<summary><strong>2）原理</strong></summary>

### 七种传播行为

| 传播机制              | 行为说明                                  |
| ----------------- | ------------------------------------- |
| **REQUIRED（默认）**  | 有就加入，没有就创建；始终只有一个事务                   |
| **REQUIRES_NEW**  | 挂起外层，强制开启新事务                          |
| **SUPPORTS**      | 有事务则加入，无事务则非事务执行                      |
| **NOT_SUPPORTED** | 若已有事务 → 暂停该事务，无事务则直接执行                |
| **MANDATORY**     | 必须在事务内，否则抛异常                          |
| **NEVER**         | 不能有事务；若存在事务则抛异常                       |
| **NESTED**        | 在父事务内创建子事务（savepoint）；子回滚不影响父，父回滚会影响子 |

### rollbackFor

决定哪些异常会触发事务回滚：

* 默认：`RuntimeException`、`Error`
* 自定义：`rollbackFor = Exception.class` 可以覆盖所有检查异常

</details>

<details>
<summary><strong>3）关键点</strong></summary>

* REQUIRED 是“常规业务”最常用的合并事务策略
* REQUIRES_NEW 用于：日志落库、补偿逻辑、独立性强的子流程
* NESTED 依赖 JDBC savepoint，仅在部分事务管理器支持
* NEVER、MANDATORY 更多用于框架级约束
* NOT_SUPPORTED 用于：**读写分离场景下的末尾读取，避免因读错误触发全局回滚**
* 传播机制只在 **代理调用** 下生效（自调用无效）

</details>

<details>
<summary><strong>4）扩展知识</strong></summary>

### 使用案例（A 调用 B）

* A/B 都是 REQUIRED → 一个整体事务
* A = REQUIRED，B = REQUIRES_NEW → B 的回滚不影响 A
* A = REQUIRED，B = NOT_SUPPORTED → B 不参与事务
* A = REQUIRED，B = NESTED → B 能独立回滚到 savepoint

### 读写分离中的典型策略

```
A（写） → B（读） → C（写）

- 若 B 是末尾读 → NOT_SUPPORTED
- 若 B 是中间逻辑、失败需回滚 A → REQUIRED
```

</details>

---

##（3）面试官追问（Q&A）

**问：REQUIRED 和 REQUIRES_NEW 的本质区别是什么？**
答：REQUIRED 合并事务，而 REQUIRES_NEW 挂起当前事务并独立执行，是完全隔离的两次提交。

**问：NESTED 与 REQUIRES_NEW 区别？**
答：NESTED 使用 savepoint，属于父事务的一部分；REQUIRES_NEW 则开启真正的新事务。

**问：SUPPORTS 在无事务情况下调用会怎样？**
答：非事务执行，与普通方法无差别。

**问：NOT_SUPPORTED 为什么用于最终读？**
答：避免因查库失败导致整个事务回滚。

**问：MANDATORY 常见场景？**
答：框架层约束，例如调用方必须确保事务上下文。

**问：自调用为什么导致传播行为失效？**
答：事务依赖代理对象的增强，自调用绕过代理。

**问：rollbackFor 为什么要显式指定 Exception.class？**
答：否则检查异常不会触发回滚，行为不符合业务预期。

---

##（4）示意图（ASCII）

```
事务传播决策树

          ┌─ 有事务 ─────────────────────┐
          │                              │
      REQUIRED → 加入                    REQUIRES_NEW → 挂起旧事务，新开事务
      SUPPORTS → 加入                    NOT_SUPPORTED → 暂停事务，非事务执行
      MANDATORY → 加入                   NEVER → 报错
      NESTED → 创建 savepoint
          │
          └─ 无事务 ────────┐
                            │
      REQUIRED → 新建事务   SUPPORTS → 非事务执行
      REQUIRES_NEW → 新建   NOT_SUPPORTED → 非事务执行
      MANDATORY → 报异常    NEVER → 非事务执行
      NESTED → 等价 REQUIRED（无父事务）
```
