/**
 * 任务市场首页
 * 展示任务列表、平台统计、快速入口
 */
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

import { createMockTasks } from "../services/mockData";
import { useTaskStore } from "../stores";
import { formatEth, formatRelativeTime } from "../utils/format";
import type { TaskPriority, TaskStatus } from "../types/task";

const COMPLEXITY_COLORS = {
  basic: "text-green-400",
  intermediate: "text-blue-400",
  advanced: "text-yellow-400",
  expert: "text-red-400",
};

const COMPLEXITY_LABELS = {
  basic: "基础",
  intermediate: "中级",
  advanced: "高级",
  expert: "专家",
};

const PRIORITY_COMPLEXITY: Record<TaskPriority, keyof typeof COMPLEXITY_COLORS> =
  {
    low: "basic",
    medium: "intermediate",
    high: "advanced",
    urgent: "expert",
  };

const EMPLOYER_PROFILES = [
  { name: "NexusFi", avatar: "https://picsum.photos/100?1", rating: 4.9 },
  { name: "MetaDAO", avatar: "https://picsum.photos/100?2", rating: 4.7 },
  { name: "AlphaLabs", avatar: "https://picsum.photos/100?3", rating: 4.5 },
  { name: "DevGuild", avatar: "https://picsum.photos/100?4", rating: 4.8 },
  { name: "ArtBlock", avatar: "https://picsum.photos/100?5", rating: 4.6 },
  { name: "LendDAO", avatar: "https://picsum.photos/100?6", rating: 4.4 },
];

const APPLICANT_COUNTS = [5, 12, 8, 3, 7, 15];

const ETH = 1_000_000_000_000_000_000n;
type BudgetRange = { min: bigint | null; max: bigint | null };

