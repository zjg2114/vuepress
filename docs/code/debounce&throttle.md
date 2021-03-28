# 防抖与节流

## debounce

防抖：控制高频事件触发次数，如果 n 秒内事件再次被触发，则重新计算时间

思路：每次触发事件时都取消之前的延时调用方法

```js
function debounce(fn, waiting) {
  let timeId = null;
  return function() {
    clearTimeout(timeId);
    timeId = setTimeout(() => {
      fn.apply(this, arguments);
    }, waiting);
  };
}
function resizeCaller() {
  console.log("resize");
}
window.addEventListener("resize", debounce(resizeCaller, 1000));
```

另一种先执行一次的防抖函数

```js
function debounce(fn, waiting) {
  let timeId = null;
  let flag = true;
  return function() {
    if (flag) fn.apply(this, arguments);
    flag = false;
    clearTimeout(timeId);
    timeId = setTimeout(() => {
      fn.apply(this, arguments);
      flag = true;
    }, waiting);
  };
}
function resizeCaller() {
  console.log("resize");
}
window.addEventListener("resize", debounce(resizeCaller, 2000));
```

## throttle

节流：高频事件在 n 秒内只会执行一次，无论执行频率多高，等 n 秒后会再次执行

思路：每次触发事件时都根据节流阀判断是否可以执行

1. 计算时间间隔

```js
function throttle(fn, waiting) {
  let preTime = +new Date();
  return function() {
    let now = +new Date();
    if (now - preTime > waiting) {
      fn.apply(this, arguments);
      preTime = now;
    }
  };
}
function resizeCaller() {
  console.log("resize");
}
window.addEventListener("resize", throttle(resizeCaller, 1000));
```

2. 通过定时器

```js
function throttle(fn, waiting) {
  let flag = true;
  return function() {
    if (flag) {
      flag = false;
      fn.apply(this, arguments);
      setTimeout(() => {
        flag = true;
      }, waiting);
    }
  };
}
function resizeCaller() {
  console.log("resize");
}
window.addEventListener("resize", throttle(resizeCaller, 1000));
```
