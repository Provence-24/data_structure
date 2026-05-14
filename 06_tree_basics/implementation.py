"""
implementation.py
树基础的 Python 实现
对应教材：06_tree_basics
预计学习时长：1.5小时

本文件展示：
1. 二叉树的节点表示
2. 二叉树的三种遍历方式（前序、中序、后序）
3. 二叉树的深度计算
4. 常见面试题

运行方式：在终端执行 python implementation.py
"""

# ============================================================================
# 1. 二叉树节点定义
# ============================================================================

print("=" * 60)
print("1. 二叉树节点定义")
print("=" * 60)

class TreeNode:
    """二叉树节点"""

    def __init__(self, value):
        self.value = value
        self.left = None   # 左子节点
        self.right = None  # 右子节点

    def __str__(self):
        return str(self.value)


print("""
二叉树节点包含三部分：
- value: 节点的值
- left: 指向左子节点的指针
- right: 指向右子节点的指针
""")


# ============================================================================
# 2. 构建二叉树
# ============================================================================

print("\n" + "=" * 60)
print("2. 构建二叉树")
print("=" * 60)

# 构建一颗示例树：
#        1
#       / \
#      2   3
#     / \   \
#    4   5   6

root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)
root.right.right = TreeNode(6)

print("""
构建的树结构：
        1
       / \\
      2   3
     / \\   \\
    4   5   6
""")


# ============================================================================
# 3. 前序遍历（Preorder）：根 → 左 → 右
# ============================================================================

print("=" * 60)
print("3. 前序遍历（Preorder）")
print("=" * 60)

def preorder(node):
    """
    前序遍历：根 → 左 → 右
    """
    if node is None:
        return

    print(node.value, end=" ")
    preorder(node.left)
    preorder(node.right)


print("\n--- 前序遍历结果 ---")
print("遍历顺序：根 → 左 → 右")
preorder(root)
print("\n预期结果：1 2 4 5 3 6")


# ============================================================================
# 4. 中序遍历（Inorder）：左 → 根 → 右
# ============================================================================

print("\n" + "=" * 60)
print("4. 中序遍历（Inorder）")
print("=" * 60)

def inorder(node):
    """
    中序遍历：左 → 根 → 右
    """
    if node is None:
        return

    inorder(node.left)
    print(node.value, end=" ")
    inorder(node.right)


print("\n--- 中序遍历结果 ---")
print("遍历顺序：左 → 根 → 右")
inorder(root)
print("\n预期结果：4 2 5 1 3 6")


# ============================================================================
# 5. 后序遍历（Postorder）：左 → 右 → 根
# ============================================================================

print("\n" + "=" * 60)
print("5. 后序遍历（Postorder）")
print("=" * 60)

def postorder(node):
    """
    后序遍历：左 → 右 → 根
    """
    if node is None:
        return

    postorder(node.left)
    postorder(node.right)
    print(node.value, end=" ")


print("\n--- 后序遍历结果 ---")
print("遍历顺序：左 → 右 → 根")
postorder(root)
print("\n预期结果：4 5 2 6 3 1")


# ============================================================================
# 6. 遍历的非递归版本（使用栈）
# ============================================================================

print("\n" + "=" * 60)
print("6. 前序遍历（非递归版）")
print("=" * 60)

def preorder_iterative(node):
    """
    前序遍历的非递归实现
    使用栈来模拟递归调用
    """
    if node is None:
        return

    stack = [node]
    result = []

    while stack:
        current = stack.pop()
        result.append(current.value)

        # 先压右子节点，再压左子节点（这样左子节点先出栈）
        if current.right:
            stack.append(current.right)
        if current.left:
            stack.append(current.left)

    return result


print("\n--- 非递归前序遍历 ---")
result = preorder_iterative(root)
print(f"结果：{' '.join(map(str, result))}")


# ============================================================================
# 7. 计算二叉树的深度
# ============================================================================

print("\n" + "=" * 60)
print("7. 计算二叉树的深度")
print("=" * 60)

def tree_depth(node):
    """
    计算二叉树的深度
    深度 = 从根到最深节点的边数
    """
    if node is None:
        return 0

    left_depth = tree_depth(node.left)
    right_depth = tree_depth(node.right)

    return max(left_depth, right_depth) + 1


print("\n--- 计算树的深度 ---")
depth = tree_depth(root)
print(f"树的深度：{depth}（有 {depth} 层节点）")


# ============================================================================
# 8. 计算二叉树的节点数
# ============================================================================

