import type { KnowledgeBlockContent } from '../../types'

/**
 * GC算法 - 详细内容
 */
export const gcAlgorithmsContent: KnowledgeBlockContent = {
  id: 'gc-algorithms',
  title: 'GC算法',
  description: `**垃圾回收算法**

**1. 标记-清除算法（Mark-Sweep）**
- 标记：标记所有需要回收的对象
- 清除：回收被标记的对象
- 优点：简单直接
- 缺点：产生内存碎片，效率不高

**2. 标记-复制算法（Mark-Copy）**
- 将内存分为两块，每次只使用一块
- GC时将存活对象复制到另一块，清空当前块
- 优点：无内存碎片，效率高
- 缺点：浪费一半内存
- 应用：新生代（Eden:Survivor = 8:1:1）

**3. 标记-整理算法（Mark-Compact）**
- 标记：标记所有存活对象
- 整理：将存活对象移动到内存一端，清理边界外的内存
- 优点：无内存碎片，不浪费内存
- 缺点：移动对象成本高
- 应用：老年代

**4. 分代收集算法**
- 新生代：标记-复制（对象存活率低）
- 老年代：标记-清除或标记-整理（对象存活率高）
- 根据对象生命周期特点选择不同算法`,
  
  code: `// 1. 标记-清除算法示例
public class MarkSweepDemo {
    public static void main(String[] args) {
        // 创建对象
        Object obj1 = new Object();
        Object obj2 = new Object();
        Object obj3 = new Object();
        
        // obj1和obj2不再使用，成为垃圾
        obj1 = null;
        obj2 = null;
        
        // GC标记-清除过程：
        // 1. 标记：从GC Roots遍历，标记obj3为存活
        // 2. 清除：回收obj1和obj2的内存
        // 3. 结果：内存中可能产生碎片
        
        System.gc(); // 建议执行GC
    }
}

// 2. 标记-复制算法示例（新生代）
public class CopyingDemo {
    public static void main(String[] args) {
        // 新生代分为Eden、Survivor0、Survivor1
        // 比例：8:1:1
        
        // 对象首先分配在Eden区
        for (int i = 0; i < 1000; i++) {
            User user = new User("User" + i);
        }
        
        // Minor GC触发时：
        // 1. 标记Eden和Survivor0中的存活对象
        // 2. 将存活对象复制到Survivor1
        // 3. 清空Eden和Survivor0
        // 4. 交换Survivor0和Survivor1的角色
        
        // 经过多次GC仍存活的对象晋升到老年代
    }
}

// 3. 标记-整理算法示例（老年代）
public class CompactingDemo {
    public static void main(String[] args) {
        // 老年代对象存活率高，使用标记-整理
        
        // 创建大量对象，部分晋升到老年代
        List<byte[]> list = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            list.add(new byte[1024 * 1024]); // 1MB
        }
        
        // 释放部分对象
        for (int i = 0; i < 50; i++) {
            list.set(i, null);
        }
        
        // Full GC触发时：
        // 1. 标记：标记所有存活对象
        // 2. 整理：将存活对象移动到内存一端
        // 3. 清理：清理边界外的内存
        // 4. 结果：无内存碎片，但移动对象有开销
        
        System.gc();
    }
}

// 4. 分代收集示例
public class GenerationalGCDemo {
    private static List<Object> oldGenList = new ArrayList<>();
    
    public static void main(String[] args) {
        // 新生代GC（Minor GC）
        for (int i = 0; i < 10000; i++) {
            Object obj = new Object();
            // 大部分对象很快死亡，适合复制算法
        }
        
        // 晋升到老年代的对象
        for (int i = 0; i < 100; i++) {
            oldGenList.add(new byte[1024 * 1024]); // 1MB
            // 长期存活的对象，适合标记-整理算法
        }
    }
}

// 5. 查看GC日志
// JVM参数：
// -XX:+PrintGCDetails          打印GC详细信息
// -XX:+PrintGCDateStamps       打印GC时间戳
// -Xloggc:gc.log              GC日志输出到文件
// -XX:+UseSerialGC            使用Serial GC
// -XX:+UseParallelGC          使用Parallel GC
// -XX:+UseConcMarkSweepGC     使用CMS GC
// -XX:+UseG1GC                使用G1 GC

// 6. 监控GC
public class GCMonitor {
    public static void main(String[] args) {
        // 获取GC信息
        List<GarbageCollectorMXBean> gcBeans = 
            ManagementFactory.getGarbageCollectorMXBeans();
        
        for (GarbageCollectorMXBean gcBean : gcBeans) {
            System.out.println("GC名称: " + gcBean.getName());
            System.out.println("GC次数: " + gcBean.getCollectionCount());
            System.out.println("GC时间: " + gcBean.getCollectionTime() + "ms");
        }
        
        // 获取内存池信息
        List<MemoryPoolMXBean> poolBeans = 
            ManagementFactory.getMemoryPoolMXBeans();
        
        for (MemoryPoolMXBean poolBean : poolBeans) {
            System.out.println("内存池: " + poolBean.getName());
            System.out.println("类型: " + poolBean.getType());
            MemoryUsage usage = poolBean.getUsage();
            System.out.println("已使用: " + usage.getUsed() / 1024 / 1024 + "MB");
            System.out.println("最大值: " + usage.getMax() / 1024 / 1024 + "MB");
        }
    }
}

// 7. 对象分配和晋升
public class ObjectPromotionDemo {
    public static void main(String[] args) {
        // -XX:MaxTenuringThreshold=15  设置晋升年龄阈值
        // -XX:+PrintTenuringDistribution  打印对象年龄分布
        
        // 对象晋升条件：
        // 1. 年龄达到阈值（默认15）
        // 2. Survivor空间不足
        // 3. 大对象直接进入老年代
        // 4. 动态年龄判断
        
        byte[] bigObj = new byte[10 * 1024 * 1024]; // 大对象直接进老年代
    }
}`
}

