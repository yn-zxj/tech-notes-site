# 约束 (/docs/backend/database/base/constraint)

## 约束(constraint)概述 [#约束constraint概述]

### 为什么需要约束 [#为什么需要约束]

&#8195;&#8195;数据完整性(Data Integrity)是指数据的精确性(Accuracy)和可靠性(Reliability)。它是<mark>防止数据库中存在不符合语义规定的数据</mark>和<mark>防止因错误信息的输入输出造成无效操作和错误信息</mark>而提出的。

为了保证数据的完整性，SQL 规范以约束的方式对表数据进行额外的条件限制。从下面四个方面考虑：  
① `实体完整性(Entity Integrity)`：例如，同一个表中，不能存在两条完全相同无法区分的记录  
② `域完整性(Domain Integrity)`：例如：年龄范围 0-120，性别范围"男/女"  
③ `引用完整性(Referential Integrity)`：例如：员工所在部门，在部门表中要能找到这个部门  
④ `用户自定义完整性(User-defined Integrity)`：例如：用户名唯一、密码不能为空等

### 什么叫约束? [#什么叫约束]

&#8195;&#8195;约束简单来说就是对表中字段的限制，约束可以在创建表时通过`CREATE TABLE`语句，或者在表创建之后通过`ALTER TABLE`语句定义。

### 约束的分类 [#约束的分类]

**角度一**：数据列的限制  
单列约束 ：每个约束只约束一列  
多列约束 ：每个约束可约束多列数据

**角度二**：作用范围  
列级约束 ：只能作用在一个列上，跟在列的定义后面  
表级约束 ：可以作用在多个列上，不与列一起，而是单独定义

**角度三**：功能作用

| 约束          | 说明                                     |
| ------------- | ---------------------------------------- |
| `NOT NULL`    | 非空约束，规定某个字段不能为空           |
| `UNIQUE`      | 唯一约束，规定某个字段在整个表中是唯一的 |
| `PRIMARY KEY` | 主键(非空且唯一)约束                     |
| `FOREIGN KEY` | 外键约束                                 |
| `CHECK`       | 检查约束                                 |
| `DEFAULT`     | 默认值约束                               |

> 注意： MySQL 不支持 CHECK 约束，但可以使用 CHECK 约束，而没有任何效果

查看某个表已有的约束：

```sql 
# information_schema数据库名（系统库）
# table_constraints表名称（专门存储各个表的约束）
SELECT * FROM information_schema.table_constraints WHERE table_name = '表名称';
```

创建表时定义约束的语法：

```sql 
CREATE TABLE [schema.]table_name (
  col1 type1 [DEFAULT1] [col1_constraint],
  col2 type2 [DEFAULT2] [col2_constraint],
  ...
  [table_constraint]
);
```

## 非空约束 [#非空约束]

**作用**：限制某个字段/某列的值不允许为空  
**关键字**：`NOT NULL`  
**特点**：  
&#8195;① 默认，所有的类型的值都可以是`NULL`，包括`INT`、`FLOAT`等数据类型  
&#8195;② 非空约束只能出现在表对象的列上，只能某个列单独限定非空，不能组合非空  
&#8195;③ 一个表可以有很多列都分别限定了非空  
&#8195;④ 空字符串`''`不等于`NULL`， 0 也不等于`NULL`

### 添加非空约束 [#添加非空约束]

**建表时**：

```sql 
CREATE TABLE 表名称 (
  字段名 数据类型,
  字段名 数据类型 NOT NULL,
  字段名 数据类型 NOT NULL
);

# 建表并设置sname和card_id为非空
CREATE TABLE student (
  sid INT,
  sname VARCHAR (20) NOT NULL,
  tel CHAR (11),
  card_id CHAR (18) NOT NULL
);

# sname 不能为空
mysql> INSERT INTO student values (1,null,'123456','12321');
ERROR 1048 (23000): Column 'sname' cannot be null

# 修改后入库
mysql> INSERT INTO student values (1,'LiHua','123456','12321');
```

**建表后**：

```sql 
ALTER TABLE 表名称 MODIFY 字段名 数据类型 NOT NULL;

# 设置sname为非空
ALTER TABLE student MODIFY sname VARCHAR(20) NOT NULL;
```

