"""
implementation.py
栈的 Python 实现
对应教材：03_stack
预计学习时长：1小时

本文件展示：
1. 栈的基本实现：push/pop/peek/is_empty
2. 括号匹配应用
3. 中缀转后缀表达式（选学）

运行方式：在终端执行 python implementation.py
"""

# ============================================================================
# 1. 栈的基本实现
# ============================================================================

print("=" * 60)
print("1. 栈的基本实现")
print("=" * 60)

class Stack:
    """
    栈类 - 后进先出（LIFO）

    使用 Python 列表实现：
    - 列表末尾作为栈顶（append/pop 都是 O(1)）
    - 列表开头作为栈底

    时间复杂度：
        push: O(1)
        pop: O(1)
        peek: O(1)
        is_empty: O(1)
        size: O(1)
    """

    def __init__(self):
        """初始化空栈"""
        self.items = []

    def __str__(self):
        """打印栈内容（从上到下）"""
        if self.is_empty():
            return "Stack: [] (empty)"

        # 从栈顶到栈底显示
        items_str = [str(x) for x in reversed(self.items)]
        return "Stack (top→bottom): [" + " | ".join(items_str) + "]"

    def push(self, item):
        """
        入栈：把元素放到栈顶
        参数:
            item: 要入栈的元素
        """
        self.items.append(item)
        print(f"push({item}): {self}")

    def pop(self):
        """
        出栈：移除并返回栈顶元素
        返回:
            栈顶元素，如果栈空返回 None
        """
        if self.is_empty():
            print("pop(): 栈为空，无法出栈！")
            return None

        item = self.items.pop()
        print(f"pop(): 弹出 {item}, {self}")
        return item

    def peek(self):
        """
        查看栈顶元素（不删除）
        返回:
            栈顶元素，如果栈空返回 None
        """
        if self.is_empty():
            return None
        return self.items[-1]

    def is_empty(self):
        """判断栈是否为空"""
        return len(self.items) == 0

    def size(self):
        """返回栈的大小"""
        return len(self.items)


# 演示基本操作
print("\n--- 创建空栈 ---")
stack = Stack()
print(stack)

print("\n--- push 10, 20, 30 ---")
stack.push(10)
stack.push(20)
stack.push(30)

print("\n--- peek 查看栈顶 ---")
top = stack.peek()
print(f"栈顶元素: {top}")

print("\n--- pop 弹出一次 ---")
stack.pop()

print("\n--- pop 弹出一次 ---")
stack.pop()

print("\n--- push 40 ---")
stack.push(40)

print("\n--- 栈的当前状态 ---")
print(stack)


# ============================================================================
# 2. 括号匹配
# ============================================================================

print("\n" + "=" * 60)
print("2. 括号匹配")
print("=" * 60)

def is_balanced(expression):
    """
    检查表达式中的括号是否匹配
    支持三种括号: (), [], {}

    算法：
    1. 遇到左括号，入栈
    2. 遇到右括号，弹出栈顶检查是否匹配
    3. 扫描结束后，栈空则匹配

    时间复杂度: O(n)
    """
    stack = Stack()
    pairs = {')': '(', ']': '[', '}': '{'}

    print(f"\n检查表达式: {expression}")

    for i, char in enumerate(expression):
        if char in '([{':
            # 左括号，入栈
            print(f"  位置 {i}: 遇到 '{char}'（左括号），push 入栈")
            stack.push(char)
        elif char in ')]}':
            # 右括号，检查栈顶
            if stack.is_empty():
                print(f"  位置 {i}: 遇到 '{char}'（右括号），栈为空，无法匹配！")
                return False

            top = stack.pop()
            expected = pairs[char]

            if top != expected:
                print(f"  位置 {i}: 遇到 '{char}'，栈顶是 '{top}'，不匹配 '{expected}'！")
                return False
            else:
                print(f"  位置 {i}: 遇到 '{char}'，栈顶 '{top}' 匹配！")

    # 检查栈是否为空
    if not stack.is_empty():
        remaining = stack.size()
        print(f"  扫描结束，栈中还有 {remaining} 个左括号未匹配！")
        return False

    print(f"  扫描结束，栈为空，匹配成功！")
    return True


