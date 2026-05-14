/**
 * visualization.js
 * 栈 - 交互演示逻辑
 * 对应 visualization.html

 * 演示内容：
 * 1. push 入栈
 * 2. pop 出栈
 * 3. 括号匹配
 */

// ============================================================================
// 全局状态
// ============================================================================

var currentOperation = "push";
var steps = [];
var stepManager = null;

// ============================================================================
// 步骤生成函数
// ============================================================================

/**
 * 生成 push 入栈步骤
 */
function generatePushSteps(value) {
    var steps = [];
    var stack = [10, 20, 30];  // 初始栈内容

    // 初始状态
    steps.push({
        state: {
            type: "stack",
            stack: stack.slice(),
            operation: "push",
            value: value,
            phase: "initial"
        },
        description: "初始栈：[10, 20, 30]，准备入栈 " + value,
        why: null,
        next: "将 " + value + " 放到栈顶（列表末尾）",
        code: "stack.push(" + value + ")"
    });

    // 入栈操作
    stack.push(value);
    steps.push({
        state: {
            type: "stack",
            stack: stack.slice(),
            operation: "push",
            value: value,
            phase: "done",
            newItem: value
        },
        description: value + " 入栈成功！栈现在是 [" + stack.join(", ") + "]",
        why: "push 操作把元素放到栈顶（列表末尾），时间复杂度 O(1)",
        next: "入栈完成！",
        code: "stack.push(" + value + ")\n// 栈顶索引: " + (stack.length - 1)
    });

    return steps;
}

/**
 * 生成 pop 出栈步骤
 */
function generatePopSteps() {
    var steps = [];
    var stack = [10, 20, 30];  // 初始栈内容
    var poppedValue = stack[stack.length - 1];

    // 初始状态
    steps.push({
        state: {
            type: "stack",
            stack: stack.slice(),
            operation: "pop",
            phase: "initial"
        },
        description: "初始栈：[" + stack.join(", ") + "]，准备弹出栈顶",
        why: null,
        next: "移除并返回栈顶元素 " + poppedValue,
        code: "value = stack.pop()"
    });

    // 标记栈顶
    steps.push({
        state: {
            type: "stack",
            stack: stack.slice(),
            operation: "pop",
            phase: "top",
            topIndex: stack.length - 1
        },
        description: "栈顶是 " + poppedValue + "，准备弹出",
        why: "栈是后进先出，pop 只能从栈顶移除元素",
        next: "执行 pop 操作",
        code: "top = stack[" + (stack.length - 1) + "]  // " + poppedValue
    });

    // 执行 pop
    stack.pop();
    steps.push({
        state: {
            type: "stack",
            stack: stack.slice(),
            operation: "pop",
            poppedValue: poppedValue,
            phase: "done"
        },
        description: "弹出 " + poppedValue + "！栈现在是 [" + stack.join(", ") + "]",
        why: "pop 操作移除并返回栈顶元素（列表末尾），时间复杂度 O(1)",
        next: "出栈完成！",
        code: "value = stack.pop()  // " + poppedValue + "\n// 栈: [" + stack.join(", ") + "]"
    });

    return steps;
}

/**
 * 生成括号匹配步骤
 */
