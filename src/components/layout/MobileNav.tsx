/**
 * 移动端底部导航栏
 * 响应式设计，仅在小屏幕显示
 */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { name: "市场", path: "/", icon: "storefront" },
  { name: "金融", path: "/finance", icon: "account_balance" },
  { name: "发布", path: "/create-task", icon: "add_circle", primary: true },
  { name: "治理", path: "/governance", icon: "how_to_vote" },
  { name: "我的", path: "/profile", icon: "person" },
];

export const MobileNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* 背景模糊层 */}
      <div className="absolute inset-0 bg-background-dark/90 backdrop-blur-lg border-t border-white/5" />

      {/* 导航项 */}
      <div className="relative flex items-center justify-around px-2 py-2 safe-area-pb">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          if (item.primary) {
            return (
              <Link key={item.path} to={item.path} className="relative -mt-6">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="size-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_rgba(0,194,181,0.4)]"
                >
                  <span className="material-symbols-outlined text-background-dark text-2xl">
                    {item.icon}
                  </span>
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-0.5 py-2 px-4"
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                className="relative"
              >
                <span
                  className={`material-symbols-outlined text-2xl transition-colors ${
                    isActive ? "text-primary" : "text-gray-500"
                  }`}
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary"
                  />
                )}
              </motion.div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
