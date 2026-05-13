# Python 基础速成

> 本章目标：让零 Python 基础的同学能看懂后续章节的 Python 代码

## 这是什么？

一个**极简 Python 速成教程**，专门为"能看懂语法但写起来不熟练"的同学准备。
后续章节的 `implementation.py` 都是标准 Python 代码，你需要能读懂它们。

**只讲看懂代码所需的最小知识**，不追求全面。

---

## 学习方法

1. 先通读本文件，理解概念
2. 打开 `python_basics.py`，运行它，看打印输出
3. 试着修改代码中的某些值，观察输出变化

---

## 目录

| 文件 | 内容 |
|------|------|
| `python_basics.py` | 基础语法演示（变量、循环、条件、函数、类） |
| `data_structures.py` | 列表、字典、集合的常用操作 |
| `algorithms.py` | 递归、排序等算法相关的 Python 写法 |

---

## 核心概念（按重要性排序）

### 1. 变量和打印

```python
# 变量不需要声明类型
name = "Alice"
age = 20
is_student = True

# 打印用 print()
print("Hello")
print("名字:", name, "年龄:", age)
```

**你会看到**：运行后终端会显示文字，这是 Python 最常用的调试手段。

---

### 2. 列表（类似数组）

```python
# 创建列表
nums = [1, 2, 3, 4, 5]

# 访问元素（下标从 0 开始）
first = nums[0]    # 1
last = nums[-1]    # 5（倒数第一个）

# 修改元素
nums[0] = 10

# 添加元素
nums.append(6)     # 加到末尾
nums.insert(0, 0)  # 插入到位置 0

# 删除元素
nums.pop()         # 删除末尾
nums.pop(0)        # 删除位置 0 的元素
del nums[0]        # 同上，另一种写法

# 切片（取子列表）
sub = nums[1:3]    # 位置 1 到 3（不含 3）
sub = nums[:3]     # 从头到位置 3（不含 3）
sub = nums[2:]      # 从位置 2 到末尾
```

**记忆技巧**：把列表想象成一排抽屉，每个抽屉有个编号（0, 1, 2...）。

---

### 3. for 循环

```python
# 遍历列表
for num in [1, 2, 3]:
    print(num)

# 带索引的遍历
for i, num in enumerate([1, 2, 3]):
    print(i, num)

# range 生成数字序列
for i in range(5):       # 0, 1, 2, 3, 4
    print(i)
for i in range(1, 6):   # 1, 2, 3, 4, 5
    print(i)
```

---

### 4. if 条件

```python
x = 10

if x > 5:
    print("大于5")
elif x > 0:
    print("大于0但小于等于5")
else:
    print("小于等于0")
```

**注意**：Python 用**缩进**表示代码块（不像其他语言用 {}）。

---

### 5. 函数

```python
# 定义函数
def greet(name):
    """打招呼的函数"""
    return "Hello, " + name

# 调用函数
message = greet("Bob")
print(message)  # Hello, Bob

# 默认参数
def power(base, exponent=2):
    return base ** exponent

print(power(3))     # 9（3的平方）
print(power(3, 3))  # 27（3的立方）
```

**小技巧**：函数名后面的 `"""..."""` 是文档字符串，说明函数是做什么的。

---

### 6. 类（面向对象）

数据结构代码几乎都是用类实现的，这是最重要的部分。

```python
class Node:
    """链表节点类"""

    # 构造函数（创建对象时自动调用）
    def __init__(self, value):
        self.value = value    # 保存值
        self.next = None      # 保存指向下一个节点的指针

    def __str__(self):
        """打印对象时显示的内容"""
        return str(self.value)

# 创建对象
node1 = Node(10)
node2 = Node(20)

# 连接节点
node1.next = node2

# 访问属性
print(node1.value)   # 10
print(node1.next.value)  # 20（通过 node1 访问 node2 的值）
```

**理解技巧**：
- `self` 就是"我自己的意思"，`self.value` = "我自己的 value 属性"
- 类是模板，对象是按照模板造出来的具体东西
- `node1.next` 是一个指针，指向另一个 Node 对象

---

### 7. 字典（键值对）

```python
# 创建字典
student = {"name": "Alice", "age": 20, "major": "CS"}

# 访问
print(student["name"])       # Alice
print(student.get("age"))     # 20

# 修改
student["age"] = 21

# 添加
student["grade"] = "A"

# 遍历
for key in student:
    print(key, student[key])

# 遍历键值对
for key, value in student.items():
    print(key, value)
```

---

### 8. 常见数据结构的 Python 表达

| 数据结构 | Python 表示 |
|---------|------------|
| 数组/列表 | `[1, 2, 3]` |
| 栈（手写） | 用列表，`append()` 入栈，`pop()` 出栈 |
| 队列（手写） | 用列表，`append()` 入队，`pop(0)` 出队（效率低，后续会优化） |
| 树节点 | 自定义类 |
| 图 | 字典：`{节点: [邻居列表]}` |

---

## 后续章节会出现但不讲的语法

以下语法不会专门讲，但代码中会出现，有疑问可以自行搜索：

- `while` 循环
- 列表推导式：`[x*2 for x in range(5)]`
- `None`（表示"空"）
- `is` vs `==`（身份比较 vs 相等比较）
- `pass`（空语句，占位用）

---

## 学习检查清单

完成本章后，你应该能回答：
- [ ] 如何创建列表、访问元素、添加和删除元素
- [ ] for 循环的基本写法
- [ ] 什么是类，什么是对象，`self` 是什么意思
- [ ] 如何定义一个函数并调用它
- [ ] 什么是构造函数（`__init__`）

如果都能回答，说明基础够了，可以开始学习数据结构了！

---

## 如何使用本章

```
1. 读 README.md（本文档）→ 理解基础概念
2. 打开 python_basics.py → 运行，看输出
3. 打开 data_structures.py → 运行，看输出
4. 打开 algorithms.py → 运行，看输出
5. 试着修改代码中的值，观察变化
```
