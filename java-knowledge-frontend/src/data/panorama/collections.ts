import type { PanoramaConfig } from '../types'

/**
 * 集合类 知识图谱配置
 */
export const collectionsPanorama: PanoramaConfig = {
  categoryId: 'collections',
  layers: [
    {
      name: 'List集合',
      blocks: [
        {
          id: 'arraylist',
          title: 'ArrayList',
          subtitle: '动态数组/扩容机制',
          contentFile: 'collections/arraylist.ts'
        },
        {
          id: 'linkedlist',
          title: 'LinkedList',
          subtitle: '双向链表/队列实现',
          contentFile: 'collections/linkedlist.ts'
        },
        {
          id: 'vector',
          title: 'Vector',
          subtitle: '线程安全/同步方法',
          contentFile: 'collections/vector.ts'
        },
        {
          id: 'copyonwritearraylist',
          title: 'CopyOnWriteArrayList',
          subtitle: '写时复制/读写分离',
          contentFile: 'collections/copyonwritearraylist.ts'
        }
      ]
    },
    {
      name: 'Map集合',
      blocks: [
        {
          id: 'hashmap',
          title: 'HashMap',
          subtitle: '哈希表/红黑树/扩容',
          contentFile: 'collections/hashmap.ts'
        },
        {
          id: 'hashtable',
          title: 'Hashtable',
          subtitle: '线程安全/同步方法',
          contentFile: 'collections/hashtable.ts'
        },
        {
          id: 'concurrenthashmap',
          title: 'ConcurrentHashMap',
          subtitle: 'CAS+Synchronized/分段锁',
          contentFile: 'collections/concurrenthashmap.ts'
        },
        {
          id: 'linkedhashmap',
          title: 'LinkedHashMap',
          subtitle: '有序Map/LRU缓存',
          contentFile: 'collections/linkedhashmap.ts'
        },
        {
          id: 'treemap',
          title: 'TreeMap',
          subtitle: '红黑树/排序Map',
          contentFile: 'collections/treemap.ts'
        }
      ]
    },
    {
      name: 'Set集合',
      blocks: [
        {
          id: 'hashset',
          title: 'HashSet',
          subtitle: '基于HashMap/去重',
          contentFile: 'collections/hashset.ts'
        },
        {
          id: 'linkedhashset',
          title: 'LinkedHashSet',
          subtitle: '有序Set/插入顺序',
          contentFile: 'collections/linkedhashset.ts'
        },
        {
          id: 'treeset',
          title: 'TreeSet',
          subtitle: '基于TreeMap/排序Set',
          contentFile: 'collections/treeset.ts'
        },
        {
          id: 'copyonwritearrayset',
          title: 'CopyOnWriteArraySet',
          subtitle: '线程安全Set/写时复制',
          contentFile: 'collections/copyonwritearrayset.ts'
        }
      ]
    },
    {
      name: 'Queue队列',
      blocks: [
        {
          id: 'arraydeque',
          title: 'ArrayDeque',
          subtitle: '双端队列/循环数组',
          contentFile: 'collections/arraydeque.ts'
        },
        {
          id: 'priorityqueue',
          title: 'PriorityQueue',
          subtitle: '优先级队列/堆实现',
          contentFile: 'collections/priorityqueue.ts'
        },
        {
          id: 'blockingqueue',
          title: 'BlockingQueue',
          subtitle: '阻塞队列/生产者消费者',
          contentFile: 'collections/blockingqueue.ts'
        },
        {
          id: 'concurrentlinkedqueue',
          title: 'ConcurrentLinkedQueue',
          subtitle: '无锁队列/CAS操作',
          contentFile: 'collections/concurrentlinkedqueue.ts'
        }
      ]
    },
    {
      name: '集合工具',
      blocks: [
        {
          id: 'collections-utils',
          title: 'Collections工具类',
          subtitle: '排序/查找/同步包装',
          contentFile: 'collections/collections-utils.ts'
        },
        {
          id: 'stream-api',
          title: 'Stream API',
          subtitle: '函数式编程/链式操作',
          contentFile: 'collections/stream-api.ts'
        },
        {
          id: 'fail-fast-safe',
          title: 'Fail-Fast/Safe',
          subtitle: '快速失败/安全失败',
          contentFile: 'collections/fail-fast-safe.ts'
        },
        {
          id: 'iterator',
          title: '迭代器',
          subtitle: 'Iterator/ListIterator',
          contentFile: 'collections/iterator.ts'
        }
      ]
    }
  ]
}

