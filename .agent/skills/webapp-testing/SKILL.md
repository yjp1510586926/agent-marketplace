---
name: webapp-testing
description: Web 应用测试技能，使用 Playwright 进行端到端测试、组件测试和视觉回归测试。适用于验证前端功能、调试 UI 行为、捕获浏览器截图。
---

# Web 应用测试

使用 Playwright 测试本地 Web 应用的完整指南。

## 测试策略分层

```
                    ┌──────────────┐
                    │   E2E 测试    │  少量关键路径
                    └──────────────┘
               ┌─────────────────────────┐
               │      集成测试            │  组件交互
               └─────────────────────────┘
          ┌─────────────────────────────────────┐
          │           单元测试                   │  大量细粒度
          └─────────────────────────────────────┘
```

## 项目测试结构

```
src/
├── __tests__/           # 单元测试
│   ├── hooks/
│   │   └── useTaskContract.test.ts
│   └── utils/
│       └── format.test.ts
├── components/
│   └── TaskCard/
│       ├── TaskCard.tsx
│       └── TaskCard.test.tsx  # 组件测试
e2e/
├── fixtures/            # 测试夹具
│   └── wallet.ts
├── pages/              # 页面对象模型
│   ├── marketplace.ts
│   └── finance.ts
└── specs/              # E2E 测试用例
    ├── task-flow.spec.ts
    └── wallet-connect.spec.ts
```

## Playwright 配置

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 12"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

## 页面对象模型 (POM)

```typescript
// e2e/pages/marketplace.ts
import { Page, Locator, expect } from "@playwright/test";

export class MarketplacePage {
  readonly page: Page;
  readonly taskCards: Locator;
  readonly createTaskButton: Locator;
  readonly searchInput: Locator;
  readonly filterTabs: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskCards = page.locator('[data-testid="task-card"]');
    this.createTaskButton = page.getByRole("link", { name: /发布任务/i });
    this.searchInput = page.getByPlaceholder(/搜索任务/i);
    this.filterTabs = page.locator('[role="tablist"]');
  }

  async goto() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  async getTaskCount() {
    return this.taskCards.count();
  }

  async searchTask(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.page.waitForTimeout(500); // debounce
  }

  async clickCreateTask() {
    await this.createTaskButton.click();
    await expect(this.page).toHaveURL(/create-task/);
  }

  async filterByCategory(category: string) {
    await this.filterTabs.getByText(category).click();
  }
}
```

## E2E 测试示例

```typescript
// e2e/specs/task-flow.spec.ts
import { test, expect } from "@playwright/test";
import { MarketplacePage } from "../pages/marketplace";

test.describe("任务市场", () => {
  let marketplace: MarketplacePage;

  test.beforeEach(async ({ page }) => {
    marketplace = new MarketplacePage(page);
    await marketplace.goto();
  });

  test("应该显示任务列表", async () => {
    const taskCount = await marketplace.getTaskCount();
    expect(taskCount).toBeGreaterThan(0);
  });

  test("应该能搜索任务", async ({ page }) => {
    await marketplace.searchTask("智能合约");

    // 验证搜索结果
    const tasks = await marketplace.taskCards.all();
    for (const task of tasks) {
      const title = await task.locator("h3").textContent();
      expect(title?.toLowerCase()).toContain("智能");
    }
  });

  test("应该能跳转到任务发布页", async ({ page }) => {
    await marketplace.clickCreateTask();
    await expect(
      page.getByRole("heading", { name: /发布任务/i })
    ).toBeVisible();
  });
});
```

## 钱包连接测试

```typescript
// e2e/fixtures/wallet.ts
import { test as base, expect } from "@playwright/test";

// 模拟钱包连接
export const test = base.extend({
  // Mock Web3 Provider
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      // 模拟 ethereum 对象
      (window as any).ethereum = {
        isMetaMask: true,
        request: async ({ method }: { method: string }) => {
          switch (method) {
            case "eth_requestAccounts":
              return ["0x1234567890123456789012345678901234567890"];
            case "eth_chainId":
              return "0x1"; // Mainnet
            case "eth_accounts":
              return ["0x1234567890123456789012345678901234567890"];
            default:
              throw new Error(`Unknown method: ${method}`);
          }
        },
        on: () => {},
        removeListener: () => {},
      };
    });
    await use(page);
  },
});

// e2e/specs/wallet-connect.spec.ts
import { test, expect } from "../fixtures/wallet";

test("连接钱包后显示地址", async ({ page }) => {
  await page.goto("/");

  // 点击连接按钮
  await page.getByRole("button", { name: /连接钱包/i }).click();

  // 验证显示地址
  await expect(page.getByText(/0x1234...7890/i)).toBeVisible();
});
```

