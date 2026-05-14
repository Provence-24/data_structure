/**
 * visualization.js
 * 数组与顺序表 - 交互演示逻辑
 * 对应 visualization.html
 *
 * 步进逻辑：每个操作生成一系列步骤快照，用户点击"下一步"逐步推进
 */

// ============================================================================
// 全局状态
// ============================================================================

var currentOperation = "array-insert";
var steps = [];
var stepManager = null;

// ============================================================================
// 步骤生成函数
// ============================================================================

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

    if (state.type === "array") {
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
        case "array-insert":
            // 需要输入值
            valueLabel.style.display = "inline";
            valueLabel.textContent = "数值：";
            valueInput.style.display = "inline-block";
            break;
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
