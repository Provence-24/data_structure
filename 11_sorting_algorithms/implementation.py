"""
implementation.py
排序算法的 Python 实现
对应教材：11_sorting_algorithms
预计学习时长：3小时

本文件展示：
1. 冒泡排序、选择排序、插入排序（O(n²)）
2. 归并排序、快速排序、堆排序（O(n log n)）
3. 各算法的步骤和复杂度分析

运行方式：在终端执行 python implementation.py
"""

# ============================================================================
# 辅助函数
# ============================================================================

def print_arr(arr, highlight=None):
    """打印数组，highlight 是要标记的元素索引"""
    result = []
    for i, v in enumerate(arr):
        if highlight and i in highlight:
            result.append("[" + str(v) + "]")
        else:
            result.append(str(v))
    print("  " + " ".join(result))


# ============================================================================
# 1. 冒泡排序
# ============================================================================

print("=" * 60)
print("1. 冒泡排序（Bubble Sort）")
print("=" * 60)


def bubble_sort(arr):
    """冒泡排序"""
    n = len(arr)
    print("原始数组：" + str(arr))

    for i in range(n):
        swapped = False
        print("\n第 " + str(i + 1) + " 轮：")
        for j in range(0, n - i - 1):
            a_j = arr[j]
            a_j1 = arr[j + 1]
            print("  比较 arr[%d]=%d 和 arr[%d]=%d" % (j, a_j, j + 1, a_j1), end="")
            if a_j > a_j1:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                print(" → 交换")
                swapped = True
            else:
                print(" → 不交换")
        print("  本轮结束：" + str(arr))
        if not swapped:
            print("  没有交换，提前结束！")
            break

    return arr


arr = [64, 34, 25, 12, 22, 11, 90]
print("\n--- 冒泡排序演示 ---")
bubble_sort(arr.copy())


# ============================================================================
# 2. 选择排序
# ============================================================================

print("\n" + "=" * 60)
print("2. 选择排序（Selection Sort）")
print("=" * 60)


def selection_sort(arr):
    """选择排序"""
    n = len(arr)
    print("原始数组：" + str(arr))

    for i in range(n):
        min_idx = i
        print("\n第 " + str(i + 1) + " 轮：找最小值")

        # 在未排序部分找最小值
        for j in range(i + 1, n):
            m_val = arr[min_idx]
            j_val = arr[j]
            print("  比较 arr[%d]=%d 和 arr[%d]=%d" % (min_idx, m_val, j, j_val), end="")
            if j_val < m_val:
                min_idx = j
                print(" → 更新最小值索引为 %d" % j)
            else:
                print()

        # 把最小值换到已排序部分末尾
        if min_idx != i:
            print("  把 %d（最小）换到位置 %d" % (arr[min_idx], i))
            arr[i], arr[min_idx] = arr[min_idx], arr[i]

        print("  本轮结束：" + str(arr))

    return arr


arr = [64, 25, 12, 22, 11]
print("\n--- 选择排序演示 ---")
selection_sort(arr.copy())


# ============================================================================
# 3. 插入排序
# ============================================================================

print("\n" + "=" * 60)
print("3. 插入排序（Insertion Sort）")
print("=" * 60)


def insertion_sort(arr):
    """插入排序"""
    n = len(arr)
    print("原始数组：" + str(arr))

    for i in range(1, n):
        key = arr[i]
        j = i - 1
        print("\n第 " + str(i) + " 轮：插入 " + str(key))

        # 把比 key 大的元素往后移
        while j >= 0 and arr[j] > key:
            print("  arr[%d]=%d > %d，往后移" % (j, arr[j], key))
            arr[j + 1] = arr[j]
            j -= 1

        arr[j + 1] = key
        print("  把 %d 放到位置 %d" % (key, j + 1))
        print("  当前数组：" + str(arr))

    return arr


arr = [12, 11, 13, 5, 6]
print("\n--- 插入排序演示 ---")
insertion_sort(arr.copy())


# ============================================================================
# 4. 归并排序
# ============================================================================

print("\n" + "=" * 60)
print("4. 归并排序（Merge Sort）")
print("=" * 60)


def merge_sort(arr):
    """归并排序"""
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)


def merge(left, right):
    """合并两个有序数组"""
    print("  合并：" + str(left) + " 和 " + str(right))

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

    print("  → " + str(result))
    return result


arr = [38, 27, 43, 3, 9, 82, 10]
print("原始数组：" + str(arr))
print("\n--- 归并排序演示 ---")
sorted_arr = merge_sort(arr)
print("\n排序结果：" + str(sorted_arr))


# ============================================================================
# 5. 快速排序
# ============================================================================

