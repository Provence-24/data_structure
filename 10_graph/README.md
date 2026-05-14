# 图（Graph）

> 本章目标：理解图的概念、图的两种表示方法（邻接表、邻接矩阵），掌握 BFS 和 DFS

## 生活化类比

**社交网络**：
- 每个人是一个节点
- 好友关系是边
- 可以两人之间通过共同好友连接起来

**城市地图**：
- 每个城市是节点
- 公路是边
- 导航就是找最短路径

## 核心概念

### 1. 图的定义

图由**顶点（Vertex）**和**边（Edge）**组成：

```
无向图：
    A --- B
    |     |
    |     |
    C --- D

有向图：
    A → B
    ↓   ↓
    C ← D
```

**无向图**：边没有方向，A 到 B 和 B 到 A 一样
**有向图**：边有方向，A → B 不等于 B → A

### 2. 图的术语

| 术语 | 解释 |
|------|------|
| 顶点（Vertex） | 图中的节点 |
| 边（Edge） | 连接两个顶点的线 |
| 度（Degree） | 一个顶点连接的边数 |
| 路径（Path） | 从一个顶点到另一个顶点经过的边 |
| 环（Cycle） | 起点和终点相同的路径 |

### 3. 图的表示方法

#### 邻接表（Adjacency List）

用字典存储每个顶点的邻居：

```python
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'C'],
    'C': ['A', 'B', 'D'],
    'D': ['C']
}
```

#### 邻接矩阵（Adjacency Matrix）

用二维数组存储：

```python
#     A  B  C  D
#  A  0  1  1  0
#  B  1  0  1  0
#  C  1  1  0  1
#  D  0  0  1  0

matrix = [
    [0, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 1, 0, 1],
    [0, 0, 1, 0]
]
```

### 4. 邻接表 vs 邻接矩阵

| 对比 | 邻接表 | 邻接矩阵 |
|------|--------|----------|
| 空间复杂度 | O(V + E) | O(V²) |
| 查边 | O(度) | O(1) |
| 适用场景 | 稀疏图 | 稠密图 |

## 图的遍历

### 1. 深度优先搜索（DFS）

像走迷宫，一直往前走，碰壁就回退：

```python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()

    print(start, end=" ")
    visited.add(start)

    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)
```

### 2. 广度优先搜索（BFS）

像水面扩散，一层层往外扩展：

```python
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])

    while queue:
        vertex = queue.popleft()
        print(vertex, end=" ")

        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

### 3. DFS vs BFS

| 对比 | DFS | BFS |
|------|-----|-----|
| 数据结构 | 栈 | 队列 |
| 特点 | 深入优先 | 广度优先 |
| 适用场景 | 找路径、拓扑排序 | 找最短路径 |

## 最短路径

### BFS 求无权图最短路径

```python
def shortest_path(graph, start, end):
    """BFS 找最短路径"""
    visited = set([start])
    queue = deque([(start, [start])])

    while queue:
        vertex, path = queue.popleft()

        if vertex == end:
            return path

        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))

    return None
```

## 常见面试题

### 1. 岛屿数量

```python
def num_islands(grid):
    """计算岛屿数量（DFS）"""
    if not grid:
        return 0

    count = 0
    rows, cols = len(grid), len(grid[0])

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] == '0':
            return
        grid[r][c] = '0'  # 标记已访问
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)

    return count
```

### 2. 课程表（检测环）

```python
def can_finish(num_courses, prerequisites):
    """判断是否能完成所有课程（有向图环检测）"""
    from collections import deque

    graph = {i: [] for i in range(num_courses)}
    in_degree = [0] * num_courses

    for dest, src in prerequisites:
        graph[src].append(dest)
        in_degree[dest] += 1

    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])
    count = 0

    while queue:
        course = queue.popleft()
        count += 1

        for neighbor in graph[course]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return count == num_courses
```

## 常见考点和易错点

### 易错点 1：图要有visited

图的遍历一定要记录已访问的顶点，否则可能陷入无限循环。

### 易错点 2：邻接表和邻接矩阵的选择

- 稀疏图（边少）用邻接表
- 稠密图（边多）用邻接矩阵

### 易错点 3：BFS 和 DFS 的选择

- BFS：找最短路径、层级遍历
- DFS：找所有路径、回溯、拓扑排序

## 学习检查清单

完成本章后，你应该能回答：
- [ ] 什么是图？有向图和无向图的区别是什么？
- [ ] 邻接表和邻接矩阵是如何表示图的？
- [ ] BFS 和 DFS 的区别是什么？各用什么数据结构？
- [ ] 如何用 BFS 找无权图的最短路径？
- [ ] 如何检测有向图中是否有环？
- [ ] 什么是拓扑排序？

## 如何使用本章

```
1. 读 README.md（本文档）→ 理解图的概念
2. 打开 implementation.py → 运行，看打印输出
3. 打开 visualization.html → 交互演示，边点边学
```