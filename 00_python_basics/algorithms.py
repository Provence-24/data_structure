"""
algorithms.py
算法相关 Python 写法演示
对应教材：Python 速成（00_python_basics）
预计学习时长：15分钟

本文件展示递归、排序等算法的 Python 实现
重点是帮助你看懂后续章节的代码
运行方式：在终端执行 python algorithms.py
"""

# ============================================================================
# 1. 递归
# ============================================================================

print("=" * 50)
print("1. 递归")
print("=" * 50)

# 递归三要素：
# 1. 基本情形（终止条件）
# 2. 递归调用（把大问题化成小问题）
# 3. 递归调用有返回值

# 示例1：计算阶乘
def factorial(n):
    """
    计算 n!（n 的阶乘）
    递归公式: n! = n * (n-1)!
    基本情形: 0! = 1, 1! = 1
    """
    # 基本情形
    if n <= 1:
        return 1
    # 递归调用
    return n * factorial(n - 1)

print("5! =", factorial(5))
print("0! =", factorial(0))
print("10! =", factorial(10))

# 示例2：斐波那契数列
def fibonacci(n):
    """
    计算斐波那契数列第 n 项
    递归公式: F(n) = F(n-1) + F(n-2)
    基本情形: F(0) = 0, F(1) = 1
    """
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("\n斐波那契数列前 10 项:")
for i in range(10):
    print(f"F({i}) =", fibonacci(i), end="  ")
print()

# 示例3：反转列表（递归版）
def reverse_list_recursive(lst):
    """
    递归反转列表
    [1, 2, 3] -> [3, 2, 1]
    """
    if len(lst) <= 1:
        return lst[:]
    return [lst[-1]] + reverse_list_recursive(lst[:-1])

print("\n递归反转列表 [1, 2, 3, 4, 5]:")
print("  结果:", reverse_list_recursive([1, 2, 3, 4, 5]))

# 示例4：递归遍历嵌套列表
def flatten(nested):
    """
    将嵌套列表展开成单层列表
    [1, [2, 3], [4, [5, 6]]] -> [1, 2, 3, 4, 5, 6]
    """
    result = []
    for item in nested:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

print("\n展开嵌套列表 [1, [2, 3], [4, [5, 6]]]:")
print("  结果:", flatten([1, [2, 3], [4, [5, 6]]]))

# ============================================================================
# 2. 排序算法（基础版）
# ============================================================================

print("\n" + "=" * 50)
print("2. 排序算法基础版")
print("=" * 50)

# 选择排序
def selection_sort(arr):
    """
    选择排序
    思想：每一轮找到剩余元素中最小的，放到正确位置
    时间复杂度：O(n^2)
    """
    arr = arr[:]  # 不修改原数组
    n = len(arr)
    result = []

    for i in range(n):
        # 找到剩余元素中的最小值
        min_val = min(arr)
        min_idx = arr.index(min_val)
        # 移除并记录
        arr.pop(min_idx)
        result.append(min_val)
        print(f"  第 {i+1} 轮: 找到最小值 {min_val}, 剩余 {arr}")

    return result

print("选择排序 [64, 25, 12, 22, 11]:")
sorted_arr = selection_sort([64, 25, 12, 22, 11])
print("  结果:", sorted_arr)

# ============================================================================
# 3. 查找
# ============================================================================

print("\n" + "=" * 50)
print("3. 查找算法")
print("=" * 50)

# 顺序查找（暴力查找）
def linear_search(arr, target):
    """
    顺序查找
    从头到尾一个个找
    时间复杂度：O(n)
    """
    for i, val in enumerate(arr):
        if val == target:
            return i  # 找到，返回索引
    return -1  # 没找到

arr = [4, 2, 7, 1, 9, 3]
print(f"在 {arr} 中查找 7:")
idx = linear_search(arr, 7)
print(f"  找到，索引: {idx}")

print(f"在 {arr} 中查找 5:")
idx = linear_search(arr, 5)
print(f"  没找到，返回: {idx}")

