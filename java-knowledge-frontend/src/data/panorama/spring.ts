import type { PanoramaConfig } from '../types'

/**
 * Spring 知识图谱配置
 */
export const springPanorama: PanoramaConfig = {
  categoryId: 'spring',
  layers: [
    {
      name: '核心容器',
      blocks: [
        {
          id: 'ioc-container',
          title: 'IOC容器',
          subtitle: 'BeanFactory/ApplicationContext',
          contentFile: 'spring/ioc-container.ts'
        },
        {
          id: 'dependency-injection',
          title: '依赖注入',
          subtitle: '构造器/Setter/字段注入',
          contentFile: 'spring/dependency-injection.ts'
        },
        {
          id: 'bean-lifecycle',
          title: 'Bean生命周期',
          subtitle: '实例化/初始化/销毁',
          contentFile: 'spring/bean-lifecycle.ts'
        },
        {
          id: 'bean-scope',
          title: 'Bean作用域',
          subtitle: 'Singleton/Prototype/Request/Session',
          contentFile: 'spring/bean-scope.ts'
        }
      ]
    },
    {
      name: 'AOP切面',
      blocks: [
        {
          id: 'aop-concepts',
          title: 'AOP概念',
          subtitle: '切面/切点/通知/织入',
          contentFile: 'spring/aop-concepts.ts'
        },
        {
          id: 'aop-proxy',
          title: 'AOP代理',
          subtitle: 'JDK动态代理/CGLIB代理',
          contentFile: 'spring/aop-proxy.ts'
        },
        {
          id: 'aop-usage',
          title: 'AOP应用',
          subtitle: '日志/事务/权限/缓存',
          contentFile: 'spring/aop-usage.ts'
        }
      ]
    },
    {
      name: '事务管理',
      blocks: [
        {
          id: 'transaction-management',
          title: '事务管理',
          subtitle: '编程式/声明式事务',
          contentFile: 'spring/transaction-management.ts'
        },
        {
          id: 'transaction-propagation',
          title: '事务传播',
          subtitle: 'REQUIRED/REQUIRES_NEW/NESTED',
          contentFile: 'spring/transaction-propagation.ts'
        },
        {
          id: 'transaction-isolation',
          title: '事务隔离',
          subtitle: 'READ_COMMITTED/REPEATABLE_READ',
          contentFile: 'spring/transaction-isolation.ts'
        },
        {
          id: 'transaction-failure',
          title: '事务失效',
          subtitle: '常见失效场景及解决方案',
          contentFile: 'spring/transaction-failure.ts'
        }
      ]
    },
    {
      name: 'SpringMVC',
      blocks: [
        {
          id: 'mvc-architecture',
          title: 'MVC架构',
          subtitle: 'DispatcherServlet/HandlerMapping',
          contentFile: 'spring/mvc-architecture.ts'
        },
        {
          id: 'request-mapping',
          title: '请求映射',
          subtitle: '@RequestMapping/路由匹配',
          contentFile: 'spring/request-mapping.ts'
        },
        {
          id: 'data-binding',
          title: '数据绑定',
          subtitle: '参数解析/类型转换/验证',
          contentFile: 'spring/data-binding.ts'
        },
        {
          id: 'exception-handling',
          title: '异常处理',
          subtitle: '@ExceptionHandler/全局异常',
          contentFile: 'spring/exception-handling.ts'
        }
      ]
    },
    {
      name: 'SpringBoot',
      blocks: [
        {
          id: 'auto-configuration',
          title: '自动配置',
          subtitle: '@EnableAutoConfiguration原理',
          contentFile: 'spring/auto-configuration.ts'
        },
        {
          id: 'starter',
          title: 'Starter机制',
          subtitle: '自定义Starter/依赖管理',
          contentFile: 'spring/starter.ts'
        },
        {
          id: 'boot-startup',
          title: '启动流程',
          subtitle: 'SpringApplication/内嵌容器',
          contentFile: 'spring/boot-startup.ts'
        },
        {
          id: 'configuration-properties',
          title: '配置管理',
          subtitle: '@ConfigurationProperties/多环境',
          contentFile: 'spring/configuration-properties.ts'
        }
      ]
    },
    {
      name: '高级特性',
      blocks: [
        {
          id: 'circular-dependency',
          title: '循环依赖',
          subtitle: '三级缓存/解决方案',
          contentFile: 'spring/circular-dependency.ts'
        },
        {
          id: 'event-driven',
          title: '事件驱动',
          subtitle: 'ApplicationEvent/事件监听',
          contentFile: 'spring/event-driven.ts'
        },
        {
          id: 'async-processing',
          title: '异步处理',
          subtitle: '@Async/@EnableAsync',
          contentFile: 'spring/async-processing.ts'
        },
        {
          id: 'graceful-shutdown',
          title: '优雅停机',
          subtitle: 'ShutdownHook/资源清理',
          contentFile: 'spring/graceful-shutdown.ts'
        }
      ]
    }
  ]
}

