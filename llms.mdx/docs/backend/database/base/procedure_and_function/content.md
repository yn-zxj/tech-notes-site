# 存储过程与函数 (/docs/backend/database/base/procedure_and_function)

<Callout type="success" title="提示">

MySQL 从 5.0 版本开始支持存储过程和函数。存储过程和函数能够将复杂的 SQL 逻辑封装在一起，应用程序无须关注存储过程和函数内部复杂的 SQL 逻辑，而只需要简单地调用存储过程和函数即可。

</Callout>


## 存储过程概述 [#存储过程概述]

### 理解 [#理解]

**含义**：存储过程(Stored Procedure)，就是一组经过预先编译的 SQL 语句的封装。

**执行过程**：存储过程预先存储在 MySQL 服务器上，需要执行的时候，客户端只需要向服务器端发出调用存储过程的命令，服务器端就可以把预先存储好的这一系列 SQL 语句全部执行。

**好处**：  
&#8195;① 简化操作，提高了 SQL 语句的复用性，减少了开发人员的压力；  
&#8195;② 减少操作过程中的失误，提高效率；  
&#8195;③ 减少网络传输量(客户端不需要把所有的 SQL 语句通过网格发给服务器)；  
&#8195;④ 减少了 SQL 语句暴露在网上的风险，也提高了数据查询的安全性；

**与视图、函数的对比**：  
&#8195;&#8195;它和视图有着同样的优点，清晰、安全，还可以减少网络传输量。不过它和视图不同，视图是<mark>虚拟表</mark>，通常不对底层数据表直接操作，而存储过程是程序化的 SQL，可以<mark>直接操作底层数据表</mark>，相比于面向集合的操作方式，能够实现一些更复杂的数据处理。

&#8195;&#8195;一旦存储过程被创建出来，使用它就像使用函数一样简单，我们直接通过调用存储过程名即可。相较于函数，存储过程是<mark>没有返回值</mark>的。

### 分类 [#分类]

存储过程的参数类型可以是 IN、OUT 和 INOUT。根据这点分类如下：  
① 没有参数（无参数无返回）  
② 仅仅带 IN 类型（有参数无返回）  
③ 仅仅带 OUT 类型（无参数有返回）  
④ 既带 IN 又带 OUT（有参数有返回）  
⑤ 带 INOUT（有参数有返回）

> 注意：IN、OUT、INOUT 都可以在一个存储过程中带多个。

## 存储过程的使用 [#存储过程的使用]

### 语法分析 [#语法分析]

**语法**：

```sql 
CREATE
    [DEFINER = user]
    PROCEDURE sp_name ([proc_parameter[,...]])
    [characteristic ...] routine_body

# 参数说明
proc_parameter:
    [ IN | OUT | INOUT ] param_name type

type:
    Any valid MySQL data type

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | [NOT] DETERMINISTIC
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}

routine_body:
    Valid SQL routine statement
```

---

**说明**：  
(1) 参数名(param_name)前面的符号说明

> `IN`：当前参数为输入参数，也可以叫入参；  
> `OUT`：当前参数为输出参数，也可以叫出参；  
> `INOUT`：当前参数既可以为输入参数，也可以为输出参数；

(2) 形参类型(type)可以是 MySQL 数据类型中的任一类型；

(3) `characteristics`表示创建存储过程时指定的对存储过程的约束条件

> ① `LANGUAGE SQL`：说明存储过程执行体是由 SQL 语句组成的，当前系统支持的语言为 SQL；  
> ② `[NOT] DETERMINISTIC`：指明存储过程执行的结果是否确定。每次执行存储过程，相同的输入会得到相同的输出，则表示结果是确定的(DETERMINISTIC)；反之则是不确定(NOT DETERMINISTIC)，如果没有指定默认为`NOT DETERMINISTIC`；  
> ③ `{ CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }`：指明子程序使用 SQL 语句的限制；默认情况下，系统会指定为`CONTAINS SQL`；
>
> - `CONTAINS SQL`：表示当前存储过程的子程序包含 SQL 语句，但是并不包含读写数据的 SQL 语句；
> - `NO SQL`：表示当前存储过程的子程序中不包含任何 SQL 语句；
> - `READS SQL DATA`：表示当前存储过程的子程序中包含读数据的 SQL 语句；
> - `MODIFIES SQL DATA`：表示当前存储过程的子程序中包含写数据的 SQL 语句。
>
> ④ `SQL SECURITY { DEFINER | INVOKER }`：执行当前存储过程的权限，即指明哪些用户能够执行当前存储过程；如果没有设置相关的值，则 MySQL 默认指定值为`DEFINER`；
>
> - `DEFINER`：表示只有当前存储过程的创建者或者定义者才能执行当前存储过程；
> - `INVOKER`：表示拥有当前存储过程的访问权限的用户能够执行当前存储过程。
>
> ⑤ `COMMENT 'string'`：注释信息，可以用来描述存储过程。

