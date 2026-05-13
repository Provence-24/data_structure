"""
implementation.py
二叉搜索树的 Python 实现
对应教材：07_binary_search_tree
预计学习时长：2小时

本文件展示：
1. BST 的节点定义
2. BST 的插入、查找、删除
3. 中序遍历得到有序序列
4. 常见面试题

运行方式：在终端执行 python implementation.py
"""

# ============================================================================
# 1. 二叉搜索树节点定义
# ============================================================================

print("=" * 60)
print("1. 二叉搜索树节点定义")
print("=" * 60)


class TreeNode:
    """BST 节点"""
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


print("""
BST 节点包含：
- value: 节点的值
- left: 指向左子节点的指针（左子树所有值 < 当前节点）
- right: 指向右子节点的指针（右子树所有值 > 当前节点）
""")


# ============================================================================
# 2. 构建 BST
# ============================================================================

print("\n" + "=" * 60)
print("2. 构建二叉搜索树")
print("=" * 60)

#       8
#      / \
#     3   10
#    / \    \
#   1   6    14
#      / \   /
#     4   7 13

root = TreeNode(8)
root.left = TreeNode(3)
root.right = TreeNode(10)
root.left.left = TreeNode(1)
root.left.right = TreeNode(6)
root.right.right = TreeNode(14)
root.left.right.left = TreeNode(4)
root.left.right.right = TreeNode(7)
root.right.left = TreeNode(13)

print("""
构建的 BST：

            8
           / \\
          3   10
         / \\    \\
        1   6    14
           / \\   /
          4   7 13

特点：左子树 < 根 < 右子树
""")


# ============================================================================
# 3. 查找
# ============================================================================

print("=" * 60)
print("3. 查找")
print("=" * 60)


def search(root, target):
    """查找 target 是否在 BST 中"""
    if root is None:
        return False

    print(f"  查找 {target}，当前节点：{root.value}")

    if target == root.value:
        print(f"  → 找到 {target}！")
        return True
    elif target < root.value:
        print(f"  → {target} < {root.value}，往左走")
        return search(root.left, target)
    else:
        print(f"  → {target} > {root.value}，往右走")
        return search(root.right, target)


print("\n--- 查找演示 ---")
print("查找 7：")
found = search(root, 7)
print(f"结果：{found}\n")

print("查找 9：")
found = search(root, 9)
print(f"结果：{found}")


# ============================================================================
# 4. 插入
# ============================================================================

print("\n" + "=" * 60)
print("4. 插入")
print("=" * 60)


def insert(root, value):
    """插入新节点"""
    if root is None:
        return TreeNode(value)

    if value < root.value:
        print(f"  {value} < {root.value}，插入到左子树")
        root.left = insert(root.left, value)
    else:
        print(f"  {value} > {root.value}，插入到右子树")
        root.right = insert(root.right, value)

    return root


print("\n--- 插入演示 ---")
print("插入 9：")
root = insert(root, 9)
print()


# ============================================================================
# 5. 中序遍历（得到有序序列）
# ============================================================================

print("=" * 60)
print("5. 中序遍历（升序）")
print("=" * 60)


def inorder(root):
    """中序遍历 BST → 得到升序序列"""
    if root is None:
        return
    inorder(root.left)
    print(root.value, end=" ")
    inorder(root.right)


print("\n--- 中序遍历结果 ---")
inorder(root)
print("\n（验证：9 已正确插入）")


# ============================================================================
# 6. 查找最小/最大值
# ============================================================================

print("\n" + "=" * 60)
print("6. 查找最小/最大值")
print("=" * 60)


def find_min(node):
    """查找最小值节点（最左叶子）"""
    while node.left:
        node = node.left
    return node


def find_max(node):
    """查找最大值节点（最右叶子）"""
    while node.right:
        node = node.right
    return node


print("\n--- 查找最值 ---")
min_node = find_min(root)
max_node = find_max(root)
print(f"最小值：{min_node.value}")
print(f"最大值：{max_node.value}")


