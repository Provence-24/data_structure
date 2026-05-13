/**
 * visualization.js
 * 队列 - 交互演示逻辑
 * 对应 visualization.html

 * 演示内容：
 * 1. 普通队列入队/出队（水平条形布局）
 * 2. 循环队列入队/出队（环形布局，强调 mod）
 * 3. 循环队列完整演示
 */

// ============================================================================
// 全局状态
// ============================================================================

var currentOperation = "simple-enqueue";
var steps = [];
var stepManager = null;
var CAPACITY = 5;

// ============================================================================
// 普通队列类
// ============================================================================

function SimpleQueue() {
    this.capacity = CAPACITY;
    this.array = new Array(this.capacity).fill(null);
    this.front = 0;
    this.rear = 0;
}

SimpleQueue.prototype.isEmpty = function() {
    return this.size === 0;
};

SimpleQueue.prototype.isFull = function() {
    return this.size === this.capacity;
};

SimpleQueue.prototype.enqueue = function(item) {
    if (this.isFull()) return false;
    this.array[this.rear] = item;
    this.rear++;
    this.size++;
    return true;
};

SimpleQueue.prototype.dequeue = function() {
    if (this.isEmpty()) return null;
    var item = this.array[this.front];
    this.array[this.front] = null;
    this.front++;
    this.size--;
    return item;
};

// ============================================================================
// 循环队列类
// ============================================================================

function CircularQueue() {
    this.capacity = CAPACITY;
    this.array = new Array(this.capacity).fill(null);
    this.front = 0;
    this.rear = 0;
}

CircularQueue.prototype.isEmpty = function() {
    return this.front === this.rear;
};

CircularQueue.prototype.isFull = function() {
    return (this.rear + 1) % this.capacity === this.front;
};

CircularQueue.prototype.enqueue = function(item) {
    if (this.isFull()) return false;
    this.array[this.rear] = item;
    this.rear = (this.rear + 1) % this.capacity;
    return true;
};

CircularQueue.prototype.dequeue = function() {
    if (this.isEmpty()) return null;
    var item = this.array[this.front];
    this.array[this.front] = null;
    this.front = (this.front + 1) % this.capacity;
    return item;
};

// ============================================================================
// 普通队列步骤生成
// ============================================================================

function generateSimpleEnqueueSteps(value) {
    var steps = [];
    var queue = new SimpleQueue();
    queue.array = [10, 20, 30, null, null];
    queue.front = 0;
    queue.rear = 3;
    queue.size = 3;

    steps.push({
        state: {
            type: "simple-enqueue",
            array: queue.array.slice(),
            front: queue.front,
            rear: queue.rear,
            capacity: queue.capacity,
            size: queue.size,
            value: value,
            phase: "initial"
        },
        description: "初始普通队列：[10, 20, 30, _, _]，front=0, rear=3",
        why: null,
        next: "将 " + value + " 放入位置 rear=3，然后 rear++（注意：不会绕回）",
        code: "array[rear] = " + value + "\nrear++  // 变成 " + (queue.rear + 1)
    });

    queue.array[queue.rear] = value;
    var oldRear = queue.rear;
    queue.rear++;
    queue.size++;

    steps.push({
        state: {
            type: "simple-enqueue",
            array: queue.array.slice(),
            front: queue.front,
            rear: queue.rear,
            capacity: queue.capacity,
            size: queue.size,
            value: value,
            phase: "done",
            highlightIndex: oldRear
        },
        description: value + " 入队成功！放入位置 " + oldRear + "，rear 从 " + oldRear + " 变成 " + queue.rear,
        why: "普通队列的 rear 一直往后移动（rear++），永远不会绕回，这就是会'假溢出'的原因",
        next: "入队完成！队列现在是 [" + queue.array.slice(0, queue.rear).filter(x => x !== null).join(", ") + "]",
        code: "array[" + oldRear + "] = " + value + "\nrear = " + oldRear + " + 1 = " + queue.rear + "\n// rear++ 不会绕回，会一直增大"
    });

    return steps;
}

