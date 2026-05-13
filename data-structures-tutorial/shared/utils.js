/**
 * shared/utils.js
 * 通用工具：步骤管理、按钮组件等
 * 每个可视化页面都会用到这些基础功能
 */

/* ==========================================================================
   步骤管理器 (StepManager)
   ========================================================================== */

/**
 * 创建步骤管理器
 * @param {Array} steps - 步骤数组，每个元素是一个快照对象
 * @param {Function} renderFunc - 渲染函数，接收 (state, step) 参数
 * @returns {Object} 管理器对象
 */
function createStepManager(steps, renderFunc) {
    var currentStep = 0;

    var manager = {
        /**
         * 获取当前步骤
         */
        getCurrentStep: function() {
            return currentStep;
        },

        /**
         * 获取总步骤数
         */
        getTotalSteps: function() {
            return steps.length;
        },

        /**
         * 获取当前状态
         */
        getState: function() {
            return steps[currentStep].state;
        },

        /**
         * 获取当前步骤信息
         */
        getStepInfo: function() {
            return steps[currentStep];
        },

        /**
         * 是否有上一步
         */
        hasPrev: function() {
            return currentStep > 0;
        },

        /**
         * 是否有下一步
         */
        hasNext: function() {
            return currentStep < steps.length - 1;
        },

        /**
         * 上一步
         */
        prev: function() {
            if (this.hasPrev()) {
                currentStep--;
                this.render();
            }
            return this.hasPrev();
        },

        /**
         * 下一步
         */
        next: function() {
            if (this.hasNext()) {
                currentStep++;
                this.render();
            }
            return this.hasNext();
        },

        /**
         * 跳转到第一步
         */
        reset: function() {
            currentStep = 0;
            this.render();
        },

        /**
         * 渲染当前步骤
         */
        render: function() {
            if (renderFunc && steps[currentStep]) {
                renderFunc(steps[currentStep].state, steps[currentStep]);
            }
        },

        /**
         * 重新初始化（更换数据后用）
         */
        reinit: function(newSteps, newRenderFunc) {
            if (newSteps) steps = newSteps;
            if (newRenderFunc) renderFunc = newRenderFunc;
            currentStep = 0;
            this.render();
        }
    };

    return manager;
}

/* ==========================================================================
   按钮组件
   ========================================================================== */

/**
 * 创建标准导航按钮组
 * @param {Object} container - 要添加按钮的 DOM 元素
 * @param {Object} stepManager - 步骤管理器
 * @param {Function} onUpdate - 更新回调，用于更新步骤指示器等
 */
function createNavButtons(container, stepManager, onUpdate) {
    var btnPrev = document.createElement("button");
    btnPrev.className = "btn btn-secondary";
    btnPrev.textContent = "← 上一步";

    var btnNext = document.createElement("button");
    btnNext.className = "btn btn-primary";
    btnNext.textContent = "下一步 →";

    var btnReset = document.createElement("button");
    btnReset.className = "btn btn-secondary";
    btnReset.textContent = "重置";

    var stepIndicator = document.createElement("span");
    stepIndicator.className = "step-indicator";

    function updateButtons() {
        btnPrev.disabled = !stepManager.hasPrev();
        btnNext.disabled = !stepManager.hasNext();
        var curr = stepManager.getCurrentStep() + 1;
        var total = stepManager.getTotalSteps();
        stepIndicator.innerHTML = "步骤 <strong>" + curr + "</strong> / " + total;
        if (onUpdate) {
            onUpdate(stepManager.getStepInfo(), curr, total);
        }
    }

    btnPrev.addEventListener("click", function() {
        stepManager.prev();
        updateButtons();
    });

    btnNext.addEventListener("click", function() {
        stepManager.next();
        updateButtons();
    });

    btnReset.addEventListener("click", function() {
        stepManager.reset();
        updateButtons();
    });

    container.appendChild(btnPrev);
    container.appendChild(stepIndicator);
    container.appendChild(btnNext);
    container.appendChild(btnReset);

    updateButtons();

    return {
        prevBtn: btnPrev,
        nextBtn: btnNext,
        resetBtn: btnReset,
        indicator: stepIndicator,
        update: updateButtons
    };
}

/* ==========================================================================
   SVG 工具
   ========================================================================== */

/**
 * 创建 SVG 命名空间元素
 */
function createSVGElement(tag, attrs) {
    var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    if (attrs) {
        for (var key in attrs) {
            el.setAttribute(key, attrs[key]);
        }
    }
    return el;
}

/**
 * 在 SVG 中绘制圆形节点
 */
function drawCircle(svg, x, y, r, className, text) {
    var g = createSVGElement("g", { class: "node-group" });

    var circle = createSVGElement("circle", {
        cx: x,
        cy: y,
        r: r,
        class: "node " + (className || "")
    });

    var label = createSVGElement("text", {
        x: x,
        y: y,
        class: "node-label"
    });
    label.textContent = text;

    g.appendChild(circle);
    g.appendChild(label);
    svg.appendChild(g);

    return g;
}

/**
 * 在 SVG 中绘制连接线
 */
