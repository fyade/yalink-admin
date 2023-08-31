/**
 * 百分数转数值
 * 20% → 0.2
 * @param ins
 * @returns {number}
 */
export const strToNum = str => Math.trunc(Number(str.replace('%', '')) * 100)