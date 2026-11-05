# 数据处理之增删改 (/docs/backend/database/base/data_processing)

## 插入数据 [#插入数据]

### VALUES 的方式添加 [#values-的方式添加]

```sql 
# 插入单条或多条数据，其中字段列表可省略
INSERT INTO table [(column1, column2, column3...)] VALUES
(value1, value2, value3...)
[(value1, value2, value3...)]
...
[(value1, value2, value3...)];
```


<Callout type="success" title="提示">

在使用 INSERT 语句时，<mark>可以省略字段名列表，则对应值列表中必须按照实际表中的字段的默认顺序逐个完整的排列</mark>。

</Callout>


**示例**：

```sql {2,6} 
# 包含字段列表
INSERT INTO departments (department_id, department_name, manager_id, location_id)
VALUES (280, 'Development', '103', 1700);

# 省略字段列表
INSERT INTO departments
VALUES (280, 'Development', '103', 1700);
```

### 将查询结果插入到表 [#将查询结果插入到表]

```sql 
# 从table2查询数据插入到表table中
INSERT INTO table [(column1, column2, column3...)]
SELECT col1, col2, col3... FROM table2...
```


<Callout type="warn" title="注意">

① 在`INSERT`语句中加入子查询  
② 不必书写`VALUES`子句  
③ 子查询中的值列表应与`INSERT`子句中的列名对应

</Callout>

**示例**：

```sql 
INSERT INTO sales_reps(id, name, salary, commission_pct)
SELECT employee_id, last_name, salary, commission_pct FROM employees;
```

## 修改数据 [#修改数据]

```sql 
UPDATE table SET column1 = value1[, column2 = value2...] [WHERE ...]
```


<Callout type="success" title="提示">

① 可以一次更新==多条--数据  
② 如果需要回滚数据，需要保证在 DML 前，进行设置`SET AUTOCOMMIT = FALSE`  
③ 使用`WHERE`子句指定需要更新的数据

</Callout>


**示例**：

```sql 
# 将departments表中部门为280的员工的上级修改为102
UPDATE departments SET manager_id = '102' WHERE department_id = '280';
```

## 删除数据 [#删除数据]

```sql 
DELETE FROM table [WHERE ...]
```

**示例**：

```sql 
# 删除全表数据
DELETE FROM departments;

# 删除部门ID为280的数据
DELETE FROM departments WHERE department_id = '280';
```

## MySQL8 新特性-计算列 [#mysql8-新特性-计算列]

&#8195;&#8195;什么叫计算列呢？简单来说就是某一列的值是通过别的列计算得来的。例如：`a`列值为`1`、`b`列值为`2`，`c`列不需要手动插入，定义`a+b`的结果为`c`的值，那么`c`就是计算列，是通过别的列计算得来的。

&#8195;&#8195;在 MySQL 8.0 中，`CREATE TABLE`和`ALTER TABLE`中都支持增加计算列。下面以`CREATE TABLE`为例进行讲解。

> 举例：定义数据表 tb1，然后定义字段 id、字段 a、字段 b 和字段 c，其中字段 c 为计算列，用于计算 a+b 的值。 首先创建测试表 tb1，语句如下：

```sql 
CREATE TABLE tb1(
  id INT,
  a INT,
  b INT,
  c INT GENERATED ALWAYS AS (a + b) VIRTUAL # c 即为计算列
);
```

插入数据：

```sql 
INSERT INTO tb1 (a, b) VALUES ( 100, 200 );
```

查询数据表 tb1 中的数据，结果如下：

```sql 
mysql> SELECT * FROM tb1;
+------+------+------+------+
| id   | a    | b    | c    |
+------+------+------+------+
| NULL | 100  | 200  | 300  |
+------+------+------+------+
1 row in set (0.00 sec)
```

更新数据中的数据，语句如下：

```sql 
mysql> UPDATE tb1 SET a = 500 ;
Query OK, 0 rows affected (0.00 sec)
Rows matched: 1 Changed: 0 Warnings: 0
```

## 综合案例 [#综合案例]

(01) 创建数据库 test01_library  
(02) 创建表 books，表结构如下：

| 字段名  | 字段说明 | 数据类型     |
| ------- | -------- | ------------ |
| id      | 书编号   | INT          |
| name    | 书名     | VARCHAR(50)  |
| authors | 作者     | VARCHAR(100) |
| price   | 价格     | FLOAT        |
| pubdate | 出版日期 | YEAR         |
| note    | 说明     | VARCHAR(100) |
| num     | 库存     | INT          |

(03) 向 books 表中插入记录  
① 不指定字段名称，插入第一条记录  
② 指定所有字段名称，插入第二记录  
③ 同时插入多条记录（剩下的所有记录）

| id  | name          | authors         | price | pubdate | note     | num |
| --- | ------------- | --------------- | ----- | ------- | -------- | --- |
| 1   | Tal of AAA    | Dickes          | 23    | 1995    | novel    | 11  |
| 2   | EmmaT         | Jane lura       | 35    | 1993    | joke     | 22  |
| 3   | Story of Jane | Jane Tim        | 40    | 2001    | novel    | 0   |
| 4   | Lovey Day     | George Byron    | 20    | 2005    | novel    | 30  |
| 5   | Old land      | Honore Blade    | 30    | 2010    | law      | 0   |
| 6   | The Battle    | Upton Sara      | 30    | 1999    | medicine | 40  |
| 7   | Rose Hood     | Richard haggard | 28    | 2008    | cartoon  | 28  |

