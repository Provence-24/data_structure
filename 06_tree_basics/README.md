# 树基础（Tree Basics）

> 本章目标：理解树的概念、术语，掌握二叉树的表示和三种遍历方式

## 生活化类比

**公司组织架构图**：
```
                    CEO（根节点）
                   /      \
            CTO           CFO（父节点）
           /    \           |
      工程师   产品       会计（叶子节点）
    （子节点）  （子节点）
```

- 最顶层是**根节点**（CEO）
- 每个节点可能有**子节点**（下属）
- 没有子节点的叫**叶子节点**
- 中间的叫**内部节点**
- CEO 下面是**子树**

**文件夹目录结构**也是树：
- 每个文件夹是节点
- 里面的文件是叶子
- 层层嵌套形成树形结构

## 核心概念

### 1. 树的定义

树是由**节点**组成的层次结构：
- 每个树有一个**根节点**（最顶端）
- 每个节点可能有零个或多个**子节点**
- 没有子节点的节点叫**叶子节点**

```
        A（根）
       /|\
      B C D
     /|   |
    E F   G（叶子）
```

### 2. 树的基本术语

| 术语 | 解释 | 示例 |
|------|------|------|
| 根节点（Root） | 树的最顶层节点，没有父节点 | A |
| 父节点（Parent） | 有子节点的节点 | A 是 B、C、D 的父节点 |
| 子节点（Child） | 父节点下面的节点 | B、C、D 是 A 的子节点 |
| 叶子节点（Leaf） | 没有子节点的节点 | E、F、G |
| 兄弟节点（Sibling） | 同一父节点的子节点 | B 和 C 是兄弟 |
| 深度（Depth） | 从根到该节点的路径长度 | E 的深度是 2 |
| 高度（Height） | 从该节点到最深叶子节点的路径长度 | A 的高度是 2 |
| 层级（Level） | 根节点为 Level 1 | A 在 Level 1，B 在 Level 2 |
| 度（Degree） | 一个节点的子节点数量 | A 的度是 3 |

### 3. 二叉树（Binary Tree）

每个节点最多只有**两个子节点**的树：

```
           1（根）
          /    \
         2      3
        / \    /
       4   5  6
```

**二叉树的特点**：
- 每个节点最多有两个子节点
- 分为左子节点和右子节点
- 高度为 h 的二叉树，最多有 2^h - 1 个节点

### 4. 满二叉树 vs 完全二叉树

**满二叉树（Full Binary Tree）**：
- 所有叶子节点都在同一层
- 所有节点都有两个子节点
```
        1
       / \
      2   3
     / \ / \
    4  5 6  7
```

**完全二叉树（Complete Binary Tree）**：
- 除了最后一层，其他层都是满的
- 最后一层的节点从左到右排列
```
        1
       / \
      2   3
     / \ /
    4  5 6
```

## 二叉树的表示

### 节点结构

```python
class TreeNode:
    """二叉树节点"""
    def __init__(self, value):
        self.value = value      # 节点的值
        self.left = None       # 左子节点
        self.right = None      # 右子节点
```

### 构建一颗二叉树

```python
#       1
#      / \
#     2   3
#    / \
#   4   5

root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)
```

## 二叉树的遍历

遍历是树的核心操作，分为三种：

### 1. 前序遍历（Preorder）

**顺序**：根 → 左 → 右

```
遍历结果：1 → 2 → 4 → 5 → 3 → 6
```

```python
def preorder(node):
    if node is None:
        return
    print(node.value)    # 根
    preorder(node.left)  # 左
    preorder(node.right) # 右
```

### 2. 中序遍历（Inorder）

**顺序**：左 → 根 → 右

```
遍历结果：4 → 2 → 5 → 1 → 3 → 6
```

```python
def inorder(node):
    if node is None:
        return
    inorder(node.left)   # 左
    print(node.value)    # 根
    inorder(node.right)  # 右
```

### 3. 后序遍历（Postorder）

**顺序**：左 → 右 → 根

```
遍历结果：4 → 5 → 2 → 6 → 3 → 1
```

```python
def postorder(node):
    if node is None:
        return
    postorder(node.left)  # 左
    postorder(node.right) # 右
    print(node.value)     # 根
```

## 遍历的口诀

| 遍历方式 | 口诀 | 应用场景 |
|----------|------|----------|
| 前序 | 根左右 | 创建/复制树、输出树结构 |
| 中序 | 左根右 | BST 排序输出、二叉树可视化 |
| 后序 | 左右根 | 删除树、计算目录大小 |

## 树的深度和高度

```python
def tree_depth(node):
    """计算树的深度（从根到最深叶子"""
    if node is None:
        return 0
    left_depth = tree_depth(node.left)
    right_depth = tree_depth(node.right)
    return max(left_depth, right_depth) + 1

def tree_height(node):
    """计算树的高度（与深度相同）"""
    return tree_depth(node)  # 在二叉树中，深度和高度是相关的概念
```

## 常见面试题

### 1. 计算二叉树节点数

```python
def count_nodes(node):
    if node is None:
        return 0
    return 1 + count_nodes(node.left) + count_nodes(node.right)
```

### 2. 判断两棵树是否相同

```python
def is_same_tree(p, q):
    if p is None and q is None:
        return True
    if p is None or q is None:
        return False
    return (p.value == q.value and
            is_same_tree(p.left, q.left) and
            is_same_tree(p.right, q.right))
```

### 3. 二叉树的最大深度

```python
def max_depth(node):
    if node is None:
        return 0
    left_depth = max_depth(node.left)
    right_depth = max_depth(node.right)
    return max(left_depth, right_depth) + 1
```

## 常见考点和易错点

### 易错点 1：遍历顺序混淆

前序、中序、后序的口诀要记牢：

```
前序（Preorder）：根 → 左 → 右
中序（Inorder）：左 → 根 → 右
后序（Postorder）：左 → 右 → 根
```

### 易错点 2：递归终止条件

树为空时（node is None）要直接返回，不能访问 node.value。

```python
def traverse(node):
    if node is None:  # 一定要有这个！
        return
    # ...处理 node
```

### 易错点 3：深度 vs 高度

- **深度**：从根到该节点的边数
- **高度**：从该节点到最深叶子的边数

根节点的深度是 0，高度是树的高度。

## 学习检查清单

完成本章后，你应该能回答：
- [ ] 什么是根节点、叶子节点、父节点、子节点？
- [ ] 什么是二叉树？二叉树有什么特点？
- [ ] 前序、中序、后序遍历的顺序是什么？
- [ ] 如何用代码实现二叉树的三种遍历？
- [ ] 如何计算二叉树的深度/高度？
- [ ] 什么是满二叉树和完全二叉树？

## 如何使用本章

```
1. 读 README.md（本文档）→ 理解树的概念和遍历方式
2. 打开 implementation.py → 运行，看打印输出，理解遍历过程
3. 打开 visualization.html → 交互演示，边点边学
```