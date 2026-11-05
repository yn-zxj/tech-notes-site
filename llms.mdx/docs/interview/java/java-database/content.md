# 数据库 (/docs/interview/java/java-database)

## 数据库 [#数据库]

### oracle 数据库的端口号、mysql 端口、sqlserver 端口? [#oracle-数据库的端口号mysql-端口sqlserver-端口]

```txt 
Oracle:1521   Mysql:3306   Sqlserver:1433
```

### 解释一下:DQL、DML、DDL、DCL、TCL [#解释一下dqldmlddldcltcl]

```txt 
DQL: Date Query Language--数据查询语言(SELECT)
DML: Data Manipulation Language--数据操作语言(INSERT、DELETE、UPDATE)
DDL: Data Definition Language--数据定义语言(CREATE、ALTER、DROP)
DCL: Data Control Language--数据控制语言(GRANT、INVOKE)
TCL: Transition Control Language--事务控制语言(COMMIT、ROLLBACK、SAVEPOINT)
```

### Oracle 数据分页? [#oracle-数据分页]

```sql 
Oracle分页首先要解决三个问题:①解决排序;②解决生成伪列;③解决获取某一页数据;

分页:数据库得到两个参数:pageindex(当前页)，pagesize(每页记录数)
select * from
 (select e.*，rownum rn from  # 生成伪列
  (select * from emp order by empno asc) e )  # 解决排序--得到一个结果集
where rn between startposition and endposition

startposition = (pageindex - 1) * pagesize + 1
endposition = pagesize * pageindex
```

### mysql 分页 SQL? [#mysql-分页-sql]

```sql 
Mysql分页: select * from emp limit startindex, pagesize

startindex =  (pageindex - 1) * pagesize
```

### 什么是事务? [#什么是事务]


<Callout type="success" title="提示">

事务是一个工作单元，可以封装一系列操作，事务要求此系列操作要么都成功，要么都失败;事务执行完后，是不能回滚的;

</Callout>


### 事务的特性 [#事务的特性]

```txt 
原子性: 系列操作是不能分割的
一致性: 事务操作后数据必须操作一致
隔离性: 事务的操作不受其它事务影响
持久性: 事务一旦完成，将持久写入数据
```

### 什么是视图? [#什么是视图]

```txt 
视图:基于源表查询得到的结果，视图是不存放数据的(数据存在源表中) -- 虚拟表
```

### 什么是索引? 如何创建索引? [#什么是索引-如何创建索引]


<Callout type="success" title="提示">

索引服务于查询，索引是数据库的一个对象，索引对象类似图书目录;当对象创建索引后，在查询时，数据库会自动使用索引;当对表数据进行增删改，数据库会自动维护索引;

```sql 
CREATE INDEX <index_name> ON <table_name>(字段 [ASC|DESC]);
```

</Callout>


### 过程与函数的区别? [#过程与函数的区别]

| 函数                                                         | 过程                                          |
| ------------------------------------------------------------ | --------------------------------------------- |
| 一般用于计算数据                                             | 完成特定的任务                                |
| 声明为 FUNCTION                                              | 声明为 PROCEDURE /prəˈsiːdʒə(r)/              |
| 需要描述返回类型，且 PL/SQL 块中至少有一个有效的 RETURN 语句 | 无返回类型，可通过 OUT、IN OUT 参数返回多个值 |
| 不能独立运行，必须作为表达式的一部分                         | 可作为一个独立的 PL/SQL 语句运行              |
| 在 DML 和 DQL 中调用函数                                     | 在 DML 和 DQL 中不可调用过程                  |

### Oracle 数据库中的约束有哪些? [#oracle-数据库中的约束有哪些]

```txt 
主键约束(primay):一般建表是需要添加主键约束的(主键是确定表数据的唯一标识) -- 主键约束要求:非空 + 唯一
非空约束(NOT NULL):值不能为空
检查约束(check):验证属性值的有效性
外键约束(foreign):表中的属性值关联外部表的某一个属性值
唯一约束(unique):值不重复(可以为空值，但只能有一个空值)
```

### union 与 union all 的区别? [#union-与-union-all-的区别]

```txt 
union对多个查询的结果如果存在相同数据，union会合并相同的结果
union all 会显示所有数据，所以union all 效率要高于union
```

### 比较 truncate 和 delete 命令 ? [#比较-truncate-和-delete-命令-]

```txt 
(1)truncate在各种表上无论是大的还是小的都非常快。如果有rollback命令delete将被撤销，而truncate则不会被撤销;
(2)truncate是一个DDL(Data Definition Language，数据定义语言)语言，而delete是一个DML(Data Manipulation Language，数据操作语言)语言，向其他所有的DDL语言一样，他将被隐式提交，不能对truncate使用rollback命令;
(3)用法上:DELETE FROM table [WHERE...]      |      TRUNCATE table
(4)truncate不能触发触发器，delete会触发触发器
```
