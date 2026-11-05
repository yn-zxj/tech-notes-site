# WebPack打包 (/docs/frontend/typescript/webpack_packing)

## 初始化项目 [#初始化项目]

```sh 
npm init -y // 创建package.json文件
```

## 下载构建工具 [#下载构建工具]

```sh 
npm i -D webpack webpack-cli webpack-dev-server typescript ts-loader html-webpack-plugin clean-webpack-plugin
```

> webpack：构建工具 webpack
>
> webpack-cli：webpack 的命令行工具
>
> webpack-dev-server：webpack 的开发服务器
>
> typescript：ts 编译器
>
> ts-loader：ts 加载器，用于在 webpack 中编译 ts 文件
>
> html-webpack-plugin：webpack 中 html 插件，用来自动创建 html 文件
>
> clean-webpack-plugin：webpack 中的清除插件，每次构建都会先清除目录

## 配置 webpack [#配置-webpack]

参考：[https://www.webpackjs.com/concepts/configuration/](https://www.webpackjs.com/concepts/configuration/)

`webpack.config.js:`

```javascript 
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  optimization: {
    minimize: false // 关闭代码压缩，可选
  },
  entry: './src/index.ts', // 指定入口文件
  mode: 'production', // 模式(开发/生产)
  output: {
    path: path.resolve(__dirname, 'dist'), // 指定打包文件的目录
    filename: 'bundle.js', // 打包后文件的文件
    environment: {
      arrowFunction: false // 关闭webpack的箭头函数，可选
    }
  },
  // 指定webpack打包时要用的模块
  module: {
    // 指定要加载的规则
    rules: [
      {
        test: /\.ts$/, // 指定规则生效的文件
        use: [
          {
            // 指定加载器
            loader: 'babel-loader',
            options: {
              // 设置预定义的环境
              presets: [
                [
                  '@babel/preset-env', // 指定环境的插件
                  // 配置信息
                  {
                    // 要兼容的目标浏览器
                    targets: {
                      chrome: '40',
                      ie: '11'
                    },
                    corejs: '3', // // 指定corejs的版本
                    useBuiltIns: 'usage' // 使用corejs的方式(目前按需加载)
                  }
                ]
              ]
            }
          },
          'ts-loader'
        ], // 要使用的loader(后面的先执行)
        exclude: /node_modules/
      }
    ]
  },
  // 配置webpack插件
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'TypeScript学习', // 可以修改自动生成的html的标题等属性
      template: './src/index.html' // 或者根据模板生成
    })
  ],
  // 用来设置引用模块
  resolve: {
    extensions: ['.ts', '.js']
  }
};
module.exports = config;
```

**配置 TS 编译选项(tsconfig.json)：**

```json 
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "ES2015",
    "strict": true
  }
}
```

**修改 package.json 配置：**

```json 
{
   ...
   "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1",
       "build": "webpack",
       "start": "webpack serve --open chrome.exe"
   },
   ...
}
```

> 执行命令`npm run build`对代码进行编译；
>
> 执行`npm run start`启动开发服务器；

## 配置文件示例 [#配置文件示例]


<Tabs items={["tsconfig.json", "package.json", "webpack.config.js"]}>
<Tab value="tsconfig.json">

```json
{
  "compilerOptions": {
    "module": "ES6",
    "target": "ES6",
    "strict": true
  }
}
```

</Tab>
<Tab value="package.json">

```json
{
  "name": "item",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "start": "webpack serve --open"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.19.6",
    "@babel/preset-env": "^7.19.4",
    "babel-loader": "^8.2.5",
    "clean-webpack-plugin": "^4.0.0",
    "core-js": "^3.26.0",
    "html-webpack-plugin": "^5.5.0",
    "ts-loader": "^9.4.1",
    "typescript": "^4.8.4",
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0",
    "webpack-dev-server": "^4.11.1"
  }
}
```

</Tab>
<Tab value="webpack.config.js">

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  optimization: {
    minimize: false // 关闭代码压缩，可选
  },
  entry: './src/index.ts', // 指定入口文件
  mode: 'production', // 模式(开发/生产)
  output: {
    path: path.resolve(__dirname, 'dist'), // 指定打包文件的目录
    filename: 'bundle.js', // 打包后文件的文件
    environment: {
      arrowFunction: false // 关闭webpack的箭头函数，可选
    }
  },
  // 指定webpack打包时要用的模块
  module: {
    // 指定要加载的规则
    rules: [
      {
        test: /\.ts$/, // 指定规则生效的文件
        use: [
          {
            // 指定加载器
            loader: 'babel-loader',
            options: {
              // 设置预定义的环境
              presets: [
                [
                  '@babel/preset-env', // 指定环境的插件
                  // 配置信息
                  {
                    // 要兼容的目标浏览器
                    targets: {
                      chrome: '40',
                      ie: '11'
                    },
                    corejs: '3', // // 指定corejs的版本
                    useBuiltIns: 'usage' // 使用corejs的方式(目前按需加载)
                  }
                ]
              ]
            }
          },
          'ts-loader'
        ], // 要使用的loader(后面的先执行)
        exclude: /node_modules/
      }
    ]
  },
  // 配置webpack插件
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'TypeScript学习', // 可以修改自动生成的html的标题等属性
      template: './src/index.html' // 或者根据模板生成
    })
  ],
  // 用来设置引用模块
  resolve: {
    extensions: ['.ts', '.js']
  }
};
module.exports = config;
```

</Tab>
</Tabs>
