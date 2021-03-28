# 函数柯里化

- 柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的编程技巧。

```js
function curry(fn, args) {
  var length = fn.length;
  args = args || [];
  return function() {
    var _args = args.slice(0),
      arg,
      i;
    for (i = 0; i < arguments.length; i++) {
      arg = arguments[i];
      _args.push(arg);
    }
    if (_args.length < length) {
      return curry.call(this, fn, _args);
    } else {
      return fn.apply(this, _args);
    }
  };
}

var fn = curry(function(a, b, c) {
  console.log([a, b, c]);
});
```

# compose组合函数

- 接收任意个函数 返回一个组合后的函数

```js
const compose = funcs.reduce((a, b) => (...args) => a(b(...args)));
```