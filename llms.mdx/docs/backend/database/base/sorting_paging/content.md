# 排序与分页 (/docs/backend/database/base/sorting_paging)

## 数据排序 [#数据排序]

### 排序规则 [#排序规则]

&#8195;&#8195;要在一个不明确顺序的查询结果中对行进行排序，可以使用`ORDER BY`子句，它必须位于 SQL 语句的最后。指定一个表达式或者一个字段名作为排序条件。`ORDER BY`子句的语法形式如下：

```sql 
ORDER BY {column, expr, number} [ASC, DESC]
```

&#8195;&#8195;其中，`ORDER BY {column, expr, number}`指定需要排序的字段、表达式或序号，ASC 以升序排序，DESC 以降序排序，<mark>默认以升序排序</mark>。
针对不同的数据类型，其默认升序的含义如下：

- 对于数字类型，小的值在前面显示
- 对于日期类型，早的日期在前面显示
- 对于字符串类型，依字母顺序显示，a 在前，z 在最后
- 对于空值，升序排序时显示在最后，降序排序时显示在最前面

### 单列排序 [#单列排序]

```sql 
# 按照雇佣日期升序排序
SELECT job_id, first_name, salary FROM employees ORDER BY hire_date;

# 按照SQL语句中第三个字段排序(即：salary)
SELECT job_id, first_name, salary FROM employees ORDER BY 3;

# 按照雇佣日期降序排序
SELECT job_id, first_name, salary FROM employees ORDER BY hire_date DESC;
```

### 多列排序 [#多列排序]

```sql 
# 先按照雇佣日期升序排序，再按照薪水降序排序
SELECT job_id, first_name, salary FROM employees ORDER BY hire_date, salary DESC;
```


<Callout type="success" title="提示">

多列排序也叫多重排序，即先以一个字段对查询结果进行排序，然后在这个排序的基础上再对另一个字段排序，最终显示经多次排序后的查询结果。

</Callout>


## 分页 [#分页]

**格式**：

```sql 
LIMIT [位置偏移量,] 行数
```


<Callout type="success" title="提示">

第一个"位置偏移量"参数指示 MySQL 从哪一行开始显示，是一个可选参数，如果不指定"位置偏移量"，将会从表中的第一条记录开始(第一条记录的位置偏移量是 0，第二条记录的位置偏移量是 1，以此类推)；第二个参数"行数"指示返回的记录条数。

</Callout>


```sql 
# 前 10 条记录：
SELECT * FROM 表名 LIMIT 0, 10;
# 或者
SELECT * FROM 表名 LIMIT 10;

# 第 11 至 20 条记录：
SELECT * FROM 表名 LIMIT 10, 10;

# 第 21 至 30 条记录：
SELECT * FROM 表名 LIMIT 20, 10;
```

> MySQL 8.0 中可以使用`LIMIT 3 OFFSET 4`，意思是获取从第 5 条记录开始后面的 3 条记录，和`LIMIT 4, 3`返回的结果相同。

**分页**：

分页显示公式：`(当前页数 - 1) * 每页条数, 每页条数`

```sql 
SELECT * FROM table_name LIMIT (pageNo - 1) * pageSize, pageSize;

# 每页10条记录，取第三页的记录
SELECT * FROM table_name LIMIT (3 - 1) * 10, 10;
# 即
SELECT * FROM table_name LIMIT 20, 10;
```
