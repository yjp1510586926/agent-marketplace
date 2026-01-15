---
name: frontend-design
description: 创建独特的、生产级的前端界面。当用户要求构建 Web 组件、页面时使用此技能。
---

# Frontend Design Skill

本技能指导创建独特的、生产级的前端界面。

## 设计思维

在编码之前，确定美学方向：

1. **目的**：界面解决什么问题？
2. **基调**：极简/未来科技/奢华精致/活泼有趣
3. **差异化**：什么让设计令人难忘？

## Web3 设计系统

### 颜色系统

```css
:root {
  --primary: #00c2b5;
  --accent: #9d4edd;
  --bg-dark: #0a0f1a;
  --bg-card: #1a2235;
  --text-primary: #ffffff;
  --text-secondary: #a0aec0;
  --success: #10b981;
  --error: #ef4444;
}
```

### 玻璃态卡片

```tsx
<motion.div
  className="
  p-6 rounded-2xl
  bg-white/5 backdrop-blur-xl
  border border-white/10
"
>
  {children}
</motion.div>
```

### 渐变按钮

```tsx
<button
  className="
  px-6 py-3 rounded-xl
  bg-gradient-to-r from-primary to-accent
  text-white font-bold
  shadow-[0_0_20px_rgba(0,194,181,0.3)]
"
>
  {children}
</button>
```

## 动画模式

```tsx
// 页面过渡
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// 列表交错
const containerVariants = {
  show: { transition: { staggerChildren: 0.1 } },
};
```

## 禁止事项

❌ 过度使用的字体（Arial、Roboto）
❌ 老套配色（紫渐变配白背景）
❌ 可预测的布局
