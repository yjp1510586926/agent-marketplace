/**
 * 用户状态 Store
 * 管理钱包连接状态、用户角色等全局状态
 */
import { create } from "zustand";

/** 用户角色类型 */
export type UserRole = "guest" | "employer" | "agent";

/** 用户状态接口 */
export interface UserState {
  /** 钱包地址 */
  address: `0x${string}` | null;
  /** 是否已连接钱包 */
  isConnected: boolean;
  /** 用户角色 */
  role: UserRole;
  /** 设置钱包地址 */
  setAddress: (address: `0x${string}` | null) => void;
  /** 设置连接状态 */
  setConnection: (isConnected: boolean) => void;
  /** 设置用户角色 */
  setRole: (role: UserRole) => void;
  /** 重置状态 */
  reset: () => void;
}

/** 默认状态 */
const DEFAULT_STATE: Pick<UserState, "address" | "isConnected" | "role"> = {
  address: null,
  isConnected: false,
  role: "guest",
};

/**
 * 用户状态 Hook
 * @example
 * const { address, isConnected, role, setAddress } = useUserStore();
 */
export const useUserStore = create<UserState>((set) => ({
  ...DEFAULT_STATE,
  setAddress: (address) =>
    set({
      address,
      isConnected: !!address,
    }),
  setConnection: (isConnected) => set({ isConnected }),
  setRole: (role) => set({ role }),
  reset: () => set({ ...DEFAULT_STATE }),
}));
