# 聚合函数 (/docs/backend/database/base/aggregate_function)

<Callout type="success" title="提示">

多行函数可以操作成组的多个行，每个行组返回一个结果，这些函数又称组函数。

</Callout>


## 常用的聚合函数 [#常用的聚合函数]

| 函数              | 说明                                          |
| ----------------- | --------------------------------------------- |
| `AVG(input)`      | 求平均值，忽略空值且考虑重复值 <mark>[数字类型]</mark> |
| `SUM(input)`      | 求和，忽略空值且考虑重复值 <mark>[数字类型]</mark>     |
| `MAX(input)`      | 求最大值 <mark>[任意类型]</mark>                       |
| `MIN(input)`      | 求最小值 <mark>[任意类型]</mark>                       |
| `COUNT(*\|input)` | 求行数(用\*则包括空值的行)                    |
| `STDDEV(input)`   | 求标准差 <mark>[数字类型]</mark>                       |
| `VARIANCE(input)` | 求方差 <mark>[数字类型]</mark>                         |

### AVG / SUM 函数 [#avg--sum-函数]

可以对<mark>数值型数据</mark>使用 AVG 和 SUM 函数。

```sql 
mysql> SELECT AVG( salary ),SUM( salary ) FROM employees;
+---------------+---------------+
| AVG( salary ) | SUM( salary ) |
+---------------+---------------+
|   6461.682243 |     691400.00 |
+---------------+---------------+
1 row in set (0.04 sec)
```

### MIN / MAX 函数 [#min--max-函数]

可以对<mark>任意数据类型</mark>的数据使用 MIN 和 MAX 函数。

```sql 
mysql> SELECT MIN( hire_date ),MAX( hire_date ),MIN( salary ),MAX( salary ) FROM employees;
+------------------+------------------+---------------+---------------+
| MIN( hire_date ) | MAX( hire_date ) | MIN( salary ) | MAX( salary ) |
+------------------+------------------+---------------+---------------+
| 1987-06-17       | 2000-04-21       |       2100.00 |      24000.00 |
+------------------+------------------+---------------+---------------+
1 row in set (0.04 sec)
```

### COUNT 函数 [#count-函数]

（1）`COUNT(*)`返回表中记录总数，适用于<mark>任意数据类型</mark>。

```sql 
mysql> SELECT COUNT(*) FROM employees;
+----------+
| COUNT(*) |
+----------+
|      107 |
+----------+
1 row in set (0.04 sec)
```

（2）`COUNT(expr)` 返回`expr`<mark>不为空</mark>的记录总数。

```sql 
mysql> SELECT COUNT(*),COUNT(commission_pct) FROM employees;
+----------+-----------------------+
| COUNT(*) | COUNT(commission_pct) |
+----------+-----------------------+
|      107 |                    35 |
+----------+-----------------------+
1 row in set (0.04 sec)
```


<Callout type="success" title="提示">

（1）用`count(*)`、`count(1)`、`count(列名)`谁好呢？

&#8195;&#8195;对于 MyISAM 引擎的表是没有区别的，这种引擎内部有一计数器在维护着行数；Innodb 引擎的表用 count(\*)，count(1)直接读行数，复杂度是 O(n)，因为 innodb 真的要去数一遍，但好于具体的 count(列名)。

（2）能不能使用`count(列名)`替换`count(*)`？

&#8195;&#8195;不要使用`count(列名)`来替代`count(*)`，`count(*)`是 SQL92 定义的标准统计行数的语法，跟数据库无关，跟 NULL 和非 NULL 无关。  
<mark>说明：count(\*)会统计值为 NULL 的行，而 count(列名)不会统计此列为 NULL 值的行。</mark>

</Callout>


## GROUP BY [#group-by]

**基本语法**：

```sql 
# []里代表可选参数
SELECT column, group_function(column)
FROM table
[WHERE condition]
GROUP BY group_by_expression
[ORDER BY column];
```