### 删除非空约束 [#删除非空约束]

```sql 
-- 去掉NOT
ALTER TABLE 表名称 MODIFY 字段名 数据类型 NULL;
-- 去掉NOT NULL
ALTER TABLE 表名称 MODIFY 字段名 数据类型;

ALTER TABLE student MODIFY sname VARCHAR(20) NULL;
ALTER TABLE student MODIFY sname VARCHAR(20);
```

## 唯一性约束 [#唯一性约束]

**作用**：限制某个字段/某列的值不能重复  
**关键字**：`UNIQUE`  
**特点**：  
&#8195;① 同一个表可以有多个唯一约束  
&#8195;② 唯一约束可以是某一个列，也可以是多个列组合的值唯一  
&#8195;③ 唯一约束允许列值为空  
&#8195;④ 在创建唯一约束的时候，如果不给唯一约束命名，就默认和列名相同  
&#8195;⑤ Mysql 会给唯一约束的列默认创建一个唯一索引

### 添加唯一索引 [#添加唯一索引]

**建表时**：

```sql {4,5,12,13} 
# 列级约束
CREATE TABLE 表名称 (
  字段名 数据类型,
  字段名 数据类型 UNIQUE, # 不带KEY
  字段名 数据类型 UNIQUE KEY # 带KEY
);

# 表级约束
CREATE TABLE 表名称 (
  字段名 数据类型,
  字段名 数据类型,
  [constraint 约束名] UNIQUE [KEY] (字段名), # 约束名放前
  [constraint] UNIQUE [KEY] 约束名 (字段名) # 约束名放后
);
```

**示例**：

```sql {4,7,18,19} 
# 列级约束
# 约束名和列名相同
CREATE TABLE student (
  sid INT UNIQUE, # 省略关键字KEY
  sname VARCHAR (20),
  tel CHAR (11),
  card_id CHAR (18) UNIQUE KEY # 包含关键字KEY
);

# 表级约束
# constraint 可以省略
# 约束名可指定
CREATE TABLE student (
  sid INT,
  sname VARCHAR (20),
  tel CHAR (11),
  card_id CHAR (18),
  CONSTRAINT UNIQUE KEY `u_sid` (`sid`),
  UNIQUE (`card_id`) # 省略constraint、约束名及KEY这个关键字
);

# 表结构查看
mysql> desc student;
+---------+-------------+------+-----+---------+-------+
| Field   | Type        | Null | Key | Default | Extra |
+---------+-------------+------+-----+---------+-------+
| sid     | int(11)     | YES  | UNI | NULL    |       |
| sname   | varchar(20) | YES  |     | NULL    |       |
| tel     | char(11)    | YES  |     | NULL    |       |
| card_id | char(18)    | YES  | UNI | NULL    |       |
+---------+-------------+------+-----+---------+-------+
4 rows in set (0.00 sec)

# 建表语句查看
show create table student;
```

---

**建表后**：

```sql 
# 方式一：可以自定义约束名
ALTER TABLE 表名称 ADD [CONSTRAINT 约束名] UNIQUE [KEY] (字段列表);

# 方式二
ALTER TABLE 表名称 MODIFY 字段名 字段类型 UNIQUE;
```

**示例**：

```sql 
CREATE TABLE student (
  sid INT,
  sname VARCHAR (20),
  tel CHAR (11),
  card_id CHAR (18)
);

# 给字段s_id创建约束，并定义约束名为u_sid
ALTER TABLE student ADD CONSTRAINT u_sid UNIQUE (sid);

# 给字段card_id创建约束，约束名默认为列名
ALTER TABLE student MODIFY card_id INT UNIQUE;
```

### 复合唯一约束 [#复合唯一约束]

```sql 
# 建表时
CREATE TABLE 表名称 (
  字段名 数据类型,
  字段名 数据类型,
  [constraint 约束名] UNIQUE [KEY] (字段列表), # 约束名放前
  [constraint] UNIQUE [KEY] 约束名 (字段列表) # 约束名放后
);

CREATE TABLE student (
  sid INT,
  sname VARCHAR (20),
  tel CHAR (11),
  card_id CHAR (18),
  UNIQUE (`sid`,`card_id`)
);


# 建表后
ALTER TABLE 表名称 ADD [CONSTRAINT 约束名] UNIQUE [KEY] (字段列表);
```

