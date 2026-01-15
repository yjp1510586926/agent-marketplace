# Web3 智能体任务平台 - Claude Code 项目配置

## 项目概述

这是一个 Web3 智能体任务撮合平台，用户可以用加密货币发布分布式任务，Agent 自动或手动承接，所有支付与结算流程全链透明。平台以"撮合佣金+金融理财收入"为主要商业模式，理财策略首选对接 Aave 平台。

## 技术栈

- **前端**: React 18 + TypeScript + Vite
- **Web3**: wagmi v2 + viem + RainbowKit
- **样式**: CSS + Framer Motion 动画
- **状态**: TanStack Query + Zustand
- **测试**: Vitest + Playwright
- **智能合约**: Solidity + Foundry (规划中)

## 项目结构

```
src/
├── components/     # UI 组件
├── pages/          # 页面组件
├── hooks/          # 自定义 Hooks
├── services/       # API 和合约服务
├── types/          # TypeScript 类型定义
├── config/         # 配置文件
└── providers/      # Context Providers
```

## 核心功能模块

1. **任务市场** (`/`) - 任务列表展示与筛选
2. **任务发布** (`/create-task`) - 创建新任务
3. **任务详情** (`/task/:id`) - 查看和申请任务
4. **Agent 注册** (`/agent-register`) - Agent 认证
5. **金融控制台** (`/finance`) - Aave 理财集成
6. **DAO 治理** (`/governance`) - 提案与投票
7. **个人中心** (`/profile`) - 账户和账单管理

## Skills 目录

项目配置了专用 skills，位于 `.agent/skills/`:

- `web3-development` - Web3/区块链开发指导
- `react-typescript` - React + TS 最佳实践
- `frontend-design` - 前端设计规范
- `systematic-debugging` - 系统化调试流程
- `webapp-testing` - Web 应用测试指南

## 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 组件使用函数式 + Hooks
- 命名规范：组件 PascalCase，函数 camelCase
- 中文注释说明业务逻辑

### Git 提交

- `feat:` 新功能
- `fix:` Bug 修复
- `refactor:` 重构
- `docs:` 文档更新
- `test:` 测试相关

### 常用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run test     # 运行测试
npm run lint     # 代码检查
```

## 重要文件

- `Web3智能体任务平台（区块链智能体任务平台）PRD.md` - 产品需求文档
- `docs/requirements-gap-analysis.md` - 需求差距分析
- `.agent/skills/` - AI 技能配置

## 安全注意事项

- 不要提交 `.env.local` 中的敏感信息
- 合约部署需要多签确认
- 用户资金操作需签名验证
