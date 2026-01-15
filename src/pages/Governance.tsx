/**
 * DAO 治理页面
 * 提案列表、投票、仲裁、金库统计
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";

interface Proposal {
  id: string;
  title: string;
  description: string;
  category: "protocol" | "treasury" | "arbitration" | "fee";
  votesFor: string;
  votesAgainst: string;
  status: "active" | "passed" | "rejected" | "pending";
  endTime: string;
  proposer: string;
}

const PROPOSALS: Proposal[] = [
  {
    id: "WIP-24",
    title: "协议升级 V2.1：引入动态佣金 Bonding Curve",
    description: "根据任务难度和市场供需动态调整佣金比例，提高平台竞争力。",
    category: "protocol",
    votesFor: "1.2M",
    votesAgainst: "240K",
    status: "active",
    endTime: "12h 45m",
    proposer: "0x8a3f...42e9",
  },
  {
    id: "WIP-25",
    title: "社区金库拨款：Web3 开发者激励计划",
    description: "从金库拨款 50,000 USDC 用于资助优秀开发者贡献开源工具。",
    category: "treasury",
    votesFor: "850K",
    votesAgainst: "920K",
    status: "active",
    endTime: "2d 04h",
    proposer: "0x3b2c...7d1a",
  },
  {
    id: "ARB-12",
    title: "争议仲裁：智能合约审计任务质量争议",
    description:
      "雇主认为交付物不符合要求，Agent 认为已按规范完成，请求社区仲裁。",
    category: "arbitration",
    votesFor: "320K",
    votesAgainst: "180K",
    status: "active",
    endTime: "8h 20m",
    proposer: "0x5e4d...9c3b",
  },
  {
    id: "WIP-23",
    title: "调整平台基础佣金费率至 6%",
    description: "基于市场调研和社区反馈，建议将基础佣金从 7% 调整至 6%。",
    category: "fee",
    votesFor: "2.1M",
    votesAgainst: "450K",
    status: "passed",
    endTime: "Ended",
    proposer: "0x9f8e...4a2c",
  },
];

const CATEGORY_CONFIG = {
  protocol: { label: "协议升级", color: "text-blue-400", bg: "bg-blue-500/10" },
  treasury: {
    label: "金库提案",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  arbitration: {
    label: "争议仲裁",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  fee: { label: "费率调整", color: "text-purple-400", bg: "bg-purple-500/10" },
};

const STATUS_CONFIG = {
  active: { label: "投票中", color: "text-primary", bg: "bg-primary/10" },
  passed: { label: "已通过", color: "text-green-400", bg: "bg-green-500/10" },
  rejected: { label: "已否决", color: "text-red-400", bg: "bg-red-500/10" },
  pending: {
    label: "待执行",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
};

const Governance: React.FC = () => {
  const { isConnected } = useAccount();
  const [filter, setFilter] = useState<"all" | "active" | "arbitration">("all");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );

  const votingPower = "12,450";
  const delegatedPower = "0";

  const filteredProposals =
    filter === "all"
      ? PROPOSALS
      : filter === "active"
      ? PROPOSALS.filter((p) => p.status === "active")
      : PROPOSALS.filter((p) => p.category === "arbitration");

  const handleVote = (proposalId: string, support: boolean) => {
    // TODO: 调用智能合约投票
    console.log("投票:", proposalId, support ? "支持" : "反对");
  };

  return (
    <div className="py-6 space-y-8">
      {/* 页面标题 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight">
            DAO 治理
          </h1>
          <p className="text-gray-400 mt-1">
            持有 $WAG 代币参与决策，所有投票权基于链上快照。
          </p>
        </div>
        {isConnected && (
          <div className="flex items-center gap-4 bg-surface-card p-4 rounded-2xl border border-white/5">
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-bold">
                您的投票权
              </p>
              <p className="text-lg font-display font-bold text-accent">
                {votingPower} WAG
              </p>
            </div>
            <span className="material-symbols-outlined text-accent">
              account_balance
            </span>
          </div>
        )}
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface-card border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase font-bold">
            活跃提案
          </p>
          <p className="text-2xl font-display font-bold text-primary mt-2">
            {PROPOSALS.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-surface-card border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase font-bold">
            金库 TVL
          </p>
          <p className="text-2xl font-display font-bold mt-2">$2.4M</p>
        </div>
        <div className="p-4 rounded-2xl bg-surface-card border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase font-bold">
            参与率
          </p>
          <p className="text-2xl font-display font-bold mt-2">42.8%</p>
        </div>
        <div className="p-4 rounded-2xl bg-surface-card border border-white/5">
          <p className="text-[10px] text-gray-500 uppercase font-bold">
            待仲裁
          </p>
          <p className="text-2xl font-display font-bold text-orange-400 mt-2">
            {
              PROPOSALS.filter(
                (p) => p.category === "arbitration" && p.status === "active"
              ).length
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 提案列表 */}
        <div className="lg:col-span-8 space-y-6">
          {/* 筛选 */}
          <div className="flex gap-2 p-1 bg-surface-dark rounded-xl border border-white/5 w-fit">
            {[
              { id: "all", label: "全部提案" },
              { id: "active", label: "投票中" },
              { id: "arbitration", label: "争议仲裁" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  filter === f.id
                    ? "bg-primary text-background-dark"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* 提案卡片 */}
          <div className="space-y-4">
            {filteredProposals.map((prop, i) => {
              const totalVotes =
                parseInt(prop.votesFor.replace(/[^0-9]/g, "")) +
                parseInt(prop.votesAgainst.replace(/[^0-9]/g, ""));
              const forPercent = (
                (parseInt(prop.votesFor.replace(/[^0-9]/g, "")) / totalVotes) *
                100
              ).toFixed(0);
              const againstPercent = (100 - parseInt(forPercent)).toFixed(0);

              return (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-3xl bg-surface-card border border-white/5 hover:border-primary/20 transition-all"
                >
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                        {prop.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded ${
                          CATEGORY_CONFIG[prop.category].bg
                        } ${
                          CATEGORY_CONFIG[prop.category].color
                        } text-[10px] font-bold`}
                      >
                        {CATEGORY_CONFIG[prop.category].label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded ${
                          STATUS_CONFIG[prop.status].bg
                        } ${
                          STATUS_CONFIG[prop.status].color
                        } text-[10px] font-bold`}
                      >
                        {STATUS_CONFIG[prop.status].label}
                      </span>
                    </div>
                    {prop.status === "active" && (
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          schedule
                        </span>
                        {prop.endTime} left
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2">{prop.title}</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    {prop.description}
                  </p>

                  {/* 投票进度 */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                        <span className="text-green-400">
                          支持 ({prop.votesFor}) - {forPercent}%
                        </span>
                        <span className="text-red-400">
                          反对 ({prop.votesAgainst}) - {againstPercent}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-background-dark rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${forPercent}%` }}
                        />
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${againstPercent}%` }}
                        />
                      </div>
                    </div>

                    {prop.status === "active" && isConnected && (
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => handleVote(prop.id, true)}
                          className="flex-1 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold hover:bg-green-500 hover:text-white transition-all"
                        >
                          支持 (For)
                        </button>
                        <button
                          onClick={() => handleVote(prop.id, false)}
                          className="flex-1 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                        >
                          反对 (Against)
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 提案者 */}
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                    <span>提案者: {prop.proposer}</span>
                    <button className="text-primary font-bold hover:underline">
                      查看详情 →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 侧边栏 */}
        <div className="lg:col-span-4 space-y-6">
          {/* 创建提案 */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">
                add_circle
              </span>
              创建提案
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              需持有至少 1,000 WAG 才能创建提案。您当前持有 {votingPower} WAG。
            </p>
            <button className="w-full py-3 rounded-xl bg-primary text-background-dark font-bold hover:shadow-[0_0_20px_rgba(0,194,181,0.3)] transition-all">
              创建新提案
            </button>
          </div>

          {/* 仲裁池 */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-accent">
                gavel
              </span>
              <h4 className="font-bold text-sm">加入陪审团</h4>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed mb-4">
              质押 $WAG 进入仲裁池，参与争议裁决并赚取协议分红。当前仲裁池奖励
              APY: <span className="text-accent font-bold">12.5%</span>
            </p>
            <div className="p-3 rounded-xl bg-background-dark/50 border border-white/5 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">仲裁池总质押</span>
                <span className="font-bold">1.2M WAG</span>
              </div>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-gray-500">您的质押</span>
                <span className="font-bold">0 WAG</span>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-accent text-white text-xs font-bold hover:scale-105 transition-all shadow-[0_0_15px_rgba(157,78,221,0.3)]">
              立即加入
            </button>
          </div>

          {/* 委托投票权 */}
          <div className="p-6 rounded-3xl bg-surface-card border border-white/5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
              委托投票权
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              无暇参与投票？可将投票权委托给信任的代表。
            </p>
            <input
              type="text"
              placeholder="输入代表地址 (0x...)"
              className="w-full px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white text-xs placeholder:text-gray-600 focus:border-primary/50 focus:outline-none mb-3"
            />
            <button className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-bold hover:bg-white/5 transition-all">
              委托投票权
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Governance;
