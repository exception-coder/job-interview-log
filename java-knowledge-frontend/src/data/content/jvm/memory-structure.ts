import type { KnowledgeBlockContent } from '../../types'

/**
 * 内存结构 - 详细内容
 */
export const memoryStructureContent: KnowledgeBlockContent = {
  id: 'memory-structure',
  title: '内存结构',
  description: `**JVM运行时数据区**

**线程私有区域**
1. 程序计数器（Program Counter Register）
   - 记录当前线程执行的字节码行号
   - 线程切换后能恢复到正确的执行位置
   - 唯一不会发生OOM的区域

2. 虚拟机栈（VM Stack）
   - 存储局部变量表、操作数栈、动态链接、方法出口
   - 每个方法执行时创建一个栈帧
   - StackOverflowError：栈深度超过限制
   - OutOfMemoryError：栈扩展时内存不足

3. 本地方法栈（Native Method Stack）
   - 为Native方法服务
   - HotSpot将其与虚拟机栈合并

**线程共享区域**
4. 堆（Heap）
   - 存储对象实例和数组
   - GC的主要区域
   - 分为新生代和老年代
   - OutOfMemoryError: Java heap space

5. 方法区（Method Area）
   - 存储类信息、常量、静态变量、JIT编译后的代码
   - JDK 7：永久代（PermGen）
   - JDK 8+：元空间（Metaspace，使用本地内存）
   - OutOfMemoryError: Metaspace`,
  
  code: `// 1. 程序计数器示例
public class PCRegisterDemo {
    public static void main(String[] args) {
        int i = 0;      // PC = 0
        int j = i + 1;  // PC = 2
        int k = j * 2;  // PC = 5
        // 每条指令都有对应的字节码行号
    }
}

// 2. 虚拟机栈示例
public class StackDemo {
    public static void main(String[] args) {
        method1();
    }
    
    public static void method1() {
        int a = 1;  // 局部变量存储在栈帧的局部变量表
        method2();
    }
    
    public static void method2() {
        int b = 2;
        // 栈帧结构：
        // | method2栈帧 | <- 栈顶
        // | method1栈帧 |
        // | main栈帧   |
    }
    
    // StackOverflowError示例
    public static void recursion() {
        recursion(); // 无限递归导致栈溢出
    }
}

// 3. 堆内存示例
public class HeapDemo {
    public static void main(String[] args) {
        // 对象分配在堆中
        User user = new User("张三", 25);
        
        // 数组也分配在堆中
        int[] arr = new int[1000];
        
        // 大对象直接进入老年代
        byte[] bigObj = new byte[10 * 1024 * 1024]; // 10MB
    }
}

// 4. 方法区示例
public class MethodAreaDemo {
    // 静态变量存储在方法区
    private static int count = 0;
    
    // 常量存储在方法区
    private static final String CONSTANT = "Hello";
    
    // 类信息存储在方法区
    public void method() {
        // 方法的字节码存储在方法区
    }
}

// 5. 查看JVM内存配置
// -Xms: 初始堆大小
// -Xmx: 最大堆大小
// -Xmn: 新生代大小
// -Xss: 栈大小
// -XX:MetaspaceSize: 元空间初始大小
// -XX:MaxMetaspaceSize: 元空间最大大小

// 启动参数示例
// java -Xms512m -Xmx2g -Xmn256m -Xss1m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=512m MyApp

// 6. 使用JVM工具查看内存
public class MemoryMonitor {
    public static void main(String[] args) {
        Runtime runtime = Runtime.getRuntime();
        
        // 最大内存
        long maxMemory = runtime.maxMemory();
        System.out.println("最大内存: " + maxMemory / 1024 / 1024 + "MB");
        
        // 总内存
        long totalMemory = runtime.totalMemory();
        System.out.println("总内存: " + totalMemory / 1024 / 1024 + "MB");
        
        // 空闲内存
        long freeMemory = runtime.freeMemory();
        System.out.println("空闲内存: " + freeMemory / 1024 / 1024 + "MB");
        
        // 已使用内存
        long usedMemory = totalMemory - freeMemory;
        System.out.println("已使用内存: " + usedMemory / 1024 / 1024 + "MB");
    }
}

// 7. 触发不同的OOM
public class OOMDemo {
    // 堆内存溢出
    public static void heapOOM() {
        List<byte[]> list = new ArrayList<>();
        while (true) {
            list.add(new byte[1024 * 1024]); // 1MB
        }
        // java.lang.OutOfMemoryError: Java heap space
    }
    
    // 栈溢出
    public static void stackOverflow() {
        stackOverflow(); // 无限递归
        // java.lang.StackOverflowError
    }
    
    // 元空间溢出（动态生成大量类）
    public static void metaspaceOOM() {
        while (true) {
            Enhancer enhancer = new Enhancer();
            enhancer.setSuperclass(Object.class);
            enhancer.setUseCache(false);
            enhancer.setCallback(new MethodInterceptor() {
                public Object intercept(Object obj, Method method, 
                    Object[] args, MethodProxy proxy) throws Throwable {
                    return proxy.invokeSuper(obj, args);
                }
            });
            enhancer.create();
        }
        // java.lang.OutOfMemoryError: Metaspace
    }
}`
}

