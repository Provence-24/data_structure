# 队列（Queue）

> 本章目标：理解队列的"先进先出"特性，理解循环队列解决"假溢出"的原理

## 生活化类比

**排队买奶茶**：
- 第一个排队的人最先买到奶茶
- 后来的人排在队伍末尾
- **先进先出（First In First Out, FIFO）**

或者**打印队列**：
- 发送打印任务后，任务按顺序执行
- 先发送的先打印

## 核心概念

### 队列的结构

```
前端（front）                        后端（rear）
   │
   ▼
┌────┬────┬────┬────┬────┐
│ 10 │ 20 │ 30 │    │    │
└────┴────┴────┴────┴────┘
  ▲                         ▲
  │                         │
出队（dequeue）           入队（enqueue）
```

**两种视角**：
- **线性表视角**：队列是一种特殊的线性表，只允许在一端（队尾）插入，另一端（队头）删除
- **FIFO 视角**：最先进入队列的元素最先出来

### 基本操作

| 操作 | 作用 | 时间复杂度 |
|------|------|-----------|
| enqueue(item) | 把元素加入队尾 | O(1) |
| dequeue() | 从队头移除元素 | O(1) |
| front() | 查看队头元素（不删除） | O(1) |
| rear() | 查看队尾元素 | O(1) |
| is_empty() | 判断队列是否为空 | O(1) |
| size() | 返回队列大小 | O(1) |

## 普通队列的问题：假溢出

用数组实现普通队列时会出现"假溢出"问题：

```
初始队列: [10, 20, 30, _, _]  front=0, rear=2
dequeue两次: [_, _, 30, _, _]  front=2, rear=2
enqueue两次: [_, _, 30, 40, 50]  front=2, rear=4

此时队列明明前面还有空位，但却无法再入队了！
这就是"假溢出"——数组没满但无法入队。
```

### 解决方案：循环队列

循环队列把数组当成"环"来看：

```
数组逻辑上是一个环：
        0
      ┌───┐
    4 │   │ 1
      ├───┤
    3 │   │ 2
      └───┘

rear 追上 front 表示队满
front 追上 rear 表示队空
需要牺牲一个位置来区分队满和队空
```

**循环队列的状态判断**：

| 状态 | 判断条件 |
|------|---------|
| 队空 | front == rear |
| 队满 | (rear + 1) % capacity == front |
| 元素个数 | (rear - front + capacity) % capacity |

## 循环队列图解

```
初始状态（队空）:
front = rear = 0
数组: [_, _, _, _, _]

enqueue 10:
rear = 1
数组: [10, _, _, _, _]

enqueue 20:
rear = 2
数组: [10, 20, _, _, _]

enqueue 30:
rear = 3
数组: [10, 20, 30, _, _]

dequeue（取出10）:
front = 1
数组: [_, 20, 30, _, _]

enqueue 40:
rear = 4
数组: [_, 20, 30, 40, _]

enqueue 50:
rear = 0（绕回来了！）
数组: [50, 20, 30, 40, _]

队满！（rear+1 % 5 == front，即 1 == 1）
```

## Python 实现

```python
class Queue:
    def __init__(self, capacity=5):
        self.capacity = capacity
        self.array = [None] * capacity
        self.front = 0  # 队头索引
        self.rear = 0   # 队尾索引（下一个入队位置）

    def is_full(self):
        return (self.rear + 1) % self.capacity == self.front

    def is_empty(self):
        return self.front == self.rear

    def enqueue(self, item):
        if self.is_full():
            raise Exception("队列已满！")
        self.array[self.rear] = item
        self.rear = (self.rear + 1) % self.capacity

    def dequeue(self):
        if self.is_empty():
            raise Exception("队列为空！")
        item = self.array[self.front]
        self.front = (self.front + 1) % self.capacity
        return item
```

## 应用场景

1. **任务调度**：操作系统用队列管理待执行的任务
2. **广度优先搜索（BFS）**：图/树的层序遍历用队列
3. **缓冲区**：网络通信中用队列缓冲数据
4. **打印机队列**：多个人同时打印，按顺序执行

## 常见考点和易错点

### 易错点 1：混淆 front 和 rear

- front = 队头元素的位置（出队位置）
- rear = 下一个入队的位置（不是队尾元素的位置）

### 易错点 2：循环队列的取模运算

每次移动 front 或 rear 时都要 `% capacity`，否则索引会超出数组范围。

### 易错点 3：队满/队空的判断

循环队列通常牺牲一个位置来区分队满和队空：
- 队空：front == rear
- 队满：(rear + 1) % capacity == front

## 学习检查清单

完成本章后，你应该能：
- [ ] 解释什么是"先进先出"（FIFO）
- [ ] 手写一个循环队列类
- [ ] 解释什么是"假溢出"，循环队列如何解决
- [ ] 画出循环队列在各种状态下的示意图
- [ ] 说出身处面试能写出让面试官满意的循环队列实现

## 如何使用本章

```
1. 读 README.md（本文档）→ 理解队列和循环队列的原理
2. 打开 implementation.py → 运行，看打印输出
3. 打开 visualization.html → 交互演示，边点边学
```
