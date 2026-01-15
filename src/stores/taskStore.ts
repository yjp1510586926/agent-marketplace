/**
 * 任务状态 Store
 * 管理任务列表、筛选条件与当前选中任务
 */
import { create } from "zustand";

import type { Task, TaskStatus } from "../types/task";

/** 任务筛选条件 */
export interface TaskFilter {
  /** 任务状态 */
  status: TaskStatus | null;
  /** 技能/标签 */
  skills: string[];
  /** 预算范围（单位：wei） */
  budgetRange: {
    min: bigint | null;
    max: bigint | null;
  };
}

/** 任务状态接口 */
export interface TaskState {
  /** 当前任务列表 */
  tasks: Task[];
  /** 当前筛选条件 */
  filter: TaskFilter;
  /** 当前选中的任务 ID */
  selectedTaskId: string | null;
  /** 设置任务列表 */
  setTasks: (tasks: Task[]) => void;
  /** 新增任务 */
  addTask: (task: Task) => void;
  /** 更新任务 */
  updateTask: (task: Task) => void;
  /** 删除任务 */
  removeTask: (taskId: string) => void;
  /** 更新筛选条件 */
  setFilter: (filter: Partial<TaskFilter>) => void;
  /** 清空筛选条件 */
  clearFilter: () => void;
  /** 设置当前选中任务 */
  setSelectedTask: (taskId: string | null) => void;
}

const DEFAULT_FILTER: TaskFilter = {
  status: null,
  skills: [],
  budgetRange: {
    min: null,
    max: null,
  },
};

const resolveSelectedTask = (tasks: Task[], selectedTaskId: string | null) => {
  if (!selectedTaskId) return null;
  return tasks.some((task) => task.id === selectedTaskId)
    ? selectedTaskId
    : null;
};

/**
 * 任务状态 Hook
 * @example
 * const { tasks, filter, setTasks, setFilter } = useTaskStore();
 */
export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  filter: DEFAULT_FILTER,
  selectedTaskId: null,
  setTasks: (tasks) =>
    set((state) => ({
      tasks,
      selectedTaskId: resolveSelectedTask(tasks, state.selectedTaskId),
    })),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((item) => (item.id === task.id ? task : item)),
    })),
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
      selectedTaskId:
        state.selectedTaskId === taskId ? null : state.selectedTaskId,
    })),
  setFilter: (filter) =>
    set((state) => ({
      filter: {
        ...state.filter,
        ...filter,
        budgetRange: {
          ...state.filter.budgetRange,
          ...filter.budgetRange,
        },
      },
    })),
  clearFilter: () => set({ filter: DEFAULT_FILTER }),
  setSelectedTask: (taskId) => set({ selectedTaskId: taskId }),
}));
