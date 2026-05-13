/**
 * visualization.js
 * 链表 - 交互演示逻辑
 * 对应 visualization.html
 *
 * 重点演示指针操作：先接后断、反转链表的三指针技巧
 */

// ============================================================================
// 全局状态
// ============================================================================

var currentOperation = "prepend";
var steps = [];
var stepManager = null;

// ============================================================================
// 链表节点类（JS 端实现）
// ============================================================================

function LLNode(value) {
    this.value = value;
    this.next = null;
}

function LinkedList() {
    this.head = null;
    this.tail = null;
    this.size = 0;
}

LinkedList.prototype.append = function(value) {
    var newNode = new LLNode(value);
    if (this.size === 0) {
        this.head = newNode;
        this.tail = newNode;
    } else {
        this.tail.next = newNode;
        this.tail = newNode;
    }
    this.size++;
};

LinkedList.prototype.prepend = function(value) {
    var newNode = new LLNode(value);
    if (this.size === 0) {
        this.head = newNode;
        this.tail = newNode;
    } else {
        newNode.next = this.head;
        this.head = newNode;
    }
    this.size++;
};

LinkedList.prototype.toArray = function() {
    var arr = [];
    var current = this.head;
    while (current) {
        arr.push(current.value);
        current = current.next;
    }
    return arr;
};

// ============================================================================
// 步骤生成函数
// ============================================================================

/**
 * 生成头部插入步骤
 */
function generatePrependSteps(value) {
    var steps = [];
    var list = new LinkedList();
    list.append(10);
    list.append(20);
    list.append(30);

    // 初始状态
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "prepend",
            value: value,
            phase: "initial"
        },
        description: "初始链表：[10 -> 20 -> 30]，准备在头部插入 " + value,
        why: null,
        next: "创建新节点，让它指向原来的头节点，然后更新 head",
        code: "// 准备插入\nnewNode = Node(" + value + ")"
    });

    // 创建新节点
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "prepend",
            value: value,
            phase: "create-node",
            newNodeValue: value
        },
        highlight: { newNode: true },
        description: "创建新节点 Node(" + value + ")",
        why: "新节点必须先被创建出来，才能插入到链表",
        next: "让新节点的 next 指向原来的头节点",
        code: "newNode = Node(" + value + ")\nnewNode.next = head"
    });

    // 设置 newNode.next
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "prepend",
            value: value,
            phase: "set-next",
            newNodeValue: value,
            newNodeNext: 10
        },
        highlight: { newNode: true, nodeIndex: 0 },
        description: "newNode.next = head（让新节点指向原来的第一个节点）",
        why: "链表靠 next 指针连接，必须先让新节点记住后面的节点是谁",
        next: "更新 head 指向新节点",
        code: "newNode.next = head  // head 指向 10"
    });

    // 更新 head
    var newList = new LinkedList();
    newList.prepend(value);
    newList.append(10);
    newList.append(20);
    newList.append(30);

    steps.push({
        state: {
            type: "linked-list",
            list: newList.toArray(),
            operation: "prepend",
            value: value,
            phase: "done",
            headIndex: 0
        },
        highlight: { nodeIndex: 0 },
        description: "head = newNode（更新头指针）",
        why: "head 永远指向第一个节点，现在第一个节点变成了新节点 " + value,
        next: "插入完成！链表现在是 [ " + value + " -> 10 -> 20 -> 30 ]",
        code: "head = newNode\n// 完成！"
    });

    return steps;
}

/**
 * 生成尾部插入步骤
 */