# 测试用例
test_cases = [
    "((a + b) * c)",
    "(a + b) * c)",
    "((a + b] * c)",
    "{[()()]}",      # 嵌套
    "({[)]}",       # 交叉不匹配
    "",
]

print("\n--- 括号匹配测试 ---")
for expr in test_cases:
    result = is_balanced(expr)
    print(f"结果: {'匹配 ✓' if result else '不匹配 ✗'}")
    print()


# ============================================================================
# 3. 中缀转后缀（选学）
# ============================================================================

print("=" * 60)
print("3. 中缀转后缀表达式（选学）")
print("=" * 60)

def infix_to_postfix(expression):
    """
    将中缀表达式转换为后缀表达式

    中缀: 3 + 4 * 2
    后缀: 3 4 2 * +

    算法：
    1. 遇到操作数，输出
    2. 遇到左括号，入栈
    3. 遇到右括号，弹出栈顶直到左括号
    4. 遇到操作符：
       - 如果栈顶操作符优先级 >= 当前操作符，弹出栈顶
       - 否则入栈

    时间复杂度: O(n)
    """
    stack = Stack()
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}
    output = []

    print(f"\n转换表达式: {expression}")

    for i, char in enumerate(expression):
        if char.isalnum():
            # 操作数，输出
            print(f"  位置 {i}: '{char}' 是操作数，输出")
            output.append(char)

        elif char == '(':
            # 左括号，入栈
            print(f"  位置 {i}: '{char}' 是左括号，入栈")
            stack.push(char)

        elif char == ')':
            # 右括号，弹出直到左括号
            print(f"  位置 {i}: '{char}' 是右括号，弹出栈顶直到左括号")
            while not stack.is_empty() and stack.peek() != '(':
                output.append(stack.pop())
            if not stack.is_empty():
                stack.pop()  # 弹出左括号

        elif char in '+-*/^':
            # 操作符
            print(f"  位置 {i}: '{char}' 是操作符")
            while not stack.is_empty() and stack.peek() in '+-*/^':
                if precedence[stack.peek()] >= precedence[char]:
                    op = stack.pop()
                    print(f"    栈顶 '{op}' 优先级 >= '{char}'，弹出并输出")
                    output.append(op)
                else:
                    break

            print(f"    '{char}' 入栈")
            stack.push(char)

    # 弹出剩余操作符
    while not stack.is_empty():
        op = stack.pop()
        print(f"  扫描结束，弹出剩余操作符 '{op}'")
        output.append(op)

    result = ''.join(output)
    print(f"\n中缀表达式: {expression}")
    print(f"后缀表达式: {result}")
    return result


# 测试用例
print("\n--- 中缀转后缀测试 ---")
infix_to_postfix("3+4*2")
print()
infix_to_postfix("(3+4)*2")
print()
infix_to_postfix("a+b*c-d")


# ============================================================================
# 4. 栈的应用：函数调用（理解递归）
# ============================================================================

print("\n" + "=" * 60)
print("4. 栈与函数调用（为递归打基础）")
print("=" * 60)

print("""
栈在计算机中最重要的应用之一是函数调用！

当调用一个函数时：
1. 函数的参数和局部变量被压入栈中（栈帧）
2. 函数执行完毕后，这些数据被弹出栈

例如计算阶乘 5!：

调用顺序（压栈）：
  factorial(5) → factorial(4) → factorial(3) → factorial(2) → factorial(1)

返回顺序（弹栈）：
  factorial(1) 返回 1
  factorial(2) 返回 2*1=2
  factorial(3) 返回 3*2=6
  factorial(4) 返回 4*6=24
  factorial(5) 返回 5*24=120

这就是为什么递归调用太深会导致"栈溢出"！
""")


# ============================================================================
# 主程序入口
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("程序执行完毕！")
    print("=" * 60)
    print("\n提示：")
    print("1. 仔细观察 push/pop 时栈的变化")
    print("2. 括号匹配是栈最经典的应用，务必掌握")
    print("3. 中缀转后缀是选学内容，时间不够可以跳过")
    print("4. 打开 visualization.html 观看交互演示")