(4) 存储过程体中可以有多条 SQL 语句，如果仅仅一条 SQL 语句，则可以省略 BEGIN 和 END；复杂的可能包含下面内容：

```sql 
BEGIN...END # 中间包含了多个语句，每个语句都以（;）号为结束符
DECLARE # 用来声明变量
SET # 赋值语句，用于对变量进行赋值
SELECT... INTO # 把从数据表中查询的结果存放到变量中，也就是为变量赋值
```

(5) 可能需要设置新的结束标记，因为 MySQL 默认的语句结束符号为分号`;`。为了避免与存储过程中 SQL 语句结束符相冲突，需要使用`DELIMITER`改变存储过程的结束符。

```sql 
DELIMITER 新的结束标记

# 示例
DELIMITER $

CREATE PROCEDURE 存储过程名(IN|OUT|INOUT 参数名 参数类型,...)
[characteristics ...]
BEGIN
  sql语句;
END $

DELIMITER ;
```

---

### 调用存储过程 [#调用存储过程]

**语法**：

```sql 
CALL sp_name([parameter[,...]])
CALL sp_name[()]
```


<Callout type="success" title="如何调试?">

&#8195;&#8195;在 MySQL 中，存储过程不像普通的编程语言（比如 VC++、Java 等）那样有专门的集成开发环境。因此，你可以通过 SELECT 语句，把程序执行的中间结果查询出来，来调试一个 SQL 语句的正确性。调试成功之后，把 SELECT 语句后移到下一个 SQL 语句之后，再调试下一个 SQL 语句。这样<mark>逐步推进</mark>，就可以完成对存储过程中所有操作的调试了。当然，你也可以把存储过程中的 SQL 语句复制出来，逐段单独调试。

</Callout>


### 示例 [#示例]

(1) 创建存储过程 select_all_data()，查看 emps 表的所有数据

```sql 
# 无参无返回
DELIMITER $

CREATE PROCEDURE select_all_data()
  BEGIN
    SELECT * FROM emps;
  END $

DELIMITER ;
```

**调用**：

```sql 
CALL select_all_data();
```

---

(2) 创建存储过程 avg_employee_salary()，返回所有员工的平均工资

```sql 
# 无参无返回
DELIMITER //

CREATE PROCEDURE avg_employee_salary()
  BEGIN
    SELECT AVG(salary) FROM emps;
  END //

DELIMITER ;
```

**调用**：

```sql 
CALL avg_employee_salary();
```

---

(3) 创建存储过程 show_max_salary()，用来查看 emps 表的最高薪资值

```sql 
# 无参无返回
DELIMITER //

CREATE PROCEDURE show_max_salary()
  LANGUAGE SQL
  NOT DETERMINISTIC
  CONTAINS SQL
  SQL SECURITY DEFINER
  COMMENT '查看最高薪资'
  BEGIN
    SELECT MAX(salary) FROM emps;
  END //

DELIMITER ;
```

**调用**：

```sql 
CALL show_max_salary();
```

---

(4) 创建存储过程 show_min_salary()，查看 emps 表的最低薪资值，并将最低薪资通过 OUT 参数 ms 输出

```sql 
# 无参有返回
DELIMITER //

CREATE PROCEDURE show_min_salary(OUT ms DOUBLE)
  BEGIN
    SELECT MIN(salary) INTO ms FROM emps;
  END //

DELIMITER ;
```

**调用**：

```sql 
CALL show_min_salary(@ms);
SELECT @ms;
```

