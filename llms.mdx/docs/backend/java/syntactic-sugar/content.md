# 语法糖 (/docs/backend/java/syntactic-sugar)

<Cards>
  <Card title="原文：不了解这12个语法糖，别说你会Java！" href="https://mp.weixin.qq.com/s/EBnM7QAOPjDk5bG3M0Mu-w" description="作者：Hollis" external />
</Cards>


## 语法糖 [#语法糖]

&#8195;&#8195;语法糖(Syntactic sugar)，指在计算机语言中添加的某种语法，这种语法对语言的功能并没有影响，但是更方便程序员使用。**简而言之，语法糖让程序更加简洁，有更高的可读性。**

## 解语法糖 [#解语法糖]

&#8195;&#8195;虽然 Java 中有很多语法糖，但是 Java 虚拟机并不支持这些语法糖，所以<u>这些语法糖在编译阶段就会被还原成简单的基础语法结构</u>，这样才能被虚拟机识别，这个过程就是解语法糖。

&#8195;&#8195;Java 语言中，`javac`命令可以将后缀名为`.java`的源文件编译为后缀名为`.class`的可以运行于 Java 虚拟机的字节码。

&#8195;&#8195;在使用`javac`命令去编译源文件时，实际上是去执行`com.sun.tools.javac.Main#main`方法，而真正执行编译动作的，正是`com.sun.tools.javac.main.JavaCompiler`类。如果你去看这个类的源码，你会发现在`compile()`中有一个步骤就是调用`desugar()`，这个方法就是负责解语法糖的实现的。

```java  {10,27,37,45}
// 下面代码片段在 tools.jar → JavaCompiler.class
public void compile(List<JavaFileObject> var1) throws Throwable {
    this.compile(var1, List.nil(), (Iterable)null);
}

public void compile(List<JavaFileObject> var1, List<String> var2, Iterable<? extends Processor> var3) {
    ...
    this.initProcessAnnotations(var3);
    this.delegateCompiler = this.processAnnotations(this.enterTrees(this.stopIfError(CompileState.PARSE, this.parseFiles(var1))), var2);
    this.delegateCompiler.compile2();
    this.delegateCompiler.close();
    this.elapsed_msec = this.delegateCompiler.elapsed_msec;
    ...
}

private void compile2() {
    try {
        label44:
        switch (this.compilePolicy) {
            case ATTR_ONLY:
                this.attribute((Queue)this.todo);
                break;
            case CHECK_ONLY:
                this.flow(this.attribute((Queue)this.todo));
                break;
            case SIMPLE:
                this.generate(this.desugar(this.flow(this.attribute((Queue)this.todo))));
                break;
            case BY_FILE:
                Queue var1 = this.todo.groupByFile();

                while(true) {
                    if (var1.isEmpty() || this.shouldStop(CompileState.ATTR)) {
                        break label44;
                    }

                    this.generate(this.desugar(this.flow(this.attribute((Queue)var1.remove()))));
                }
            case BY_TODO:
                while(true) {
                    if (this.todo.isEmpty()) {
                        break label44;
                    }

                    this.generate(this.desugar(this.flow(this.attribute((Env)this.todo.remove()))));
                }
            default:
                Assert.error("unknown compile policy");
        }
        ...
}
```

&#8195;&#8195;常见的语法糖有 switch 支持枚举及字符串、泛型、条件编译、断言、可变参数、自动装箱/拆箱、枚举、内部类、增强 for 循环、try-with-resources 语句、lambda 表达式等。

## 常见的语法糖 [#常见的语法糖]

常用的反编译工具为：


<Cards>
  <Card title="CFR - Another Java Decompiler" href="https://github.com/leibnitz27/cfr" description="GIT地址" external />
  <Card title="Decompilers online" href="http://www.javadecompilers.com/" description="在线网页" external />
</Cards>


**CFR 命令**：

```sh 
# cfr-0.152.jar 本次下载的新版本的jar包
# 帮助
java -jar cfr-0.152.jar --help
# 去除switch对枚举支持的语法糖
java -jar cfr-0.152.jar App.class --decodestringswitch false
# 去除lambda表达式的语法糖
java -jar cfr-0.152.jar App.class --decodelambdas false
# 去除泛型的语法糖
java -jar cfr-0.152.jar App.class --removebadgenerics false
# 去除枚举语法糖
java -jar cfr-0.152.jar App.class --sugarenums false
# 去除自动装箱和拆箱的语法糖
java -jar cfr-0.152.jar App.class --sugarboxing false
```

