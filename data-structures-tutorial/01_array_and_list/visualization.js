/**
 * visualization.js
 * 数组与链表 - 交互演示逻辑
 * 对应 visualization.html
 *
 * 步进逻辑：每个操作生成一系列步骤快照，用户点击"下一步"逐步推进
 */

// ============================================================================
// 全局状态
// ============================================================================

var currentOperation = "list-prepend";
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

LinkedList.prototype.insertAt = function(index, value) {
    if (index < 0 || index > this.size) return false;
    if (index === 0) {
        this.prepend(value);
        return true;
    }
    if (index === this.size) {
        this.append(value);
        return true;
    }
    var newNode = new LLNode(value);
    var prev = this.getNodeAt(index - 1);
    newNode.next = prev.next;
    prev.next = newNode;
    this.size++;
    return true;
};

LinkedList.prototype.deleteAt = function(index) {
    if (index < 0 || index >= this.size) return null;
    var deletedValue;
    if (index === 0) {
        deletedValue = this.head.value;
        this.head = this.head.next;
        if (this.size === 1) this.tail = null;
    } else {
        var prev = this.getNodeAt(index - 1);
        var nodeToDelete = prev.next;
        deletedValue = nodeToDelete.value;
        prev.next = nodeToDelete.next;
        if (nodeToDelete === this.tail) {
            this.tail = prev;
        }
    }
    this.size--;
    return deletedValue;
};

LinkedList.prototype.getNodeAt = function(index) {
    if (index < 0 || index >= this.size) return null;
    var current = this.head;
    for (var i = 0; i < index; i++) {
        current = current.next;
    }
    return current;
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
 * 生成链表头部插入的步骤
 */
function generateListPrependSteps(value) {
    var steps = [];
    var list = new LinkedList();

    // 初始状态：空链表
    list.append(10);
    list.append(20);
    list.append(30);

    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "prepend",
            value: value
        },
        highlight: {},
        description: "初始状态：链表已有 3 个节点 [10 -> 20 -> 30]",
        why: null,
        next: "将要在头部插入节点 " + value
    });

    // 步骤 1：创建新节点
    list = new LinkedList();
    list.append(10);
    list.append(20);
    list.append(30);

    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "prepend",
            value: value,
            phase: "create-node"
        },
        highlight: { newNode: true },
        description: "创建新节点 Node(" + value + ")",
        why: "新节点需要先被创建，才能插入到链表",
        next: "将新节点的 next 指向原头节点"
    });

    // 步骤 2：设置新节点的 next
    list = new LinkedList();
    list.append(10);
    list.append(20);
    list.append(30);

    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "prepend",
            value: value,
            phase: "set-next",
            newNodeValue: value
        },
        highlight: { nodeIndex: 0, newNode: true },
        description: "newNode.next = head（让新节点指向原来的第一个节点）",
        why: "链表靠指针连接，必须先让新节点记住后面的节点是谁",
        next: "将 head 指向新节点"
    });

    // 步骤 3：更新 head
    list = new LinkedList();
    list.prepend(value);
    list.append(10);
    list.append(20);
    list.append(30);

    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "prepend",
            value: value,
            phase: "done"
        },
        highlight: { nodeIndex: 0 },
        description: "head = newNode（更新头指针）",
        why: "head 永远指向链表的第一个节点，现在第一个节点变成了新节点",
        next: "插入完成！链表现在是 [ " + value + " -> 10 -> 20 -> 30 ]"
    });

    return steps;
}

/**
 * 生成链表尾部插入的步骤
 */
function generateListAppendSteps(value) {
    var steps = [];
    var list = new LinkedList();

    // 初始状态
    list.append(10);
    list.append(20);
    list.append(30);

    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "append",
            value: value
        },
        highlight: { nodeIndex: list.size - 1 },
        description: "初始状态：链表已有 3 个节点 [10 -> 20 -> 30]",
        why: null,
        next: "将要在尾部插入节点 " + value
    });

    // 步骤 1：创建新节点
    list = new LinkedList();
    list.append(10);
    list.append(20);
    list.append(30);

    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "append",
            value: value,
            phase: "create-node"
        },
        highlight: { newNode: true },
        description: "创建新节点 Node(" + value + ")",
        why: "新节点需要先被创建",
        next: "将尾节点的 next 指向新节点"
    });

    // 步骤 2：连接尾节点
    list = new LinkedList();
    list.append(10);
    list.append(20);
    list.append(30);

    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "append",
            value: value,
            phase: "connect",
            tailIndex: 2
        },
        highlight: { nodeIndex: 2, newNode: true },
        description: "tail.next = newNode（让原来的尾节点指向新节点）",
        why: "链表靠 next 指针连接，需要让最后一个节点的 next 指向新节点",
        next: "更新 tail 指向新节点"
    });

    // 步骤 3：更新 tail
    list = new LinkedList();
    list.append(10);
    list.append(20);
    list.append(30);
    list.append(value);

    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "append",
            value: value,
            phase: "done"
        },
        highlight: { nodeIndex: list.size - 1 },
        description: "tail = newNode（更新尾指针）",
        why: "tail 永远指向链表的最后一个节点，现在变成了新节点",
        next: "插入完成！链表现在是 [ 10 -> 20 -> 30 -> " + value + " ]"
    });

    return steps;
}

