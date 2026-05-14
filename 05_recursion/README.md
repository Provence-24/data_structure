# 递归（Recursion）

> 本章目标：理解递归的三要素，掌握递归树的画法，理解栈帧在递归中的作用

## 生活化类比

**俄罗斯套娃**：
- 每个娃娃打开后，里面还有一个娃娃
- 直到打开到最小的那个娃娃，才停止打开
- 这个过程就是"递归"

**数手指**：
- 5 个人排队，每个人都问后面的人："你是第几个？"
- 第 5 个人说"我是第 5 个"
- 第 4 个人说"你前面有 4 个人，所以你是第 5 个"
- 层层上报，这就是递归

## 递归的本质

递归就是**函数调用自己**：

```
def 问问题(n):
    if n == 1:  # 终止条件
        return "第1个"
    答案 = 问问题(n - 1)  # 递归调用
    return 答案 + "前面还有" + n
```

**递归三要素**：
1. **终止条件**：什么时候停下来
2. **递归调用**：函数调用自己
3. **状态收敛**：每次调用都接近终止条件

## 递归栈帧图解

递归调用时，计算机会为每次函数调用分配一块内存，叫"栈帧"：

```
调用 foo(4) 的栈帧变化：

foo(4) 调用
    │
    ├─> foo(3) 调用
    │       │
    │       ├─> foo(2) 调用
    │       │       │
    │       │       ├─> foo(1) 调用
    │       │       │       │  终止条件返回 "1"
    │       │       │       └─< 返回 "1"
    │       │       └─< 返回 "1前面还有2"
    │       └─< 返回 "1前面还有2前面还有3"
    └─< 返回 "1前面还有2前面还有3前面还有4"
```

**栈帧特点**：
- 后进先出（LIFO）
- 每递归一层，就压栈（push）
- 每返回一层，就弹栈（pop）

## 递归与循环的比较

| 场景 | 递归 | 循环 |
|------|------|------|
| 代码简洁度 | 简洁 | 较复杂 |
| 空间复杂度 | O(n) | O(1) |
| 时间复杂度 | O(n) | O(n) |
| 容易出错点 | 终止条件写错会无限递归 | 循环条件写错会死循环 |

## Python 实现

### 1. 阶乘

```python
def factorial(n):
    """
    计算 n! = n * (n-1) * (n-2) * ... * 1
    """
    # 终止条件
    if n <= 1:
        return 1

    # 递归调用 + 状态收敛（n 每次减 1）
    return n * factorial(n - 1)

# 测试
print(factorial(5))  # 120
```

### 2. 斐波那契数列

```python
def fibonacci(n):
    """
    斐波那契数列：1, 1, 2, 3, 5, 8, 13, ...
    """
    # 终止条件
    if n <= 1:
        return n if n > 0 else 0

    # 递归调用
    return fibonacci(n - 1) + fibonacci(n - 2)

# 测试
for i in range(10):
    print(fibonacci(i), end=" ")  # 0 1 1 2 3 5 8 13 21 34
```

### 3. 字符串反转

```python
def reverse_string(s):
    """
    反转字符串
    """
    # 终止条件
    if len(s) <= 1:
        return s

    # 递归调用
    return s[-1] + reverse_string(s[:-1])

# 测试
print(reverse_string("hello"))  # "olleh"
```

### 4. 递归遍历文件目录

```python
import os

def list_files(path, indent=0):
    """
    递归列出目录下的所有文件和文件夹
    """
    items = os.listdir(path)

    for item in items:
        full_path = os.path.join(path, item)
        print("  " * indent + item)

        # 如果是文件夹，继续递归
        if os.path.isdir(full_path):
            list_files(full_path, indent + 1)

# 测试
list_files(".")
```

## 递归树

用递归树来理解递归的执行过程：

### 斐波那契递归树（fib(4)）

```
                fib(4)
               /      \
           fib(3)    fib(2)
          /    \     /    \
      fib(2) fib(1) fib(1) fib(0)
      /    \
  fib(1) fib(0)

计算结果：
fib(0)=0, fib(1)=1
fib(2)=fib(1)+fib(0)=1+0=1
fib(3)=fib(2)+fib(1)=1+1=2
fib(4)=fib(3)+fib(2)=2+1=3
```

