# 数组与顺序表

> 本章目标：理解数组和顺序表的概念、原理，掌握顺序表的各种操作及实现

## 生活化类比

**数组**就像一排紧挨着的停车位：
- 每个车位都有固定编号（0, 1, 2...）
- 你知道自己的车停在哪个位置，可以**直接**走过去
- 但如果要在中间插入一辆车，要移动后面所有车

## 核心概念

### 1. 数组（Array）

数组是最基本的数据结构，在内存中是**连续存放**的：

```
内存地址:    0x01   0x02   0x03   0x04   0x05
数组元素:    [ 10 ] [ 20 ] [ 30 ] [ 40 ] [ 50 ]
索引:         0      1      2      3      4
```

**特点**：
- 支持随机访问：通过下标 O(1) 时间找到任意元素
- 插入/删除效率低：需要移动大量元素
- 长度固定（静态数组）

### 2. 顺序表（Sequential List）

用数组实现的**线性表**，封装了插入、删除、查找等操作：

| 操作 | 时间复杂度 | 说明 |
|------|-----------|------|
| 按索引访问 | O(1) | 直接计算偏移量 |
| 在尾部插入 | O(1) | 数组有空位时 |
| 在中间插入 | O(n) | 需要移动元素 |
| 删除 | O(n) | 需要移动元素 |
| 查找 | O(n) | 逐个比较 |

## 顺序表的 Python 实现

### 节点结构（顺序表用数组存储，不需要节点）

顺序表的核心是一个**固定容量的数组**和**当前大小**：

```python
class ArrayList:
    def __init__(self, capacity=10):
        self.capacity = capacity  # 数组容量
        self.size = 0             # 当前元素个数
        self.data = [None] * capacity  # 存储数据的数组
```

### 基本操作原理

#### 1. 尾部插入（append）

最高效的操作，直接在尾部添加：

```
步骤：
1. 检查是否已满
2. 在 self.data[self.size] 位置放入新元素
3. self.size += 1

时间复杂度：O(1)
```

```python
def append(self, value):
    """在尾部添加元素 - O(1)"""
    if self.is_full():
        raise OverflowError("顺序表已满")
    self.data[self.size] = value
    self.size += 1
```

#### 2. 按索引访问（get）

直接计算内存偏移量：

```
原理：
- 数组首地址 + 索引 × 元素大小 = 目标地址
- CPU 可以直接计算出地址，无需遍历

时间复杂度：O(1)
```

```python
def get(self, index):
    """获取指定位置的元素 - O(1)"""
    if index < 0 or index >= self.size:
        raise IndexError("索引超出范围")
    return self.data[index]
```

#### 3. 在中间插入（insert）

需要移动元素腾出位置：

```
原始: [10, 20, 30, 40, -]  (capacity=5, size=4)

在位置 1 插入 15:

步骤 1: 从后往前移动元素
        [10, 20, 30, 30, 40]  data[4] = data[3]
        [10, 20, 20, 30, 40]  data[3] = data[2]
        [10, 20, 20, 30, 40]  data[2] = data[1]

步骤 2: 放入新元素
        [10, 15, 20, 30, 40]  data[1] = 15

时间复杂度：O(n)
```

```python
def insert(self, index, value):
    """在指定位置插入元素 - O(n)"""
    if index < 0 or index > self.size:
        raise IndexError("索引超出范围")
    if self.is_full():
        raise OverflowError("顺序表已满")

    # 从后往前移动元素，空出插入位置
    for i in range(self.size, index, -1):
        self.data[i] = self.data[i - 1]

    self.data[index] = value
    self.size += 1
```

#### 4. 删除元素（delete）

需要移动元素填补空缺：

```
原始: [10, 20, 30, 40]  (size=4)

删除位置 1 的元素（20）:

步骤 1: 从前往后移动元素
        [10, 30, 30, 40]  data[1] = data[2]
        [10, 30, 40, 40]  data[2] = data[3]

步骤 2: 清除尾部
        [10, 30, 40, None]  size -= 1

时间复杂度：O(n)
```

```python
def delete(self, index):
    """删除指定位置的元素 - O(n)"""
    if index < 0 or index >= self.size:
        raise IndexError("索引超出范围")

    deleted_value = self.data[index]

    # 从前往后移动元素，填补删除位置
    for i in range(index, self.size - 1):
        self.data[i] = self.data[i + 1]

    self.data[self.size - 1] = None
    self.size -= 1

    return deleted_value
```