function generateSimpleDequeueSteps() {
    var steps = [];
    var queue = new SimpleQueue();
    queue.array = [10, 20, 30, null, null];
    queue.front = 0;
    queue.rear = 3;
    queue.size = 3;

    steps.push({
        state: {
            type: "simple-dequeue",
            array: queue.array.slice(),
            front: queue.front,
            rear: queue.rear,
            capacity: queue.capacity,
            size: queue.size,
            phase: "initial"
        },
        description: "初始普通队列：[10, 20, 30, _, _]，front=0, rear=3",
        why: null,
        next: "从 front=0 取出元素 10，然后 front++",
        code: "item = array[front]\nfront++  // 变成 " + (queue.front + 1)
    });

    var oldFront = queue.front;
    var item = queue.array[oldFront];

    steps.push({
        state: {
            type: "simple-dequeue",
            array: queue.array.slice(),
            front: queue.front,
            rear: queue.rear,
            capacity: queue.capacity,
            size: queue.size,
            value: item,
            phase: "mark",
            highlightIndex: oldFront
        },
        description: "front 指向位置 " + oldFront + "，元素是 " + item,
        why: "front 指向队头元素，出队就是取出 front 位置的元素",
        next: "取出元素 " + item + "，然后 front++",
        code: "item = array[front]  // " + item
    });

    queue.array[oldFront] = null;
    queue.front++;
    queue.size--;

    steps.push({
        state: {
            type: "simple-dequeue",
            array: queue.array.slice(),
            front: queue.front,
            rear: queue.rear,
            capacity: queue.capacity,
            size: queue.size,
            value: item,
            phase: "done"
        },
        description: "出队 " + item + "！front 从 " + oldFront + " 变成 " + queue.front,
        why: "出队后 front 向前移动（front++），前面空出来的位置就浪费了",
        next: "出队完成！front 只能一直增大，这就是普通队列的问题",
        code: "array[" + oldFront + "] = null\nfront = " + oldFront + " + 1 = " + queue.front
    });

    return steps;
}

// ============================================================================
// 循环队列入队/出队步骤生成
// ============================================================================

function generateCircularEnqueueSteps(value) {
    var steps = [];
    var queue = new CircularQueue();
    queue.array = [10, 20, 30, null, null];
    queue.front = 0;
    queue.rear = 3;

    steps.push({
        state: {
            type: "circular-enqueue",
            array: queue.array.slice(),
            front: queue.front,
            rear: queue.rear,
            capacity: queue.capacity,
            value: value,
            phase: "initial"
        },
        description: "初始循环队列：[10, 20, 30, _, _]，front=0, rear=3",
        why: null,
        next: "将 " + value + " 放入位置 rear=3，然后 rear = (3+1)%5 = 4（取模！）",
        code: "array[rear] = " + value + "\nrear = (rear + 1) % capacity"
    });

    queue.array[queue.rear] = value;
    var oldRear = queue.rear;
    queue.rear = (queue.rear + 1) % queue.capacity;

    steps.push({
        state: {
            type: "circular-enqueue",
            array: queue.array.slice(),
            front: queue.front,
            rear: queue.rear,
            capacity: queue.capacity,
            value: value,
            phase: "done",
            highlightIndex: oldRear
        },
        description: value + " 入队成功！放入位置 " + oldRear + "，rear 从 " + oldRear + " 变成 " + queue.rear,
        why: "关键在这里！使用 rear = (rear + 1) % capacity 取模运算，让 rear 在到达末尾后绕回开头",
        next: "入队完成！队列现在是 [" + [10, 20, 30, value].join(", ") + "]",
        code: "array[" + oldRear + "] = " + value + "\nrear = (" + oldRear + " + 1) % " + queue.capacity + " = " + queue.rear
    });

    return steps;
}

