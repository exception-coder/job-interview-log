# ✅什么是Spring的循环依赖问题？

> 题号：0818 ｜ 分类：04_Spring体系

---

## 典型回答

在Spring框架中，循环依赖是指两个或多个bean之间相互依赖，形成了一个循环引用的情况。如果不加以处理，这种情况会导致应用程序启动失败。

```text
@Service
public class ServiceA{

	@Autowired
	private ServiceB serviceB;

}

@Service
public class ServiceB{

	@Autowired
	private ServiceA serviceA;

}
```

如以上情况，两个Bean就发生了互相依赖。

![](https://cdn.nlark.com/yuque/0/2023/png/5378072/1679812780685-93cd8a87-1da3-4fd5-a071-0600d7d6b6c6.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_32%2Ctext_SmF2YeWFq-iCoV9CeSBIb2xsaXM%3D%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_32%2Ctext_SmF2YSA4IEd1IDAy%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

**在Spring中，解决循环依赖的方式就是引入了三级缓存。**

> 📎 相关：[✅什么是Spring的三级缓存](https://www.yuque.com/hollis666/fsn3og/ilmdn79lc0ba2f4t)

但是，Spring解决循环依赖是有一定限制的：

- 首先就是要求互相依赖的Bean必须要是**单例的Bean**
- 另外就是依赖注入的方式不能都是**构造函数注入**的方式

## 扩展知识

## 为什么只支持单例

Spring循环依赖的解决方案主要是通过对象的提前暴露来实现的。当一个对象在创建过程中需要引用到另一个正在创建的对象时，Spring会先提前暴露一个尚未完全初始化的对象实例，以解决循环依赖的问题。这个尚未完全初始化的对象实例就是半成品对象。

在 Spring 容器中，单例对象的创建和初始化只会发生一次，并且在容器启动时就完成了。这意味着，在容器运行期间，单例对象的依赖关系不会发生变化。因此，可以通过提前暴露半成品对象的方式来解决循环依赖的问题。

相比之下，原型对象的创建和初始化可以发生多次，并且可能在容器运行期间动态地发生变化。因此，对于原型对象，提前暴露半成品对象并不能解决循环依赖的问题，因为在后续的创建过程中，可能会涉及到不同的原型对象实例，无法像单例对象那样缓存并复用半成品对象。

因此，Spring只支持通过单例对象的提前暴露来解决循环依赖问题。

## 为什么不支持构造函数注入

Spring无法解决构造函数的循环依赖，是因为在对象实例化过程中，构造函数是最先被调用的，而此时对象还未完成实例化，无法注入一个尚未完全创建的对象，因此Spring容器无法在构造函数注入中实现循环依赖的解决。

```java
@Component
public class ClassA {
    private final ClassB classB;

    @Autowired
    public ClassA(@Lazy ClassB classB) {
        this.classB = classB;
    }

    // ...
}

@Component
public class ClassB {
    private final ClassA classA;

    @Autowired
    public ClassB(ClassA classA) {
        this.classA = classA;
    }

    // ...
}

```

在属性注入中，Spring容器可以通过先创建一个空对象或者提前暴露一个半成品对象来解决循环依赖的问题。但在构造函数注入中，对象的实例化是在构造函数中完成的，这样就无法使用类似的方式解决循环依赖问题了。

## 如何解决构造器注入的循环依赖

构造器注入的循环依赖，可以通过一定的手段解决。

**1、重新设计，彻底消除循环依赖**

循环依赖，一般都是设计不合理导致的，可以从根本上做一些重构，来彻底解决，

**2、改成非构造器注入**

可以改成setter注入或者字段注入。

**3、使用@Lazy解决**

> 📎 相关：[✅@Lazy注解能解决循环依赖吗？](https://www.yuque.com/hollis666/fsn3og/vxnlsuitmu61amyq)
