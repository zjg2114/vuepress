# Promise

-实现异步操作队列化，按照期望的顺序执行

```js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class myPromise {
  constructor(exector) {
    try{
      exector(this.resolve, this.reject);
    }catch(err){
      this.reject(err)
     }
  }
  status = PENDING;
  value = null;
  reason = null;
  filfilledCallback = [];
  rejectedCallback = [];
  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      while (this.filfilledCallback.length) {
        this.filfilledCallback.shift()(value);
      }
    }
  };
  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      while (this.rejectedCallback.length) {
        this.rejectedCallback.shift()(reason);
      }
    }
  };
  then(onFulfilled, onRejected) {
     const prePromise =  new myPromise((resolve, reject) => {
      if (this.status === PENDING) {
        this.filfilledCallback.push(()=>{

          queueMicrotask(()=>{
            try {
              const res = onFulfilled(this.value)
              resolvePromise(prePromise,res,resolve,reject)
            } catch (error) {
              reject(error)
            }
          });
        })
        this.rejectedCallback.push(()=>{
          queueMicrotask(()=>{
            try {
              const res = onRejected(this.reason)
              resolvePromise(prePromise,res,resolve,reject)
            } catch (error) {
              reject(error)
            }
          })
        });
      }
      if (this.status === FULFILLED) {
        queueMicrotask(()=>{
          try {
            const x = onFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            resolvePromise(prePromise,x, resolve, reject);
          } catch (error) {
            reject(error)
          }
        })
      }
      if (this.status === REJECTED) {
          queueMicrotask(()=>{
            try {
              const res = onRejected(this.reason)
              resolvePromise(prePromise,res,resolve,reject)
            } catch (error) {
              reject(error)
            }
          })
      }
    });
    return prePromise
  }
}
function resolvePromise(prePromise,x, resolve, reject) {
    if(prePromise === x){
      reject(new Error('不可循环引用'))
    }
  // 判断x是不是 MyPromise 实例对象
  if (x instanceof myPromise) {
    // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
    // x.then(value => resolve(value), reason => reject(reason))
    // 简化之后
    x.then(resolve, reject);
  } else {
    // 普通值
    resolve(x);
  }
}
module.exports = myPromise;

```

## 并发限制

```js
class RequestDecorator {
  constructor ({
    maxLimit = 5,
    requestApi,
  }) {
    // 最大并发量
    this.maxLimit = maxLimit;
    // 请求队列,若当前请求并发量已经超过maxLimit,则将该请求加入到请求队列中
    this.requestQueue = [];
    // 当前并发量数目
    this.currentConcurrent = 0;
    // 使用者定义的请求api，若用户传入needChange2Promise为true,则将用户的callback类api使用pify这个库将其转化为promise类的。
    this.requestApi = requestApi;
  }
  // 发起请求api
  async request(...args) {
    // 若当前请求数并发量超过最大并发量限制，则将其阻断在这里。
    // startBlocking会返回一个promise，并将该promise的resolve函数放在this.requestQueue队列里。这样的话，除非这个promise被resolve,否则不会继续向下执行。
    // 当之前发出的请求结果回来/请求失败的时候，则将当前并发量-1,并且调用this.next函数执行队列中的请求
    // 当调用next函数的时候，会从this.requestQueue队列里取出队首的resolve函数并且执行。这样，对应的请求则可以继续向下执行。
    if (this.currentConcurrent >= this.maxLimit) {
      await this.startBlocking();
    }
    try {
      this.currentConcurrent++;
      const result = await this.requestApi(...args);
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    } finally {
      console.log('当前并发数:', this.currentConcurrent);
      this.currentConcurrent--;
      this.next();
    }
  }
  // 新建一个promise,并且将该reolsve函数放入到requestQueue队列里。
  // 当调用next函数的时候，会从队列里取出一个resolve函数并执行。
  startBlocking() {
    let _resolve;
    let promise2 = new Promise((resolve, reject) => _resolve = resolve);
    this.requestQueue.push(_resolve);
    return promise2;
  }
  // 从请求队列里取出队首的resolve并执行。
  next() {
    if (this.requestQueue.length <= 0) return;
    const _resolve = this.requestQueue.shift();
    _resolve();
  }
}
```
