/**
 * 通知/Toast 状态 Store
 * 管理全局通知队列与自动消失
 */
import { create } from "zustand";

/** 通知类型 */
export type NotificationType = "success" | "error" | "warning" | "info";

/** 通知结构 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration: number;
}

/** 新增通知入参 */
export interface AddNotificationInput {
  id?: string;
  type: NotificationType;
  title: string;
  message: string;
  duration: number;
}

/** 通知状态接口 */
export interface NotificationState {
  notifications: Notification[];
  addNotification: (input: AddNotificationInput) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

let notificationCounter = 0;
const notificationTimers = new Map<string, ReturnType<typeof setTimeout>>();

const createNotificationId = () => {
  notificationCounter += 1;
  return `notification-${Date.now()}-${notificationCounter}`;
};

const clearNotificationTimer = (id: string) => {
  const timer = notificationTimers.get(id);
  if (!timer) return;
  clearTimeout(timer);
  notificationTimers.delete(id);
};

const scheduleAutoDismiss = (
  id: string,
  duration: number,
  removeNotification: (notificationId: string) => void
) => {
  if (duration <= 0) return;
  const timer = setTimeout(() => {
    removeNotification(id);
    notificationTimers.delete(id);
  }, duration);
  notificationTimers.set(id, timer);
};

/**
 * 通知状态 Hook
 * @example
 * const { notifications, addNotification, removeNotification } = useNotificationStore();
 */
export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  addNotification: (input) => {
    const id = input.id ?? createNotificationId();
    const nextNotification: Notification = {
      id,
      type: input.type,
      title: input.title,
      message: input.message,
      duration: input.duration,
    };

    set((state) => ({
      notifications: [...state.notifications, nextNotification],
    }));

    scheduleAutoDismiss(id, input.duration, get().removeNotification);
    return id;
  },
  removeNotification: (id) => {
    clearNotificationTimer(id);
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    }));
  },
  clearAll: () => {
    notificationTimers.forEach((_, id) => clearNotificationTimer(id));
    set({ notifications: [] });
  },
}));
