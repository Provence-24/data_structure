# 数据结构交互式可视化学习项目（claude code based）

> 专为计算机相关专业大二学生设计的步进式数据结构学习工具

## 这是什么？

一个**交互式数据结构教程**，让你"点一下，动一步"地学习每个数据结构的原理与实现。
- 不喜欢连续动画？这里每一步都由你驱动
- 不理解为什么这么做？每步都有详细解释
- 想回看上一步？随时可以后退

## 学习者特点

- 第一次系统学习数据结构
- Python 基础薄弱（能看懂语法，写起来不熟练）
- 视觉化 + 步进式学习者

## 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| 数据结构实现 | 纯 Python（类实现） | 对照教材学习，理解底层逻辑 |
| 可视化界面 | HTML + 原生 JavaScript + SVG | 交互式演示，边玩边学 |

**两者算法逻辑完全一致**，Python 端能独立运行并打印操作过程，HTML 端用于交互式理解。

## 目录结构

```
data-structures-tutorial/
├── README.md                     # 本文件
├── index.html                    # 主页：所有数据结构的入口
├── shared/
│   ├── style.css                 # 统一样式
│   └── utils.js                  # 通用工具：步骤管理、按钮组件等
├── 00_python_basics/             # Python 速成（零基础先看这里）
├── 01_array_and_list/            # 数组与顺序表
├── 02_linked_list/              # 链表
├── 03_stack/                    # 栈
├── 04_queue/                    # 队列
├── 05_recursion/                # 递归
├── 06_tree_basics/              # 树基础
├── 07_binary_search_tree/        # 二叉搜索树
├── 08_heap/                     # 堆（重点章节）
├── 09_hash_table/               # 哈希表
├── 10_graph/                    # 图
└── 11_sorting_algorithms/        # 排序算法
```

## 如何使用（推荐学习顺序）

### 1. 打开主页 index.html
进入入口页面，可以看到所有章节的导航卡片，了解整体学习路径。

### 2. 按顺序学习
```
00_python_basics  →  先搞定 Python 基础（如果还没看过）
01_array_and_list →  数组是最基础的结构
02_linked_list    →  链表是很多结构的基础
03_stack          →  栈（后进先出）
04_queue          →  队列（先进先出）
05_recursion      →  递归（重要编程思想）
06_tree_basics    →  树的基础概念
07_binary_search_tree → 二叉搜索树
08_heap           →  堆（⭐重点章节）
09_hash_table     →  哈希表
10_graph          →  图
11_sorting_algorithms → 排序算法
```

### 3. 每章学习方法
每章都有三部分，**按顺序使用**：
1. **README.md** — 读原理、类比、考点
2. **implementation.py** — 跑 Python 代码，看打印输出
3. **visualization.html** — 打开交互演示，边点边理解

## 核心设计原则

1. **步进式交互优先** — 每一步都由你点击驱动，绝无自动播放
2. **每步都有解释** — 当前做什么、为什么、下一步做什么
3. **可以后退** — "上一步"按钮随时可回看
4. **状态高亮** — 当前操作元素红色，刚操作过黄色，无关元素灰色
5. **数据和视图同步** — 树形图和数组表示联动高亮

## 环境要求

- 浏览器（推荐 Chrome/Firefox/Edge 最新版）
- Python 3.8+（用于运行 .py 文件）

**无需安装任何依赖**，纯 HTML + JS 文件，直接用浏览器打开即可学习。

## 如何打开可视化页面（重要！）

**必须通过本地服务器打开，不能直接双击 HTML 文件！**

### 方法：用 Python 内置服务器

1. 打开终端，进入项目目录（根据你具体的用户名和地址调整path/to部分）：
   ```bash
   cd path/to/tutorial
   ```
2. 启动服务器：
   ```bash
   python -m http.server 8080
   ```
3. 打开浏览器，访问：
   - 主页：http://localhost:8080/
   - 可视化页面：http://localhost:8080/01_array_and_list/visualization.html
   - 其他章节同理，把目录名换成对应的（如 `02_linked_list/`、`03_stack/`）

### 为什么不能直接双击打开？

因为浏览器出于安全考虑，会阻止本地 JavaScript 文件加载，导致页面显示不正常。

---

## 常见问题

**Q: 打开 HTML 文件后按钮点击没反应？**
A: 这是因为直接双击打开导致 JavaScript 出错。请按上面的"如何打开可视化页面"方法，通过本地服务器打开。

**Q: 打开后 Console 里报 `SyntaxError` 错误？**
A: 可能是代码里有中文引号问题。请刷新页面，如果错误仍然存在，请联系我修复。

**Q: Python 代码跑不起来？**
A: 确保安装了 Python 3.8+，在终端运行 `python implementation.py`。

**Q: 界面显示不正常？**
A: 尝试使用 Chrome 浏览器，或检查是否开启了 JavaScript。

---

**祝你学习顺利！** 数据结构是编程的基石，搞清楚每个"为什么"比死记硬背重要得多。
