/**
 * 交易状态管理 Hook
 * 统一处理交易生命周期与状态文案
 */
import { useEffect, useMemo, useState } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import type { Hex } from "viem";

export type TxStatus = "idle" | "pending" | "confirming" | "success" | "error";

type UseTxStatusOptions = {
  hash?: Hex;
  chainId?: number;
  confirmations?: number;
  isWaitingSignature?: boolean;
};

type UseTxStatusResult = {
  status: TxStatus;
  statusMessage: string;
  errorMessage?: string;
  hash?: Hex;
  receipt?: ReturnType<typeof useWaitForTransactionReceipt>["data"];
  isLoading: boolean;
};

const statusTextMap: Record<TxStatus, string> = {
  idle: "等待发起交易",
  pending: "等待钱包签名",
  confirming: "交易确认中",
  success: "交易已确认",
  error: "交易失败",
};

export const useTxStatus = (
  options: UseTxStatusOptions = {}
): UseTxStatusResult => {
  const { hash, chainId, confirmations, isWaitingSignature } = options;
  const [status, setStatus] = useState<TxStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const waitResult = useWaitForTransactionReceipt({
    hash,
    chainId,
    confirmations,
    query: {
      enabled: Boolean(hash),
    },
  });

  useEffect(() => {
    if (isWaitingSignature) {
      setStatus("pending");
      setErrorMessage(undefined);
      return;
    }

    if (!hash) {
      setStatus("idle");
      setErrorMessage(undefined);
      return;
    }

    if (waitResult.isError) {
      setStatus("error");
      setErrorMessage(waitResult.error?.message || "交易执行失败");
      return;
    }

    if (waitResult.isSuccess) {
      setStatus("success");
      setErrorMessage(undefined);
      return;
    }

    setStatus("confirming");
    setErrorMessage(undefined);
  }, [
    hash,
    isWaitingSignature,
    waitResult.isError,
    waitResult.isSuccess,
    waitResult.error,
  ]);

  const statusMessage = useMemo(() => {
    if (status === "error" && errorMessage) {
      return `${statusTextMap[status]}：${errorMessage}`;
    }

    return statusTextMap[status];
  }, [status, errorMessage]);

  return {
    status,
    statusMessage,
    errorMessage,
    hash,
    receipt: waitResult.data,
    isLoading: waitResult.isLoading,
  };
};

export default useTxStatus;
