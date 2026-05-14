# 堆（Heap）

> 本章目标：理解堆的性质、堆的两种操作（上浮、下沉），掌握堆排序的思想

## 生活化类比

**堆就像自助餐的盘子架**：
- 最上面的盘子最好拿（最大堆：最大的在最上面）
- 新盘子放上去会沉下去（sift down / sink）
- 拿走最上面的盘子后，其他盘子要往上挪（sift up / swim）

**优先级队列**：
- 病人送到急诊室，按病情严重程度排队
- 最严重的排在最前面（最大堆）
- 新病人来了，严重的往前插

## 核心概念

### 1. 堆的定义

堆是一棵**完全二叉树**，并且满足**堆序性质**：

**最大堆（Max Heap）**：父节点 >= 子节点
**最小堆（Min Heap）**：父节点 <= 子节点

```
最大堆示例：
            9
           / \
          7   6
         / \ / \
        5  3 4  1
```

特点：
- 完全二叉树 → 可以用数组存储
- 堆序性质 → 根节点是最大/最小的

### 2. 堆的数组表示

用数组存储完全二叉树：

```
数组索引:  0   1   2   3   4   5   6
          ┌───┬───┬───┬───┬───┬───┬───┐
元素:     │ 9 │ 7 │ 6 │ 5 │ 3 │ 4 │ 1 │
          └───┴───┴───┴───┴───┴───┴───┘

树结构:
            9[0]
           / \
      7[1]     6[2]
         / \    /
    5[3]  3[4]  4[5]
```

**父子关系**（索引从 0 开始）：
- 父节点索引 = (子节点索引 - 1) // 2
- 左子节点索引 = 父节点索引 * 2 + 1
- 右子节点索引 = 父节点索引 * 2 + 2

**父子关系**（索引从 1 开始，更常见）：
- 父节点索引 = 子节点索引 // 2
- 左子节点索引 = 父节点索引 * 2
- 右子节点索引 = 父节点索引 * 2 + 1

### 3. 上浮操作（Sift Up / Swim）

当插入新元素时，它可能破坏堆序性，需要向上比较：

```
插入 10：
            9              9              10
           / \            / \            / \
          7   6    →    7   6     →    7   9
         / \ / \        / \ / \        / \ / \
        5  3 4  1      5  3 4  1      5  3 4  1  10
                            ↑                    ↑
                         插入10                 10上浮
```

### 4. 下沉操作（Sift Down / Sink）

当删除根节点或某个节点被替换时，需要向下比较：

```
删除根节点 9，用最后一个元素替代：
            1               1               7
           / \             / \             / \
          7   6     →     7   6     →     5   6
         / \ / \         / \             / \
        5  3 4          5  3 4          ...  ...
```

## 堆的 Python 实现

### 基础操作

```python
class MaxHeap:
    def __init__(self):
        self.heap = []

    def parent(self, i):
        return (i - 1) // 2

    def left_child(self, i):
        return i * 2 + 1

    def right_child(self, i):
        return i * 2 + 2

    def swap(self, i, j):
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]
```

### 上浮操作

```python
    def sift_up(self, i):
        """将索引 i 的元素上浮到正确位置"""
        while i > 0:
            parent = self.parent(i)
            if self.heap[i] > self.heap[parent]:
                self.swap(i, parent)
                i = parent
            else:
                break
```

### 下沉操作

```python
    def sift_down(self, i):
        """将索引 i 的元素下沉到正确位置"""
        size = len(self.heap)
        while True:
            largest = i
            left = self.left_child(i)
            right = self.right_child(i)

            if left < size and self.heap[left] > self.heap[largest]:
                largest = left
            if right < size and self.heap[right] > self.heap[largest]:
                largest = right

            if largest != i:
                self.swap(i, largest)
                i = largest
            else:
                break
```

### 插入

```python
    def insert(self, value):
        """插入新元素"""
        self.heap.append(value)
        self.sift_up(len(self.heap) - 1)
```

### 弹出最大值

```python
    def extract_max(self):
        """删除并返回最大值（根节点）"""
        if not self.heap:
            return None

        max_val = self.heap[0]
        last = self.heap.pop()

        if self.heap:
            self.heap[0] = last
            self.sift_down(0)

        return max_val
```

## 堆排序（Heap Sort）

利用堆的性质进行排序，时间复杂度 O(n log n)：

```python
def heap_sort(arr):
    """堆排序"""
    n = len(arr)

    # 1. 构建最大堆（从最后一个非叶子节点开始下沉）
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, i, n)

    # 2. 逐个取出堆顶，放到数组末尾
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]  # 堆顶移到末尾
        sift_down(arr, 0, i)  # 剩余元素重新堆化


def sift_down(arr, i, size):
    """下沉操作（用于堆排序）"""
    while True:
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2

        if left < size and arr[left] > arr[largest]:
            largest = left
        if right < size and arr[right] > arr[largest]:
            largest = right

        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            i = largest
        else:
            break
```

## 常见考点和易错点

### 易错点 1：父子节点索引计算

数组索引从 0 开始时：
- 父 = (索引 - 1) // 2
- 左子 = 索引 * 2 + 1
- 右子 = 索引 * 2 + 2

数组索引从 1 开始时：
- 父 = 索引 // 2
- 左子 = 索引 * 2
- 右子 = 索引 * 2 + 1

### 易错点 2：堆排序的空间复杂度

堆排序是原地排序，空间复杂度 O(1)。

### 易错点 3：上浮 vs 下沉

- 插入时用**上浮**：新元素在末尾，往上比较
- 删除/排序时用**下沉**：堆顶元素下来，往下比较

## 学习检查清单

完成本章后，你应该能回答：
- [ ] 什么是最大堆？什么是完全二叉树？
- [ ] 堆如何用数组存储？父子节点索引如何计算？
- [ ] 上浮操作用于什么场景？下沉操作用于什么场景？
- [ ] 如何用堆实现优先级队列？
- [ ] 堆排序的步骤是什么？
- [ ] 堆排序的时间复杂度和空间复杂度是多少？

## 如何使用本章

```
1. 读 README.md（本文档）→ 理解堆的概念
2. 打开 implementation.py → 运行，看打印输出
3. 打开 visualization.html → 交互演示，边点边学
```