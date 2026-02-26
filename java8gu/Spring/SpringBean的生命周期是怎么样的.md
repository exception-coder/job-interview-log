spring_bean_lifecycle

（1）10 行极简速记版
✔ Bean 生命周期 = 创建 → 初始化 → 使用 → 销毁
🔥 核心入口：AbstractAutowireCapableBeanFactory#doCreateBean
📌 实例化在前，依赖注入紧随其后
🧠 初始化链极长：Aware → 前置处理 → init → 后置处理
🚀 Aware 阶段让 Bean 能拿到容器环境信息
✨ init 阶段可执行自定义逻辑（afterPropertiesSet/init-method）
📈 销毁依赖 DisposableBeanAdapter 统一调度
⚠️ destruction 回调是在创建阶段注册的，不是销毁阶段才注册
➤ 所有生命周期增强点本质由 BeanPostProcessor 驱动
✔ 生命周期理解是掌握 AOP/事务/IOC 的基础

---

## （2）折叠式知识卡片版

<details>
<summary><strong>1）定义</strong></summary>

Spring Bean 生命周期指一个 Bean **从创建 → 初始化 → 运行 → 销毁**的完整过程。
它由 Spring 容器统一调度，提供多处可扩展点（如 AOP、注解、事件等的切入点）。

</details>

<details>
<summary><strong>2）原理</strong></summary>

### 生命周期大阶段

1. **创建阶段**：实例化 + 属性注入 + 初始化
2. **使用阶段**：业务方法正常使用
3. **销毁阶段**：容器关闭时统一回调 destroy

### 生命周期 10 步细化流程

1. **实例化 Bean**

    * 通过 `createBeanInstance()` 创建对象。

2. **设置属性（依赖注入）**

    * `populateBean()` 注入依赖、填充属性。

3. **处理 Aware 接口**

    * 若 Bean 实现 BeanNameAware、BeanClassLoaderAware 等接口，则调用。

4. **前置处理（BeanPostProcessor）**

    * `postProcessBeforeInitialization()`，AOP/校验可在此切入。

5. **调用 InitializingBean#afterPropertiesSet**

    * 所有属性填充完毕后的初始化回调。

6. **执行自定义 init-method**

    * XML/注解配置的初始化方法。

7. **后置处理（BeanPostProcessor）**

    * `postProcessAfterInitialization()`，AOP 代理就在此阶段创建。

8. **注册销毁回调**

    * `registerDisposableBeanIfNecessary()`
    * 注册 DisposableBean / destroy-method。

9. **Bean 进入可用状态**

    * 正式参与业务请求。

10. **销毁阶段**

* DisposableBean#destroy
* 自定义 destroy-method
* 由 `DisposableBeanAdapter#destroy` 统一执行。

### 核心组件

* **AbstractAutowireCapableBeanFactory**：创建阶段主流程入口。
* **DisposableBeanAdapter**：销毁阶段统一执行器。
* **BeanPostProcessor**：生命周期增强的核心扩展器。

</details>

<details>
<summary><strong>3）关键点</strong></summary>

* 生命周期的所有“增强点”都由 **BeanPostProcessor** 打通，是 AOP/事务等功能启动的关键。
* 销毁回调是在创建阶段注册，而非销毁时临时判断。
* populateBean → initializeBean 顺序非常重要（属性注入先于初始化逻辑）。
* AOP 代理是在初始化后置处理阶段创建，而不是实例化阶段创建。
* 生命周期图常被画得复杂，但本质是：**实例化 → 填充 → 初始化 → 代理 → 使用 → 销毁**。

</details>

<details>
<summary><strong>4）扩展知识</strong></summary>

* `@PostConstruct` 属于初始化阶段，但优先级高于 init-method。
* `BeanFactoryPostProcessor` 与生命周期无直接关系，它在 Bean 创建前修改 BeanDefinition。
* 单例 Bean 全生命周期由容器管理；原型（prototype） Bean 不会执行 destroy 回调。
* AOP、事务、异步等框架能力都依赖生命周期中的代理创建时机。
* 理解 `initializeBean` 内部调用顺序是阅读 Spring 源码的关键基础。

</details>

---

## （3）面试官追问（Q&A）

**问：Bean 的实例化和初始化有什么区别？**
答：实例化是创建对象；初始化是对象创建完后执行的各种回调、后置处理和自定义逻辑。

**问：AOP 代理在哪个阶段创建？**
答：在初始化后置处理（`postProcessAfterInitialization`）阶段，而非实例化阶段。

**问：为什么 destruction 回调要在创建阶段注册？**
答：容器需要记录所有可销毁 Bean，避免销毁时遗漏，并简化关闭流程。

**问：依赖注入在生命周期的哪个环节？**
答：在实例化之后、初始化之前，由 populateBean 执行。

**问：afterPropertiesSet 和 init-method 的区别？**
答：前者是接口回调；后者是配置声明；二者会按顺序依次调用。

**问：BeanPostProcessor 有哪些作用？**
答：几乎所有框架能力（AOP、事务代理、@Autowired 处理等）都依赖它，是生命周期增强中心。

**问：prototype Bean 为什么不会执行 destroy？**
答：因为容器只负责创建，不管理生命周期结束。

**问：如何在生命周期中插入自定义逻辑？**
答：实现 InitializingBean/DisposableBean、定义 init-method/destroy-method、注册 BeanPostProcessor。

**问：为什么生命周期理解对面试重要？**
答：它解释了 Spring IOC、AOP、事务为何能工作，是 Spring 高级特性的根基。

---

## （4）示意图（ASCII）

```
Spring Bean Lifecycle

       ┌────────────┐
       │ 实例化 Instantiation
       └───────┬────┘
               ↓
       ┌────────────┐
       │ 属性填充 populateBean
       └───────┬────┘
               ↓
       ┌────────────┐
       │ Aware 回调
       └───────┬────┘
               ↓
       ┌────────────┐
       │ 前置处理 BPP.before
       └───────┬────┘
               ↓
       ┌────────────┐
       │ 初始化 init（afterPropertiesSet/init-method）
       └───────┬────┘
               ↓
       ┌────────────┐
       │ 后置处理 BPP.after（AOP 代理创建）
       └───────┬────┘
               ↓
       ┌────────────┐
       │ 使用阶段
       └───────┬────┘
               ↓
       ┌────────────┐
       │ 销毁 destroy
       └────────────┘
```
