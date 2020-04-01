# Vue 的响应式原理

> vue 的核心思想就是数据驱动,不会频繁的操作 DOM,而是利用了 virtual DOM(虚拟 DOM)
jquery 的我用的时间不久(半年左右),和 vue 相比,由于 jq 的对 dom 的频繁操作,代码比 vue 的复杂度高很多
vue 的开发者不要要关心视图层,只需要操作数据就完事了

## vue 初始化 data

1. vue 初始化阶段会调用\_init 方法,其中会有 initState()对 data 做处理

    ```js
    function initState(vm) {
    var opts = vm.$options;
    // 其中还有 props，computed，watch 等选项处理
    if (opts.data) {
        initData(vm);
    }
    }
    ```

2. observe 函数生成 Observe 实例根据 data 类型做不同处理

    ```js
    function initData(vm) {
        // data就是我们在vue文件中定义的data
        var data = vm.$options.data;
        // 判断data是否是函数(为什么每个vue实例的data需要是个函数)
        data = typeof data === "function" ? data.call(vm, vm) : data || {};
        // ... 遍历 data 数据对象的key，重名检测，合规检测等代码
        observe(data, true /* asRootData */);
        }
        // 这边可以不关心observe 知道是来对data做劫持的就行了
        function observe(value) {
        if (!isObject(value) || value instanceof VNode) {
            return;
        }
        ob = new Observer(value);
        return ob;
        }
        // 这里也可以不关心这个类,下面会说的(主要是对数组和对象的处理)
        export class Observer {
        value: any;
        dep: Dep;
        // 往data中添加__ob__
        def(value, '__ob__', this)
        constructor(value: any) {
            this.value = value;
            this.dep = new Dep();
            if (Array.isArray(value)) {
            this.observeArray(value);
            } else {
            this.walk(value);
            }
        }
        // 如果是Object
        walk(obj: Object) {
            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length; i++) {
            // 遍历对象的数据做劫持
            defineReactive(obj, keys[i]);
            }
        }
        // 如果是Array
        observeArray(items: Array<any>) {
            for (let i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
            }
        }
        }
    ```

3. defineReactive 对 data 中的数据进行劫持(精髓:Object.defineProperty)

```js
function defineReactive(obj, key) {
  // dep 用于中收集所有依赖
  var dep = new Dep();
  var val = obj[key];
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      //精髓代码 下面会说
    },
    set() {
      //精髓代码 下面会说
    }
  });
}
```

> 响应式原理分为依赖收集和依赖更新

## 依赖收集过程

```html
<template>
  <div>{{message}}</div>
</template>
```

上面这段代码会被 compile 函数解析成

```js
with (this) {
  return _c('div', {}, [message]);
}
```

执行渲染函数，通过 with 讲上下文对象绑定为实例,读取 message 的时候就是访问当前实例的 message;
于是就会触发前面 defineproperty 中的 get 方法

```js
// 这里的defineReactive函数是针对基础数据类型的,对于数组和对象有额外的处理
function defineReactive(obj, key) {
  var dep = new Dep();
  var val = obj[key];
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        // 收集依赖
        dep.addSub(Dep.target);
      }
      return val;
    }
  });
}
```

> Dep.target 简单介绍

1. Dep.target 指向的是各种 watcher(页面渲染 watcher,computed,watch 等等)
2. Dep.target 会根据当前解析流程，不停地指向不同的 watcher
   举个栗子:比如当前页面开始渲染时，Dep.target 会提前指向当前页面的 watcher。
   于是页面渲染函数执行，并引用了数据 message 后，message 收集到了 Dep.target，就会收集到当前页面的 watcher
   数据变化时通知相应的 watcher，就可以调用 watcher 去派发更新

> 构造函数 Dep

```js
var Dep = function Dep() {
  // 保存watcher 的数组(举个栗子:当message被watch监听并且被页面使用的话,subs中会有watch和页面渲染的两个watcher)
  this.subs = [];
};
// addSub是原型上的方法，作用是往 dep.subs 存储器中 中直接添加 watcher
Dep.prototype.addSub = function(sub) {
  this.subs.push(sub);
};
```

基本数据类型的依赖收集在闭包 dep 中,至此基本数据的依赖收集就完成了,接下来就是引用数据类型了

对于引用数据主要分为两种:Array 和 Object,我们一个一个来分析

