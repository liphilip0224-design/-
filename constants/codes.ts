
/**
 * 兑换码管理配置
 */

// 1. 静态兑换码列表（适合发放给特定大咖或内部测试）
export const STATIC_CODES = [
  'FZ2025',
  'ADMIN',
  'GROWTH',
  'VIP888',
  'CAREER-PRO'
];

/**
 * 2. 规则校验算法 (Pattern Logic)
 * 允许您生成符合特定格式的“无限”兑换码。
 * 
 * 示例规则：FZ + 4位数字 + 2位字母
 * 这样您只需按照这个规则随便编造一个字符串发给用户，程序就能识别。
 */
export const isValidPattern = (code: string): boolean => {
  // 规则 A: 必须以 FZ- 开头，后面跟着至少 4 位数字
  // 例如：FZ-1234, FZ-888899
  const prefixRegex = /^FZ-\d{4,}$/;
  
  // 规则 B: 或者是以 "A" 开头且长度为 8 位的码
  const alphaRegex = /^A[A-Z0-9]{7}$/;

  return prefixRegex.test(code) || alphaRegex.test(code);
};

/**
 * 生成建议（你可以手动生成这些发给用户）：
 * - FZ-2024
 * - FZ-9999
 * - AFZ12345
 */
