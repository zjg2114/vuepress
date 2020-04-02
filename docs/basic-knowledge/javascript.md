# javascript

## 原型链

## 作用域&闭包

### 作用域

在我的理解中作用域就是变量访问的规则

举个栗子

```js
function out() {
  var a = 123;
  console.log(a); // 123
}
outFun2();
console.log(a); // a is not defined
```

上面的例子就可以体现作用域的作用了，变量 a 在 out 函数中声明，所以在全局作用域下取值会报错

> JavaScript 分为局部作用域和全局作用域（还有"块级作用域"，后面会说）

- 变量在函数内声明为局部作用域，只能被当前作用域和内层的作用域访问；
- 变量在全局声明则为全局作用域，能被任何地方访问；

js 中变量的访问规则：内层作用域可以访问外层作用域的变量，反之不行；
也就是说如果函数嵌套了函数，在最内部函数中访问某个变量时，会一层层往外访问声明的变量，层层访问就形成了作用域链；

var声明赋值的变量会在当前的作用域内预解析导致变量提升，当执行到赋值语句再赋值

举个栗子

```js
function out() {
  console.log(a); // undefined
  var a = 123;
  console.log(a); // 123

}
outFun2();
```

所有末定义直接赋值的变量自动声明为拥有全局作用域

```js
function out() {
  a = 123;
}
outFun2();
console.log(a); // 123
```

原因也很简单，执行函数给a赋值时，会在作用域链上找定义a的作用域，一直访问到全局，也没有定义a，于是a被定义在了window全局对象上，当我们访问a时就是访问的window.a

### 闭包

函数和对其周围状态（lexical environment，词法环境）的引用捆绑在一起构成闭包（closure）。也就是说，闭包可以让你从内部函数访问外部函数作用域。在 JavaScript 中，每当函数被创建，就会在函数生成时生成闭包。

## new 操作符

1. 首先创建一个空的对象，空对象的**proto**属性指向构造函数的原型对象
2. 把上面创建的空对象赋值构造函数内部的 this，用构造函数内部的方法修改空对象
3. 如果构造函数返回一个非基本类型的值，则返回这个值，否则上面创建的对象
   function \_new(fn, ...arg) {
   const obj = Object.create(fn.prototype);
   const ret = fn.apply(obj, arg);
   return ret instanceof Object ? ret : obj;
   }

## 防抖

## 节流

## 继承

## promise

## 箭头函数
