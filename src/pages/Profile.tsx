/**
 * 个人中心页面
 * 展示用户/Agent 信息、任务历史、财务账单
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";

interface LedgerItem {
  id: string;
  date: string;
  type: "income" | "yield" | "arbitration" | "commission";
  amount: string;
  memo: string;
  fee: string;
  txHash: string;
}

interface TaskHistory {
  id: number;
  title: string;
  status: "in_progress" | "completed" | "disputed";
  budget: string;
  date: string;
  role: "employer" | "agent";
}

const LEDGER_ITEMS: LedgerItem[] = [
  {
    id: "TX-901",
    date: "2024-05-20",
    type: "income",
    amount: "+1.20 ETH",
    memo: "NFT Staking Optimization",
    fee: "0.06 ETH",
    txHash: "0x1234...5678",
  },
  {
    id: "TX-882",
    date: "2024-05-18",
    type: "yield",
    amount: "+45.20 USDC",
    memo: "Aave Supply Interest",
    fee: "0.45 USDC",
    txHash: "0x2345...6789",
  },
  {
    id: "TX-763",
    date: "2024-05-15",
    type: "arbitration",
    amount: "+150.00 WAG",
    memo: "Dispute Verdict Reward",
    fee: "0.00",
    txHash: "0x3456...7890",
  },
  {
    id: "TX-654",
    date: "2024-05-12",
    type: "income",
    amount: "+0.85 ETH",
    memo: "Smart Contract Audit",
    fee: "0.04 ETH",
    txHash: "0x4567...8901",
  },
  {
    id: "TX-545",
    date: "2024-05-10",
    type: "commission",
    amount: "-0.05 ETH",
    memo: "Platform Commission",
    fee: "0.00",
    txHash: "0x5678...9012",
  },
];

const TASK_HISTORY: TaskHistory[] = [
  {
    id: 1,
    title: "智能合约升级 - Protocol v2",
    status: "in_progress",
    budget: "0.85 ETH",
    date: "2024-05-20",
    role: "agent",
  },
  {
    id: 2,
    title: "DeFi 仪表盘设计",
    status: "in_progress",
    budget: "600 USDC",
    date: "2024-05-18",
    role: "agent",
  },
  {
    id: 3,
    title: "NFT 交易市场开发",
    status: "completed",
    budget: "2.5 ETH",
    date: "2024-05-15",
    role: "agent",
  },
  {
    id: 4,
    title: "社区运营方案",
    status: "completed",
    budget: "800 DAI",
    date: "2024-05-10",
    role: "employer",
  },
];

const TYPE_CONFIG = {
  income: { label: "任务收入", color: "text-green-400", bg: "bg-green-500/10" },
  yield: { label: "理财收益", color: "text-primary", bg: "bg-primary/10" },
  arbitration: { label: "仲裁奖励", color: "text-accent", bg: "bg-accent/10" },
  commission: {
    label: "平台佣金",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
};

const STATUS_CONFIG = {
  in_progress: {
    label: "进行中",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  completed: {
    label: "已完成",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  disputed: {
    label: "争议中",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
};

const Profile: React.FC = () => {
  const { isConnected, address } = useAccount();
  const [activeView, setActiveView] = useState<"tasks" | "ledger">("tasks");

  // 模拟用户数据
  const userData = {
    name: "CryptoDev.eth",
    level: 42,
    reputation: 98.5,
    rank: 124,
    totalEarnings: "$45,280",
    totalTasks: 156,
    skills: ["Smart Contract", "Security", "Frontend", "DeFi", "NFT"],
    isAgent: true,
  };

  if (!isConnected) {
    return (
      <div className="py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto p-8 rounded-3xl bg-surface-card border border-white/5"
        >
          <div className="size-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-accent">
              person
            </span>
          </div>
          <h2 className="text-2xl font-display font-bold mb-3">连接钱包</h2>
          <p className="text-gray-400 text-sm mb-6">
            连接您的 Web3 钱包以查看个人中心和账单记录。
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary text-sm font-bold hover:underline"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            返回首页连接钱包
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 左侧：个人信息 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-6"
        >
          {/* 头像卡片 */}
          <div className="p-8 rounded-3xl bg-surface-card border border-white/5 text-center">
            <div className="relative inline-block mb-6">
              <div className="size-24 rounded-full p-1 bg-gradient-to-tr from-primary to-accent">
                <img
                  src="https://picsum.photos/200"
                  className="size-full rounded-full border-2 border-background-dark object-cover"
                  alt="avatar"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 size-7 bg-primary rounded-full flex items-center justify-center text-background-dark">
                <span className="material-symbols-outlined text-sm font-bold">
                  verified
                </span>
              </div>
            </div>
            <h2 className="text-xl font-display font-bold">{userData.name}</h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">
              Level {userData.level} Agent
            </p>
            <p className="text-[10px] text-gray-600 mt-2 font-mono">
              {address}
            </p>

            <div className="flex justify-center gap-3 mt-6">
              <div className="px-4 py-2 rounded-xl bg-surface-dark border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase">
                  信誉
                </p>
                <p className="text-sm font-display font-bold text-green-400">
                  {userData.reputation}%
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-surface-dark border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase">
                  排名
                </p>
                <p className="text-sm font-display font-bold">
                  #{userData.rank}
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-surface-dark border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase">
                  任务
                </p>
                <p className="text-sm font-display font-bold">
                  {userData.totalTasks}
                </p>
              </div>
            </div>

            <button className="w-full mt-8 py-3 rounded-xl bg-white text-background-dark font-bold text-sm hover:bg-primary transition-all">
              编辑资料
            </button>
          </div>

          {/* 技能勋章 */}
          <div className="p-6 rounded-3xl bg-surface-card border border-white/5">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
              技能勋章
            </h4>
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold text-gray-400 border border-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 收益概览 */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
              累计收益
            </h4>
            <p className="text-3xl font-display font-bold">
              {userData.totalEarnings}
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                to="/finance"
                className="flex-1 py-2 rounded-lg bg-primary text-background-dark text-xs font-bold text-center hover:shadow-lg transition-all"
              >
                去理财
              </Link>
              <button className="flex-1 py-2 rounded-lg border border-white/10 text-xs font-bold text-center hover:bg-white/5 transition-all">
                提现
              </button>
            </div>
          </div>
        </motion.div>

        {/* 右侧：活动/账单 */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tab 切换 */}
          <div className="flex gap-4 border-b border-white/5">
            <button
              onClick={() => setActiveView("tasks")}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeView === "tasks" ? "text-primary" : "text-gray-500"
              }`}
            >
              任务历史
              {activeView === "tasks" && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
            <button
              onClick={() => setActiveView("ledger")}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeView === "ledger" ? "text-primary" : "text-gray-500"
              }`}
            >
              财务看板 (Ledger)
              {activeView === "ledger" && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeView === "tasks" ? (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {TASK_HISTORY.map((task) => (
                  <div
                    key={task.id}
                    className="p-5 rounded-2xl bg-surface-card border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group hover:border-primary/30 transition-all"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="size-10 rounded-xl bg-surface-dark flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">
                          {task.role === "agent"
                            ? "engineering"
                            : "business_center"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{task.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              STATUS_CONFIG[task.status].bg
                            } ${STATUS_CONFIG[task.status].color}`}
                          >
                            {STATUS_CONFIG[task.status].label}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {task.date}
                          </span>
                          <span className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded bg-surface-dark">
                            {task.role === "agent" ? "承接" : "发布"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-display font-bold">
                        {task.budget}
                      </span>
                      <Link
                        to={`/task/${task.id}`}
                        className="px-3 py-1.5 rounded-lg bg-white/5 text-xs font-bold hover:bg-primary hover:text-background-dark transition-all"
                      >
                        查看
                      </Link>
                    </div>
                  </div>
                ))}

                <button className="w-full py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-bold hover:border-primary/30 hover:text-primary transition-all">
                  加载更多
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="ledger"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="overflow-x-auto rounded-2xl bg-surface-card border border-white/5">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] text-gray-500 uppercase font-bold border-b border-white/5">
                        <th className="p-4">交易 ID</th>
                        <th className="p-4">日期</th>
                        <th className="p-4">类别</th>
                        <th className="p-4">事项</th>
                        <th className="p-4 text-right">金额</th>
                        <th className="p-4 text-right">佣金</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {LEDGER_ITEMS.map((item) => (
                        <tr
                          key={item.id}
                          className="text-xs group hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-display text-gray-400">
                                {item.id}
                              </span>
                              <a
                                href={`https://etherscan.io/tx/${item.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  open_in_new
                                </span>
                              </a>
                            </div>
                          </td>
                          <td className="p-4 text-gray-500">{item.date}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                TYPE_CONFIG[item.type].bg
                              } ${TYPE_CONFIG[item.type].color}`}
                            >
                              {TYPE_CONFIG[item.type].label}
                            </span>
                          </td>
                          <td className="p-4 font-bold">{item.memo}</td>
                          <td className="p-4 text-right">
                            <span
                              className={`font-display font-bold ${
                                item.amount.startsWith("+")
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {item.amount}
                            </span>
                          </td>
                          <td className="p-4 text-right text-gray-500">
                            {item.fee}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 账单验证 & 导出 */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">
                      verified
                    </span>
                    <span className="text-xs font-bold text-gray-300">
                      所有账单已通过区块链 Hash 签名验证
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-surface-dark border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                      验证签名
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-primary text-background-dark text-[10px] font-bold uppercase tracking-widest hover:shadow-lg transition-all">
                      下载 PDF 报表
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Profile;
