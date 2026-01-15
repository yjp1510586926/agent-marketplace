/**
 * 交易进度弹窗
 * 展示交易状态、哈希与区块浏览器入口
 */
import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { arbitrum, mainnet, optimism, polygon, sepolia } from "wagmi/chains";
import type { Hex } from "viem";
import type { TxStatus } from "../../hooks/useTxStatus";

type TxProgressModalProps = {
  open: boolean;
  status: TxStatus;
  statusMessage?: string;
  errorMessage?: string;
  hash?: Hex;
  chainId?: number;
  onClose?: () => void;
};

type StatusStyle = {
  title: string;
  icon: string;
  accent: string;
  border: string;
  text: string;
  glow: string;
};

const statusStyleMap: Record<TxStatus, StatusStyle> = {
  idle: {
    title: "等待发起交易",
    icon: "hourglass_empty",
    accent: "text-gray-400",
    border: "border-white/10",
    text: "text-gray-400",
    glow: "shadow-[0_0_0_rgba(0,0,0,0)]",
  },
  pending: {
    title: "等待签名",
    icon: "fingerprint",
    accent: "text-primary",
    border: "border-primary/30",
    text: "text-primary",
    glow: "shadow-[0_0_25px_rgba(0,194,181,0.2)]",
  },
  confirming: {
    title: "确认中",
    icon: "hourglass_top",
    accent: "text-white",
    border: "border-white/20",
    text: "text-white",
    glow: "shadow-[0_0_25px_rgba(255,255,255,0.12)]",
  },
  success: {
    title: "交易成功",
    icon: "check_circle",
    accent: "text-green-400",
    border: "border-green-400/30",
    text: "text-green-400",
    glow: "shadow-[0_0_25px_rgba(74,222,128,0.2)]",
  },
  error: {
    title: "交易失败",
    icon: "error",
    accent: "text-accent",
    border: "border-accent/40",
    text: "text-accent",
    glow: "shadow-[0_0_25px_rgba(255,77,109,0.2)]",
  },
};

const supportedChains = [mainnet, sepolia, polygon, arbitrum, optimism];
const chainMap = new Map(supportedChains.map((chain) => [chain.id, chain]));

const formatHash = (hash?: Hex) => {
  if (!hash) return "";
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const getExplorerUrl = (hash?: Hex, chainId?: number) => {
  if (!hash) return undefined;
  const chain = chainId ? chainMap.get(chainId as any) : undefined;
  const baseUrl = chain?.blockExplorers?.default?.url;

  return baseUrl ? `${baseUrl}/tx/${hash}` : `https://etherscan.io/tx/${hash}`;
};

export const TxProgressModal: React.FC<TxProgressModalProps> = ({
  open,
  status,
  statusMessage,
  errorMessage,
  hash,
  chainId,
  onClose,
}) => {
  const style = statusStyleMap[status];
  const explorerUrl = useMemo(
    () => getExplorerUrl(hash, chainId),
    [hash, chainId]
  );
  const showError = status === "error" && errorMessage;

  const steps: TxStatus[] = ["pending", "confirming", "success"];
  const currentIndex = steps.indexOf(status);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`w-full max-w-lg rounded-3xl border ${style.border} bg-surface-card/90 p-6 md:p-8 ${style.glow}`}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-12 items-center justify-center rounded-2xl border ${style.border} bg-background-dark/60`}
                >
                  <span
                    className={`material-symbols-outlined text-2xl ${style.accent}`}
                  >
                    {style.icon}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{style.title}</p>
                  <p className="text-xs text-gray-400">
                    {statusMessage || style.title}
                  </p>
                </div>
              </div>
              {onClose && (
                <button
                  type="button"
                  aria-label="关闭弹窗"
                  onClick={onClose}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-base">
                    close
                  </span>
                </button>
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {steps.map((step, index) => {
                const isDone = currentIndex > index;
                const isActive = currentIndex === index;
                const isMuted = currentIndex === -1 && status !== "error";

                return (
                  <div
                    key={step}
                    className={`rounded-2xl border px-3 py-3 text-center text-xs font-semibold ${
                      isDone
                        ? "border-primary/30 text-primary bg-primary/10"
                        : isActive
                        ? "border-white/20 text-white bg-white/5"
                        : isMuted
                        ? "border-white/10 text-gray-500 bg-white/5"
                        : "border-white/10 text-gray-500 bg-white/5"
                    }`}
                  >
                    {step === "pending" && "等待签名"}
                    {step === "confirming" && "确认中"}
                    {step === "success" && "成功"}
                  </div>
                );
              })}
            </div>

            {status === "error" && (
              <div className="mt-4 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-xs text-accent">
                {showError ? errorMessage : "交易失败，请重试"}
              </div>
            )}

            {hash && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-background-dark/60 px-4 py-4">
                <p className="text-xs text-gray-500">交易哈希</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold text-white">
                    {formatHash(hash)}
                  </span>
                  {explorerUrl && (
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      查看区块浏览器
                    </a>
                  )}
                </div>
              </div>
            )}

            {status === "success" && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="mt-6 w-full rounded-2xl bg-primary py-3 text-sm font-bold text-background-dark hover:shadow-[0_0_18px_rgba(0,194,181,0.35)] transition-all"
              >
                完成
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TxProgressModal;
