"""
implementation.py
图的 Python 实现
对应教材：10_graph
预计学习时长：2.5小时

本文件展示：
1. 图的两种表示方法（邻接表、邻接矩阵）
2. BFS 和 DFS 遍历
3. 最短路径
4. 常见面试题

运行方式：在终端执行 python implementation.py
"""

# ============================================================================
# 1. 图的表示
# ============================================================================

print("=" * 60)
print("1. 图的表示方法")
print("=" * 60)

print("""
图由顶点（Vertex）和边（Edge）组成。

邻接表（Adjacency List）- 用字典：
  graph = {
      'A': ['B', 'C'],
      'B': ['A', 'C'],
      'C': ['A', 'B', 'D'],
      'D': ['C']
  }

邻接矩阵（Adjacency Matrix）- 用二维数组：
       A  B  C  D
    A  0  1  1  0
    B  1  0  1  0
    C  1  1  0  1
    D  0  0  1  0
""")


# ============================================================================
# 2. 构建图
# ============================================================================

print("\n" + "=" * 60)
print("2. 构建图（邻接表）")
print("=" * 60)

# 无向图
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'C', 'D'],
    'C': ['A', 'B', 'D'],
    'D': ['B', 'C']
}

print("""
构建的图：

    A --- B
    | \\   |
    |  \\  |
    C --- D

邻接表：
""")
for vertex, neighbors in graph.items():
    print(f"  {vertex}: {neighbors}")


# ============================================================================
# 3. DFS（深度优先搜索）
# ============================================================================

print("\n" + "=" * 60)
print("3. 深度优先搜索（DFS）")
print("=" * 60)


def dfs(graph, start, visited=None):
    """DFS 遍历"""
    if visited is None:
        visited = set()

    print(f"  访问 {start}")
    visited.add(start)

    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)


print("\n--- DFS 遍历（从 A 开始）---")
dfs(graph, 'A')


# ============================================================================
# 4. BFS（广度优先搜索）
# ============================================================================

print("\n" + "=" * 60)
print("4. 广度优先搜索（BFS）")
print("=" * 60)

from collections import deque


def bfs(graph, start):
    """BFS 遍历"""
    visited = set([start])
    queue = deque([start])
    order = []

    print(f"  从 {start} 开始")

    while queue:
        vertex = queue.popleft()
        order.append(vertex)
        print(f"  访问 {vertex}，队列：{list(queue)}")

        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order


print("\n--- BFS 遍历（从 A 开始）---")
result = bfs(graph, 'A')
print(f"\n遍历顺序：A → {' → '.join(result[1:])}")


# ============================================================================
# 5. DFS vs BFS 对比
# ============================================================================

print("\n" + "=" * 60)
print("5. DFS vs BFS 对比")
print("=" * 60)

print("""
DFS（深度优先）：
- 用栈（递归调用栈）
- 一直往深处走，碰壁就回退
- 适合：找路径、拓扑排序、连通分量

BFS（广度优先）：
- 用队列
- 一层层往外扩展
- 适合：找最短路径、层级遍历
""")


# ============================================================================
# 6. BFS 找最短路径
# ============================================================================

print("=" * 60)
print("6. BFS 找最短路径")
print("=" * 60)


def shortest_path(graph, start, end):
    """BFS 找最短路径"""
    visited = set([start])
    queue = deque([(start, [start])])

    print(f"从 {start} 到 {end} 的最短路径：")

    while queue:
        vertex, path = queue.popleft()

        if vertex == end:
            print(f"  找到！路径：{' → '.join(path)}")
            return path

        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))

    print(f"  没有路径")
    return None


# 有向图
digraph = {
    'A': ['B', 'C'],
    'B': ['D'],
    'C': ['D', 'E'],
    'D': ['E'],
    'E': []
}

print("\n有向图：")
print("""
    A → B
    ↓   ↓
    C → D → E
""")

shortest_path(digraph, 'A', 'E')


# ============================================================================
# 7. 岛屿数量（DFS 面试题）
# ============================================================================

print("\n" + "=" * 60)
print("7. 面试题：岛屿数量")
print("=" * 60)


def num_islands(grid):
    """计算岛屿数量"""
    if not grid:
        return 0

    count = 0
    rows, cols = len(grid), len(grid[0])

    def dfs(r, c):
        """把相邻的陆地都标记为已访问"""
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
                print(f"发现岛屿，DFS 标记...")
                dfs(r, c)

    return count


grid = [
    ['1', '1', '0', '1'],
    ['1', '1', '0', '0'],
    ['0', '0', '1', '0'],
    ['0', '0', '0', '0']
]

print("\n网格：")
for row in grid:
    print(f"  {row}")

print(f"\n岛屿数量：{num_islands(grid)}")


# ============================================================================
# 8. 课程表（环检测）
# ============================================================================

print("\n" + "=" * 60)
print("8. 面试题：课程表（环检测）")
print("=" * 60)


def can_finish(num_courses, prerequisites):
    """判断是否能完成所有课程（检测有向图是否有环）"""
    from collections import deque

    graph = {i: [] for i in range(num_courses)}
    in_degree = [0] * num_courses

    for dest, src in prerequisites:
        graph[src].append(dest)
        in_degree[dest] += 1
        print(f"  课程 {src} 是 {dest} 的先修课")

    # 找到所有入度为 0 的课程（可以先学）
    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])
    count = 0

    while queue:
        course = queue.popleft()
        count += 1
        print(f"  学完课程 {course}")

        for neighbor in graph[course]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    result = count == num_courses
    print(f"\n能完成所有课程：{result}")
    return result


print("\n--- 课程表演示 ---")
print("课程 0, 1, 2，先修关系：0→1, 1→2")
can_finish(3, [(1, 0), (2, 1)])


# ============================================================================
# 9. 邻接矩阵
# ============================================================================

print("\n" + "=" * 60)
print("9. 邻接矩阵")
print("=" * 60)

print("""
上面的无向图用邻接矩阵表示：

       A  B  C  D
    A  0  1  1  0
    B  1  0  1  1
    C  1  1  0  1
    D  0  1  1  0
""")

vertices = ['A', 'B', 'C', 'D']
n = len(vertices)
matrix = [[0] * n for _ in range(n)]

# 构建邻接矩阵
for i, v in enumerate(vertices):
    for j, neighbor in enumerate(graph[v]):
        neighbor_idx = vertices.index(neighbor)
        matrix[i][neighbor_idx] = 1

print("邻接矩阵（Python 表示）：")
for i, row in enumerate(matrix):
    print(f"  {vertices[i]}: {row}")


# ============================================================================
# 主程序入口
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("程序执行完毕！")
    print("=" * 60)
    print("\n提示：")
    print("1. 图用邻接表（稀疏图）或邻接矩阵（稠密图）表示")
    print("2. DFS 用栈/递归，BFS 用队列")
    print("3. BFS 找最短路径，DFS 找所有路径")
    print("4. 环检测：记录入度，BFS 拓扑排序")
    print("5. 岛屿问题：DFS 淹掉相邻陆地")