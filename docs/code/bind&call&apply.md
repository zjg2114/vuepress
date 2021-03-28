# bind & call & apply

## bind实现

```js
Function.prototype.mybind=function(context){
    if(typeof this !== 'function'){
        throw new Error(`${this} must be function`);
    }
    let args = [...arguments].slice(1)
    let fn = this
    let bindFunc = function(){
        // 这里return的作用为了让bind返回的函数有返回值 
        // 判断是否被作为构造函数使用,是的话让this指向实例,否则指向bind的第一个参数
       return fn.apply(this instanceof bindFunc ? this : context, [...args,...arguments])
    }
    // 让new出来的实例能够访问原函数的prototype
    bindFunc.prototype = Object.create(this.prototype)
    return bindFunc
}
```

## call实现

```js
//es6 call实现
Function.prototype.mycall = function (context) {
    if(typeof this !== 'function'){
        throw new Error(`${this} must be function`);
    }
    context = context ? Object(context) : window; 
    let args = [...arguments].slice(1)
    let fn= Symbol()
    context[fn] = this
    let res = context[fn](...args)
    delete context[fn]
    return res
}
// 非es6 call实现
Function.prototype.mycall = function (context) {
    if(typeof this !== 'function'){
        throw new Error(`${this} must be function`);
    }
    context = context ? Object(context) : window; 
    context.fn = this;
    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    var result = eval('context.fn(' + args +')');
    delete context.fn
    return result;
}
```

## apply实现

```js
Function.prototype.myapply=function (context,arr) {
    if (typeof this !=='function') {
        throw new Error(`${this} must be function`)
    }
    context = context ? Object(context) : window; 
    let fn= Symbol()
    context[fn] = this
    const args = Object.prototype.toString.call(arr)==="[object Array]"?arr:[arr]
    let res = context[fn](...args)
    delete context[fn]
    return res
}
```