function generateCircularDequeueSteps() {
    var steps = [];
    var queue = new CircularQueue();
    queue.array = [10, 20, 30, null, null];
    queue.front = 0;
    queue.rear = 3;

    steps.push({
        state: {
            type: "circular-dequeue",
            array: queue.array.slice(),
            front: queue.front,
            rear: queue.rear,
            capacity: queue.capacity,
            phase: "initial"
        },
        description: "初始循环队列：[10, 20, 30, _, _]，front=0, rear=3",
        why: null,
        next: "从 front=0 取出元素 10，然后 front = (0+1)%5 = 1（取模！）",
        code: "item = array[front]\nfront = (front + 1) % capacity"
    });

    var oldFront = queue.front;
    var item = queue.array[oldFront];

    steps.push({
        state: {
            type: "circular-dequeue",
            array: queue.array.slice(),
            front: queue.front,
            rear: queue.rear,
            capacity: queue.capacity,
            value: item,
            phase: "mark",
            highlightIndex: oldFront
        },
        description: "front 指向位置 " + oldFront + "，元素是 " + item,
        why: "front 指向队头元素，出队就是取出 front 位置的元素",
        next: "取出元素 " + item + "，然后 front 移动",
        code: "item = array[front]  // " + item
    });

    queue.array[oldFront] = null;
    queue.front = (queue.front + 1) % queue.capacity;

    steps.push({
        state: {
            type: "circular-dequeue",
            array: queue.array.slice(),
            front: queue.front,
            rear: queue.rear,
            capacity: queue.capacity,
            value: item,
            phase: "done"
        },
        description: "出队 " + item + "！front 从 " + oldFront + " 变成 " + queue.front,
        why: "front 也用取模运算 (front + 1) % capacity，和 rear 一样可以绕回",
        next: "出队完成！front 也会循环，不会浪费前面的空位",
        code: "array[" + oldFront + "] = null\nfront = (" + oldFront + " + 1) % " + queue.capacity + " = " + queue.front
    });

    return steps;
}

// ============================================================================
// 循环队列完整演示步骤生成
// ============================================================================

function generateRingSteps() {
    var steps = [];
    var queue = new CircularQueue();
    queue.capacity = 5;

    // 步骤1：初始空队列
    steps.push({
        state: {
            type: "ring",
            array: [null, null, null, null, null],
            front: 0,
            rear: 0,
            capacity: 5,
            phase: "initial"
        },
        description: "初始状态：空队列，front=0, rear=0",
        why: "队空条件：front == rear",
        next: "开始依次入队 10, 20, 30, 40, 50，观察 rear 的变化",
        code: "队空: front == rear"
    });

    // 步骤2-6：入队 10, 20, 30, 40, 50
    var values = [10, 20, 30, 40, 50];
    for (var i = 0; i < values.length; i++) {
        var v = values[i];
        var oldRear = queue.rear;
        queue.array[queue.rear] = v;
        queue.rear = (queue.rear + 1) % queue.capacity;

        steps.push({
            state: {
                type: "ring",
                array: queue.array.slice(),
                front: queue.front,
                rear: queue.rear,
                capacity: queue.capacity,
                value: v,
                highlightIndex: oldRear,
                phase: "enqueue-" + i
            },
            description: "enqueue(" + v + "): 放入位置 " + oldRear + "，rear 从 " + oldRear + " → " + queue.rear,
            why: "rear = (rear + 1) % capacity，每次移动都用取模",
            next: i < values.length - 1 ? "继续入队 " + values[i + 1] : "队满后再入队会怎样？",
            code: "rear = (" + oldRear + " + 1) % " + queue.capacity + " = " + queue.rear
        });
    }

    // 步骤7：队满状态
    steps.push({
        state: {
            type: "ring",
            array: queue.array.slice(),
            front: queue.front,
            rear: queue.rear,
            capacity: queue.capacity,
            phase: "full"
        },
        description: "队满！front=" + queue.front + ", rear=" + queue.rear,
        why: "队满条件：(rear + 1) % capacity == front",
        next: "出队两个元素，看看 front 如何移动",
        code: "队满: (rear + 1) % capacity == front"
    });

    // 步骤8-9：出队 10, 20
    for (var j = 0; j < 2; j++) {
        var oldFront = queue.front;
        var item = queue.array[oldFront];
        queue.array[oldFront] = null;
        queue.front = (queue.front + 1) % queue.capacity;

        steps.push({
            state: {
                type: "ring",
                array: queue.array.slice(),
                front: queue.front,
                rear: queue.rear,
                capacity: queue.capacity,
                value: item,
                highlightIndex: queue.front,
                phase: "dequeue-" + j
            },
            description: "dequeue(): 取出 " + item + "，front 从 " + oldFront + " → " + queue.front,
            why: "front 也用取模运算，可以循环",
            next: j < 1 ? "继续出队" : "现在入队 60，看看 rear 绕回！",
            code: "front = (" + oldFront + " + 1) % " + queue.capacity + " = " + queue.front
        });
    }

    // 步骤10：再入队 60，rear 绕回
    var newRear = queue.rear;
    queue.array[queue.rear] = 60;
    queue.rear = (queue.rear + 1) % queue.capacity;

    steps.push({
        state: {
            type: "ring",
            array: queue.array.slice(),
            front: queue.front,
            rear: queue.rear,
            capacity: queue.capacity,
            value: 60,
            highlightIndex: newRear,
            phase: "wrap"
        },
        description: "enqueue(60): rear 从 " + newRear + " 绕回到 " + queue.rear + "！",
        why: "(rear + 1) % capacity 让 rear 在 4 之后回到 0，这就是'循环'！",
        next: "循环队列解决了假溢出！rear 可以绕回来",
        code: "rear = (" + newRear + " + 1) % " + queue.capacity + " = " + queue.rear
    });

    // 最终状态
    steps.push({
        state: {
            type: "ring",
            array: queue.array.slice(),
            front: queue.front,
            rear: queue.rear,
            capacity: queue.capacity,
            phase: "final"
        },
        description: "循环队列完成！即使前面有空位，rear 也能绕回来继续入队",
        why: "取模运算 % capacity 把线性数组变成了环，永远不会假溢出",
        next: "普通队列的 rear++ 只能一直增大，循环队列的 rear = (rear+1)%cap 可以循环",
        code: "// 循环队列永不假溢出！"
    });

    return steps;
}

