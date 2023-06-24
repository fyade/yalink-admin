/**
 * 深度递归数组
 * 并将id字段复制给value字段、name字段复制给label字段
 * @param arr1
 * @param arr2
 * @returns {*[]}
 */
export const deepRecursion = (arr1, arr2 = [['id', 'value'], ['name', 'label']]) => {
  if (arr1.length === 0) {
    return [];
  }
  for (let i = 0; i < arr1.length; i++) {
    assist_deepRecursion(arr1[i], arr2);
  }
}
const assist_deepRecursion = (item, arr2) => {
  for (let i = 0; i < arr2.length; i++) {
    item[arr2[i][1]] = item[arr2[i][0]];
  }
  if (item.children.length > 0) {
    for (let i = 0; i < item.children.length; i++) {
      assist_deepRecursion(item.children[i], arr2);
    }
  }
}

/**
 * 扁平化对象数组
 * @param arr
 */
export const flatObjectArray = arr => {
  if (arr.length === 0) return [];
  let ret = [];
  for (let i = 0; i < arr.length; i++) {
    let { children, ...obj } = arr[i];
    ret.push(obj);
    assist_flatObjectArray(arr[i], ret);
  }
  return ret;
}
const assist_flatObjectArray = (item, retArr) => {
  for (let i = 0; i < item.children.length; i++) {
    let { children, ...obj } = item.children[i];
    retArr.push(obj);
    assist_flatObjectArray(item.children[i]);
  }
}
