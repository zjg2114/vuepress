# 数组方法

```js
// map
Array.prototype.mymap = function (callback) {
  const arr = this;
  let newArr = [];
  for (var i = 0; i < arr.length; i++) {
    newArr.push(callback(arr[i], i, arr));
  }
  return newArr;
};
const res1 = [{ id: 1 }, { id: 2 }].mymap((item) => item.id);
console.log(res1);

// filter
Array.prototype.myfilter = function (callback) {
  const arr = this;
  let newArr = [];
  for (var i = 0; i < arr.length; i++) {
    if (callback(arr[i], i, arr)) {
      newArr.push(arr[i]);
    }
  }
  return newArr;
};
const res2 = [1, 2, 3].myfilter((item) => item > 2);
console.log(res2);

// myreduce
Array.prototype.myreduce = function() {
  let arr = this;
  let callback = arguments[0];
  let hasInitial = arguments[1] !== undefined;
  let result = hasInitial ? arguments[1] : arr[0];
  for (var i = hasInitial ? 0 : 1; i < arr.length; i++) {
    result = callback(result, arr[i], i, arr);
  }
  return result;
};
```