### 删除唯一约束 [#删除唯一约束]

① 添加唯一约束的列会自动创建唯一索引  
② 唯一约束只能通过删除唯一索引的方式删除  
③ 删除时需要指定索引名，唯一索引名就和唯一约束名一样  
④ 如果创建唯一索引未指定名称，如果是单列，默认就和列名相同；如果是组合列，那么默认和括号`()`中排在第一个的列名相同，也可以自定义唯一约束的约束名

```sql 
# 方式一
ALTER TABLE 表名 DROP INDEX 索引名;

# 方式二
DROP INDEX 索引名 ON 表名;

# 查看表索引
show index from student;

# 删除索引
ALTER TABLE student DROP INDEX u_sid;
# 或
DROP INDEX u_sid ON student;
```

## PRIMARY KEY 约束 [#primary-key-约束]

**作用**：唯一标识表中的一行记录  
**关键字**：`PRIMARY KEY`  
**特点**：  
&#8195;① 主键约束相当于`唯一约束 + 非空约束`的组合，主键约束列不允许重复，也不允许出现空值  
&#8195;② 一个表最多只能有一个主键约束，建立主键约束可以在列级别创建，也可以在表级别上创建  
&#8195;③ 主键约束对应着表中的一列或者多列（复合主键）  
&#8195;④ 如果是多列组合的复合主键约束，那么这些列都不允许为空值，并且组合的值不允许重复  
&#8195;⑤ <mark>MySQL 的主键名总是 PRIMARY ，就算自己命名了主键约束名也没用</mark>  
&#8195;⑥ 当创建主键约束时，系统默认会在所在的列或列组合上建立对应的`主键索引`；如果删除主键约束，主键索引就会一起被删除


<Callout type="warn" title="注意">

主键是数据记录的唯一标识，如果修改了主键的值，就有可能会破坏数据的完整性。

</Callout>


### 添加主键约束 [#添加主键约束]

**建表时**：

```sql 
# 列级约束
CREATE TABLE 表名称 (
  字段名 数据类型,
  字段名 数据类型 PRIMARY KEY,
  字段名 数据类型
);

# 表级约束
CREATE TABLE 表名称 (
  字段名 数据类型,
  字段名 数据类型,
  [constraint] PRIMARY KEY(字段名)
);
```

**示例**：

```sql 
# 列级约束
CREATE TABLE student (
  sid INT PRIMARY KEY,
  sname VARCHAR (20),
  tel CHAR (11),
  card_id CHAR (18)
);

# 表级约束
CREATE TABLE student (
  sid INT,
  sname VARCHAR (20),
  tel CHAR (11),
  card_id CHAR (18),
  PRIMARY KEY(sid)
);

mysql> desc student;
+---------+-------------+------+-----+---------+-------+
| Field   | Type        | Null | Key | Default | Extra |
+---------+-------------+------+-----+---------+-------+
| sid     | int(11)     | NO   | PRI | NULL    |       |
| sname   | varchar(20) | YES  |     | NULL    |       |
| tel     | char(11)    | YES  |     | NULL    |       |
| card_id | char(18)    | YES  |     | NULL    |       |
+---------+-------------+------+-----+---------+-------+
4 rows in set (0.00 sec)
```

---

**建表后**：

```sql 
ALTER TABLE 表名称 ADD PRIMARY KEY(字段列表);
```

**示例**：

```sql 
CREATE TABLE student (
  sid INT,
  sname VARCHAR (20),
  tel CHAR (11),
  card_id CHAR (18)
);

# 将字段sid设置为主键
ALTER TABLE student ADD PRIMARY KEY(sid);
```

### 复合主键约束 [#复合主键约束]

```sql 
# 建表时
CREATE TABLE 表名称 (
  字段名 数据类型,
  字段名 数据类型,
  [constraint] PRIMARY KEY(字段列表)
);

# 建表后
ALTER TABLE 表名称 ADD PRIMARY KEY(字段列表);
```

### 删除主键约束 [#删除主键约束]

