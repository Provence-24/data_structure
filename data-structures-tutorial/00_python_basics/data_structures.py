"""
data_structures.py
Python 数据结构操作演示
对应教材：Python 速成（00_python_basics）
预计学习时长：15分钟

本文件展示列表、字典、集合的常用操作
这是后续章节的基础
运行方式：在终端执行 python data_structures.py
"""

# ============================================================================
# 1. 列表的更多操作
# ============================================================================

print("=" * 50)
print("1. 列表的更多操作")
print("=" * 50)

# 列表常用方法
a = [3, 1, 4, 1, 5, 9, 2, 6]
print("原始列表:", a)

# 排序（就地修改）
a.sort()
print("sort() 排序后:", a)

# 反转
a.reverse()
print("reverse() 反转后:", a)

# 找元素索引（找不到会报错）
print("元素 5 的索引:", a.index(5))

# 统计元素出现次数
print("元素 1 出现次数:", a.count(1))

# 列表长度
print("列表长度:", len(a))

# 判断元素是否存在
print("3 在列表中吗:", 3 in a)
print("7 在列表中吗:", 7 in a)

# 列表推导式 - 重要！
print("\n列表推导式示例:")
squares = [x**2 for x in range(5)]
print("  [x**2 for x in range(5)] =", squares)

evens = [x for x in range(10) if x % 2 == 0]
print("  [x for x in range(10) if x % 2 == 0] =", evens)

# ============================================================================
# 2. 列表作为栈和队列
# ============================================================================

print("\n" + "=" * 50)
print("2. 用列表模拟栈和队列")
print("=" * 50)

# 栈（后进先出）
print("\n--- 栈（用 append/pop）---")
stack = []
stack.append("a")  # 入栈
stack.append("b")
stack.append("c")
print("入栈 a, b, c:", stack)
print("pop():", stack.pop())   # c 出栈（最后进去的）
print("pop():", stack.pop())   # b 出栈
print("剩余:", stack)

# 队列（先进先出）
print("\n--- 队列（用 append/pop(0)）---")
queue = []
queue.append("甲")  # 入队
queue.append("乙")
queue.append("丙")
print("入队 甲, 乙, 丙:", queue)
print("pop(0):", queue.pop(0))  # 甲出队（最先进去的）
print("pop(0):", queue.pop(0))  # 乙出队
print("剩余:", queue)

# 注意：pop(0) 在列表很长时效率低（需要移动所有元素）
# 后续章节会讲如何高效实现队列

# ============================================================================
# 3. 字典操作
# ============================================================================

print("\n" + "=" * 50)
print("3. 字典操作")
print("=" * 50)

# 创建字典
phonebook = {
    "张三": "13800138000",
    "李四": "13900139000",
    "王五": "13700137000"
}
print("电话簿:", phonebook)

# 添加/修改
phonebook["赵六"] = "13600136000"  # 添加新条目
phonebook["张三"] = "13888888888"  # 修改已有条目
print("修改后:", phonebook)

# 删除
del phonebook["王五"]
print("删除王五后:", phonebook)

# 获取（安全方式）
number = phonebook.get("李四", "不存在")  # 默认值"不存在"
print("李四的电话:", number)
number = phonebook.get("王五", "不存在")
print("王五的电话:", number)

# 遍历
print("\n遍历电话簿:")
for name, phone in phonebook.items():
    print("  ", name, ":", phone)

# .keys() 获取所有键
print("所有键:", list(phonebook.keys()))

# .values() 获取所有值
print("所有值:", list(phonebook.values()))

# ============================================================================
# 4. 集合（set）- 无序、不重复
# ============================================================================

print("\n" + "=" * 50)
print("4. 集合（set）")
print("=" * 50)

# 创建集合
s = {1, 2, 3, 4, 5}
print("集合:", s)

# 添加元素
s.add(6)
print("添加 6 后:", s)

# 添加多个元素
s.update([7, 8, 9])
print("添加 [7, 8, 9] 后:", s)

# 删除（不存在会报错）
s.remove(5)
print("删除 5 后:", s)

# 删除（不存在不会报错）
s.discard(10)  # 什么都不发生
s.discard(3)
print("discard(10) 和 discard(3) 后:", s)

# 集合运算
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print("\n集合运算:")
print("  a =", a)
print("  b =", b)
print("  a | b (并集):", a | b)
print("  a & b (交集):", a & b)
print("  a - b (差集):", a - b)
print("  a ^ b (对称差集):", a ^ b)

# 判断子集/超集
print("\n子集/超集:")
print("  {1, 2} 是 {1, 2, 3} 的子集:", {1, 2}.issubset({1, 2, 3}))
print("  {1, 2, 3} 是 {1, 2} 的超集:", {1, 2, 3}.issuperset({1, 2}))

# ============================================================================
# 5. 元组（tuple）- 不可变列表
# ============================================================================

print("\n" + "=" * 50)
print("5. 元组（不可变）")
print("=" * 50)

# 创建元组
t = (1, 2, 3, "hello", True)
print("元组:", t)

# 访问（和列表一样）
print("t[0] =", t[0])
print("t[-1] =", t[-1])

# 切片
print("t[1:4] =", t[1:4])

# 不能修改！
# t[0] = 100  # 这会报错！

# 解包
x, y, z = (1, 2, 3)
print("解包: x =", x, ", y =", y, ", z =", z)

# 交换两个变量的值
a, b = 10, 20
a, b = b, a  # Python 特有：不需要临时变量
print("交换后: a =", a, ", b =", b)

# 元组作为字典的键（因为不可变）
coord = {(0, 0): "原点", (1, 0): "x轴正方向"}
print("坐标字典:", coord)

# ============================================================================
# 6. 字符串操作（经常用到）
# ============================================================================

print("\n" + "=" * 50)
print("6. 字符串操作")
print("=" * 50)

s = "Hello, World!"

print("原始字符串:", s)
print("upper():", s.upper())
print("lower():", s.lower())
print("split(','):", s.split(","))
print("replace('World', 'Python'):", s.replace("World", "Python"))
print("startswith('Hello'):", s.startswith("Hello"))
print("endswith('!'):", s.endswith("!"))
print("len(s):", len(s))

# 格式化字符串（重要！）
name = "Alice"
age = 20
# 旧方式（了解即可）
print("\n格式化字符串:")
print("我叫 %s, 今年 %d 岁" % (name, age))
# 新方式（推荐）
print("我叫 {}, 今年 {} 岁".format(name, age))
print(f"我叫 {name}, 今年 {age} 岁")  # 最推荐，Python 3.6+

# ============================================================================
# 7. 列表、字典、集合的复制（深拷贝 vs 浅拷贝）
# ============================================================================

print("\n" + "=" * 50)
print("7. 复制：深拷贝 vs 浅拷贝")
print("=" * 50)

# 浅拷贝的问题
original = [[1, 2, 3], [4, 5, 6]]
copy = original[:]  # 切片拷贝
copy[0][0] = 99
print("original:", original)  # [[99, 2, 3], [4, 5, 6]] -- 原列表也被改了！
print("copy:", copy)

# 深拷贝
import copy as copy_module
original2 = [[1, 2, 3], [4, 5, 6]]
deep_copy = copy_module.deepcopy(original2)
deep_copy[0][0] = 99
print("\n深拷贝后:")
print("original2:", original2)  # [[1, 2, 3], [4, 5, 6]] -- 不会被修改
print("deep_copy:", deep_copy)  # [[99, 2, 3], [4, 5, 6]]

# ============================================================================
# 主程序入口
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("程序执行完毕！")
    print("=" * 50)
