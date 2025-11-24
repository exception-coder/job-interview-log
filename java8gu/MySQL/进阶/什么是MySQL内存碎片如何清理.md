总结标题：mysql_memory_fragment_cleanup

---

## 1）10 行极简速记版（纯文本）

✔ 内存/存储碎片来自频繁的增删改
🔥 碎片导致空间浪费与查询变慢
📌 Data_free 是判断碎片的关键指标
🚀 OPTIMIZE TABLE 可重建表并清理碎片
⚠️ 大表优化会锁表，需低峰期执行
✨ ALTER TABLE … ENGINE=InnoDB 也能重建表
📈 碎片多会放大备份与恢复耗时
🔍 碎片不必频繁清理，按需执行
🧠 高频写表需定期关注碎片情况
✘ 大量碎片长期不处理会拖垮 I/O

---

## 2）折叠式知识卡片版（Markdown）

<details>
<summary>定义</summary>

MySQL 中的“碎片”主要指表数据页中存在大量未使用的空间，即物理存储不连续、页利用率下降。其来源是频繁的 **insert / update / delete** 操作导致页分裂、行迁移、空洞产生。

碎片影响存储与性能，需要在合适的时机清理。

</details>

<details>
<summary>原理</summary>

### 1. 碎片产生机制

* **INSERT**：页分裂、写入位置跳动
* **UPDATE**：行变长 → 行迁移 → 留下空洞
* **DELETE**：标记删除但不立即释放空间（InnoDB 不回收页）

最终导致：

* 页利用率降低
* 扫描页数增多
* 备份文件变大
* I/O 成本提升

### 2. 清理碎片的方式

#### （1）OPTIMIZE TABLE

```
OPTIMIZE TABLE table_name;
```

作用：

* 重建表
* 重新整理数据页顺序
* 回收未使用空间
* 重建索引

代价：

* 会锁表（MyISAM 完全锁表，InnoDB 加共享锁）
* 对大表耗时长
* 索引多时更慢
* 建议在**业务低峰期**执行

#### （2）ALTER TABLE 重建表

```
ALTER TABLE table_name ENGINE=InnoDB;
```

效果同 OPTIMIZE，底层通过“重建表”实现碎片整理。

</details>

<details>
<summary>关键点</summary>

* 碎片来源：页分裂 + 行迁移 + delete 空洞
* Data_free 越大，碎片越多
* 不必频繁清理，按需处理
* 大表优化前需评估锁表风险
* OPTIMIZE/ALTER 实际都是“新建表 → 拷贝数据 → 重建索引 → 换表”过程
* 碎片越多，备份、恢复、全表扫描都会变慢

</details>

<details>
<summary>扩展知识</summary>

* 碎片并非只影响空间，也会增加 buffer pool miss 率
* 可通过以下方式查看碎片：

  ```
  SHOW TABLE STATUS LIKE 'table_name';
  ```

  关注 `Data_free` 字段
* INFORMATION_SCHEMA.TABLES 也可查看 Data_free
* 大表建议使用 pt-online-schema-change 等工具进行在线重建
* 频繁 delete 的表更容易产生碎片，可考虑分区或冷热分表

</details>

---

## 3）面试官追问（Q&A）

**问：为什么 InnoDB delete 后空间不立即回收？**
答：InnoDB 设计依赖 MVCC 和 undo 保留历史版本，因此不会物理删除页，只标记可复用，导致碎片累积。

**问：OPTIMIZE TABLE 本质是什么？**
答：通过重建表来重新组织数据页与索引，实质是“创建新表 → 拷贝 → 替换”。

**问：Data_free 到什么程度需要优化？**
答：没有固定标准，但若 Data_free 占表大小 20%+ 或查询明显变慢，则需要重建。

**问：为什么大表不建议频繁 OPTIMIZE？**
答：会锁表、耗时长、影响业务，且碎片产生是持续性的，过度优化收益不高。

**问：ALTER TABLE ENGINE=InnoDB 与 OPTIMIZE 有何差异？**
答：核心一样，都是“重建表”；执行路径和日志行为略有不同。

**问：碎片会影响索引性能吗？**
答：是的，页分布不连续会增加随机 I/O，降低索引扫描性能。

**问：如何避免频繁碎片？**
答：避免频繁删除和变长字段更新，合理设计 schema，必要时使用分区或冷热分表。

---

## 4）示意图（ASCII）

```
          碎片产生 → 空洞/页分裂

   [Page1] [Page2] [Page3]
      ↑       ↑       ↑
   删除空洞  更新迁移  页分裂

          ↓  ↓  ↓

        空间不连续，磁盘浪费

        清理方法：

        OPTIMIZE TABLE
               │
               ▼
   [重建新表] → [整理页] → [回收空间]
```
