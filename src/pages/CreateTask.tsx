/**
 * 任务发布页面
 * 包含完整的任务发布流程：基本信息、预算设置、佣金计算、技能需求
 */
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import { SUPPORTED_TOKENS, COMMISSION_CONFIG } from "../config/wagmi";

type TaskCategory = "development" | "design" | "marketing" | "audit" | "other";

interface TaskFormData {
  title: string;
  description: string;
  category: TaskCategory;
  skills: string[];
  budget: string;
  token: (typeof SUPPORTED_TOKENS)[number]["symbol"];
  duration: number; // 天数
  complexity: "basic" | "intermediate" | "advanced" | "expert";
}

const CATEGORIES = [
  { id: "development", name: "开发", icon: "code", color: "text-blue-400" },
  { id: "design", name: "设计", icon: "palette", color: "text-pink-400" },
  { id: "marketing", name: "运营", icon: "campaign", color: "text-orange-400" },
  { id: "audit", name: "审计", icon: "verified_user", color: "text-green-400" },
  { id: "other", name: "其他", icon: "category", color: "text-gray-400" },
] as const;

const SKILL_SUGGESTIONS: Record<TaskCategory, string[]> = {
  development: [
    "Solidity",
    "React",
    "Node.js",
    "Rust",
    "Web3.js",
    "Wagmi",
    "Smart Contract",
    "DeFi",
  ],
  design: ["UI/UX", "Figma", "Brand Design", "NFT Art", "Motion Design", "3D"],
  marketing: [
    "Twitter",
    "Discord",
    "Community",
    "KOL",
    "Content",
    "SEO",
    "Growth",
  ],
  audit: [
    "Security",
    "Formal Verification",
    "Slither",
    "Mythril",
    "Code Review",
  ],
  other: ["Research", "Writing", "Translation", "Video", "Consulting"],
};

const COMPLEXITY_OPTIONS = [
  {
    id: "basic",
    name: "基础",
    desc: "简单任务，无需专业技能",
    multiplier: 0.05,
  },
  {
    id: "intermediate",
    name: "中级",
    desc: "需要一定专业经验",
    multiplier: 0.07,
  },
  {
    id: "advanced",
    name: "高级",
    desc: "复杂任务，需要深度专业知识",
    multiplier: 0.08,
  },
  {
    id: "expert",
    name: "专家",
    desc: "顶级难度，需要行业专家",
    multiplier: 0.1,
  },
] as const;

