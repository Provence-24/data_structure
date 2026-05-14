"""
implementation.py
递归的 Python 实现
对应教材：05_recursion
预计学习时长：1.5小时

本文件展示：
1. 递归三要素的理解
2. 阶乘、斐波那契、字符串反转等基础递归
3. 汉诺塔、全排列等经典递归问题
4. 递归与栈帧的关系

运行方式：在终端执行 python implementation.py
"""

# ============================================================================
# 1. 递归三要素
# ============================================================================

print("=" * 60)
print("1. 递归三要素")
print("=" * 60)

print("""
递归三要素：
1. 终止条件：什么时候停下来（必须有，否则无限递归）
2. 递归调用：函数调用自己
3. 状态收敛：每次调用都接近终止条件

递归的本质：函数调用自己，每次调用都会在栈上分配一块内存（栈帧）
""")


# ============================================================================
# 2. 阶乘
# ============================================================================

print("=" * 60)
print("2. 阶乘 (Factorial)")
print("=" * 60)

def factorial(n):
    """
    计算 n! = n * (n-1) * (n-2) * ... * 1

    递归分析：
    - factorial(5) = 5 * factorial(4)
    - factorial(4) = 4 * factorial(3)
    - factorial(3) = 3 * factorial(2)
    - factorial(2) = 2 * factorial(1)
    - factorial(1) = 1  ← 终止条件
    """
    # 终止条件
    if n <= 1:
        return 1

    # 递归调用 + 状态收敛（n 每次减 1）
    return n * factorial(n - 1)


print("\n--- 阶乘演示 ---")
for i in range(1, 8):
    print(f"factorial({i}) = {factorial(i)}")


# ============================================================================
# 3. 斐波那契数列
# ============================================================================

print("\n" + "=" * 60)
print("3. 斐波那契数列 (Fibonacci)")
print("=" * 60)

def fibonacci(n):
    """
    斐波那契数列：0, 1, 1, 2, 3, 5, 8, 13, 21, ...

    第 n 项 = 第 (n-1) 项 + 第 (n-2) 项

    递归分析：
    - fibonacci(4) = fibonacci(3) + fibonacci(2)
    - fibonacci(3) = fibonacci(2) + fibonacci(1)
    - fibonacci(2) = fibonacci(1) + fibonacci(0) = 1 + 0 = 1
    - fibonacci(1) = 1  ← 终止条件
    - fibonacci(0) = 0  ← 终止条件
    """
    # 终止条件
    if n <= 0:
        return 0
    if n == 1:
        return 1

    # 递归调用
    return fibonacci(n - 1) + fibonacci(n - 2)


print("\n--- 斐波那契数列演示 ---")
print("数列前 15 项：", end="")
for i in range(15):
    print(fibonacci(i), end=" ")
print()


# ============================================================================
# 4. 斐波那契的递归树（理解重复计算问题）
# ============================================================================

print("\n" + "=" * 60)
print("4. 斐波那契的递归树（理解重复计算）")
print("=" * 60)

def fibonacci_tree(n, depth=0):
    """
    用递归树展示 fibonacci 的调用过程
    """
    indent = "  " * depth
    if n <= 1:
        print(f"{indent}fibonacci({n}) = {n}")
        return n

    print(f"{indent}fibonacci({n}) 调用：")
    left = fibonacci_tree(n - 1, depth + 1)
    right = fibonacci_tree(n - 2, depth + 1)
    result = left + right
    print(f"{indent}  → 返回 {left} + {right} = {result}")
    return result


print("\n--- fibonacci(4) 的递归树 ---")
fibonacci_tree(4)


# ============================================================================
# 5. 斐波那契的记忆化版本（避免重复计算）
# ============================================================================

print("\n" + "=" * 60)
print("5. 斐波那契记忆化版本")
print("=" * 60)

def fibonacci_memo(n, memo=None):
    """
    记忆化斐波那契：用字典缓存已计算过的结果
    时间复杂度从 O(2^n) 降到 O(n)
    """
    if memo is None:
        memo = {}

    if n in memo:
        print(f"  [缓存命中] fibonacci({n}) = {memo[n]}")
        return memo[n]

    if n <= 1:
        memo[n] = n
        return n

    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)
    return memo[n]


print("\n--- 记忆化斐波那契演示 ---")
memo_result = fibonacci_memo(6)
print(f"fibonacci(6) = {memo_result}")


# ============================================================================
# 6. 字符串反转
# ============================================================================

print("\n" + "=" * 60)
print("6. 字符串反转")
print("=" * 60)

def reverse_string(s):
    """
    反转字符串

    递归分析：
    - reverse_string("hello") = "o" + reverse_string("hell")
    - reverse_string("hell") = "l" + reverse_string("hel")
    - reverse_string("hel") = "l" + reverse_string("he")
    - reverse_string("he") = "e" + reverse_string("h")
    - reverse_string("h") = "h"  ← 终止条件（长度为1）
    """
    # 终止条件
    if len(s) <= 1:
        return s

    # 递归调用
    return s[-1] + reverse_string(s[:-1])


