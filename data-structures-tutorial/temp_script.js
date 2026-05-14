
        // ============================================================================
        // 全局状态
        // ============================================================================

        var currentOperation = "factorial";
        var steps = [];
        var stepManager = null;

        // ============================================================================
        // 阶乘步骤生成
        // ============================================================================

        function generateFactorialSteps(n) {
            var steps = [];
            var stack = [];

            // 初始状态
            steps.push({
                state: {
                    type: "factorial",
                    n: n,
                    phase: "start",
                    stack: [],
                    currentNode: null,
                    returnValue: null
                },
                description: "阶乘 factorial(" + n + ")",
                why: "递归需要明确输入值",
                next: "开始递归调用"
            });

            // 生成递归调用步骤
            function addCallSteps(n, depth, parentReturn) {
                stack.push(n);
                var callStack = stack.slice();

                // 调用当前节点
                steps.push({
                    state: {
                        type: "factorial",
                        n: n,
                        phase: "call",
                        stack: callStack,
                        currentNode: n,
                        depth: depth,
                        returnValue: null
                    },
                    description: "调用 factorial(" + n + ")",
                    why: "压栈：为 factorial(" + n + ") 分配栈帧",
                    next: n > 1 ? "递归调用 factorial(" + (n - 1) + ")" : "到达终止条件，返回 1"
                });

                if (n <= 1) {
                    // 终止条件返回
                    stack.pop();
                    steps.push({
                        state: {
                            type: "factorial",
                            n: n,
                            phase: "return",
                            stack: stack.slice(),
                            currentNode: n,
                            depth: depth,
                            returnValue: 1
                        },
                        description: "factorial(" + n + ") = 1，返回",
                        why: "终止条件：n <= 1 时返回 1",
                        next: parentReturn !== null ? "继续返回" : "递归结束"
                    });
                    return 1;
                } else {
                    var childReturn = addCallSteps(n - 1, depth + 1, n);
                    var result = n * childReturn;

                    stack.pop();
                    steps.push({
                        state: {
                            type: "factorial",
                            n: n,
                            phase: "compute",
                            stack: stack.slice(),
                            currentNode: n,
                            depth: depth,
                            returnValue: result,
                            childReturn: childReturn
                        },
                        description: n + " × " + childReturn + " = " + result + "，返回",
                        why: "弹栈：factorial(" + n + ") 计算完成，返回 " + result,
                        next: parentReturn !== null ? "继续返回" : "递归结束"
                    });
                    return result;
                }
            }

            addCallSteps(n, 0, null);

            // 最终结果
            var finalResult = 1;
            for (var i = 2; i <= n; i++) finalResult *= i;

            steps.push({
                state: {
                    type: "factorial",
                    n: n,
                    phase: "done",
                    stack: [],
                    currentNode: null,
                    returnValue: finalResult
                },
                description: "递归完成！factorial(" + n + ") = " + finalResult,
                why: "所有栈帧都已弹栈，递归调用链结束",
                next: null
            });

            return steps;
        }

        // ============================================================================
        // 斐波那契步骤生成（改进版 - 显示递归树）
        // ============================================================================

        function generateFibonacciSteps(n) {
            var steps = [];
            var tree = {};  // 存储树节点
            var returnValues = {};  // 存储返回值
            var actualResult = fibActual(n);

            function fibActual(k) {
                if (k <= 0) return 0;
                if (k === 1) return 1;
                return fibActual(k - 1) + fibActual(k - 2);
            }

            // 初始状态
            steps.push({
                state: {
                    type: "fibonacci",
                    n: n,
                    phase: "start",
                    currentNode: null,
                    returnValues: {},
                    explanation: null,
                    finalResult: actualResult
                },
                description: "斐波那契 fibonacci(" + n + ")",
                why: "斐波那契数列：fib(n) = fib(n-1) + fib(n-2)，需要递归分解",
                next: "开始构建递归调用树"
            });

            // 递归生成步骤
            function buildFibSteps(n, path, depth) {
                var nodeId = "node_" + path;
                tree[nodeId] = {n: n, path: path, depth: depth};

                // 调用当前节点
                steps.push({
                    state: {
                        type: "fibonacci",
                        n: n,
                        phase: "call",
                        currentNode: path,
                        depth: depth,
                        returnValues: JSON.parse(JSON.stringify(returnValues)),
                        explanation: "调用 fib(" + n + ")，准备分解为子问题",
                        finalResult: actualResult
                    },
                    description: "调用 fib(" + n + ")",
                    why: "压栈：需要计算 fib(" + n + ")",
                    next: n <= 1 ? "到达终止条件" : "递归分解为 fib(" + (n-1) + ") + fib(" + (n-2) + ")"
                });

                // 终止条件
                if (n <= 1) {
                    var baseValue = n === 0 ? 0 : 1;
                    returnValues[path] = baseValue;

                    steps.push({
                        state: {
                            type: "fibonacci",
                            n: n,
                            phase: "return-base",
                            currentNode: path,
                            depth: depth,
                            returnValues: JSON.parse(JSON.stringify(returnValues)),
                            returnValue: baseValue,
                            explanation: "fib(" + n + ") = " + baseValue + "（终止条件）",
                            finalResult: actualResult
                        },
                        description: "fib(" + n + ") = " + baseValue + "（终止条件）",
                        why: "终止条件：fib(0)=0, fib(1)=1",
                        next: "返回上层"
                    });

                    delete tree[nodeId];
                    return baseValue;
                } else {
                    // 递归左子节点
                    var leftValue = buildFibSteps(n - 1, path + "-L", depth + 1);

                    steps.push({
                        state: {
                            type: "fibonacci",
                            n: n,
                            phase: "after-left",
                            currentNode: path,
                            depth: depth,
                            returnValues: JSON.parse(JSON.stringify(returnValues)),
                            leftValue: leftValue,
                            explanation: "fib(" + n + ") 收到 fib(" + (n-1) + ")=" + leftValue + "，继续求 fib(" + (n-2) + ")",
                            finalResult: actualResult
                        },
                        description: "fib(" + n + ") 收到左子节点 fib(" + (n-1) + ")=" + leftValue,
                        why: "左子节点计算完成，等待右子节点",
                        next: "递归调用 fib(" + (n-2) + ")"
                    });

                    // 递归右子节点
                    var rightValue = buildFibSteps(n - 2, path + "-R", depth + 1);

                    // 计算结果
                    var result = leftValue + rightValue;
                    returnValues[path] = result;

                    steps.push({
                        state: {
                            type: "fibonacci",
                            n: n,
                            phase: "compute",
                            currentNode: path,
                            depth: depth,
                            returnValues: JSON.parse(JSON.stringify(returnValues)),
                            returnValue: result,
                            leftValue: leftValue,
                            rightValue: rightValue,
                            explanation: "fib(" + n + ") = " + leftValue + " + " + rightValue + " = " + result,
                            finalResult: actualResult
                        },
                        description: "fib(" + n + ") = " + leftValue + " + " + rightValue + " = " + result,
                        why: "两个子节点都计算完成，汇总结果",
                        next: "返回上层"
                    });

                    delete tree[nodeId];
                    return result;
                }

            buildFibSteps(n, "root", 0);

            // 最终结果
            steps.push({
                state: {
                    type: "fibonacci",
                    n: n,
                    phase: "done",
                    currentNode: null,
                    returnValues: {"root": actualResult},
                    explanation: "递归完成！fib(" + n + ") = " + actualResult,
                    finalResult: actualResult
                },
                description: "递归完成！fibonacci(" + n + ") = " + actualResult,
                why: "所有递归调用都已完成",
                next: null
            });

            return steps;
        }

        // ============================================================================
        // 字符串反转步骤生成
        // ============================================================================

        function generateReverseSteps(s) {
            var steps = [];
            var stack = [];

            steps.push({
                state: {
                    type: "reverse",
                    s: s,
                    phase: "start",
                    stack: [],
                    currentStr: s,
                    returnValue: null
                },
                description: "反转字符串 \"" + s + "\"",
                why: "字符串反转用递归：s = s[-1] + reverse(s[:-1])",
                next: "开始递归调用"
            });

            function reverseRecursive(str, depth) {
                stack.push({str: str, depth: depth});

                steps.push({
                    state: {
                        type: "reverse",
                        s: s,
                        phase: "call",
                        stack: stack.slice(),
                        currentStr: str,
                        depth: depth,
                        returnValue: null
                    },
                    description: "reverse(\"" + str + "\")",
                    why: "压栈：需要处理 \"" + str + "\"",
                    next: str.length > 1 ? "递归调用 reverse(\"" + str.slice(0, -1) + "\")" : "到达终止条件"
                });

                if (str.length <= 1) {
                    stack.pop();
                    steps.push({
                        state: {
                            type: "reverse",
                            s: s,
                            phase: "return-base",
                            stack: stack.slice(),
                            currentStr: str,
                            depth: depth,
                            returnValue: str
                        },
                        description: "reverse(\"" + str + "\") = \"" + str + "\"（单字符，返回）",
                        why: "终止条件：单字符直接返回",
                        next: "返回上层"
                    });
                    return str;
                }

                var childResult = reverseRecursive(str.slice(0, -1), depth + 1);
                var result = str[str.length - 1] + childResult;

                stack.pop();
                steps.push({
                    state: {
                        type: "reverse",
                        s: s,
                        phase: "compute",
                        stack: stack.slice(),
                        currentStr: str,
                        depth: depth,
                        returnValue: result,
                        childResult: childResult,
                        char: str[str.length - 1]
                    },
                    description: "\"" + str[str.length - 1] + "\" + \"" + childResult + "\" = \"" + result + "\"",
                    why: "组合：最后一个字符 + 前面反转结果",
                    next: "返回上层"
                });

                return result;
            }

            reverseRecursive(s, 0);

            var finalResult = s.split('').reverse().join('');

            steps.push({
                state: {
                    type: "reverse",
                    s: s,
                    phase: "done",
                    stack: [],
                    currentStr: s,
                    returnValue: finalResult
                },
                description: "递归完成！reverse(\"" + s + "\") = \"" + finalResult + "\"",
                why: "所有栈帧都已弹栈",
                next: null
            });

            return steps;
        }

        // ============================================================================
        // 渲染函数
        // ============================================================================

        function renderFactorial(state) {
            var container = document.getElementById("visualArea");
            container.innerHTML = "";

            var stack = state.stack || [];

            if (state.phase === "done" || stack.length === 0) {
                if (state.returnValue !== null) {
                    container.innerHTML = '<div class="tree-node">' +
                        '<div class="tree-node-box done">' + state.returnValue + '</div>' +
                        '<div style="margin-top:12px;font-size:0.9rem;color:#666;">递归完成</div>' +
                        '</div>';
                } else {
                    container.innerHTML = '<div style="color:#999;padding:40px;">等待开始...</div>';
                }
                return;
            }

            // 渲染栈帧 - 栈顶在上,栈底在下(倒序遍历)
            var html = '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">';
            html += '<div class="stack-top-label">↑ 栈顶（最新调用）</div>';

            for (var i = stack.length - 1; i >= 0; i--) {
                var n = stack[i];
                var isActive = (i === stack.length - 1) && (state.phase === "call" || state.phase === "compute");
                var isReturning = state.phase === "return" || (state.phase === "compute" && i === stack.length - 1);

                html += '<div class="stack-frame ' + (isActive ? 'active' : '') + ' ' + (isReturning ? 'returning' : '') + '">';
                html += '<div class="func-name">factorial</div>';
                html += '<div class="param">n = ' + n + '</div>';

                if (isReturning && state.returnValue !== null) {
                    html += '<div class="return-value">→ ' + state.returnValue + '</div>';
                } else if (isActive && state.phase === "compute" && state.childReturn !== undefined) {
                    html += '<div class="return-value">← ' + state.childReturn + '</div>';
                }

                html += '</div>';

                if (i > 0) {
                    html += '<div class="stack-arrow">↑</div>';
                }
            }

            html += '<div class="stack-bottom-label">栈底</div>';
            html += '</div>';

            container.innerHTML = html;
        }

        // 斐波那契树节点
        function FibNode(n, path, depth) {
            this.n = n;
            this.path = path;
            this.depth = depth;
            this.left = null;
            this.right = null;
            this.value = null;  // 计算结果
            this.done = false;
        }

        // 构建斐波那契树
        function buildFibTree(n, depth, path) {
            var node = new FibNode(n, path, depth);

            if (n <= 1) {
                node.value = n;
                node.done = true;
                return node;
            }

            node.left = buildFibTree(n - 1, depth + 1, path + "-L");
            node.right = buildFibTree(n - 2, depth + 1, path + "-R");
            node.value = node.left.value + node.right.value;
            node.done = true;

            return node;
        }

        // 根据步骤状态更新树节点
        function updateTreeFromState(tree, state) {
            if (!tree) return tree;

            var nodeId = "node_" + state.currentNode;
            var pathParts = state.currentNode.split("-");

            // 找到对应的节点
            var current = tree;
            for (var i = 1; i < pathParts.length; i++) {
                if (pathParts[i] === "L" && current.left) {
                    current = current.left;
                } else if (pathParts[i] === "R" && current.right) {
                    current = current.right;
                }
            }

            if (state.phase === "return-base" || state.phase === "compute") {
                current.value = state.returnValue;
                current.done = true;
            }

            return tree;
        }

        // 渲染斐波那契树
        function renderFibTree(tree, activePath, returnValues, currentPath) {
            if (!tree) return "";

            var isActive = tree.path === currentPath;
            var isDone = tree.done;
            var hasLeft = tree.left !== null;
            var hasRight = tree.right !== null;

            var nodeClass = "fib-node-box";
            if (isActive) nodeClass += " active";
            else if (isDone) nodeClass += " done";

            var html = '<div class="fib-node">';

            // 节点值
            var valueStr = "";
            if (tree.done && tree.value !== null) {
                if (tree.left && tree.right) {
                    valueStr = tree.left.value + "+" + tree.right.value + "=" + tree.value;
                } else {
                    valueStr = "=" + tree.value;
                }
            }

            html += '<div class="' + nodeClass + '">';
            html += '<div class="fib-node-n">fib(' + tree.n + ')</div>';
            if (valueStr) {
                html += '<div class="fib-node-value">' + valueStr + '</div>';
            }
            html += '</div>';

            // 子节点
            if (hasLeft || hasRight) {
                html += '<div class="fib-children">';

                // 左子节点
                if (hasLeft) {
                    html += '<div class="fib-branch">';
                    html += '<div class="fib-branch-line"></div>';
                    html += renderFibTree(tree.left, activePath, returnValues, currentPath);
                    html += '</div>';
                }

                // 右子节点（如果有）
                if (hasRight) {
                    html += '<div class="fib-branch">';
                    html += '<div class="fib-branch-line"></div>';
                    html += renderFibTree(tree.right, activePath, returnValues, currentPath);
                    html += '</div>';
                }

                html += '</div>';
            }

            html += '</div>';
            return html;
        }

        function renderFibonacci(state) {
            var container = document.getElementById("visualArea");
            container.innerHTML = "";

            if (state.phase === "done") {
                // 构建完整的树并显示最终结果
                var fullTree = buildFibTree(state.n, 0, "root");
                var treeHtml = '<div class="fib-tree-container">';
                treeHtml += '<div style="text-align:center;margin-bottom:20px;">';
                treeHtml += '<div style="font-size:1.5rem;font-weight:700;color:#2e7d32;">fib(' + state.n + ') = ' + state.finalResult + '</div>';
                treeHtml += '<div style="font-size:0.9rem;color:#666;margin-top:8px;">递归树（所有节点计算完毕）</div>';
                treeHtml += '</div>';
                treeHtml += '<div class="fib-tree">' + renderFibTree(fullTree, [], {}, "root") + '</div>';
                treeHtml += '</div>';
                container.innerHTML = treeHtml;
                return;
            }

            if (state.phase === "start") {
                container.innerHTML = '<div style="color:#999;padding:40px;text-align:center;">' +
                    '<div style="font-size:1.2rem;margin-bottom:12px;">fib(' + state.n + ')</div>' +
                    '<div style="font-size:0.95rem;">= fib(' + (state.n-1) + ') + fib(' + (state.n-2) + ')</div>' +
                    '<div style="margin-top:20px;font-size:0.9rem;color:#888;">点击"下一步"开始递归</div>' +
                    '</div>';
                return;
            }

            // 构建当前步骤的树
            var tree = buildFibTreeFromSteps(state);

            // 渲染树
            var treeHtml = '<div class="fib-tree-container">';
            treeHtml += '<div style="text-align:center;margin-bottom:16px;">';
            treeHtml += '<div style="font-size:1.1rem;font-weight:600;color:#333;">递归调用树</div>';
            if (state.explanation) {
                treeHtml += '<div style="font-size:0.9rem;color:#666;margin-top:4px;">' + state.explanation + '</div>';
            }
            treeHtml += '</div>';
            treeHtml += '<div class="fib-tree">' + renderFibTreeInteractive(state) + '</div>';
            treeHtml += '</div>';

            container.innerHTML = treeHtml;
        }

        // 从步骤状态构建树
        function buildFibTreeFromSteps(state) {
            var tree = new FibNode(state.n, "root", 0);
            return tree;
        }

        // 渲染交互式斐波那契树
        function renderFibTreeInteractive(state) {
            var n = state.n;
            var currentPath = state.currentNode;
            var phase = state.phase;
            var returnValues = state.returnValues || {};

            // 构建树数据
            var treeData = {};
            function buildTreeData(fibN, path, depth) {
                if (fibN < 0 || depth > n) return;

                var isComputed = returnValues[path] !== undefined;
                var isActive = (path === currentPath);

                treeData[path] = {
                    fibN: fibN,
                    path: path,
                    depth: depth,
                    isComputed: isComputed,
                    isActive: isActive,
                    value: returnValues[path]
                };

                if (fibN > 1) {
                    buildTreeData(fibN - 1, path + "-L", depth + 1);
                    buildTreeData(fibN - 2, path + "-R", depth + 1);
                }
            }

            buildTreeData(n, "root", 0);

            // 渲染树
            var maxDepth = n;
            var html = '<div class="fib-tree-display">';

            // 渲染每一层
            for (var d = 0; d <= maxDepth; d++) {
                html += '<div class="fib-tree-level">';

                // 收集这一层的所有节点
                for (var path in treeData) {
                    if (treeData[path].depth === d) {
                        var node = treeData[path];
                        var boxClass = "fib-vis-box";

                        if (node.isActive) {
                            boxClass += " fib-vis-active";
                        } else if (node.isComputed) {
                            boxClass += " fib-vis-done";
                        }

                        html += '<div class="fib-vis-node">';
                        html += '<div class="' + boxClass + '">';
                        html += '<div class="fib-vis-label">fib(' + node.fibN + ')</div>';

                        if (node.isComputed) {
                            html += '<div class="fib-vis-value">=' + node.value + '</div>';
                        }

                        html += '</div>';

                        // 连接线
                        if (d < maxDepth) {
                            html += '<div class="fib-vis-connector"></div>';
                        }

                        html += '</div>';
                    }
                }

                html += '</div>';
            }

            html += '</div>';
            return html;
        }

        function renderReverse(state) {
            var container = document.getElementById("visualArea");
            container.innerHTML = "";

            var stack = state.stack || [];

            if (state.phase === "done" || stack.length === 0) {
                if (state.returnValue !== null) {
                    container.innerHTML = '<div class="tree-node">' +
                        '<div style="font-size:1.2rem;font-family:var(--font-mono);color:#2e7d32;font-weight:700;">"' + state.returnValue + '"</div>' +
                        '<div style="margin-top:12px;font-size:0.9rem;color:#666;">递归完成</div>' +
                        '</div>';
                } else {
                    container.innerHTML = '<div style="color:#999;padding:40px;">等待开始...</div>';
                }
                return;
            }

            // 渲染栈帧 - 栈顶在上,栈底在下(倒序遍历)
            var html = '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">';
            html += '<div class="stack-top-label">↑ 栈顶（最新调用）</div>';

            for (var i = stack.length - 1; i >= 0; i--) {
                var call = stack[i];
                var isActive = (i === stack.length - 1);

                html += '<div class="stack-frame ' + (isActive ? 'active' : '') + '">';
                html += '<div class="func-name">reverse</div>';
                html += '<div class="param">"' + call.str + '"</div>';
                html += '</div>';

                if (i > 0) {
                    html += '<div class="stack-arrow">↑</div>';
                }
            }

            html += '<div class="stack-bottom-label">栈底</div>';
            html += '</div>';

            container.innerHTML = html;
        }

        function render(state) {
            var dataDisplay = document.getElementById("dataDisplay");

            if (state.type === "factorial") {
                renderFactorial(state);
                var result = state.returnValue !== null ? " = " + state.returnValue : "";
                dataDisplay.textContent = "factorial(" + state.n + ")" + result;
            } else if (state.type === "fibonacci") {
                renderFibonacci(state);
                if (state.finalResult !== undefined) {
                    dataDisplay.textContent = "fibonacci(" + state.n + ") = " + state.finalResult;
                } else {
                    dataDisplay.textContent = "fibonacci(" + state.n + ")";
                }
            } else if (state.type === "reverse") {
                renderReverse(state);
                var result = state.returnValue !== null ? " = \"" + state.returnValue + "\"" : "";
                dataDisplay.textContent = "reverse(\"" + state.s + "\")" + result;
            }

            // 更新步骤信息
            var stepInfo = stepManager.getStepInfo();
            document.getElementById("stepDescription").textContent = stepInfo.description;

            var whyText = document.getElementById("whyText");
            var nextText = document.getElementById("nextText");

            if (stepInfo.why) {
                document.getElementById("whyBox").style.display = "block";
                whyText.textContent = stepInfo.why;
            } else {
                document.getElementById("whyBox").style.display = "none";
            }

            if (stepInfo.next) {
                document.getElementById("nextBox").style.display = "block";
                nextText.textContent = stepInfo.next;
            } else {
                document.getElementById("nextBox").style.display = "none";
            }

            // 更新调用栈显示
            var stackDisplay = document.getElementById("stackDisplay");
            if (state.type === "fibonacci") {
                // 斐波那契显示当前计算路径
                var pathParts = state.currentNode ? state.currentNode.split("-") : [];
                var stackItems = [];
                var currentN = state.n;
                for (var i = 1; i < pathParts.length; i++) {
                    if (pathParts[i] === "L") {
                        currentN = currentN - 1;
                    } else if (pathParts[i] === "R") {
                        currentN = currentN - 2;
                    }
                    stackItems.push("fib(" + currentN + ")");
                }
                if (stackItems.length > 0) {
                    stackItems.reverse();
                    stackDisplay.innerHTML =
                        "<span style='color:#999'>↑ 栈顶</span><br>" +
                        stackItems.join("<br>") +
                        "<br><span style='color:#999'>↓ 栈底</span>";
                } else if (state.phase === "done") {
                    stackDisplay.innerHTML = "<span style='color:#2e7d32'>所有调用已完成</span>";
                } else {
                    stackDisplay.textContent = "等待开始...";
                }
            } else if (state.stack && state.stack.length > 0) {
                var stackItems = state.stack.map(function(item) {
                    if (state.type === "factorial") {
                        return "factorial(" + item + ")";
                    } else if (state.type === "reverse") {
                        return "reverse(\"" + item.str + "\")";
                    }
                    return "";
                });
                // 倒序:栈顶(最后压入的)显示在最上面
                stackItems.reverse();
                stackDisplay.innerHTML =
                    "<span style='color:#999'>↑ 栈顶</span><br>" +
                    stackItems.join("<br>") +
                    "<br><span style='color:#999'>↓ 栈底</span>";
            } else {
                stackDisplay.textContent = "栈为空";
            }
            }
        }

        // ============================================================================
        // 初始化和事件处理
        // ============================================================================

        function init(operation) {
            currentOperation = operation;
            var value = parseInt(document.getElementById("valueInput").value) || 4;

            // 限制输入范围
            if (operation === "fibonacci") {
                value = Math.min(Math.max(value, 1), 8);
            } else {
                value = Math.min(Math.max(value, 1), 10);
            }

            switch (operation) {
                case "factorial":
                    steps = generateFactorialSteps(value);
                    break;
                case "fibonacci":
                    steps = generateFibonacciSteps(value);
                    break;
                case "reverse":
                    var testStr = value <= 4 ? "hello" : (value <= 6 ? "Python" : "recursion");
                    steps = generateReverseSteps(testStr);
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
            var activeTab = document.querySelector(".op-tab.active");
            var initialOp = activeTab ? activeTab.getAttribute("data-op") : "factorial";
            init(initialOp);
        });
    