const CreateTask: React.FC = () => {
  const { isConnected, address } = useAccount();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    category: "development",
    skills: [],
    budget: "",
    token: "ETH",
    duration: 7,
    complexity: "intermediate",
  });

  // 计算佣金
  const commission = useMemo(() => {
    const budgetNum = parseFloat(formData.budget) || 0;
    const rate =
      COMPLEXITY_OPTIONS.find((c) => c.id === formData.complexity)
        ?.multiplier || COMMISSION_CONFIG.defaultRate;
    return {
      rate: (rate * 100).toFixed(0),
      amount: (budgetNum * rate).toFixed(4),
      agentReceives: (budgetNum * (1 - rate)).toFixed(4),
      total: budgetNum.toFixed(4),
    };
  }, [formData.budget, formData.complexity]);

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = () => {
    // TODO: 调用智能合约发布任务
    console.log("发布任务:", formData);
  };

  if (!isConnected) {
    return (
      <div className="py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto p-8 rounded-3xl bg-surface-card border border-white/5"
        >
          <div className="size-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-primary">
              account_balance_wallet
            </span>
          </div>
          <h2 className="text-2xl font-display font-bold mb-3">连接钱包</h2>
          <p className="text-gray-400 text-sm mb-6">
            请先连接您的 Web3
            钱包以发布任务。所有任务资金将通过智能合约安全托管。
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
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-gray-500 text-sm hover:text-primary transition-colors mb-2"
          >
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            返回市场
          </Link>
          <h1 className="text-3xl font-display font-black">发布任务</h1>
          <p className="text-gray-400 mt-1">设置任务详情、预算和技能需求</p>
        </div>

        {/* 步骤指示器 */}
        <div className="hidden md:flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`size-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s
                    ? "bg-primary text-background-dark"
                    : "bg-surface-dark text-gray-500 border border-white/10"
                }`}
              >
                {step > s ? (
                  <span className="material-symbols-outlined text-sm">
                    check
                  </span>
                ) : (
                  s
                )}
              </div>
              {s < 3 && (
                <div
                  className={`w-8 h-0.5 ${
                    step > s ? "bg-primary" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 主表单区 */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 rounded-3xl bg-surface-card border border-white/5 space-y-6"
              >
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    edit_note
                  </span>
                  基本信息
                </h2>

                {/* 任务标题 */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400">
                    任务标题 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="例如：智能合约安全审计"
                    className="w-full px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>

                {/* 任务描述 */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400">
                    任务描述 *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="详细描述任务要求、交付标准、验收条件等..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* 任务类别 */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400">
                    任务类别
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            category: cat.id as TaskCategory,
                            skills: [],
                          }))
                        }
                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                          formData.category === cat.id
                            ? "bg-primary/10 border-primary/50"
                            : "bg-surface-dark border-white/5 hover:border-white/20"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined ${cat.color}`}
                        >
                          {cat.icon}
                        </span>
                        <span className="text-xs font-bold">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 技能标签 */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400">
                    技能要求（可多选）
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SKILL_SUGGESTIONS[formData.category].map((skill) => (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          formData.skills.includes(skill)
                            ? "bg-primary text-background-dark"
                            : "bg-surface-dark text-gray-400 border border-white/10 hover:border-primary/30"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.title || !formData.description}
                  className="w-full py-4 rounded-xl bg-primary text-background-dark font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,194,181,0.3)] transition-all"
                >
                  下一步：设置预算
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 rounded-3xl bg-surface-card border border-white/5 space-y-6"
              >
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    payments
                  </span>
                  预算与佣金
                </h2>

                {/* 预算金额 */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400">
                    任务预算 *
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            budget: e.target.value,
                          }))
                        }
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white text-lg font-display placeholder:text-gray-600 focus:border-primary/50 focus:outline-none transition-colors"
                      />
                    </div>
                    <select
                      value={formData.token}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          token: e.target.value as any,
                        }))
                      }
                      className="px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white font-bold focus:border-primary/50 focus:outline-none"
                    >
                      {SUPPORTED_TOKENS.map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.icon} {token.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 任务周期 */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400">
                    预计周期
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="90"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          duration: parseInt(e.target.value),
                        }))
                      }
                      className="flex-1 accent-primary"
                    />
                    <span className="text-lg font-display font-bold w-20 text-right">
                      {formData.duration} 天
                    </span>
                  </div>
                </div>

                {/* 难度等级 */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-400">
                    任务难度（影响佣金比例）
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {COMPLEXITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            complexity: opt.id as any,
                          }))
                        }
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.complexity === opt.id
                            ? "bg-primary/10 border-primary/50"
                            : "bg-surface-dark border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold">{opt.name}</span>
                          <span className="text-xs text-primary font-bold">
                            {(opt.multiplier * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                  >
                    上一步
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={
                      !formData.budget || parseFloat(formData.budget) <= 0
                    }
                    className="flex-1 py-4 rounded-xl bg-primary text-background-dark font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(0,194,181,0.3)] transition-all"
                  >
                    下一步：确认发布
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 rounded-3xl bg-surface-card border border-white/5 space-y-6"
              >
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    fact_check
                  </span>
                  确认任务信息
                </h2>

                {/* 任务摘要 */}
                <div className="space-y-4 p-6 rounded-2xl bg-background-dark/50 border border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                        任务标题
                      </p>
                      <p className="font-bold text-lg">{formData.title}</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase">
                      {CATEGORIES.find((c) => c.id === formData.category)?.name}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                      任务描述
                    </p>
                    <p className="text-sm text-gray-400 line-clamp-3">
                      {formData.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded bg-surface-dark text-[10px] font-bold text-gray-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">预计周期</span>
                    <span className="font-bold">{formData.duration} 天</span>
                  </div>
                </div>

                {/* 费用明细 */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      receipt_long
                    </span>
                    费用明细（链上透明）
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">任务预算</span>
                      <span className="font-display font-bold">
                        {commission.total} {formData.token}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">
                        平台佣金 ({commission.rate}%)
                      </span>
                      <span className="font-display font-bold text-yellow-400">
                        -{commission.amount} {formData.token}
                      </span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                      <span className="text-gray-400">Agent 实际所得</span>
                      <span className="font-display font-bold text-green-400">
                        {commission.agentReceives} {formData.token}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 智能合约托管说明 */}
                <div className="p-4 rounded-xl bg-surface-dark/50 border border-white/5 flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">
                    security
                  </span>
                  <div>
                    <p className="text-sm font-bold">智能合约安全托管</p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      任务资金将存入平台智能合约托管，任务完成并验收后自动结算。如有争议，可通过
                      DAO 仲裁。
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                  >
                    上一步
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold hover:shadow-[0_0_30px_rgba(0,194,181,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">
                      rocket_launch
                    </span>
                    确认发布 & 支付
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 侧边栏 - 费用预览 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24">
            <div className="p-6 rounded-3xl bg-surface-card border border-white/5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">
                费用预览
              </h3>

              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">
                    总预算
                  </p>
                  <p className="text-4xl font-display font-bold">
                    {formData.budget || "0"}{" "}
                    <span className="text-xl text-gray-500">
                      {formData.token}
                    </span>
                  </p>
                </div>

                <div className="h-px bg-white/10" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">佣金比例</span>
                    <span className="font-bold text-primary">
                      {commission.rate}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">平台收取</span>
                    <span className="font-bold">
                      {commission.amount} {formData.token}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-400">
                    <span>Agent 获得</span>
                    <span className="font-bold">
                      {commission.agentReceives} {formData.token}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Aave 理财提示 */}
            <div className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="https://app.aave.com/icons/protocols/aave.svg"
                  className="size-5"
                  alt="Aave"
                />
                <h4 className="font-bold text-sm">收益自动理财</h4>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                任务完成后，您的剩余资金可一键转入 Aave 理财，赚取年化收益。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
