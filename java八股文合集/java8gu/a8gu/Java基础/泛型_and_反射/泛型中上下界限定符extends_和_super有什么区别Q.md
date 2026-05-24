# ✅泛型中上下界限定符extends 和 super有什么区别？

# 典型回答

### extends<? extends T> 表示类型的上界，表示参数化类型的可能是T 或是 T的子类
​

举个例子，假设我们有一个基本类 `Animal` 和两个子类 `Dog` 和 `Cat`：
​

我们可以使用 `extends` 限定符来定义一个泛型方法，只允许传入 `Animal` 或其子类：
​

### super​

<? super T> 表示类型下界（Java Core中叫超类型限定），表示参数化类型是此类型的超类型（父类型），直至Object
​

假设我们需要定义一个方法，向一个 `List` 中插入元素，这个 `List` 的泛型类型可以是某个类或该类的父类：
​

### PECS 原则​

在使用 限定通配符的时候，需要遵守**PECS原则**，即Producer Extends, Consumer Super；上界生产，下界消费。
​

如果要从集合中读取类型T的数据，并且不能写入，可以使用 ? extends 通配符；(Producer Extends)，如上面的processNumber方法。
​

如果要从集合中写入类型T的数据，并且不需要读取，可以使用 ? super 通配符；(Consumer Super)，如上面的addElements方法
​

> extend的时候是可读取不可写入，那为什么叫上界生产呢？因为这个消费者/生产者描述的<集合>，当我们从集合读取的时候，集合是生产者。

如果既要存又要取，那么就不要使用任何通配符。
​

综合示例：
