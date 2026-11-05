# 贪食蛇练习 (/docs/frontend/typescript/practice)

## 目录结构 [#目录结构]

```sh
snake
├── package-lock.json
├── package.json
├── src
│   ├── index.html
│   ├── index.ts
│   ├── moduls
│   │   ├── Food.ts
│   │   ├── GamaControl.ts
│   │   ├── ScorePannel.ts
│   │   └── Snake.ts
│   └── style
│       └── index.less
├── tsconfig.json
└── webpack.config.js
```

## 核心文件 [#核心文件]


<Tabs items={["GameControl.ts", "Food.ts", "ScorePannel.ts", "Snake.ts", "index.ts", "index.less", "index.html"]}>
<Tab value="GameControl.ts">

```typescript
import Food from './Food';
import ScorePannel from './ScorePannel';
import Snake from './Snake';

// 游戏控制器，控制其他类
class GameControl {
  // 定义三个属性
  snake: Snake;
  food: Food;
  scorePannel: ScorePannel;
  // 记录游戏是否结束
  isLive: boolean = true;

  // 创建一个属性来存储蛇的移动方向
  direction: string = '';

  constructor() {
    this.snake = new Snake();
    this.food = new Food();
    this.scorePannel = new ScorePannel();
    this.init();
  }
  // 游戏初始化
  init() {
    // 绑定键盘按键按下的事件
    document.addEventListener('keydown', this.keydownHandler.bind(this));
    this.run();
  }

  // 创建一个键盘按下的响应函数
  keydownHandler(event: KeyboardEvent) {
    // 需要检查是否按了正确的按键
    this.direction = event.key;
  }

  // 让蛇移动
  run() {
    // 获取蛇的坐标
    let X = this.snake.X;
    let Y = this.snake.Y;
    switch (this.direction) {
      case 'ArrowUp':
      case 'Up':
        Y -= 10;
        break;
      case 'ArrowDown':
      case 'Down':
        Y += 10;
        break;
      case 'ArrowLeft':
      case 'Left':
        X -= 10;
        break;
      case 'ArrowRight':
      case 'Right':
        X += 10;
        break;
    }
    this.check(X, Y);
    try {
      this.snake.X = X;
      this.snake.Y = Y;
    } catch (e) {
      alert(e);
      this.isLive = false;
    }
    this.isLive && setTimeout(this.run.bind(this), 300 - (this.scorePannel.level - 1) * 30);
  }

  // 定义一个方法，用来检查蛇是否迟到食物
  check(X: number, Y: number) {
    if (X === this.food.X && Y === this.food.Y) {
      // 食物位置重置
      this.food.change();
      // 分数增加
      this.scorePannel.addScore();
      this.snake.addBody();
    }
  }
}

export default GameControl;
```

</Tab>
<Tab value="Food.ts">

```typescript
// 定义食物类
class Food {
  // 定义一个属性表示食物所对应的元素
  element: HTMLElement;

  constructor() {
    // 获取页面中的food元素并将其赋值给element
    this.element = document.getElementById('food')!;
  }

  // 定义一个获取食物x轴坐标的方法
  get X() {
    return this.element.offsetLeft;
  }

  // 定义一个获取食物y轴坐标的方法
  get Y() {
    return this.element.offsetTop;
  }

  // 修改食物位置
  change() {
    /**
     * 生成一个随机的位置
     * 食物的位置最小是0，最大值290，给蛇设置移动一次就是一格，一格大小就是10，所以就要是10的倍数
     */
    this.element.style.left = Math.round(Math.random() * 29) * 10 + 'px';
    this.element.style.top = Math.round(Math.random() * 29) * 10 + 'px';
  }
}

export default Food;
```

</Tab>
<Tab value="ScorePannel.ts">

```typescript
// 定义表示记分牌的类
class ScorePannel {
  score = 0;
  level = 1;
  scoreEle: HTMLElement;
  levelEle: HTMLElement;

  // 设置变量限制等级
  maxLevel: number;
  // 设置变量表示多少分升级
  upScore: number;

  constructor(maxLevel: number = 10, upScore: number = 10) {
    this.scoreEle = document.getElementById('score')!;
    this.levelEle = document.getElementById('level')!;
    this.maxLevel = maxLevel;
    this.upScore = upScore;
  }

  // 设置一个加分的方法
  addScore() {
    this.scoreEle.innerHTML = ++this.score + '';
    if (this.score % this.upScore === 0) {
      this.levelUp();
    }
  }

  // 设置等级提升的方法
  levelUp() {
    if (this.level < this.maxLevel) {
      this.levelEle.innerHTML = ++this.level + '';
    }
  }
}

export default ScorePannel;
```

</Tab>
<Tab value="Snake.ts">

