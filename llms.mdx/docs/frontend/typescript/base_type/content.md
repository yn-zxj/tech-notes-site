# 基本类型 (/docs/frontend/typescript/base_type)

## 语法 [#语法]

```typescript 
let 变量:类型;
let 变量:类型 = 值;

function fn(参数:类型, 参数:类型):类型 {
  ...
}
```

## 自动类型判断 [#自动类型判断]

TS 拥有自动的类型判断机制，当对变量的声明和赋值是同时进行的，TS 编译器会自动判断变量的类型，所以此情况下可以省略类型声明

```typescript 
let 变量:类型 = 值; => let 变量 = 值;
```

## 类型 [#类型]

| 类型       | 例子                           | 描述                                                     |
| ---------- | ------------------------------ | -------------------------------------------------------- |
| number     | 1，-33，2.5                    | 任意数字                                                 |
| string     | 'Hi'，"Hi"，\`h`               | 任意字符串                                               |
| boolean    | true，false                    | 布尔值                                                   |
| 字面量`①`  | 其本身                         | 限制变量的值就是该字面量的值                             |
| any        | \*                             | 任意类型（<mark>不建议使用</mark>）                               |
| unknown`②` | \*                             | 类型安全的 any                                           |
| viod       | 空值（undefined）              | 没有值（或 undefined）                                   |
| never`③`   | 没有值                         | 不能是任何值（<mark>可以用来报错</mark>）                         |
| object`④`  | \{name:'孙悟空'\}                | 任意的 JS 对象（<mark>可以用来指定对象中可以包含哪些属性</mark>） |
| array`⑤`   | [1,2,3]                        | 任意的 JS 数组                                           |
| tuple`⑥`   | [4,5]                          | 元素，TS 新增类型，固定长度数组                          |
| enum`⑦`    | enum Color \{Red, Green, Blue\}; | 枚举，TS 新增类型                                        |

```javascript 
① 字面量
let a:10; => 此时a只能赋值为10;
let b: "male" | "female"; => 此时b可以赋值male或者female; => [联合类型]

② unknown
// unknown类型的变量，不能直接赋值给其他变量
let s:unknown;
let e = 'hello'
if (typeof e === 'string'){
 s = e;
}
// 或者类型断言 => 变量 as 类型 或者 <string>变量
s = e as string;
s = <string>e;

③ never
function error():never {
 throw new Error('报错了！');
}

④ object
// 语法：{属性名:属性类型,属性名?:属性类型, [propName: string]:any} => ?:代表可选属性,[]:代表任意类型的属性
let b: {name: string,age?:number};
b = {name:'孙悟空'};
// 设置函数结构的类型声名,语法：(形参:类型,形参:类型...)=>返回值类型
let d: (a:number,b:number)=>number;

⑤ array
let e: string[]; 或 let e: Array<number>; // 字符串数组

⑥ tuple
let h: [string, string]; // 两个字符串数组
h = ['hello','hi'];

⑦ enum
let enum Gender {
 Male,
 Female
}
```

## 类型别名 [#类型别名]

```typescript 
type myType = string;
let a: myType; => 等价于: let a: string;

type speNum = 1|2|3|4;
let b: speNum;
b = 1;
```