/**
 * 生成链表删除的步骤
 */
function generateListDeleteSteps(index) {
    var steps = [];
    var list = new LinkedList();
    list.append(10);
    list.append(20);
    list.append(30);

    var valueAtIndex = list.getNodeAt(index).value;

    steps.push({
        state: {
            type: "linked-list",
            list: list.toArray(),
            operation: "delete",
            index: index,
            deleteValue: valueAtIndex
        },
        highlight: { nodeIndex: index },
        description: "初始状态：链表 [10 -> 20 -> 30]，要删除位置 " + index + " 的节点（value=" + valueAtIndex + "）",
        why: null,
        next: "找到要删除节点的前一个节点"
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
                phase: "find-node"
            },
            highlight: { nodeIndex: 0 },
            description: "要删除的是头节点，直接将 head 指向 head.next",
            why: "删除头节点不需要遍历，直接修改 head 指针即可",
            next: "执行：head = head.next"
        });

        list.deleteAt(0);
        steps.push({
            state: {
                type: "linked-list",
                list: list.toArray(),
                operation: "delete",
                index: index,
                deleteValue: valueAtIndex,
                phase: "done"
            },
            highlight: {},
            description: "head = head.next，头节点被删除",
            why: "head 指针现在指向原来的第二个节点，原头节点不再被链表引用，会被垃圾回收",
            next: "删除完成！链表现在是 [ " + list.toArray().join(" -> ") + " ]"
        });
    } else {
        // 删除中间或尾部节点
        steps.push({
            state: {
                type: "linked-list",
                list: [10, 20, 30],
                operation: "delete",
                index: index,
                deleteValue: valueAtIndex,
                phase: "find-prev"
            },
            highlight: { nodeIndex: index - 1 },
            description: "找到位置 " + index + " 的前一个节点（位置 " + (index - 1) + "）",
            why: "需要通过前一个节点来跳过要删除的节点",
            next: "执行：prev.next = prev.next.next"
        });

        steps.push({
            state: {
                type: "linked-list",
                list: [10, 20, 30],
                operation: "delete",
                index: index,
                deleteValue: valueAtIndex,
                phase: "bypass"
            },
            highlight: { nodeIndex: index - 1, nodeIndex2: index },
            description: "prev.next = nodeToDelete.next（让前一个节点跳过要删除的节点）",
            why: "链表的「断开-重连」：让前一个节点的 next 直接指向后一个节点，从而绕过要删除的节点",
            next: "如果删除的是尾节点，还需要更新 tail"
        });

        list.deleteAt(index);
        steps.push({
            state: {
                type: "linked-list",
                list: list.toArray(),
                operation: "delete",
                index: index,
                deleteValue: valueAtIndex,
                phase: "done"
            },
            highlight: {},
            description: "节点 " + valueAtIndex + " 已从链表中移除",
            why: "被删除的节点不再被任何节点引用，链表结构已更新",
            next: "删除完成！链表现在是 [ " + list.toArray().join(" -> ") + " ]"
        });
    }

    return steps;
}

/**
 * 生成数组插入的步骤
 */
function generateArrayInsertSteps(arr, index, value) {
    var steps = [];
    var array = arr.slice();

    steps.push({
        state: {
            type: "array",
            array: array.slice(),
            operation: "insert",
            index: index,
            value: value
        },
        highlight: {},
        description: "初始状态：数组 [" + array.join(", ") + "]",
        why: null,
        next: "在位置 " + index + " 插入 " + value + "，需要移动后面的元素"
    });

    // 移动元素
    for (var i = array.length - 1; i >= index; i--) {
        array[i + 1] = array[i];
        var highlights = {};
        for (var j = i + 1; j > index; j--) {
            highlights["idx" + j] = "done";
        }
        highlights["idx" + i] = "active";

        steps.push({
            state: {
                type: "array",
                array: array.slice(),
                operation: "insert",
                index: index,
                value: value,
                phase: "shift"
            },
            highlight: highlights,
            description: "移动元素：data[" + (i + 1) + "] = data[" + i + "]",
            why: "为新元素腾出位置，必须从后往前移动元素",
            next: i === index ? "在空出的位置放入新值" : "继续移动下一个元素"
        });
    }

    // 放入新值
    array[index] = value;
    var finalHighlights = {};
    finalHighlights["idx" + index] = "done";

    steps.push({
        state: {
            type: "array",
            array: array.slice(),
            operation: "insert",
            index: index,
            value: value,
            phase: "done"
        },
        highlight: finalHighlights,
        description: "data[" + index + "] = " + value + "，插入完成！",
        why: "新元素放入正确位置",
        next: "插入完成！数组现在是 [" + array.join(", ") + "]"
    });

    return steps;
}

