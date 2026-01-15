/**
 * 全局常量配置
 */

/** 应用基础信息 */
export const APP_CONFIG = {
  name: "NexusHub",
  description: "Web3 智能体任务平台",
  version: "0.1.0",
} as const;

/** 路由配置 */
export const ROUTES = {
  HOME: "/",
  MARKETPLACE: "/",
  FINANCE: "/finance",
  GOVERNANCE: "/governance",
  PROFILE: "/profile",
  TASK_DETAIL: "/task/:id",
  CREATE_TASK: "/create-task",
  AGENT_REGISTER: "/agent-register",
} as const;

/** 导航项配置 */
export const NAV_ITEMS = [
  { name: "市场", path: ROUTES.MARKETPLACE, icon: "storefront" },
  { name: "金融", path: ROUTES.FINANCE, icon: "account_balance" },
  { name: "治理", path: ROUTES.GOVERNANCE, icon: "how_to_vote" },
  { name: "个人", path: ROUTES.PROFILE, icon: "person" },
] as const;

/** 链配置 */
export const CHAIN_CONFIG = {
  /** 默认链 ID */
  DEFAULT_CHAIN_ID: 1,
  /** 支持的链 ID 列表 */
  SUPPORTED_CHAINS: [1, 11155111, 137, 80001] as const,
} as const;

/** UI 相关常量 */
export const UI_CONFIG = {
  /** 分页默认大小 */
  PAGE_SIZE: 12,
  /** Toast 显示时长（ms） */
  TOAST_DURATION: 3000,
  /** 动画持续时间（s） */
  ANIMATION_DURATION: 0.2,
} as const;
