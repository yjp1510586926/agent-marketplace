/**
 * 金融控制台页面
 * 集成 Aave 理财功能，展示存款、借贷、收益管理
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";

interface Asset {
  symbol: string;
  name: string;
  icon: string;
  apy: string;
  balance: string;
  value: string;
  collateral: boolean;
}

const SUPPLY_ASSETS: Asset[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "$",
    apy: "4.52%",
    balance: "12,450.00",
    value: "$12,450.00",
    collateral: true,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: "⟠",
    apy: "3.18%",
    balance: "2.45",
    value: "$6,125.00",
    collateral: true,
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    icon: "◈",
    apy: "3.85%",
    balance: "5,000.00",
    value: "$5,000.00",
    collateral: true,
  },
];

const BORROW_ASSETS: Asset[] = [
  {
    symbol: "GHO",
    name: "GHO Token",
    icon: "🟣",
    apy: "1.20%",
    balance: "0.00",
    value: "$0.00",
    collateral: false,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    icon: "₮",
    apy: "5.12%",
    balance: "0.00",
    value: "$0.00",
    collateral: false,
  },
];

const EARNINGS_HISTORY = [
  {
    date: "2024-05-20",
    type: "interest",
    amount: "+12.45 USDC",
    source: "USDC Supply",
  },
  {
    date: "2024-05-19",
    type: "interest",
    amount: "+0.003 ETH",
    source: "ETH Supply",
  },
  {
    date: "2024-05-18",
    type: "transfer",
    amount: "+1,200 USDC",
    source: "Task Settlement",
  },
  {
    date: "2024-05-17",
    type: "interest",
    amount: "+8.20 DAI",
    source: "DAI Supply",
  },
];

const Finance: React.FC = () => {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"supply" | "borrow">("supply");
  const [showAutoInvest, setShowAutoInvest] = useState(true);

  // 总资产价值
  const totalValue = "$23,575.00";
  const totalEarnings = "+$156.45";
  const netApy = "+3.45%";

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
              savings
            </span>
          </div>
          <h2 className="text-2xl font-display font-bold mb-3">连接钱包</h2>
          <p className="text-gray-400 text-sm mb-6">
            连接您的 Web3 钱包以访问 Aave 理财功能，管理您的数字资产。
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <img
              src="https://app.aave.com/icons/protocols/aave.svg"
              className="size-5"
              alt="Aave"
            />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Aave V3 Protocol Integrated
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-black tracking-tight">
            金融控制台
          </h1>
          <p className="text-gray-400 mt-1">管理您的数字资产，赚取收益</p>
        </div>
        <div className="flex p-1 bg-surface-dark rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab("supply")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "supply"
                ? "bg-primary text-background-dark"
                : "text-gray-500"
            }`}
          >
            存款 / 质押
          </button>
          <button
            onClick={() => setActiveTab("borrow")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "borrow"
                ? "bg-primary text-background-dark"
                : "text-gray-500"
            }`}
          >
            借贷资产
          </button>
        </div>
      </div>

      {/* 资产概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30"
        >
          <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">
            总资产价值
          </p>
          <p className="text-4xl font-display font-bold">{totalValue}</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-sm text-green-400 font-bold">
              {totalEarnings} 累计收益
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-6 rounded-2xl bg-surface-card border border-white/5"
        >
          <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">
            综合年化
          </p>
          <p className="text-3xl font-display font-bold text-green-400">
            {netApy}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-surface-card border border-white/5"
        >
          <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">
            健康系数
          </p>
          <p className="text-3xl font-display font-bold">2.85</p>
          <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded mt-1 inline-block">
            安全
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 资产列表 */}
        <motion.div
          layout
          className="lg:col-span-8 rounded-3xl bg-surface-card border border-white/5 p-8 relative"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              {activeTab === "supply" ? "您的存款资产" : "可借贷资产"}
            </h3>
            <button className="px-3 py-1.5 rounded-lg bg-surface-dark border border-white/10 text-xs font-bold text-gray-400 hover:text-white transition-colors">
              + 添加资产
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {(activeTab === "supply" ? SUPPLY_ASSETS : BORROW_ASSETS).map(
                (asset, i) => (
                  <motion.div
                    key={asset.symbol}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ delay: i * 0.05 }}
                    className="group p-4 rounded-2xl bg-surface-dark/40 border border-white/5 flex items-center justify-between hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-full bg-background-dark flex items-center justify-center font-bold text-lg border border-white/10">
                        {asset.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{asset.symbol}</p>
                        <p className="text-[10px] text-gray-500">
                          {asset.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="hidden sm:block text-right">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">
                          APY
                        </p>
                        <p className="text-sm font-display font-bold text-primary">
                          {asset.apy}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">
                          余额
                        </p>
                        <p className="text-sm font-display font-bold">
                          {asset.balance}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {asset.value}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-bold hover:bg-primary hover:text-background-dark transition-all">
                          {activeTab === "supply" ? "存入" : "借出"}
                        </button>
                        {activeTab === "supply" &&
                          parseFloat(asset.balance.replace(",", "")) > 0 && (
                            <button className="px-3 py-2 rounded-lg bg-white/5 text-xs font-bold text-gray-400 hover:text-white transition-all">
                              取出
                            </button>
                          )}
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>

          {/* 平台费率说明 */}
          <div className="mt-8 p-4 rounded-xl bg-background-dark/50 border border-white/5">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-gray-500">
                info
              </span>
              <div>
                <p className="text-sm font-bold">费率说明</p>
                <p className="text-[10px] text-gray-500 mt-1">
                  平台对理财收益收取 0.5% 的管理费，所有费用明细均链上透明可查。
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 侧边栏 */}
        <div className="lg:col-span-4 space-y-6">
          {/* 健康指数可视化 */}
          <div className="rounded-3xl bg-surface-card border border-white/5 p-6 flex flex-col items-center text-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 self-start mb-6">
              健康指数 (HF)
            </h3>
            <div className="relative size-44 mb-4">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#2e6b67"
                  strokeWidth="10"
                  strokeOpacity="0.1"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#00c2b5"
                  strokeWidth="10"
                  strokeDasharray="264"
                  strokeDashoffset="60"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-display font-bold">2.85</span>
                <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                  EXCELLENT
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 px-4 leading-relaxed">
              您的借贷健康系数非常安全。即使行情剧烈波动
              40%，您的资产也不会被清算。
            </p>
          </div>

          {/* 自动收益转存 */}
          <div className="rounded-3xl bg-gradient-to-br from-accent/20 to-primary/10 border border-white/10 p-6">
            <h4 className="font-bold flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary">
                auto_awesome
              </span>
              自动收益转存
            </h4>
            <p className="text-xs text-gray-400 mb-6">
              开启后，任务结算收益将自动存入 Aave 赚取实时利息。
            </p>
            <div className="flex items-center justify-between p-3 rounded-xl bg-background-dark/50 border border-white/5">
              <span className="text-xs font-bold">启用自动转存</span>
              <button
                onClick={() => setShowAutoInvest(!showAutoInvest)}
                className={`w-10 h-5 rounded-full relative p-1 transition-colors ${
                  showAutoInvest ? "bg-primary" : "bg-gray-600"
                }`}
              >
                <motion.div
                  animate={{ x: showAutoInvest ? 16 : 0 }}
                  className="size-3 bg-white rounded-full"
                />
              </button>
            </div>
          </div>

          {/* 收益历史 */}
          <div className="rounded-3xl bg-surface-card border border-white/5 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">
              近期收益
            </h3>
            <div className="space-y-3">
              {EARNINGS_HISTORY.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold">{item.source}</p>
                    <p className="text-[10px] text-gray-500">{item.date}</p>
                  </div>
                  <span className="text-green-400 font-bold">
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/profile"
              className="block mt-4 text-center text-xs text-primary font-bold hover:underline"
            >
              查看完整账单 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
