spring_6_springboot_3_new_features

（1）10 行极简速记版
✔ Spring 6/SB 3 全面要求 JDK 17 起步
🔥 核心依赖从 JavaEE 迁移到 Jakarta EE 9/10
🚀 内置 AOT 支持，引入提前编译优化启动性能
✨ 原生镜像（GraalVM Native Image）正式转正
📌 Spring Native 合并入 Spring，支持无需 JVM 运行
🧠 AOT 解决启动慢/内存大/类反射难优化等问题
⚠️ Native Image 构建耗时长但运行极快
📈 Spring 生态全面拥抱云原生与轻量化部署
➤ AOT + Native 是未来十年 Spring 的战略方向
✔ Spring 6 = 新时代的基础平台

---

##（2）折叠式知识卡片版

<details>
<summary><strong>1）定义</strong></summary>

* **Spring 6.0**：Spring Framework 新一代版本，最低要求 **JDK 17**，并全面转向 **Jakarta EE 9/10**。
* **Spring Boot 3.0**：基于 Spring 6 的新基线，重点支持 AOT、GraalVM 原生镜像和云原生部署。

</details>

<details>
<summary><strong>2）原理</strong></summary>

### Spring 6 + Spring Boot 3 四大变化：

#### ① 基线提升：Java 17

* 所有旧版本（8/11/16）全部被移除支持。
* 强制使用 Java 17（LTS），利用新字节码与语言能力。

#### ② 迁移到 Jakarta EE 9/10

* 所有 `javax.*` → `jakarta.*`
* 影响 Spring MVC、JPA、Validation、Servlet 等所有依赖老规范的框架组件。

#### ③ AOT 编译（Ahead of Time）引入

* 在运行前进行静态分析与代码生成，减少反射、动态代理开销。
* 优化点：

    * 启动更快
    * 内存更小
    * 更利于原生镜像

#### ④ GraalVM Native Image（Spring Native）整合

* 原生镜像无需 JVM，生成一个可执行二进制文件

* 优点：

    * 启动毫秒级
    * 内存减少 60–90%
    * 云原生部署友好（Serverless、K8s、Edge）

* 缺点：

    * 构建时间更长
    * 对反射、动态代理、类路径扫描等能力有限制，需 AOT 提前准备

</details>

<details>
<summary><strong>3）关键点</strong></summary>

* Spring Native 不再是独立项目，已完全内置在 Spring Boot 3.0。
* AOT 处理器会在构建时自动生成反射/代理等元信息，帮助构建原生镜像。
* Spring 6 的目的是让整个生态“可预测化、可静态化、可原生化”。
* 新架构要求企业系统必须考虑 Java 17 的迁移成本。
* Native Image 特别适合：微服务、边缘计算、Serverless。

</details>

<details>
<summary><strong>4）扩展知识</strong></summary>

* Java 17 的关键能力（sealed、record、pattern matching）对 Spring 有结构优势。
* AOT 不是代替 JIT，而是互补，更适合长期运行、多实例、云环境。
* Spring 6 还为未来 Loom（虚拟线程）做好预留。
* Spring Boot 3 与 Kubernetes / GraalVM / Cloud 环境深度适配。

</details>

---

##（3）面试官追问（Q&A）

**问：为何要强制要求 Java 17？**
答：为了使用更高效的 JVM 特性与字节码结构，并简化兼容性维护，降低框架复杂度。

**问：Jakarta EE 迁移带来什么影响？**
答：所有 `javax.*` 包彻底废弃，所有第三方依赖也必须同步迁移，否则编译失败。

**问：AOT 编译的本质是什么？**
答：提前生成代理、反射、资源列表、类初始化等元数据，减少运行时动态分析。

**问：原生镜像为何启动快？**
答：不需要 JVM、无类加载、无 JIT、无反射，所有代码提前编译成机器指令。

**问：Spring Native 与 AOT 的关系？**
答：AOT 是核心技术；Native 是 AOT 的最终产出形式（native image）。

**问：使用 Native Image 会让 Spring 变轻吗？**
答：运行时轻，但编译更重；适合云原生、函数计算、容器化微服务。

**问：Spring Boot 3 最大改变是什么？**
答：AOT + Native 一体化，是官方级正式支持。

---

##（4）示意图（ASCII）

```
Spring 6 / Boot 3 关键架构变化
 ┌──────────────────────────────────┐
 │   Java 17 baseline               │
 ├──────────────────────────────────┤
 │   Jakarta EE 9/10 (jakarta.*)   │
 ├──────────────────────────────────┤
 │   AOT Engine (build-time ops)   │
 ├──────────────────────────────────┤
 │   GraalVM Native Image support  │
 └──────────────────────────────────┘
```

```
AOT vs JIT
JIT：运行时编译 → 启动慢 → 性能逐渐提升  
AOT：构建期编译 → 启动极快 → 性能无需预热
```

```
Native Image 运行结构
Source → AOT → Native Config → Native Image(binary)
（无需 JVM）
```
