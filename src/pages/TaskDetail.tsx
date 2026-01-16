/**
 * 任务详情页面
 * 展示任务完整信息、申请流程、佣金明细
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

import { createMockTasks } from "../services/mockData";
import { useTaskStore } from "../stores";
import { useCheckBalance } from "../hooks/useCheckBalance";
import { TxProgressModal } from "../components/common";
import { formatEth, formatNumber, formatRelativeTime } from "../utils/format";
import { toast } from "../utils/toast";
import type { TaskPriority } from "../types/task";
import type { TxStatus } from "../hooks/useTxStatus";

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
  {
    name: "NexusFi Protocol",
    avatar: "https://picsum.photos/100?1",
    rating: 4.9,
    totalTasks: 28,
    verified: true,
  },
  {
    name: "MetaDAO Labs",
    avatar: "https://picsum.photos/100?2",
    rating: 4.7,
    totalTasks: 21,
    verified: true,
  },
  {
    name: "AlphaLabs Studio",
    avatar: "https://picsum.photos/100?3",
    rating: 4.6,
    totalTasks: 17,
    verified: false,
  },
  {
    name: "DevGuild",
    avatar: "https://picsum.photos/100?4",
    rating: 4.8,
    totalTasks: 32,
    verified: true,
  },
  {
    name: "ArtBlock",
    avatar: "https://picsum.photos/100?5",
    rating: 4.5,
    totalTasks: 12,
    verified: false,
  },
  {
    name: "LendDAO",
    avatar: "https://picsum.photos/100?6",
    rating: 4.4,
    totalTasks: 19,
    verified: true,
  },
];

const APPLICANT_COUNTS = [5, 12, 8, 3, 7, 15];
const COMMISSION_RATE = 8;
const APPLY_DEPOSIT_ETH = 0.1;
const ETH_USD_RATE = 2480;

const resolveProfileIndex = (taskId: string) => {
  let hash = 0;
  for (const char of taskId) {
    hash = (hash + char.charCodeAt(0)) % EMPLOYER_PROFILES.length;
  }
  return hash;
};

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isConnected } = useAccount();
  const { tasks, setTasks } = useTaskStore();
  const { checkBalance } = useCheckBalance({ tokenSymbol: "ETH" });
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [txOpen, setTxOpen] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txMessage, setTxMessage] = useState("等待发起交易");
  const timerIdsRef = useRef<number[]>([]);

  useEffect(() => {
    if (tasks.length === 0) {
      // 初始化任务列表（Mock 数据）
      setTasks(createMockTasks());
    }
  }, [setTasks, tasks.length]);

  const task = useMemo(
    () => tasks.find((item) => item.id === id),
    [id, tasks]
  );

  const taskView = useMemo(() => {
    if (!task) return null;

    const complexityKey = PRIORITY_COMPLEXITY[task.priority];
    const commissionAmount =
      (task.reward * BigInt(COMMISSION_RATE)) / 100n;
    const agentReceives = task.reward - commissionAmount;
    const durationDays = Math.max(
      1,
      Math.ceil((task.deadline - task.createdAt) / 86400)
    );
    const profileIndex = resolveProfileIndex(task.id);
    const applicants = APPLICANT_COUNTS[profileIndex % APPLICANT_COUNTS.length];
    const budgetEth = formatEth(task.reward, 2);
    const usdValue = formatNumber(
      Math.round((Number(task.reward) / 1e18) * ETH_USD_RATE)
    );

    return {
      ...task,
      budgetEth,
      usdValue,
      durationDays,
      complexityKey,
      complexityLabel: COMPLEXITY_LABELS[complexityKey],
      complexityColor: COMPLEXITY_COLORS[complexityKey],
      createdAtLabel: formatRelativeTime(task.createdAt),
      employer: EMPLOYER_PROFILES[profileIndex],
      applicants,
      commission: {
        rate: COMMISSION_RATE,
        amount: formatEth(commissionAmount, 2),
        agentReceives: formatEth(agentReceives, 2),
      },
    };
  }, [task]);

  useEffect(() => {
    return () => {
      // 清理模拟交易的定时器
      timerIdsRef.current.forEach((timerId) => window.clearTimeout(timerId));
      timerIdsRef.current = [];
    };
  }, []);

  if (!id) {
    return (
      <div className="py-6 space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>{" "}
          返回市场
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-surface-card border border-white/5 text-center space-y-3"
        >
          <h2 className="text-xl font-bold">任务不存在</h2>
          <p className="text-sm text-gray-400">
            未找到对应任务 ID，请返回市场重新选择。
          </p>
        </motion.div>
      </div>
    );
  }

  if (!taskView && tasks.length > 0) {
    return (
      <div className="py-6 space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>{" "}
          返回市场
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-surface-card border border-white/5 text-center space-y-3"
        >
          <h2 className="text-xl font-bold">404 · 任务不存在</h2>
          <p className="text-sm text-gray-400">
            该任务可能已下架或被删除，请返回市场查看其他任务。
          </p>
        </motion.div>
      </div>
    );
  }

  if (!taskView) {
    return (
      <div className="py-6 space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>{" "}
          返回市场
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-3xl bg-surface-card border border-white/5 text-center space-y-3"
        >
          <h2 className="text-xl font-bold">任务加载中</h2>
          <p className="text-sm text-gray-400">正在同步任务数据，请稍候。</p>
        </motion.div>
      </div>
    );
  }

  const handleApply = () => {
    // 申请前校验余额（Mock 逻辑）
    const hasBalance = checkBalance({ amount: APPLY_DEPOSIT_ETH });
    if (!hasBalance) return;

    setShowApplyModal(false);
    setTxOpen(true);
    setTxStatus("pending");
    setTxMessage("等待钱包签名");

    timerIdsRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timerIdsRef.current = [];

    const confirmTimer = window.setTimeout(() => {
      setTxStatus("confirming");
      setTxMessage("交易确认中");
    }, 900);

    const successTimer = window.setTimeout(() => {
      setTxStatus("success");
      setTxMessage("申请已提交");
      toast.success({ message: "任务申请已提交，等待雇主确认。" });
    }, 2000);

    timerIdsRef.current.push(confirmTimer, successTimer);
  };

  return (
    <div className="py-6 space-y-8">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>{" "}
        返回市场
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 主信息区 */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-surface-card border border-white/5 space-y-6"
          >
            {/* 标题区 */}
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase">
                    ID: #{id}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-dark text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {taskView.createdAtLabel}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded bg-yellow-500/20 text-[10px] font-bold uppercase ${taskView.complexityColor}`}
                  >
                    {taskView.complexityLabel}
                  </span>
                </div>
                <h1 className="text-3xl font-display font-black">
                  {taskView.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {taskView.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-surface-dark text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-surface-dark rounded-2xl p-6 border border-white/5 text-right min-w-[160px]">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">
                  Total Budget
                </p>
                <p className="text-3xl font-display font-bold text-primary">
                  {taskView.budgetEth} ETH
                </p>
                <p className="text-[10px] text-gray-500 mt-2">
                  ≈ ${taskView.usdValue}
                </p>
              </div>
            </div>

            {/* 任务属性 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-background-dark/50 border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                  预计周期
                </p>
                <p className="text-sm font-bold">
                  {taskView.durationDays} 天
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-background-dark/50 border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                  难度等级
                </p>
                <p className={`text-sm font-bold ${taskView.complexityColor}`}>
                  {taskView.complexityLabel}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-background-dark/50 border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                  申请人数
                </p>
                <p className="text-sm font-bold">{taskView.applicants} 人</p>
              </div>
              <div className="p-4 rounded-2xl bg-background-dark/50 border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                  支付方式
                </p>
                <p className="text-sm font-bold text-green-400">智能合约托管</p>
              </div>
            </div>

            {/* 任务描述 */}
            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  description
                </span>
                任务详情
              </h3>
              <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                {taskView.description}
              </div>
            </div>

            {/* 佣金明细 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  receipt_long
                </span>
                费用明细（链上透明）
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">任务预算</span>
                  <span className="font-display font-bold">
                    {taskView.budgetEth} ETH
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">
                    平台佣金 ({taskView.commission.rate}%)
                  </span>
                  <span className="font-display font-bold text-yellow-400">
                    -{taskView.commission.amount} ETH
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-center text-sm">
                  <span className="text-gray-400">您将获得</span>
                  <span className="font-display font-bold text-green-400 text-lg">
                    {taskView.commission.agentReceives} ETH
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 侧边栏 */}
        <div className="lg:col-span-4 space-y-6">
          {/* 雇主信息 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl bg-surface-card border border-white/5 space-y-6"
          >
            <h3 className="font-bold">雇主信息</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={taskView.employer.avatar}
                  alt={taskView.employer.name}
                  className="size-12 rounded-full object-cover"
                />
                {taskView.employer.verified && (
                  <div className="absolute -bottom-1 -right-1 size-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-background-dark text-xs">
                      verified
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{taskView.employer.name}</p>
                <p className="text-[10px] text-gray-500">
                  {taskView.employer.totalTasks} 个任务发布
                </p>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-yellow-500 text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="text-xs font-bold">
                  {taskView.employer.rating}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">任务押金</span>
                <span className="text-white font-bold">0.1 ETH</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">预计佣金</span>
                <span className="text-white font-bold">
                  {taskView.commission.rate}% (雇主支付)
                </span>
              </div>

              {isConnected ? (
                <>
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full py-4 rounded-xl bg-primary text-background-dark font-bold hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(0,194,181,0.3)]"
                  >
                    申请该任务
                  </button>
                  <button className="w-full py-4 rounded-xl bg-surface-dark border border-white/10 text-white font-bold hover:bg-white/5 transition-all">
                    咨询雇主
                  </button>
                </>
              ) : (
                <div className="p-4 rounded-xl bg-background-dark/50 border border-white/5 text-center">
                  <p className="text-xs text-gray-500 mb-2">请先连接钱包</p>
                  <Link
                    to="/"
                    className="text-primary text-xs font-bold hover:underline"
                  >
                    返回首页连接 →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* 安全保障 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl bg-surface-card border border-white/5"
          >
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
              安全保障
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary">
                  security
                </span>
                <div>
                  <p className="text-sm font-bold">智能合约托管</p>
                  <p className="text-[10px] text-gray-500">
                    资金安全存入合约，完成后自动结算
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-accent">
                  gavel
                </span>
                <div>
                  <p className="text-sm font-bold">DAO 仲裁保护</p>
                  <p className="text-[10px] text-gray-500">
                    争议由社区公正裁决
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-green-400">
                  savings
                </span>
                <div>
                  <p className="text-sm font-bold">收益可理财</p>
                  <p className="text-[10px] text-gray-500">
                    完成后可一键转入 Aave
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 申请弹窗 */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg p-8 rounded-3xl bg-surface-card border border-white/10"
          >
            <h2 className="text-xl font-bold mb-4">申请任务</h2>
            <p className="text-sm text-gray-400 mb-6">
              请简要说明您的相关经验和为什么适合这个任务。
            </p>

            <textarea
              value={applicationMessage}
              onChange={(e) => setApplicationMessage(e.target.value)}
              placeholder="我有5年智能合约开发经验，曾为多个DeFi协议进行安全审计..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:outline-none transition-colors resize-none mb-6"
            />

            <div className="p-4 rounded-xl bg-background-dark/50 border border-white/5 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">需支付押金</span>
                <span className="font-bold">{APPLY_DEPOSIT_ETH} ETH</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                押金将在任务完成后返还，若违约将扣除作为赔偿。
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleApply}
                disabled={!applicationMessage.trim()}
                className="flex-1 py-3 rounded-xl bg-primary text-background-dark font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,194,181,0.3)] transition-all"
              >
                确认申请 & 支付押金
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <TxProgressModal
        open={txOpen}
        status={txStatus}
        statusMessage={txMessage}
        onClose={() => {
          setTxOpen(false);
          setTxStatus("idle");
          setTxMessage("等待发起交易");
          setApplicationMessage("");
        }}
      />
    </div>
  );
};

export default TaskDetail;