function generateBracketSteps(expression) {
    var steps = [];
    var stack = [];
    var pairs = {')': '(', ']': '[', '}': '{'};
    var leftBrackets = '([{';
    var rightBrackets = ')]}';
    var output = [];

    // 初始状态
    steps.push({
        state: {
            type: "bracket",
            expression: expression,
            index: -1,
            stack: [],
            output: "",
            phase: "initial"
        },
        description: "表达式: \"" + expression + "\"，准备检查括号匹配",
        why: null,
        next: "从左到右扫描每个字符",
        code: "stack = []"
    });

    // 逐字符处理
    for (var i = 0; i < expression.length; i++) {
        var char = expression[i];
        var isLeft = leftBrackets.indexOf(char) !== -1;
        var isRight = rightBrackets.indexOf(char) !== -1;

        if (isLeft) {
            // 左括号
            stack.push(char);
            steps.push({
                state: {
                    type: "bracket",
                    expression: expression,
                    index: i,
                    currentChar: char,
                    stack: stack.slice(),
                    output: output.join(''),
                    phase: "push"
                },
                description: "位置 " + i + "：遇到 '" + char + "'（左括号），入栈",
                why: "遇到左括号就入栈，后面用来匹配右括号",
                next: "继续扫描下一个字符",
                code: "stack.push('" + char + "')\n// stack: [" + stack.join(", ") + "]"
            });
        } else if (isRight) {
            // 右括号
            if (stack.length === 0) {
                steps.push({
                    state: {
                        type: "bracket",
                        expression: expression,
                        index: i,
                        currentChar: char,
                        stack: [],
                        output: output.join(''),
                        phase: "error-empty",
                        error: true
                    },
                    description: "位置 " + i + "：遇到 '" + char + "'（右括号），但栈为空！",
                    why: "右括号没有对应的左括号来匹配，表达式不匹配",
                    next: "匹配失败",
                    code: "ERROR: stack is empty!"
                });
                return steps;
            }

            var top = stack[stack.length - 1];
            var expected = pairs[char];

            if (top !== expected) {
                steps.push({
                    state: {
                        type: "bracket",
                        expression: expression,
                        index: i,
                        currentChar: char,
                        stack: stack.slice(),
                        output: output.join(''),
                        phase: "error-mismatch",
                        error: true
                    },
                    description: "位置 " + i + "：遇到 '" + char + "'，栈顶是 '" + top + "'，不匹配！",
                    why: "右括号要和栈顶的左括号匹配，但 '" + char + "' 应该匹配 '" + expected + "'，不是 '" + top + "'",
                    next: "匹配失败",
                    code: "ERROR: '" + top + "' != '" + expected + "'"
                });
                return steps;
            }

            // 匹配成功
            stack.pop();
            steps.push({
                state: {
                    type: "bracket",
                    expression: expression,
                    index: i,
                    currentChar: char,
                    stack: stack.slice(),
                    output: output.join(''),
                    phase: "match"
                },
                description: "位置 " + i + "：遇到 '" + char + "'，栈顶 '" + top + "' 匹配！弹出栈顶",
                why: "右括号找到匹配的左括号，栈顶左括号完成使命，弹出",
                next: "继续扫描下一个字符",
                code: "stack.pop()\n// '" + char + "' matches '" + top + "'\n// stack: [" + stack.join(", ") + "]"
            });
        }
    }

    // 扫描结束
    if (stack.length === 0) {
        steps.push({
            state: {
                type: "bracket",
                expression: expression,
                index: expression.length,
                stack: [],
                output: output.join(''),
                phase: "success"
            },
            description: "扫描完成！栈为空，括号全部匹配 ✓",
            why: "所有左括号都找到了匹配的右括号，表达式正确",
            next: "匹配成功！",
            code: "stack is empty\n// SUCCESS!"
        });
    } else {
        steps.push({
            state: {
                type: "bracket",
                expression: expression,
                index: expression.length,
                stack: stack.slice(),
                output: output.join(''),
                phase: "error-remaining",
                error: true
            },
            description: "扫描完成！但栈中还有 " + stack.length + " 个左括号未匹配 ✗",
            why: "有左括号没有找到对应的右括号，表达式不匹配",
            next: "匹配失败",
            code: "ERROR: " + stack.length + " unmatched brackets"
        });
    }

    return steps;
}

// ============================================================================
// 渲染函数
// ============================================================================

function renderStack(state) {
    var stackFrame = document.getElementById("stackFrame");
    var topLabel = document.getElementById("topLabel");
    stackFrame.innerHTML = "";

    var stack = state.stack || [];
    var highlightIndex = state.topIndex;

    // 渲染栈元素（从栈底到栈顶）
    for (var i = 0; i < stack.length; i++) {
        var item = document.createElement("div");
        var itemClass = "stack-item";

        if (i === highlightIndex) {
            itemClass += " active";
        } else if (i < highlightIndex) {
            itemClass += " done";
        } else if (state.newItem !== undefined && stack[i] === state.newItem) {
            itemClass += " new";
        }

        item.className = itemClass;
        item.textContent = stack[i];
        stackFrame.appendChild(item);
    }

    // 更新 top 标签
    if (stack.length > 0) {
        topLabel.style.display = "block";
    } else {
        topLabel.style.display = "none";
    }
}

