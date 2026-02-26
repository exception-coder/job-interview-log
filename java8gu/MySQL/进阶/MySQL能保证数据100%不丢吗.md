mysql_data_loss_guarantee

（1）10 行极简速记版
✔ MySQL 做不到 100% 不丢数据
⚠️ Memory 引擎断电必丢，磁盘引擎仍有风险
📌 Redo + Binlog 两阶段提交也不是绝对安全
🧠 write ≠ 落盘；fsync 也可能被骗（硬件缓存）
🚀 innodb_flush_log_at_trx_commit=1 才是最安全模式
➤ sync_binlog=1 才能保证 binlog 每次都刷盘
🔥 RAID/SSD 若无掉电保护，fsync 仍不可靠
✨ 极端情况下：掉电、硬盘坏、RAID 缓存丢 → 数据仍飞
📈 想更稳：BBU + RAID10 + 强制 fsync
✘ 100% 不丢是伪命题，只能“无限接近”

---

## （2）折叠式知识卡片版

<details>
<summary><strong>1）定义</strong></summary>

* MySQL 数据持久性取决于：**存储引擎、日志刷盘策略、硬件可靠性**。
* 即便使用 InnoDB（磁盘存储 + 事务日志），仍无法达到绝对意义上的 100% 不丢数据。
* 数据写入涉及多级缓存：LogBuffer → OS Cache → 硬件缓存 → 磁盘介质。

</details>

<details>
<summary><strong>2）原理</strong></summary>

### （1）日志落盘链路

* **Redo Log**：InnoDB 负责崩溃恢复
* **Binlog**：Server 层负责归档与主从同步
* **两阶段提交（2PC）**确保两类日志一致性，但前提是日志真正落盘

### （2）关键参数

* **innodb_flush_log_at_trx_commit**

    * 1：每次提交 write + fsync（最安全）
    * 0：仅写 LogBuffer，后台线程每秒 fsync
    * 2：write 到 OS Cache，每秒刷盘

* **sync_binlog**

    * 1：每次提交 fsync binlog
    * 0：仅写 OS Cache
    * N：每 N 次提交 fsync

### （3）write/fsync 的本质

* write() → 写 OS Page Cache，不落盘
* fsync() → 请求刷盘，但硬件可能缓存（Write-back）

</details>

<details>
<summary><strong>3）关键点</strong></summary>

* 调整参数为 1/1 可以极大提高“提交即落盘”概率，但不能保证底层硬件真的写入。
* RAID/SSD 缓存若无保护，即便 fsync 也可能“欺骗成功”。
* 掉电、主板故障、硬盘损坏可在任何环节导致数据丢失。
* 2PC 仅保证 redo/binlog 一致，而不保证真正物理落盘。
* Memory 引擎天生无法保证持久性。
* 真正的可靠性需要 **数据库配置 + 硬件能力 + RAID 架构**共同保证。

</details>

<details>
<summary><strong>4）扩展知识</strong></summary>

* 可靠生产环境一般采用：

    * **innodb_flush_log_at_trx_commit=1**
    * **sync_binlog=1**
    * **RAID10 + BBU**
    * **支持掉电保护的企业级 SSD**
    * 部署 UPS
* 进一步通过主从复制 + 备份提高容灾，但无法避免“瞬间掉电导致日志未落盘”这种极端情况。
* 分布式一致性协议（如 Paxos/Raft）能进一步提升可靠性，但仍无法达到绝对 100%。

</details>

---

## （3）面试官追问（Q&A）

**问：为什么 MySQL 无法做到 100% 不丢数据？
答：因为写入链路依赖 OS 缓存与硬件缓存，fsync 也可能被欺骗，掉电或硬件故障可在落盘前丢失数据。**

**问：2PC 是否能完全避免数据丢？
答：不行，2PC 仅保证 redo 与 binlog 一致，不保证物理落盘成功。**

**问：innodb_flush_log_at_trx_commit=1 是否绝对安全？
答：不是，它只能保证 InnoDB 在提交时执行 fsync，但硬件是否真正落盘不受控制。**

**问：为什么硬件缓存会“欺骗 fsync”？
答：RAID 卡或 SSD 的 write-back 缓存可能将数据暂存在缓存中并告诉系统已经完成，掉电则丢失。**

**问：sync_binlog=0 有什么风险？
答：binlog 落盘依赖系统后台调度，一旦实例宕机，所有未 fsync 的 binlog 会丢失。**

**问：Memory 引擎为什么一定丢？
答：其数据全部在内存，没有持久化路径。**

**问：使用 RAID10 + BBU 为什么更安全？
答：BBU 可以在掉电时保护缓存数据，使 fsync 写入的数据能够保证最终落盘。**

**问：如何做到最接近不丢？
答：配置 1/1、企业级 SSD、RAID10+BBU、UPS、多副本复制、周期备份，叠加多层防护。**

**问：为什么“写入成功”与“真正落盘”不是同一件事？
答：因为 write 和部分 fsync 仅保证写入缓存，不保证数据到达磁介质。**

---

## （4）示意图（ASCII）

```
写入路径（越往下越接近真正安全）

LogBuffer
   ↓
OS Page Cache (write)
   ↓
硬件缓存（RAID/SSD Cache）
   ↓
磁盘介质（真正写入）
```

```
默认参数 vs 强一致参数

Redo: innodb_flush_log_at_trx_commit
  0 → 不落盘
  2 → 写 OS Cache
  1 → write + fsync → 最安全

Binlog: sync_binlog
  0 → 写缓存
  N → N 次提交 fsync
  1 → 每次 fsync → 最安全
```

```
仍可能丢失的场景

掉电 → RAID 缓存丢 → 日志未落盘 → 数据丢
磁盘坏、主板坏 → 未同步数据丢
Memory 引擎 → 必丢
```