function generateAppendSteps(value) {
    var steps = [];
    var list = new LinkedList();
    list.append(10);
    list.append(20);
    list.append(30);

    // 初始状态
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "append",
            value: value,
            phase: "initial",
            tailIndex: 2
        },
        description: "初始链表：[10 -> 20 -> 30]，tail 指向节点 30",
        why: null,
        next: "创建新节点，让 tail.next 指向它，然后更新 tail",
        code: "// 准备插入\nnewNode = Node(" + value + ")"
    });

    // 创建新节点
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "append",
            value: value,
            phase: "create-node",
            newNodeValue: value,
            tailIndex: 2
        },
        highlight: { newNode: true, nodeIndex: 2 },
        description: "创建新节点 Node(" + value + ")",
        why: "新节点必须先被创建出来",
        next: "让原来的尾节点（30）指向新节点",
        code: "newNode = Node(" + value + ")"
    });

    // 连接尾节点
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "append",
            value: value,
            phase: "connect",
            newNodeValue: value,
            tailIndex: 2
        },
        highlight: { nodeIndex: 2, newNode: true },
        description: "tail.next = newNode（让原来的尾节点指向新节点）",
        why: "需要让链表从尾节点延伸到新节点",
        next: "更新 tail 指向新节点",
        code: "tail.next = newNode  // 30 -> " + value
    });

    // 更新 tail
    var newList = new LinkedList();
    newList.append(10);
    newList.append(20);
    newList.append(30);
    newList.append(value);

    steps.push({
        state: {
            type: "linked-list",
            list: newList.toArray(),
            operation: "append",
            value: value,
            phase: "done",
            tailIndex: 3
        },
        highlight: { nodeIndex: 3 },
        description: "tail = newNode（更新尾指针）",
        why: "tail 永远指向最后一个节点，现在变成了新节点 " + value,
        next: "插入完成！链表现在是 [ 10 -> 20 -> 30 -> " + value + " ]",
        code: "tail = newNode\n// 完成！"
    });

    return steps;
}

/**
 * 生成中间插入步骤（重点演示"先接后断"）
 */
function generateInsertSteps(index, value) {
    var steps = [];
    var list = new LinkedList();
    list.append(10);
    list.append(20);
    list.append(30);

    // 初始状态
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "insert",
            value: value,
            index: index,
            phase: "initial"
        },
        description: "初始链表：[10 -> 20 -> 30]，准备在位置 " + index + " 之后插入 " + value,
        why: null,
        next: "找到位置 " + index + " 的节点（值为 " + list.toArray()[index] + "）",
        code: "// 找到位置 " + index + " 的节点\nprevNode = getNode(" + index + ")"
    });

    // 找到前一个节点
    var prevValue = list.toArray()[index];
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "insert",
            value: value,
            index: index,
            phase: "find-prev",
            prevIndex: index
        },
        highlight: { nodeIndex: index },
        description: "找到位置 " + index + " 的节点 Node(" + prevValue + ")，这是要插入位置的前一个节点",
        why: "需要在它后面插入新节点",
        next: "创建新节点，然后按照「先接后断」的顺序插入",
        code: "prevNode = getNode(" + index + ")\n// prevNode.value = " + prevValue
    });

    // 创建新节点
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "insert",
            value: value,
            index: index,
            phase: "create-node",
            newNodeValue: value,
            prevIndex: index,
            prevNextValue: list.toArray()[index + 1] || null
        },
        highlight: { newNode: true, nodeIndex: index },
        description: "创建新节点 Node(" + value + ")",
        why: "新节点必须先被创建出来",
        next: "关键步骤：先接后断！先把新节点指向后面的链表",
        code: "newNode = Node(" + value + ")"
    });

    // 先接：newNode.next = prevNode.next
    var nextValue = list.toArray()[index + 1];
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "insert",
            value: value,
            index: index,
            phase: "first-connect",
            newNodeValue: value,
            prevIndex: index,
            newNodeNextValue: nextValue
        },
        highlight: { newNode: true, nodeIndex: index + 1 },
        description: "newNode.next = prevNode.next（让新节点指向后面的节点 " + (nextValue !== null ? nextValue : "NULL") + "）",
        why: "「先接」：先把后面的链表接上，防止丢失",
        next: "「后断」：再让前一个节点指向新节点",
        code: "// 先接\nnewNode.next = prevNode.next"
    });

    // 后断：prevNode.next = newNode
    var newList = new LinkedList();
    newList.append(10);
    newList.append(20);
    newList.append(30);
    // 模拟插入
    var arr = newList.toArray();
    arr.splice(index + 1, 0, value);

    steps.push({
        state: {
            type: "linked-list",
            list: arr,
            operation: "insert",
            value: value,
            index: index,
            phase: "second-connect",
            newNodeIndex: index + 1
        },
        highlight: { nodeIndex: index, nodeIndex2: index + 1 },
        description: "prevNode.next = newNode（让前一个节点指向新节点）",
        why: "「后断」：链表重新连接完成！注意：如果先做这步再做上步，就找不到后面的链表了",
        next: "插入完成！链表现在是 [ " + arr.join(" -> ") + " ]",
        code: "// 后断\nprevNode.next = newNode\n// 完成！"
    });

    return steps;
}

