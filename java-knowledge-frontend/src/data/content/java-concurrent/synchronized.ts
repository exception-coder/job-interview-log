import type { KnowledgeBlockContent } from '../../types'

/**
 * synchronized - 详细内容
 */
export const synchronizedContent: KnowledgeBlockContent = {
  id: 'synchronized',
  title: 'synchronized',
  description: `**synchronized关键字**
- 保证原子性、可见性、有序性
- 可修饰方法或代码块
- 底层：Monitor对象实现
- 锁升级：偏向锁→轻量级锁→重量级锁

**使用场景**
- 简单的互斥同步
- 不需要超时或中断的场景`,
  
  code: `public class SynchronizedDemo {
    private int count = 0;
    private final Object lock = new Object();
    
    // 1. 修饰实例方法（锁是this对象）
    public synchronized void incrementMethod() {
        count++;
        System.out.println("方法锁: " + count);
    }
    
    // 2. 修饰静态方法（锁是Class对象）
    public static synchronized void staticMethod() {
        System.out.println("静态方法锁: " + Thread.currentThread().getName());
    }
    
    // 3. 修饰代码块（锁是指定对象）
    public void incrementBlock() {
        synchronized (lock) {
            count++;
            System.out.println("代码块锁: " + count);
        }
    }
    
    // 4. 修饰this对象
    public void incrementThis() {
        synchronized (this) {
            count++;
            System.out.println("this锁: " + count);
        }
    }
    
    // 5. 双重检查锁定单例模式
    private static volatile SynchronizedDemo instance;
    
    public static SynchronizedDemo getInstance() {
        if (instance == null) { // 第一次检查
            synchronized (SynchronizedDemo.class) {
                if (instance == null) { // 第二次检查
                    instance = new SynchronizedDemo();
                }
            }
        }
        return instance;
    }
}`
}