### switch 支持 String [#switch-支持-string]

&#8195;&#8195;从 Java 7 开始，Java 语言中的语法糖在逐渐丰富，其中一个比较重要的就是 Java 7 中 switch 开始支持 String。

&#8195;&#8195;Java 中的 swith 自身原本就支持基本类型。比如 int、char 等。对于 int 类型，直接进行数值的比较。对于 char 类型则是比较其 ascii 码。

&#8195;&#8195;所以，对于编译器来说，switch 中其实只能使用整型，任何类型的比较都要转换成整型。比如 byte、short、char(ascii 码是整型)以及 int。

&#8195;&#8195;switch 对 String 的支持，代码如下：


<Tabs items={["App.java", "解语法糖后"]}>
<Tab value="App.java">

```java 
public class App {
    public static void main(String[] args) {
        String str = "world";
        switch (str) {
            case "hello":
                System.out.println("hello");
                break;
            case "world":
                System.out.println("world");
                break;
            default:
                break;
        }
    }
}
```

</Tab>
<Tab value="解语法糖后">

```java 
/*
 * Decompiled with CFR 0.152.
 */
public class App {
    public static void main(String[] args) {
        String str;
        String string = str = "world";
        int n = -1;
        switch (string.hashCode()) {
            case 99162322: {
                if (!string.equals("hello")) {
                    break;
                }
                n = 0;
                break;
            }
            case 113318802: {
                if (!string.equals("world")) {
                    break;
                }
                n = 1;
            }
        }
        switch (n) {
            case 0: {
                System.out.println("hello");
                break;
            }
            case 1: {
                System.out.println("world");
                break;
            }
        }
    }
}
```

</Tab>
</Tabs>


> 字符串的 switch 是通过 equals()和 hashCode()方法来实现的。switch 的实际是哈希值，然后通过使用 equals 方法比较进行安全检查，这个检查是必要的，<u>因为哈希可能会发生碰撞</u>。因此它的性能是不如使用枚举进行 switch 或者使用纯整数常量，但这也不是很差。

### 泛型 [#泛型]

&#8195;&#8195;很多语言都是支持泛型的，不同的编译器对于泛型的处理方式是不同的。通常情况下，一个编译器处理泛型有两种方式：`Code specialization` 和 `Code sharing`。

> Code sharing 方式为每个泛型类型创建唯一的字节码表示，并且将该泛型类型的实例都映射到这个唯一的字节码表示上。将多种泛型类形实例映射到唯一的字节码表示是通过类型擦除（type erasue）实现的。

&#8195;&#8195;C++ 和 C# 是使用`Code specialization`的处理机制，而 Java 使用的是`Code sharing`的机制。

&#8195;&#8195;对于 Java 虚拟机来说，他根本不认识`Map<String, String> map`这样的语法，需要在编译阶段通过类型擦除的方式进行解语法糖。

**类型擦除的主要过程如下**：
① 将所有的泛型参数用其最左边界（最顶级的父类型）类型替换。
② 移除所有的类型参数。


<Tabs items={["泛型方法", "泛型 Map"]}>
<Tab value="泛型方法">

```java 
public static <A extends Comparable<A>> A max(Collection<A> xs) {
    Iterator<A> xi = xs.iterator();
    A w = xi.next();
    while (xi.hasNext()) {
        A x = xi.next();
        if (w.compareTo(x) < 0)
            w = x;
    }
    return w;
}
```

</Tab>
<Tab value="泛型 Map">

```java 
Map<String, String> map = new HashMap<String, String>();
map.put("name", "hollis");
map.put("wechat", "Hollis");
map.put("blog", "www.hollischuang.com");
```

</Tab>
</Tabs>



<Tabs items={["类型擦除后", "解语法糖后"]}>
<Tab value="类型擦除后">

```java 
public static Comparable max(Collection xs){
    Iterator xi = xs.iterator();
    Comparable w = (Comparable)xi.next();
    while(xi.hasNext())
    {
        Comparable x = (Comparable)xi.next();
        if(w.compareTo(x) < 0)
            w = x;
    }
    return w;
}
```

