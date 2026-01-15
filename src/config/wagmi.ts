/**
 * Web3 钱包配置
 * 集成 RainbowKit + wagmi，支持 MetaMask、WalletConnect 等主流钱包
 */
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, polygon, arbitrum, optimism } from "wagmi/chains";

// WalletConnect 项目 ID（需要在 https://cloud.walletconnect.com 申请）
const WALLET_CONNECT_PROJECT_ID =
  import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "demo-project-id";

export const wagmiConfig = getDefaultConfig({
  appName: "NexusHub - Web3 Agent Marketplace",
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [mainnet, sepolia, polygon, arbitrum, optimism],
  ssr: false,
});

// 支持的代币列表
export const SUPPORTED_TOKENS = [
  { symbol: "ETH", name: "Ethereum", decimals: 18, icon: "⟠" },
  { symbol: "USDT", name: "Tether USD", decimals: 6, icon: "₮" },
  { symbol: "USDC", name: "USD Coin", decimals: 6, icon: "$" },
  { symbol: "DAI", name: "Dai Stablecoin", decimals: 18, icon: "◈" },
] as const;

// 佣金费率配置
export const COMMISSION_CONFIG = {
  minRate: 0.05, // 5%
  maxRate: 0.1, // 10%
  defaultRate: 0.07, // 7%
};
