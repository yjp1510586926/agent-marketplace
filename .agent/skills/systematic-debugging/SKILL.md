---
name: systematic-debugging
description: 系统化调试技能，在遇到任何 Bug、测试失败或意外行为时使用。在提出修复方案之前，必须先进行根因分析。
---

# 系统化调试

## 概述

本技能确保在修复代码之前理解问题的根本原因。盲目猜测和随意尝试修复会导致更多问题。

## 铁律

> **在理解问题根源之前，绝不修改代码。**

## 何时使用

- 遇到 Bug 或错误
- 测试失败
- 意外行为
- 生产问题
- 性能问题

## 四阶段调试流程

### 阶段一：根因调查

**目标**：收集证据，理解问题

```
1. 复现问题
   - 记录精确的复现步骤
   - 确认问题的一致性

2. 收集证据
   - 错误信息全文
   - 堆栈跟踪
   - 相关日志
   - 环境信息（浏览器、Node 版本等）

3. 界定范围
   - 问题首次出现时间
   - 影响范围（特定页面/全局）
   - 最近的代码变更
```

**调试命令**：

```bash
# 查看最近修改的文件
git log --oneline -10 --all -- src/

# 查看特定时间段的修改
git log --since="2024-01-01" --until="2024-01-15" --oneline

# 比较两个提交的差异
git diff commit1 commit2 -- path/to/file
```

### 阶段二：模式分析

**目标**：识别规律和关联

```
1. 时间模式
   - 特定时间发生？
   - 与用户行为相关？

2. 数据模式
   - 特定输入触发？
   - 边界条件？

3. 环境模式
   - 特定浏览器/设备？
   - 网络条件？
```

### 阶段三：假设与验证

**目标**：形成可测试的假设

```
格式：如果 [条件]，那么 [预期结果]

示例：
- 如果移除 async 操作，问题消失 → 竞态条件
- 如果禁用缓存，问题消失 → 缓存一致性
- 如果切换网络，问题消失 → 网络相关
```

**验证方法**：

```typescript
// 添加调试日志
console.log("[DEBUG] State before:", state);
console.log("[DEBUG] Props received:", props);

// 使用断点
debugger;

// 条件断点（在浏览器 DevTools 中）
// 右键点击断点 → Add conditional breakpoint
// 输入条件：taskId === '123'
```

### 阶段四：实施修复

**只有在完成前三个阶段后才能进行**

```
1. 编写测试用例复现 Bug
2. 确认测试失败
3. 实施最小化修复
4. 确认测试通过
5. 验证没有引入新问题
```

## 红旗警告 - 立即停止

当出现以下情况时，停止修改代码，回到阶段一：

- [ ] "让我试试这个看看能不能解决"
- [ ] "这应该能解决问题"
- [ ] 连续修改同一处代码超过 3 次
- [ ] 修复一个问题却引入两个新问题
- [ ] 不清楚为什么修改"起作用了"

## 常见思维陷阱

| 错误想法             | 正确做法                 |
| -------------------- | ------------------------ |
| "这个修复很简单"     | 简单的修复也需要理解根因 |
| "先修复再弄清原因"   | 这会掩盖根本问题         |
| "这是唯一出错的地方" | 验证假设，不要假设       |
| "重启/清缓存解决了"  | 找出为什么需要这样做     |

## 快速参考

### Web3 特定调试

```typescript
// 检查钱包连接状态
console.log("Connected:", isConnected);
console.log("Chain ID:", chainId);
console.log("Address:", address);

// 检查合约调用
console.log("Contract args:", args);
console.log("Value:", value?.toString());

// 交易失败排查
try {
  await writeContract(config);
} catch (error) {
  console.log("Error type:", error.name);
  console.log("Error message:", error.message);
  console.log("Error cause:", error.cause);
  // 检查是否是用户拒绝
  if (error.message.includes("user rejected")) {
    console.log("User rejected transaction");
  }
}
```

### React 调试

```typescript
// 检查渲染次数
useEffect(() => {
  console.log("[RENDER] Component rendered");
});

// 检查 props 变化
useEffect(() => {
  console.log("[PROPS CHANGED]", { prop1, prop2 });
}, [prop1, prop2]);

// 检查 state 变化
useEffect(() => {
  console.log("[STATE CHANGED]", state);
}, [state]);

// React DevTools Profiler 使用
// 1. 打开 React DevTools
// 2. 选择 Profiler 标签
// 3. 点击 Record
// 4. 触发问题操作
// 5. 停止记录并分析火焰图
```

### 网络调试

```typescript
// 检查 API 请求
fetch(url)
  .then((response) => {
    console.log("Status:", response.status);
    console.log("Headers:", Object.fromEntries(response.headers));
    return response.json();
  })
  .then((data) => console.log("Response:", data))
  .catch((error) => console.log("Network error:", error));
```

## 当找不到根因时

1. **最小化复现**：创建最简单的代码复现问题
2. **二分法**：逐步禁用代码直到问题消失
3. **对比环境**：在正常环境和问题环境之间对比
4. **寻求帮助**：清晰描述问题、已尝试的方法、收集的证据

## 调试检查清单

完成修复后确认：

- [ ] 我能解释问题的根本原因
- [ ] 我有测试用例证明修复有效
- [ ] 我验证了修复没有引入新问题
- [ ] 我更新了相关文档（如需要）
- [ ] 我能向他人解释这个修复

## 最后规则

> **如果你不能解释为什么代码出错，你就不能确定修复是否正确。**