### 基本使用 [#基本使用]

```sql 
# 求每个部门的薪资平均值
SELECT department_id,AVG(salary) FROM employees GROUP BY department_id;
```

### 使用多个列分组 [#使用多个列分组]

```sql 
/*
求每个部门的每个职位中薪水最高的雇员，
展示其部门编号、职位编号和薪水，并按照部门编码对结果进行降序
*/
SELECT
  department_id,job_id,MAX( salary )
FROM
  employees
GROUP BY
  department_id,job_id
ORDER BY
  department_id DESC;
```


<Callout type="warn" title="注意">

① GROUP BY 子句至于 WHERE 子句后、ORDER BY 子句前，后面表达式必须包含字段，且<mark>不能使用列的别名</mark>；

② 在 SELECT 子句中，<mark>只可以有组函数和分组字段</mark>(包括对分组字段的操作)，如果包括其他字段在 Oracle 中会报错，在 MySQL 中可能出现问题`（换言之，SELECT 中出现的非组函数字段必须声明在 GROUP BY 中；反之，GROUP BY 中的声明字段可以不出现在 SELECT 中）`；

③ 如果 GROUP BY 子句后面要跟 ORDER BY 子句，则 <mark>ORDER BY 子句用于排序的字段必须是分组字段或组函数</mark>。

</Callout>


### GROUP BY 中使用 WITH ROLLUP [#group-by-中使用-with-rollup]

使用`WITH ROLLUP`关键字之后，在所有查询出的分组记录之后增加一条记录，用于统计该分组的一些数据(根据 SELECT 子句中的组函数变化)。

```sql 
# 下面结果会在每个分组后面增加一条记录，用于展示该分组下薪资的最大值
SELECT
  department_id,job_id,MAX( salary )
FROM
  employees
GROUP BY
  department_id,job_id WITH ROLLUP;
```

> 当使用`ROLLUP`时，不能同时使用 ORDER BY 子句进行结果排序，即 ROLLUP 和 ORDER BY 是互相排斥的。

## HAVING [#having]

### 基本使用 [#基本使用-1]

HAVING 用来对分组结果进行约束。

```sql {7,19} 
# 查询各个部门中最高工资比10000高的部门信息
# 方式一
SELECT
  department_id,MAX( salary )
FROM
  employees
WHERE department_id IN (10,20,30,40)
GROUP BY
  department_id
HAVING MAX( salary ) > 10000;

# 方式二
SELECT
  department_id,MAX( salary )
FROM
  employees
GROUP BY
  department_id
HAVING MAX( salary ) > 10000 AND department_id IN (10,20,30,40);
```


<Callout type="success" title="提示">

① 当过滤条件中有聚合函数时，则此过滤条件必须声明在 HAVING 中；

② 当过滤条件中没有聚合函数时，则此过滤条件声明在 WHERE 或 HAVING 中都可以，但是建议声明在 WHERE 中，这样效率高。

</Callout>


### WHERE 和 HAVING 对比 [#where-和-having-对比]

**区别 1** ：WHERE 可以直接使用表中的字段作为筛选条件，但不能使用分组中的计算函数作为筛选条件；HAVING 必须要与 GROUP BY 配合使用，可以把分组计算的函数和分组字段作为筛选条件。  
**区别 2** ：如果需要通过连接从关联表中获取需要的数据，WHERE 是先筛选后连接，而 HAVING 是先连接后筛选。  
**选择**：WHERE 和 HAVING 也不是互相排斥的，我们可以在一个查询里面同时使用 WHERE 和 HAVING。包含分组统计函数的条件用 HAVING，普通条件用 WHERE。这样，我们就既利用了 WHERE 条件的高效快速，又发挥了 HAVING 可以使用包含分组统计函数的查询条件的优点。当数据量特别大的时候，运行效率会有很大的差别。