#### 5. 查找元素（find）

逐个比较：

```python
def find(self, value):
    """查找元素，返回第一个匹配的索引 - O(n)"""
    for i in range(self.size):
        if self.data[i] == value:
            return i
    return -1
```

## 完整代码

```python
class ArrayList:
    """顺序表类 - 用固定大小的数组实现线性表"""

    def __init__(self, capacity=10):
        self.capacity = capacity
        self.size = 0
        self.data = [None] * capacity

    def __str__(self):
        elements = [str(self.data[i]) for i in range(self.size)]
        return f"ArrayList: [{', '.join(elements)}] (size={self.size})"

    def is_empty(self):
        return self.size == 0

    def is_full(self):
        return self.size == self.capacity

    def get(self, index):        # O(1)
        if index < 0 or index >= self.size:
            raise IndexError(f"索引 {index} 超出范围")
        return self.data[index]

    def set(self, index, value): # O(1)
        if index < 0 or index >= self.size:
            raise IndexError(f"索引 {index} 超出范围")
        self.data[index] = value

    def append(self, value):     # O(1)
        if self.is_full():
            raise OverflowError("顺序表已满")
        self.data[self.size] = value
        self.size += 1

    def insert(self, index, value):  # O(n)
        if index < 0 or index > self.size:
            raise IndexError(f"索引 {index} 超出范围")
        if self.is_full():
            raise OverflowError("顺序表已满")
        for i in range(self.size, index, -1):
            self.data[i] = self.data[i - 1]
        self.data[index] = value
        self.size += 1

    def delete(self, index):     # O(n)
        if index < 0 or index >= self.size:
            raise IndexError(f"索引 {index} 超出范围")
        deleted = self.data[index]
        for i in range(index, self.size - 1):
            self.data[i] = self.data[i + 1]
        self.data[self.size - 1] = None
        self.size -= 1
        return deleted

    def find(self, value):       # O(n)
        for i in range(self.size):
            if self.data[i] == value:
                return i
        return -1
```

## 顺序表 vs 数组

| 对比项 | 数组 | 顺序表 |
|--------|------|--------|
| 本质 | 固定大小的连续内存 | 封装了增删改查的数组 |
| 大小 | 固定不变 | 记录当前元素个数 |
| 操作 | 直接用 `arr[i]` | 通过方法调用 |
| 安全性 | 可越界访问（危险） | 有边界检查（安全） |

## 应用场景

### 什么时候用顺序表？
- 需要频繁**随机访问**元素
- 数据量相对固定
- 例：成绩查询、矩阵运算、排序算法中间结果

## 考试重点

1. **数组下标计算**：一维数组元素地址 = 首地址 + 索引 × 元素大小
2. **时间复杂度分析**：能说出各种操作的时间复杂度
3. **插入/删除的移动方向**：插入从后往前，删除从前往后

## 常见考点和易错点

### 易错点 1：数组下标从 0 开始
```python
arr = [10, 20, 30]
arr[0]  # 第一个元素，不是 arr[1]
```

### 易错点 2：插入时移动方向搞反
```python
# 错误：从前往后移动会覆盖数据！
for i in range(index, self.size):
    self.data[i + 1] = self.data[i]

# 正确：从后往前移动
for i in range(self.size, index, -1):
    self.data[i] = self.data[i - 1]
```

### 易错点 3：忘记更新 size
每成功插入或删除一个元素，必须相应地更新 `self.size`

## 学习检查清单

完成本章后，你应该能回答：
- [ ] 数组在内存中是如何存放的？
- [ ] 为什么数组支持 O(1) 的随机访问？
- [ ] 顺序表的插入操作需要几步？分别是什么？
- [ ] 为什么顺序表插入要"从后往前"移动元素？
- [ ] 什么是"假溢出"？（提示：顺序表已满但还有空位）

## 如何使用本章

```
1. 读 README.md（本文档）→ 理解数组和顺序表的原理
2. 打开 implementation.py → 运行，看打印输出
3. 打开 visualization.html → 打开交互演示，边点边学
4. 尝试修改代码 → 改变参数，观察输出变化
```