```typescript
class Snake {
  // 表示蛇头的元素
  head: HTMLElement;
  // 蛇的身体（包括蛇头）
  bodies: HTMLCollection;
  // 获取蛇的容器
  element: HTMLElement;

  constructor() {
    this.element = document.getElementById('snake')!;
    this.head = document.querySelector('#snake > div') as HTMLElement;
    this.bodies = document.getElementById('snake')!.getElementsByTagName('div');
  }

  // 获取蛇的坐标
  get X() {
    return this.head.offsetLeft;
  }
  get Y() {
    return this.head.offsetTop;
  }

  // 设置蛇头的坐标
  set X(value: number) {
    // 如果新值和旧值相同，则直接返回不修改
    if (this.X === value) {
      return;
    }
    if (value < 0 || value > 290) {
      throw new Error('撞墙了!');
    }
    // 修改x时，是在修改水平坐标，蛇在左右移动，蛇想左移动时，不能向掉头
    if (this.bodies[1] && (this.bodies[1] as HTMLElement).offsetLeft === value) {
      // 如果发生了掉头，让蛇向反方向继续移动
      if (value > this.X) {
        // 新值value大于旧值X，则说明蛇在向右走，此时发生掉头，应该使蛇继续向左走
        value = this.X - 10;
      } else {
        value = this.X + 10;
      }
    }
    this.moveBody();
    this.head.style.left = value + 'px';
    this.checkHeadBody();
  }
  set Y(value: number) {
    if (this.Y === value) {
      return;
    }
    if (value < 0 || value > 290) {
      throw new Error('撞墙了!');
    }
    if (this.bodies[1] && (this.bodies[1] as HTMLElement).offsetTop === value) {
      // 如果发生了掉头，让蛇向反方向继续移动
      if (value > this.Y) {
        // 新值value大于旧值Y，则说明蛇在向下走，此时发生掉头，应该使蛇继续向上走
        value = this.Y - 10;
      } else {
        value = this.Y + 10;
      }
    }
    this.moveBody();
    this.head.style.top = value + 'px';
    this.checkHeadBody();
  }

  // 蛇增加身体的方法
  addBody() {
    // 向element中添加一个div
    this.element.insertAdjacentHTML('beforeend', '<div></div>');
  }

  // 添加一个蛇身体移动的方法(后一个到前一个的位置)
  moveBody() {
    // 第四节等于第三节位置，第三节等于第二节位置.....
    for (let i = this.bodies.length - 1; i > 0; i--) {
      // 获取前面身体的位置
      let X = (this.bodies[i - 1] as HTMLElement).offsetLeft;
      let Y = (this.bodies[i - 1] as HTMLElement).offsetTop;
      (this.bodies[i] as HTMLElement).style.left = X + 'px';
      (this.bodies[i] as HTMLElement).style.top = Y + 'px';
    }
  }

  // 解决自己咬到自己问题
  checkHeadBody() {
    // 获取所有的身体，检查是否和蛇头的坐标发生重叠
    for (let i = 1; i < this.bodies.length; i++) {
      let bd = this.bodies[i] as HTMLElement;
      if (this.X === bd.offsetLeft && this.Y === bd.offsetTop) {
        throw new Error('咬到自己啦!');
      }
    }
  }
}

export default Snake;
```

</Tab>
<Tab value="index.ts">

```typescript
// 引入样式
import './style/index.less';
import GameControl from './moduls/GamaControl';

new GameControl();
```

</Tab>
<Tab value="index.less">

```css
@bg-corlor: #b7d4a8;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font: bold 20px 'Courier';
}

#main {
  width: 360px;
  height: 420px;
  background-color: @bg-corlor;
  margin: 100px auto;
  border: 10px solid black;
  border-radius: 40px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-around;
}

#stage {
  width: 304px;
  height: 304px;
  border: 2px solid black;
  position: relative;

  #snake {
    & > div {
      width: 10px;
      height: 10px;
      background-color: #000;
      border: 1px solid @bg-corlor;
      position: absolute;
    }
  }

  #food {
    width: 10px;
    height: 10px;
    position: absolute;
    left: 40px;
    top: 100px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-content: space-between;

    & > div {
      width: 4px;
      height: 4px;
      background-color: #000;
      transform: rotate(45deg);
    }
  }
}

#score-panel {
  width: 300px;
  display: flex;
  justify-content: space-between;
}
```

</Tab>
<Tab value="index.html">

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>贪食蛇</title>
  </head>

  <body>
    <div id="main">
      <div id="stage">
        <div id="snake">
          <div></div>
        </div>
        <div id="food">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div id="score-panel">
        <div> SCORE:<span id="score">0</span> </div>
        <div> LEVEL:<span id="level">1</span> </div>
      </div>
    </div>
  </body>
</html>
```

</Tab>
</Tabs>


## 配置文件 [#配置文件]


<Tabs items={["tsconfig.json", "webpack.config.js", "package.json"]}>
<Tab value="tsconfig.json">

```json
{
  "compilerOptions": {
    "module": "ES6",
    "target": "ES6",
    "strict": true,
    "noEmitOnError": true
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
    minimize: true // 关闭代码压缩，可选
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
                      chrome: '90'
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
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      browsers: 'last 2 versions'
                    }
                  ]
                ]
              }
            }
          },
          'less-loader'
        ]
      }
    ]
  },
  // 配置webpack插件
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
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
<Tab value="package.json">

```json
{
  "name": "snake",
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
    "css-loader": "^6.7.2",
    "html-webpack-plugin": "^5.5.0",
    "less": "^4.1.3",
    "less-loader": "^11.1.0",
    "postcss": "^8.4.19",
    "postcss-loader": "^7.0.1",
    "postcss-preset-env": "^7.8.3",
    "style-loader": "^3.3.1",
    "ts-loader": "^9.4.1",
    "typescript": "^4.8.4",
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0",
    "webpack-dev-server": "^4.11.1"
  }
}
```

</Tab>
</Tabs>