---

(5) 创建存储过程 show_someone_salary()，查看 emps 表的某个员工的薪资，并用 IN 参数 empname 输入员工姓名

```sql 
# 有参无返回
DELIMITER //

CREATE PROCEDURE show_someone_salary(IN empname VARCHAR(20))
  BEGIN
    SELECT salary FROM emps WHERE ename = empname;
  END //

DELIMITER ;
```

**调用**：

```sql 
CALL show_someone_salary('Adel');
# 或
SET @empname = 'Adel';
CALL show_someone_salary(@empname);
```

---

(6) 创建存储过程 show_someone_salary2()，查看 emps 表的某个员工的薪资，并用 IN 参数 empname 输入员工姓名，用 OUT 参数 empsalary 输出员工薪资

```sql 
# 有参有返回
DELIMITER //

CREATE PROCEDURE show_someone_salary2(IN empname VARCHAR(20), OUT empsalary DOUBLE)
  BEGIN
    SELECT salary INTO empsalary FROM emps WHERE ename = empname;
  END //

DELIMITER ;
```

**调用**：

```sql 
CALL show_someone_salary2('Adel', @empsalary);
SELECT @empsalary;
# 或
SET @empname = 'Adel';
CALL show_someone_salary2(@empname, @empsalary);
SELECT @empsalary;
```

---

(7) 创建存储过程 show_mgr_name()，查询某个员工领导的姓名，并用 INOUT 参数 empname 输入员工姓名，输出领导的姓名

```sql 
# 有参有返回
DELIMITER //

CREATE PROCEDURE show_mgr_name(INOUT empname VARCHAR(20))
  BEGIN
    SELECT ename INTO empname
    FROM emps
    WHERE eid = (SELECT mid FROM emps WHERE ename = empname);
  END //

DELIMITER ;
```

**调用**：

```sql 
SET @empname = 'Adel'
CALL show_mgr_name(@empname);
SELECT @empname;
```

## 存储函数的使用 [#存储函数的使用]

### 语法分析 [#语法分析-1]

**语法**：

```sql 
CREATE
    [DEFINER = user]
    FUNCTION sp_name ([func_parameter[,...]])
    RETURNS type
    [characteristic ...] routine_body

# 参数说明
func_parameter:
    param_name type

type:
    Any valid MySQL data type

characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | [NOT] DETERMINISTIC
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}

routine_body:
    Valid SQL routine statement
```

---

**说明**：  
(1) 参数列表：指定参数为`IN`、`OUT`或`INOUT`只对 PROCEDURE 是合法的，FUNCTION 中总是默认为`IN`参数；

(2) `RETURNS type`语句表示函数返回的数据的类型；

> RETURNS 子句只能对 FUNCTION 做指定，对函数而言这是强制的。它用来指定函数的返回类型，而且函数体必须包含一个`RETURN value`语句；

