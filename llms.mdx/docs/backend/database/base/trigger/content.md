# 触发器 (/docs/backend/database/base/trigger)

## 触发器概述 [#触发器概述]

&#8195;&#8195;触发器是一个数据库对象，是一个特殊的过程，当特定的事件发生时隐式地执行。

&#8195;&#8195;MySQL 从 5.0.2 版本开始支持触发器。它的触发器和存储过程一样，都是嵌入到 MySQL 服务器的一段程序。

&#8195;&#8195;触发器是由事件来触发某个操作，这些事件包括 INSERT、UPDATE、DELETE 事件。所谓事件就是指用户的动作或者触发某项行为。如果定义了触发程序，当数据库执行这些语句时候，就相当于事件发生了，就会自动激发触发器执行相应的操作。

&#8195;&#8195;当对数据表中的数据执行插入、更新和删除操作，需要自动执行一些数据库逻辑时，可以使用触发器来实现。

## 触发器的创建 [#触发器的创建]

语法结构：

```sql 
CREATE
    [DEFINER = user]
    TRIGGER trigger_name
    trigger_time trigger_event
    ON tbl_name FOR EACH ROW
    [trigger_order]
    trigger_body

# 参数说明
trigger_time: { BEFORE | AFTER }
trigger_event: { INSERT | UPDATE | DELETE }
trigger_order: { FOLLOWS | PRECEDES } other_trigger_name
```

---

示例一：创建名称为 before_insert 的触发器，向 test_trigger 数据表插入数据之前，向 test_trigger_log 数据表中插入 before_insert 的日志信息

```sql 
DELIMITER //

CREATE TRIGGER before_insert
BEFORE INSERT ON test_trigger FOR EACH ROW
BEGIN
  INSERT INTO test_trigger_log(t_log) VALUES('before_insert');
END //

DELIMITER ;
```

示例二：定义触发器 salary_check_trigger，基于员工表 employees 的 INSERT 事件，在 INSERT 之前检查将要添加的新员工薪资是否大于他领导的薪资，如果大于领导薪资，则报 sqlstate_value 为’HY000’的错误，从而使得添加失败

```sql 
DELIMITER //

CREATE TRIGGER salary_check_trigger
BEFORE INSERT ON employees FOR EACH ROW
BEGIN
  DECLARE mar_sal DOUBLE;
  SELECT salary INTO mgr_sal FROM employees WHERE employee_id = NEW.manager_id;

  IF NEW.salary > mar_sal THEN
    SIGNAL SQLSTATE 'HY000' SET MESSAGE_TEXT = '错误：薪资高于领导薪资';
  END IF;

END //

DELIMITER ;
```


<Callout type="success" title="提示">

上面触发器声明过程中的 NEW 关键字代表 INSERT 添加语句的新记录。

</Callout>


## 查看、删除触发器 [#查看删除触发器]

### 查看触发器 [#查看触发器]

```sql 
# 查看当前数据库定义的所有触发器
SHOW TRIGGERS;

# 查看当前数据库中某个触发器的定义
SHOW CREATE TRIGGER trigger_name;

# 从系统库information_schema的TRIGGERS表中查询触发器的信息
SELECT * FROM information_schema.TRIGGERS;
```

### 删除触发器 [#删除触发器]

```sql 
DROP TRIGGER IF EXISTS trigger_name;
```

## 触发器的优缺点 [#触发器的优缺点]

### 优点 [#优点]

(1) 触发器可以确保数据的完整性；

(2) 触发器可以帮助我们记录操作日志；

(3) 触发器可以用在操作数据前，对数据进行合法性检查。

### 缺点 [#缺点]

(1) 可读性差；

(2) 相关数据的变更，可能会导致触发器出错。

### 注意点 [#注意点]

&#8195;&#8195;如果在子表中定义了外键约束，并且外键指定了 ON UPDATE/DELETE CASCADE/SET NULL 子句，此时修改父表被引用的键值或删除父表被引用的记录行时，也会引起子表的修改和删除操作，此时基于子表的 UPDATE 和 DELETE 语句定义的触发器并不会被激活。

例如：  
&#8195;&#8195;基于子表员工表（t_employee）的 DELETE 语句定义了触发器 t1，而子表的部门编号（did）字段定义了外键约束引用了父表部门表（t_department）的主键列部门编号（did），并且该外键加了"ON DELETE SET NULL"子句，那么如果此时删除父表部门表（t_department）在子表员工表（t_employee）有匹配记录的部门记录时，会引起子表员工表（t_employee）匹配记录的部门编号（did）修改为 NULL，但是此时不会激活触发器 t1。只有直接对子表员工表（t_employee）执行 DELETE 语句时才会激活触发器 t1。
