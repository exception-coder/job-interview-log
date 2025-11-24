spring_aop_intro

（1）10 行极简速记版
✔ AOP = 把横切逻辑抽离成切面集中管理
🔥 核心价值：解耦、复用、统一控制、增强业务
📌 JoinPoint = 哪个方法；Advice = 做什么；PointCut = 在哪里
➤ 典型场景：日志、权限、事务、监控、限流
🧠 Spring AOP 核心基于动态代理实现
🚀 有接口走 JDK 动态代理，无接口走 CGLIB
✨ 代理创建时机：Bean 初始化后置处理阶段
📈 @Aspect + @EnableAspectJAutoProxy → 注解驱动切面
⚠️ Spring AOP 仅支持方法级别，不做字节码全局 weaving
✔ 底层关键链路：wrapIfNecessary → createProxy

---

## （2）折叠式知识卡片版

<details>
<summary><strong>1）定义</strong></summary>

* AOP（Aspect Oriented Programming）= 面向切面编程，是 OOP 的补充，专注于抽离公共逻辑（横切关注点）。
* 典型使用：权限校验、日志打印、事务管理、异常处理、性能监控。
* Spring AOP 是对 AOP 思想的实现，基于代理动态增强方法行为。

</details>

<details>
<summary><strong>2）原理</strong></summary>

### AOP 核心术语

* **Aspect（切面）**：切点定义 + 通知逻辑
* **JoinPoint（连接点）**：可被增强的方法执行点
* **PointCut（切入点）**：匹配哪些方法需要织入
* **Advice（通知）**：增强逻辑（before/after/around）
* **Target（目标对象）**：被增强的业务类
* **Weaving（织入）**：把增强逻辑织入目标类的过程（Spring 在运行期织入）

### Spring 实现机制

1. Bean 初始化阶段 → 执行后置处理器
2. `AbstractAutoProxyCreator` 在 `postProcessAfterInitialization` 检测是否需要代理
3. 满足条件 → `wrapIfNecessary()` → `createProxy()`
4. 使用 JDK/CGLIB 构建代理对象
5. 方法调用通过代理拦截器链增强

### 代理选择

* **JDK 动态代理**：目标类实现接口
* **CGLIB 代理**：目标类无接口（生成子类字节码）

</details>

<details>
<summary><strong>3）关键点</strong></summary>

* Spring AOP 是**运行时代理**，并非字节码级编译期织入。
* 只支持**方法级别**增强，不支持字段、构造器（属于 AspectJ 完整能力）。
* AOP 的本质是通过代理模式，在方法调用前后插入统一逻辑。
* AOP 是事务、日志、监控体系的底层基础能力。
* @AspectJ 风格更强大，可按表达式精确匹配方法。
* 拦截链（Interceptor Chain）允许多个切面叠加。

</details>

<details>
<summary><strong>4）扩展知识</strong></summary>

* AOP 的拦截链与 Servlet Filter、Netty Pipeline、Dubbo Filter 本质类似：链式增强模型。
* 环绕通知（@Around）最灵活，可手动控制 proceed()，几乎可实现全部增强类型。
* SpringBoot 自动启用 AOP，需要 spring-aop & aspectjweaver 依赖。
* AOP 代理对象替代原始 Bean，因此循环依赖等场景需特别处理（尤其是 CGLIB）。
* 静态代理 vs 动态代理：Spring AOP 全基于动态代理。

</details>

---

## （3）面试官追问（Q&A）

**问：AOP 与 OOP 是什么关系？
答：OOP 关注纵向抽象（类/对象），AOP 关注横向抽离（多个类共享的逻辑），二者互补。**

**问：什么时候用 JDK 代理，什么时候用 CGLIB？
答：有接口走 JDK，无接口走 CGLIB；CGLIB 通过继承生成子类，无法代理 final 方法。**

**问：AOP 代理是在什么时候创建的？
答：Bean 初始化完成后，在 BeanPostProcessor 的 after 阶段创建代理。**

**问：AOP 支持字段级别切点吗？
答：Spring AOP 不支持，只有 AspectJ（编译期织入）支持字段/构造器切点。**

**问：Around 与 Before/After 有何区别？
答：Around 能控制方法调用（proceed），其余通知只是简单前置/后置增强。**

**问：AOP 能否保证事务一定生效？
答：事务依赖代理机制，只有通过代理调用才生效；自调用无法触发切面。**

**问：为什么 AOP 常用于日志、监控？
答：因为这是典型横切逻辑，不能散落在业务代码中。**

**问：Spring AOP 会影响性能吗？
答：有少量代理开销，但远低于网络 IO、锁竞争，可忽略。**

**问：为什么 AOP 不能代理 private 方法？
答：代理需要在方法调用入口织入逻辑，private 方法不会经过代理对象调用链。**

---

## （4）示意图（ASCII）

```
业务流程（无 AOP）
Controller → Service → DAO
(每层都写日志/校验/事务)
```

```
AOP 织入后
Aspect
 ├─ Before
 ├─ Around
 └─ After
↓
代理对象
↓
Service.method()
```

```
代理创建流程
Bean 初始化
    ↓
postProcessAfterInitialization
    ↓
wrapIfNecessary
    ↓
createProxy (JDK/CGLIB)
    ↓
返回代理对象
```
