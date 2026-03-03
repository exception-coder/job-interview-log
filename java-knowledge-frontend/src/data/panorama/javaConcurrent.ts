import type { PanoramaConfig } from '../types'

/**
 * Java并发知识图谱配置
 * 只包含结构和元数据，详细内容在 content/java-concurrent/ 目录下
 */
export const javaConcurrentPanorama: PanoramaConfig = {
  categoryId: 'java-concurrent',
  layers: [
    {
      name: '线程基础',
      blocks: [
        {
          id: 'thread-types',
          title: '线程类型',
          subtitle: 'Daemon/User/Virtual',
          contentFile: 'java-concurrent/thread-types.ts'
        },
        {
          id: 'thread-states',
          title: '线程状态',
          subtitle: 'NEW/RUNNABLE/BLOCKED/WAITING/TERMINATED',
          contentFile: 'java-concurrent/thread-states.ts'
        },
        {
          id: 'thread-creation',
          title: '线程创建',
          subtitle: 'Thread/Runnable/Callable',
          contentFile: 'java-concurrent/thread-creation.ts'
        }
      ]
    },
    {
      name: '同步机制',
      blocks: [
        {
          id: 'synchronized',
          title: 'synchronized',
          subtitle: '内置锁/监视器锁',
          contentFile: 'java-concurrent/synchronized.ts'
        },
        {
          id: 'volatile',
          title: 'volatile',
          subtitle: '可见性/禁止重排序',
          contentFile: 'java-concurrent/volatile.ts'
        },
        {
          id: 'lock',
          title: 'Lock接口',
          subtitle: 'ReentrantLock/ReadWriteLock',
          contentFile: 'java-concurrent/lock.ts'
        }
      ]
    },
    {
      name: '线程池',
      blocks: [
        {
          id: 'executor',
          title: 'Executor框架',
          subtitle: 'ThreadPoolExecutor',
          contentFile: 'java-concurrent/executor.ts'
        },
        {
          id: 'common-pools',
          title: '常用线程池',
          subtitle: 'Fixed/Cached/Scheduled',
          contentFile: 'java-concurrent/common-pools.ts'
        }
      ]
    },
    {
      name: '并发工具',
      blocks: [
        {
          id: 'atomic',
          title: '原子类',
          subtitle: 'AtomicInteger/AtomicReference',
          contentFile: 'java-concurrent/atomic.ts'
        },
        {
          id: 'collections',
          title: '并发集合',
          subtitle: 'ConcurrentHashMap/CopyOnWrite',
          contentFile: 'java-concurrent/collections.ts'
        },
        {
          id: 'tools',
          title: '同步工具',
          subtitle: 'CountDownLatch/CyclicBarrier',
          contentFile: 'java-concurrent/tools.ts'
        }
      ]
    }
  ]
}
