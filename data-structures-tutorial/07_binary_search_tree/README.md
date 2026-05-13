# 二叉搜索树（Binary Search Tree）

> 本章目标：理解 BST 的性质、插入和查找，了解删除操作的三种情况

## 生活化类比

**BST 就像字典**：
- 每个单词都按字母顺序排列
- 找"dog"这个词，先看中间，如果在前面就往左找，如果在后面就往右找
- 每一步都能排除一半的候选词

**BST 查找就像猜数字游戏**：
- 范围 1-100，猜 50
- 太大了？往小的猜（左边）
- 太小了？往大的猜（右边）
- 每次都排除一半

## 核心概念

### 1. BST 的性质

**左子树**的所有节点都**小于**根节点
**右子树**的所有节点都**大于**根节点
左右子树本身也是 BST

```
        8
       / \
      3   10
     / \    \
    1   6    14
       / \   /
      4   7 13
```

查找 7：
- 8 > 7 → 往左走
- 3 < 7 → 往右走
- 6 < 7 → 往右走
- 找到 7！

### 2. BST 的特点

- **查找效率高**：每次排除一半，平均 O(log n)
- **有序**：中序遍历得到排序结果
- **插入**：按查找逻辑，找到空位插入
- **删除**：三种情况（后文详述）

### 3. 时间复杂度

| 操作 | 平均 | 最坏 |
|------|------|------|
| 查找 | O(log n) | O(n) |
| 插入 | O(log n) | O(n) |
| 删除 | O(log n) | O(n) |

**最坏情况**：树退化成链表（数据已有序时插入）

## BST 的 Python 实现

### 节点定义

```python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
```

### 查找

```python
def search(root, target):
    """查找 target 是否在树中"""
    if root is None:
        return False

    if target == root.value:
        return True
    elif target < root.value:
        return search(root.left, target)
    else:
        return search(root.right, target)
```

### 插入

```python
def insert(root, value):
    """插入新节点"""
    if root is None:
        return TreeNode(value)

    if value < root.value:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)

    return root
```

### 中序遍历（得到有序序列）

```python
def inorder(root):
    """中序遍历 BST → 得到升序序列"""
    if root is None:
        return
    inorder(root.left)
    print(root.value, end=" ")
    inorder(root.right)
```

## 删除操作的三种情况

### 情况 1：删除叶子节点

直接删除，无需调整：

```
删除 4：
        8              8
       / \            / \
      3   10    →   3   10
     / \    \       / \    \
    1   6    14    1   6    14
       / \             / \
      4   7           7
```

### 情况 2：删除有一个子树的节点

用子树替代：

```
删除 3：
        8              8
       / \            / \
      3   10    →    1   10
     /              \
    1                ...
```

### 情况 3：删除有两个子树的节点

用后继节点替换（或者前驱）：

```
后继：右子树中最小的节点

删除 8：
        8              10
       / \            / \
      3   10    →   3    14
         /  \           /
        9    14       9
```

## 常见面试题

### 1. 判断是否是 BST

```python
def is_valid_bst(root, min_val=float('-inf'), max_val=float('inf')):
    """判断是否是有效的 BST"""
    if root is None:
        return True

    if root.value <= min_val or root.value >= max_val:
        return False

    return (is_valid_bst(root.left, min_val, root.value) and
            is_valid_bst(root.right, root.value, max_val))
```

### 2. 查找第 K 小的元素

```python
def kth_smallest(root, k):
    """中序遍历第 k 个节点"""
    result = []

    def inorder(node):
        if node is None or len(result) >= k:
            return
        inorder(node.left)
        result.append(node.value)
        inorder(node.right)

    inorder(root)
    return result[k - 1] if len(result) >= k else None
```

### 3. 二叉树的最近公共祖先

```python
def lowest_common_ancestor(root, p, q):
    """LCA：两个节点的最近公共祖先"""
    if root is None:
        return None

    if p.value < root.value and q.value < root.value:
        return lowest_common_ancestor(root.left, p, q)

    if p.value > root.value and q.value > root.value:
        return lowest_common_ancestor(root.right, p, q)

    return root  # p 和 q 在不同子树，或者其中一个是 root
```

## 常见考点和易错点

### 易错点 1：BST 的定义

左子树所有节点 < 根节点 < 右子树所有节点，不是"左孩子小于根，右孩子大于根"这么简单。

### 易错点 2：删除操作的三种情况

画图理解：
1. 叶子节点 → 直接删
2. 只有一个孩子 → 用孩子替代
3. 有两个孩子 → 用后继（或前驱）替代

### 易错点 3：最坏情况

当插入的数据已经有序时（1, 2, 3, 4, 5...），BST 会退化成链表，查找变成 O(n)。

## 学习检查清单

完成本章后，你应该能回答：
- [ ] BST 的定义是什么？左右子树分别满足什么条件？
- [ ] 如何在 BST 中查找一个值？
- [ ] 如何在 BST 中插入一个新节点？
- [ ] 删除节点的三种情况分别是什么？
- [ ] 什么是 BST 的后继节点？
- [ ] 什么情况下 BST 会退化成链表？

## 如何使用本章

```
1. 读 README.md（本文档）→ 理解 BST 的概念
2. 打开 implementation.py → 运行，看打印输出
3. 打开 visualization.html → 交互演示，边点边学
```