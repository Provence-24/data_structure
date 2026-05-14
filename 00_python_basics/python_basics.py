"""
python_basics.py
Python 基础语法演示
对应教材：Python 速成（00_python_basics）
预计学习时长：20分钟

本文件展示 Python 最基础的语法：变量、循环、条件、函数、类
运行方式：在终端执行 python python_basics.py
"""

# ============================================================================
# 1. 变量和打印
# ============================================================================

print("=" * 50)
print("1. 变量和打印")
print("=" * 50)

name = "Alice"          # 字符串
age = 20                # 整数
height = 1.65           # 浮点数
is_student = True       # 布尔值（True / False）

print("名字:", name)
print("年龄:", age)
print("身高:", height, "米")
print("是学生吗:", is_student)

# 字符串可以用 + 连接
print("\n" + name + " 是一个大学生，年龄 " + str(age) + " 岁。")

# ============================================================================
# 2. 列表（类似数组）
# ============================================================================

print("\n" + "=" * 50)
print("2. 列表")
print("=" * 50)

# 创建列表
fruits = ["苹果", "香蕉", "橙子"]
nums = [3, 1, 4, 1, 5, 9, 2, 6]

print("水果列表:", fruits)
print("数字列表:", nums)

# 访问元素（下标从 0 开始）
print("\n第一个水果:", fruits[0])   # 苹果
print("最后一个水果:", fruits[-1])  # 橙子（倒数第一个）

# 修改元素
fruits[0] = "草莓"
print("修改后:", fruits)

# 添加元素
fruits.append("葡萄")          # 加到末尾
print("添加后:", fruits)

# 插入到指定位置
fruits.insert(1, "西瓜")       # 插入到位置 1
print("插入后:", fruits)

# 删除元素
removed = fruits.pop()        # 删除末尾，返回被删除的元素
print("删除末尾:", removed, "剩余:", fruits)

removed = fruits.pop(0)        # 删除位置 0 的元素
print("删除位置0:", removed, "剩余:", fruits)

# 切片（取子列表）
print("\n数字列表:", nums)
print("nums[2:5] =", nums[2:5])    # 位置 2 到 5（不含 5）
print("nums[:4] =", nums[:4])       # 从头到位置 4（不含 4）
print("nums[3:] =", nums[3:])       # 从位置 3 到末尾

# ============================================================================
# 3. for 循环
# ============================================================================

print("\n" + "=" * 50)
print("3. for 循环")
print("=" * 50)

# 遍历列表
print("遍历水果:")
for fruit in fruits:
    print("  -", fruit)

# 带索引的遍历
print("\n带索引遍历:")
for i, fruit in enumerate(fruits):
    print("  ", i, "->", fruit)

# range 生成数字序列
print("\nrange(5):", end=" ")
for i in range(5):
    print(i, end=" ")
print()

print("\nrange(2, 6):", end=" ")
for i in range(2, 6):
    print(i, end=" ")
print()

# ============================================================================
# 4. if 条件
# ============================================================================

print("\n" + "=" * 50)
print("4. if 条件")
print("=" * 50)

x = 10
y = 5

if x > y:
    print(str(x) + " > " + str(y))
elif x == y:
    print(str(x) + " == " + str(y))
else:
    print(str(x) + " < " + str(y))

# 多个条件
age = 20
if age >= 18 and age < 65:
    print("是成年人")
else:
    print("不是成年人")

# ============================================================================
# 5. 函数
# ============================================================================

print("\n" + "=" * 50)
print("5. 函数")
print("=" * 50)

# 定义函数
def greet(name):
    """
    打招呼的函数
    参数:
        name: 人名（字符串）
    返回:
        打招呼的字符串
    """
    return "你好, " + name + "!"

message = greet("小明")
print(message)

# 带默认参数的函数
def power(base, exponent=2):
    """
    计算 base 的 exponent 次方
    参数:
        base: 底数
        exponent: 指数，默认为 2
    返回:
        计算结果
    """
    return base ** exponent

