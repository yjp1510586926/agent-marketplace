---
name: react-typescript
description: React + TypeScript 开发最佳实践，适用于 React 18、函数组件、Hooks、状态管理、性能优化等场景。当编写、审查或重构 React 代码时触发此技能。
---

# React + TypeScript 开发规范

本技能为 Web3 Agent Marketplace 项目的前端开发提供标准化指导。

## 项目技术栈

- **React 18** + TypeScript
- **Vite** 构建工具
- **wagmi + viem** Web3 集成
- **Framer Motion** 动画
- **TanStack Query** 数据获取

## 组件开发规范

### 文件命名

```
components/
├── common/              # 通用组件
│   ├── Button.tsx
│   └── Modal.tsx
├── layout/              # 布局组件
│   ├── Navbar.tsx
│   └── MobileNav.tsx
└── features/            # 功能组件
    ├── task/
    │   ├── TaskCard.tsx
    │   └── TaskList.tsx
    └── wallet/
        └── WalletButton.tsx
```

### 组件结构

```typescript
// components/features/task/TaskCard.tsx
import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

// 1. 类型定义放在最前面
interface TaskCardProps {
  id: string;
  title: string;
  budget: string;
  status: "open" | "assigned" | "completed";
  onApply?: (taskId: string) => void;
}

// 2. 常量提取
const STATUS_CONFIG = {
  open: { label: "招募中", color: "text-green-400" },
  assigned: { label: "进行中", color: "text-blue-400" },
  completed: { label: "已完成", color: "text-gray-400" },
} as const;

// 3. 组件定义
export const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  budget,
  status,
  onApply,
}) => {
  // 4. Hooks 按顺序：useState → useMemo → useCallback → useEffect
  const [isHovered, setIsHovered] = useState(false);

  const statusInfo = useMemo(() => STATUS_CONFIG[status], [status]);

  const handleApply = useCallback(() => {
    onApply?.(id);
  }, [id, onApply]);

  // 5. 渲染
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-2xl bg-surface-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-xl font-display">{budget}</p>
      <span className={statusInfo.color}>{statusInfo.label}</span>
      {status === "open" && <button onClick={handleApply}>申请任务</button>}
    </motion.div>
  );
};
```

### 类型定义

```typescript
// types/task.ts
export type TaskStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  budget: bigint;
  publisher: `0x${string}`;
  assignee?: `0x${string}`;
  createdAt: number;
  deadline: number;
  tags: string[];
}

// 表单数据类型单独定义
export interface CreateTaskFormData {
  title: string;
  description: string;
  budget: string;
  deadline: Date;
  tags: string[];
}
```

## Hooks 开发

### 自定义 Hook 规范

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // 延迟初始化
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    },
    [key]
  );

  return [storedValue, setValue];
}
```

### 异步数据 Hook

```typescript
// hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    staleTime: 5 * 60 * 1000, // 5 分钟缓存
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
```

## 性能优化

### 避免不必要的重渲染

```typescript
// ❌ 错误：每次渲染创建新对象
<Component style={{ color: "red" }} />;

// ✅ 正确：提取为常量或 useMemo
const style = useMemo(() => ({ color: "red" }), []);
<Component style={style} />;
```

### 列表优化

```typescript
// 大列表使用虚拟滚动
import { useVirtualizer } from "@tanstack/react-virtual";

function TaskList({ tasks }: { tasks: Task[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <TaskCard
            key={tasks[virtualItem.index].id}
            {...tasks[virtualItem.index]}
          />
        ))}
      </div>
    </div>
  );
}
```

### 代码分割

```typescript
// 页面级懒加载
const Finance = React.lazy(() => import("./pages/Finance"));
const Governance = React.lazy(() => import("./pages/Governance"));

// 路由中使用
<Suspense fallback={<PageSkeleton />}>
  <Route path="/finance" element={<Finance />} />
</Suspense>;
```

## 状态管理

### 本地状态 vs 全局状态

| 场景           | 方案                 |
| -------------- | -------------------- |
| 组件内 UI 状态 | useState             |
| 跨组件共享     | Context + useReducer |
| 复杂全局状态   | Zustand              |
| 服务器状态     | TanStack Query       |

### Zustand 示例

```typescript
// stores/useUserStore.ts
import { create } from "zustand";

interface UserState {
  address: string | null;
  isAgent: boolean;
  profile: UserProfile | null;
  setAddress: (address: string | null) => void;
  setProfile: (profile: UserProfile) => void;
}

export const useUserStore = create<UserState>((set) => ({
  address: null,
  isAgent: false,
  profile: null,
  setAddress: (address) => set({ address }),
  setProfile: (profile) => set({ profile, isAgent: !!profile?.agentId }),
}));
```

## 错误处理

### 错误边界

```typescript
// components/common/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught:", error, errorInfo);
    // 上报错误监控服务
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorUI error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### 异步错误处理

```typescript
// 使用 react-error-boundary
import { useErrorBoundary } from "react-error-boundary";

function TaskPage() {
  const { showBoundary } = useErrorBoundary();

  const handleSubmit = async () => {
    try {
      await createTask(data);
    } catch (error) {
      showBoundary(error);
    }
  };
}
```

## 可访问性 (A11y)

```typescript
// 表单元素必须有 label
<label htmlFor="task-title">任务标题</label>
<input id="task-title" aria-required="true" />

// 按钮必须有明确文本或 aria-label
<button aria-label="关闭弹窗">×</button>

// 图标按钮
<button aria-label="申请任务">
  <span className="material-symbols-outlined" aria-hidden>send</span>
</button>
```

## 测试

### 组件测试

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskCard } from "./TaskCard";

describe("TaskCard", () => {
  it("renders task information correctly", () => {
    render(
      <TaskCard id="1" title="Test Task" budget="1.0 ETH" status="open" />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("1.0 ETH")).toBeInTheDocument();
  });

  it("calls onApply when button clicked", () => {
    const onApply = vi.fn();
    render(
      <TaskCard
        id="1"
        title="Test"
        budget="1 ETH"
        status="open"
        onApply={onApply}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /申请任务/i }));
    expect(onApply).toHaveBeenCalledWith("1");
  });
});
```

## 代码风格检查

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "react/prop-types": "off"
  }
}
```
