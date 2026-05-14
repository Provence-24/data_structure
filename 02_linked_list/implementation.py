"""
implementation.py
链表的 Python 实现
对应教材：02_linked_list
预计学习时长：1.5小时

本文件展示单向链表的完整实现，包括：
- 基本操作：插入（头部/尾部/中间）、删除、查找、遍历
- 高级操作：反转链表

运行方式：在终端执行 python implementation.py
"""

# ============================================================================
# 0. 节点类和链表类定义
# ============================================================================

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
        在尾部插入: O(1)（有尾指针时）
        在中间插入: O(n)（需要先找到位置）
        删除: O(n)（需要先找到位置）
        反转: O(n)
    """

    def __init__(self):
        """初始化空链表"""
        self.head = None  # 头节点
        self.tail = None  # 尾节点（方便尾部操作）
        self.size = 0     # 节点个数

    def __str__(self):
        """打印链表内容"""
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

    # =========================================================================
    # 查找操作
    # =========================================================================

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

    # =========================================================================
    # 插入操作
    # =========================================================================

    def prepend(self, value):
        """
        在头部插入节点
        时间复杂度: O(1)

        步骤:
        1. 创建新节点
        2. 新节点的 next 指向原来的头节点
        3. 更新 head 为新节点
        4. 如果是空链表，也要更新 tail
        """
        new_node = Node(value)
        print(f"\n--- 在头部插入 {value} ---")
        print(f"步骤1: 创建新节点 Node({value})")

        if self.is_empty():
            print("链表为空，新节点既是头节点又是尾节点")
            self.head = new_node
            self.tail = new_node
        else:
            print(f"步骤2: new_node.next = head (指向 {self.head.value})")
            new_node.next = self.head
            print(f"步骤3: head = new_node")
            self.head = new_node

        self.size += 1
        print(f"结果: {self}")

    def append(self, value):
        """
        在尾部添加节点
        时间复杂度: O(1)（有尾指针时）

        步骤:
        1. 创建新节点
        2. 尾节点的 next 指向新节点
        3. 更新 tail 为新节点
        4. 如果是空链表，也要更新 head
        """
        new_node = Node(value)
        print(f"\n--- 在尾部插入 {value} ---")
        print(f"步骤1: 创建新节点 Node({value})")

        if self.is_empty():
            print("链表为空，新节点既是头节点又是尾节点")
            self.head = new_node
            self.tail = new_node
        else:
            print(f"步骤2: tail.next = new_node (当前尾节点是 {self.tail.value})")
            self.tail.next = new_node
            print(f"步骤3: tail = new_node")
            self.tail = new_node

        self.size += 1
        print(f"结果: {self}")

    def insert_after(self, index, value):
        """
        在指定位置之后插入节点
        参数:
            index: 插入位置（在其后插入）
            value: 要插入的值
        时间复杂度: O(n)（需要先找到该位置）

        步骤（口诀：先接后断）:
        1. 找到指定位置的节点
        2. 创建新节点
        3. 新节点的 next 指向该节点的后继（先接）
        4. 该节点的 next 指向新节点（后断）
        5. 如果插入位置是尾部，要更新 tail
        """
        # 先找到该位置的节点
        node = self.get_node(index)
        new_node = Node(value)

        print(f"\n--- 在位置 {index}（值为 {node.value}）之后插入 {value} ---")
        print(f"步骤1: 找到位置 {index} 的节点 Node({node.value})")

        # 关键：先接后断！
        print(f"步骤2: new_node.next = node.next (指向 {node.next.value if node.next else None})")
        new_node.next = node.next

        print(f"步骤3: node.next = new_node")
        node.next = new_node

        # 如果插入位置是尾部，需要更新 tail
        if node == self.tail:
            print(f"插入位置是尾部，更新 tail = new_node")
            self.tail = new_node

        self.size += 1
        print(f"结果: {self}")

    def insert_at(self, index, value):
        """
        在指定位置插入节点
        参数:
            index: 插入位置（0 表示头部，size 表示尾部）
            value: 要插入的值
        时间复杂度: O(n)
        """
        if index < 0 or index > self.size:
            raise IndexError(f"索引 {index} 超出范围 (size={self.size})")

        if index == 0:
            self.prepend(value)
        elif index == self.size:
            self.append(value)
        else:
            self.insert_after(index - 1, value)

    # =========================================================================
    # 删除操作
    # =========================================================================

    def delete(self, index):
        """
        删除指定位置的节点
        参数:
            index: 要删除的索引
        返回:
            被删除节点的值
        时间复杂度: O(n)

        步骤:
        1. 如果删除的是头节点，直接移动 head
        2. 否则找到前一个节点
        3. 让前一个节点的 next 跳过要删除的节点
        4. 如果删除的是尾节点，要更新 tail
        """
        if index < 0 or index >= self.size:
            raise IndexError(f"索引 {index} 超出范围 (size={self.size})")

        print(f"\n--- 删除位置 {index} 的节点 ---")

        if index == 0:
            # 删除头节点
            node_to_delete = self.head
            deleted_value = node_to_delete.value
            print(f"步骤1: 要删除的是头节点，value={deleted_value}")
            print(f"步骤2: head = head.next (跳过头节点)")
            self.head = self.head.next

            if self.size == 1:
                # 链表只有一个节点
                self.tail = None
                print("链表现在为空，更新 tail = None")
        else:
            # 删除中间或尾部节点
            prev_node = self.get_node(index - 1)
            node_to_delete = prev_node.next
            deleted_value = node_to_delete.value

            print(f"步骤1: 找到位置 {index-1} 的前一个节点 Node({prev_node.value})")
            print(f"步骤2: 要删除的节点 value={deleted_value}")
            print(f"步骤3: prev_node.next = node_to_delete.next (跳过要删除的节点)")

            prev_node.next = node_to_delete.next

            # 如果删除的是尾节点，要更新 tail
            if node_to_delete == self.tail:
                print(f"删除的是尾节点，更新 tail = prev_node ({prev_node.value})")
                self.tail = prev_node

        self.size -= 1
        print(f"结果: {self}")
        return deleted_value

    # =========================================================================
    # 反转链表
    # =========================================================================

    def reverse(self):
        """
        反转链表
        时间复杂度: O(n)
        空间复杂度: O(1)

        使用三个指针：prev、curr、next
        关键思想：遍历过程中反转每个节点的指针方向

        步骤:
        prev = None
        curr = head

        while curr is not None:
            next_node = curr.next  # 先保存下一个节点
            curr.next = prev       # 反转当前节点的指针
            prev = curr            # prev 前进
            curr = next_node       # curr 前进

        最后: head = prev
        """
        print("\n--- 反转链表 ---")

        if self.size <= 1:
            print("链表为空或只有一个节点，无需反转")
            return

        print("初始状态:")
        print(f"  prev = None")
        print(f"  curr = head = {self.head.value}")

        prev = None
        curr = self.head
        self.tail = self.head  # 新的尾节点是原来的头节点

        step = 1
        while curr is not None:
            print(f"\n步骤{step}:")
            print(f"  处理节点: {curr.value}")

            # 1. 先保存下一个节点（因为马上就要断开它）
            next_node = curr.next
            print(f"  1. next_node = curr.next = {next_node.value if next_node else None}")

            # 2. 反转指针（关键步骤！）
            print(f"  2. curr.next = prev = {prev.value if prev else None}")
            curr.next = prev

            # 3. prev 前进
            print(f"  3. prev = curr = {curr.value}")
            prev = curr

            # 4. curr 前进
            print(f"  4. curr = next_node = {next_node.value if next_node else None}")
            curr = next_node

            step += 1

        # 最后更新 head
        print(f"\n反转完成，更新 head = prev = {prev.value}")
        self.head = prev
        print(f"结果: {self}")


# ============================================================================
# 演示函数
# ============================================================================

def print_separator(title):
    print("\n" + "=" * 60)
    print(title)
    print("=" * 60)


# ============================================================================
# 主程序
# ============================================================================

if __name__ == "__main__":
    print_separator("链表操作演示")

    # -------------------------------------------------------------------------
    # 1. 头部插入
    # -------------------------------------------------------------------------
    print_separator("1. 头部插入演示")
    ll = LinkedList()
    ll.prepend(10)
    ll.prepend(5)
    ll.prepend(1)
    print(f"\n链表最终状态: {ll}")

    # -------------------------------------------------------------------------
    # 2. 尾部插入
    # -------------------------------------------------------------------------
    print_separator("2. 尾部插入演示")
    ll2 = LinkedList()
    ll2.append(10)
    ll2.append(20)
    ll2.append(30)
    print(f"\n链表最终状态: {ll2}")

    # -------------------------------------------------------------------------
    # 3. 中间插入（先接后断）
    # -------------------------------------------------------------------------
    print_separator("3. 中间插入演示（在位置 1 之后插入 15）")
    ll3 = LinkedList()
    ll3.append(10)
    ll3.append(20)
    ll3.append(30)
    print(f"\n插入前: {ll3}")
    ll3.insert_after(1, 15)  # 在位置 1（20）之后插入
    print(f"\n链表最终状态: {ll3}")

    # -------------------------------------------------------------------------
    # 4. 删除节点
    # -------------------------------------------------------------------------
    print_separator("4. 删除节点演示（删除位置 1）")
    ll4 = LinkedList()
    ll4.append(10)
    ll4.append(20)
    ll4.append(30)
    print(f"\n删除前: {ll4}")
    deleted = ll4.delete(1)
    print(f"被删除的值: {deleted}")
    print(f"链表最终状态: {ll4}")

    # -------------------------------------------------------------------------
    # 5. 删除头节点
    # -------------------------------------------------------------------------
    print_separator("5. 删除头节点演示")
    ll5 = LinkedList()
    ll5.append(10)
    ll5.append(20)
    ll5.append(30)
    print(f"\n删除前: {ll5}")
    deleted = ll5.delete(0)
    print(f"被删除的值: {deleted}")
    print(f"链表最终状态: {ll5}")

    # -------------------------------------------------------------------------
    # 6. 删除尾节点
    # -------------------------------------------------------------------------
    print_separator("6. 删除尾节点演示")
    ll6 = LinkedList()
    ll6.append(10)
    ll6.append(20)
    ll6.append(30)
    print(f"\n删除前: {ll6}")
    deleted = ll6.delete(2)
    print(f"被删除的值: {deleted}")
    print(f"链表最终状态: {ll6}")
    print(f"tail 现在是: {ll6.tail.value if ll6.tail else None}")

    # -------------------------------------------------------------------------
    # 7. 反转链表
    # -------------------------------------------------------------------------
    print_separator("7. 反转链表演示")
    ll7 = LinkedList()
    ll7.append(1)
    ll7.append(2)
    ll7.append(3)
    ll7.append(4)
    ll7.append(5)
    print(f"\n反转前: {ll7}")
    ll7.reverse()
    print(f"\n反转后: {ll7}")

    # -------------------------------------------------------------------------
    # 8. 完整操作流程
    # -------------------------------------------------------------------------
    print_separator("8. 完整操作流程")
    ll8 = LinkedList()
    print("创建空链表")

    print("\n依次在尾部插入 10, 20, 30:")
    ll8.append(10)
    ll8.append(20)
    ll8.append(30)

    print("\n在头部插入 5:")
    ll8.prepend(5)

    print("\n在位置 1 之后插入 15:")
    ll8.insert_after(1, 15)

    print("\n删除位置 2:")
    ll8.delete(2)

    print("\n查找 20 的位置:")
    idx = ll8.find(20)
    print(f"20 的索引: {idx}")

    print("\n访问位置 2:")
    val = ll8.get(2)
    print(f"位置 2 的值: {val}")

    print("\n最终链表:")
    print(ll8)

    print("\n" + "=" * 60)
    print("程序执行完毕！")
    print("=" * 60)
    print("\n提示：")
    print("1. 仔细观察每次操作后指针的变化")
    print("2. 特别注意「先接后断」的插入顺序")
    print("3. 反转链表的三指针技巧是面试常考题")
    print("4. 打开 visualization.html 观看交互演示")