/**
 * 生成数组删除的步骤
 */
function generateArrayDeleteSteps(arr, index) {
    var steps = [];
    var array = arr.slice();
    var deletedValue = array[index];

    steps.push({
        state: {
            type: "array",
            array: array.slice(),
            operation: "delete",
            index: index,
            deleteValue: deletedValue
        },
        highlight: { ["idx" + index]: "active" },
        description: "初始状态：数组 [" + array.join(", ") + "]，要删除位置 " + index + " 的元素（value=" + deletedValue + "）",
        why: null,
        next: "删除位置 " + index + " 的元素后，需要移动后面的元素填补空缺"
    });

    // 移动元素
    for (var i = index; i < array.length - 1; i++) {
        array[i] = array[i + 1];
        var highlights = {};
        highlights["idx" + i] = "active";
        if (i + 1 < array.length) {
            highlights["idx" + (i + 1)] = "done";
        }

        steps.push({
            state: {
                type: "array",
                array: array.slice(),
                operation: "delete",
                index: index,
                deleteValue: deletedValue,
                phase: "shift"
            },
            highlight: highlights,
            description: "移动元素：data[" + i + "] = data[" + (i + 1) + "]",
            why: "填补被删除元素的位置，从前往后移动",
            next: i < array.length - 2 ? "继续移动下一个元素" : "清除尾部元素"
        });
    }

    // 清除尾部
    array[array.length - 1] = null;
    steps.push({
        state: {
            type: "array",
            array: array.slice(),
            operation: "delete",
            index: index,
            deleteValue: deletedValue,
            phase: "done"
        },
        highlight: {},
        description: "清除尾部元素，删除完成！",
        why: "被删除位置的元素已被前面的元素填补，最后一个位置设为 null",
        next: "删除完成！数组现在是 [" + array.filter(function(x) { return x !== null; }).join(", ") + "]"
    });

    return steps;
}

// ============================================================================
// 渲染函数
// ============================================================================

/**
 * 渲染链表
 */
function renderLinkedList(state) {
    var container = document.getElementById("visualArea");
    container.innerHTML = "";

    var list = state.list;
    var highlight = state.highlight || {};

    for (var i = 0; i < list.length; i++) {
        // 创建节点容器
        var nodeDiv = document.createElement("div");
        nodeDiv.className = "ll-node";

        // 节点盒子
        var boxDiv = document.createElement("div");
        var nodeClass = "ll-node-box";
        if (highlight.nodeIndex === i) {
            nodeClass += " active";
        } else if (highlight["idx" + i] === "done" || highlight.nodeIndex2 === i) {
            nodeClass += " done";
        }
        boxDiv.className = nodeClass;

        // 值区域
        var valueDiv = document.createElement("div");
        valueDiv.className = "ll-node-value";
        valueDiv.textContent = list[i];

        // 指针区域
        var pointerDiv = document.createElement("div");
        pointerDiv.className = "ll-node-pointer";
        pointerDiv.textContent = "->";

        boxDiv.appendChild(valueDiv);
        boxDiv.appendChild(pointerDiv);
        nodeDiv.appendChild(boxDiv);
        container.appendChild(nodeDiv);

        // 箭头（节点之间）
        if (i < list.length - 1) {
            var arrow = document.createElement("span");
            arrow.className = "ll-arrow";
            arrow.textContent = "→";
            container.appendChild(arrow);
        }
    }

    // 尾部 null
    if (list.length > 0) {
        var nullSpan = document.createElement("span");
        nullSpan.className = "ll-arrow";
        nullSpan.textContent = "→";
        container.appendChild(nullSpan);
    }
    var nullDiv = document.createElement("span");
    nullDiv.className = "ll-null";
    nullDiv.textContent = "NULL";
    container.appendChild(nullDiv);

    // 如果有新节点要显示
    if (highlight.newNode && state.value) {
        var newNodeDiv = document.createElement("div");
        newNodeDiv.className = "ll-node";
        newNodeDiv.style.marginLeft = list.length > 0 ? "20px" : "0";

        var newBox = document.createElement("div");
        newBox.className = "ll-node-box active";

        var newValue = document.createElement("div");
        newValue.className = "ll-node-value";
        newValue.textContent = state.value;

        var newPointer = document.createElement("div");
        newPointer.className = "ll-node-pointer";
        newPointer.textContent = "->";

        newBox.appendChild(newValue);
        newBox.appendChild(newPointer);
        newNodeDiv.appendChild(newBox);
        container.appendChild(newNodeDiv);
    }
}