(04) 将小说类型(novel)的书的价格都增加 5  
(05) 将名称为 EmmaT 的书的价格改为 40 ，并将说明改为 drama  
(06) 删除库存为 0 的记录  
(07) 统计书名中包含 a 字母的书  
(08) 统计书名中包含 a 字母的书的数量和库存总量  
(09) 找出"novel"类型的书，按照价格降序排列  
(10) 查询图书信息，按照库存量降序排列，如果库存量相同的按照 note 升序排列  
(11) 按照 note 分类统计书的数量  
(12) 按照 note 分类统计书的库存量，显示库存量超过 30 本的  
(13) 查询所有图书，每页显示 5 本，显示第二页  
(14) 按照 note 分类统计书的库存量，显示库存量最多的  
(15) 查询书名达到 10 个字符的书，不包括里面的空格  
(16) 查询书名和类型，其中 note 值为 novel 显示小说，law 显示法律，medicine 显示医药，cartoon 显示卡通，joke 显示笑话  
(17) 查询书名、库存，其中 num 值超过 30 本的，显示滞销，大于 0 并低于 10 的，显示畅销，为 0 的显示需要无货  
(18) 统计每一种 note 的库存量，并合计总量  
(19) 统计每一种 note 的数量，并合计总量  
(20) 统计库存量前三名的图书  
(21) 找出最早出版的一本书  
(22) 找出 novel 中价格最高的一本书  
(23) 找出书名中字数最多的一本书，不含空格

**答案**：


<details>
<summary>点击展开查看</summary>

```sql 
# 1
CREATE DATABASE IF NOT EXISTS test01_library CHARACTER SET 'utf8';

# 2
CREATE TABLE IF NOT EXISTS books(
  id INT COMMENT '书编码',
  name VARCHAR(50) COMMENT '书名',
  author VARCHAR(100) COMMENT '作者',
  price FLOAT COMMENT '价格',
  pubdate YEAR COMMENT '出版日期',
  note VARCHAR(100) COMMENT '说明',
  num INT COMMENT '库存'
);

# 3.1
INSERT INTO books VALUES (1, 'Tal of AAA', 'Dickes', 23, 1995, 'novel', 11);
# 3.2
INSERT INTO books(id, name, author, price, pubdate, note, num) VALUES
(2, 'EmmaT', 'Jane lura', 35, 1993, 'joke', 22);
# 3.3
INSERT INTO books(id, name, author, price, pubdate, note, num) VALUES
(3,'Story of Jane', 'Jane Tim', 40, 2001, 'novel', 0),
(4,'Lovey Day', 'George Byron', 20, 2005, 'novel', 30),
(5,'Old land', 'Honore Blade', 30, 2010, 'law', 0),
(6,'The Battle', 'Upton Sara', 30, 1999, 'medicine', 40),
(7,'Rose Hood', 'Richard haggard', 28, 2008, 'cartoon', 28);

# 4
UPDATE books SET price = price + 5 WHERE note = 'novel';

# 5
UPDATE books SET price = 40, note = 'drama' WHERE name = 'EmmaT';

# 6
DELETE FROM books WHERE num = 0;

# 7
SELECT * FROM books WHERE name LIKE '%a%';

# 8
SELECT COUNT(*), SUM(num) FROM books WHERE name LIKE '%a%';

# 9
SELECT * FROM books WHERE note = 'novel' ORDER BY price DESC;

# 10
SELECT * FROM books ORDER BY num DESC, note ASC;

# 11
SELECT note, COUNT(*) FROM books GROUP BY note;

# 12
SELECT note, SUM(num) FROM books GROUP BY note HAVING SUM(num) > 30;

# 13
SELECT * FROM books LIMIT 5, 5;

# 14
SELECT note, SUM(num) FROM books GROUP BY note ORDER BY SUM(num) DESC LIMIT 1;

# 15
SELECT * FROM books WHERE CHAR_LENGTH(REPLACE(name, ' ', '')) >= 10;

# 16
SELECT name '书名', CASE note
                    WHEN 'novel' THEN '小说'
                    WHEN 'law' THEN '法律'
                    WHEN 'medicine' THEN '医药'
                    WHEN 'cartoon' THEN '卡通'
                    WHEN 'joke' THEN '笑话'
                    END '类型'
FROM books;

# 17
SELECT name, CASE WHEN num > 30 THEN '滞销'
                  WHEN num > 0 AND num < 10 THEN '畅销'
                  WHEN num = 0 THEN '无货'
             END
FROM books;

# 18
SELECT note, SUM(num) FROM books GROUP BY note WITH ROLLUP;

# 19
SELECT note, COUNT(*) FROM books GROUP BY note WITH ROLLUP;

# 20
SELECT * FROM books ORDER BY num DESC LIMIT 3;

# 21
SELECT * FROM books ORDER BY pubdate ASC LIMIT 1;

# 22
SELECT * FROM books WHERE note = 'novel' ORDER BY price DESC LIMIT 1;

# 23
SELECT * FROM books ORDER BY CHAR_LENGTH(REPLACE(name, ' ','')) DESC LIMIT 1;
```

</details>



<Callout type="success" title="提示">

① 分页显示公式：`(当前页数 - 1) * 每页条数, 每页条数`([知识回顾](/docs/backend/database/base/sorting_paging#分页))  
② 统计总数`WITH ROLLUP`([知识回顾](/docs/backend/database/base/aggregate_function#group-by-中使用-with-rollup))  
③ `CASE...WHEN...THEN...`的使用([知识回顾](/docs/backend/database/base/one_line_function#流程控制函数))  
④ 字符串函数([知识回顾](/docs/backend/database/base/one_line_function#字符串函数))

</Callout>
