总结标题
Spring_Autowired_vs_Resource

---

## 1）10 行极简速记版（纯文本）

✔ Autowired 属于 Spring，Resource 属于 JSR-250 标准
✔ Resource 容器可迁移性强，Autowired 仅限 Spring
✔ Autowired 先按类型再按名称；Resource 先按名称再按类型
✔ Resource 不支持构造器注入；Autowired 支持
✔ Autowired 可 required=false，依赖可选；Resource 依赖必须存在
✔ 多实现场景下 Autowired 需配合 Qualifier；Resource 亦同
✔ Resource 默认 byName 更直观但更容易因找不到名字报错
✔ Autowired 默认强类型注入，拓展性更强
✔ Resource 更符合标准规范但特性较弱
✔ 实战中推荐构造器 + Autowired/无注解方式，Resource 辅助使用

---

## 2）折叠式知识卡片版（Markdown）

<details>
<summary><b>定义</b></summary>

* **@Autowired**：Spring 框架提供的依赖注入注解，支持构造器、字段、Setter。
* **@Resource**：JSR-250（Jakarta EE）标准注解，支持字段、Setter 注入，强调按名称寻找。
* 两者都可完成 Bean 注入，但来源、匹配策略、能力不同。

</details>

<details>
<summary><b>原理</b></summary>

* **Autowired**

    * 优先 **ByType** 查找 → 再 **ByName** 匹配。
    * 若多实现 → 需要 `@Qualifier` 指定。
    * 支持构造器注入，配合 required 属性控制依赖可选性。

* **Resource**

    * 优先 **ByName** → 再按类型匹配。
    * JDK 标准注解，适用于任何支持 JSR-250 的容器。
    * 不支持构造器注入，默认依赖必须存在。

</details>

<details>
<summary><b>关键点</b></summary>

* 选择依赖注入方式时：

    * **强类型、安全性优先** → 用 Autowired（或构造器方式，无注解）。
    * **强调容器无关性（JSR-250 规范）** → 用 Resource。
* 多 Bean 冲突：

    * 两者都需 @Qualifier 或显式 name/type。
* 构造器注入：Resource 不支持，Autowired 支持（推荐）。

</details>

<details>
<summary><b>扩展知识</b></summary>

* Spring 建议使用 **构造器注入**，字段注入会破坏封装性、不利于测试。
* Spring Boot 默认对单构造器 Bean 免注解自动装配。
* Resource 的 `name` 默认使用 **字段名**，更容易因名字不匹配导致异常。

</details>

---

## 3）面试官追问（Q&A）

**问：Autowired 和 Resource 的核心区别是什么？**
答：来源不同（Spring vs JSR-250）、匹配顺序不同（type→name vs name→type）、是否支持构造器注入、可选性控制等。

**问：哪种注解更推荐用于生产？为什么？**
答：推荐构造器注入 + Autowired/无注解。因为类型安全强、支持可选依赖、可测试性好、符合 Spring 生态最佳实践。

**问：Resource 为什么默认按名称匹配？会导致什么问题？**
答：JSR-250 的规范要求按 name 匹配，导致字段名错误时直接报错，更“严格”。

**问：Autowired 找到多个候选 Bean 会发生什么？**
答：报 NoUniqueBeanDefinitionException，需要配合 @Qualifier 指定具体 Bean。

**问：为什么 Resource 不支持构造器注入？**
答：规范设计如此，只支持字段/Setter；构造器注入需要依赖 Spring 的 Autowired 实现。

**问：Autowired 中 required=false 的使用场景？**
答：可选依赖，例如某些 Bean 可能按环境启用或禁用，通过 required=false 实现优雅降级。

**问：同一个字段上同时使用 Autowired 和 Resource 会怎样？**
答：不应同时使用，Resource 会覆盖 Autowired 的行为。

**问：在容器迁移（如从 Spring 迁移到 CDI）时应优先使用哪个？**
答：优先 Resource，因为其遵循 JSR-250 标准，跨容器兼容。

**问：如何让 Resource 也按类型注入？**
答：显式指定 `@Resource(type=Bean.class)`。

**问：字段注入 vs 构造器注入对可测试性有何影响？**
答：字段注入导致必须启动容器才能注入，构造器注入可直接 new 对象并传入 mock，无需容器。

---

## 4）示意图（ASCII）

```
            ┌──────────────────────────────────────────┐
            │               注入方式对比               │
            └──────────────────────────────────────────┘

                @Autowired（Spring）
                ┌────────────────────────────┐
                │ 1. ByType 查找             │
                │ 2. 若多实现 → ByName       │
                │ 3. 支持构造器/Setter/字段  │
                │ 4. required 可选           │
                └────────────────────────────┘

                @Resource（JSR-250）
                ┌────────────────────────────┐
                │ 1. ByName 查找             │
                │ 2. 找不到 → 按类型匹配     │
                │ 3. 不支持构造器注入         │
                │ 4. 必须存在对应 Bean       │
                └────────────────────────────┘
```