/**
 * 渲染数组
 */
function renderArray(state) {
    var container = document.getElementById("visualArea");
    container.innerHTML = "";

    var arr = state.array;
    var highlight = state.highlight || {};

    // 创建单元格
    for (var i = 0; i < arr.length; i++) {
        var cell = document.createElement("div");
        var cellClass = "array-cell";

        if (highlight["idx" + i] === "active") {
            cellClass += " active";
        } else if (highlight["idx" + i] === "done") {
            cellClass += " done";
        } else if (arr[i] === null) {
            cellClass += " empty";
        }

        cell.className = cellClass;
        cell.textContent = arr[i] !== null ? arr[i] : "-";

        // 添加索引
        var indexSpan = document.createElement("span");
        indexSpan.className = "array-index";
        indexSpan.textContent = i;
        cell.appendChild(indexSpan);

        container.appendChild(cell);
    }
}

/**
 * 主渲染函数
 */
function render(state) {
    var dataDisplay = document.getElementById("dataDisplay");

    if (state.type === "linked-list") {
        renderLinkedList(state);
        dataDisplay.textContent = "链表: [ " + state.list.join(" → ") + " ]";
    } else if (state.type === "array") {
        renderArray(state);
        var displayArr = state.array.map(function(x) { return x === null ? "-" : x; });
        dataDisplay.textContent = "数组: [" + displayArr.join(", ") + "]";
    }

    // 更新说明文字
    var stepInfo = stepManager.getStepInfo();
    document.getElementById("stepDescription").textContent = stepInfo.description;

    var whyText = document.getElementById("whyText");
    var nextText = document.getElementById("nextText");
    var opDetail = document.getElementById("operationDetail");
    var nextHint = document.getElementById("nextHint");

    if (stepInfo.why) {
        whyText.textContent = stepInfo.why;
        opDetail.style.display = "block";
    } else {
        opDetail.style.display = "none";
    }

    if (stepInfo.next) {
        nextText.textContent = stepInfo.next;
        nextHint.style.display = "block";
    } else {
        nextHint.style.display = "none";
    }
}

// ============================================================================
// 初始化和事件处理
// ============================================================================

function init(operation) {
    currentOperation = operation;
    var value = parseInt(document.getElementById("valueInput").value) || 10;
    var index = parseInt(document.getElementById("indexInput").value) || 1;

    // 根据操作类型显示/隐藏输入框
    var valueLabel = document.getElementById("valueLabel");
    var valueInput = document.getElementById("valueInput");
    var indexLabel = document.getElementById("indexLabel");
    var indexInput = document.getElementById("indexInput");

    switch (operation) {
        case "list-prepend":
        case "list-append":
        case "array-insert":
            // 需要输入值
            valueLabel.style.display = "inline";
            valueLabel.textContent = "数值：";
            valueInput.style.display = "inline-block";
            break;
        case "list-delete":
        case "array-delete":
            // 删除不需要输入值，只需要位置
            valueLabel.style.display = "none";
            valueInput.style.display = "none";
            break;
    }

    // 数组操作需要位置输入
    if (operation === "array-insert") {
        indexLabel.style.display = "inline";
        indexInput.style.display = "inline-block";
    } else if (operation === "array-delete") {
        indexLabel.style.display = "inline";
        indexInput.style.display = "inline-block";
    } else {
        indexLabel.style.display = "none";
        indexInput.style.display = "none";
    }

    switch (operation) {
        case "list-prepend":
            steps = generateListPrependSteps(value);
            break;
        case "list-append":
            steps = generateListAppendSteps(value);
            break;
        case "list-delete":
            steps = generateListDeleteSteps(Math.min(index, 2));
            break;
        case "array-insert":
            steps = generateArrayInsertSteps([10, 20, 30, 40], Math.min(index, 3), value);
            break;
        case "array-delete":
            steps = generateArrayDeleteSteps([10, 20, 30, 40], Math.min(index, 3));
            break;
    }

    stepManager = createStepManager(steps, render);
    stepManager.render();

    // 更新按钮状态
    updateButtons();
}

function updateButtons() {
    var btnPrev = document.getElementById("btnPrev");
    var btnNext = document.getElementById("btnNext");
    var stepIndicator = document.getElementById("stepIndicator");

    if (btnPrev) {
        btnPrev.disabled = !stepManager.hasPrev();
    }
    if (btnNext) {
        btnNext.disabled = !stepManager.hasNext();
    }
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

    // 初始加载 - 使用当前激活标签的操作
    var activeTab = document.querySelector(".op-tab.active");
    var initialOp = activeTab ? activeTab.getAttribute("data-op") : "array-insert";
    init(initialOp);
});