print("\n--- 字符串反转演示 ---")
test_strings = ["hello", "Python", "递归"]
for s in test_strings:
    print(f"reverse_string(\"{s}\") = \"{reverse_string(s)}\"")


# ============================================================================
# 7. 递归遍历文件目录
# ============================================================================

print("\n" + "=" * 60)
print("7. 递归遍历目录结构")
print("=" * 60)

def print_tree(path, indent=0):
    """
    递归打印目录树
    """
    # 获取当前目录下的所有文件和文件夹
    try:
        items = sorted(os.listdir(path))
    except PermissionError:
        return
    except FileNotFoundError:
        return

    for item in items:
        # 打印缩进和文件名
        print("  " * indent + "├── " + item)

        # 如果是文件夹，递归进去
        full_path = os.path.join(path, item)
        if os.path.isdir(full_path):
            print_tree(full_path, indent + 1)


import os
print("\n--- 当前目录结构（简化） ---")
print_tree(".")


# ============================================================================
# 8. 汉诺塔
# ============================================================================

print("\n" + "=" * 60)
print("8. 汉诺塔 (Tower of Hanoi)")
print("=" * 60)

move_count = 0

def hanoi(n, from_rod, to_rod, aux_rod):
    """
    汉诺塔问题

    思路：
    1. 把上面的 n-1 个盘子从 A 移到 B（借助 C）
    2. 把最大的盘子从 A 移到 C
    3. 把 n-1 个盘子从 B 移到 C（借助 A）

    时间复杂度：O(2^n)
    """
    global move_count

    if n == 1:
        move_count += 1
        print(f"  移动盘子 1 从 {from_rod} 到 {to_rod}")
        return

    # 1. 把上面的 n-1 个盘子从 A 移到 B（借助 C）
    hanoi(n - 1, from_rod, aux_rod, to_rod)

    # 2. 把最大的盘子从 A 移到 C
    move_count += 1
    print(f"  移动盘子 {n} 从 {from_rod} 到 {to_rod}")

    # 3. 把 n-1 个盘子从 B 移到 C（借助 A）
    hanoi(n - 1, aux_rod, to_rod, from_rod)


print("\n--- 汉诺塔演示（3个盘子）---")
move_count = 0
hanoi(3, 'A', 'C', 'B')
print(f"总共移动了 {move_count} 次")

print("\n--- 汉诺塔演示（4个盘子）---")
move_count = 0
hanoi(4, 'A', 'C', 'B')
print(f"总共移动了 {move_count} 次")


# ============================================================================
# 9. 全排列
# ============================================================================

print("\n" + "=" * 60)
print("9. 全排列 (Permutation)")
print("=" * 60)

def permute(s, left, right):
    """
    生成字符串的全排列

    思路：
    1. 选择一个字符作为当前位
    2. 把剩下的字符全排列
    3. 恢复状态（回溯）
    """
    if left == right:
        print("  " + "".join(s))
        return

    for i in range(left, right + 1):
        # 选择：把第 i 个字符换到前面
        s[left], s[i] = s[i], s[left]

        # 递归：排列剩下的字符
        permute(s, left + 1, right)

        # 回溯：恢复原状态
        s[left], s[i] = s[i], s[left]


print("\n--- 全排列演示（\"abc\"）---")
permute(list("abc"), 0, 2)


# ============================================================================
# 10. 递归与栈帧的关系
# ============================================================================

print("\n" + "=" * 60)
print("10. 递归与栈帧")
print("=" * 60)

def stack_frame_demo(n):
    """
    展示递归调用时栈帧的变化
    """
    print(f"  [调用] stack_frame_demo({n}) - 栈深度 +1")

    if n <= 1:
        print(f"  [返回] stack_frame_demo({n}) = 1 - 栈深度 -1")
        return 1

    result = n * stack_frame_demo(n - 1)

    print(f"  [返回] stack_frame_demo({n}) = {result} - 栈深度 -1")
    return result


print("\n--- 栈帧变化（阶乘 4!）---")
print("（注意观察调用和返回的顺序）")
stack_frame_demo(4)


# ============================================================================
# 11. 递归的深度限制
# ============================================================================

print("\n" + "=" * 60)
print("11. 递归深度限制")
print("=" * 60)

import sys

print(f"\n当前 Python 递归深度限制：{sys.getrecursionlimit()}")

# 可以通过以下方式修改（但不推荐随意修改）
# sys.setrecursionlimit(10000)


# ============================================================================
# 主程序入口
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("程序执行完毕！")
    print("=" * 60)
    print("\n提示：")
    print("1. 递归三要素：终止条件、递归调用、状态收敛")
    print("2. 每次递归调用都会在栈上分配内存（栈帧）")
    print("3. 递归深度太大会导致栈溢出")
    print("4. 斐波那契数列的普通递归有重复计算问题，可用记忆化优化")
    print("5. 打开 visualization.html 观看递归调用栈的交互演示")
