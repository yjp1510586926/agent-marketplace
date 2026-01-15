/**
 * 顶部导航栏组件
 * 集成钱包连接、页面导航
 */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { WalletButton } from "../common/WalletButton";

const navItems = [
  { name: "市场", path: "/" },
  { name: "金融", path: "/finance" },
  { name: "DAO", path: "/governance" },
  { name: "个人", path: "/profile" },
];

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-background-dark">
            <span className="material-symbols-outlined font-bold">hub</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display font-bold text-xl tracking-tight">
              NexusHub
            </h1>
            <p className="text-[10px] text-gray-500 font-display tracking-widest uppercase">
              Web3 Agent Marketplace
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-surface-dark/50 rounded-full border border-white/5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {location.pathname === item.path && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white/10 border border-white/5 rounded-full shadow-inner"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* 语言切换 */}
          <button className="hidden lg:flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-wider">
            CN{" "}
            <span className="material-symbols-outlined text-sm">
              expand_more
            </span>
          </button>

          {/* 钱包连接按钮 */}
          <WalletButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