### 递归树的画法步骤

1. 画根节点（最顶层的调用）
2. 每个递归调用画一个子节点
3. 用连线表示调用关系
4. 在叶子节点标出返回值
5. 沿着调用链向上汇总

## 经典面试题

### 1. 爬楼梯

> 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。每次你可以爬 1 或 2 个台阶。问有多少种不同的方法？

```python
def climb_stairs(n):
    """
    动态规划 + 递归思维
    """
    if n <= 2:
        return n
    return climb_stairs(n - 1) + climb_stairs(n - 2)

# 但这样会重复计算，更好的做法是用记忆化：
def climb_stairs_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 2:
        return n
    memo[n] = climb_stairs_memo(n - 1, memo) + climb_stairs_memo(n - 2, memo)
    return memo[n]
```

### 2. 汉诺塔

> 有三根柱子 A、B、C，A 柱上有 n 个圆盘，所有圆盘要从 A 移到 C，每次只能移动一个，且大盘不能放在小盘上。

```python
def hanoi(n, from_rod, to_rod, aux_rod):
    """
    汉诺塔问题
    """
    if n == 1:
        print(f"移动盘子 1 从 {from_rod} 到 {to_rod}")
        return

    # 1. 把上面的 n-1 个盘子从 A 移到 B（借助 C）
    hanoi(n - 1, from_rod, aux_rod, to_rod)

    # 2. 把最大的盘子从 A 移到 C
    print(f"移动盘子 {n} 从 {from_rod} 到 {to_rod}")

    # 3. 把 n-1 个盘子从 B 移到 C（借助 A）
    hanoi(n - 1, aux_rod, to_rod, from_rod)

# 测试：3 个盘子
hanoi(3, 'A', 'C', 'B')
```

### 3. 全排列

```python
def permute(s, left=0, right=None):
    """
    生成字符串的全排列
    """
    if right is None:
        right = len(s) - 1

    if left == right:
        print("".join(s))
        return

    for i in range(left, right + 1):
        s[left], s[i] = s[i], s[left]  # 交换
        permute(s, left + 1, right)     # 递归
        s[left], s[i] = s[i], s[left]   # 恢复（回溯）

# 测试
permute(list("abc"))
# abc, acb, bac, bca, cab, cba
```

## 常见考点和易错点

### 易错点 1：忘记终止条件

```python
# 错误！会无限递归
def count_down(n):
    print(n)
    count_down(n - 1)  # 永远不会停

# 正确
def count_down(n):
    if n <= 0:
        return  # 终止条件
    print(n)
    count_down(n - 1)
```

### 易错点 2：递归深度过大

Python 默认递归深度约 1000 层。解决方式：

```python
import sys
sys.setrecursionlimit(10000)  # 设置递归深度限制
```

### 易错点 3：栈溢出

递归调用会消耗栈内存。如果递归深度太大，会导致栈溢出（Stack Overflow）。

### 易错点 4：重复计算

斐波那契数列的递归实现有大量重复计算：

```
fib(4) 调用 fib(3) 和 fib(2)
fib(3) 调用 fib(2) 和 fib(1)  <-- fib(2) 被计算了两次！
fib(2) 调用 fib(1) 和 fib(0)
```

解决方式：用记忆化（Memoization）或动态规划（DP）。

## 学习检查清单

完成本章后，你应该能：
- [ ] 说出递归的三要素：终止条件、递归调用、状态收敛
- [ ] 理解递归栈帧的压栈和弹栈过程
- [ ] 能画出简单递归的递归树
- [ ] 手写阶乘、斐波那契、字符串反转的递归实现
- [ ] 能用递归解决全排列、汉诺塔等问题
- [ ] 理解递归和循环的区别，知道什么时候该用递归

## 如何使用本章

```
1. 读 README.md（本文档）→ 理解递归的原理和三要素
2. 打开 implementation.py → 运行，看打印输出，理解递归的执行过程
3. 打开 visualization.html → 交互演示，边点边学
```

## 拓展阅读

- **尾递归**：一种特殊的递归，可以被编译器优化为循环
- **记忆化搜索**：用缓存避免重复计算
- **动态规划**：递归 + 记忆化 = 动态规划