</Tab>
<Tab value="解语法糖后">

```java 
Map map = new HashMap();
map.put("name", "hollis");
map.put("wechat", "Hollis");
map.put("blog", "www.hollischuang.com");
```

</Tab>
</Tabs>


> 虚拟机中没有泛型，只有普通类和普通方法，所有泛型类的类型参数在编译时都会被擦除，泛型类并没有自己独有的 Class 类对象。比如并不存在`List<String>.class` 或是 `List<Integer>.class`，而只有`List.class`

### 自动装箱与拆箱 [#自动装箱与拆箱]

&#8195;&#8195;包装类是对基本类型的包装，所以，<u>把基本数据类型转换成包装类的过程就是装箱</u>；反之，<u>把包装类转换成基本数据类型的过程就是拆箱</u>。在 Java SE5 中，为了减少开发人员的工作，Java 提供了自动拆箱与自动装箱功能。
&#8195;&#8195;<u>自动装箱都是通过<mark>包装类</mark>的`valueOf()`方法实现；自动拆箱都是通过<mark>包装类对象</mark>的`xxxValue()`来实现。</u>


<Cards>
  <Card title="Java 中有了基本类型为什么还需要包装类？" href="/docs/interview/java/java-foundation#java-中有了基本类型为什么还需要包装类" description="知识扩展：自动拆装箱" />
</Cards>


### 方法变长参数 [#方法变长参数]

&#8195;&#8195;可变参数(variable arguments)是在 Java 1.5 中引入的一个特性。它允许一个方法把任意数量的值作为参数。

<Tabs items={["App.java", "反编译"]}>
<Tab value="App.java">

```java 
public static void main(String[] args) {
    print("李白", "字太白", "号青莲居士", "唐朝伟大的浪漫主义诗人");
}

public static void print(String... strs) {
    for (int i = 0; i < strs.length; i++) {
        System.out.println(strs[i]);
    }
}
```

</Tab>
<Tab value="反编译">

```java 
public static void main(String args[])
{
    print(new String[] { "\u674E\u767D", "\u5B57\u592A\u767D", "\u53F7\u9752\u83B2\u5C45\u58EB",
    "\u5510\u671D\u4F1F\u5927\u7684\u6D6A\u6F2B\u4E3B\u4E49\u8BD7\u4EBA" });
}

public static void print(String... strs) {
    for (int i = 0; i < strs.length; i++)
        System.out.println(strs[i]);
}
```

</Tab>
</Tabs>


> 可变参数在被使用的时候，他首先会创建一个数组，数组的长度就是调用该方法是传递的实参的个数，然后再把参数值全部放到这个数组当中，然后再把这个数组作为参数传递到被调用的方法中。

### 枚举 [#枚举]

&#8195;&#8195;Java SE5 提供了一种新的类型-Java 的枚举类型，关键字 enum 可以将一组具名的值的有限集合创建为一种新的类型。

<Tabs items={["App.java", "反编译"]}>
<Tab value="App.java">

```java 
public enum t {
    SPRING, SUMMER;
}
```

</Tab>
<Tab value="反编译">

```java 
/*
 * Decompiled with CFR 0.152.
 */
public static final class t
    extends Enum<t> {
        public static final /* enum */ t SPRING = new t("SPRING", 0);
        public static final /* enum */ t SUMMER = new t("SUMMER", 1);
        private static final /* synthetic */ t[] $VALUES;

        public static t[] values() {
            return (t[])$VALUES.clone();
        }

        public static t valueOf(String name) {
            return Enum.valueOf(t.class, name);
        }

        private t(String string, int n) {
            super(string, n);
        }

        static {
            $VALUES = new t[]{SPRING, SUMMER};
        }
    }
}
```

</Tab>
</Tabs>


> &#8195;&#8195;通过反编译后代码我们可以看到，public final class T extends Enum，说明，该类是继承了 Enum 类的，同时 final 关键字告诉我们，这个类也是不能被继承的。
> &#8195;&#8195;当我们使用 enmu 来定义一个枚举类型的时候，编译器会自动帮我们创建一个 final 类型的类继承 Enum 类，所以枚举类型不能被继承。

### 内部类 [#内部类]

