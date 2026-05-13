"""
implementation.py
数组与链表的 Python 实现
对应教材：01_array_and_list
预计学习时长：1小时

本文件包含：
1. 顺序表（基于数组）- ArrayList 类
2. 单向链表 - LinkedList 类

运行方式：在终端执行 python implementation.py
"""

# ============================================================================
# 0. 辅助函数
# ============================================================================

def print_separator(title):
    print("\n" + "=" * 50)
    print(title)
    print("=" * 50)


# ============================================================================
# 1. 顺序表（ArrayList）- 用数组实现的线性表
# ============================================================================

print_separator("1. 顺序表（ArrayList）")

class ArrayList:
    """
    顺序表类 - 用固定大小的数组实现线性表

    属性:
        capacity: 数组容量（最大能存多少元素）
        size: 当前元素个数
        data: 存储元素的数组

    时间复杂度:
        按索引访问: O(1)
        在尾部插入: O(1)（数组有空位时）
        在中间插入: O(n)
        查找: O(n)
    """

    def __init__(self, capacity=10):
        """
        构造函数
        参数:
            capacity: 初始容量，默认为 10
        """
        self.capacity = capacity
        self.size = 0
        self.data = [None] * capacity  # 预分配固定大小的数组

    def __str__(self):
        """
        打印顺序表内容
        """
        elements = [str(self.data[i]) for i in range(self.size)]
        result = "ArrayList: [" + ", ".join(elements) + "]"
        result += f" (size={self.size}, capacity={self.capacity})"
        return result

    def is_empty(self):
        """判断是否为空"""
        return self.size == 0

    def is_full(self):
        """判断是否已满"""
        return self.size == self.capacity

    def get(self, index):
        """
        获取指定位置的元素
        参数:
            index: 索引（从 0 开始）
        返回:
            该位置的元素
        """
        if index < 0 or index >= self.size:
            raise IndexError(f"索引 {index} 超出范围 (size={self.size})")
        return self.data[index]

    def set(self, index, value):
        """
        修改指定位置的元素
        参数:
            index: 索引
            value: 新值
        """
        if index < 0 or index >= self.size:
            raise IndexError(f"索引 {index} 超出范围 (size={self.size})")
        self.data[index] = value

    def insert(self, index, value):
        """
        在指定位置插入元素
        参数:
            index: 插入位置（0 表示头部，size 表示尾部）
            value: 要插入的值
        时间复杂度: O(n)
        """
        if index < 0 or index > self.size:
            raise IndexError(f"索引 {index} 超出范围 (size={self.size})")
        if self.is_full():
            raise OverflowError("顺序表已满，无法插入")

        # 从后往前移动元素，空出插入位置
        for i in range(self.size, index, -1):
            self.data[i] = self.data[i - 1]
            print(f"  移动元素: data[{i}] = data[{i-1}]")

        self.data[index] = value
        self.size += 1

    def append(self, value):
        """
        在尾部添加元素
        时间复杂度: O(1)（数组有空位时）
        """
        if self.is_full():
            raise OverflowError("顺序表已满，无法添加")
        self.data[self.size] = value
        self.size += 1

    def delete(self, index):
        """
        删除指定位置的元素
        参数:
            index: 要删除的索引
        返回:
            被删除的元素
        时间复杂度: O(n)
        """
        if index < 0 or index >= self.size:
            raise IndexError(f"索引 {index} 超出范围 (size={self.size})")

        deleted_value = self.data[index]

        # 从前往后移动元素，填补删除位置
        for i in range(index, self.size - 1):
            self.data[i] = self.data[i + 1]
            print(f"  移动元素: data[{i}] = data[{i+1}]")

        self.data[self.size - 1] = None  # 清除尾部引用
        self.size -= 1

        return deleted_value

    def find(self, value):
        """
        查找元素，返回第一个匹配的索引
        参数:
            value: 要查找的值
        返回:
            索引，如果没找到返回 -1
        时间复杂度: O(n)
        """
        for i in range(self.size):
            if self.data[i] == value:
                return i
        return -1


# 演示 ArrayList 基本操作
print("\n--- 创建顺序表 ---")
arr_list = ArrayList(capacity=5)
print(arr_list)

print("\n--- 尾部插入 10, 20, 30 ---")
arr_list.append(10)
arr_list.append(20)
arr_list.append(30)
print(arr_list)

