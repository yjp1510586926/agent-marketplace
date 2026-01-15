/**
 * 钱包连接按钮组件
 * 支持连接状态显示、余额展示、断开连接等功能
 */
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";

export const WalletButton: React.FC = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openConnectModal}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-background-dark font-bold text-sm hover:shadow-[0_0_20px_rgba(0,194,181,0.4)] transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      account_balance_wallet
                    </span>
                    <span className="hidden sm:inline">连接钱包</span>
                  </motion.button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold"
                  >
                    <span className="material-symbols-outlined text-sm">
                      warning
                    </span>
                    切换网络
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  {/* 网络切换按钮 */}
                  <button
                    onClick={openChainModal}
                    className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-dark border border-white/5 text-xs font-medium hover:border-primary/30 transition-all"
                  >
                    {chain.hasIcon && (
                      <div
                        className="size-4 rounded-full overflow-hidden"
                        style={{ background: chain.iconBackground }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            className="size-4"
                          />
                        )}
                      </div>
                    )}
                    <span className="text-gray-400">{chain.name}</span>
                  </button>

                  {/* 账户按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openAccountModal}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-bold font-display hover:bg-primary/20 transition-all shadow-[0_0_15px_rgba(0,194,181,0.1)]"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      account_balance_wallet
                    </span>
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] text-gray-500 hidden sm:block">
                        {account.displayBalance ?? ""}
                      </span>
                      <span className="hidden sm:inline">
                        {account.displayName}
                      </span>
                      <span className="sm:hidden">{account.displayName}</span>
                    </div>
                  </motion.button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