print("\n" + "=" * 60)
print("5. 快速排序（Quick Sort）")
print("=" * 60)


def quick_sort(arr):
    """快速排序"""
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    print("基准值：" + str(pivot))

    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    print("  左：" + str(left) + "，基准：" + str(middle) + "，右：" + str(right))

    return quick_sort(left) + middle + quick_sort(right)


arr = [10, 7, 8, 9, 1, 5]
print("原始数组：" + str(arr))
print("\n--- 快速排序演示 ---")
sorted_arr = quick_sort(arr)
print("\n排序结果：" + str(sorted_arr))


# ============================================================================
# 6. 堆排序
# ============================================================================

print("\n" + "=" * 60)
print("6. 堆排序（Heap Sort）")
print("=" * 60)


def sift_down(arr, i, size):
    """下沉操作"""
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


def heap_sort(arr):
    """堆排序"""
    n = len(arr)
    print("原始数组：" + str(arr))

    # 1. 构建最大堆
    print("\n--- 构建最大堆 ---")
    for i in range(n // 2 - 1, -1, -1):
        print("下沉节点 %d（值=%d）" % (i, arr[i]))
        sift_down(arr, i, n)
        print("  数组状态：" + str(arr))

    # 2. 逐个取出堆顶
    print("\n--- 逐个取出堆顶 ---")
    for i in range(n - 1, 0, -1):
        print("交换堆顶 %d 和末尾 %d" % (arr[0], arr[i]))
        arr[0], arr[i] = arr[i], arr[0]
        sift_down(arr, 0, i)
        print("  数组状态：" + str(arr))

    return arr


arr = [12, 11, 13, 5, 6, 7]
heap_sort(arr.copy())


# ============================================================================
# 7. 时间复杂度汇总
# ============================================================================

print("\n" + "=" * 60)
print("7. 时间复杂度汇总")
print("=" * 60)

print("""
| 算法       | 平均      | 最坏      | 空间    | 稳定 |
|------------|-----------|-----------|---------|------|
| 冒泡排序   | O(n^2)   | O(n^2)   | O(1)   | yes |
| 选择排序   | O(n^2)   | O(n^2)   | O(1)   | no  |
| 插入排序   | O(n^2)   | O(n^2)   | O(1)   | yes |
| 归并排序   | O(n log n)| O(n log n)| O(n)  | yes |
| 快速排序   | O(n log n)| O(n^2)   | O(log n)| no  |
| 堆排序     | O(n log n)| O(n log n)| O(1)   | no  |

稳定：相等的元素排序后相对位置不变
""")


# ============================================================================
# 8. 面试题：合并两个有序数组
# ============================================================================

print("=" * 60)
print("8. 面试题：合并两个有序数组")
print("=" * 60)


def merge_sorted_arrays(a, b):
    """合并两个有序数组"""
    print("合并：" + str(a) + " 和 " + str(b))

    result = []
    i = j = 0

    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            result.append(a[i])
            print("  取 a[%d]=%d，result=%s" % (i, a[i], str(result)))
            i += 1
        else:
            result.append(b[j])
            print("  取 b[%d]=%d，result=%s" % (j, b[j], str(result)))
            j += 1

    # 添加剩余部分
    result.extend(a[i:])
    result.extend(b[j:])

    return result


a = [1, 3, 5, 7]
b = [2, 4, 6, 8]
print("\n--- 合并演示 ---")
result = merge_sorted_arrays(a, b)
print("\n合并结果：" + str(result))


# ============================================================================
# 9. 面试题：前 K 个最大的元素
# ============================================================================

print("\n" + "=" * 60)
print("9. 面试题：前 K 个最大的元素")
print("=" * 60)


import heapq


def top_k(arr, k):
    """找前 K 大的元素（最小堆）"""
    print("数组：" + str(arr) + "，找前 " + str(k) + " 大的元素")

    # heapq.nlargest 就是这么实现的
    return heapq.nlargest(k, arr)


arr = [3, 2, 1, 5, 6, 4]
print("\n--- 前 K 大演示 ---")
result = top_k(arr, 3)
print("前 3 大的元素：" + str(result))


# ============================================================================
# 主程序入口
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("程序执行完毕！")
    print("=" * 60)
    print("\n提示：")
    print("1. O(n^2)：冒泡、选择、插入（简单但慢）")
    print("2. O(n log n)：归并、快速、堆排序（常用）")
    print("3. 稳定排序：冒泡、插入、归并")
    print("4. 原地排序：选择、插入、堆排序（空间 O(1)）")
    print("5. 快速排序最坏 O(n^2)，但平均 O(n log n)，实际很快")