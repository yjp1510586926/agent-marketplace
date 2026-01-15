/**
 * 任务详情页面
 * 展示任务完整信息、申请流程、佣金明细
 */
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

const MOCK_TASK = {
  id: 1,
  title: "智能合约安全性审计",
  description: `我们需要对 DeFi 质押模块进行全面的安全审计，包括重入攻击测试、边界条件校验以及 Gas 效率优化分析。

具体要求：
1. 审核合约代码中的重入攻击风险和溢出检查
2. 进行模拟主网分叉环境的测试用例编写
3. 提供详细的 PDF 格式审计报告
4. 对发现的漏洞提供修复建议并在修复后重新验证

交付标准：
- 完整的审计报告（PDF格式）
- 测试用例代码（Foundry/Hardhat）
- 漏洞修复建议文档`,
  budget: "2.5",
  token: "ETH",
  usdValue: "$6,200.00",
  duration: 7,
  complexity: "advanced",
  tags: ["Solidity", "Audit", "Security", "DeFi"],
  employer: {
    name: "NexusFi Protocol",
    avatar: "https://picsum.photos/100?1",
    rating: 4.9,
    totalTasks: 28,
    verified: true,
  },
  commission: {
    rate: 8,
    amount: "0.20",
    agentReceives: "2.30",
  },
  applicants: 5,
  createdAt: "2h ago",
  status: "open",
};

const TaskDetail: React.FC = () => {
  const { id } = useParams();
  const { isConnected } = useAccount();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");

  const task = MOCK_TASK;

  const handleApply = () => {
    // TODO: 调用智能合约申请任务
    console.log("申请任务:", id, applicationMessage);
    setShowApplyModal(false);
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
                    {task.createdAt}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase">
                    高级
                  </span>
                </div>
                <h1 className="text-3xl font-display font-black">
                  {task.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
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
                  {task.budget} {task.token}
                </p>
                <p className="text-[10px] text-gray-500 mt-2">
                  ≈ {task.usdValue}
                </p>
              </div>
            </div>

            {/* 任务属性 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-background-dark/50 border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                  预计周期
                </p>
                <p className="text-sm font-bold">{task.duration} 天</p>
              </div>
              <div className="p-4 rounded-2xl bg-background-dark/50 border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                  难度等级
                </p>
                <p className="text-sm font-bold text-yellow-500">高级</p>
              </div>
              <div className="p-4 rounded-2xl bg-background-dark/50 border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                  申请人数
                </p>
                <p className="text-sm font-bold">{task.applicants} 人</p>
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
                {task.description}
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
                    {task.budget} {task.token}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">
                    平台佣金 ({task.commission.rate}%)
                  </span>
                  <span className="font-display font-bold text-yellow-400">
                    -{task.commission.amount} {task.token}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-center text-sm">
                  <span className="text-gray-400">您将获得</span>
                  <span className="font-display font-bold text-green-400 text-lg">
                    {task.commission.agentReceives} {task.token}
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
                  src={task.employer.avatar}
                  alt={task.employer.name}
                  className="size-12 rounded-full object-cover"
                />
                {task.employer.verified && (
                  <div className="absolute -bottom-1 -right-1 size-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-background-dark text-xs">
                      verified
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{task.employer.name}</p>
                <p className="text-[10px] text-gray-500">
                  {task.employer.totalTasks} 个任务发布
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
                  {task.employer.rating}
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
                  {task.commission.rate}% (雇主支付)
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
                <span className="font-bold">0.1 ETH</span>
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
    </div>
  );
};

export default TaskDetail;
