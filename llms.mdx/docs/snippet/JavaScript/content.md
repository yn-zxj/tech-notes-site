# JavaScript (/docs/snippet/JavaScript)

## 复制到剪贴板 [#复制到剪贴板]

```javascript
/**
 * 内容复制到剪贴板
 * @param {string} str 需要被复制的内容
 * @param {Function} success 复制成功回调函数
 * @param {Function} failure 复制失败回调函数
 */
function copyToClipboard(str, success, failure) {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(str).then(success).catch(failure);
  } else {
    let el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    if (document.execCommand('copy')) {
      success();
    } else {
      failure();
    }
    document.body.removeChild(el);
  }
}
```


<Callout type="warn" title="注意">

① Clipboard API 目前仅在 HTTPS 网站上支持；

</Callout>


## 重命名键 [#重命名键]


<Tabs items={["对象键名修改(单个)", "对象键名修改(支持多个)", "map 实现", "数组对象键名修改(单个)"]}>
<Tab value="对象键名修改(单个)">

```javascript
/**
 * 重命名键(只能改单个对象的单个键名)
 * @param {Object} obj 对象
 * @param {string} oldName 旧键名
 * @param {string} newName 新键名
 */
function renameKeys(obj, oldName, newName) {
  let newObj = {};
  for (let key in obj) {
    let newKey = key.replace(oldName, newName);
    newObj[newKey] = obj[key];
  }
  return newObj;
}

// 举例
const obj = { name: 'LiHua', age: '20', height: 170 };
renameKeys(obj, 'name', 'fullName');
// 返回: { age: "20", fullName: "LiHua", height: 170 }
```

</Tab>
<Tab value="对象键名修改(支持多个)">

```javascript
/**
 * 重命名键(可修改多个对象的多个键名)
 * @param {object} keysMap 修改的键名对象
 * @param {object} obj 修改被修改对象
 * @returns {object} 键名被修改过的对象
 */
function renameKeys(keysMap, obj) {
  return Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] }
    }),
    {}
  );
}

// 举例
const obj = { name: 'LiHua', age: '20', height: 170 };
renameKeys({ name: 'fullName', height: 'weight' }, obj);
// 返回: { age: "20", fullName: "LiHua", weight: 170 }
```

</Tab>
<Tab value="map 实现">

```javascript
/**
 * @param {array} obj 数组对象
 */
function renameKeys(obj) {
  let newArr = obj.map(item => {
    return {
      fullName: item.name,
      age: item.age
    };
  });
  return newArr;
}

// 举例
const obj = [
  { name: 'LiHua', age: 20 },
  { name: 'LiuXing', age: 15 }
];
renameKeys(obj);
// 返回: [{ age: 20, fullName: "LiHua" }, { age: 15, fullName: "LiuXing" }]
```

</Tab>
<Tab value="数组对象键名修改(单个)">

```javascript
/**
 * 数组对象键名修改(单个)
 * @param {array} arr 数组
 * @param {string} key 新key名
 * @param {string} replaceKey 原始key名
 * @returns {array} newArr 新数组
 */
function replaceObjectKey(arr, key, replaceKey) {
  let newArr = [];
  arr.forEach((item, index) => {
    for (var i = 0; i < key.length; i++) {
      item[key] = item[replaceKey];
    }
    // 删除原始key名
    delete item[replaceKey];
    newArr.push(item);
  });
  return newArr;
}

// 举例
const obj = [
  { name: 'LiHua', age: 20 },
  { name: 'LiuXing', age: 15 }
];
replaceObjectKey(obj, 'fullName', 'name');
// 返回: [{ age: 20, fullName: "LiHua" }, { age: 15, fullName: "LiuXing" }]
```

</Tab>
</Tabs>
