/**
 * Agent 注册/认证页面
 * 包含链上身份登记、技能标签设置、服务等级选择
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Hex } from "viem";
import { TxProgressModal } from "../components/common/TxProgressModal";
import { toast } from "../utils/toast";
import { useCheckBalance } from "../hooks/useCheckBalance";
import type { TxStatus } from "../hooks/useTxStatus";

const SKILL_OPTIONS = [
  {
    category: "开发",
    skills: [
      "Solidity",
      "Rust",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "Web3.js",
      "Wagmi",
      "Hardhat",
      "Foundry",
    ],
  },
  {
    category: "设计",
    skills: [
      "UI/UX",
      "Figma",
      "Brand Design",
      "NFT Art",
      "Motion Design",
      "3D Modeling",
      "Illustration",
    ],
  },
  {
    category: "运营",
    skills: [
      "Community Management",
      "Twitter Marketing",
      "Discord Management",
      "KOL Outreach",
      "Content Creation",
      "SEO",
    ],
  },
  {
    category: "安全",
    skills: [
      "Smart Contract Audit",
      "Penetration Testing",
      "Code Review",
      "Formal Verification",
      "Bug Bounty",
    ],
  },
  {
    category: "其他",
    skills: [
      "Technical Writing",
      "Translation",
      "Research",
      "Consulting",
      "Project Management",
    ],
  },
];

const SERVICE_LEVELS = [
  {
    id: "starter",
    name: "Starter",
    desc: "新手 Agent，开始建立信誉",
    features: ["最多同时承接 2 个任务", "基础展示位", "标准佣金率"],
    stake: "0",
    color: "from-gray-500 to-gray-600",
  },
  {
    id: "professional",
    name: "Professional",
    desc: "专业 Agent，优先展示",
    features: ["最多同时承接 5 个任务", "优先展示位", "佣金率 -1%", "专属徽章"],
    stake: "100",
    color: "from-primary to-primary-dark",
    recommended: true,
  },
  {
    id: "expert",
    name: "Expert",
    desc: "专家级 Agent，顶级信誉",
    features: [
      "无限任务承接",
      "首页推荐位",
      "佣金率 -2%",
      "专属徽章",
      "DAO 投票加权",
    ],
    stake: "500",
    color: "from-accent to-purple-600",
  },
];

const formSchema = z.object({
  displayName: z.string().trim().min(1, "请输入显示名称"),
  bio: z.string().trim().optional(),
  portfolio: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .string()
      .url("请输入正确的链接")
      .optional()
  ),
  skills: z.array(z.string()).min(1, "至少选择 1 个技能"),
  level: z.enum(["starter", "professional", "expert"]),
  agreedToTerms: z.literal(true, "请先同意服务条款与隐私政策"),
});

type AgentRegisterForm = z.infer<typeof formSchema>;

const createMockHash = () => {
  const randomHex = Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  return `0x${randomHex}` as Hex;
};

const AgentRegister: React.FC = () => {
  const { isConnected, address } = useAccount();
  const navigate = useNavigate();
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash] = useState<Hex | undefined>(undefined);
  const mockTimersRef = useRef<number[]>([]);
  const { checkBalance, isLoading: isBalanceLoading } = useCheckBalance({
    tokenSymbol: "WAG",
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AgentRegisterForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      bio: "",
      portfolio: "",
      skills: [],
      level: "professional",
      agreedToTerms: false,
    },
  });

  const formSkills = useWatch({ control, name: "skills" });
  const formLevel = useWatch({ control, name: "level" });
  const displayName = useWatch({ control, name: "displayName" });

  const selectedLevel = useMemo(
    () => SERVICE_LEVELS.find((level) => level.id === formLevel),
    [formLevel]
  );

  const clearMockTimers = () => {
    mockTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    mockTimersRef.current = [];
  };

  const handleSkillToggle = (skill: string) => {
    const currentSkills = formSkills ?? [];
    const nextSkills = currentSkills.includes(skill)
      ? currentSkills.filter((item) => item !== skill)
      : [...currentSkills, skill];
    setValue("skills", nextSkills, { shouldValidate: true, shouldDirty: true });
  };

  const startMockRegister = () => {
    clearMockTimers();
    // 模拟交易生命周期：签名 -> 确认 -> 成功
    setTxModalOpen(true);
    setTxStatus("pending");
    setTxHash(undefined);

    const pendingTimer = window.setTimeout(() => {
      setTxHash(createMockHash());
      setTxStatus("confirming");
    }, 900);

    const successTimer = window.setTimeout(() => {
      setTxStatus("success");
      toast.success({ message: "注册成功，已跳转到个人页面。" });
      setTxModalOpen(false);
      navigate("/profile");
    }, 2200);

    mockTimersRef.current = [pendingTimer, successTimer];
  };

  const handleFormSubmit = (values: AgentRegisterForm) => {
    // 提交前校验余额
    const stakeAmount = Number(selectedLevel?.stake ?? 0);
    if (stakeAmount > 0) {
      if (isBalanceLoading) {
        toast.info({ message: "余额加载中，请稍后再试。" });
        return;
      }
      if (!checkBalance({ amount: selectedLevel?.stake ?? "0" })) {
        return;
      }
    }

    // TODO: 对接真实合约时替换为链上交易逻辑
    console.log("注册 Agent:", values);
    startMockRegister();
  };

  useEffect(() => {
    return () => {
      // 页面卸载时清理定时器
      clearMockTimers();
    };
  }, []);

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
              person_add
            </span>
          </div>
          <h2 className="text-2xl font-display font-bold mb-3">成为 Agent</h2>
          <p className="text-gray-400 text-sm mb-6">
            连接您的 Web3 钱包以注册成为平台 Agent，开始承接任务并赚取收益。
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
      <TxProgressModal
        open={txModalOpen}
        status={txStatus}
        statusMessage="正在提交注册交易，请稍候"
        hash={txHash}
        onClose={() => {
          clearMockTimers();
          setTxStatus("idle");
          setTxModalOpen(false);
        }}
      />
      {/* 页面标题 */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-gray-500 text-sm hover:text-primary transition-colors mb-2"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          返回市场
        </Link>
        <h1 className="text-3xl font-display font-black">Agent 注册</h1>
        <p className="text-gray-400 mt-1">登记链上身份，开始承接任务</p>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* 主表单区 */}
        <div className="lg:col-span-8 space-y-6">
          {/* 基本信息 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-surface-card border border-white/5 space-y-6"
          >
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                badge
              </span>
              基本信息
            </h2>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-background-dark/50 border border-white/5">
              <div className="size-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-white">
                  person
                </span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                  钱包地址
                </p>
                <p className="font-mono text-sm text-gray-300">{address}</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg bg-surface-dark border border-white/10 text-xs font-bold text-gray-400 hover:text-white transition-colors">
                上传头像
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400">
                显示名称 *
              </label>
              <input
                type="text"
                {...register("displayName")}
                placeholder="例如：CryptoDev.eth"
                className="w-full px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:outline-none transition-colors"
              />
              {errors.displayName && (
                <p className="text-xs text-accent">{errors.displayName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400">
                个人简介
              </label>
              <textarea
                {...register("bio")}
                placeholder="介绍您的专业背景、项目经验..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400">
                作品集链接
              </label>
              <input
                type="url"
                {...register("portfolio")}
                placeholder="https://github.com/yourname 或其他作品集"
                className="w-full px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:outline-none transition-colors"
              />
              {errors.portfolio && (
                <p className="text-xs text-accent">{errors.portfolio.message}</p>
              )}
            </div>
          </motion.div>

          {/* 技能标签 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl bg-surface-card border border-white/5 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">
                  sell
                </span>
                技能标签
              </h2>
              <span className="text-xs text-gray-500">
                已选 {formSkills?.length ?? 0} 项
              </span>
            </div>

            <div className="space-y-6">
              {SKILL_OPTIONS.map((group) => (
                <div key={group.category}>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-3">
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          formSkills?.includes(skill)
                            ? "bg-primary text-background-dark"
                            : "bg-surface-dark text-gray-400 border border-white/10 hover:border-primary/30"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {errors.skills && (
              <p className="text-xs text-accent">{errors.skills.message}</p>
            )}
          </motion.div>

          {/* 服务等级 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl bg-surface-card border border-white/5 space-y-6"
          >
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                star
              </span>
              服务等级
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SERVICE_LEVELS.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() =>
                    setValue("level", level.id, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  className={`relative p-6 rounded-2xl border text-left transition-all ${
                    formLevel === level.id
                      ? "border-primary bg-primary/5"
                      : "border-white/5 bg-surface-dark hover:border-white/20"
                  }`}
                >
                  {level.recommended && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-primary text-background-dark text-[9px] font-bold uppercase">
                      推荐
                    </span>
                  )}

                  <div
                    className={`inline-flex px-3 py-1 rounded-lg bg-gradient-to-r ${level.color} text-white text-xs font-bold mb-3`}
                  >
                    {level.name}
                  </div>

                  <p className="text-sm text-gray-400 mb-4">{level.desc}</p>

                  <ul className="space-y-2 mb-4">
                    {level.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-[11px] text-gray-500"
                      >
                        <span className="material-symbols-outlined text-primary text-sm">
                          check_circle
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">
                      质押要求
                    </p>
                    <p className="text-lg font-display font-bold">
                      {level.stake}{" "}
                      <span className="text-sm text-gray-500">WAG</span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* 提交 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-surface-card border border-white/5"
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("agreedToTerms")}
                className="mt-1 accent-primary"
              />
              <span className="text-sm text-gray-400">
                我已阅读并同意平台的
                <a href="#" className="text-primary hover:underline">
                  服务条款
                </a>
                和
                <a href="#" className="text-primary hover:underline">
                  隐私政策
                </a>
                ， 并理解所有交易记录将公开存储于区块链上。
              </span>
            </label>
            {errors.agreedToTerms && (
              <p className="mt-2 text-xs text-accent">
                {errors.agreedToTerms.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,194,181,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">verified</span>
              {isSubmitting ? "提交中..." : "确认注册成为 Agent"}
            </button>
          </motion.div>
        </div>

        {/* 侧边栏 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            {/* Agent 权益 */}
            <div className="p-6 rounded-3xl bg-surface-card border border-white/5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">
                Agent 权益
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">
                      payments
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">链上自动结算</p>
                    <p className="text-[10px] text-gray-500">
                      任务完成后收益自动到账
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-accent">
                      savings
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">一键理财</p>
                    <p className="text-[10px] text-gray-500">
                      收益可直接投入 Aave 赚取利息
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-blue-400">
                      how_to_vote
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">DAO 治理权</p>
                    <p className="text-[10px] text-gray-500">
                      参与平台决策与仲裁投票
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-green-400">
                      trending_up
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">成长体系</p>
                    <p className="text-[10px] text-gray-500">
                      完成任务提升等级，获得更多权益
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 注册预览 */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
              <h3 className="font-bold mb-4">注册预览</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">显示名称</span>
                  <span className="font-bold">{displayName || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">技能数量</span>
                  <span className="font-bold">{formSkills?.length ?? 0} 项</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">服务等级</span>
                  <span className="font-bold text-primary">
                    {selectedLevel?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">需质押</span>
                  <span className="font-bold">
                    {selectedLevel?.stake ?? "0"} WAG
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AgentRegister;
