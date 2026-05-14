# 哈希表（Hash Table）

> 本章目标：理解哈希函数、哈希冲突的解决方法（链地址法、开放地址法），了解哈希表的扩容

## 生活化类比

**哈希表就像图书馆的书架**：
- 每本书有一个编号（哈希值）
- 书架按编号分区存放（数组槽位）
- 找书时，根据编号直接去对应区域（O(1) 查找）

**哈希函数就像字典的偏旁部首**：
- 知道一个字的读音，不知道怎么写
- 按偏旁部首查找，直接定位到大概位置
- 可能同偏旁的字有好几个，需要再细找

## 核心概念

### 1. 哈希函数

把**任意长度的输入**转换为**固定长度的输出**：

```
输入: "apple"
↓
哈希函数: hash("apple")
↓
输出: 5（槽位索引）
```

好的哈希函数特点：
- 计算速度快
- 分布均匀（减少冲突）
- 相同输入产生相同输出

### 2. 哈希冲突

不同的输入可能产生相同的哈希值：

```
hash("apple") = 3
hash("apply") = 3  ← 冲突！
```

**冲突解决方法**：
1. **链地址法（Separate Chaining）**：相同槽位用链表存储
2. **开放地址法（Open Addressing）**：找下一个空槽位

### 3. 链地址法

每个槽位存一个链表：

```
槽位 0: 链表 → [apple] → [apply]
槽位 1: 链表 → [banana]
槽位 2: 空
槽位 3: 链表 → [cat]
...
```

插入：计算哈希值 → 加到对应链表
查找：计算哈希值 → 在链表中遍历

### 4. 开放地址法

发生冲突时，找下一个空槽位：

```
线性探测（Linear Probing）：
hash("apple") = 3，但 3 已被占用
→ 尝试 4，空了，放入

探测序列：h, h+1, h+2, h+3...
```

其他探测方式：
- **二次探测**：h + 1², h + 2², h + 3²...
- **双重哈希**：h(key) + i * h₂(key)

## 哈希表的 Python 实现

### 简单哈希表（链地址法）

```python
class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]  # 每个槽位是链表

    def hash_function(self, key):
        """简单的哈希函数"""
        return hash(key) % self.size

    def insert(self, key, value):
        """插入键值对"""
        index = self.hash_function(key)
        bucket = self.table[index]

        # 检查是否已存在 key
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)  # 更新
                return

        bucket.append((key, value))

    def get(self, key):
        """获取值"""
        index = self.hash_function(key)
        bucket = self.table[index]

        for k, v in bucket:
            if k == key:
                return v

        return None

    def delete(self, key):
        """删除键值对"""
        index = self.hash_function(key)
        bucket = self.table[index]

        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                return True

        return False
```

## 扩容（Resizing）

当哈希表太满时（负载因子 > 阈值），需要扩容：

```
负载因子 = 元素数量 / 槽位数量

当负载因子 > 0.75 时，扩容到原来的 2 倍
重新计算所有元素的哈希值（rehash）
```

扩容步骤：
1. 创建更大的数组
2. 重新计算每个元素的槽位
3. 释放旧数组

## 时间复杂度

| 操作 | 平均 | 最坏 |
|------|------|------|
| 查找 | O(1) | O(n) |
| 插入 | O(1) | O(n) |
| 删除 | O(1) | O(n) |

最坏情况：所有元素哈希到同一槽位，退化成链表

## 常见面试题

### 1. 两数之和

```python
def two_sum(nums, target):
    """找出两数之和为目标值的两个数的索引"""
    hash_map = {}

    for i, num in enumerate(nums):
        complement = target - num
        if complement in hash_map:
            return [hash_map[complement], i]
        hash_map[num] = i

    return []
```

### 2. 有效的括号

```python
def is_valid(s):
    """判断括号是否有效"""
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for char in s:
        if char in '([{':
            stack.append(char)
        else:
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()

    return len(stack) == 0
```

### 3. 字符串第一个不重复的字符

```python
def first_unique(s):
    """找出第一个不重复的字符"""
    char_count = {}

    for c in s:
        char_count[c] = char_count.get(c, 0) + 1

    for i, c in enumerate(s):
        if char_count[c] == 1:
            return i

    return -1
```

## 常见考点和易错点

### 易错点 1：哈希函数的选择

简单的 `hash(key) % size` 可能有规律。实际应用中需要考虑分布均匀性。

### 易错点 2：负载因子

负载因子太大（> 0.75）会导致冲突增多，查找变慢。需要及时扩容。

### 易错点 3：Python 的字典

Python 的 dict 就是哈希表实现，所以查找、插入、删除都是 O(1)。

## 学习检查清单

完成本章后，你应该能回答：
- [ ] 什么是哈希函数？好的哈希函数有什么特点？
- [ ] 什么是哈希冲突？有哪些解决方法？
- [ ] 链地址法和开放地址法的区别是什么？
- [ ] 什么是负载因子？为什么需要扩容？
- [ ] 哈希表各种操作的时间复杂度是多少？
- [ ] 如何用哈希表解决两数之和问题？

## 如何使用本章

```
1. 读 README.md（本文档）→ 理解哈希表的概念
2. 打开 implementation.py → 运行，看打印输出
3. 打开 visualization.html → 交互演示，边点边学
```