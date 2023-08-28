const ENGLISH_LETTERS = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g',
  'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y', 'z'
]

/**
 * 生成10位随机字母+时间戳
 * @returns {string}
 */
export function generate10StringWithTimestamp() {
  let str = ''
  const num = 10
  for (let i = 0; i < num; i++) {
    str += ENGLISH_LETTERS[generateNum(0, ENGLISH_LETTERS.length)]
  }
  return `${str}${new Date().getTime()}`
}

export function generateNum(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}