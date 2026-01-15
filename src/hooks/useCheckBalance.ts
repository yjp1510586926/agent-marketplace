/**
 * 余额检查 Hook
 * 在交易前校验钱包余额是否满足要求
 */
import { useCallback } from "react";
import { useAccount, useBalance } from "wagmi";
import { formatUnits, parseUnits, type Address } from "viem";
import { toast } from "../utils/toast";

export type UseCheckBalanceOptions = {
  // 传入 tokenAddress 时检查 ERC20 余额，否则检查原生代币余额
  tokenAddress?: Address;
  tokenSymbol?: string;
};

export type CheckBalanceParams = {
  amount: string | number | bigint;
};

type UseCheckBalanceResult = {
  checkBalance: (params: CheckBalanceParams) => boolean;
  nativeBalance: ReturnType<typeof useBalance>["data"];
  tokenBalance: ReturnType<typeof useBalance>["data"];
  isLoading: boolean;
};

const toBaseUnits = (amount: CheckBalanceParams["amount"], decimals: number) => {
  if (typeof amount === "bigint") {
    return amount;
  }
  const normalized = typeof amount === "number" ? amount.toString() : amount;
  return parseUnits(normalized, decimals);
};

const formatAmountText = (
  amount: CheckBalanceParams["amount"],
  decimals: number
) => {
  if (typeof amount === "bigint") {
    return formatUnits(amount, decimals);
  }
  return String(amount);
};

export const useCheckBalance = (
  options: UseCheckBalanceOptions = {}
): UseCheckBalanceResult => {
  const { address, isConnected } = useAccount();

  const nativeBalance = useBalance({
    address,
    query: {
      enabled: Boolean(address),
    },
  });

  const tokenBalance = useBalance({
    address,
    token: options.tokenAddress,
    query: {
      enabled: Boolean(address && options.tokenAddress),
    },
  });

  const checkBalance = useCallback(
    ({ amount }: CheckBalanceParams) => {
      if (!isConnected || !address) {
        toast.error({ message: "请先连接钱包后再继续操作。" });
        return false;
      }

      const isToken = Boolean(options.tokenAddress);
      const balanceData = isToken ? tokenBalance.data : nativeBalance.data;

      if (!balanceData) {
        toast.error({ message: "余额信息未加载，请稍后重试。" });
        return false;
      }

      const decimals = balanceData.decimals ?? 18;
      const symbol =
        options.tokenSymbol ?? balanceData.symbol ?? (isToken ? "代币" : "ETH");

      let requiredAmount: bigint;
      try {
        requiredAmount = toBaseUnits(amount, decimals);
      } catch (error) {
        toast.error({ message: "金额格式不正确，请检查输入。" });
        return false;
      }

      if (requiredAmount <= balanceData.value) {
        return true;
      }

      const requiredText = formatAmountText(amount, decimals);
      const availableText = formatUnits(balanceData.value, decimals);

      toast.error({
        message: `${symbol} 余额不足，需 ${requiredText} ${symbol}，当前 ${availableText} ${symbol}`,
      });
      return false;
    },
    [
      address,
      isConnected,
      nativeBalance.data,
      options.tokenAddress,
      options.tokenSymbol,
      tokenBalance.data,
    ]
  );

  return {
    checkBalance,
    nativeBalance: nativeBalance.data,
    tokenBalance: tokenBalance.data,
    isLoading: nativeBalance.isLoading || tokenBalance.isLoading,
  };
};

export default useCheckBalance;