print("\n--- 在位置 1 插入 15 ---")
arr_list.insert(1, 15)
print(arr_list)

print("\n--- 访问位置 2 ---")
print(f"arr_list.get(2) = {arr_list.get(2)}")
print(arr_list)

print("\n--- 删除位置 1 ---")
deleted = arr_list.delete(1)
print(f"删除了 {deleted}")
print(arr_list)


# ============================================================================
# 2. 单向链表（LinkedList）
# ============================================================================

print_separator("2. 单向链表（LinkedList）")


class Node:
    """
    链表节点类

    属性:
        value: 节点存储的值
        next: 指向下一个节点的指针（None 表示没有下一个节点）
    """

    def __init__(self, value):
        self.value = value
        self.next = None

    def __str__(self):
        return str(self.value)


class LinkedList:
    """
    单向链表类

    特点:
        - 节点分散在内存中，靠 next 指针连接
        - 不支持随机访问，必须从头遍历
        - 插入/删除效率高（已知位置时）

    时间复杂度:
        按索引访问: O(n)
        在头部插入: O(1)
        在尾部插入: O(n)（需要遍历到尾部）
        插入/删除（已知节点）: O(1)
    """

    def __init__(self):
        """
        构造函数
        初始化时链表为空（head = None）
        """
        self.head = None  # 头节点
        self.tail = None  # 尾节点（方便尾部操作）
        self.size = 0     # 节点个数

    def __str__(self):
        """
        打印链表内容
        """
        if self.is_empty():
            return "LinkedList: [] (empty)"

        elements = []
        current = self.head
        while current is not None:
            elements.append(str(current.value))
            current = current.next

        return "LinkedList: [" + " -> ".join(elements) + "] (size=" + str(self.size) + ")"

    def is_empty(self):
        """判断链表是否为空"""
        return self.size == 0

    def get_size(self):
        """返回链表节点个数"""
        return self.size

    def get_node(self, index):
        """
        获取指定位置的节点（内部方法）
        参数:
            index: 索引（从 0 开始）
        返回:
            该位置的节点
        """
        if index < 0 or index >= self.size:
            raise IndexError(f"索引 {index} 超出范围 (size={self.size})")

        current = self.head
        for _ in range(index):
            current = current.next
        return current

    def get(self, index):
        """
        获取指定位置的值
        参数:
            index: 索引
        返回:
            该位置的值
        """
        return self.get_node(index).value

    def append(self, value):
        """
        在尾部添加节点
        时间复杂度: O(1)（有尾指针时）
        """
        new_node = Node(value)
        print(f"  创建新节点: Node({value})")

        if self.is_empty():
            # 空链表：新节点既是头又是尾
            self.head = new_node
            self.tail = new_node
            print(f"  链表为空，新节点成为头尾节点")
        else:
            # 非空链表：尾节点指向新节点
            print(f"  tail.next = 新节点")
            self.tail.next = new_node
            self.tail = new_node
            print(f"  更新 tail 为新节点")

        self.size += 1

    def prepend(self, value):
        """
        在头部插入节点
        时间复杂度: O(1)
        """
        new_node = Node(value)
        print(f"  创建新节点: Node({value})")

        if self.is_empty():
            self.head = new_node
            self.tail = new_node
            print(f"  链表为空，新节点成为头尾节点")
        else:
            print(f"  新节点.next = 原头节点")
            new_node.next = self.head
            print(f"  head = 新节点")
            self.head = new_node

        self.size += 1

    def insert_after(self, index, value):
        """
        在指定位置之后插入节点
        参数:
            index: 插入位置（在其后插入）
            value: 要插入的值
        时间复杂度: O(n)（需要找到该位置）
        """
        node = self.get_node(index)
        new_node = Node(value)

        print(f"  在位置 {index} (value={node.value}) 之后插入 {value}")
        print(f"  新节点.next = node.next")
        new_node.next = node.next
        print(f"  node.next = 新节点")

        node.next = new_node

        # 如果是在尾部之后插入，需要更新 tail
        if node == self.tail:
            self.tail = new_node
            print(f"  更新 tail 为新节点")

        self.size += 1

    def delete(self, index):
        """
        删除指定位置的节点
        参数:
            index: 要删除的索引
        返回:
            被删除节点的值
        时间复杂度: O(n)
        """
        if index < 0 or index >= self.size:
            raise IndexError(f"索引 {index} 超出范围 (size={self.size})")

        if index == 0:
            # 删除头节点
            deleted_value = self.head.value
            print(f"  删除头节点，value={deleted_value}")
            print(f"  head = head.next")
            self.head = self.head.next

            if self.size == 1:
                # 链表只有一个节点
                self.tail = None

        else:
            # 删除中间或尾部节点
            prev_node = self.get_node(index - 1)
            node_to_delete = prev_node.next
            deleted_value = node_to_delete.value

            print(f"  prev_node = {prev_node.value}")
            print(f"  要删除的节点 value={deleted_value}")
            print(f"  prev_node.next = node.next")
            prev_node.next = node_to_delete.next

            # 如果删除的是尾节点，需要更新 tail
            if node_to_delete == self.tail:
                self.tail = prev_node
                print(f"  更新 tail 为 prev_node")

        self.size -= 1
        return deleted_value

    def find(self, value):
        """
        查找值为 value 的第一个节点
        返回:
            索引，如果没找到返回 -1
        时间复杂度: O(n)
        """
        current = self.head
        index = 0
        while current is not None:
            if current.value == value:
                return index
            current = current.next
            index += 1
        return -1

    def reverse(self):
        """
        反转链表
        时间复杂度: O(n)
        """
        print("\n  --- 开始反转链表 ---")
        if self.size <= 1:
            print("  链表为空或只有一个节点，无需反转")
            return

        prev = None
        current = self.head
        self.tail = self.head  # 新的尾节点是原来的头节点

        while current is not None:
            print(f"  处理节点: {current.value}")
            print(f"    next_node = current.next")
            next_node = current.next

            print(f"    current.next = prev (={prev.value if prev else None})")
            current.next = prev

            print(f"    prev = current")
            prev = current

            print(f"    current = next_node")
            current = next_node

            if current:
                print(f"    下一个要处理的节点: {current.value}")
            print()

        print(f"  更新 head = prev (={prev.value if prev else None})")
        self.head = prev


