"""
implementation.py
队列的 Python 实现
对应教材：04_queue
预计学习时长：1小时

本文件展示：
1. 普通队列的实现（用列表）
2. 循环队列的实现（用数组 + 取模运算）
3. 队列的应用：约瑟夫问题

运行方式：在终端执行 python implementation.py
"""

# ============================================================================
# 1. 普通队列（用列表实现，有假溢出问题）
# ============================================================================

print("=" * 60)
print("1. 普通队列（用列表实现）")
print("=" * 60)

class SimpleQueue:
    """
    普通队列类 - 用列表实现

    问题：会出现"假溢出"
    当 rear 到达数组末尾时，即使前面有空位也无法入队
    """

    def __init__(self, capacity=5):
        self.capacity = capacity
        self.array = [None] * capacity
        self.front = 0   # 队头索引
        self.rear = 0    # 队尾索引（下一个入队位置）
        self.size = 0    # 当前元素个数

    def __str__(self):
        """打印队列内容"""
        items = []
        for i in range(self.size):
            idx = (self.front + i) % self.capacity
            items.append(str(self.array[idx]))
        return "Queue: [" + ", ".join(items) + "] (size=" + str(self.size) + ")"

    def is_empty(self):
        return self.size == 0

    def is_full(self):
        return self.size == self.capacity

    def enqueue(self, item):
        """入队"""
        if self.is_full():
            print(f"enqueue({item}): 队列已满！无法入队！")
            return False
        self.array[self.rear] = item
        self.rear += 1
        self.size += 1
        print(f"enqueue({item}): {self}")
        return True

    def dequeue(self):
        """出队"""
        if self.is_empty():
            print("dequeue(): 队列为空！无法出队！")
            return None
        item = self.array[self.front]
        self.array[self.front] = None
        self.front += 1
        self.size -= 1
        print(f"dequeue(): 取出 {item}, {self}")
        return item

    def front_item(self):
        """查看队头元素"""
        if self.is_empty():
            return None
        return self.array[self.front]

    def rear_item(self):
        """查看队尾元素"""
        if self.is_empty():
            return None
        return self.array[(self.rear - 1) % self.capacity]


# 演示普通队列的问题
print("\n--- 普通队列演示 ---")
q = SimpleQueue(capacity=5)
q.enqueue(10)
q.enqueue(20)
q.enqueue(30)
print(f"队头元素: {q.front_item()}")
print(f"队尾元素: {q.rear_item()}")

print("\n--- 出队两次 ---")
q.dequeue()
q.dequeue()

print("\n--- 再入队两次 ---")
q.enqueue(40)
q.enqueue(50)

print("\n--- 再入队一次（会怎样？）---")
q.enqueue(60)  # 这会失败！因为 rear 已经到达边界


# ============================================================================
# 2. 循环队列（用数组 + 取模运算，无假溢出）
# ============================================================================

print("\n" + "=" * 60)
print("2. 循环队列（用取模运算）")
print("=" * 60)

class CircularQueue:
    """
    循环队列类 - 用数组实现，通过取模运算实现循环

    核心思想：
    - 把数组当成环，rear 和 front 都可能绕回数组开头
    - 牺牲一个位置来区分队满和队空

    判断条件：
    - 队空：front == rear
    - 队满：(rear + 1) % capacity == front
    """

    def __init__(self, capacity=5):
        self.capacity = capacity
        self.array = [None] * capacity
        self.front = 0  # 队头索引
        self.rear = 0   # 队尾索引（下一个入队位置）

    def __str__(self):
        """打印队列内容"""
        items = []
        i = self.front
        while i != self.rear:
            items.append(str(self.array[i]))
            i = (i + 1) % self.capacity
        return "CircularQueue: [" + ", ".join(items) + "] (front=" + str(self.front) + ", rear=" + str(self.rear) + ")"

    def is_empty(self):
        return self.front == self.rear

    def is_full(self):
        return (self.rear + 1) % self.capacity == self.front

    def enqueue(self, item):
        """入队"""
        if self.is_full():
            print(f"enqueue({item}): 队列已满！无法入队！")
            return False
        print(f"enqueue({item}): 放入位置 {self.rear}")
        self.array[self.rear] = item
        self.rear = (self.rear + 1) % self.capacity
        print(f"  rear 移动: {self.rear - 1} -> {self.rear}, {self}")
        return True

    def dequeue(self):
        """出队"""
        if self.is_empty():
            print("dequeue(): 队列为空！无法出队！")
            return None
        item = self.array[self.front]
        print(f"dequeue(): 取出位置 {self.front} 的元素 {item}")
        self.array[self.front] = None
        self.front = (self.front + 1) % self.capacity
        print(f"  front 移动: {self.front - 1} -> {self.front}, {self}")
        return item

    def front_item(self):
        """查看队头元素"""
        if self.is_empty():
            return None
        return self.array[self.front]

    def rear_item(self):
        """查看队尾元素"""
        if self.is_empty():
            return None
        return self.array[(self.rear - 1) % self.capacity]