> 引用数据的响应式

当 data 是对象时,会通过 walk 来遍历对象,一层一层的 defineReactive 做劫持,
我在 data 中定义了一个对象,在控制台打印,可以发现其中有一个**ob**的属性

![_ob_](https://github.com/zjg2114/Daily-code-exercises/blob/master/vue%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90/asserts/__ob__.png?raw=true)

**ob** 有一个 dep 属性，这个 dep 是不是有点熟悉，是的，在上面讲过 dep 正是存储依赖的地方
这个 ob 是怎么来的呢 上面的源码我们再拿来看一下

```js
function observe(value) {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  // 可以看到ob就是Observer生成的实例
  ob = new Observer(value);
  return ob;
}
export class Observer {
  value: any;
  dep: Dep;
  constructor(value: any) {
    this.value = value;
    this.dep = new Dep();
    if (Array.isArray(value)) {
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  // 如果是Object
  walk(obj: Object) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      // 遍历对象的数据做劫持
      defineReactive(obj, keys[i]);
    }
  }
  // 如果是Array
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}
```

再来看这个源码 可以知道 ob 就是 Observe 生成的实例
为什么需要**ob**.dep 来存储依赖?
因为闭包 dep 只存在 defineReactive 中，其他地方访问不到,那么哪些地方需要这个**ob**.dep 呢?

做过 vue 项目的应该都会用到过 this.$set或者this.$del 方法吧,
当我们给某个对象添加响应式的属性的时候会用到,那么他们内部怎么实现的呢

```js
export function set (target, key, val){
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  // 这里就是ob起作用的地方了
  const ob = target.__ob__
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```

当我们添加或者删除结束的时候就会通过 ob.dep.notify 来通知依赖更新

接下来,我们开始分析数组,其实原理差不多,还是遍历遍历遍历

```js
  // 如果是Array
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
```

数组中也会有**ob**属性,那么数组中的 ob 又在什么地方用到了呢
其实 vue 对数组的变异方法做了一层自己的封装(变异方法就是会修改原数组的方法比如:push)

```js
const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

methodsToPatch.forEach(function(method) {
  // cache original method
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    // notify change
    ob.dep.notify();
    return result;
  });
});
```

用原生的方法处理完数组后依然是通过 ob.dep.notify()通知依赖更新

ob 是什么时候被添加的?往上翻 在 Observe 类的 constructor 中
好了 ob 说完该说核心内容了,vue 是怎么定义 defineProperty.get 的呢(上源码)

```js
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep();

  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      // 往后再说
    }
  });
}
```

1. dep 说过了,就是主要用于存放 watcher 的
2. childOb 是 observe(val)的返回值,当 val 是个基本数据类型时,返回 undefined,否则会不断递归遍历
   在 get 中会判断 childOb 不是基本数据类型时,childOb.dep.depend(),就是 ob 中的 dep 也会收集依赖 3.当 data 是个数组时会调用 dependArray,目的还是遍历,如果 item 项是对象,那么在 ob.dep 中添加依赖,数组就递归处理

```js
function dependArray(value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}
```

> get 部分就结束了,依赖收集告一段落,接下来内容很少了,就是依赖更新

## 依赖更新过程

set 函数的源码

```js
set: function reactiveSetter(newVal) {
  const value = val;
  // 如果没变化就return
  if (newVal === value || (newVal !== newVal && value !== value)) {
    return;
  }
  val = newVal;
  // 如果属性已经存在过，设置新值的时候，会重新调用一遍
  childOb = !shallow && observe(newVal);
  // 通知更新依赖
  dep.notify();
}
```

上面对 dep 已经简单介绍过了,其实 dep 并不复杂,是一个 class 类

```js
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  addSub(sub: Watcher) {
    this.subs.push(sub);
  }

  removeSub(sub: Watcher) {
    remove(this.subs, sub);
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }

  notify() {
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}

Dep.target = null;
const targetStack = [];

export function pushTarget(target: ?Watcher) {
  targetStack.push(target);
  Dep.target = target;
}

export function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
```

整个 dep 的作用包含

1. 维护 subs,添加 watcher,删除 watcher
2. 维护一个 targetStack,不同阶段将不同的 watcher 赋值给 Dep.target
3. notify 通知 watcher 执行 update(),页面刷新,中间过程还没了解,有空再写