/**
 * 生成删除节点步骤
 */
function generateDeleteSteps(index) {
    var steps = [];
    var list = new LinkedList();
    list.append(10);
    list.append(20);
    list.append(30);

    var valueAtIndex = list.toArray()[index];

    // 初始状态
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "delete",
            index: index,
            deleteValue: valueAtIndex,
            phase: "initial"
        },
        description: "初始链表：[10 -> 20 -> 30]，准备删除位置 " + index + " 的节点（值为 " + valueAtIndex + "）",
        why: null,
        next: index === 0 ? "删除头节点，只需要移动 head 指针" : "找到要删除节点的前一个节点",
        code: "// 准备删除位置 " + index
    });

    if (index === 0) {
        // 删除头节点
        steps.push({
            state: {
                type: "linked-list",
                list: list.toArray(),
                operation: "delete",
                index: index,
                deleteValue: valueAtIndex,
                phase: "delete-head",
                deleteIndex: 0
            },
            highlight: { nodeIndex: 0 },
            description: "要删除的是头节点（值为 " + valueAtIndex + "）",
            why: "删除头节点只需要把 head 指针往后移动一位即可",
            next: "执行 head = head.next，跳过头节点",
            code: "head = head.next  // 直接跳过"
        });

        var newList1 = new LinkedList();
        newList1.append(20);
        newList1.append(30);

        steps.push({
            state: {
                type: "linked-list",
                list: newList1.toArray(),
                operation: "delete",
                index: index,
                deleteValue: valueAtIndex,
                phase: "done"
            },
            description: "头节点 " + valueAtIndex + " 已被删除",
            why: "head 现在指向原来的第二个节点，原头节点不再被引用（会被垃圾回收）",
            next: "删除完成！链表现在是 [ " + newList1.toArray().join(" -> ") + " ]",
            code: "// 完成！"
        });
    } else {
        // 删除中间或尾部节点
        var prevValue = list.toArray()[index - 1];

        steps.push({
            state: {
                type: "linked-list",
                list: list.toArray(),
                operation: "delete",
                index: index,
                deleteValue: valueAtIndex,
                phase: "find-prev",
                prevIndex: index - 1
            },
            highlight: { nodeIndex: index - 1 },
            description: "找到位置 " + (index - 1) + " 的前一个节点 Node(" + prevValue + ")",
            why: "需要通过前一个节点来「绕过」要删除的节点",
            next: "让前一个节点的 next 跳过要删除的节点，直接指向后面的节点",
            code: "prevNode = getNode(" + (index - 1) + ")"
        });

        steps.push({
            state: {
                type: "linked-list",
                list: list.toArray(),
                operation: "delete",
                index: index,
                deleteValue: valueAtIndex,
                phase: "bypass",
                deleteIndex: index,
                prevIndex: index - 1,
                nextIndex: index + 1 < list.size ? index + 1 : null
            },
            highlight: { nodeIndex: index - 1, nodeIndex2: index },
            description: "prevNode.next = nodeToDelete.next（让前一个节点跳过要删除的节点）",
            why: "这就是链表的「断开-重连」：让前一个节点的 next 直接指向后一个节点，从而绕过要删除的节点",
            next: index === list.size - 1 ? "如果删除的是尾节点，还需要更新 tail" : "删除完成！",
            code: "prevNode.next = nodeToDelete.next"
        });

        var newList2 = new LinkedList();
        newList2.append(10);
        newList2.append(20);
        newList2.append(30);
        var arr2 = newList2.toArray();
        arr2.splice(index, 1);

        var isLast = index === list.size - 1;
        steps.push({
            state: {
                type: "linked-list",
                list: arr2,
                operation: "delete",
                index: index,
                deleteValue: valueAtIndex,
                phase: "done",
                newTailIndex: isLast ? index - 1 : null
            },
            description: isLast
                ? "节点 " + valueAtIndex + " 已删除，tail 更新为前一个节点"
                : "节点 " + valueAtIndex + " 已从链表中移除",
            why: "被删除的节点不再被任何节点引用，链表结构已更新",
            next: "删除完成！链表现在是 [ " + arr2.join(" -> ") + " ]",
            code: (isLast ? "tail = prevNode\n" : "") + "// 完成！"
        });
    }

    return steps;
}

