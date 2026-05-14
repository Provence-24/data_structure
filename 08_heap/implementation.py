"""
implementation.py
堆的 Python 实现
对应教材：08_heap
预计学习时长：2.5小时

本文件展示：
1. 最大堆的基本操作（上浮、下沉）
2. 插入和删除
3. 堆排序
4. 优先级队列

运行方式：在终端执行 python implementation.py
"""

# ============================================================================
# 1. 最大堆实现
# ============================================================================

print("=" * 60)
print("1. 最大堆实现")
print("=" * 60)


class MaxHeap:
    def __init__(self):
        self.heap = []

    def parent(self, i):
        """父节点索引（数组从 0 开始）"""
        return (i - 1) // 2

    def left_child(self, i):
        """左子节点索引"""
        return i * 2 + 1

    def right_child(self, i):
        """右子节点索引"""
        return i * 2 + 2

    def swap(self, i, j):
        """交换两个元素"""
        self.heap[i], self.heap[j] = self.heap[j], self.heap[i]

    def sift_up(self, i):
        """上浮：将索引 i 的元素上浮到正确位置"""
        while i > 0:
            parent = self.parent(i)
            if self.heap[i] > self.heap[parent]:
                print(f"  上浮：heap[{i}]={self.heap[i]} > heap[{parent}]={self.heap[parent]}，交换")
                self.swap(i, parent)
                i = parent
            else:
                break

    def sift_down(self, i):
        """下沉：将索引 i 的元素下沉到正确位置"""
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
                print(f"  下沉：heap[{i}]={self.heap[i]} 与 heap[{largest}]={self.heap[largest]} 交换")
                self.swap(i, largest)
                i = largest
            else:
                break

    def insert(self, value):
        """插入新元素"""
        print(f"插入 {value}")
        self.heap.append(value)
        self.sift_up(len(self.heap) - 1)

    def extract_max(self):
        """删除并返回最大值（根节点）"""
        if not self.heap:
            return None

        max_val = self.heap[0]
        print(f"弹出最大值：{max_val}")

        last = self.heap.pop()
        if self.heap:
            self.heap[0] = last
            print(f"  用最后一个元素 {last} 替代堆顶")
            self.sift_down(0)

        return max_val

    def get_max(self):
        """获取最大值（不删除）"""
        return self.heap[0] if self.heap else None

    def __str__(self):
        return str(self.heap)


print("MaxHeap 类已定义")


# ============================================================================
# 2. 插入演示
# ============================================================================

print("\n" + "=" * 60)
print("2. 插入演示")
print("=" * 60)

heap = MaxHeap()
print("\n依次插入 9, 7, 6, 5, 3：")
heap.insert(9)
heap.insert(7)
heap.insert(6)
heap.insert(5)
heap.insert(3)

print(f"\n当前堆：{heap}")
print("\n堆结构（完全二叉树）：")
print("""
            9
           / \\
          7   6
         / \\
        5   3
""")


# ============================================================================
# 3. 弹出最大值演示
# ============================================================================

print("=" * 60)
print("3. 弹出最大值演示")
print("=" * 60)

print("\n弹出最大值：")
max_val = heap.extract_max()
print(f"弹出的值：{max_val}")
print(f"弹出后堆：{heap}")


# ============================================================================
# 4. 堆排序
# ============================================================================

print("\n" + "=" * 60)
print("4. 堆排序")
print("=" * 60)


def sift_down_sort(arr, i, size):
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


def heap_sort(arr):
    """堆排序"""
    n = len(arr)
    print(f"原始数组：{arr}")

    # 1. 构建最大堆（从最后一个非叶子节点开始）
    print("\n--- 构建最大堆 ---")
    for i in range(n // 2 - 1, -1, -1):
        print(f"下沉节点 {i}（值={arr[i]}）")
        sift_down_sort(arr, i, n)
        print(f"  数组状态：{arr}")

    # 2. 逐个取出堆顶，放到数组末尾
    print("\n--- 逐个取出堆顶 ---")
    for i in range(n - 1, 0, -1):
        print(f"交换堆顶 {arr[0]} 和末尾 {arr[i]}，然后对 0~{i-1} 重新堆化")
        arr[0], arr[i] = arr[i], arr[0]
        sift_down_sort(arr, 0, i)
        print(f"  数组状态：{arr}")


arr = [9, 7, 6, 5, 3, 1, 8]
heap_sort(arr)
print(f"\n排序后数组：{arr}")


# ============================================================================
# 5. 优先级队列
# ============================================================================

print("\n" + "=" * 60)
print("5. 优先级队列")
print("=" * 60)


class PriorityQueue:
    """基于最大堆的优先级队列"""
    def __init__(self):
        self.heap = MaxHeap()

    def enqueue(self, priority, value):
        """入队（优先级高的先出）"""
        # 用 (priority, value) 元组，Python 会按第一个元素比较
        self.heap.insert((priority, value))

    def dequeue(self):
        """出队（优先级最高的先出）"""
        item = self.heap.extract_max()
        return item if item is None else item[1]  # 返回 value 部分

    def peek(self):
        """查看队首元素（不删除）"""
        return self.heap.get_max()


print("\n--- 优先级队列演示 ---")
pq = PriorityQueue()
pq.enqueue(3, "普通任务")
pq.enqueue(1, "低优先级")
pq.enqueue(5, "紧急任务")
pq.enqueue(2, "中优先级")

print("\n入队顺序：普通(3), 低(1), 紧急(5), 中(2)")
print(f"队首元素（最高优先级）：{pq.peek()}")

print("\n出队顺序（按优先级）：")
while True:
    item = pq.dequeue()
    if item is None:
        break
    print(f"  取出：{item}")


# ============================================================================
# 6. 数组索引关系验证
# ============================================================================

print("\n" + "=" * 60)
print("6. 数组索引关系")
print("=" * 60)

heap2 = MaxHeap()
for i in range(1, 8):
    heap2.insert(i)

print(f"\n堆数组：{heap2.heap}")
print("\n父子关系验证：")
for i in range(len(heap2.heap)):
    parent = heap2.parent(i)
    left = heap2.left_child(i)
    right = heap2.right_child(i)
    print(f"  索引 {i}（值={heap2.heap[i]}）：", end="")
    if parent is not None:
        print(f"父={parent}(值={heap2.heap[parent]})", end=" ")
    if left < len(heap2.heap):
        print(f"左子={left}(值={heap2.heap[left]})", end=" ")
    if right < len(heap2.heap):
        print(f"右子={right}(值={heap2.heap[right]})", end=" ")
    print()


# ============================================================================
# 主程序入口
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("程序执行完毕！")
    print("=" * 60)
    print("\n提示：")
    print("1. 堆是完全二叉树，可以用数组存储")
    print("2. 父 = (子 - 1) // 2，左子 = 父*2+1，右子 = 父*2+2")
    print("3. 插入用上浮，删除/排序用下沉")
    print("4. 堆排序：先建堆，再逐个取出堆顶")
    print("5. 堆排序是原地排序，空间复杂度 O(1)")