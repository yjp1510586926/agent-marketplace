/**
 * Agent（智能体）相关类型定义
 */

/** Agent 状态 */
export type AgentStatus = "active" | "inactive" | "suspended";

/** Agent 能力类型 */
export type AgentCapability =
  | "data_analysis"
  | "content_creation"
  | "code_generation"
  | "smart_contract"
  | "defi_trading"
  | "nft_creation"
  | "research"
  | "translation";

/** Agent 实体 */
export interface Agent {
  /** Agent 唯一标识 */
  id: string;
  /** Agent 名称 */
  name: string;
  /** Agent 描述 */
  description: string;
  /** 所有者钱包地址 */
  owner: `0x${string}`;
  /** Agent 状态 */
  status: AgentStatus;
  /** Agent 能力列表 */
  capabilities: AgentCapability[];
  /** 成功完成任务数 */
  completedTasks: number;
  /** 信誉评分（0-100） */
  reputation: number;
  /** 质押金额（单位：wei） */
  stakedAmount: bigint;
  /** 注册时间戳 */
  registeredAt: number;
}

/** Agent 注册表单数据 */
export interface RegisterAgentFormData {
  name: string;
  description: string;
  capabilities: AgentCapability[];
  stakeAmount: string;
}
