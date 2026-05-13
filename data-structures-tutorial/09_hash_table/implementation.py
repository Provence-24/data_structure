"""
implementation.py
哈希表的 Python 实现
对应教材：09_hash_table
预计学习时长：1.5小时

本文件展示：
1. 哈希表的链地址法实现
2. 插入、查找、删除操作
3. 哈希冲突处理
4. 常见面试题

运行方式：在终端执行 python implementation.py
"""

# ============================================================================
# 1. 哈希表实现（链地址法）
# ============================================================================

print("=" * 60)
print("1. 哈希表实现（链地址法）")
print("=" * 60)


class HashTable:
    """简单的哈希表（链地址法处理冲突）"""

    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]  # 每个槽位是一个链表

    def hash_function(self, key):
        """哈希函数"""
        return hash(key) % self.size

    def insert(self, key, value):
        """插入或更新键值对"""
        index = self.hash_function(key)
        bucket = self.table[index]

        print(f"插入 '{key}'：哈希值 = hash('{key}') % {self.size} = {index}")

        # 检查是否已存在 key
        for i, (k, v) in enumerate(bucket):
            if k == key:
                print(f"  → 更新已存在的 key '{key}' 的值")
                bucket[i] = (key, value)
                return

        bucket.append((key, value))
        print(f"  → 新增到槽位 {index} 的链表末尾")

    def get(self, key):
        """获取值"""
        index = self.hash_function(key)
        bucket = self.table[index]

        print(f"查找 '{key}'：哈希值 = {index}")

        for k, v in bucket:
            if k == key:
                print(f"  → 找到：{v}")
                return v

        print(f"  → 未找到")
        return None

    def delete(self, key):
        """删除键值对"""
        index = self.hash_function(key)
        bucket = self.table[index]

        print(f"删除 '{key}'：哈希值 = {index}")

        for i, (k, v) in enumerate(bucket):
            if k == key:
                del bucket[i]
                print(f"  → 删除成功")
                return True

        print(f"  → key 不存在")
        return False

    def display(self):
        """显示哈希表内容"""
        for i, bucket in enumerate(self.table):
            if bucket:
                print(f"  槽位 {i}: {bucket}")
            else:
                print(f"  槽位 {i}: 空")


# ============================================================================
# 2. 基本操作演示
# ============================================================================

print("\n" + "=" * 60)
print("2. 基本操作演示")
print("=" * 60)

ht = HashTable(size=5)

print("\n--- 插入操作 ---")
ht.insert("apple", 10)
ht.insert("banana", 20)
ht.insert("cherry", 30)
ht.insert("date", 40)

print("\n--- 查找操作 ---")
ht.get("banana")
ht.get("grape")

print("\n--- 显示哈希表 ---")
ht.display()


# ============================================================================
# 3. 哈希冲突演示
# ============================================================================

print("\n" + "=" * 60)
print("3. 哈希冲突演示")
print("=" * 60)

print("\n使用 size=5，不同字符串可能哈希到同一槽位：")
ht2 = HashTable(size=5)

# 这些字符串的哈希值可能相同或产生冲突
strings = ["apple", "apply", "banana", "orange", "grape"]
for s in strings:
    index = ht2.hash_function(s)
    print(f"  hash('{s}') % 5 = {index}")


# ============================================================================
# 4. 更新已有 key
# ============================================================================

print("\n" + "=" * 60)
print("4. 更新已有 key")
print("=" * 60)

print("\n--- 更新 apple 的值 ---")
ht.insert("apple", 100)

print("\n--- 再次显示哈希表 ---")
ht.display()


# ============================================================================
# 5. 删除操作
# ============================================================================

print("\n" + "=" * 60)
print("5. 删除操作")
print("=" * 60)

print("\n--- 删除 banana ---")
ht.delete("banana")

print("\n--- 删除不存在的 key ---")
ht.delete("grape")

print("\n--- 显示哈希表 ---")
ht.display()


# ============================================================================
# 6. 面试题：两数之和
# ============================================================================

print("\n" + "=" * 60)
print("6. 面试题：两数之和")
print("=" * 60)


def two_sum(nums, target):
    """找出两数之和为目标值的两个数的索引"""
    hash_map = {}

    for i, num in enumerate(nums):
        complement = target - num
        if complement in hash_map:
            print(f"找到！{complement} + {num} = {target}")
            print(f"  {complement} 的索引：{hash_map[complement]}，{num} 的索引：{i}")
            return [hash_map[complement], i]
        hash_map[num] = i
        print(f"  遍历 {num}，记录 hash_map[{num}] = {i}")

    return []


print("\n--- 两数之和演示 ---")
nums = [2, 7, 11, 15]
target = 9
print(f"数组：{nums}，目标：{target}")
result = two_sum(nums, target)
print(f"结果：{result}")


# ============================================================================
# 7. 面试题：字符串第一个不重复的字符
# ============================================================================

print("\n" + "=" * 60)
print("7. 面试题：第一个不重复字符")
print("=" * 60)


def first_unique(s):
    """找出第一个不重复的字符"""
    char_count = {}

    # 统计每个字符出现的次数
    for c in s:
        char_count[c] = char_count.get(c, 0) + 1
        print(f"  字符 '{c}'：计数 = {char_count[c]}")

    # 找第一个计数为 1 的字符
    for i, c in enumerate(s):
        if char_count[c] == 1:
            print(f"  第一个不重复字符：'{c}'（索引 {i}）")
            return i

    return -1


print("\n--- 第一个不重复字符演示 ---")
s = "abracadabra"
print(f"字符串：'{s}'")
result = first_unique(s)
print(f"结果索引：{result}")


# ============================================================================
# 8. 面试题：有效的括号
# ============================================================================

print("\n" + "=" * 60)
print("8. 面试题：有效的括号")
print("=" * 60)


def is_valid(s):
    """判断括号是否有效"""
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}

    for char in s:
        if char in '([{':
            stack.append(char)
            print(f"  读到 '{char}'，入栈：{stack}")
        else:
            if not stack:
                print(f"  读到 '{char}'，栈为空，失败")
                return False
            top = stack.pop()
            if top != pairs[char]:
                print(f"  读到 '{char}'，栈顶 '{top}' 不匹配，失败")
                return False
            print(f"  读到 '{char}'，栈顶 '{top}' 匹配，出栈：{stack}")

    result = len(stack) == 0
    print(f"  最终栈：{stack}，结果：{result}")
    return result


print("\n--- 有效括号演示 ---")
test_cases = ["()", "()[]{}", "(]", "([)]", "{[]}"]
for s in test_cases:
    print(f"\n'{s}'：", end="")
    print(is_valid(s))


# ============================================================================
# 9. Python dict 就是哈希表
# ============================================================================

print("\n" + "=" * 60)
print("9. Python dict 就是哈希表")
print("=" * 60)

print("""
Python 的 dict 就是用哈希表实现的！

所以：
- d['key'] = value  → O(1)
- d['key']          → O(1)
- del d['key']      → O(1)

平均时间复杂度都是 O(1)！
""")

d = {"apple": 10, "banana": 20}
print(f"dict: {d}")
print(f"d['apple'] = {d['apple']}")


# ============================================================================
# 主程序入口
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("程序执行完毕！")
    print("=" * 60)
    print("\n提示：")
    print("1. 哈希函数把任意长度的输入转为固定长度的输出")
    print("2. 哈希冲突：不同输入可能得到相同输出")
    print("3. 链地址法：用链表存储同一槽位的多个元素")
    print("4. 哈希表平均 O(1) 查找，最坏 O(n)（全冲突）")
    print("5. Python dict 就是哈希表")