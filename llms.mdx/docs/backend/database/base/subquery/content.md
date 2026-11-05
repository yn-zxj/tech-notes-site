# 子查询 (/docs/backend/database/base/subquery)

## 子查询 [#子查询]

### 子查询的基本使用 [#子查询的基本使用]

**基本语法结构**:

```sql 
SELECT select_list
FROM table
WHERE expr operator (SELECT select_list FROM table);
```

> 子查询(内查询)在主查询之前一次执行完成  
> 子查询的结果被主查询(外查询)使用


<Callout type="warn" title="注意">

(1) 子查询要包含在括号内  
(2) 将子查询放在比较条件的右侧  
(3) 单行操作符对应单行子查询，多行操作符对应多行子查询

</Callout>


### 子查询的分类 [#子查询的分类]

**分类一**：  
按内查询的<mark>结果返回一条还是多条记录</mark>，将子查询分为<mark>单行子查询</mark>、<mark>多行子查询</mark>。

**分类二**：  
按内查询<mark>是否被执行多次</mark>，将子查询划分为<mark>相关(或关联)子查询</mark>和<mark>不相关(或非关联)子查询</mark>。

## 单行子查询 [#单行子查询]


<Callout type="success" title="提示">

单行比较操作符：`=、>、>=、<、<=、<>`

</Callout>


**查询示例**：

```sql {4,9-10,15} 
# 题目一：查询工资大于149号员工工资的员工信息
SELECT *
FROM employees
WHERE salary > (SELECT salary FROM employees WHERE employee_id = '149');

# 题目二：返回job_id与员工141号员工相同，salary比143号员工多的员工姓名、job_id和工资
SELECT last_name, job_id, salary
FROM employees
WHERE job_id = (SELECT job_id FROM employees WHERE employee_id = '141')
AND salary > (SELECT salary FROM employees WHERE employee_id = '143');

# 题目三：返回公司工资最少的员工的员工的last_name、job_id和salary
SELECT last_name, job_id, salary
FROM employees
WHERE salary = (SELECT MIN(salary) FROM employees);
```

```sql {9-10,16} 
/*
题目四：查询与141号或174号员工的manager_id和
department_id相同的其他员工的employee_id、manager_id、department_id
*/

# 不成对比较
SELECT employee_id, manager_id, department_id
FROM employees
WHERE manager_id IN (SELECT manager_id FROM employees WHERE employee_id IN (141, 174))
AND department_id IN (SELECT department_id FROM employees WHERE employee_id IN (141, 174))
AND employee_id NOT IN (141, 171);

# 成对比较
SELECT employee_id, manager_id, department_id
FROM employees
WHERE (manager_id, department_id) IN (SELECT manager_id,department_id FROM employees WHERE employee_id IN (141, 174))
AND employee_id NOT IN (141, 171);
```

### HAVING 中的子查询 [#having-中的子查询]

```sql {5} 
# 查询最低工资大于50号部门最低工资的部门id和其最低工资
SELECT department_id, MIN(salary)
FROM employees
GROUP BY department_id
HAVING MIN(salary) > (SELECT MIN(salary) FROM employees WHERE department_id = '50')
```

### CASE 中的子查询 [#case-中的子查询]

```sql 
/*
显示员工的employee_id,last_name和grade
salary >= 10000 grade = 'A'
5000 >= salary > 10000 grade = 'B'
salary < 5000 grade = 'C'
*/
SELECT
  employee_id,
  last_name,
  CASE
      WHEN salary >= 10000 THEN 'A'
      WHEN salary >= 5000 AND salary < 10000 THEN 'B'
      WHEN salary < 5000 THEN 'C'
  END 'grade'
FROM
  employees;
```

### 子查询中的空值问题 [#子查询中的空值问题]

```sql 
# 查询工资大于149号员工工资的员工信息
SELECT *
FROM employees
WHERE salary > (SELECT salary FROM employees WHERE employee_id = '666');
```

> 由于没有员工的员工编号为 666，所以返回的记录数为 0（子查询不返回任何行）

### 非法使用子查询 [#非法使用子查询]

```sql 
SELECT employee_id, last_name
FROM employees
WHERE salary = (SELECT MIN(salary) FROM employees GROUP BY department_id);
```

> 子查询返回多行，但是比较符确是单行比较符，此时 salary 无法决策与子查询返回的那个值相等，故错误

## 多行子查询 [#多行子查询]

### 多行子查询操作符 [#多行子查询操作符]

多行子查询也称集合比较子查询，内查询返回多行，使用多行比较操作符。