&#8195;&#8195;内部类又称为嵌套类，可以把内部类理解为外部类的一个普通成员。

&#8195;&#8195;内部类之所以也是语法糖，是因为它仅仅是一个编译时的概念。

&#8195;&#8195;`Outer.java`里面定义了一个内部类`Inner`，一旦编译成功，就会生成两个完全不同的`.class`文件了，分别是`Outer.class`和`Outer$Inner.class`。所以内部类的名字完全可以和它的外部类名字相同。

```java 
public class Outer {
    private String userName;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    class Inner {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
```

### 条件编译 [#条件编译]

&#8195;&#8195;—般情况下，程序中的每一行代码都要参加编译。但有时候出于对程序代码优化的考虑，希望只对其中一部分内容进行编译，此时就需要在程序中加上条件，让编译器只对满足条件的代码进行编译，将不满足条件的代码舍弃，这就是条件编译。


<Tabs items={["App.java", "反编译"]}>
<Tab value="App.java">

```java 
public class ConditionalCompilation {
    public static void main(String[] args) {
        final boolean DEBUG = true;
        if (DEBUG) {
            System.out.println("Hello, DEBUG!");
        }

        final boolean ONLINE = false;

        if (ONLINE) {
            System.out.println("Hello, ONLINE!");
        }
    }
}
```

</Tab>
<Tab value="反编译">

```java 
public class ConditionalCompilation {

    public ConditionalCompilation() {
    }

    public static void main(String args[]) {
        boolean DEBUG = true;
        System.out.println("Hello, DEBUG!");
        boolean ONLINE = false;
    }
}
```

</Tab>
</Tabs>


> Java 语法的条件编译，是通过判断条件为常量的 if 语句实现的。根据 if 判断条件的真假，编译器直接把分支为 false 的代码块消除。通过该方式实现的条件编译，必须在方法体内实现，而无法在正整个 Java 类的结构或者类的属性上进行条件编译。

### 断言 [#断言]

&#8195;&#8195;在 Java 中，assert 关键字是从 JAVA SE 1.4 引入的，为了避免和老版本的 Java 代码中使用了 assert 关键字导致错误，Java 在执行的时候默认是不启动断言检查的（这个时候，所有的断言语句都将忽略！）。

&#8195;&#8195;如果要开启断言检查，则需要用开关`-enableassertions`或`-ea`来开启。


<Tabs items={["AssertTest.java", "反编译"]}>
<Tab value="AssertTest.java">

```java 
public class AssertTest {
    public static void main(String args[]) {
        int a = 1;
        int b = 1;
        assert a == b;
        System.out.println("公众号：Hollis");
        assert a != b : "Hollis";
        System.out.println("博客：www.hollischuang.com");
    }
}
```

</Tab>
<Tab value="反编译">

```java 
public class AssertTest {
    public AssertTest() {
    }

    public static void main(String args[]) {
        int a = 1;
        int b = 1;
        if (!$assertionsDisabled && a != b) {
            throw new AssertionError();
        }
        System.out.println("\u516C\u4F17\u53F7\uFF1AHollis");
        if (!$assertionsDisabled && a == b) {
            throw new AssertionError("Hollis");
        } else {
            System.out.println("\u535A\u5BA2\uFF1Awww.hollischuang.com");
            return;
        }
    }

    static final boolean $assertionsDisabled = !com/hollis/suguar/AssertTest.desiredAssertionStatus();
}
```

</Tab>
</Tabs>


> &#8195;&#8195;反编译之后的代码要比我们自己的代码复杂的多。所以，使用了 assert 这个语法糖我们节省了很多代码。
> &#8195;&#8195;其实断言的底层实现就是 if 语言，如果断言结果为 true，则什么都不做，程序继续执行，如果断言结果为 false，则程序抛出 AssertError 来打断程序的执行。
> &#8195;&#8195;-enableassertions 会设置$assertionsDisabled 字段的值。

### 数值字面量 [#数值字面量]

&#8195;&#8195;在 Java 7 中，数值字面量，不管是整数还是浮点数，都允许在数字之间插入任意多个下划线。这些下划线不会对字面量的数值产生影响，目的就是方便阅读。


<Tabs items={["App.java", "反编译"]}>
<Tab value="App.java">

