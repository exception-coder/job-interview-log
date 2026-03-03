import type { KnowledgeBlockContent } from '../../types'

/**
 * 线程状态 - 详细内容
 */
export const threadStatesContent: KnowledgeBlockContent = {
  id: 'thread-states',
  title: '线程状态',
  description: `**线程6种状态**
1. NEW：新建未启动
2. RUNNABLE：可运行（包含运行中和就绪）
3. BLOCKED：阻塞等待监视器锁
4. WAITING：无限期等待另一个线程
5. TIMED_WAITING：有时限的等待
6. TERMINATED：已终止

**状态转换关键点**
- start() → RUNNABLE
- synchronized → BLOCKED
- wait()/join() → WAITING
- sleep()/wait(timeout) → TIMED_WAITING`,
  
  code: `public class ThreadStateDemo {
    public static void main(String[] args) throws InterruptedException {
        Object lock = new Object();
        
        // 1. NEW状态：线程创建但未启动
        Thread t1 = new Thread(() -> {});
        System.out.println("t1状态: " + t1.getState()); // NEW
        
        // 2. RUNNABLE状态：线程正在运行或等待CPU调度
        Thread t2 = new Thread(() -> {
            while (true) {
                // 持续运行
            }
        });
        t2.start();
        Thread.sleep(100);
        System.out.println("t2状态: " + t2.getState()); // RUNNABLE
        
        // 3. BLOCKED状态：等待获取监视器锁
        Thread t3 = new Thread(() -> {
            synchronized (lock) {
                try {
                    Thread.sleep(10000);
                } catch (InterruptedException e) {}
            }
        });
        Thread t4 = new Thread(() -> {
            synchronized (lock) { // 等待t3释放锁
                System.out.println("获取到锁");
            }
        });
        t3.start();
        Thread.sleep(100);
        t4.start();
        Thread.sleep(100);
        System.out.println("t4状态: " + t4.getState()); // BLOCKED
        
        // 4. WAITING状态：无限期等待
        Thread t5 = new Thread(() -> {
            synchronized (lock) {
                try {
                    lock.wait(); // 无限期等待
                } catch (InterruptedException e) {}
            }
        });
        t5.start();
        Thread.sleep(100);
        System.out.println("t5状态: " + t5.getState()); // WAITING
        
        // 5. TIMED_WAITING状态：有时限的等待
        Thread t6 = new Thread(() -> {
            try {
                Thread.sleep(5000); // 等待5秒
            } catch (InterruptedException e) {}
        });
        t6.start();
        Thread.sleep(100);
        System.out.println("t6状态: " + t6.getState()); // TIMED_WAITING
        
        // 6. TERMINATED状态：线程执行完毕
        Thread t7 = new Thread(() -> {
            System.out.println("任务完成");
        });
        t7.start();
        t7.join(); // 等待t7执行完毕
        System.out.println("t7状态: " + t7.getState()); // TERMINATED
    }
}`
}