/**
 * 生成反转链表步骤（重点演示三指针技巧）
 */
function generateReverseSteps() {
    var steps = [];
    var list = new LinkedList();
    list.append(1);
    list.append(2);
    list.append(3);
    list.append(4);
    list.append(5);

    // 初始状态
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "reverse",
            phase: "initial"
        },
        description: "初始链表：[1 -> 2 -> 3 -> 4 -> 5]，准备反转",
        why: null,
        next: "使用三指针技巧：prev、curr、next，逐步反转每个节点的 next 指针",
        code: "prev = None\ncurr = head"
    });

    // 第1步
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "reverse",
            phase: "step1",
            prev: null,
            curr: 1,
            next: 2,
            highlightNode: 0
        },
        highlight: { nodeIndex: 0 },
        description: "处理节点 1：保存 next_node = 2，然后反转 curr.next = prev",
        why: "curr.next 本来指向 2，反转后指向 None（实现了节点 1 的反转）",
        next: "prev = curr(1)，curr = next_node(2)，继续处理下一个",
        code: "next_node = curr.next  // 2\ncurr.next = prev      // 1 -> None\nprev = curr         // prev = 1\ncurr = next_node   // curr = 2"
    });

    // 第2步
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "reverse",
            phase: "step2",
            prev: 1,
            curr: 2,
            next: 3,
            highlightNode: 1
        },
        highlight: { nodeIndex: 1 },
        description: "处理节点 2：保存 next_node = 3，然后反转 curr.next = prev",
        why: "curr.next 本来指向 3，反转后指向 1（节点 2 现在指向节点 1）",
        next: "prev = curr(2)，curr = next_node(3)，继续",
        code: "next_node = curr.next  // 3\ncurr.next = prev      // 2 -> 1\nprev = curr         // prev = 2\ncurr = next_node   // curr = 3"
    });

    // 第3步
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "reverse",
            phase: "step3",
            prev: 2,
            curr: 3,
            next: 4,
            highlightNode: 2
        },
        highlight: { nodeIndex: 2 },
        description: "处理节点 3：保存 next_node = 4，然后反转 curr.next = prev",
        why: "curr.next 本来指向 4，反转后指向 2",
        next: "prev = curr(3)，curr = next_node(4)",
        code: "next_node = curr.next  // 4\ncurr.next = prev      // 3 -> 2\nprev = curr         // prev = 3\ncurr = next_node   // curr = 4"
    });

    // 第4步
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "reverse",
            phase: "step4",
            prev: 3,
            curr: 4,
            next: 5,
            highlightNode: 3
        },
        highlight: { nodeIndex: 3 },
        description: "处理节点 4：保存 next_node = 5，然后反转 curr.next = prev",
        why: "curr.next 本来指向 5，反转后指向 3",
        next: "prev = curr(4)，curr = next_node(5)",
        code: "next_node = curr.next  // 5\ncurr.next = prev      // 4 -> 3\nprev = curr         // prev = 4\ncurr = next_node   // curr = 5"
    });

    // 第5步
    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "reverse",
            phase: "step5",
            prev: 4,
            curr: 5,
            next: null,
            highlightNode: 4
        },
        highlight: { nodeIndex: 4 },
        description: "处理节点 5：保存 next_node = None，然后反转 curr.next = prev",
        why: "curr.next 本来指向 None，反转后指向 4",
        next: "prev = curr(5)，curr = None（循环结束），更新 head = prev",
        code: "next_node = curr.next  // None\ncurr.next = prev      // 5 -> 4\nprev = curr         // prev = 5\ncurr = next_node   // curr = None"
    });

    // 完成
    steps.push({
        state: {
            type: "linked-list",
            list: [5, 4, 3, 2, 1],
            operation: "reverse",
            phase: "done",
            newHeadIndex: 0
        },
        highlight: { nodeIndex: 0 },
        description: "反转完成！head = prev = 5",
        why: "prev 最后指向节点 5，它现在是新的头节点。每个节点的 next 都指向了前一个节点",
        next: "链表现在是 [ 5 -> 4 -> 3 -> 2 -> 1 ]，成功反转！",
        code: "head = prev  // 5\n// 完成！链表: 5 -> 4 -> 3 -> 2 -> 1"
    });

    return steps;
}

