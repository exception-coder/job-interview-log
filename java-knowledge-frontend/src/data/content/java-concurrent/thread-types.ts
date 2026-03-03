import type { KnowledgeBlockContent } from '../../types'

/**
 * 线程类型 - 详细内容
 */
export const threadTypesContent: KnowledgeBlockContent = {
  id: 'thread-types',
  title: '线程类型',
  description: `**守护线程 (Daemon Thread)**
- 后台服务线程，JVM退出时自动终止
- 典型应用：GC线程、监控线程
- 设置方法：thread.setDaemon(true)

**用户线程 (User Thread)**
- 前台工作线程，必须显式结束
- JVM等待所有用户线程结束才退出
- 默认创建的线程都是用户线程

**虚拟线程 (Virtual Thread - JDK 21+)**
- 轻量级线程，由JVM调度而非OS
- 可创建百万级线程，占用内存极小
- 适用场景：高并发I/O密集型任务
- 创建方式：Thread.startVirtualThread(() -> {...})
- 优势：简化异步编程，提高资源利用率`,
  
  code: `// 1. 守护线程示例
Thread daemonThread = new Thread(() -> {
    while (true) {
        System.out.println("守护线程运行中...");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            break;
        }
    }
});
// 必须在start()之前设置为守护线程
daemonThread.setDaemon(true);
daemonThread.start();

// 2. 用户线程示例（默认）
Thread userThread = new Thread(() -> {
    System.out.println("用户线程执行任务");
    // JVM会等待此线程执行完毕
});
userThread.start();

// 3. 虚拟线程示例（JDK 21+）
// 方式1：使用Thread.startVirtualThread()
Thread.startVirtualThread(() -> {
    System.out.println("虚拟线程执行任务");
});

// 方式2：使用Thread.ofVirtual()
Thread virtualThread = Thread.ofVirtual()
    .name("virtual-worker")
    .start(() -> {
        System.out.println("命名的虚拟线程");
    });

// 方式3：使用Executors创建虚拟线程池
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();
executor.submit(() -> {
    System.out.println("虚拟线程池中的任务");
});`
}

