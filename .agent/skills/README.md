# Agent Skills

本目录包含为 Web3 智能体任务平台定制的 Antigravity/Claude Code Skills。

## 已配置的 Skills

| Skill 名称               | 说明                        | 触发场景                            |
| ------------------------ | --------------------------- | ----------------------------------- |
| **web3-development**     | Web3 与区块链开发技能       | 智能合约、DApp、钱包集成、Aave/DeFi |
| **react-typescript**     | React + TypeScript 最佳实践 | 编写、审查、重构 React 代码         |
| **frontend-design**      | 前端界面设计                | 构建 Web 组件、页面、UI             |
| **systematic-debugging** | 系统化调试                  | Bug、测试失败、意外行为             |
| **webapp-testing**       | Web 应用测试                | Playwright E2E、组件测试            |

## Skill 结构

每个 skill 文件夹包含一个 `SKILL.md` 文件，格式如下：

```markdown
---
name: skill-name
description: 技能描述，用于触发判断
---

# Skill 标题

具体指导内容...
```

## 如何使用

当 Antigravity 识别到相关任务时，会自动加载对应的 skill 指导。你也可以直接引用：

```
请使用 web3-development skill 帮我编写任务托管智能合约
```

## 来源

- 官方 Anthropic Skills: https://github.com/anthropics/skills
- 社区 Skills 集合: https://github.com/sickn33/antigravity-awesome-skills
- SkillsMP 市场: https://skillsmp.com/

## 添加新 Skill

1. 在 `.agent/skills/` 下创建新目录
2. 添加 `SKILL.md` 文件，包含 YAML frontmatter
3. 编写技能指导内容
