import type { KnowledgeBlockContent } from '../../types'

/**
 * ArrayList - 详细内容
 */
export const arrayListContent: KnowledgeBlockContent = {
  id: 'arraylist',
  title: 'ArrayList',
  description: `**ArrayList核心特性**

**底层实现**
- 基于动态数组实现
- 默认初始容量：10
- 扩容机制：1.5倍扩容（oldCapacity + (oldCapacity >> 1)）
- 非线程安全

**时间复杂度**
- 随机访问：O(1)
- 尾部插入：O(1)（不考虑扩容）
- 中间插入/删除：O(n)（需要移动元素）
- 查找：O(n)

**优点**
- 支持随机访问，查询快
- 尾部插入效率高
- 内存连续，缓存友好

**缺点**
- 中间插入/删除慢
- 扩容时需要复制数组
- 非线程安全

**适用场景**
- 频繁随机访问
- 尾部插入较多
- 查询多于插入/删除

**vs LinkedList**
- ArrayList：数组，随机访问快
- LinkedList：链表，插入删除快`,
  
  code: `import java.util.*;

public class ArrayListDemo {
    
    // 1. 创建ArrayList
    public static void createArrayList() {
        // 默认容量10
        List<String> list1 = new ArrayList<>();
        
        // 指定初始容量
        List<String> list2 = new ArrayList<>(20);
        
        // 从集合创建
        List<String> list3 = new ArrayList<>(Arrays.asList("A", "B", "C"));
    }
    
    // 2. 基本操作
    public static void basicOperations() {
        List<String> list = new ArrayList<>();
        
        // 添加元素
        list.add("Apple");           // 尾部添加
        list.add(0, "Banana");       // 指定位置添加
        list.addAll(Arrays.asList("Cherry", "Date"));
        
        // 获取元素
        String first = list.get(0);  // O(1)
        
        // 修改元素
        list.set(0, "Avocado");      // O(1)
        
        // 删除元素
        list.remove(0);              // 按索引删除 O(n)
        list.remove("Apple");        // 按对象删除 O(n)
        
        // 查找元素
        int index = list.indexOf("Cherry");
        int lastIndex = list.lastIndexOf("Cherry");
        boolean contains = list.contains("Date");
        
        // 大小
        int size = list.size();
        boolean isEmpty = list.isEmpty();
        
        // 清空
        list.clear();
    }
    
    // 3. 扩容机制演示
    public static void capacityDemo() {
        List<Integer> list = new ArrayList<>();
        
        // 初始容量：10
        // 添加第11个元素时扩容到15
        // 添加第16个元素时扩容到22
        
        for (int i = 0; i < 20; i++) {
            list.add(i);
        }
        
        // 预知大小时，指定初始容量避免扩容
        List<Integer> list2 = new ArrayList<>(1000);
        for (int i = 0; i < 1000; i++) {
            list2.add(i);
        }
    }
    
    // 4. 遍历方式
    public static void iterationDemo() {
        List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
        
        // 方式1：for循环（推荐）
        for (int i = 0; i < list.size(); i++) {
            String item = list.get(i);
            System.out.println(item);
        }
        
        // 方式2：增强for循环
        for (String item : list) {
            System.out.println(item);
        }
        
        // 方式3：迭代器
        Iterator<String> iterator = list.iterator();
        while (iterator.hasNext()) {
            String item = iterator.next();
            System.out.println(item);
        }
        
        // 方式4：forEach + Lambda
        list.forEach(item -> System.out.println(item));
        
        // 方式5：Stream
        list.stream().forEach(System.out::println);
    }
    
    // 5. 删除元素的陷阱
    public static void removeDemo() {
        List<Integer> list = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
        
        // 错误：遍历时删除（会跳过元素）
        for (int i = 0; i < list.size(); i++) {
            if (list.get(i) % 2 == 0) {
                list.remove(i);
            }
        }
        
        // 正确方式1：倒序遍历
        for (int i = list.size() - 1; i >= 0; i--) {
            if (list.get(i) % 2 == 0) {
                list.remove(i);
            }
        }
        
        // 正确方式2：使用迭代器
        Iterator<Integer> iterator = list.iterator();
        while (iterator.hasNext()) {
            if (iterator.next() % 2 == 0) {
                iterator.remove();
            }
        }
        
        // 正确方式3：removeIf（JDK 8+）
        list.removeIf(n -> n % 2 == 0);
    }
}`
}

