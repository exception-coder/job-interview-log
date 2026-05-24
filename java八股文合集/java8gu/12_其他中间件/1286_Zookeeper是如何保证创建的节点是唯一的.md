# ✅Zookeeper是如何保证创建的节点是唯一的？

> 题号：1286 ｜ 分类：12_其他中间件

---

## 典型回答

Zookeeper通过两个手段来保证节点创建的唯一性：

1、所有的写请求都会由Leader进行，即使是请求到Follower节点，也会被转发到Leader节点上执行。

2、在Leader上写入数据的时候，通过加锁(synchronized)和CAS（ConcurrentHashMap）操作，保证了并发情况下只有一个线程可以添加成功。

第一点我们就不展开讲了，这个是ZK中的角色天然具备的特性，我们重点展开说说第二点原因。我们来看下ZK的源码，看看到底是如何创建节点的。

以下代码在[github](https://github.com/apache/zookeeper/blob/15f29b51a22bc51b9d6074cb7f3e72bb00a9753a/zookeeper-server/src/main/java/org/apache/zookeeper/server/DataTree.java#L416)中可以看到，在DataTree的createNode方法就是进行节点创建的：

```java
public void createNode(final String path, byte[] data, List<ACL> acl, long ephemeralOwner, int parentCVersion, long zxid, long time, Stat outputStat) throws NoNodeException, NodeExistsException {
    int lastSlash = path.lastIndexOf('/');
    String parentName = path.substring(0, lastSlash);
    String childName = path.substring(lastSlash + 1);
    StatPersisted stat = createStat(zxid, time, ephemeralOwner);
    DataNode parent = nodes.get(parentName);
    if (parent == null) {
        throw new NoNodeException();
    }
    synchronized (parent) {
        // Add the ACL to ACL cache first, to avoid the ACL not being
        // created race condition during fuzzy snapshot sync.
        //
        // This is the simplest fix, which may add ACL reference count
        // again if it's already counted in the ACL map of fuzzy
        // snapshot, which might also happen for deleteNode txn, but
        // at least it won't cause the ACL not exist issue.
        //
        // Later we can audit and delete all non-referenced ACLs from
        // ACL map when loading the snapshot/txns from disk, like what
        // we did for the global sessions.
        Long acls = aclCache.convertAcls(acl);

        Set<String> children = parent.getChildren();
        if (children.contains(childName)) {
            throw new NodeExistsException();
        }

        nodes.preChange(parentName, parent);
        if (parentCVersion == -1) {
            parentCVersion = parent.stat.getCversion();
            parentCVersion++;
        }
        // There is possibility that we'll replay txns for a node which
        // was created and then deleted in the fuzzy range, and it's not
        // exist in the snapshot, so replay the creation might revert the
        // cversion and pzxid, need to check and only update when it's
        // larger.
        if (parentCVersion > parent.stat.getCversion()) {
            parent.stat.setCversion(parentCVersion);
            parent.stat.setPzxid(zxid);
        }
        DataNode child = new DataNode(data, acls, stat);
        parent.addChild(childName);
        nodes.postChange(parentName, parent);
        nodeDataSize.addAndGet(getNodeSize(path, child.data));
        nodes.put(path, child);
        EphemeralType ephemeralType = EphemeralType.get(ephemeralOwner);
        if (ephemeralType == EphemeralType.CONTAINER) {
            containers.add(path);
        } else if (ephemeralType == EphemeralType.TTL) {
            ttls.add(path);
        } else if (ephemeralOwner != 0) {
            HashSet<String> list = ephemerals.computeIfAbsent(ephemeralOwner, k -> new HashSet<>());
            synchronized (list) {
                list.add(path);
            }
        }
        if (outputStat != null) {
            child.copyStat(outputStat);
        }
        }
            // now check if its one of the zookeeper node child
            if (parentName.startsWith(quotaZookeeper)) {
            // now check if it's the limit node
            if (Quotas.limitNode.equals(childName)) {
            // this is the limit node
            // get the parent and add it to the trie
            pTrie.addPath(Quotas.trimQuotaPath(parentName));
        }
            if (Quotas.statNode.equals(childName)) {
            updateQuotaForPath(Quotas.trimQuotaPath(parentName));
        }
        }

            String lastPrefix = getMaxPrefixWithQuota(path);
            long bytes = data == null ? 0 : data.length;
            // also check to update the quotas for this node
            if (lastPrefix != null) {    // ok we have some match and need to update
            updateQuotaStat(lastPrefix, bytes, 1);
        }
            updateWriteStat(path, bytes);
            dataWatches.triggerWatch(path, Event.EventType.NodeCreated, zxid);
            childWatches.triggerWatch(parentName.equals("") ? "/" : parentName, Event.EventType.NodeChildrenChanged, zxid);
        }

```

以上代码中，第10 行，针对当前要创建的节点的父节点添加了互斥锁，主要是用来避免并发，这样就可以在同一时刻，只有一个线程可以在父节点下写内容。

那么，接下来，就只需要保证当前获得锁的线程，不会多创建出节点就好了。

首先，第24-27行，做校验，判断当前父节点的所有子节点中，是否包含我们此次要创建的节点，如果已经包含，直接抛异常即可。

```java
        Set<String> children = parent.getChildren();
        if (children.contains(childName)) {
            throw new NodeExistsException();
        }
```

如果通过了这几行的校验，那么就继续向下执行节点的创建就行了。

以上，一锁、二判、三更新，是不是很像我们介绍的幂等问题的解决思路？

> 📎 相关：[✅如何解决接口幂等的问题？](https://www.yuque.com/hollis666/fsn3og/gz2qwl)

接下来会创建一个节点，并把它放到nodes中：

```java
DataNode child = new DataNode(data, acls, stat);
parent.addChild(childName);
nodes.postChange(parentName, parent);
nodeDataSize.addAndGet(getNodeSize(path, child.data));
nodes.put(path, child);
```

这里的nodes是ZK自定义的一个NodeHashMap类型，他其实就是维护了ZK中的节点的一个数据结构。他的实现其实是基于ConcurrentHashMap实现的：

```java
public class NodeHashMapImpl implements NodeHashMap {

    private final ConcurrentHashMap<String, DataNode> nodes;
    private final boolean digestEnabled;
    private final DigestCalculator digestCalculator;

    private final AdHash hash;

    public NodeHashMapImpl(DigestCalculator digestCalculator) {
        this.digestCalculator = digestCalculator;
        nodes = new ConcurrentHashMap<>();
        hash = new AdHash();
        digestEnabled = ZooKeeperServer.isDigestEnabled();
    }

    @Override
    public DataNode put(String path, DataNode node) {
        DataNode oldNode = nodes.put(path, node);
        addDigest(path, node);
        if (oldNode != null) {
            removeDigest(path, oldNode);
        }
        return oldNode;
    }
}
```

可以看到，他的put方法其实就是调用的ConcurrentHashMap的put方法实现的，而ConcurrentHashMap的并发安全性不需要我们过多介绍了。

> 📎 相关：[✅ConcurrentHashMap是如何保证线程安全的？](https://www.yuque.com/hollis666/fsn3og/seuqd9oynk2enp9t)

以上，就是ZK中创建节点的方法的主要实现。

先是通过synchronized锁，将父节点锁住，然后再在锁里面判断是否已经存在节点，如果已存在，直接抛异常，如果不存在，则向维护了节点的map——NodeHashMap中添加当前节点。
