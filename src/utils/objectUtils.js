/**
 * 深拷贝
 * @param source
 * @param cache
 * @returns {any}
 */
export const deepClone = (source, cache) => {
  return JSON.parse(JSON.stringify(source));
  // if (!cache) {
  //   cache = new Map();
  // }
  // if (source instanceof Object) {
  //   if (cache.get(source)) {
  //     return cache.get(source);
  //   }
  //   let result;
  //   if (source instanceof Function) {
  //     if (source.prototype) {
  //       result = function () {
  //         return source.apply(this, arguments);
  //       }
  //     } else {
  //       result = (...args) => {
  //         return source.call(undefined, ...args);
  //       }
  //     }
  //   } else if (source instanceof Array) {
  //     result = [];
  //   } else if (source instanceof Date) {
  //     result = new Date(source - 0);
  //   } else if (source instanceof RegExp) {
  //     result = new RegExp(source.source, source.flags);
  //   } else {
  //     result = [];
  //   }
  //   cache.set(source, result);
  //   for (let key in source) {
  //     if (source.hasOwnProperty(key)) {
  //       result[key] = deepClone(source[key], cache);
  //     }
  //   }
  //   return result;
  // } else {
  //   return source;
  // }
}
