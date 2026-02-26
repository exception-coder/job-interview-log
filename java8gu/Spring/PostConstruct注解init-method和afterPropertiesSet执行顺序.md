postconstruct_initmethod_afterpropertiesset

（1）10 行极简速记版
✔ 初始化链固定顺序：构造 → @PostConstruct → afterPropertiesSet → init-method
📌 @PostConstruct 由 BeanPostProcessor 前置阶段触发
🔥 afterPropertiesSet 属于 InitializingBean 回调
✨ init-method 属于 XML/@Bean 显式配置
🧠 三者都是初始化阶段，但触发点不同
➤ 核心入口：initializeBean → before → init → after
📈 注解方式优先于接口方式，接口优先于配置方式
✔ 原理可从 invokeInitMethods & BeanPostProcessor 找到
⚠️ @PostConstruct 执行依赖 CommonAnnotationBeanPostProcessor
🚀 理解顺序 = 理解初始化链路的关键考点

---

##（2）折叠式知识卡片版

<details>
<summary><strong>1）定义</strong></summary>

三种初始化方式：

* **@PostConstruct**：注解式初始化方法，由 CommonAnnotationBeanPostProcessor 识别。
* **afterPropertiesSet**：实现 InitializingBean 的回调接口。
* **init-method**：XML 配置或 @Bean(initMethod="...") 指定的方法。

三者均属于 Spring Bean 初始化阶段的“初始化逻辑”。

</details>

<details>
<summary><strong>2）原理</strong></summary>

### 初始化链路顺序来源

Spring 在执行 initializeBean 时，顺序如下：

1. **构造函数执行** → 完成对象实例化
2. **populateBean** → 依赖注入完成
3. **applyBeanPostProcessorsBeforeInitialization**

    * 其中 CommonAnnotationBeanPostProcessor 检测并执行 **@PostConstruct**
4. **invokeInitMethods**

    * Step1：If Bean implements InitializingBean → 执行 **afterPropertiesSet()**
    * Step2：If init-method configured → 执行 **init-method**
5. **applyBeanPostProcessorsAfterInitialization**

    * 例如 AOP 代理在这阶段创建

因此顺序必然是：

**构造函数 → @PostConstruct → afterPropertiesSet → init-method**

### @PostConstruct 如何被触发

* CommonAnnotationBeanPostProcessor

    * 注册 initAnnotationTypes（默认包含 PostConstruct）
    * 在前置处理阶段执行这类方法

### afterPropertiesSet 如何被触发

* initializeBean → invokeInitMethods →
  判断是否实现 InitializingBean，若是执行 afterPropertiesSet

### init-method 如何触发

* 同样在 invokeInitMethods
* afterPropertiesSet 之后执行配置的 init-method

</details>

<details>
<summary><strong>3）关键点</strong></summary>

* 三者都是初始化的一部分，但触发机制完全不同。
* Spring 的 Bean 初始化链条由 **BeanPostProcessor + InitializingBean + 配置方法**组成。
* @PostConstruct 依赖注解处理器，因此其优先级最高。
* afterPropertiesSet 属于接口回调，因此高于配置方式。
* init-method 最后执行，属于“声明式、外部化配置”。
* 以上顺序不是人为约定，而是由 initializeBean 的调用栈决定。

</details>

<details>
<summary><strong>4）扩展知识</strong></summary>

* Spring Boot 3.x 使用 Jakarta 版本的 PostConstruct，需要导入 jakarta.annotation API。
* 常见初始化方式还有：`@Bean(initMethod=...)` 与自定义 BeanPostProcessor。
* 初始化顺序是 AOP 与 BeanPostProcessor 工作前提之一。
* 销毁阶段对应：`@PreDestroy` → `DisposableBean#destroy` → `destroy-method`。

</details>

---

##（3）面试官追问（Q&A）

**问：为什么 @PostConstruct 优先级最高？**
答：因为它在 BeanPostProcessor 前置阶段执行，而 invokeInitMethods 在其后才触发。

**问：如果一个 Bean 同时定义了三者会怎样？**
答：依次全部执行，顺序固定不变：构造 → @PostConstruct → afterPropertiesSet → init-method。

**问：@Bean(initMethod) 与 InitializingBean 的关系？**
答：都是初始化方法，但 init-method 优先级更低，属于外部配置，不属于接口约束。

**问：AOP 代理是否影响这些初始化顺序？**
答：不会，AOP 代理创建发生在 afterProcessing（后置处理），即 init-method 之后。

**问：初始化顺序能否改变？**
答：不行，固定由 initializeBean 调用栈决定，除非自定义 BeanPostProcessor 并篡改顺序（非常不推荐）。

**问：构造函数后立即执行 @PostConstruct，有什么隐含含义？**
答：意味着依赖注入必须已经完成，否则注入失败会导致初始化失败。

---

##（4）示意图（ASCII）

```
初始化链路（核心）

      ┌── 构造方法
      ↓
populateBean（依赖注入完成）
      ↓
applyBeanPostProcessorsBeforeInitialization
      └── @PostConstruct
      ↓
invokeInitMethods
      ├── afterPropertiesSet()
      └── init-method
      ↓
applyBeanPostProcessorsAfterInitialization
（AOP 代理生成）
```

```
执行顺序（最终答案）
构造函数
   ↓
@PostConstruct
   ↓
afterPropertiesSet
   ↓
init-method
```
