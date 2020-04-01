### computed
> auth: zhoujg
#### computed的作用
    
vue模板内的表达式非常便利，但是设计它们的初衷是用于简单运算的。在模板中放入太多的逻辑会让模板过重且难以维护。例如：
```html
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
```
在这个地方，模板不再是简单的声明式逻辑，对于任何复杂逻辑，你都应当使用计算属性;
当数据发生变化时(只要数据是响应式的,即使是引用类型),computed会自动返回计算后的值;

#### computed的setter和getter
计算属性默认只有 getter，特殊情况可以提供一个 setter：
例如需要和vuex中的数据双向绑定的时候(在set中提供mutation的方法)
```js
computed: {
  fullName: {
    // getter
    get: function () {
    },
    // setter
    set: function (newValue) {
    }
  }
}
```

#### computed的原理
当vue初始化state的时候会调用initComputed方法
```js
function initState(vm) {    
    var opts = vm.$options;    
    if (opts.computed) { 
        initComputed(vm, opts.computed); 
    }
}
```

> initComputed方法的源码:

```js
  function initComputed(vm, computed) {
    // 定义一个watchers
    var watchers = (vm._computedWatchers = Object.create(null))
    for (var key in computed) {
      var userDef = computed[key]
      // 这一步其实就是上面所说的computed其实可以是个包含get set的函数
      var getter =
        typeof userDef === 'function' ? userDef : userDef.get
      // 每个 computed 都创建一个 watcher
      // watcher 用来存储计算值，判断是否需要重新计算 Watch方法下面会说
      watchers[key] = new Watcher(vm, getter, {
        lazy: true
      })
      // 判断是否有重名的属性
      if (!(key in vm)) {
        defineComputed(vm, key, userDef)
      }
    }
  }
```

我们先看watcher的构造函数

```js
  function Watcher(vm, expOrFn, options) {
    this.dirty = this.lazy = options.lazy
    this.getter = expOrFn
    this.value = this.lazy ? undefined : this.get()
  }
```
watcher是一个对象存在watchers中
1. dirty是和computed的缓存有关,第一次默认为true,当dirty为true的时候,computed会重新计算
2. getter就是我们return的表达式或者是set对应的函数
3. value也就是计算出来的值(lazy传进来为true意味着初始化的计算值都是undefined,不会触发get)

接着看简化版的defineComputed
```js
  function defineComputed( target, key, userDef ) {
    // 设置 set 为默认值，避免 computed 并没有设置 set
    var set = function () {}
    //  如果用户设置了set，就使用用户的set
    if (userDef.set) set = userDef.set
    // 这里可以看出computed也是响应式
    Object.defineProperty(target, key, {
      // 包装get 函数，主要用于判断计算缓存结果是否有效(下面会说)
      get: createComputedGetter(key),
      set: set
    })
  }
```
在来看createComputedGetter
```js
  function createComputedGetter(key) {
    return function () {
      // 获取到相应 key 的 computed-watcher
      var watcher = this._computedWatchers[key]
      // 如果 computed 依赖的数据变化，dirty 会变成true，从而重新计算，然后更新缓存值 watcher.value
      if (watcher.dirty) {
        watcher.evaluate()
      }
      // 这里是让data的数据和页面建立关系的方法
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
```
evaluate函数很简单,就是重新调用get方法,再把dirty至为false缓存
```js
Watcher.prototype.evaluate = function() {    
    this.value = this.get();    
    // 执行完更新函数之后，立即重置标志位
    this.dirty = false;
};
```
> 这里vue针对computed做了优化

举个栗子,computed数据A引用了data数据B，即A 依赖 B，所以B 会收集到 A 的 watcher
当 B 改变的时候，会通知 A 进行更新，即调用 A-watcher.update，看下源码
```js
Watcher.prototype.update = function() {    
    if (this.lazy)  this.dirty = true;
};
```
当通知 computed 更新的时候，就只是把dirty设置为true，只有当读取comptued时，才会调用evalute重新计算

接着分析,当我们执行evaluate的时候,watcher的get()被触发
这一段代码就是让data的数据和页面建立关系的地方
```js
  Watcher.prototype.get = function () {
    // 改变 Dep.target
    pushTarget()
    // getter 就是返回值的计算回调
    var value = this.getter.call(this.vm, this.vm)
    // 恢复前一个 watcher
    popTarget()
    return value
  }
  Dep.target = null
  var targetStack = []
  function pushTarget(_target) {
    // 把上一个 Dep.target 缓存起来，便于后面恢复
    if (Dep.target) {
      targetStack.push(Dep.target)
    }
    // Dep.target 被设置为 computed-watcher
    Dep.target = _target
  }
  function popTarget() {
    Dep.target = targetStack.pop()
  }
```
> 整体流程

1. 页面更新，读取 computed 的时候，Dep.target 会设置为 页面 watcher。
2. computed 被读取，createComputedGetter 包装的函数触发，第一次会进行计算
3. Dep.target 被设置为 computed-watcher，旧值 页面 watcher 被缓存起来。
4. computed 计算会读取 data，此时 data 就收集到 computed-watcher,
    同时 computed-watcher 也会保存到 data 的依赖收集器 dep（用于下一步）。
5. computed 计算完毕，释放Dep.target，并且Dep.target 恢复上一个watcher（页面watcher）
手动 watcher.depend， 让 data 再收集一次 Dep.target，于是 data 又收集到 恢复了的页面watcher










 