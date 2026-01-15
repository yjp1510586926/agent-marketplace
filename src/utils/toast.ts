/**
 * Toast 工具函数
 * 提供便捷的通知触发入口
 */
import {
  AddNotificationInput,
  NotificationType,
  useNotificationStore,
} from "../stores/notificationStore";

type ToastOptions = {
  title?: string;
  message: string;
  duration?: number;
};

const defaultTitles: Record<NotificationType, string> = {
  success: "操作成功",
  error: "操作失败",
  warning: "需要注意",
  info: "提示信息",
};

const createToast = (type: NotificationType, options: ToastOptions) => {
  const payload: AddNotificationInput = {
    type,
    title: options.title ?? defaultTitles[type],
    message: options.message,
    duration: options.duration ?? 3200,
  };
  return useNotificationStore.getState().addNotification(payload);
};

/**
 * 便捷通知入口
 */
export const toast = {
  success: (options: ToastOptions) => createToast("success", options),
  error: (options: ToastOptions) => createToast("error", options),
  warning: (options: ToastOptions) => createToast("warning", options),
  info: (options: ToastOptions) => createToast("info", options),
};

export type { ToastOptions };