print("\n" + "=" * 60)
print("8. 计算二叉树的节点数")
print("=" * 60)

def count_nodes(node):
    """
    计算二叉树的节点总数
    """
    if node is None:
        return 0

    return 1 + count_nodes(node.left) + count_nodes(node.right)


print("\n--- 计算节点数 ---")
count = count_nodes(root)
print(f"节点总数：{count}")


# ============================================================================
# 9. 计算叶子节点数
# ============================================================================

print("\n" + "=" * 60)
print("9. 计算叶子节点数")
print("=" * 60)

def count_leaves(node):
    """
    计算叶子节点的数量
    叶子节点：没有左右子节点的节点
    """
    if node is None:
        return 0

    if node.left is None and node.right is None:
        return 1

    return count_leaves(node.left) + count_leaves(node.right)


print("\n--- 计算叶子节点数 ---")
leaves = count_leaves(root)
print(f"叶子节点数：{leaves}（节点 4、5、6 是叶子）")


# ============================================================================
# 10. 经典面试题：判断两棵树是否相同
# ============================================================================

print("\n" + "=" * 60)
print("10. 判断两棵树是否相同")
print("=" * 60)

def is_same_tree(p, q):
    """
    判断两棵二叉树是否完全相同
    """
    if p is None and q is None:
        return True

    if p is None or q is None:
        return False

    return (p.value == q.value and
            is_same_tree(p.left, q.left) and
            is_same_tree(p.right, q.right))


# 构建第二棵树（与第一棵相同）
root2 = TreeNode(1)
root2.left = TreeNode(2)
root2.right = TreeNode(3)
root2.left.left = TreeNode(4)
root2.left.right = TreeNode(5)
root2.right.right = TreeNode(6)

# 构建第三棵树（与第一棵不同）
root3 = TreeNode(1)
root3.left = TreeNode(2)
root3.right = TreeNode(3)
root3.left.left = TreeNode(4)
root3.left.right = TreeNode(5)
root3.right.left = TreeNode(6)  # 不同：这里是 6

print("\n--- 判断树是否相同 ---")
print(f"tree1 vs tree2（相同结构）：{is_same_tree(root, root2)}")
print(f"tree1 vs tree3（不同结构）：{is_same_tree(root, root3)}")


# ============================================================================
# 11. 经典面试题：二叉树的最大深度
# ============================================================================

print("\n" + "=" * 60)
print("11. 二叉树的最大深度")
print("=" * 60)

def max_depth(node):
    """
    计算二叉树的最大深度
    （与 tree_depth 完全相同）
    """
    if node is None:
        return 0

    left_depth = max_depth(node.left)
    right_depth = max_depth(node.right)

    return max(left_depth, right_depth) + 1


print("\n--- 计算最大深度 ---")
print(f"最大深度：{max_depth(root)}")


# ============================================================================
# 12. 层序遍历（广度优先）
# ============================================================================

print("\n" + "=" * 60)
print("12. 层序遍历（Level Order）")
print("=" * 60)

from collections import deque

def level_order(root):
    """
    层序遍历：按层次从上到下遍历
    使用队列实现
    """
    if root is None:
        return []

    result = []
    queue = deque([root])

    while queue:
        node = queue.popleft()
        result.append(node.value)

        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)

    return result


print("\n--- 层序遍历结果 ---")
result = level_order(root)
print(f"层序遍历：{' '.join(map(str, result))}")
print("说明：按层次输出，1是第一层，2 3是第二层...")


# ============================================================================
# 13. 遍历结果汇总
# ============================================================================

print("\n" + "=" * 60)
print("13. 遍历结果汇总")
print("=" * 60)

print("""
树结构：
        1
       / \\
      2   3
     / \\   \\
    4   5   6

遍历结果汇总：
┌─────────────┬───────────────┐
│ 前序遍历    │ 1 2 4 5 3 6   │
│ 中序遍历    │ 4 2 5 1 3 6   │
│ 后序遍历    │ 4 5 2 6 3 1   │
│ 层序遍历    │ 1 2 3 4 5 6   │
└─────────────┴───────────────┘
""")


# ============================================================================
# 主程序入口
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("程序执行完毕！")
    print("=" * 60)
    print("\n提示：")
    print("1. 前序遍历：根 → 左 → 右")
    print("2. 中序遍历：左 → 根 → 右")
    print("3. 后序遍历：左 → 右 → 根")
    print("4. 层序遍历：按层次从上到下")
    print("5. 打开 visualization.html 观看遍历过程的交互演示")