## 视觉回归测试

```typescript
// e2e/specs/visual.spec.ts
import { test, expect } from "@playwright/test";

test("首页视觉回归", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // 等待动画完成
  await page.waitForTimeout(1000);

  // 全页截图对比
  await expect(page).toHaveScreenshot("homepage.png", {
    fullPage: true,
    maxDiffPixelRatio: 0.05, // 允许 5% 差异
  });
});

test("任务卡片视觉回归", async ({ page }) => {
  await page.goto("/");

  const taskCard = page.locator('[data-testid="task-card"]').first();
  await expect(taskCard).toHaveScreenshot("task-card.png");
});
```

## 组件测试 (Vitest + Testing Library)

```typescript
// src/components/TaskCard/TaskCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaskCard } from "./TaskCard";

describe("TaskCard", () => {
  const defaultProps = {
    id: "1",
    title: "Test Task",
    budget: "1.0 ETH",
    status: "open" as const,
    tags: ["Solidity", "DeFi"],
  };

  it("渲染任务信息", () => {
    render(<TaskCard {...defaultProps} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("1.0 ETH")).toBeInTheDocument();
  });

  it("渲染所有标签", () => {
    render(<TaskCard {...defaultProps} />);

    expect(screen.getByText("Solidity")).toBeInTheDocument();
    expect(screen.getByText("DeFi")).toBeInTheDocument();
  });

  it("点击时触发回调", () => {
    const onClick = vi.fn();
    render(<TaskCard {...defaultProps} onClick={onClick} />);

    fireEvent.click(screen.getByRole("article"));
    expect(onClick).toHaveBeenCalledWith("1");
  });

  it("open 状态显示申请按钮", () => {
    render(<TaskCard {...defaultProps} status="open" />);
    expect(screen.getByRole("button", { name: /申请/i })).toBeInTheDocument();
  });

  it("completed 状态不显示申请按钮", () => {
    render(<TaskCard {...defaultProps} status="completed" />);
    expect(
      screen.queryByRole("button", { name: /申请/i })
    ).not.toBeInTheDocument();
  });
});
```

## Hook 测试

```typescript
// src/__tests__/hooks/useTaskContract.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useCreateTask } from "../../hooks/useTaskContract";

// Mock wagmi
vi.mock("wagmi", () => ({
  useWriteContract: vi.fn(() => ({
    writeContract: vi.fn(),
    data: "0x123",
    isPending: false,
    error: null,
  })),
  useWaitForTransactionReceipt: vi.fn(() => ({
    isLoading: false,
    isSuccess: true,
  })),
}));

describe("useCreateTask", () => {
  it("返回 createTask 函数", () => {
    const { result } = renderHook(() => useCreateTask());
    expect(typeof result.current.createTask).toBe("function");
  });

  it("初始状态正确", () => {
    const { result } = renderHook(() => useCreateTask());
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(true);
  });
});
```

## 运行测试命令

```bash
# 单元测试
npm run test              # 运行所有单元测试
npm run test:watch        # 观察模式
npm run test:coverage     # 生成覆盖率报告

# E2E 测试
npm run test:e2e          # 运行所有 E2E 测试
npm run test:e2e:ui       # 打开 Playwright UI
npm run test:e2e:debug    # 调试模式

# 更新视觉快照
npm run test:e2e -- --update-snapshots
```

## CI 集成

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run test:coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## 测试最佳实践

1. **测试用户行为，而非实现细节**
2. **每个测试独立可运行**
3. **使用语义化选择器**（role、label）
4. **避免硬编码等待时间**
5. **保持测试简短聚焦**
