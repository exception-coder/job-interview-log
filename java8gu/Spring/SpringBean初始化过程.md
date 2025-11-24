spring_bean_initialization_process

（1）10 行极简速记版
✔ 实例化 ≠ 初始化，两者阶段不同
🔥 初始化核心入口：initializeBean
📌 实例化由构造器/工厂方法完成
➤ 初始化包含 Aware → 前置处理 → init → 后置处理
🧠 populateBean 负责属性注入（初始化前置步骤）
🚀 AOP 代理在后置处理阶段创建
⚠️ 三级缓存介入实例化前后，用于解决循环依赖
📈 afterPropertiesSet 与 init-method 属于初始化链
✨ BeanPostProcessor 串联所有初始化增强点
✔ 初始化完成后才是可用状态

---

##（2）折叠式知识卡片版

<details>
<summary><strong>1）定义</strong></summary>

Spring Bean 初始化（Initialization）指在 **实例化完成 + 属性注入完成** 后，进入一系列扩展处理、回调处理、初始化方法处理的阶段，使 Bean 真正准备好可供使用。
这是生命周期中最复杂、扩展点最多的部分。

</details>

<details>
<summary><strong>2）原理</strong></summary>

### ❖ 实例化 vs 初始化

* **实例化**：创建对象，执行构造函数或工厂方法 → `createBeanInstance()`
* **初始化**：对象已创建后，执行各种框架扩展逻辑 → `initializeBean()`

---

### ❖ 初始化完整流程（基于 Spring 6）

#### 1）实例化 Bean

* 通过构造器或工厂方法创建对象
* 代码入口：`AbstractAutowireCapableBeanFactory#createBeanInstance`

---

#### 2）三级缓存介入（解决循环依赖）

* 暴露早期引用（可能是代理）
* 代码在 `doCreateBean()` 里处理三级缓存
* 作用：避免构造器注入循环依赖失败

---

#### 3）属性注入 populateBean

* 注入字段、setter、自动装配依赖
* 代码：`populateBean()`

---

#### 4）进入 initializeBean（初始化核心阶段）

**(1) 处理 Aware 接口**

* BeanNameAware
* BeanClassLoaderAware
* BeanFactoryAware
  这些用于让 Bean 获取容器信息。

**(2) 执行前置 BeanPostProcessor**

* `postProcessBeforeInitialization()`
* 多数扩展点如 @PostConstruct 执行前的准备都在这里发生。

**(3) 调用初始化方法链**

* 调用 InitializingBean#afterPropertiesSet
* 调用自定义 init-method
* 调用 @PostConstruct（顺序在另一篇文章中详细解释）

**(4) 执行后置 BeanPostProcessor**

* `postProcessAfterInitialization()`
* **AOP 代理对象创建就在此阶段发生**

    * 关键类：`AnnotationAwareAspectJAutoProxyCreator`

---

### 初始化完成

Bean 已经具备全部增强（如 AOP 代理），进入可用状态。

</details>

<details>
<summary><strong>3）关键点</strong></summary>

* 初始化真正决定 Bean 的“最终形态”（尤其是 AOP 的代理替换）。
* 初始化中大量使用 BeanPostProcessor，Spring 的所有“魔法”几乎都源于此。
* populateBean 与 initializeBean 是生命周期中最核心的两个步骤。
* 三级缓存的本质目的：在初始化前提前暴露早期 Bean 引用避免循环依赖。
* Aware 接口是 Bean 与容器交互的官方入口。
* afterPropertiesSet、init-method、@PostConstruct 本质都是初始化链条的一部分。
* 若初始化阶段失败，Bean 会被销毁，不进入单例池。

</details>

<details>
<summary><strong>4）扩展知识</strong></summary>

* Bean 初始化阶段是框架能力与用户逻辑结合最密集的阶段（AOP、事务、校验、监听器都是在这里织入）。
* 初始化阶段的顺序决定了某些注解的执行先后，常见面试题：`@PostConstruct` vs `afterPropertiesSet` vs `init-method`。
* 配合循环依赖机制理解，可以完整掌握 Spring Bean 创建链。
* Spring Boot 自动装配等高级特性也依赖 BeanPostProcessor 体系。

</details>

---

##（3）面试官追问（Q&A）

**问：实例化、属性注入、初始化的核心区别是什么？**
答：实例化创建对象，属性注入填充依赖，初始化执行各种回调与增强，是三个独立阶段。

**问：AOP 代理对象是在什么时候生成的？**
答：在初始化的后置处理阶段 `postProcessAfterInitialization`。

**问：三级缓存为什么出现在初始化流程前？**
答：为了提前暴露引用，允许循环依赖的其他 Bean 在初始化前获取到“早期对象”。

**问：BeanPostProcessor 的两个处理方法有什么区别？**
答：before 在初始化前增强；after 在初始化后增强（例如代理）。

**问：构造器注入循环依赖为什么无法解决？**
答：因为实例未完成无法暴露早期引用，而 setter/字段注入允许实例化先完成。

**问：InitializingBean 和 init-method 有什么区别？**
答：前者通过接口回调实现，后者通过配置声明，两者都在初始化阶段执行。

**问：@PostConstruct 在什么阶段执行？**
答：在 BeanPostProcessor 前置逻辑之后，但在 init-method 之前。

**问：为什么 Spring 初始化阶段代码多但流程固定？**
答：为了提供大量可扩展点（Aware、BPP、AOP、回调等），但主流程仍由 doCreateBean 串连。

---

##（4）示意图（ASCII）

```
实例化阶段
  └─ createBeanInstance()

三级缓存暴露
  └─ earlySingletonExposure

属性注入
  └─ populateBean()

初始化阶段 initializeBean
    ├─ Aware 回调
    ├─ BeanPostProcessor.before
    ├─ afterPropertiesSet()
    ├─ init-method()
    └─ BeanPostProcessor.after（AOP代理创建）

Bean 就绪
```

```
核心调用链（简化）
doCreateBean
  ├─ createBeanInstance
  ├─ populateBean
  └─ initializeBean
```