// ============================================================================
// 渲染函数
// ============================================================================

// 环形布局位置
function getRingPosition(index, capacity) {
    var positions = [
        { left: 112, top: 20 },   // 0 - 上
        { left: 200, top: 90 },   // 1 - 右上
        { left: 200, top: 180 },   // 2 - 右下
        { left: 112, top: 250 },   // 3 - 下
        { left: 24, top: 90 }     // 4 - 左
    ];
    return positions[index];
}

// 渲染普通队列（水平条形）
function renderSimpleQueue(state) {
    var container = document.getElementById("visualArea");
    container.innerHTML = "";

    var array = state.array;
    var capacity = state.capacity;
    var front = state.front;
    var rear = state.rear;

    var div = document.createElement("div");
    div.className = "simple-queue-container";

    // 标签行
    var labelDiv = document.createElement("div");
    labelDiv.className = "simple-queue-label";
    labelDiv.innerHTML = '<span style="color: var(--color-primary); font-weight: 700;">← front=' + front + '</span><span style="color: var(--color-success); font-weight: 700;">← rear=' + rear + '</span>';
    div.appendChild(labelDiv);

    // 队列行
    var rowDiv = document.createElement("div");
    rowDiv.className = "simple-queue-row";

    for (var i = 0; i < capacity; i++) {
        // 箭头
        if (i > 0) {
            var arrow = document.createElement("div");
            arrow.className = "arrow-space";
            arrow.textContent = "→";
            rowDiv.appendChild(arrow);
        }

        var cell = document.createElement("div");
        cell.className = "simple-cell";

        var isFront = (i === front);
        var isRear = (i === rear);
        var isActive = (state.highlightIndex === i);

        if (array[i] === null) {
            cell.classList.add("empty");
            cell.textContent = "_";
        } else {
            cell.classList.add("has-value");
            cell.textContent = array[i];
        }

        if (isActive) {
            cell.classList.add("active");
        }

        if (isFront && isRear) {
            cell.classList.add("front-rear-cell");
        } else if (isFront) {
            cell.classList.add("front-cell");
        } else if (isRear) {
            cell.classList.add("rear-cell");
        }

        // 索引
        var idxSpan = document.createElement("span");
        idxSpan.className = "cell-index";
        idxSpan.textContent = i;
        cell.appendChild(idxSpan);

        rowDiv.appendChild(cell);
    }

    div.appendChild(rowDiv);
    container.appendChild(div);
}