const Marketplace: React.FC = () => {
  const { isConnected } = useAccount();
  const { tasks, filter, setFilter, setTasks } = useTaskStore();
  const [showOnboarding, setShowOnboarding] = useState(!isConnected);

  const stats = [
    { label: "累计赚取", value: "$4.2M", icon: "payments", trend: "+12%" },
    { label: "活跃Agent", value: "1,240", icon: "group", trend: "75%" },
    { label: "治理参与", value: "85%", icon: "how_to_vote", trend: "High" },
  ];

  useEffect(() => {
    if (tasks.length === 0) {
      // 初始化任务列表（Mock 数据）
      setTasks(createMockTasks());
    }
  }, [setTasks, tasks.length]);

  const statusOptions: Array<{ id: "all" | TaskStatus; label: string }> = [
    { id: "all", label: "全部" },
    { id: "open", label: "开放" },
    { id: "assigned", label: "已指派" },
    { id: "in_progress", label: "进行中" },
    { id: "completed", label: "已完成" },
  ];

  const skillOptions = useMemo(() => {
    const skillSet = new Set<string>();
    tasks.forEach((task) => task.tags.forEach((tag) => skillSet.add(tag)));
    return Array.from(skillSet).sort((a, b) => a.localeCompare(b, "zh-CN"));
  }, [tasks]);

  const budgetOptions: Array<{
    id: string;
    label: string;
    range: BudgetRange;
  }> = [
    { id: "all", label: "全部预算", range: { min: null, max: null } },
    { id: "low", label: "< 1 ETH", range: { min: null, max: ETH } },
    { id: "mid", label: "1-3 ETH", range: { min: ETH, max: 3n * ETH } },
    { id: "high", label: "> 3 ETH", range: { min: 3n * ETH, max: null } },
  ];

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 状态筛选
      const matchesStatus = !filter.status || task.status === filter.status;
      // 技能筛选（支持多选）
      const matchesSkills =
        filter.skills.length === 0 ||
        filter.skills.every((skill) => task.tags.includes(skill));
      // 预算筛选
      const matchesBudget =
        (filter.budgetRange.min === null ||
          task.reward >= filter.budgetRange.min) &&
        (filter.budgetRange.max === null ||
          task.reward <= filter.budgetRange.max);

      return matchesStatus && matchesSkills && matchesBudget;
    });
  }, [filter, tasks]);

  const activeStatus = filter.status ?? "all";

  const handleStatusChange = (status: "all" | TaskStatus) => {
    setFilter({ status: status === "all" ? null : status });
  };

  const handleSkillToggle = (skill: string | "all") => {
    if (skill === "all") {
      setFilter({ skills: [] });
      return;
    }

    const nextSkills = filter.skills.includes(skill)
      ? filter.skills.filter((item) => item !== skill)
      : [...filter.skills, skill];

    setFilter({ skills: nextSkills });
  };

  const handleBudgetChange = (range: BudgetRange) => {
    setFilter({ budgetRange: range });
  };

  const isBudgetActive = (range: BudgetRange) =>
    range.min === filter.budgetRange.min &&
    range.max === filter.budgetRange.max;

  return (
    <div className="space-y-12 py-6">
      {/* 新用户引导 */}
      <AnimatePresence>
        {showOnboarding && !isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="relative p-6 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30"
          >
            <button
              onClick={() => setShowOnboarding(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">👋 欢迎来到 NexusHub</h3>
                <p className="text-sm text-gray-400">
                  连接钱包开始您的 Web3 之旅。您可以发布任务找到专业
                  Agent，或注册成为 Agent 承接任务赚取收益。
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/create-task"
                  className="px-4 py-2 rounded-lg bg-primary text-background-dark text-sm font-bold hover:shadow-lg transition-all"
                >
                  发布任务
                </Link>
                <Link
                  to="/agent-register"
                  className="px-4 py-2 rounded-lg border border-white/20 text-white text-sm font-bold hover:bg-white/10 transition-all"
                >
                  成为 Agent
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[300px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-surface-card border border-white/5 p-8 md:p-12"
        >
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-3 py-1">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                Protocol V2 Live
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black leading-none tracking-tight">
              去中心化协作的
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                数字未来
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
              高效匹配全球 Web3 人才，智能合约自动结算。集成 Aave
              协议，闲置资金自动生息，让价值流动。
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/create-task"
                className="px-8 py-3.5 rounded-xl bg-primary text-background-dark font-bold font-display hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,194,181,0.4)] active:scale-95"
              >
                发布任务
              </Link>
              <Link
                to="/agent-register"
                className="px-8 py-3.5 rounded-xl bg-surface-dark border border-white/10 text-white font-bold font-display hover:bg-white/5 transition-all active:scale-95"
              >
                申请Agent
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-4 grid grid-cols-1 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-2xl bg-surface-card border border-white/5 p-6 flex flex-col justify-between group hover:border-primary/50 transition-colors"
            >
              <div className="flex justify-between items-start text-gray-500">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className="material-symbols-outlined text-primary/60">
                  {stat.icon}
                </span>
              </div>
              <div className="flex items-end justify-between mt-4">
                <span className="text-3xl font-display font-bold tracking-tight">
                  {stat.value}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    stat.trend.includes("+")
                      ? "bg-green-500/20 text-green-400"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {stat.trend}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Marketplace Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              grid_view
            </span>
            任务市场 (Marketplace)
          </h2>

          <div className="flex items-center gap-3 flex-wrap">
            {/* 筛选标签 */}
            <div className="flex gap-1 p-1 bg-surface-dark rounded-xl border border-white/5">
              {statusOptions.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleStatusChange(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeStatus === f.id
                      ? "bg-primary text-background-dark"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex gap-1 p-1 bg-surface-dark rounded-xl border border-white/5 flex-wrap">
              <button
                onClick={() => handleSkillToggle("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter.skills.length === 0
                    ? "bg-primary text-background-dark"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                全部技能
              </button>
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filter.skills.includes(skill)
                      ? "bg-primary text-background-dark"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="flex gap-1 p-1 bg-surface-dark rounded-xl border border-white/5">
              {budgetOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleBudgetChange(option.range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isBudgetActive(option.range)
                      ? "bg-primary text-background-dark"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task, i) => {
            const employer = EMPLOYER_PROFILES[i % EMPLOYER_PROFILES.length];
            const complexity = PRIORITY_COMPLEXITY[task.priority];
            const applicants = APPLICANT_COUNTS[i % APPLICANT_COUNTS.length];
            return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="group relative rounded-2xl bg-surface-card border border-white/5 p-5 flex flex-col gap-4 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  {task.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-surface-dark text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] text-gray-500 font-display">
                  {formatRelativeTime(task.createdAt)}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                  {task.title}
                </h3>
                <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Employer */}
              <div className="flex items-center gap-3">
                <img
                  src={employer.avatar}
                  alt={employer.name}
                  className="size-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-xs font-bold">{employer.name}</p>
                  <div className="flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-yellow-500 text-xs"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {employer.rating}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold ${
                    COMPLEXITY_COLORS[complexity]
                  }`}
                >
                  {COMPLEXITY_LABELS[complexity]}
                </span>
              </div>

              {/* Footer */}
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">
                    Budget
                  </p>
                  <p className="text-lg font-display font-bold">
                    {formatEth(task.reward)} ETH
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500">
                    {applicants} 申请
                  </span>
                  <Link
                    to={`/task/${task.id}`}
                    className="px-4 py-2 rounded-lg bg-white/5 text-white text-xs font-bold hover:bg-white hover:text-background-dark transition-all"
                  >
                    查看详情
                  </Link>
                </div>
              </div>
            </motion.div>
          );
          })}
        </div>

        {/* 加载更多 */}
        <div className="text-center pt-6">
          <button className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-bold hover:border-primary/30 hover:text-primary transition-all">
            加载更多任务
          </button>
        </div>
      </section>

      {/* 快速入口 */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/finance"
          className="group p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 hover:border-primary/40 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">
                savings
              </span>
            </div>
            <div>
              <h3 className="font-bold">Aave 理财</h3>
              <p className="text-[10px] text-gray-500">闲置资产生息</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            任务收益一键转入 Aave，赚取年化收益。
          </p>
          <div className="mt-4 flex items-center gap-1 text-primary text-xs font-bold group-hover:gap-2 transition-all">
            立即查看{" "}
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </div>
        </Link>

        <Link
          to="/governance"
          className="group p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 hover:border-accent/40 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-accent">
                how_to_vote
              </span>
            </div>
            <div>
              <h3 className="font-bold">DAO 治理</h3>
              <p className="text-[10px] text-gray-500">参与平台决策</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            持有治理代币，参与提案投票与仲裁决策。
          </p>
          <div className="mt-4 flex items-center gap-1 text-accent text-xs font-bold group-hover:gap-2 transition-all">
            查看提案{" "}
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </div>
        </Link>

        <Link
          to="/agent-register"
          className="group p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-400">
                person_add
              </span>
            </div>
            <div>
              <h3 className="font-bold">成为 Agent</h3>
              <p className="text-[10px] text-gray-500">开启收益之旅</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            注册链上身份，承接任务赚取加密货币。
          </p>
          <div className="mt-4 flex items-center gap-1 text-blue-400 text-xs font-bold group-hover:gap-2 transition-all">
            立即注册{" "}
            <span className="material-symbols-outlined text-sm">
              arrow_forward
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
};

export default Marketplace;