## SELECT 的执行过程 [#select-的执行过程]

### 查询的结构 [#查询的结构]

```sql 
# 方式一(SQL92)
SELECT ...,...
FROM ...,...
WHERE 多表的连接条件
AND 不包含组函数的过滤条件
GROUP BY ...,...
HAVING 包含组函数的过滤条件
ORDER BY ... ASC/DESC
LIMIT ...,...

# 方式二(SQL99)
SELECT ...,...
FROM ... JOIN ...
ON 多表的连接条件
JOIN ... ON ...
WHERE 不包含组函数的过滤条件
AND/OR 不包含组函数的过滤条件
GROUP BY ...,...
HAVING 包含组函数的过滤条件
ORDER BY ... ASC/DESC
LIMIT ...,...

/*
FROM：从那些表中筛选
ON：关联多表查询时，去除笛卡尔积
WHERE：从表中筛选的条件
GROUP BY：分组依据
HAVING：在统计结果中再次筛选
ORDER BY：排序
LIMIT：分页
*/
```

### SELECT 执行顺序 [#select-执行顺序]

（1）关键字的顺序

```sql 
SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT ...
```

（2）执行顺序

```sql 
FROM → [ON → JOIN] → WHERE → GROUP BY → HAVING → SELECT的字段 → DISTINCT → ORDER BY → LIMIT

# 举例
SELECT DISTINCT player_id, player_name, count(*) as num # 顺序 5
FROM player JOIN team ON player.team_id = team.team_id # 顺序 1
WHERE height > 1.80 # 顺序 2
GROUP BY player.team_id # 顺序 3
HAVING num > 2 # 顺序 4
ORDER BY num DESC # 顺序 6
LIMIT 2 # 顺序 7
```

### SQL 的执行原理 [#sql-的执行原理]

&#8195;&#8195;SELECT 是先执行 FROM 这一步的，在这个阶段，如果是多表联查，还会经历下面的几个步骤：

> 1. 首先通过 CROSS JOIN 求笛卡尔积，相当于得到虚拟表`vt1-1`;
> 2. 通过 ON 进行筛选，在虚拟表`vt1-1`的基础上进行筛选，得到虚拟表`vt1-2`;
> 3. 添加外部行。如果我们使用的是左连接、右连接或者全连接，就会涉及到外部行，也就是在虚拟表`vt1-2`的基础上增加外部行，得到虚拟表`vt1-3`。
>
> 当然如果我们操作的是两张以上的表，还是重复上面的步骤，直到所有表都被处理完为止，这个过程得到是我们的<mark>原始数据</mark>。

&#8195;&#8195;当我们拿到了查询数据表的原始数据，也就是虚拟表`vt1`，就可以再次基础上再进行 WHERE 阶段。在这个阶段，会根据`vt1`表的结果进行筛选过滤，得到虚拟表`vt2`。

&#8195;&#8195;然后进入第三步和第四步，也就是 GROUP 和 HAVING 阶段，这个阶段会再`vt2`的基础上进行分组和分组过滤，得到中间的虚拟表`vt3`和`vt4`。

&#8195;&#8195;当完成了条件筛选部分之后，就可以筛选表中提取的字段，也就是进入到 SELECT 和 DISTINCT 阶段。首先在 SELECT 阶段会提取想要的字段，然后在 DISTINCT 阶段过滤重复的行，分别得到`vt5-1`和`vt5-2`。

&#8195;&#8195;当我们提取了想要的字段数据之后，就可以按照指定的字段进行排序，也就是 ORDER BY 阶段，得到虚拟表`vt6`。

&#8195;&#8195;最后在`vt6`的基础上，取出指定行的记录，也就是 LIMIT 阶段，得到最终的结果，对应的是虚拟表`vt7`。


<Callout type="success" title="提示">

我们在写 SELECT 语句的时候，不一定存在所有的关键字，相应的阶段就会省略。

</Callout>
