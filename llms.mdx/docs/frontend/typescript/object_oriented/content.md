# 面向对象 (/docs/frontend/typescript/object_oriented)

## 类(class) [#类class]

**定义类:**

```ts
class 类名 {
  属性名: 类型;
  // 构造函数(ts只能有一个构造器方法)
  constructor(参数: 类型) {
    this.属性名 = 参数;
  }
  方法名() {
    ...
  }
}

// 示例
class Person {
  name: string;
  age: number;
  static gender: number = 1; // 静态属性可以直接用
  readonly ability: number = 72; // 只读属性

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    console.log('大家好！我是' + this.name);
  }
}

let p = new Person('孙悟空', 25);
console.log(Person.gender); // 测试静态属性
p.sayHello();
```

## 继承 [#继承]

```ts
class Animals {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  say(sound: string) {
    console.log(sound);
  }
}

class Dog extends Animals {
  weight: number;

  constructor(weight: number, name: string, age: number) {
    super(name, age);
    this.weight = weight;
  }
}

let dog = new Dog(10, '旺财', 3);
console.log(dog);
dog.say('汪汪汪');
```

> 子类构造函数中必须包含`super`
>
> 子类继承父类后将会拥有其父类所有的方法及属性

## 抽象类 [#抽象类]

抽象类是专门用来被其他类所继承的类，它只能被其他类所继承不能用来创建实例，使用 abstract 开头的方法叫做抽象方法，抽象方法没有方法体只能定义在抽象类中，继承抽象类时抽象方法必须要实现；

```typescript
abstract class Animals {
  name: string;
  age: number;
  abstract run(): void;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  say(sound: string) {
    console.log(sound);
  }
}

class Dog extends Animals {
  weight: number;

  constructor(weight: number, name: string, age: number) {
    super(name, age);
    this.weight = weight;
  }

  // 实现
  run(): void {
    console.log('Dog run!');
  }
}

let dog = new Dog(10, '旺财', 3);
console.log(dog);
dog.say('汪汪汪');
```

## 接口 [#接口]

接口用来定义一个类结构， 即定义一个类中应该包含哪些属性和方法，同时接口也可以当成类型声明去使用；接口中的所有属性都不能有实际的值（接口只定义对象的类型，而不考虑实际值），在接口中所有的方法都是抽象方法。

**接口实现：**

```typescript
interface Animal {
  name: string;
  age: number;
  run(): void;
}

class Cat implements Animal {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  run(): void {
    console.log(this.name + 'Running!');
  }
}
```

**检查对象类型：**

```typescript
interface Animal {
  name: string;
  sayHello(): void;
}

function fn(cat: Animal) {
  cat.sayHello();
}

fn({
  name: 'Kite',
  sayHello() {
    console.log('Hello, I am ' + this.name);
  }
});
```

## 属性封装 [#属性封装]

对象实质上就是属性和方法的容器，它的主要作用就是存储属性和方法，这就是所谓的封装

默认情况下，对象的属性是可以任意的修改的，为了确保数据的安全性，在 TS 中可以对属性的权限进行设置

（1）静态属性（static）：声明为 static 的属性或方法不再属于实例，而是属于类的属性；

（2）只读属性（readonly）：如果在声明属性时添加一个 readonly，则属性便成了只读属性无法修改；

（3）TS 中属性具有三种修饰符：

- public（默认值）：可以在任意类、子类和对象中修改
- protected ：可以在当前类、子类中修改
- private ：可以在当前类中修改

**属性存取器：**

```typescript
class Person {
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }
}

const p1 = new Person('孙悟空');
// 实际通过调用getter方法读取name属性
console.log(p1.name);
// 实际通过调用setter方法修改name属性
p1.name = '猪八戒';
```

## 范型 [#范型]

在定义函数或者类时，如果遇到类型不明确就可以使用范型；例如下面的`<K>`就表示范型，名字随意；

```typescript
function fn<T>(a: T): T {
  return a;
}
// 直接使用
fn(10);
// 指定类型
fn<number>(10);

// 多个范型
function fn2<T, K>(a: T, b: K): T {
  console.log(b);
  return a;
}
fn2(123, 'hello');
fn2<number, string>(123, 'hello');
```

**范型类**：

```typescript
class MyClass<T> {
  prop: T;

  constructor(prop: T) {
    this.prop = prop;
  }
}
```

**范型继承**：

```typescript
interface MyInter {
  length: number;
}

function test<T extends MyInter>(arg: T): number {
  return arg.length;
}
// 使用T extends MyInter表示泛型T必须是MyInter实现类(子类)
```