```sql 
ALTER TABLE 表名称 DROP PRIMARY KEY;

# 删除student表的主键
ALTER TABLE student DROP PRIMARY KEY;
```

## 自增列 [#自增列]

**作用**：某个字段的值自增  
**关键字**：`AUTO_INCREMENT`  
**特点**：  
&#8195;① 一个表最多只能有一个自增长(zhǎng)列  
&#8195;② 当需要产生唯一标识符或顺序值时，可设置自增长  
&#8195;③ 自增长列约束的列必须是键列 <mark>(主键列，唯一键列)</mark>  
&#8195;④ <mark>自增约束的列的数据类型必须是整数类型</mark>  
&#8195;⑤ 如果自增列指定了 0 和 null，会在当前最大值的基础上自增；如果自增列手动指定了具体值，直接赋值为具体值

### 添加自增列 [#添加自增列]

**建表时**：

```sql 
# 数据类型必须是整数类型
CREATE TABLE 表名称 (
  字段名 数据类型 PRIMARY KEY AUTO_INCREMENT,
  字段名 数据类型,
  ...
);

CREATE TABLE 表名称 (
  字段名 数据类型 UNIQUE KEY AUTO_INCREMENT,
  字段名 数据类型,
  ...
);
```

---

**建表后**：

```sql 
ALTER TABLE 表名称 MODIFY 字段名 数据类型 AUTO_INCREMENT;
```

### 删除自增列 [#删除自增列]

```sql 
# 去掉AUTO_INCREMENT
ALTER TABLE 表名称 MODIFY 字段名 数据类型;
```

### MySQL 8.0 新特性—自增变量的持久化 [#mysql-80-新特性自增变量的持久化]

&#8195;&#8195;在 MySQL 8.0 之前，自增主键`AUTO_INCREMENT`的值如果大于`max(primary key) + 1`，在 MySQL 重启后，会重置`AUTO_INCREMENT = max(primary key) + 1`，这种现象在某些情况下会导致业务主键冲突或者其他难以发现的问题。

在 MySQL 5.7 中测试如下：

1️⃣ 建表

```sql 
CREATE TABLE test_auto_increment(
  id INT PRIMARY KEY AUTO_INCREMENT
);
```

2️⃣ 插入 4 个空值

```sql 
INSERT INTO test_auto_increment VALUES(0),(0),(0),(0);
```

3️⃣ 查询数据

```sql 
mysql> select * from test_auto_increment;
+----+
| id |
+----+
| 1 |
| 2 |
| 3 |
| 4 |
+----+
4 rows in set (0.00 sec)
```

4️⃣ 删除 id 为 4 的记录，并继续插入一个空值

```sql 
DELETE FROM test_auto_increment WHERE id = 4;
INSERT INTO test_auto_increment VALUES(0);
```

5️⃣ 此时表中数据如下，id 为 4 的记录在上一步被删除了，再次插入并没有重用删除的 4，而是重新分配了 5

```sql 
mysql> select * from test_auto_increment;
+----+
| id |
+----+
|  1 |
|  2 |
|  3 |
|  5 |
+----+
4 rows in set (0.00 sec)
```

6️⃣ 删除 id 为 5 的记录，并<mark>重启数据库</mark>，随后插入一个空值

```sql 
DELETE FROM test_auto_increment WHERE id = 5;
INSERT INTO test_auto_increment VALUES(0);
```

7️⃣ 查询当前数据库中的数据

```sql 
mysql> select * from test_auto_increment;
+----+
| id |
+----+
|  1 |
|  2 |
|  3 |
|  4 |
+----+
4 rows in set (0.00 sec)
```

&#8195;&#8195;从结果中看出新插入的记录分配了 4，而根据前面分析的结论应该为 6。出现上述结果的主要原因是<mark>自增主键没有持久化</mark>。 在 MySQL 5.7 系统中，对于自增主键的分配规则，是由 InnoDB 数据字典内部一个`计数器`来决定的，而<mark>该计数器只在内存中维护，并不会持久化到磁盘中</mark>。当数据库重启时，该计数器会被初始化。

&#8195;&#8195;我们在 MySQL 8.0 中重复上面的步骤，最后一步的结果如下：

