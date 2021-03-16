# 响应式数据

- vue 初始化阶段会调用\_init 方法,其中会有 initState对 data，props，computed，watch 做处理

  ```js
  function initState(vm) {
    var opts = vm.$options;
    // 其中还有 props，computed，watch 等选项处理
    if (opts.data) {
      initData(vm);
    }
  }
  ```

- initData主要对data进行初始化操作，最后通过observe来监测数据的变化

```js
function initData(vm) {
  // data就是我们在vue文件中定义的data
  var data = vm.$options.data;
  // 判断data是否是函数(为什么每个vue实例的data需要是个函数)
  data = typeof data === "function" ? data.call(vm, vm) : data || {};
  // ... 遍历 data 数据对象的key，重名检测，合规检测，访问代理等代码
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          `Method "${key}" has already been defined as a data property.`,
          vm
        )
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        `Use prop default value instead.`,
        vm
      )
      // 保留字符
    } else if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  observe(data, true /* asRootData */);
}
```

- observe 方法的作用就是给非 VNode 的对象类型数据添加一个 Observer，如果已经添加过则直接返回，否则实例化一个 Observer 对象实例。

```js
function observe(value) {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
   let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  }else if{
    ob = new Observer(value);
  }
  return ob;
}
```

- Observer 是一个类，它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新

```js
export class Observer {
  value: any;
  dep: Dep;
  // 往data中添加__ob__
  constructor(value: any) {
    this.value = value;
    this.dep = new Dep();
    def(value, '__ob__', this)
    // 如果是Array
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      this.observeArray(value);
    } else {
    // 如果是Object
      this.walk(value);
    }
  }
    walk(obj: Object) {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
      // 遍历对象的数据做劫持
      defineReactive(obj, keys[i]);
      }
    }
    observeArray(items: Array<any>) {
      for (let i = 0, l = items.length; i < l; i++) {
        observe(items[i]);
      }
    }
}
```

- Observer 的构造函数的逻辑主要是：实例化 Dep 对象(管理Watcher)，接着通过执行 def 函数把自身实例添加到数据对象 value 的 __ob__ 属性上，然后对 value 做判断，对于数组会做一些额外处理（后面再说）然后调用 observeArray 遍历数组循环调用observe方法，如果是对象则调用 walk 方法。最终都会执行 defineReactive 方法。

- defineReactive 的核心就是利用 Object.defineProperty 给数据添加了 getter 和 setter，目的就是为了在我们访问数据以及写数据的时候能自动执行一些逻辑：getter 做的事情是依赖收集，setter 做的事情是派发更新，接下来我们就重点对这两个过程分析。

```js
function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean) 
{
  // dep 用于中收集所有依赖
  const dep = new Dep();
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }
    // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  //shallow 只做浅层响应式
  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        const value = getter ? getter.call(obj) : val
        if (Dep.target) {
          dep.depend()
          if (childOb) {
            childOb.dep.depend()
            if (Array.isArray(value)) {
              dependArray(value)
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        const value = getter ? getter.call(obj) : val
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        if (setter) {
          setter.call(obj, newVal)
        } else {
          val = newVal
        }
        childOb = !shallow && observe(newVal)
        dep.notify()
      }
    })
}
```
