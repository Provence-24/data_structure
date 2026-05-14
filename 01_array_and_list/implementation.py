"""
implementation.py
数组与顺序表的 Python 实现
对应教材：01_array_and_list
预计学习时长：1小时

本文件包含：
1. 顺序表（基于数组）- ArrayList 类

运行方式：在终端执行 python implementation.py
"""

# ============================================================================
# 0. 辅助函数
# ============================================================================

def print_separator(title):
    print("\n" + "=" * 50)
    print(title)
    print("=" * 50)


# ============================================================================
# 1. 顺序表（ArrayList）- 用数组实现的线性表
# ============================================================================

print_separator("1. 顺序表（ArrayList）")

class ArrayList:
    """
    顺序表类 - 用固定大小的数组实现线性表

    属性:
        capacity: 数组容量（最大能存多少元素）
        size: 当前元素个数
        data: 存储元素的数组

    时间复杂度:
        按索引访问: O(1)
        在尾部插入: O(1)（数组有空位时）
        在中间插入: O(n)
        查找: O(n)
    """

    def __init__(self, capacity=10):
        """
        构造函数
        参数:
            capacity: 初始容量，默认为 10
        """
        self.capacity = capacity
        self.size = 0
        self.data = [None] * capacity  # 预分配固定大小的数组

    def __str__(self):
        """
        打印顺序表内容
        """
        elements = [str(self.data[i]) for i in range(self.size)]
        result = "ArrayList: [" + ", ".join(elements) + "]"
        result += f" (size={self.size}, capacity={self.capacity})"
        return result

    def is_empty(self):
        """判断是否为空"""
        return self.size == 0

    def is_full(self):
        """判断是否已满"""
        return self.size == self.capacity

    def get(self, index):
        """
        获取指定位置的元素
        参数:
            index: 索引（从 0 开始）
        返回:
            该位置的元素
        """
        if index < 0 or index >= self.size:
            raise IndexError(f"索引 {index} 超出范围 (size={self.size})")
        return self.data[index]

    def set(self, index, value):
        """
        修改指定位置的元素
        参数:
            index: 索引
            value: 新值
        """
        if index < 0 or index >= self.size:
            raise IndexError(f"索引 {index} 超出范围 (size={self.size})")
        self.data[index] = value

    def insert(self, index, value):
        """
        在指定位置插入元素
        参数:
            index: 插入位置（0 表示头部，size 表示尾部）
            value: 要插入的值
        时间复杂度: O(n)
        """
        if index < 0 or index > self.size:
            raise IndexError(f"索引 {index} 超出范围 (size={self.size})")
        if self.is_full():
            raise OverflowError("顺序表已满，无法插入")

        # 从后往前移动元素，空出插入位置
        for i in range(self.size, index, -1):
            self.data[i] = self.data[i - 1]
            print(f"  移动元素: data[{i}] = data[{i-1}]")

        self.data[index] = value
        self.size += 1

    def append(self, value):
        """
        在尾部添加元素
        时间复杂度: O(1)（数组有空位时）
        """
        if self.is_full():
            raise OverflowError("顺序表已满，无法添加")
        self.data[self.size] = value
        self.size += 1

    def delete(self, index):
        """
        删除指定位置的元素
        参数:
            index: 要删除的索引
        返回:
            被删除的元素
        时间复杂度: O(n)
        """
        if index < 0 or index >= self.size:
            raise IndexError(f"索引 {index} 超出范围 (size={self.size})")

        deleted_value = self.data[index]

        # 从前往后移动元素，填补删除位置
        for i in range(index, self.size - 1):
            self.data[i] = self.data[i + 1]
            print(f"  移动元素: data[{i}] = data[{i+1}]")

        self.data[self.size - 1] = None  # 清除尾部引用
        self.size -= 1

        return deleted_value

    def find(self, value):
        """
        查找元素，返回第一个匹配的索引
        参数:
            value: 要查找的值
        返回:
            索引，如果没找到返回 -1
        时间复杂度: O(n)
        """
        for i in range(self.size):
            if self.data[i] == value:
                return i
        return -1


# 演示 ArrayList 基本操作
print("\n--- 创建顺序表 ---")
arr_list = ArrayList(capacity=5)
print(arr_list)

print("\n--- 尾部插入 10, 20, 30 ---")
arr_list.append(10)
arr_list.append(20)
arr_list.append(30)
print(arr_list)

print("\n--- 在位置 1 插入 15 ---")
arr_list.insert(1, 15)
print(arr_list)

print("\n--- 访问位置 2 ---")
print(f"arr_list.get(2) = {arr_list.get(2)}")
print(arr_list)

print("\n--- 删除位置 1 ---")
deleted = arr_list.delete(1)
print(f"删除了 {deleted}")
print(arr_list)


# ============================================================================
# 主程序入口
# ============================================================================

if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("程序执行完毕！")
    print("=" * 50)
    print("\n提示：")
    print("1. 仔细观察每次操作后 __str__ 打印的内容")
    print("2. 试着修改代码，改变插入/删除的顺序")
    print("3. 打开 visualization.html 观看交互演示")