# 演示循环队列
print("\n--- 循环队列演示 ---")
cq = CircularQueue(capacity=5)

print("\n入队 10, 20, 30:")
cq.enqueue(10)
cq.enqueue(20)
cq.enqueue(30)

print("\n查看队头和队尾:")
print(f"  队头: {cq.front_item()}")
print(f"  队尾: {cq.rear_item()}")

print("\n出队一次:")
cq.dequeue()

print("\n入队 40, 50:")
cq.enqueue(40)
cq.enqueue(50)

print("\n再入队一次（会成功吗？）:")
result = cq.enqueue(60)
if result:
    print("  入队成功！循环队列解决了假溢出问题！")
else:
    print("  入队失败！")

print("\n出队两次:")
cq.dequeue()
cq.dequeue()

print("\n再入队一次:")
cq.enqueue(70)


# ============================================================================
# 3. 循环队列图解
# ============================================================================

print("\n" + "=" * 60)
print("3. 循环队列状态图解")
print("=" * 60)

def print_queue_state(cq, operation):
    """打印队列状态的详细信息"""
    print(f"\n{operation}:")
    print(f"  front={cq.front}, rear={cq.rear}")

    # 打印数组
    print("  数组状态: ", end="")
    for i in range(cq.capacity):
        val = cq.array[i] if cq.array[i] is not None else "_"
        marker = ""
        if i == cq.front:
            marker += " [F]"
        if i == (cq.rear - 1 + cq.capacity) % cq.capacity and cq.rear != cq.front:
            marker += " [R]"
        if i == cq.rear and (cq.rear + 1) % cq.capacity == cq.front:
            marker += " [R=full]"
        print(f"{val}{marker}", end="  ")
    print()

    # 图示
    print("  逻辑环状: ", end="")
    positions = []
    for i in range(cq.capacity):
        val = str(cq.array[i]) if cq.array[i] is not None else "_"
        positions.append(f"{i}:{val}")
    print(" -> ".join(positions))


print("\n--- 循环队列完整生命周期 ---")
cq2 = CircularQueue(capacity=5)

print_queue_state(cq2, "初始状态（队空）")

cq2.enqueue(10)
print_queue_state(cq2, "enqueue(10)")

cq2.enqueue(20)
print_queue_state(cq2, "enqueue(20)")

cq2.enqueue(30)
print_queue_state(cq2, "enqueue(30)")

cq2.dequeue()
print_queue_state(cq2, "dequeue()（取出10）")

cq2.enqueue(40)
print_queue_state(cq2, "enqueue(40)")

cq2.enqueue(50)
print_queue_state(cq2, "enqueue(50)")

print("\n此时队满！front=1, rear=0, (0+1)%5==1")
print("注意：rear 绕回了 0，但 front 也在 1，队满的判断条件成立")

cq2.dequeue()
print_queue_state(cq2, "dequeue()（取出20）")

cq2.enqueue(60)
print_queue_state(cq2, "enqueue(60)")

print("\n循环队列通过取模运算实现了'环'的效果，永远不会假溢出！")


# ============================================================================
# 4. 约瑟夫问题（队列应用）
# ============================================================================

print("\n" + "=" * 60)
print("4. 约瑟夫问题（队列应用）")
print("=" * 60)

def josephus(n, k):
    """
    约瑟夫问题

    问题描述：
    n 个人围成一圈，从第 1 个人开始报数，报到 k 的人出圈，
    剩下的人继续从 1 开始报数，直到只剩一个人。

    解法：用队列模拟

    时间复杂度: O(n*k)
    """
    from collections import deque
    queue = deque(range(1, n + 1))

    print(f"\n约瑟夫问题: n={n} 个人，报数到 k={k} 的人出圈")
    print(f"初始队列: {list(queue)}")

    step = 1
    while len(queue) > 1:
        # 报数
        for _ in range(k - 1):
            person = queue.popleft()
            queue.append(person)
            print(f"  报数 {step}: {person} -> 队列末尾")
            step += 1

        # 出圈
        out = queue.popleft()
        print(f"  >> 报数 {step}: {out} 出圈！剩余: {list(queue)}")
        step = 1

    print(f"\n最后幸存者: {queue[0]}")
    return queue[0]


josephus(8, 3)


# ============================================================================
# 主程序入口
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("程序执行完毕！")
    print("=" * 60)
    print("\n提示：")
    print("1. 普通队列有假溢出问题，实际使用要用循环队列")
    print("2. 循环队列的 front 和 rear 移动时都要取模")
    print("3. 约瑟夫问题是队列的经典应用")
    print("4. 打开 visualization.html 观看循环队列交互演示")
