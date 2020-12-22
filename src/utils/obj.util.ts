export function deepMerge(...objs: any[]): any {
  const result = Object.create(null);
  objs.forEach((obj) => {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        const val = obj[key];
        if (isPlainObject(val)) {
          // 递归
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val);
          } else {
            result[key] = deepMerge(val);
          }
        } else {
          result[key] = val;
        }
      });
    }
  });
  return result;
}

export function isPlainObject(val: any): boolean {
  return toString.call(val) === '[object Object]';
}