```sql 
mysql> select * from test_auto_increment;
+----+
| id |
+----+
|  1 |
|  2 |
|  3 |
|  6 |
+----+
4 rows in set (0.00 sec)
```

&#8195;&#8195;从结果来看说明自增变量做了持久化。MySQL 8.0 将自增主键的计数器持久化到`重做日志(Redo Log)`中。每次计数器发生改变，都会将其写入重做日志中。如果数据库重启，InnoDB 会根据重做日志中的信息来初始化计数器的内存值。

## FOREIGN KEY 约束 [#foreign-key-约束]

**作用**：限定某个表的某个字段的引用完整性  
**关键字**：`FOREIGN KEY`  
**特点**：  
&#8195;① 从表的外键列，必须引用/参考主表的主键或唯一约束的列(因为被依赖/参考的值必须是唯一的)  
&#8195;② 在创建外键约束时，如果不给外键约束命名，默认名不是列名，而是自动产生一个外键名，此外也可以自行指定  
&#8195;③ 创建表时就指定外键约束的话，先创建主表，再创建从表  
&#8195;④ 删除表时，先删除从表(或先删除外键约束)，再删除主表  
&#8195;⑤ 当主表的记录被从表参照时，主表的记录将不允许删除；如果要删除数据，需要先删除从表中的依赖该记录的数据，接着再删除主表的记录  
&#8195;⑥ 在"从表"中指定外键约束，并且一个表可以有多个外键约束  
&#8195;⑦ 从表的外键列和主表被参照的列名字可以不相同，但是<mark>数据类型必须一致</mark>。如果不一致，创建从表时出现`ERROR 1005 (HY000): Can't create table 'database.tablename'(errno: 150)`错误  
&#8195;⑧ 当创建外键约束时，系统默认会在所在的列上建立对应的普通索引，但是索引名是外键的约束名  
&#8195;⑨ 删除外键约束后，必须手动删除对应的索引


<Callout type="success" title="主表和从表 / 父表和子表">

主表(父表)：被引用的表，被参考的表  
从表(子表)：引用别人的表，参考别人的表

</Callout>


### 添加外键约束 [#添加外键约束]

**建表时**：

```sql 
CREATE TABLE 主表名(
  字段1 字段类型 PRIMARY KEY,
  字段2 字段类型
  ...
);

CREATE TABLE 从表名(
  字段1 数据类型,
  字段2 数据类型,
  ...
  [CONSTRAINT 外键约束名] FOREIGN KEY (从表某个字段) REFERENCES 主表名(被参考字段)
);
```

**示例**：

```sql 
CREATE TABLE dept (
  did INT PRIMARY KEY,
  dname VARCHAR(50)
);

CREATE TABLE empt (
  eid INT PRIMARY KEY,
  ename VARCHAR(10),
  edept_id INT,
  FOREIGN KEY (edept_id) REFERENCES dept(did)
);

# 说明
-- 主表需要先创建成功，才能创建从表并建立外键约束
-- 删除表时，先删除从表，在删除主表
```

---

**建表后**：

```sql 
ALTER TABLE 从表名
ADD [CONSTRAINT 外键约束名] FOREIGN KEY (从表某个字段) REFERENCES 主表名(被参考字段)
[ON DELETE reference_option] # 设置约束等级，下面有提到
[ON UPDATE reference_option];

# 例如(假设主表与从表同上面一样，但是从表创建时未建立外键约束)
ALTER TABLE empt ADD FOREIGN KEY (edept_id) REFERENCES dept(did);
```

### 约束等级 [#约束等级]

`CASCADE`：在父表上 update/delete 记录时，同步 update/delete 掉子表的匹配记录

`SET NULL`：在父表上 update/delete 记录时，将子表上匹配记录的列设为 null，但是要注意子表的外键列不能为 not null

`NO ACTION`：如果子表中有匹配的记录，则不允许对父表对应候选键进行 update/delete 操作

`RESTRICT`：同`NO ACTION`， 都是立即检查外键约束

`SET DEFAULT`：父表有变更时，子表将外键列设置成一个默认的值，但 Innodb 不能识别