(3) `characteristic`创建函数时指定的对函数的约束。取值与创建存储过程时相同，可以看上面存储过程([2.1 语法分析](/docs/backend/database/base/procedure_and_function#语法分析))的说明；

(4) 函数体也可以用`BEGIN...END`来表示 SQL 代码的开始和结束。如果函数体只有一条语句，也可以省略`BEGIN...END`。

---

### 调用存储函数 [#调用存储函数]

在 MySQL 中，存储函数的使用方法与 MySQL 内部函数的使用方法是一样的。换言之，用户自己定义的存储函数与 MySQL 内部函数是一个性质的。区别在于，存储函数是用户自己定义的，而内部函数是 MySQL 的开发者定义的。

```sql 
SELECT 函数名(实参列表);
```

### 示例 [#示例-1]

(1) 创建存储函数，名称为 email_by_name()，参数定义为空，该函数查询 Abel 的 email，并返回，数据类型为字符串型。

```sql 
DELIMITER //

CREATE FUNCTION email_by_name()
RETURNS VARCHAR(25)
DETERMINISTIC
CONTAINS SQL
BEGIN
  RETURN (SELECT email FROM employees WHERE last_name = 'Abel');
END //

DELIMITER ;
```

**调用**：

```sql 
SELECT email_by_name();
```

---

(2) 创建存储函数，名称为 email_by_id()，参数传入 emp_id，该函数查询 emp_id 的 email，并返回，数据类型为字符串型。

```sql 
DELIMITER //

CREATE FUNCTION email_by_id(emp_id INT)
RETURNS VARCHAR(25)
DETERMINISTIC
CONTAINS SQL
BEGIN
  RETURN (SELECT email FROM employees WHERE employee_id = emp_id);
END //

DELIMITER ;
```

**调用**：

```sql 
SET @emp_id = 102;
SELECT email_by_id(@emp_id);
# 或
SELECT email_by_id(102);
```

---

(3) 创建存储函数 count_by_id()，参数传入 dept_id，该函数查询 dept_id 部门的员工人数，并返回，数据类型为整型。

```sql 
DELIMITER //

CREATE FUNCTION count_by_id(dept_id INT)
RETURNS INT
LANGUAGE SQL
NOT DETERMINISTIC
READS SQL DATA
SQL SECURITY DEFINER
COMMENT '查询部门平均工资'
BEGIN
  RETURN (SELECT COUNT(*) FROM employees WHERE departmant_id = dept_id);
END //

DELIMITER ;
```

**调用**：

```sql 
SET @dept_id = 50 ;
SELECT count_by_id(@dept_id);
# 或
SELECT count_by_id(50);
```


<Callout type="warn" title="注意">

若在创建存储函数中报错`you might want to use the less safe log_bin_trust_function_creators variable`，有两种处理方法：  
**方式一**：加上必要的函数特性`[NOT] DETERMINISTIC`和`{CONTAINS SQL | NO SQL | READS SQL DATA |MODIFIES SQL DATA}`  
**方式二**：

```sql 
SET GLOBAL log_bin_trust_function_creators = 1;
```

</Callout>


## 对比存储函数和存储过程 [#对比存储函数和存储过程]

|          | 关键字      | 调用语法          | 返回值              |
| -------- | ----------- | ----------------- | ------------------- |
| 存储过程 | `PROCEDURE` | `CALL 存储过程()` | 理解为有 0 个或多个 |
| 存储函数 | `FUNCTION`  | `SELECT 函数()`   | 只能是一个          |

> 此外，<mark>存储函数可以放在查询语句中使用，存储过程不行</mark>。反之，存储过程的功能更加强大，包括能够执行对表的操作（比如创建表，删除表等）和事务操作，这些功能是存储函数不具备的。

## 存储过程和函数的查看、修改和删除 [#存储过程和函数的查看修改和删除]

### 查看 [#查看]

(1) `SHOW CREATE`语句查看创建信息

```sql 
SHOW CREATE { PROCEDURE | FUNCTION } proc_name or func_name;

# 例如
SHOW CREATE PROCEDURE show_max_salary;
SHOW CREATE FUNCTION email_by_id;
```

(2) `SHOW STATUS`语句查看状态信息

```sql 
SHOW { PROCEDURE | FUNCTION } STATUS [LIKE 'pattern' | WHERE expr];

# 例如
SHOW PROCEDURE STATUS LIKE 'show%';
SHOW FUNCTION STATUS LIKE 'email_by_id%';
SHOW PROCEDURE STATUS WHERE Name = 'show_max_salary';
SHOW FUNCTION STATUS WHERE Name = 'email_by_id';
```

> 返回子程序的特征，如数据库、名字、类型、创建者及创建和修改日期。

(3) 从`information_schema.Routines`查看

```sql 
SELECT *
FROM information_schema.Routines
WHERE ROUTINE_NAME = 'proc_name or func_name' [AND ROUTINE_TYPE = { 'PROCEDURE | FUNCTION' }];

# 例如
SELECT * FROM information_schema.Routines WHERE ROUTINE_NAME = 'show_max_salary' AND ROUTINE_TYPE = 'PROCEDURE';
SELECT * FROM information_schema.Routines WHERE ROUTINE_NAME = 'email_by_id' AND ROUTINE_TYPE = 'FUNCTION';
```

> MySQL 中存储过程和函数的信息存储在`information_schema`数据库下的`Routines`表中。可以通过查询该表的记录来查询存储过程和函数的信息。

### 修改 [#修改]

```sql 
ALTER { PROCEDURE proc_name | FUNCTION func_name } [characteristic ...]

# 参数说明
characteristic: {
    COMMENT 'string'
  | LANGUAGE SQL
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}
```

> 修改存储过程或函数，不影响存储过程或函数功能，只是修改相关特性。如果需要对其参数和主体进行修改，需要先删除，然后在创建新的。
>
> 🐼 参数说明可以看([2.1 语法分析](/docs/backend/database/base/procedure_and_function#语法分析))中的说明的第三点

---

**示例**：  
(1) 修改存储过程 CountProc 的定义。将读写权限改为`MODIFIES SQL DATA`，并指明定义者可以执行；

```sql 
ALTER PROCEDURE CountProc
MODIFIES SQL DATA
SQL SECURITY DEFINER;
```

(2) 修改存储函数 CountProc 的定义。将读写权限改为`READS SQL DATA`，并加上注释信息`FIND NAME`。

```sql 
ALTER FUNCTION CountProc
READS SQL DATA
COMMENT 'FIND NAME';
```

### 删除 [#删除]

删除存储过程和函数，可以使用`DROP`语句，其语法结构如下：

```sql 
DROP { PROCEDURE | FUNCTION } [IF EXISTS] sp_name;
```

**示例**：

```sql 
DROP PROCEDURE CountProc;
DROP FUNCTION CountProc;
```

## 关于存储过程使用的争议 [#关于存储过程使用的争议]

&#8195;&#8195;尽管存储过程有诸多优点，但是对于存储过程的使用，一直都存在着很多争议，比如有些公司对于大型项目要求使用存储过程，而有些公司在手册中明确禁止使用存储过程，为什么这些公司对存储过程的使用需求差别这么大呢？

### 优点 [#优点]

(1) **存储过程可以一次编译多次使用**  
存储过程只在创建时进行编译，之后的使用都不需要重新编译，这就提升了 SQL 的执行效率。

(2) **可以减少开发工作量**  
将代码封装成模块，实际上是编程的核心思想之一，这样可以把复杂的问题拆解成不同的模块，然后模块之间可以重复使用，在减少开发工作量的同时，还能保证代码的结构清晰。

(3) **存储过程的安全性强**  
我们在设定存储过程的时候可以设置对用户的使用权限，这样就和视图一样具有较强的安全性。

(4) **可以减少网络传输量**  
因为代码封装到存储过程中，每次使用只需要调用存储过程即可，这样就减少了网络传输量。

(5) **良好的封装性**  
在进行相对复杂的数据库操作时，原本需要使用一条一条的 SQL 语句，可能要连接多次数据库才能完成的操作，现在变成了一次存储过程，只需要连接一次即可。

### 缺点 [#缺点]

基于上面这些优点，不少大公司都要求大型项目使用存储过程，比如微软、IBM 等公司。但是国内的阿里并不推荐开发人员使用存储过程，这是为什么呢？

> 阿里开发规范  
> 【强制】禁止使用存储过程，存储过程难以调试和扩展，更没有移植性。

<u>存储过程虽然有诸如上面的好处，但缺点也是很明显</u>：

(1) **可移植性差**  
存储过程不能跨数据库移植，比如在 MySQL、Oracle 和 SQL Server 里编写的存储过程，在换成其他数据库时都需要重新编写。

(2) **调试困难**  
只有少数 DBMS 支持存储过程的调试。对于复杂的存储过程来说，开发和维护都不容易。虽然也有一些第三方工具可以对存储过程进行调试，但要收费。

(3) **存储过程的版本管理很困难**  
比如数据表索引发生变化了，可能会导致存储过程失效。我们在开发软件的时候往往需要进行版本管理，但是存储过程本身没有版本控制，版本迭代更新的时候很麻烦。

(4) **它不适合高并发的场景**  
高并发的场景需要减少数据库的压力，有时数据库会采用分库分表的方式，而且对可扩展性要求很高，在这种情况下，存储过程会变得难以维护，增加数据库的压力，显然就不适用了。


<Callout type="success" title="小结">

存储过程虽然方便，但也有一定的局限性。尽管不同的公司对存储过程的态度不一，但是对于我们开发人员来说，不论怎样，掌握存储过程都是必备的技能之一。

</Callout>
