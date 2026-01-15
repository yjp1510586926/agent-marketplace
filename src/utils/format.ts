/**
 * 格式化工具函数
 */

/**
 * 格式化钱包地址，显示前后几位
 * @param address 完整钱包地址
 * @param prefixLength 前缀长度，默认 6
 * @param suffixLength 后缀长度，默认 4
 * @returns 格式化后的地址，如 0x1234...abcd
 */
export function formatAddress(
  address: string,
  prefixLength = 6,
  suffixLength = 4
): string {
  if (!address) return "";
  if (address.length <= prefixLength + suffixLength) return address;
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * 格式化 ETH 金额
 * @param wei wei 单位的金额
 * @param decimals 小数位数，默认 4
 * @returns 格式化后的 ETH 金额字符串
 */
export function formatEth(wei: bigint, decimals = 4): string {
  const eth = Number(wei) / 1e18;
  return eth.toFixed(decimals);
}

/**
 * 格式化时间戳为可读日期
 * @param timestamp Unix 时间戳（秒）
 * @returns 格式化后的日期字符串
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * 格式化时间戳为相对时间
 * @param timestamp Unix 时间戳（秒）
 * @returns 相对时间字符串，如 "2 小时前"
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} 天前`;
  return formatDate(timestamp);
}

/**
 * 格式化数字，添加千分位分隔符
 * @param num 数字
 * @returns 格式化后的数字字符串
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("zh-CN");
}
