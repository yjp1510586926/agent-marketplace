/**
 * Toast 通知组件
 * 统一展示全局通知列表
 */
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  NotificationType,
  useNotificationStore,
} from "../../stores/notificationStore";

type ToastStyleConfig = {
  icon: string;
  iconClass: string;
  iconBgClass: string;
  borderClass: string;
  bgClass: string;
  accentClass: string;
};

const toastStyleMap: Record<NotificationType, ToastStyleConfig> = {
  success: {
    icon: "check_circle",
    iconClass: "text-primary",
    iconBgClass: "bg-primary/10 border border-primary/30",
    borderClass: "border-primary/30",
    bgClass: "bg-surface-dark/90",
    accentClass: "bg-primary",
  },
  error: {
    icon: "error",
    iconClass: "text-accent",
    iconBgClass: "bg-accent/10 border border-accent/30",
    borderClass: "border-accent/30",
    bgClass: "bg-surface-dark/90",
    accentClass: "bg-accent",
  },
  warning: {
    icon: "warning",
    iconClass: "text-primary-dark",
    iconBgClass: "bg-primary-dark/15 border border-primary-dark/30",
    borderClass: "border-primary-dark/30",
    bgClass: "bg-surface-dark/90",
    accentClass: "bg-primary-dark",
  },
  info: {
    icon: "info",
    iconClass: "text-white",
    iconBgClass: "bg-white/5 border border-white/10",
    borderClass: "border-white/10",
    bgClass: "bg-surface-card/80",
    accentClass: "bg-white/60",
  },
};

/**
 * Toast 列表展示
 */
export const Toast: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-6 right-6 z-[100] flex w-[320px] max-w-[calc(100vw-2rem)] flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => {
          const style = toastStyleMap[notification.type];

          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="pointer-events-auto"
            >
              <div
                className={`relative overflow-hidden rounded-2xl border ${style.borderClass} ${style.bgClass} backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.28)]`}
              >
                <div className={`absolute inset-y-0 left-0 w-1 ${style.accentClass}`} />
                <div className="flex items-start gap-3 p-4">
                  <div
                    className={`size-10 rounded-xl flex items-center justify-center ${style.iconBgClass}`}
                  >
                    <span
                      className={`material-symbols-outlined text-xl ${style.iconClass}`}
                    >
                      {style.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="关闭通知"
                    onClick={() => removeNotification(notification.id)}
                    className="ml-1 text-gray-500 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">
                      close
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