// 渲染循环队列（环形）
function renderCircularQueue(state) {
    var container = document.getElementById("visualArea");
    container.innerHTML = "";

    var queueRing = document.createElement("div");
    queueRing.className = "queue-ring";

    var array = state.array;
    var capacity = state.capacity;
    var front = state.front;
    var rear = state.rear;

    for (var i = 0; i < capacity; i++) {
        var pos = getRingPosition(i, capacity);

        var cell = document.createElement("div");
        cell.className = "queue-cell";

        if (array[i] === null) {
            cell.classList.add("empty");
            cell.textContent = "_";
        } else {
            cell.textContent = array[i];
        }

        if (state.highlightIndex === i) {
            cell.classList.add("active");
        }

        var isFront = (i === front);
        var isRear = (i === rear);

        if (isFront && isRear) {
            cell.classList.add("front-rear-marker");
        } else if (isFront) {
            cell.classList.add("front-marker");
        } else if (isRear) {
            cell.classList.add("rear-marker");
        }

        cell.style.left = pos.left + "px";
        cell.style.top = pos.top + "px";

        // 索引
        var idxSpan = document.createElement("span");
        idxSpan.className = "cell-index";
        idxSpan.textContent = i;
        cell.appendChild(idxSpan);

        // front 标签
        if (isFront) {
            var frontLabel = document.createElement("span");
            frontLabel.className = "front-label";
            frontLabel.textContent = "F";
            cell.appendChild(frontLabel);
        }

        // rear 标签
        if (isRear) {
            var rearLabel = document.createElement("span");
            rearLabel.className = "rear-label";
            rearLabel.textContent = "R";
            cell.appendChild(rearLabel);
        }

        queueRing.appendChild(cell);
    }

    container.appendChild(queueRing);
}

function render(state) {
    var type = state.type;
    var dataDisplay = document.getElementById("dataDisplay");

    // 根据类型选择渲染方式
    if (type === "simple-enqueue" || type === "simple-dequeue") {
        renderSimpleQueue(state);
    } else {
        renderCircularQueue(state);
    }

    // 更新数据展示
    if (type === "simple-enqueue" || type === "simple-dequeue") {
        var elems = [];
        for (var j = state.front; j < state.rear; j++) {
            if (state.array[j] !== null) elems.push(state.array[j]);
        }
        dataDisplay.textContent = "普通队列: [" + elems.join(", ") + "] (front=" + state.front + ", rear=" + state.rear + ")";
    } else {
        var elements = [];
        var i = state.front;
        while (i !== state.rear) {
            elements.push(state.array[i]);
            i = (i + 1) % state.capacity;
        }
        dataDisplay.textContent = "循环队列: [" + elements.join(", ") + "] (front=" + state.front + ", rear=" + state.rear + ")";
    }

    // 更新 info
    document.getElementById("frontValue").textContent = state.front;
    document.getElementById("rearValue").textContent = state.rear;

    if (type === "simple-enqueue" || type === "simple-dequeue") {
        document.getElementById("sizeValue").textContent = state.rear - state.front;
    } else {
        var size = (state.rear - state.front + state.capacity) % state.capacity;
        document.getElementById("sizeValue").textContent = size;
    }

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
    var value = parseInt(document.getElementById("valueInput").value) || 10;

    var valueLabel = document.getElementById("valueLabel");
    var valueInput = document.getElementById("valueInput");

    switch (operation) {
        case "simple-enqueue":
        case "circular-enqueue":
            valueLabel.style.display = "inline";
            valueLabel.textContent = "入队值：";
            valueInput.style.display = "inline-block";
            break;
        default:
            valueLabel.style.display = "none";
            valueInput.style.display = "none";
    }

    switch (operation) {
        case "simple-enqueue":
            steps = generateSimpleEnqueueSteps(value);
            break;
        case "simple-dequeue":
            steps = generateSimpleDequeueSteps();
            break;
        case "circular-enqueue":
            steps = generateCircularEnqueueSteps(value);
            break;
        case "circular-dequeue":
            steps = generateCircularDequeueSteps();
            break;
        case "ring":
            steps = generateRingSteps();
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

window.addEventListener("DOMContentLoaded", function() {
    var buttonRow = document.getElementById("buttonRow");
    buttonRow.innerHTML =
        '<button class="btn btn-secondary" id="btnPrev" disabled>← 上一步</button>' +
        '<span class="step-indicator" id="stepIndicator">步骤 1 / 1</span>' +
        '<button class="btn btn-primary" id="btnNext" disabled>下一步 →</button>' +
        '<button class="btn btn-secondary" id="btnReset">重置</button>';

    var opTabs = document.querySelectorAll(".op-tab");
    opTabs.forEach(function(tab) {
        tab.addEventListener("click", function() {
            opTabs.forEach(function(t) { t.classList.remove("active"); });
            tab.classList.add("active");
            init(tab.getAttribute("data-op"));
        });
    });

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

    init("simple-enqueue");
});