function drawLine(svg, x1, y1, x2, y2, className) {
    var line = createSVGElement("line", {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        class: "edge " + (className || "")
    });
    svg.appendChild(line);
    return line;
}

/**
 * 清空 SVG 内容
 */
function clearSVG(svg) {
    while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
    }
    // 重新添加箭头标记定义
    var defs = createSVGElement("defs");
    defs.innerHTML = '<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#9e9e9e"/></marker>';
    svg.appendChild(defs);
}

/* ==========================================================================
   状态高亮常量
   ========================================================================== */

var HighlightState = {
    ACTIVE: "active",   // 当前操作 - 红色
    DONE: "done",       // 已操作过 - 黄色
    IDLE: "idle"        // 无关元素 - 灰色
};

/* ==========================================================================
   数组工具
   ========================================================================== */

/**
 * 深拷贝数组（用于保存状态快照）
 */
function deepCopyArray(arr) {
    if (Array.isArray(arr)) {
        return arr.map(function(item) {
            if (Array.isArray(item)) {
                return deepCopyArray(item);
            } else if (item && typeof item === "object") {
                return deepCopyObject(item);
            }
            return item;
        });
    }
    return arr;
}

/**
 * 深拷贝对象
 */
function deepCopyObject(obj) {
    var copy = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var val = obj[key];
            if (Array.isArray(val)) {
                copy[key] = deepCopyArray(val);
            } else if (val && typeof val === "object") {
                copy[key] = deepCopyObject(val);
            } else {
                copy[key] = val;
            }
        }
    }
    return copy;
}

/**
 * 生成带索引的数组快照
 */
function makeArraySnapshot(arr, highlights) {
    return {
        array: deepCopyArray(arr),
        highlights: highlights || {}
    };
}

/* ==========================================================================
   二叉树工具
   ========================================================================== */

/**
 * 二叉树节点类
 */
function TreeNode(value) {
    this.value = value;
    this.left = null;
    this.right = null;
}

/**
 * 从数组构建二叉树（层序）
 */
function buildTreeFromArray(arr) {
    if (!arr || arr.length === 0) return null;

    var root = new TreeNode(arr[0]);
    var queue = [root];
    var i = 1;

    while (queue.length > 0 && i < arr.length) {
        var node = queue.shift();

        // 左孩子
        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;

        // 右孩子
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }

    return root;
}

/**
 * 计算树的节点位置（用于 SVG 绘制）
 * 返回 { nodes: [{node, x, y}], edges: [{x1, y1, x2, y2}] }
 */
function calculateTreeLayout(root, startX, startY, levelGapX, levelGapY) {
    var nodes = [];
    var edges = [];

    if (!root) return { nodes: nodes, edges: edges };

    var queue = [{ node: root, x: startX, y: startY, parent: null }];

    while (queue.length > 0) {
        var item = queue.shift();
        var node = item.node;
        var x = item.x;
        var y = item.y;

        nodes.push({ node: node, x: x, y: y });

        if (item.parent) {
            edges.push({
                x1: item.parent.x,
                y1: item.parent.y + 20,
                x2: x,
                y2: y - 20
            });
        }

        if (node.left) {
            queue.push({ node: node.left, x: x - levelGapX, y: y + levelGapY, parent: { x: x, y: y } });
        }
        if (node.right) {
            queue.push({ node: node.right, x: x + levelGapX, y: y + levelGapY, parent: { x: x, y: y } });
        }
    }

    return { nodes: nodes, edges: edges };
}

/* ==========================================================================
   链表工具
   ========================================================================== */

/**
 * 链表节点类
 */
function ListNode(value) {
    this.value = value;
    this.next = null;
}

/**
 * 从数组构建链表
 */
function buildListFromArray(arr) {
    if (!arr || arr.length === 0) return null;

    var head = new ListNode(arr[0]);
    var current = head;

    for (var i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }

    return head;
}

/**
 * 计算链表节点位置
 */
function calculateListLayout(head, startX, startY, gapX) {
    var nodes = [];
    var edges = [];
    var current = head;
    var x = startX;
    var y = startY;

    while (current) {
        nodes.push({ node: current, x: x, y: y });

        if (current.next) {
            edges.push({
                x1: x + 30,
                y1: y,
                x2: x + gapX - 10,
                y2: y
            });
        }

        current = current.next;
        x += gapX;
    }

    return { nodes: nodes, edges: edges };
}

/* ==========================================================================
   导出（兼容浏览器和 Node.js）
   ========================================================================== */

// 浏览器环境：直接作为全局函数使用
// Node.js 环境：通过 module.exports 导出
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        createStepManager: createStepManager,
        createNavButtons: createNavButtons,
        createSVGElement: createSVGElement,
        drawCircle: drawCircle,
        drawLine: drawLine,
        clearSVG: clearSVG,
        HighlightState: HighlightState,
        deepCopyArray: deepCopyArray,
        deepCopyObject: deepCopyObject,
        makeArraySnapshot: makeArraySnapshot,
        TreeNode: TreeNode,
        buildTreeFromArray: buildTreeFromArray,
        calculateTreeLayout: calculateTreeLayout,
        ListNode: ListNode,
        buildListFromArray: buildListFromArray,
        calculateListLayout: calculateListLayout
    };
}
