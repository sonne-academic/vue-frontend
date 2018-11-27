const reducer = (a: any[], b: any[]): any[] => a.concat(b);
const mapper = (a: any[], b: any[]): any[] => a.map((x) => b.map((y) => x.concat(y))).reduce(reducer, []);

export function cartesian(...arr: any[][]): any[] {
    return arr.reduce(mapper, [[]]);
}
