# 创建管理表 (/docs/backend/database/base/create_management_table)

## 基础知识 [#基础知识]

### 一条数据存储的过程 [#一条数据存储的过程]

&#8195;&#8195;存储数据是处理数据的第一步。只有正确地把数据存储起来，我们才能进行有效的处理和分析。否则，只能是一团乱麻，无从下手。

&#8195;&#8195;那么，怎样才能把用户各种经营相关的、纷繁复杂的数据，有序、高效地存储起来呢？ 在 MySQL 中，一个完整的数据存储过程总共有 4 步，分别是创建数据库、确认字段、创建数据表、插入数据。

<img src="/content/backend/database/img/data_storage_procedure.png" alt="数据存储过程.png" width="600" />

&#8195;&#8195;我们要先创建一个数据库，而不是直接创建数据表呢？

&#8195;&#8195;因为从系统架构的层次上看，MySQL 数据库系统从大到小依次是数据库服务器、数据库、数据表、数据表的行与列。

&#8195;&#8195;MySQL 数据库服务器之前已经安装。所以，我们就从创建数据库开始。

### 标识符命名规则 [#标识符命名规则]

(1) 数据库名、表名不得超过 30 个字符，变量名限制为 29 个  
(2) 必须只能包含`A–Z, a–z, 0 – 9 , _`共 63 个字符  
(3) 数据库名、表名、字段名等对象名中间<mark>不要包含空格</mark>  
(4) 同一个 MySQL 软件中，数据库不能同名；同一个库中，表不能重名；同一个表中，字段不能重名  
(5) 必须保证你的字段没有和保留字、数据库系统或常用方法冲突。如果坚持使用，请在 SQL 语句中使用着重号(`)引起来  
(6) <mark>保持字段名和类型的一致性</mark>：在命名字段并为其指定数据类型的时候一定要保证一致性，假如数据类型在一个表里是整数，那在另一个表里可就别变成字符型了

### MySQL 中的数据类型 [#mysql-中的数据类型]

MySQL数据类型精讲[点击跳转](/docs/backend/database/base/data_type)

| 类型             | 类型举例                                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| 整数类型         | TINYINT、SMALLINT、MEDIUMINT、 INT(或 INTEGER) 、BIGINT                                                           |
| 浮点类型         | FLOAT、DOUBLE                                                                                                     |
| 定点数类型       | DECIMAL                                                                                                           |
| 位类型           | BIT                                                                                                               |
| 日期时间类型     | YEAR、TIME、DATE 、DATETIME、TIMESTAMP                                                                            |
| 文本字符串类型   | CHAR、 VARCHAR 、TINYTEXT、TEXT、MEDIUMTEXT、LONGTEXT                                                             |
| 枚举类型         | ENUM                                                                                                              |
| 集合类型         | SET                                                                                                               |
| 二进制字符串类型 | BINARY、VARBINARY、TINYBLOB、BLOB、MEDIUMBLOB、LONGBLOB                                                           |
| JSON 类型        | JSON 对象、JSON 数组                                                                                              |
| 空间数据类型     | 单值：GEOMETRY、POINT、LINESTRING、POLYGON<br />集合：MULTIPOINT、MULTILINESTRING、MULTIPOLYGON、GEOMETRYCOLLECTION |

其中，常用的几类类型介绍如下：

| 数据类型        | 描述                                                                               |
| --------------- | ---------------------------------------------------------------------------------- |
| `INT`           | 从-2^31 到 2^31-1 的整型数据。存储大小为 4 个字节                                  |
| `CHAR(size)`    | 定长字符数据。若未指定，默认为 1 个字符，最大长度 255                              |
| `VARCHAR(size)` | 可变长字符数据，根据字符串实际长度保存， 必须指定长度                              |
| `FLOAT(M,D)`    | 单精度，占用 4 个字节，M=整数位+小数位，D=小数位。 D&lt;=M&lt;=255,0&lt;=D&lt;=30，默认 M+D&lt;=6 |
| `DOUBLE(M,D)`   | 双精度，占用 8 个字节，D&lt;=M&lt;=255,0&lt;=D&lt;=30，默认 M+D&lt;=15                            |
| `DECIMAL(M,D)`  | 高精度小数，占用 M+2 个字节，D&lt;=M&lt;=65，0&lt;=D&lt;=30，最大取值范围与 DOUBLE 相同。      |
| `DATE`          | 日期型数据，格式'YYYY-MM-DD'                                                       |
| `BLOB`          | 二进制形式的长文本数据，最大可达 4G                                                |
| `TEXT`          | 长文本数据，最大可达 4G                                                            |

## 创建和管理数据库 [#创建和管理数据库]

### 创建数据库 [#创建数据库]

**方式一**：创建数据库(默认字符集)

```sql 
CREATE DATABASE 数据库名;
# CREATE DATABASE testdb;
```

**方式二**：创建数据库并指定字符集

```sql 
CREATE DATABASE 数据库名 CHARACTER SET 字符集;
# CREATE DATABASE testdb CHARACTER SET 'utf8';
```

**方式三**：判断数据库是否已经存在，不存在则创建数据库 <mark>(推荐)</mark>

```sql 
CREATE DATABASE IF NOT EXISTS 数据库名;
# CREATE DATABASE IF NOT EXISTS testdb;
# CREATE DATABASE IF NOT EXISTS testdb CHARACTER SET 'utf8';
```


<Callout type="success" title="提示">

如果 MySQL 中已经存在相关的数据库，则忽略创建语句，不再创建数据库。

</Callout>


### 使用数据库 [#使用数据库]

查看当前所有的数据库：

```sql 
SHOW DATABASES;
```

查看当前正在使用的数据库：

```sql 
SELECT DATABASE();  # 使用的一个 mysql 中的全局函数
```

查看指定库下所有的表：

```sql 
SHOW TABLES FROM 数据库名;
```

查看数据库的创建信息：

```sql 
SHOW CREATE DATABASE 数据库名;
# 或
SHOW CREATE DATABASE 数据库名\G
```

使用/切换数据库：

```sql 
USE 数据库名;
```


<Callout type="warn" title="注意">

要操作表和数据之前必须先说明是对哪个数据库进行操作，否则就要对所有对象加上`数据库名.表名`。

</Callout>


### 修改数据库 [#修改数据库]

更改数据库字符集：

```sql 
# 字符集：gbk、utf8等
ALTER DATABASE 数据库名 CHARACTER SET 字符集;
```

### 删除数据库 [#删除数据库]

**方式一**：删除指定的数据库

```sql 
DROP DATABASE 数据库名;
```

**方式二**：删除指定的数据库 <mark>(推荐)</mark>

```sql 
DROP DATABASE IF EXISTS 数据库名;
```

## 创建表 [#创建表]

**方式一**：

```sql 
CREATE TABLE [IF NOT EXISTS] 表名(
字段1, 数据类型 [约束条件] [默认值],
字段2, 数据类型 [约束条件] [默认值],
字段3, 数据类型 [约束条件] [默认值],
......
[表约束条件]
);
```

建表示例：

```sql 
# 建表语句
CREATE TABLE emp(
  emp_id INT,
  emp_name VARCHAR(20),
  salary DOUBLE,
  hiredata DATE
);

# 查看表字段信息
DESCRIBE emp;
# 或
DESC emp;
```

---

**方式二**：用子查询创建表

```sql 
CREATE TABLE table [(column1, column2...)]
AS subquery;
```

建表示例：

```sql {12} 
# 建表并插入数据
CREATE TABLE dept
AS
SELECT employee_id, last_name, salary, hire_date
FROM employees;

# 建表但不插入数据(控制子查询不返回数据)
CREATE TABLE dept
AS
SELECT employee_id, last_name, salary, hire_date
FROM employees
WHERE 1 = -1;
```

---

**查看表结构**：

```sql 
DESCRIBE 表名;
DESC 表名;
SHOW CREATE TABLE 表名;

# DESCRIBE emp;
# DESC emp;
# SHOW CREATE TABLE emp;
```

## 修改表 [#修改表]

### 添加字段 [#添加字段]

```sql 
ALTER TABLE 表名
ADD [COLUMN] 字段名一 字段类型 [DEFAULT 默认值] [COMMENT 字段描述] [FIRST|AFTER 字段名二];

# COLUMN 可以省略
# FIRST 后不能跟字段
# AFTER 后必须跟字段
```

举例：

```sql 
# 字段添加到最后位置
ALTER TABLE dept ADD birthday DATE;

# 字段添加到hire_date前面
ALTER TABLE dept ADD birthday DATE FIRST hire_date;

# 字段添加到hire_date后面
ALTER TABLE dept ADD birthday DATE AFTER hire_date;

# 在birthday字段后面新增age字段，类型为INT，不为空，字段描述为年龄
ALTER TABLE dept ADD age INT NOT NULL COMMENT '年龄' AFTER birthday;
```

### 修改字段 [#修改字段]

```sql 
ALTER TABLE 表名
MODIFY [COLUMN] 字段名 字段类型 [DEFAULT 默认值] [COMMENT 字段描述] [FIRST|AFTER 字段名二];

# COLUMN 可以省略
# FIRST 后不能跟字段
# AFTER 后必须跟字段
```

举例：

```sql 
# 将birthday类型修改为VARCHAR，长度为20，不为空，字段描述为生日，并放到salary后面
ALTER TABLE dept MODIFY COLUMN birthday VARCHAR(20) NOT NULL COMMENT '生日' AFTER salary;
```


<Callout type="success" title="提示">

字段的修改包括修改字段的<mark>数据类型</mark>(仅在列中只有空值时才可以修改)、<mark>大小</mark>、<mark>位置</mark>和<mark>默认值</mark>，不过对默认值的修改只会影响后来插入表的数据，对之前的数据不会产生影响。

</Callout>


### 重命名字段 [#重命名字段]

```sql 
ALTER TABLE 表名
CHANGE [COLUMN] 字段名 新字段名 新数据类型 [DEFAULT 默认值] [COMMENT 字段描述] [FIRST|AFTER 字段名二];
```

举例：

```sql 
# 将字段age修改为age_change，类型为INT，默认值18，字段描述为'修改的年龄字段'，并放到birthday之后
ALTER TABLE dept
CHANGE age `age_change` INT DEFAULT 18 COMMENT '修改的年龄字段' AFTER birthday;
```

### 删除字段 [#删除字段]

```sql 
ALTER TABLE 表名 DROP [COLUMN] 字段名;
```

举例：

```sql 
# 删除dept表中的age字段
ALTER TABLE dept DROP age;
```


<Callout type="success" title="提示">

与添加、修改字段不同的是删除字段一次只能有一个字段被删除，此外在删除字段时，被修改的表至少要保留一个字段。

</Callout>


## 重命名表 [#重命名表]

**方式一**：

```sql 
RENAME TABLE 表名 TO 新表名;
```

举例：

```sql 
# 将表dept重命名为dept_new
RENAME TABLE dept TO dept_new;
```

---

**方式二**：

```sql 
ALTER TABLE 表名 RENAME TO 新表名;
```

举例：

```sql 
# 将表dept_new重命名为dept
ALTER TABLE dept_new RENAME TO dept;
```

## 删除表 [#删除表]

```sql 
DROP TABLE [IF EXISTS] 表一 [, 表二...];
```

举例：

```sql 
DROP TABLE IF EXISTS dept;
```


<Callout type="success" title="提示">

(1) 数据和结构都被删除  
(2) 所有正在运行的相关事务被提交  
(3) 所有相关索引被删除  
(4) `DROP TABLE table_name;` 语句不能被回滚

</Callout>


## 清空表 [#清空表]

**方式一**：

```sql 
DELETE FROM 表名;
```

举例：

```sql 
DELETE FROM dept;
```

---

**方式二**：

```sql 
TRUNCATE TABLE 表名;
```

举例：

```sql 
TRUNCATE TABLE dept;
```


<Callout type="success" title="提示">

(1) `TRUNCATE TABLE`语句可以删除表中所有的行，并释放表的存储空间

(2) `DELETE FROM`语句也可以删除表中所有的行，但<mark>不能释放表的存储空间</mark>

(3) `TRUNCATE`语句<mark>不能回滚</mark>，而使用`DELETE`语句<mark>可以实现回滚</mark>

(3) 相比而言，`TRUNCATE TABLE`语句速度更快，因为它是数据定义语言，直接提交，不会产生回滚信息，也不会触发表的删除触发器

> 阿里开发规范：
>
> 【参考】TRUNCATE TABLE 比 DELETE 速度快，且使用的系统和事务日志资源少，但 TRUNCATE 无事务且不触发 TRIGGER，有可能造成事故，故<mark>不建议在开发代码中使用此语句</mark>。
>
> 【说明】TRUNCATE TABLE 在功能上与不带 WHERE 子句的 DELETE 语句相同。

</Callout>


---


<Callout type="success" title="COMMIT 和 ROLLBACK 相关说明">

① DCL 中`COMMIT`和`ROLLBACK`  
**COMMIT**：一旦执行 COMMIT，则数据就被永久的保存在数据库中，意味着数据不可以回滚  
**ROLLBACK**：一旦执行 ROLLBACK，则可以实现数据的回滚，回滚到最近的一次 COMMIT 之后

② 对比`TRUNCATE TABLE`和`DELETE FROM`  
**相同点**：都可以实现对表中所有数据的删除，同时保留表结构  
**不同点**：  
&#8195;&#8195;TRUNCATE TABLE： 一旦执行此操作，表数据全部清除。同时，<mark>数据是不可以回滚的</mark>；  
&#8195;&#8195;DELETE FROM：一旦执行此操作，表数据可以全部清除(不带 WHERE)。同时，<mark>数据是可以实现回滚</mark>；

③ DDL 和 DML 说明  
&#8195;&#8195;DDL 的操作一旦执行，就不可回滚，指令`SET autocommit = FALSE`对 DDL 操作失效；  
&#8195;&#8195;DML 的操作默认情况，一旦执行，也是不可回滚的，但是，如果在执行 DML 之前，执行了`SET autocommit = FALSE`，则执行的 DML 操作就可以实现回滚。

</Callout>


## 内容扩展 [#内容扩展]

### 扩展一 MySQL 字段命名 [#扩展一-mysql-字段命名]

【强制】表名、字段名必须使用小写字母或数字，禁止出现数字开头，禁止两个下划线中间只出现数字。数据库字段名的修改代价很大，因为无法进行预发布，所以字段名称需要慎重考虑。  
正例：aliyun_admin，rdc_config，level3_name  
反例：AliyunAdmin，rdcConfig，level_3_name

【强制】禁用保留字，如 desc、range、match、delayed 等，请参考 MySQL 官方保留字。

【强制】表必备三字段：id, gmt_create, gmt_modified。

> 说明：其中 id 必为主键，类型为 BIGINT UNSIGNED、单表时自增、步长为 1。gmt_create,gmt_modified 的类型均为 DATETIME 类型，前者现在时表示主动式创建，后者过去分词表示被动式更新

【推荐】表的命名最好是遵循"业务名称\_表的作用"。  
正例：alipay_task 、 force_project、 trade_config

【推荐】库名与应用名称尽量一致。

【参考】合适的字符存储长度，不但节约数据库表空间、节约索引存储，更重要的是提升检索速度。  
正例：无符号值可以避免误存负数，且扩大了表示范围。

| 对象     | 年龄区间   | 类型               | 字节 | 表示范围                        |
| -------- | ---------- | ------------------ | ---- | ------------------------------- |
| 人       | 150 岁之内 | tinyint unsigned   | 1    | 无符号值：0 到 255              |
| 龟       | 数百岁     | smallint unnsigned | 2    | 无符号值：0 到 65535            |
| 恐龙化石 | 数千万年   | int unsigned       | 4    | 无符号值：0 到 约 43 亿         |
| 太阳     | 约 50 亿年 | bigint unsigned    | 8    | 无符号值：0 到 约 10 的 19 次方 |

### 扩展二 如何理解清空表、删除表等操作需谨慎? [#扩展二-如何理解清空表删除表等操作需谨慎]

&#8195;&#8195;`表删除`操作将把表的定义和表中的数据一起删除，并且 MySQL 在执行删除操作时，不会有任何的确认信息提示，因此执行删除操时应当慎重。在删除表前，最好对表中的数据进行<mark>备份</mark>，这样当操作失误时可以对数据进行恢复，以免造成无法挽回的后果。

&#8195;&#8195;同样的，在使用`ALTER TABLE`进行表的基本修改操作时，在执行操作过程之前，也应该确保对数据进行完整的<mark>备份</mark>，因为数据库的改变是<mark>无法撤销</mark>的，如果添加了一个不需要的字段，可以将其删除；相同的，如果删除了一个需要的列，该列下面的所有数据都将会丢失。

### 扩展三 MySQL8 新特性-DDL 的原子化 [#扩展三-mysql8-新特性-ddl-的原子化]

在 MySQL 8.0 版本中，InnoDB 表的 DDL 支持事务完整性，即 DDL 操作要么成功要么回滚。DDL 操作回滚日志写入到 data dictionary 数据字典表 mysql.innodb_ddl_log（该表是隐藏的表，通过 show tables 无法看到）中，用于回滚操作。通过设置参数，可将 DDL 操作日志打印输出到 MySQL 错误日志中。

分别在 MySQL 5.7 版本和 MySQL 8.0 版本中创建数据库和数据表，结果如下：

```sql 
CREATE DATABASE mytest;

USE mytest;

CREATE TABLE book1(
book_id INT ,
book_name VARCHAR( 255 )
);

SHOW TABLES;
```

(1) 在 MySQL 5.7 版本中，测试步骤如下： 删除数据表 book1 和数据表 book2，结果如下：

```sql 
mysql> DROP TABLE book1,book2;
ERROR 1051 ( 42 S02): Unknown table 'mytest.book2'
```

再次查询数据库中的数据表名称，结果如下：

```sql 
mysql> SHOW TABLES;
Empty set (0.00 sec)
```

从结果可以看出，<mark>虽然删除操作时报错了，但是仍然删除了数据表 book1</mark>。

(2) 在 MySQL 8.0 版本中，测试步骤如下： 删除数据表 book1 和数据表 book2，结果如下：

```sql 
mysql> DROP TABLE book1,book2;
ERROR 1051 ( 42 S02): Unknown table 'mytest.book2'
```

再次查询数据库中的数据表名称，结果如下：

```sql 
mysql> show tables;
+------------------+
| Tables_in_mytest |
+------------------+
| book1            |
+------------------+
1 row in set (0.00 sec)
```

从结果可以看出，<mark>数据表 book1 并没有被删除</mark>。

## 练习 [#练习]

(1) 创建数据库`test01_office`，指明字符集为`utf8`，并在此数据库下执行下述操作；  
(2) 创建表 dept01

| 字段 | 类型        |
| ---- | ----------- |
| id   | INT(7)      |
| NAME | VARCHAR(25) |

(3) 将表 departments 中的数据插入到新表 dept02 中；  
(4) 创建表 emp01

| 字段       | 类型        |
| ---------- | ----------- |
| id         | INT(7)      |
| first_name | VARCHAR(25) |
| last_name  | VARCHAR(25) |
| dept_id    | INT(7)      |

(5) 将 emp01 表中 last_name 的长度增加到 50  
(6) 根据表 employees 创建 emp02；  
(7) 删除表 emp01；  
(8) 将表 emp02 重名名为 emp01；  
(9) 在表 dept02 和 emp01 中添加新列 test_column，并检查所做的操作；  
(10) 直接删除表 emp01 中的列 department_id；

```sql 
CREATE DATABASE IF NOT EXISTS test01_office CHARACTER SET 'utf8';

# 使用数据库
USE test01_office;

CREATE TABLE IF NOT EXISTS dept01 (
  id INT(7),
  `NAME` VARCHAR(25)
);

# dept02 与 departments不在一个数据库，则需要指定表的来源
CREATE TABLE dept02
AS
SELECT * FROM testdb.departments;

CREATE TABLE emp01 (
  id INT(7),
  first_name VARCHAR(25),
  last_name VARCHAR(25),
  dept_id INT(7)
);

ALTER TABLE emp01 MODIFY last_name VARCHAR(50);

CREATE TABLE emp02
AS
SELECT * FROM testdb.employees;

DROP TABLE emp01;

RENAME TABLE emp02 TO emp01;
# 或 ALTER TABLE emp02 RENAME TO emp01;

ALTER TABLE dept02 ADD test_column VARCHAR(10);
ALTER TABLE emp01 ADD test_column VARCHAR(10);

ALTER TABLE emp01 DROP department_id;
```