```java 
public static void main(String[] args) {
    int i = 10_000;
    System.out.println(i);
}
```

</Tab>
<Tab value="反编译">

```java 
public static void main(String[] args) {
    int i = 10000;
    System.out.println(i);
}
```

</Tab>
</Tabs>


> 反编译后就是把`_`删除了。也就是说编译器并不认识在数字字面量中的`_`，需要在编译阶段把他去掉。

### for-each [#for-each]

&#8195;&#8195;增强 for 循环（for-each）相信大家都不陌生，日常开发经常会用到的，他会比 for 循环要少写很多代码，那么这个语法糖背后是如何实现的呢？


<Tabs items={["App.java", "反编译"]}>
<Tab value="App.java">

```java 
public static void main(String[] args) {
    String[] strList = {"你好", "Java"};
    for (String str : strList) {
        System.out.println("str = " + str);
    }

    List<String> list = Arrays.asList(strList);
    for (String string : list) {
        System.out.println("string = " + string);
    }
}
```

</Tab>
<Tab value="反编译">

```java 
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//
public static void main(String[] args) {
    String[] strList = new String[]{"你好", "Java"};
    String[] var2 = strList;
    int var3 = strList.length;

    for(int var4 = 0; var4 < var3; ++var4) {
        String str = var2[var4];
        System.out.println("str = " + str);
    }

    List<String> list = Arrays.asList(strList);
    Iterator var7 = list.iterator();

    while(var7.hasNext()) {
        String string = (String)var7.next();
        System.out.println("string = " + string);
    }
}
```

</Tab>
</Tabs>


> 代码很简单，for-each 的实现原理其实就是使用了普通的 for 循环和迭代器。

### try-with-resource [#try-with-resource]

&#8195;&#8195;Java 里，对于文件操作 IO 流、数据库连接等开销非常昂贵的资源，用完之后必须及时通过 close 方法将其关闭，否则资源会一直处于打开状态，可能会导致内存泄露等问题。

&#8195;&#8195;关闭资源的常用方式就是在 finally 块里是释放，即调用 close 方法。比如，我们经常会写这样的代码：

```java 
public static void main(String[] args) {
    BufferedReader br = null;
    try {
        String line;
        br = new BufferedReader(new FileReader("d:\\hollischuang.xml"));
        while ((line = br.readLine()) != null) {
            System.out.println(line);
        }
    } catch (IOException e) {
        // handle exception
    } finally {
        try {
            if (br != null) {
                br.close();
            }
        } catch (IOException ex) {
            // handle exception
        }
    }
}
```

从 Java 7 开始，jdk 提供了一种更好的方式关闭资源，使用 try-with-resources 语句，改写一下上面的代码，效果如下：


<Tabs items={["App.java", "背后实现"]}>
<Tab value="App.java">

```java 
public static void main(String... args) {
    try (BufferedReader br = new BufferedReader(new FileReader("d:\\ hollischuang.xml"))) {
        String line;
        while ((line = br.readLine()) != null) {
            System.out.println(line);
        }
    } catch (IOException e) {
        // handle exception
    }
}
```

</Tab>
<Tab value="背后实现">

```java 
public static transient void main(String args[])
    {
        BufferedReader br;
        Throwable throwable;
        br = new BufferedReader(new FileReader("d:\\ hollischuang.xml"));
        throwable = null;
        String line;
        try
        {
            while((line = br.readLine()) != null)
                System.out.println(line);
        }
        catch(Throwable throwable2)
        {
            throwable = throwable2;
            throw throwable2;
        }
        if(br != null)
            if(throwable != null)
                try
                {
                    br.close();
                }
                catch(Throwable throwable1)
                {
                    throwable.addSuppressed(throwable1);
                }
            else
                br.close();
            break MISSING_BLOCK_LABEL_113;
            Exception exception;
            exception;
            if(br != null)
                if(throwable != null)
                    try
                    {
                        br.close();
                    }
                    catch(Throwable throwable3)
                      {
                        throwable.addSuppressed(throwable3);
                    }
                else
                    br.close();
        throw exception;
        IOException ioexception;
        ioexception;
    }
}
```

</Tab>
</Tabs>


> 其实背后的原理也很简单，那些我们没有做的关闭资源的操作，编译器都帮我们做了。所以，再次印证了，语法糖的作用就是方便程序员的使用，但最终还是要转成编译器认识的语言。