> 如果没有指定等级，就相当于`RESTRICT`方式，建议使用下面搭配：`ON UPDATE CASCADE ON DELETE RESTRICT`

```sql 
[CONSTRAINT [symbol]] FOREIGN KEY
  [index_name] (col_name, ...)
  REFERENCES tbl_name (col_name,...)
  [ON DELETE reference_option]
  [ON UPDATE reference_option]

reference_option:
  RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT

# 例如
CREATE TABLE dept (
  did INT PRIMARY KEY,
  dname VARCHAR(50)
);

CREATE TABLE empt (
  eid INT PRIMARY KEY,
  ename VARCHAR(10),
  edept_id INT,
  FOREIGN KEY (edept_id) REFERENCES dept(did) ON UPDATE CASCADE ON DELETE RESTRICT
);
```

### 删除外键约束 [#删除外键约束]

```sql 
-- 删除外键约束
# 查询外键约束名
SELECT * FROM information_schema.table_constraints WHERE table_name = '表名称';
# 删除外键约束
ALTER TABLE 表名称(从表) DROP FOREIGN KEY 外键约束名;

-- 删除索引(手动)
# 查看索引
SHOW INDEX FROM 表名称(从表);
# 删除索引
ALTER TABLE 表名称(从表) DROP INDEX 索引名
```


<Callout type="success" title="开发场景">

(1) 如果两个表之间有关系（一对一、一对多），比如：员工表和部门表（一对多），它们之间是否一定要建外键约束？（答：不是）

(2) 建和不建外键约束有什么区别？

- 建外键约束，你的操作（创建表、删除表、添加、修改、删除）会受到限制，从语法层面受到限制。例如：在员工表中不可能添加一个员工信息，它的部门的值在部门表中找不到。
- 不建外键约束，你的操作（创建表、删除表、添加、修改、删除）不受限制，要保证数据的引用完整性，只能依靠程序员的自觉，或者是在 Java 程序中进行限定。例如：在员工表中，可以添加一个员工的信息，它的部门指定为一个完全不存在的部门。

(3) 那么建和不建外键约束和查询有没有关系？（答：没有）

> 在 MySQL 里，外键约束是有成本的，需要消耗系统资源。对于大并发的 SQL 操作，有可能会不适合。比如大型网站的中央数据库，可能会<mark>因为外键约束的系统开销而变得非常慢</mark>。所以， MySQL 允许你不使用系统自带的外键约束，在应用层面完成检查数据一致性的逻辑。也就是说，即使你不用外键约束，也要想办法通过应用层面的附加逻辑，来实现外键约束的功能，确保数据的一致性。

</Callout>


> 阿里规范：  
> 【<mark>强制</mark>】不得使用外键与级联，一切外键概念必须在应用层解决。  
> 说明：（概念解释）学生表中的 student_id 是主键，那么成绩表中的 student_id 则为外键。如果更新学生表中的 student_id，同时触发成绩表中的 student_id 更新，即为级联更新。外键与级联更新适用于单机低并发，不适合分布式、高并发集群；级联更新是强阻塞，存在数据库更新风暴的风险；外键影响数据库的插入速度。

## CHECK 约束 [#check-约束]

**作用**：检查某个字段的值是否符合要求  
**关键字**：`CHECK`


<Callout type="warn" title="注意">

在 MySQL 8.0.16 之前，CREATE TABLE 只允许以下有限版本的表 CHECK 约束语法，该语法被解析和忽略：`CHECK(exp)`，从 MySQL 8.0.16 支持`[CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]`  
简单来说：MySQL 5.7 可以用 CHECK 但是没任何作用，而在 MySQL 8.0 后开始支持

</Callout>


```sql 
CREATE TABLE t1
(
  CHECK (c1 <> c2),
  c1 INT CHECK (c1 > 10),
  c2 INT CONSTRAINT c2_positive CHECK (c2 > 0),
  c3 INT CHECK (c3 < 100),
  CONSTRAINT c1_nonzero CHECK (c1 <> 0),
  CHECK (c1 > c3)
);
```

## DEFAULT 约束 [#default-约束]

**作用**：为列设置默认值，如果没有指定其它值，默认值将添加到所有新记录中  
**关键字**：`DEFAULT`

