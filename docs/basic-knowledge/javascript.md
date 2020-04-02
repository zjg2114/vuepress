# javascript

## 原型链

## 作用域&闭包

## new操作符
1. 首先创建一个空的对象，空对象的__proto__属性指向构造函数的原型对象
2. 把上面创建的空对象赋值构造函数内部的this，用构造函数内部的方法修改空对象
3. 如果构造函数返回一个非基本类型的值，则返回这个值，否则上面创建的对象
function _new(fn, ...arg) {
    const obj = Object.create(fn.prototype);
    const ret = fn.apply(obj, arg);
    return ret instanceof Object ? ret : obj;
}

## 防抖

## 节流

## 继承

## promise

## 箭头函数