| 操作符 | 含义                                                         |
| ------ | ------------------------------------------------------------ |
| `IN`   | 等于列表中的<mark>任意一个</mark>                                     |
| `ANY`  | 需要和单行比较操作符一起使用，和子查询返回的<mark>某一个</mark>值比较 |
| `ALL`  | 需要和单行比较操作符一起使用，和子查询返回的<mark>所有</mark>值比较   |
| `SOME` | 实际上是 ANY 的别名，作用相同，一般常使用 ANY                |

**查询示例**：

```sql {4,10,16,22,28,34} 
# 题目一：查询入职日期比10部门任意一个员工晚的员工姓名、入职日期，不包括10部门员工
SELECT last_name, hire_date
FROM employees
WHERE hire_date >ANY (SELECT hire_date FROM employees WHERE department_id = 10)
AND department_id <> 10;

# 题目二：查询入职日期比20部门所有员工晚的员工姓名、入职日期，不包括10部门员工
SELECT last_name, hire_date
FROM employees
WHERE hire_date >ALL (SELECT hire_date FROM employees WHERE department_id = 20)
AND department_id <> 10;

# 题目三：查询职位和50部门任意一个员工职位相同的员工姓名，职位，不包括20部门员工
SELECT last_name, job_id
FROM employees
WHERE job_id =ANY (SELECT job_id FROM employees WHERE department_id = 50)
AND department_id <> 20;

# 或
SELECT last_name, job_id
FROM employees
WHERE job_id IN (SELECT job_id FROM employees WHERE department_id = 50)
AND department_id <> 20;

# 题目四：返回其它job_id中比job_id为'IT_PROG'部门任一工资低的员工的员工号、姓名、job_id以及salary
SELECT employee_id, last_name, job_id, salary
FROM employees
WHERE salary <ANY (SELECT salary FROM employees WHERE job_id = 'IT_PROG')
AND job_id <> 'IT_PROG';

# 题目五：返回其它job_id中比job_id为'IT_PROG'部门所有工资都低的员工的员工号、姓名、job_id以及salary
SELECT employee_id, last_name, job_id, salary
FROM employees
WHERE salary <ALL (SELECT salary FROM employees WHERE job_id = 'IT_PROG')
AND job_id <> 'IT_PROG';
```

### 空值问题 [#空值问题]

```sql 
# 内查询有NULL值
SELECT employee_id, last_name, job_id, salary, employee_id
FROM employees
WHERE employee_id NOT IN (SELECT manager_id FROM employees);
```

## 相关子查询 [#相关子查询]

### 基本使用 [#基本使用]

&#8195;&#8195;如果子查询的执行依赖于外部查询，通常情况下都是因为子查询中的表用到了外部的表，并进行了条件关联，因此每执行一次外部查询，子查询都要重新计算一次，这样的子查询就称为<mark>关联子查询</mark>。

&#8195;&#8195;相关子查询按照一行接一行的顺序执行，主查询的每一行都执行一次子查询。

```sql 
# 查询员工中工资大于本部门平均工资的员工的lase_name，salary和其department_id
-- 方式一：使用相关子查询
SELECT a.last_name, a.salary, a.department_id
FROM employees a
WHERE a.salary > (SELECT AVG(salary) FROM employees WHERE department_id = a.department_id);

-- 方式二：在FROM中作为一个表
SELECT a.last_name, a.salary, a.department_id
FROM employees a,
(SELECT department_id,AVG(salary) 'salary'
FROM employees
GROUP BY department_id) b
WHERE a.department_id = b.department_id
AND a.salary > b.salary;
```

```sql 
/*
若employees表中employee_id与job_history表总employee_id相同的数目不小于2，
输出这些相同id的员工的employee_id,last_name和其job_id
*/
SELECT employee_id, last_name, job_id
FROM employees e
WHERE 2<= (SELECT COUNT(*) FROM job_history WHERE employee_id = e.employee_id);
```

**在 ORDER BY 中使用子查询**：

```sql 
# 查询员工的id,salary,并按照department_name排序
SELECT employee_id, salary
FROM employees e
ORDER BY (SELECT department_name FROM departments d WHERE e.department_id = d.department_id);
```

### EXISTS / NOT EXISTS [#exists--not-exists]

**基本语法**:

```sql 
SELECT 字段 FROM table WHERE [NOT] EXISTS (subQuery);
```

**使用**：

