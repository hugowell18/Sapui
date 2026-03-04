/**
 * 解析深层对象属性 (Dot Notation)
 * 例如 resolvePath({ a: { b: 1 } }, "a.b") 返回 1
 */
export const resolvePath = (object: any, path: string) => {
    if (!object || !path) return undefined;
    return path.split('.').reduce((o, p) => (o ? o[p] : undefined), object);
};
