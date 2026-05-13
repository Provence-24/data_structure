# 排序算法（Sorting Algorithms）

> 本章目标：掌握常见的排序算法，理解各算法的时间复杂度，能分析排序的稳定性

## 生活化类比

**整理扑克牌**：
- 把牌按顺序排列
- 不同的整理方式就是不同的排序算法

**考试排名**：
- 按成绩从高到低排序
- 不同科目的排序方式可能不同

## 核心概念

### 1. 排序的稳定性

**稳定的排序**：相等的元素排序后相对位置不变

```
不稳定排序示例：
[3, 2, 1, 2] → [1, 2, 2, 3]  ← 红色的 2 跑到蓝色 2 后面了

稳定排序示例：
[3, 2, 1, 2] → [1, 2, 2, 3]  ← 两个 2 的相对位置不变
```

### 2. 时间复杂度概览

| 算法 | 平均 | 最坏 | 空间 | 稳定 |
|------|------|------|------|------|
| 冒泡排序 | O(n²) | O(n²) | O(1) | ✓ |
| 选择排序 | O(n²) | O(n²) | O(1) | ✗ |
| 插入排序 | O(n²) | O(n²) | O(1) | ✓ |
| 归并排序 | O(n log n) | O(n log n) | O(n) | ✓ |
| 快速排序 | O(n log n) | O(n²) | O(log n) | ✗ |
| 堆排序 | O(n log n) | O(n log n) | O(1) | ✗ |

## 排序算法详解

### 1. 冒泡排序（Bubble Sort）

像水底气泡往上冒，每一轮把最大的冒到最后：

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:  # 已经有序，提前结束
            break
```

**优化**：提前结束 + 记录最后交换位置

### 2. 选择排序（Selection Sort）

每轮选择最小的，放到已排序部分末尾：

```python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
```

### 3. 插入排序（Insertion Sort）

像打牌时整理手牌，新牌插入到正确位置：

```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
```

**特点**：对近乎有序的数组效率高 O(n)

### 4. 归并排序（Merge Sort）

分而治之：先分，再合并：

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)


def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

### 5. 快速排序（Quick Sort）

选基准，分两边，递归排序：

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quick_sort(left) + middle + quick_sort(right)
```

**原地版本**：

```python
def quick_sort_inplace(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1

    if low < high:
        pivot_idx = partition(arr, low, high)
        quick_sort_inplace(arr, low, pivot_idx - 1)
        quick_sort_inplace(arr, pivot_idx + 1, high)


def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
```

### 6. 堆排序（Heap Sort）

利用最大堆的性质排序：

```python
def heap_sort(arr):
    n = len(arr)

    # 构建最大堆
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, i, n)

    # 逐个取出堆顶
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        sift_down(arr, 0, i)


def sift_down(arr, i, size):
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

## 常见面试题

### 1. 合并两个有序数组

```python
def merge_sorted_arrays(a, b):
    """合并两个有序数组"""
    result = []
    i = j = 0

    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i])
            i += 1
        else:
            result.append(b[j])
            j += 1

    result.extend(a[i:])
    result.extend(b[j:])
    return result
```

### 2. 前 K 个最大的元素

```python
import heapq

def top_k(arr, k):
    """用最小堆找前 K 大的元素"""
    return heapq.nlargest(k, arr)
```

## 常见考点和易错点

### 易错点 1：时间复杂度

- 冒泡/选择/插入：O(n²)
- 归并/快速/堆：O(n log n)

### 易错点 2：稳定性

稳定：冒泡、插入、归并
不稳定：选择、快速、堆

### 易错点 3：空间复杂度

归并排序需要 O(n) 额外空间（合并时）
快速排序递归需要 O(log n) 栈空间

## 学习检查清单

完成本章后，你应该能回答：
- [ ] 冒泡排序的原理是什么？有什么优化方法？
- [ ] 选择排序和插入排序的区别是什么？
- [ ] 归并排序的分治思想是什么？
- [ ] 快速排序如何选择基准？最坏情况是什么？
- [ ] 什么是排序的稳定性？为什么重要？
- [ ] 各种排序算法的时间复杂度和空间复杂度是多少？

## 如何使用本章

```
1. 读 README.md（本文档）→ 理解排序算法原理
2. 打开 implementation.py → 运行，看打印输出
3. 打开 visualization.html → 交互演示，边点边学
```