### 给字段设置默认值 [#给字段设置默认值]

**建表时**：

```sql 
CREATE TABLE 表名称 (
  字段名 数据类型 DEFAULT 默认值,
  字段名 数据类型,
  ...
);
```

**示例**：

```sql {6} 
CREATE TABLE student (
  sid INT,
  sname VARCHAR (20),
  tel CHAR (11),
  card_id CHAR (18),
  city VARCHAR (50) DEFAULT 'ShenZhen'
);

# 未给city设置值
INSERT INTO student (sid,sname,tel,card_id) VALUES (1,'LiHua','17589000','10001');
# 使用默认值
mysql> SELECT * FROM student;
+-----+-------+----------+---------+----------+
| sid | sname | tel      | card_id | city     |
+-----+-------+----------+---------+----------+
|   1 | LiHua | 17589000 | 10001   | ShenZhen |
+-----+-------+----------+---------+----------+
1 row in set (0.04 sec)
```

---

**建表后**：

```sql 
# 方式一：推荐
ALTER TABLE 表名称 MODIFY 字段名 数据类型 DEFAULT 默认值;
# 方式二
ALTER TABLE 表名称 ALTER 字段名 SET DEFAULT 默认值;
# 方式三
ALTER TABLE 表名称 CHANGE COLUMN 字段名 字段名 数据类型 DEFAULT 默认值;
```

**示例**：

```sql {6} 
ALTER TABLE student MODIFY sname VARCHAR(20) DEFAULT 'Sandnes';
ALTER TABLE student ALTER sname SET DEFAULT 'Sandnes';
ALTER TABLE student CHANGE COLUMN sname sname VARCHAR(20) DEFAULT 'Sandnes';
```

### 删除字段默认值 [#删除字段默认值]

```sql 
# 方式一：推荐
ALTER TABLE 表名称 MODIFY 字段名 数据类型;
# 方式二
ALTER TABLE 表名称 ALTER 字段名 DROP DEFAULT;
# 方式三
ALTER TABLE 表名称 CHANGE COLUMN 字段名 字段名 数据类型 DEFAULT NULL;
```

**示例**：

```sql {6} 
ALTER TABLE student MODIFY sname VARCHAR(20);
ALTER TABLE student ALTER sname DROP DEFAULT;
ALTER TABLE student CHANGE COLUMN sname sname VARCHAR(20) DEFAULT NULL;
```

## 面试题 [#面试题]

### 为什么建表时，加`NOT NULL DEFAULT '' 或 DEFAULT 0` [#为什么建表时加not-null-default--或-default-0]

不想让表中出现`null`值

### 为什么不想要`null`的值 [#为什么不想要null的值]

① 不好比较。`null`是一种特殊值，比较时只能用专门的`is null`和`is not null`来比较。碰到运算符，通常返回`null`。  
② 效率不高。影响提高索引效果。因此，我们往往在建表时`not null default '' 或 default 0`

### 带`AUTO_INCREMENT`约束的字段值是从 1 开始的吗? [#带auto_increment约束的字段值是从-1-开始的吗]

&#8195;&#8195;在 MySQL 中，默认 AUTO_INCREMENT 的初始值是 1 ，每新增一条记录，字段值自动加 1 。设置自增属性（AUTO_INCREMENT）的时候，还可以指定第一条插入记录的自增字段的值，这样新插入的记录的自增字段值从初始值开始递增，如在表中插入第一条记录，同时指定 id 值为 5 ，则以后插入的记录的 id 值就会从 6 开始往上增加。添加主键约束时，往往需要设置字段自动增加属性。

### 为什么说并不是每个表都可以任意选择存储引擎? [#为什么说并不是每个表都可以任意选择存储引擎]

&#8195;&#8195;外键约束（FOREIGN KEY）不能跨引擎使用。  
&#8195;&#8195;MySQL 支持多种存储引擎，每一个表都可以指定一个不同的存储引擎，需要注意的是：<mark>外键约束是用来保证数据的参照完整性的，如果表之间需要关联外键，却指定了不同的存储引擎，那么这些表之间是不能创建外键约束的</mark>。所以说，存储引擎的选择也不完全是随意的。