### Lambda 表达式 [#lambda-表达式]


<Cards>
  <Card title="Lambda 表达式" href="/docs/backend/java/lambda" description="Lambda 表达式" />
</Cards>


Labmda 表达式不是匿名内部类的语法糖，但是它也是一个语法糖。实现方式其实是依赖了几个 JVM 底层提供的 Lambda 相关 API。

## 需要注意的点 [#需要注意的点]

① **泛型 —— 当泛型遇到重载**

```java 
public class GenericTypes {

    public static void method(List<String> list) {
        System.out.println("invoke method(List<String> list)");
    }

    public static void method(List<Integer> list) {
        System.out.println("invoke method(List<Integer> list)");
    }
}
```

> &#8195;&#8195;上面这段代码，有两个重载的函数，因为他们的参数类型不同，一个是 List 另一个是 List，但是，这段代码是编译通不过的。因为我们前面讲过，参数 List 和 List 编译之后都被擦除了，变成了一样的原生类型 List，擦除动作导致这两个方法的特征签名变得一模一样。

② **泛型 —— 当泛型遇到 catch**
&#8195;&#8195;泛型的类型参数不能用在 Java 异常处理的 catch 语句中。因为异常处理是由 JVM 在运行时刻来进行的。由于类型信息被擦除，JVM 是无法区分两个异常类型 `MyException<String>`和`MyException<Integer>`的。

③ **泛型 —— 当泛型内包含静态变量**

```java 
public class StaticTest {
    public static void main(String[] args) {
        GT<Integer> gti = new GT<Integer>();
        gti.var = 1;
        GT<String> gts = new GT<String>();
        gts.var = 2;
        System.out.println(gti.var);
    }
}

class GT<T> {
    public static int var = 0;

    public void nothing(T x) {
    }
}
```

> 以上代码输出结果为：`2`！由于经过类型擦除，所有的泛型类实例都关联到同一份字节码上，泛型类的所有静态变量是共享的。

④ **自动装箱与拆箱 —— 对象相等比较**

```java 
public static void main(String[] args) {
    Integer a = 1000;
    Integer b = 1000;
    Integer c = 100;
    Integer d = 100;
    System.out.println("a == b is " + (a == b));
    System.out.println(("c == d is " + (c == d)));
}
```

输出结果：

```java 
a == b is false
c == d is true
```

> 在 Java 5 中，在 Integer 的操作上引入了一个新功能来节省内存和提高性能。整型对象通过使用相同的对象引用实现了缓存和重用。适用于整数值区间-128 至 +127。只适用于自动装箱，使用构造函数创建对象不适用。

⑤ **增强 for 循环**

```java 
for (Student stu : students) {
    if (stu.getId() == 2)
        students.remove(stu);
}
```

&#8195;&#8195;会抛出`ConcurrentModificationException`异常。

&#8195;&#8195;Iterator 是工作在一个独立的线程中，并且拥有一个 mutex 锁。 Iterator 被创建之后会建立一个指向原来对象的单链索引表，当原来的对象数量发生变化时，这个索引表的内容不会同步改变，所以当索引指针往后移动的时候就找不到要迭代的对象，所以按照 fail-fast 原则 Iterator 会马上抛出 java.util.ConcurrentModificationException 异常。

&#8195;&#8195;所以 Iterator 在工作的时候是不允许被迭代的对象被改变的。但你可以使用 Iterator 本身的方法 remove()来删除对象，Iterator.remove() 方法会在删除当前迭代对象的同时维护索引的一致性。

## 总结 [#总结]

&#8195;&#8195;前面介绍了 12 种 Java 中常用的语法糖。所谓语法糖就是提供给开发人员便于开发的一种语法而已。

&#8195;&#8195;但是这种语法只有开发人员认识。要想被执行，需要进行解糖，即转成 JVM 认识的语法。

&#8195;&#8195;当我们把语法糖解糖之后，你就会发现其实我们日常使用的这些方便的语法，其实都是一些其他更简单的语法构成的。

&#8195;&#8195;有了这些语法糖，我们在日常开发的时候可以大大提升效率，但是同时也要避免过渡使用。使用之前最好了解下原理，避免掉坑。
