# new 操作符

如何实现一个 new 操作符,首先知道 new 做了什么

1. 首先创建一个空的对象，空对象的**proto**属性指向构造函数的原型对象,其实就是构造函数的 this 指向实例
2. 把上面创建的空对象赋值构造函数内部的 this，用构造函数内部的方法修改空对象
3. 如果构造函数返回一个非基本类型的值，则返回这个值，否则上面创建的对象

```js
// new的简单实现
function _new(fn, ...arg) {
  const obj = Object.create(fn.prototype);
  const ret = fn.apply(obj, arg);
  return ret instanceof Object ? ret : obj;
}
```