# ============================================================================
# 演示链表基本操作
# ============================================================================

print("\n\n========== 链表演示 ==========")

print("\n--- 创建空链表 ---")
ll = LinkedList()
print(ll)

print("\n--- 头部插入 10 ---")
ll.prepend(10)
print(ll)

print("\n--- 尾部插入 20 ---")
ll.append(20)
print(ll)

print("\n--- 头部插入 5 ---")
ll.prepend(5)
print(ll)

print("\n--- 尾部插入 30 ---")
ll.append(30)
print(ll)

print("\n--- 在位置 1 之后插入 15 ---")
ll.insert_after(1, 15)
print(ll)

print("\n--- 查找 20 ---")
idx = ll.find(20)
print(f"20 的索引: {idx}")

print("\n--- 访问位置 2 ---")
val = ll.get(2)
print(f"位置 2 的值: {val}")

print("\n--- 删除位置 0（头节点）---")
deleted = ll.delete(0)
print(f"删除了: {deleted}")
print(ll)

print("\n--- 反转链表 ---")
ll.reverse()
print(ll)


# ============================================================================
# 3. 数组 vs 链表 对比演示
# ============================================================================

print_separator("3. 数组 vs 链表 性能对比")

print("""
假设我们要存储 10000 个整数：

【数组】
- 内存需求：10000 × 4字节 = 40KB（连续内存）
- 访问第 5000 个元素：直接计算地址，O(1)
- 在第 5000 个位置插入：需要移动后面 5000 个元素，O(n)

【链表】
- 内存需求：10000 × (4字节值 + 8字节指针) = 120KB（分散内存）
- 访问第 5000 个元素：必须从头数到第 5000 个，O(n)
- 在第 5000 个位置插入：已知位置后，修改 2 个指针，O(1)

总结：
- 随机访问多 → 用数组
- 插入删除多 → 用链表
""")


# ============================================================================
# 主程序入口
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("程序执行完毕！")
    print("=" * 50)
    print("\n提示：")
    print("1. 仔细观察每次操作后 __str__ 打印的内容")
    print("2. 试着修改代码，改变插入/删除的顺序")
    print("3. 打开 visualization.html 观看交互演示")