// ============================================================================
// 渲染函数
// ============================================================================

function renderLinkedList(state) {
    var container = document.getElementById("visualArea");
    var headLabel = document.getElementById("headLabel");
    var tailLabel = document.getElementById("tailLabel");

    container.innerHTML = "";

    var list = state.list;
    var highlight = state.highlight || {};

    // 渲染链表节点
    for (var i = 0; i < list.length; i++) {
        var nodeDiv = document.createElement("div");
        nodeDiv.className = "ll-node";

        var boxDiv = document.createElement("div");
        var nodeClass = "ll-node-box";

        if (highlight.nodeIndex === i || highlight.nodeIndex2 === i) {
            nodeClass += " active";
        } else if (highlight.highlightNode === i) {
            nodeClass += " active";
        } else if (highlight["done" + i]) {
            nodeClass += " done";
        }

        boxDiv.className = nodeClass;

        var valueDiv = document.createElement("div");
        valueDiv.className = "ll-node-value";
        valueDiv.textContent = list[i];

        var pointerDiv = document.createElement("div");
        pointerDiv.className = "ll-node-pointer";
        pointerDiv.textContent = "->";

        boxDiv.appendChild(valueDiv);
        boxDiv.appendChild(pointerDiv);
        nodeDiv.appendChild(boxDiv);
        container.appendChild(nodeDiv);

        if (i < list.length - 1) {
            var arrow = document.createElement("span");
            arrow.className = "ll-arrow";
            if (highlight.arrowActive === i) {
                arrow.className += " active";
            }
            arrow.textContent = "→";
            container.appendChild(arrow);
        }
    }

    // 尾部 NULL
    if (list.length > 0) {
        var arrow = document.createElement("span");
        arrow.className = "ll-arrow";
        arrow.textContent = "→";
        container.appendChild(arrow);

        var nullDiv = document.createElement("span");
        nullDiv.className = "ll-null";
        nullDiv.textContent = "NULL";
        container.appendChild(nullDiv);
    }

    // 渲染新节点（如果有）
    if (highlight.newNode && state.newNodeValue !== undefined) {
        var newNodeDiv = document.createElement("div");
        newNodeDiv.className = "ll-node";
        newNodeDiv.style.marginLeft = list.length > 0 ? "16px" : "0";

        var newBox = document.createElement("div");
        newBox.className = "ll-node-box new";

        var newValue = document.createElement("div");
        newValue.className = "ll-node-value";
        newValue.textContent = state.newNodeValue;

        var newPointer = document.createElement("div");
        newPointer.className = "ll-node-pointer";
        newPointer.textContent = "->";

        newBox.appendChild(newValue);
        newBox.appendChild(newPointer);
        newNodeDiv.appendChild(newBox);
        container.appendChild(newNodeDiv);
    }

    // 更新 head 和 tail 标签
    if (state.highlight && state.highlight.headIndex !== undefined) {
        headLabel.textContent = "head";
    }
    if (state.highlight && state.highlight.tailIndex !== undefined) {
        tailLabel.textContent = "tail";
    }

    // 隐藏/显示指针标签
    headLabel.style.display = list.length > 0 ? "block" : "none";
    tailLabel.style.display = list.length > 0 ? "block" : "none";
}

function render(state) {
    // 更新数据展示
    var dataDisplay = document.getElementById("dataDisplay");
    if (state.type === "linked-list") {
        dataDisplay.textContent = "链表: [ " + state.list.join(" → ") + " ]";
    }

    // 渲染链表
    renderLinkedList(state);

    // 更新说明
    var stepInfo = stepManager.getStepInfo();
    document.getElementById("stepDescription").textContent = stepInfo.description;
    document.getElementById("stepCode").textContent = stepInfo.code || "";

    var whyBox = document.getElementById("whyBox");
    var nextBox = document.getElementById("nextBox");

    if (stepInfo.why) {
        document.getElementById("whyText").textContent = stepInfo.why;
        whyBox.style.display = "block";
    } else {
        whyBox.style.display = "none";
    }

    if (stepInfo.next) {
        document.getElementById("nextText").textContent = stepInfo.next;
        nextBox.style.display = "block";
    } else {
        nextBox.style.display = "none";
    }
}