# 二分查找（前提：数组有序）
def binary_search(arr, target):
    """
    二分查找
    每次排除一半的元素
    时间复杂度：O(log n)
    注意：数组必须是有序的！
    """
    arr = sorted(arr)  # 确保有序
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2
        print(f"  搜索范围: [{left}, {right}], 中间位置: {mid}, 值: {arr[mid]}")

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

print(f"\n二分查找 {sorted(arr)} 中查找 7:")
idx = binary_search(arr, 7)
print(f"  找到，索引: {idx}")

# ============================================================================
# 4. 两个指针技巧
# ============================================================================

print("\n" + "=" * 50)
print("4. 两个指针技巧")
print("=" * 50)

# 示例：反转数组
def reverse_array(arr):
    """
    用两个指针反转数组
    左指针从头开始，右指针从尾开始
    交换两端的元素，逐步向中间靠拢
    """
    arr = arr[:]  # 不修改原数组
    left, right = 0, len(arr) - 1

    print(f"  初始: {arr}")
    while left < right:
        print(f"  交换 arr[{left}]={arr[left]} 和 arr[{right}]={arr[right]}")
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1
        print(f"  当前: {arr}")

    return arr

print("反转数组 [1, 2, 3, 4, 5]:")
print("  结果:", reverse_array([1, 2, 3, 4, 5]))

# 示例：判断回文
def is_palindrome(s):
    """
    判断字符串是否是回文
    回文：正读和反读一样，如 "aba", "racecar"
    """
    s = s.lower()  # 转小写
    left, right = 0, len(s) - 1

    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1

    return True

print("\n判断回文:")
print("  'racecar' 是回文:", is_palindrome("racecar"))
print("  'hello' 是回文:", is_palindrome("hello"))
print("  'A man a plan a canal Panama' 是回文:", is_palindrome("A man a plan a canal Panama"))

# ============================================================================
# 5. 哈希表计数
# ============================================================================

print("\n" + "=" * 50)
print("5. 哈希表计数")
print("=" * 50)

def count_frequency(arr):
    """
    统计数组中每个元素出现的次数
    使用字典（哈希表）实现，O(n) 时间复杂度
    """
    freq = {}
    for item in arr:
        if item in freq:
            freq[item] += 1
        else:
            freq[item] = 1
    return freq

arr = ["apple", "banana", "apple", "orange", "banana", "apple"]
print(f"统计 {arr} 中各元素出现次数:")
freq = count_frequency(arr)
for item, count in freq.items():
    print(f"  {item}: {count} 次")

# 找出出现次数最多的元素
def most_frequent(arr):
    """
    找出出现次数最多的元素
    """
    freq = count_frequency(arr)
    max_item, max_count = None, 0
    for item, count in freq.items():
        if count > max_count:
            max_item, max_count = item, count
    return max_item, max_count

print(f"\n出现最多的元素: {most_frequent(arr)}")

# ============================================================================
# 6. 矩阵操作（后续图章节会用到）
# ============================================================================

print("\n" + "=" * 50)
print("6. 矩阵操作基础")
print("=" * 50)

# 创建矩阵（用列表的列表）
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

print("矩阵:")
for row in matrix:
    print(" ", row)

# 访问元素
print(f"\nmatrix[1][1] = {matrix[1][1]}")  # 第2行第2列

# 遍历矩阵
print("\n遍历矩阵（按行）:")
for i, row in enumerate(matrix):
    for j, val in enumerate(row):
        print(f"  [{i}][{j}] = {val}")

# 矩阵转置
def transpose(matrix):
    """矩阵转置：行变列，列变行"""
    rows = len(matrix)
    cols = len(matrix[0])
    result = [[0] * rows for _ in range(cols)]

    for i in range(rows):
        for j in range(cols):
            result[j][i] = matrix[i][j]

    return result

print("\n矩阵转置:")
transposed = transpose(matrix)
for row in transposed:
    print(" ", row)

# ============================================================================
# 主程序入口
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("程序执行完毕！")
    print("=" * 50)
    print("\n这些是后续章节会用到的基础算法思想：")
    print("  - 递归：分治思想，05_recursion 章节详细讲")
    print("  - 排序：11_sorting_algorithms 章节详细讲")
    print("  - 两指针：链表、数组问题的常用技巧")
    print("  - 哈希表计数：快速统计出现次数")