print("3 的平方:", power(3))
print("3 的立方:", power(3, 3))
print("2 的 10 次方:", power(2, 10))

# ============================================================================
# 6. 类（面向对象）- 最重要！
# ============================================================================

print("\n" + "=" * 50)
print("6. 类（面向对象）")
print("=" * 50)

class Node:
    """
    链表节点类

    属性:
        value: 节点存储的值
        next: 指向下一个节点的指针（None 表示没有下一个节点）
    """

    def __init__(self, value):
        """
        构造函数，创建节点时自动调用
        参数:
            value: 要存储的值
        """
        self.value = value    # self.value 是这个对象的"value 属性"
        self.next = None      # 一开始没有下一个节点，设为 None

    def __str__(self):
        """
        打印这个对象时显示的内容
        """
        return str(self.value)

# 创建两个节点对象
node1 = Node(10)
node2 = Node(20)
node3 = Node(30)

# 连接节点：node1 -> node2 -> node3 -> None
node1.next = node2
node2.next = node3

# 现在链表是: 10 -> 20 -> 30 -> None

# 遍历链表
print("遍历链表:")
current = node1
while current is not None:
    print("  节点值:", current.value)
    current = current.next

# 解释：为什么要用 self？
# self.value 中的 self = "我自己"
# node1.value 读取的是 node1 这个对象的 value 属性
# node2.value 读取的是 node2 这个对象的 value 属性
# 两个对象的 value 属性互不影响

print("\n解释 self:")
print("  node1.value =", node1.value)
print("  node2.value =", node2.value)
print("  两者互不影响！")

# ============================================================================
# 7. 字典
# ============================================================================

print("\n" + "=" * 50)
print("7. 字典（键值对）")
print("=" * 50)

# 创建字典
student = {
    "name": "Alice",
    "age": 20,
    "major": "计算机科学"
}

print("学生信息:", student)

# 访问
print("姓名:", student["name"])
print("年龄:", student.get("age"))

# 修改
student["age"] = 21
print("修改后:", student)

# 添加
student["grade"] = "A"
print("添加后:", student)

# 遍历
print("\n遍历字典:")
for key in student:
    print("  ", key, ":", student[key])

# ============================================================================
# 8. 综合示例：手写一个简单的栈
# ============================================================================

print("\n" + "=" * 50)
print("8. 综合示例：手写栈")
print("=" * 50)

class Stack:
    """
    栈（Stack）类 - 后进先出（LIFO）

    本章重点：理解类怎么封装数据和方法
    栈的详细原理见 03_stack 章节
    """

    def __init__(self):
        """用列表存储栈元素"""
        self.items = []

    def push(self, item):
        """入栈：把元素放到栈顶"""
        self.items.append(item)
        print("入栈:", item, "| 栈内容:", self.items)

    def pop(self):
        """出栈：移除并返回栈顶元素"""
        if self.is_empty():
            print("栈空，无法出栈！")
            return None
        item = self.items.pop()
        print("出栈:", item, "| 栈内容:", self.items)
        return item

    def is_empty(self):
        """判断栈是否为空"""
        return len(self.items) == 0

    def size(self):
        """返回栈的大小"""
        return len(self.items)

    def peek(self):
        """查看栈顶元素（不删除）"""
        if self.is_empty():
            return None
        return self.items[-1]

# 使用栈
print("创建一个空栈")
stack = Stack()

print("\n依次入栈: 10, 20, 30")
stack.push(10)
stack.push(20)
stack.push(30)

print("\n出栈一次:")
stack.pop()

print("\n再出栈一次:")
stack.pop()

print("\n当前栈大小:", stack.size())
print("栈顶元素:", stack.peek())

# ============================================================================
# 主程序入口
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("程序执行完毕！")
    print("=" * 50)
    print("\n提示：试着修改上面的代码，看看输出有什么变化")
    print("比如：改变 node1, node2, node3 的连接方式")
    print("或者：修改 Stack 的入栈顺序")