// ============================================================================
// 初始化和事件处理
// ============================================================================

function init(operation) {
    currentOperation = operation;
    var value = parseInt(document.getElementById("valueInput").value) || 15;
    var index = parseInt(document.getElementById("indexInput").value) || 1;

    // 根据操作类型显示/隐藏输入框
    var valueLabel = document.getElementById("valueLabel");
    var valueInput = document.getElementById("valueInput");
    var indexLabel = document.getElementById("indexLabel");
    var indexInput = document.getElementById("indexInput");

    switch (operation) {
        case "prepend":
        case "append":
            // 需要输入值，不需要位置
            valueLabel.style.display = "inline";
            valueLabel.textContent = "插入值：";
            valueInput.style.display = "inline-block";
            indexLabel.style.display = "none";
            indexInput.style.display = "none";
            break;
        case "insert":
            // 需要输入值和位置
            valueLabel.style.display = "inline";
            valueLabel.textContent = "插入值：";
            valueInput.style.display = "inline-block";
            indexLabel.style.display = "inline";
            indexInput.style.display = "inline-block";
            break;
        case "delete":
            // 删除只需要位置
            valueLabel.style.display = "none";
            valueInput.style.display = "none";
            indexLabel.style.display = "inline";
            indexLabel.textContent = "删除位置：";
            indexInput.style.display = "inline-block";
            break;
        case "reverse":
            // 反转不需要任何输入
            valueLabel.style.display = "none";
            valueInput.style.display = "none";
            indexLabel.style.display = "none";
            indexInput.style.display = "none";
            break;
    }

    switch (operation) {
        case "prepend":
            steps = generatePrependSteps(value);
            break;
        case "append":
            steps = generateAppendSteps(value);
            break;
        case "insert":
            steps = generateInsertSteps(Math.min(index, 2), value);
            break;
        case "delete":
            steps = generateDeleteSteps(Math.min(index, 2));
            break;
        case "reverse":
            steps = generateReverseSteps();
            break;
    }

    stepManager = createStepManager(steps, render);
    stepManager.render();
    updateButtons();
}

function updateButtons() {
    var btnPrev = document.getElementById("btnPrev");
    var btnNext = document.getElementById("btnNext");
    var stepIndicator = document.getElementById("stepIndicator");

    if (btnPrev) btnPrev.disabled = !stepManager.hasPrev();
    if (btnNext) btnNext.disabled = !stepManager.hasNext();
    if (stepIndicator && stepManager) {
        var curr = stepManager.getCurrentStep() + 1;
        var total = stepManager.getTotalSteps();
        stepIndicator.textContent = "步骤 " + curr + " / " + total;
    }
}

// 页面加载完成后初始化
window.addEventListener("DOMContentLoaded", function() {
    // 创建按钮
    var buttonRow = document.getElementById("buttonRow");
    buttonRow.innerHTML =
        '<button class="btn btn-secondary" id="btnPrev" disabled>← 上一步</button>' +
        '<span class="step-indicator" id="stepIndicator">步骤 1 / 1</span>' +
        '<button class="btn btn-primary" id="btnNext" disabled>下一步 →</button>' +
        '<button class="btn btn-secondary" id="btnReset">重置</button>';

    // 绑定操作标签
    var opTabs = document.querySelectorAll(".op-tab");
    opTabs.forEach(function(tab) {
        tab.addEventListener("click", function() {
            opTabs.forEach(function(t) { t.classList.remove("active"); });
            tab.classList.add("active");
            init(tab.getAttribute("data-op"));
        });
    });

    // 绑定按钮事件
    document.getElementById("btnPrev").addEventListener("click", function() {
        stepManager.prev();
        updateButtons();
    });

    document.getElementById("btnNext").addEventListener("click", function() {
        stepManager.next();
        updateButtons();
    });

    document.getElementById("btnReset").addEventListener("click", function() {
        init(currentOperation);
    });

    document.getElementById("restartBtn").addEventListener("click", function() {
        init(currentOperation);
    });

    // 初始加载
    init("prepend");
});
