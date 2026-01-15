# Codex CLI 项目指令

## 项目信息

- **项目名称**: Web3 智能体任务平台 (Agent Marketplace)
- **技术栈**: React 18 + TypeScript + Vite + wagmi + Solidity
- **主要功能**: 任务撮合、Agent 管理、Aave 理财集成、DAO 治理

## Skills 配置

项目使用 `.agent/skills/` 目录中的技能：

1. **web3-development** - 智能合约与 DApp 开发
2. **react-typescript** - React 最佳实践
3. **frontend-design** - UI 设计规范
4. **systematic-debugging** - 调试方法论
5. **webapp-testing** - 测试策略

## 开发规范

### 语言要求

- 所有注释、文档使用**中文**
- 代码变量/函数使用英文
- Git commit message 使用中文描述

### 代码规范

- TypeScript 严格模式
- 函数组件 + Hooks
- 遵循 React 最佳实践

### 安全要求

- 不读取/输出 `.env*` 文件内容
- 合约操作需展示燃气估算
- 用户资金变动需明确确认

## 常用任务

```bash
# 开发
npm run dev

# 测试
npm run test
npm run test:e2e

# 构建
npm run build

# 代码检查
npm run lint
```

## 参考文档

- PRD: `Web3智能体任务平台（区块链智能体任务平台）PRD.md`
- 需求分析: `docs/requirements-gap-analysis.md`
- Skills 说明: `.agent/skills/README.md`
