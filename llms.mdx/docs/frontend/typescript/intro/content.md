# 初识TypeScript (/docs/frontend/typescript/intro)

1.学习 TypeScript 需要安装`Node.js`，另外还需要安装 TypeScript 编译器，可以通过 Node 包管理器(NPM，Node Package Manager)执行下面命令：

```sh 
npm install -g typescript
```

如果想要 TypeScript 版本只针对特定的项目，则输入下面命令：

```sh 
npm install typescript --save-dev
```

2.`ts`文件需要使用 tsc 编译器进行编译

```sh 
tsc xxx.ts
```

> 尽管可以使用命令编译 TypeScript，但是使用`tsconfig.json`更加便捷，可以使用`tsc --init`创建，将在后面介绍。
