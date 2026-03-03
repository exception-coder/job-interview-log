import type { KnowledgeBlockContent } from '../../types'

/**
 * IOC容器 - 详细内容
 */
export const iocContainerContent: KnowledgeBlockContent = {
  id: 'ioc-container',
  title: 'IOC容器',
  description: `**IOC（Inversion of Control）控制反转**

**核心概念**
- 将对象的创建和依赖关系的管理交给容器
- 降低代码耦合度，提高可维护性
- DI（Dependency Injection）依赖注入是IOC的实现方式

**两大核心容器**

**1. BeanFactory**
- 基础容器，提供基本的IOC功能
- 延迟加载：getBean()时才创建对象
- 占用内存少，启动快
- 适用于资源受限的环境

**2. ApplicationContext**
- 高级容器，继承BeanFactory
- 立即加载：容器启动时创建所有单例Bean
- 提供更多企业级功能：
  - 国际化支持
  - 事件发布
  - AOP支持
  - Web应用上下文
- 常用实现：
  - ClassPathXmlApplicationContext
  - FileSystemXmlApplicationContext
  - AnnotationConfigApplicationContext
  - WebApplicationContext

**容器启动流程**
1. 加载配置文件/注解
2. 解析Bean定义
3. 注册BeanDefinition
4. 实例化Bean
5. 依赖注入
6. 初始化Bean
7. 容器就绪`,
  
  code: `// 1. BeanFactory示例
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.xml.XmlBeanFactory;
import org.springframework.core.io.ClassPathResource;

public class BeanFactoryDemo {
    public static void main(String[] args) {
        // 创建BeanFactory（已过时，仅作演示）
        BeanFactory factory = new XmlBeanFactory(
            new ClassPathResource("beans.xml")
        );
        
        // 延迟加载：此时才创建Bean
        UserService userService = factory.getBean(UserService.class);
        userService.doSomething();
    }
}

// 2. ApplicationContext示例 - XML配置
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class XmlContextDemo {
    public static void main(String[] args) {
        // 加载XML配置
        ApplicationContext context = 
            new ClassPathXmlApplicationContext("applicationContext.xml");
        
        // 获取Bean
        UserService userService = context.getBean(UserService.class);
        userService.doSomething();
        
        // 关闭容器
        ((ClassPathXmlApplicationContext) context).close();
    }
}

// 3. ApplicationContext示例 - 注解配置
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan("com.example")
public class AppConfig {
}

public class AnnotationContextDemo {
    public static void main(String[] args) {
        // 加载注解配置
        ApplicationContext context = 
            new AnnotationConfigApplicationContext(AppConfig.class);
        
        // 获取Bean
        UserService userService = context.getBean(UserService.class);
        userService.doSomething();
        
        // 关闭容器
        ((AnnotationConfigApplicationContext) context).close();
    }
}

// 4. SpringBoot自动配置
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        // SpringBoot自动创建ApplicationContext
        ConfigurableApplicationContext context = 
            SpringApplication.run(Application.class, args);
        
        // 获取Bean
        UserService userService = context.getBean(UserService.class);
        userService.doSomething();
    }
}

// 5. 手动注册Bean
import org.springframework.beans.factory.support.BeanDefinitionBuilder;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;

public class ManualRegisterDemo {
    public static void main(String[] args) {
        DefaultListableBeanFactory factory = new DefaultListableBeanFactory();
        
        // 手动注册BeanDefinition
        BeanDefinitionBuilder builder = 
            BeanDefinitionBuilder.genericBeanDefinition(UserService.class);
        builder.addPropertyValue("name", "张三");
        
        factory.registerBeanDefinition("userService", 
            builder.getBeanDefinition());
        
        // 获取Bean
        UserService userService = factory.getBean(UserService.class);
    }
}

// 6. 获取容器中的所有Bean
@Component
public class BeanListDemo implements ApplicationContextAware {
    private ApplicationContext context;
    
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        this.context = applicationContext;
    }
    
    public void listAllBeans() {
        // 获取所有Bean名称
        String[] beanNames = context.getBeanDefinitionNames();
        for (String beanName : beanNames) {
            System.out.println(beanName);
        }
        
        // 获取指定类型的所有Bean
        Map<String, UserService> beans = 
            context.getBeansOfType(UserService.class);
        beans.forEach((name, bean) -> {
            System.out.println(name + ": " + bean);
        });
    }
}

// 7. 容器事件监听
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Component
public class ContextRefreshListener 
    implements ApplicationListener<ContextRefreshedEvent> {
    
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        System.out.println("容器刷新完成");
        ApplicationContext context = event.getApplicationContext();
        // 容器启动后的初始化操作
    }
}

// 8. 父子容器
public class ParentChildContextDemo {
    public static void main(String[] args) {
        // 父容器
        ApplicationContext parent = 
            new AnnotationConfigApplicationContext(ParentConfig.class);
        
        // 子容器
        AnnotationConfigApplicationContext child = 
            new AnnotationConfigApplicationContext();
        child.setParent(parent);
        child.register(ChildConfig.class);
        child.refresh();
        
        // 子容器可以访问父容器的Bean
        // 父容器不能访问子容器的Bean
    }
}`
}