# ============================================================================
# 7. 删除操作
# ============================================================================

print("\n" + "=" * 60)
print("7. 删除操作")
print("=" * 60)


def delete(root, value):
    """删除值为 value 的节点"""
    if root is None:
        return None

    if value < root.value:
        print(f"  {value} < {root.value}，在左子树删除")
        root.left = delete(root.left, value)
    elif value > root.value:
        print(f"  {value} > {root.value}，在右子树删除")
        root.right = delete(root.right, value)
    else:
        # 找到要删除的节点
        print(f"  找到要删除的节点：{value}")

        # 情况 1：叶子节点
        if root.left is None and root.right is None:
            print(f"  → 叶子节点，直接删除")
            return None

        # 情况 2：只有一个子节点
        if root.left is None:
            print(f"  → 只有右子树，用右子树替代")
            return root.right
        if root.right is None:
            print(f"  → 只有左子树，用左子树替代")
            return root.left

        # 情况 3：有两个子节点
        print(f"  → 有两个子节点，用后继节点替代")
        successor = find_min(root.right)
        root.value = successor.value
        root.right = delete(root.right, successor.value)

    return root


print("\n--- 删除叶子节点 13 ---")
root = delete(root, 13)
print("中序遍历：", end="")
inorder(root)
print()

print("\n--- 删除有一个子树的节点 10 ---")
root = delete(root, 10)
print("中序遍历：", end="")
inorder(root)
print()


# ============================================================================
# 8. 判断是否是 BST
# ============================================================================

print("\n" + "=" * 60)
print("8. 判断是否是有效的 BST")
print("=" * 60)


def is_valid_bst(root, min_val=float('-inf'), max_val=float('inf')):
    """判断是否是有效的 BST"""
    if root is None:
        return True

    if root.value <= min_val or root.value >= max_val:
        return False

    return (is_valid_bst(root.left, min_val, root.value) and
            is_valid_bst(root.right, root.value, max_val))


print("\n--- 验证 BST ---")
print(f"当前树是否是有效 BST：{is_valid_bst(root)}")


# ============================================================================
# 9. 面试题：两数之和（ BST 版）
# ============================================================================

print("\n" + "=" * 60)
print("9. 面试题：在 BST 中找两数之和")
print("=" * 60)


def find_target(root, k):
    """在 BST 中查找是否存在两数之和为 k"""
    seen = set()

    def dfs(node):
        if node is None:
            return False

        complement = k - node.value
        if complement in seen:
            return True
        seen.add(node.value)

        return dfs(node.left) or dfs(node.right)

    return dfs(root)


print("\n--- 两数之和演示 ---")
print("BST 中是否存在两数之和为 10：", end="")
print(find_target(root, 10))  # 如 3 + 7 = 10


# ============================================================================
# 10. 面试题：第 K 小的元素
# ============================================================================

print("\n" + "=" * 60)
print("10. 面试题：第 K 小的元素")
print("=" * 60)


def kth_smallest(root, k):
    """找第 K 小的元素（中序遍历）"""
    result = []

    def inorder(node):
        if node is None or len(result) >= k:
            return
        inorder(node.left)
        if len(result) < k:
            result.append(node.value)
        inorder(node.right)

    inorder(root)
    return result[k - 1] if len(result) >= k else None


print("\n--- 第 K 小元素演示 ---")
for i in range(1, 5):
    val = kth_smallest(root, i)
    print(f"第 {i} 小的元素：{val}")


# ============================================================================
# 主程序入口
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("程序执行完毕！")
    print("=" * 60)
    print("\n提示：")
    print("1. BST 左子树 < 根 < 右子树")
    print("2. 查找/插入：O(log n) 平均，O(n) 最坏（退化成链表）")
    print("3. 删除有三种情况：叶子、单子、双子")
    print("4. 中序遍历 BST 得到升序序列")