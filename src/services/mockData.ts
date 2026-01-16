/**
 * Mock 数据生成器
 */
import type { Task } from "../types/task";

const ETH = 1_000_000_000_000_000_000n;

/**
 * 生成任务市场 Mock 数据
 */
export const createMockTasks = (): Task[] => {
  const now = Math.floor(Date.now() / 1000);

  return [
    {
      id: "task-001",
      title: "智能合约安全性审计",
      description:
        "我们需要对 DeFi 质押模块进行全面的安全审计，包括重入攻击测试。",
      status: "open",
      priority: "high",
      reward: 2n * ETH,
      publisher: "0x8b3A0c1C9eE0dB1A7e1E7a9F2a59e20d2C0b6a11",
      createdAt: now - 2 * 3600,
      deadline: now + 7 * 86400,
      tags: ["Solidity", "Audit", "DeFi"],
    },
    {
      id: "task-002",
      title: "DApp 仪表盘 UI 设计",
      description:
        "设计一套暗色模式的 Web3 仪表盘，风格需类似 Motion.dev 或 Linear。",
      status: "assigned",
      priority: "medium",
      reward: 1n * ETH,
      publisher: "0x6b7E9f2dC0eD2a8fE12C9D9b5E1b2a1d3c4e5f6A",
      assignee: "0xC2b2E0B9C1a5b9f2D3C4e5F6A7B8C9D0E1F2a3B4",
      createdAt: now - 5 * 3600,
      deadline: now + 5 * 86400,
      tags: ["Design", "UI/UX"],
    },
    {
      id: "task-003",
      title: "社区运营增长 (Alpha)",
      description: "负责 Discord 和 Twitter 的日常运营，目标增长 20%。",
      status: "in_progress",
      priority: "low",
      reward: 1n * ETH,
      publisher: "0x5A3c9D8e7F6a5B4c3D2e1F0a9B8c7D6e5F4a3B2c",
      assignee: "0xA1b2C3D4e5F6a7B8c9D0E1F2a3B4c5D6e7F8a9B0",
      createdAt: now - 1 * 86400,
      deadline: now + 3 * 86400,
      tags: ["Marketing", "Twitter"],
    },
    {
      id: "task-004",
      title: "Web3 连接组件开发",
      description:
        "使用 RainbowKit 或 Wagmi 封装通用的钱包连接 React 组件库。",
      status: "open",
      priority: "medium",
      reward: 2n * ETH,
      publisher: "0x4D2c1B0a9f8E7d6C5b4A3c2D1e0F9a8B7c6D5e4F",
      createdAt: now - 1 * 86400,
      deadline: now + 10 * 86400,
      tags: ["React", "Wagmi"],
    },
    {
      id: "task-005",
      title: "NFT Marketplace 智能合约",
      description:
        "开发一个支持 ERC-721 和 ERC-1155 的 NFT 交易市场智能合约。",
      status: "completed",
      priority: "urgent",
      reward: 4n * ETH,
      publisher: "0x3C2b1A0f9E8d7C6b5A4c3D2e1F0a9B8c7D6e5F4a",
      createdAt: now - 6 * 3600,
      deadline: now + 14 * 86400,
      tags: ["Solidity", "NFT"],
    },
    {
      id: "task-006",
      title: "DeFi 协议文档撰写",
      description: "为我们的借贷协议撰写详细的技术文档和用户指南。",
      status: "open",
      priority: "low",
      reward: ETH / 2n,
      publisher: "0x2B1a0F9e8D7c6B5a4C3d2E1f0A9b8C7d6E5f4A3b",
      createdAt: now - 6 * 3600,
      deadline: now + 6 * 86400,
      tags: ["Writing", "DeFi"],
    },
  ];
};
