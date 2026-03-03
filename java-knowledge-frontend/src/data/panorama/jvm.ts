import type { PanoramaConfig } from '../types'

/**
 * JVM 知识图谱配置
 */
export const jvmPanorama: PanoramaConfig = {
  categoryId: 'jvm',
  layers: [
    {
      name: '运行时数据区',
      blocks: [
        {
          id: 'jvm-memory-structure',
          title: 'JVM内存结构',
          subtitle: '堆/栈/方法区/程序计数器',
          contentFile: 'jvm/memory-structure.ts'
        },
        {
          id: 'heap-structure',
          title: '堆内存结构',
          subtitle: '新生代/老年代/Eden/Survivor',
          contentFile: 'jvm/heap-structure.ts'
        },
        {
          id: 'stack-structure',
          title: '栈内存结构',
          subtitle: '栈帧/局部变量表/操作数栈',
          contentFile: 'jvm/stack-structure.ts'
        },
        {
          id: 'method-area',
          title: '方法区',
          subtitle: '元空间/常量池/类信息',
          contentFile: 'jvm/method-area.ts'
        }
      ]
    },
    {
      name: '垃圾回收',
      blocks: [
        {
          id: 'gc-algorithms',
          title: 'GC算法',
          subtitle: '标记清除/标记整理/复制算法',
          contentFile: 'jvm/gc-algorithms.ts'
        },
        {
          id: 'gc-collectors',
          title: 'GC收集器',
          subtitle: 'Serial/Parallel/CMS/G1/ZGC',
          contentFile: 'jvm/gc-collectors.ts'
        },
        {
          id: 'gc-roots',
          title: 'GC Roots',
          subtitle: '可达性分析/引用类型',
          contentFile: 'jvm/gc-roots.ts'
        },
        {
          id: 'gc-tuning',
          title: 'GC调优',
          subtitle: '参数配置/性能分析',
          contentFile: 'jvm/gc-tuning.ts'
        }
      ]
    },
    {
      name: '类加载机制',
      blocks: [
        {
          id: 'class-loading',
          title: '类加载过程',
          subtitle: '加载/链接/初始化',
          contentFile: 'jvm/class-loading.ts'
        },
        {
          id: 'classloader',
          title: '类加载器',
          subtitle: 'Bootstrap/Extension/Application',
          contentFile: 'jvm/classloader.ts'
        },
        {
          id: 'parent-delegation',
          title: '双亲委派',
          subtitle: '委派模型/破坏双亲委派',
          contentFile: 'jvm/parent-delegation.ts'
        }
      ]
    },
    {
      name: '执行引擎',
      blocks: [
        {
          id: 'jit-compiler',
          title: 'JIT编译器',
          subtitle: 'C1/C2编译器/分层编译',
          contentFile: 'jvm/jit-compiler.ts'
        },
        {
          id: 'bytecode-execution',
          title: '字节码执行',
          subtitle: '解释执行/编译执行',
          contentFile: 'jvm/bytecode-execution.ts'
        },
        {
          id: 'optimization',
          title: 'JVM优化',
          subtitle: '逃逸分析/锁优化/内联',
          contentFile: 'jvm/optimization.ts'
        }
      ]
    },
    {
      name: '性能监控',
      blocks: [
        {
          id: 'jvm-tools',
          title: 'JVM工具',
          subtitle: 'jps/jstat/jmap/jstack',
          contentFile: 'jvm/jvm-tools.ts'
        },
        {
          id: 'jvm-parameters',
          title: 'JVM参数',
          subtitle: '堆大小/GC参数/调试参数',
          contentFile: 'jvm/jvm-parameters.ts'
        },
        {
          id: 'troubleshooting',
          title: '故障排查',
          subtitle: 'OOM/CPU高/死锁分析',
          contentFile: 'jvm/troubleshooting.ts'
        }
      ]
    }
  ]
}

