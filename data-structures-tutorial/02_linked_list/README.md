# 链表（Linked List）

> 本章目标：深入理解链表，特别是指针操作，能手写链表的各种操作

## 生活化类比

想象游乐场排队买票：
- 每个人只记住自己**后面那个人是谁**（指针）
- 第一个人记住第二个人，第二个人记住第三个人...
- 如果要在中间插队，只需要告诉"第二个人"你后面是"第三个人"就行了
- 不需要移动任何人！

**这就是链表的核心思想**：分散存储 + 靠指针连接。

## 核心概念

### 单向链表节点结构

```
┌─────────┬────────┐
│  data   │  next  │
│  (数据) │ (指针) │
└─────────┴────────┘
```

- `data`：存储实际数据
- `next`：一个指针，指向下一个节点（`None`/`null` 表示链表结束）

### 链表 vs 数组（回顾）

| 对比项 | 数组 | 链表 |
|--------|------|------|
| 内存 | 连续存放 | 分散存放 |
| 访问 | O(1) 随机访问 | O(n) 顺序访问 |
| 插入/删除 | O(n)（要移动元素） | O(1)（只改指针） |
| 空间 | 无额外开销 | 需要存指针 |

## 链表操作详解

### 1. 头部插入（最简单！）

```
原始:  head -> [10] -> [20] -> [30] -> NULL

插入 5 到头部:
1. 创建新节点 Node(5)
2. newNode.next = head
3. head = newNode

结果:  head -> [5] -> [10] -> [20] -> [30] -> NULL
```

**时间复杂度：O(1)** — 这是链表相对于数组最大的优势！

### 2. 尾部插入

```
原始:  head -> [10] -> [20] -> [30] -> NULL, tail = [30]

插入 40 到尾部:
1. 创建新节点 Node(40)
2. tail.next = newNode
3. tail = newNode

结果:  head -> [10] -> [20] -> [30] -> [40] -> NULL, tail = [40]
```

**时间复杂度：O(1)**（如果有尾指针）

### 3. 中间插入（在位置 i 插入）

这是最复杂的操作！

```
原始:  head -> [10] -> [20] -> [30] -> NULL

在位置 1（20之前）插入 15:
1. 找到位置 i-1 的节点（从头遍历）
2. 创建新节点 Node(15)
3. newNode.next = prevNode.next
4. prevNode.next = newNode

结果:  head -> [10] -> [15] -> [20] -> [30] -> NULL
```

**口诀**：先接后断！
- 第3步：先把后面的链表接上（`newNode.next = prevNode.next`）
- 第4步：再把前面的链表接过来（`prevNode.next = newNode`）

**为什么不能先做第4步？** 因为做了之后，你就找不到后面的链表了！

### 4. 删除节点

```
原始:  head -> [10] -> [15] -> [20] -> [30] -> NULL

删除位置 1 的节点（15）:
1. 找到位置 i-1 的节点（10）
2. nodeToDelete = prevNode.next
3. prevNode.next = nodeToDelete.next
4. 释放 nodeToDelete

结果:  head -> [10] -> [20] -> [30] -> NULL
```

### 5. 反转链表（经典考题！）

```
原始:  head -> [10] -> [20] -> [30] -> NULL

反转后: head -> [30] -> [20] -> [10] -> NULL
```

方法：用三个指针 prev、curr、next

```
初始:  prev=NULL, curr=10

第1步: next = curr.next  (20)
       curr.next = prev  (NULL)
       prev = curr       (10)
       curr = next       (20)

第2步: next = curr.next  (30)
       curr.next = prev  (10)
       prev = curr       (20)
       curr = next       (30)

第3步: next = curr.next  (NULL)
       curr.next = prev  (20)
       prev = curr       (30)
       curr = next       (NULL)

结束: head = prev = 30

结果:  [30] -> [20] -> [10] -> NULL
```

## 链表的应用场景

1. **LRU 缓存**：最近最少使用缓存，用链表快速移动到头部
2. **浏览器前进/后退**：用两个栈（或链表）实现
3. **文件系统的 inode 链表**：目录项之间通过指针连接
4. **哈希表的链地址法**：每个桶是一个链表

## 常见考点和易错点

### 易错点 1：插入顺序搞反

```python
# 错误！先断了后面的链表
prev.next = new_node
new_node.next = prev.next  #这时 prev.next 已经是 new_node 了！

# 正确：先接后断
new_node.next = prev.next
prev.next = new_node
```

### 易错点 2：忘记处理空链表

```python
# 在空链表头部插入
if self.head is None:
    self.head = new_node
    self.tail = new_node  # 别忘了更新 tail！
```

### 易错点 3：循环终止条件

```python
# 遍历链表
current = self.head
while current is not None:  # 不是 current.next is not None
    current = current.next
```

### 易错点 4：删除时忘记释放

在 C/C++ 中需要手动 `free(node)`，Python 有垃圾回收会自动处理。

## 学习检查清单

完成本章后，你应该能：
- [ ] 画出一个链表的节点结构图
- [ ] 解释为什么链表插入/删除是 O(1)
- [ ] 手写代码在链表头部插入一个节点
- [ ] 手写代码在链表尾部插入一个节点
- [ ] 手写代码在链表中间插入一个节点（先接后断）
- [ ] 手写代码删除链表中的一个节点
- [ ] 手写代码反转一个链表
- [ ] 能说出链表相对于数组的优点和缺点

## 如何使用本章

```
1. 读 README.md（本文档）→ 理解链表原理和操作
2. 打开 implementation.py → 运行，看打印输出
3. 打开 visualization.html → 交互演示，边点边学
```
