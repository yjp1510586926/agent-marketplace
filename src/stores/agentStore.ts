/**
 * Agent 状态 Store
 * 管理 Agent 列表、筛选条件与当前选中 Agent
 */
import { create } from "zustand";

import type {
  Agent,
  AgentCapability,
  AgentStatus,
} from "../types/agent";

/** Agent 服务等级 */
export type AgentServiceLevel = "starter" | "professional" | "expert";

/** Agent 筛选条件 */
export interface AgentFilter {
  /** Agent 状态 */
  status: AgentStatus | null;
  /** 技能/能力 */
  skills: AgentCapability[];
  /** 服务等级 */
  serviceLevel: AgentServiceLevel | null;
}

/** Agent 状态接口 */
export interface AgentState {
  /** 当前 Agent 列表 */
  agents: Agent[];
  /** 当前筛选条件 */
  filter: AgentFilter;
  /** 当前选中的 Agent ID */
  selectedAgentId: string | null;
  /** 设置 Agent 列表 */
  setAgents: (agents: Agent[]) => void;
  /** 新增 Agent */
  addAgent: (agent: Agent) => void;
  /** 更新 Agent */
  updateAgent: (agent: Agent) => void;
  /** 删除 Agent */
  removeAgent: (agentId: string) => void;
  /** 更新筛选条件 */
  setFilter: (filter: Partial<AgentFilter>) => void;
  /** 清空筛选条件 */
  clearFilter: () => void;
  /** 设置当前选中 Agent */
  setSelectedAgent: (agentId: string | null) => void;
}

const DEFAULT_FILTER: AgentFilter = {
  status: null,
  skills: [],
  serviceLevel: null,
};

const resolveSelectedAgent = (
  agents: Agent[],
  selectedAgentId: string | null
) => {
  if (!selectedAgentId) return null;
  return agents.some((agent) => agent.id === selectedAgentId)
    ? selectedAgentId
    : null;
};

/**
 * Agent 状态 Hook
 * @example
 * const { agents, filter, setAgents, setFilter } = useAgentStore();
 */
export const useAgentStore = create<AgentState>((set) => ({
  agents: [],
  filter: DEFAULT_FILTER,
  selectedAgentId: null,
  setAgents: (agents) =>
    set((state) => ({
      agents,
      selectedAgentId: resolveSelectedAgent(agents, state.selectedAgentId),
    })),
  addAgent: (agent) =>
    set((state) => ({
      agents: [...state.agents, agent],
    })),
  updateAgent: (agent) =>
    set((state) => ({
      agents: state.agents.map((item) =>
        item.id === agent.id ? agent : item
      ),
    })),
  removeAgent: (agentId) =>
    set((state) => ({
      agents: state.agents.filter((agent) => agent.id !== agentId),
      selectedAgentId:
        state.selectedAgentId === agentId ? null : state.selectedAgentId,
    })),
  setFilter: (filter) =>
    set((state) => ({
      filter: {
        ...state.filter,
        ...filter,
      },
    })),
  clearFilter: () => set({ filter: DEFAULT_FILTER }),
  setSelectedAgent: (agentId) => set({ selectedAgentId: agentId }),
}));
