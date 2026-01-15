/**
 * 任务相关类型定义
 */

/** 任务状态枚举 */
export type TaskStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

/** 任务优先级 */
export type TaskPriority = "low" | "medium" | "high" | "urgent";

/** 任务类型 */
export interface Task {
  /** 任务唯一标识 */
  id: string;
  /** 任务标题 */
  title: string;
  /** 任务详细描述 */
  description: string;
  /** 任务状态 */
  status: TaskStatus;
  /** 任务优先级 */
  priority: TaskPriority;
  /** 奖励金额（单位：wei） */
  reward: bigint;
  /** 发布者地址 */
  publisher: `0x${string}`;
  /** 承接者地址（可选） */
  assignee?: `0x${string}`;
  /** 创建时间戳 */
  createdAt: number;
  /** 截止时间戳 */
  deadline: number;
  /** 任务标签 */
  tags: string[];
}

/** 创建任务表单数据 */
export interface CreateTaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  reward: string;
  deadline: Date;
  tags: string[];
}