function renderBracket(state) {
    var stackFrame = document.getElementById("stackFrame");
    var topLabel = document.getElementById("topLabel");
    var expression = state.expression;

    stackFrame.innerHTML = "";

    // 显示表达式
    var exprDiv = document.createElement("div");
    exprDiv.style.cssText = "font-family: var(--font-mono); font-size: 1.3rem; margin-bottom: 20px; letter-spacing: 4px;";
    exprDiv.textContent = expression;
    stackFrame.appendChild(exprDiv);

    // 高亮当前位置
    if (state.index >= 0 && state.index < expression.length) {
        var chars = expression.split("");
        exprDiv.innerHTML = "";
        for (var i = 0; i < chars.length; i++) {
            var span = document.createElement("span");
            span.textContent = chars[i];

            if (i === state.index) {
                span.style.cssText = "background: var(--color-active); color: white; padding: 2px 4px; border-radius: 3px;";
            } else if (state.phase === "success" || state.phase === "error-remaining") {
                span.style.cssText = "background: var(--color-success); color: white; padding: 2px 4px; border-radius: 3px;";
            } else if (state.error) {
                span.style.cssText = "background: var(--color-active); color: white; padding: 2px 4px; border-radius: 3px;";
            }

            exprDiv.appendChild(span);
        }
    }

    // 显示栈
    var stackLabel = document.createElement("div");
    stackLabel.className = "stack-label";
    stackLabel.textContent = "栈:";
    stackLabel.style.cssText = "margin-top: 20px; margin-bottom: 8px;";
    stackFrame.appendChild(stackLabel);

    var stack = state.stack || [];
    var stackDiv = document.createElement("div");
    stackDiv.style.cssText = "display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 16px;";

    for (var j = 0; j < stack.length; j++) {
        var bracket = document.createElement("span");
        bracket.textContent = stack[j];
        bracket.style.cssText = "padding: 6px 14px; background: var(--color-active); color: white; border-radius: 4px; font-family: var(--font-mono); font-size: 1rem;";
        stackDiv.appendChild(bracket);
    }

    if (stack.length === 0 && (state.phase === "success" || state.phase === "initial")) {
        var empty = document.createElement("span");
        empty.textContent = "(空)";
        empty.style.cssText = "color: #999; font-size: 0.9rem;";
        stackDiv.appendChild(empty);
    }

    stackFrame.appendChild(stackDiv);

    // 隐藏 top 标签（栈模式下才显示）
    topLabel.style.display = "none";

    // 显示匹配结果
    if (state.phase === "success") {
        var result = document.createElement("div");
        result.textContent = "✓ 匹配成功";
        result.style.cssText = "color: var(--color-success); font-size: 1.2rem; font-weight: 700; margin-top: 10px;";
        stackFrame.appendChild(result);
    } else if (state.error) {
        var result = document.createElement("div");
        result.textContent = "✗ 匹配失败";
        result.style.cssText = "color: var(--color-active); font-size: 1.2rem; font-weight: 700; margin-top: 10px;";
        stackFrame.appendChild(result);
    }
}

function render(state) {
    // 更新数据展示
    var dataDisplay = document.getElementById("dataDisplay");
    if (state.type === "stack") {
        dataDisplay.textContent = "栈: [" + (state.stack || []).join(", ") + "]";
    } else if (state.type === "bracket") {
        var status = state.phase === "success" ? "匹配 ✓" :
                     state.error ? "不匹配 ✗" : "检查中...";
        dataDisplay.textContent = "表达式: \"" + state.expression + "\"  " + status;
    }

    // 渲染可视化
    if (state.type === "stack") {
        renderStack(state);
    } else if (state.type === "bracket") {
        renderBracket(state);
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

function init(operation, extra) {
    currentOperation = operation;

    var value = parseInt(document.getElementById("valueInput") ? document.getElementById("valueInput").value : 10) || 10;

    // 根据操作类型显示/隐藏输入框
    var valueLabel = document.getElementById("valueLabel");
    var valueInput = document.getElementById("valueInput");

    switch (operation) {
        case "push":
            // push 需要输入值
            valueLabel.style.display = "inline";
            valueLabel.textContent = "入栈值：";
            valueInput.style.display = "inline-block";
            break;
        case "pop":
        case "bracket":
            // pop 和 bracket 不需要输入值
            valueLabel.style.display = "none";
            valueInput.style.display = "none";
            break;
    }

    switch (operation) {
        case "push":
            steps = generatePushSteps(value);
            break;
        case "pop":
            steps = generatePopSteps();
            break;
        case "bracket":
            steps = generateBracketSteps(extra || "((a+b)*c)");
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
            var op = tab.getAttribute("data-op");
            init(op, op === "bracket" ? "((a+b)*c)" : null);
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
        init(currentOperation, currentOperation === "bracket" ? "((a+b)*c)" : null);
    });

    document.getElementById("restartBtn").addEventListener("click", function() {
        init(currentOperation, currentOperation === "bracket" ? "((a+b)*c)" : null);
    });

    // 初始加载
    init("push");
});