```sql 
# 查询公司管理者的employee_id,last_name,job_id,department_id
-- 方法一：EXISTS
SELECT employee_id, last_name, job_id, department_id
FROM employees e
WHERE EXISTS (SELECT * FROM employees WHERE manager_id = e.employee_id);

-- 方法二：自连接
SELECT DISTINCT a.employee_id, a.last_name, a.job_id, a.department_id
FROM employees a, employees b
WHERE a.employee_id = b.manager_id;

-- 方法三：多行子查询
SELECT employee_id, last_name, job_id, department_id
FROM employees
WHERE employee_id IN (SELECT manager_id FROM employees);

# 查询departmens表中，不存在于employees表中的部门的departmen_id和departmen_name
SELECT department_id, department_name
FROM departments d
WHERE NOT EXISTS (SELECT * FROM employees WHERE department_id = d.department_id);
```

### 相关更新 [#相关更新]

```sql 
UPDATE table1 alias1
SET column = (SELECT expression FROM table2 alias2 WHERE alias1.column = alias2.column);
```

### 相关删除 [#相关删除]

```sql 
DELETE FROM table1 alias1
WHERE column operator (SELECT expression FROM table2 alias2 WHERE alias1.column = alias2.column);
```

## 思考题 [#思考题]

谁的工资比 Abel 的高?

```sql 
# 子查询
SELECT *
FROM employees
WHERE salary > (SELECT salary FROM employees WHERE last_name = 'Abel');

# 自连接(快)
SELECT b.*
FROM employees a, employees b
WHERE a.salary < b.salary
AND a.last_name = 'Abel';
```

## 练习题 [#练习题]


<details>
<summary>查询和 Zlotkey 相同部门的员工姓名和工资</summary>

```sql 
SELECT last_name, salary
FROM employees
WHERE department_id = (SELECT department_id FROM employees WHERE last_name = 'Zlotkey');

SELECT b.last_name, b.salary
FROM employees a, employees b
WHERE a.department_id = b.department_id
AND a.last_name = 'Zlotkey';
```

</details>


<details>
<summary>查询工资比公司平均工资高的员工的员工号，姓名和工资</summary>

```sql 
SELECT employee_id, last_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

</details>


<details>
<summary>选择工资大于所有 job_id=&#x27;SA_MAN&#x27;的员工的工资的员工的 last_name,job_id,salary</summary>

```sql 
SELECT last_name, job_id, salary
FROM employees
WHERE salary >ALL (SELECT salary FROM employees WHERE job_id = 'SA_MAN');

SELECT last_name, job_id, salary
FROM employees
WHERE salary > (SELECT MAX(salary) FROM employees WHERE job_id = 'SA_MAN');
```

</details>


<details>
<summary>查询各部门中工资比本部门平均工资高的员工的员工号, 姓名和工资</summary>

```sql 
SELECT employee_id, last_name, salary
FROM employees e
WHERE salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id);
```

</details>


<details>
<summary>查询和姓名中包含字母 u 的员工在相同部门的员工的员工号和姓名</summary>

```sql 
SELECT employee_id, last_name
FROM employees
WHERE department_id IN (SELECT department_id FROM employees WHERE last_name LIKE '%u%');

SELECT DISTINCT b.employee_id, b.last_name
FROM employees a, employees b
WHERE a.last_name LIKE '%u%'
AND a.department_id = b.department_id;
```

</details>


<details>
<summary>查询在部门的 location_id 为 1700 的部门工作的员工的员工号</summary>

```sql 
SELECT employee_id
FROM employees
WHERE department_id IN (SELECT department_id FROM departments WHERE location_id = '1700');

SELECT e.employee_id
FROM employees e, departments d
WHERE e.department_id = d.department_id
AND location_id = '1700';
```

</details>


<details>
<summary>查询管理者是 King 的员工姓名和工资</summary>

```sql 
SELECT last_name, salary
FROM employees
WHERE manager_id IN (SELECT employee_id FROM employees WHERE last_name = 'King');

SELECT a.last_name, a.salary
FROM employees a, employees b
WHERE a.manager_id = b.employee_id
AND b.last_name = 'King';
```

</details>


<details>
<summary>查询工资最高的员工的姓名，要求 first_name 和 last_name 显示为一列，列名为 姓名</summary>

```sql 
SELECT CONCAT(first_name,' ',last_name) '姓名'
FROM employees
ORDER BY salary DESC LIMIT 1;

SELECT CONCAT(first_name,' ',last_name) '姓名'
FROM employees
WHERE salary >= (SELECT MAX(salary) FROM employees);
```

</details>
