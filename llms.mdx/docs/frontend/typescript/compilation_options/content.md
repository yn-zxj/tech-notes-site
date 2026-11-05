# 编译选项 (/docs/frontend/typescript/compilation_options)

## 自动编译文件 [#自动编译文件]

编译文件时，使用`-w`指令后，TS 编译器会自动监视文件的变化，并在文件发生变化时对文件进行重新编译

```sh 
tsc xxx.ts -w
```

## 自动编译整个项目 [#自动编译整个项目]

如果直接使用 tsc 指令，则可以自动将当前项目下的所有 ts 文件编译为 js 文件，但是能直接使用 tsc 命令的前提是要先在项目根目录下创建一个 ts 的配置文件`tsconfig.json`，它是一个 JSON 文件，有了它只需 tsc 命令即可完成对整个项目的编译。

配置属性可参考：[https://www.tslang.cn/docs/handbook/tsconfig-json.html](https://www.tslang.cn/docs/handbook/tsconfig-json.html)

`tsconfig.json`：

① **配置选项**：

```json 
{
  "include": ["./src/**/*"], // 指定需要编译的ts目录 (**:任意目录 ｜ *:任意文件)
  "exclude": ["node_modules"], // 定义需要排除在外的目录(默认值：["node_modules", "bower_components", "jspm_packages"])
  "extends": "./configs/base", // 定义被继承的配置文件
  "files": ["core.ts", "sys.ts"] // 指定被编译文件的列表(很少用)
}
```

② **编译选项**：

参考：[https://www.tslang.cn/docs/handbook/compiler-options.html](https://www.tslang.cn/docs/handbook/compiler-options.html)

```json 
{
  "include": [],
  "compilerOptions": {
    "target": "ES6", // 指定编译版本
    "module": "ES6", // 指定编译后代码使用的模块化系统
    "lib": ["DOM"], // 指定代码运行时所包含的库(正常不需要设置)
    "outDir": "./dist", // 指定编译后文件的所在目录
    "outFile": "./dist/app.js", // 将代码合并为一个文件
    "allowJs": false, // 是否编译javascript文件
    "checkJs": false, // 是否检查js代码符合语法规范
    "removeComments": true, // 是否移除注释
    "noEmit": true, // 是否生成输出文件
    "noEmitOnError": true, // 报错时不生成输出文件
    "strict": true, // 启用所有严格类型检查选项
    "alwaysStrict": true, // 以严格模式解析并为每个源文件生成"use strict"语句
    "noImplicitAny": true, // 在表达式和声明上有隐含的any类型时报错
    "noImplicitThis": false, // 当this表达式的值为any类型的时候，生成一个错误
    "strictNullChecks": true // 严格检查空值
  }
}
```
