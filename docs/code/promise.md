# Promise

-实现异步操作队列化，按照期望的顺序执行

```js
class MyPromise {
    constructor(executor){

        // then方法注册的resolve事件队列
        this._resolveQueue=[]

        // then方法注册的reject事件队列
        this._rejectQueue=[]

        // 定义resolve方法
        let _resolve = (val) => {
            console.log(4); 
            while(this._resolveQueue.length > 0){
                // 当队列中有事件时 回调函数被调用
                const callBack = this._resolveQueue.shift()
                callBack(val)
            }
        }

        // 同理实现reject
        let _reject = (val) => {
            while(this._rejectQueue.length > 0){
                // 当队列中有事件时 回调函数被调用
                const callBack = this._rejectQueue.shift()
                callBack(val)
            }
        }
        // new myPromise实例时调用传进来的函数 将定义好的relove 和reject传入
        executor(_resolve,_reject)   
    }
    // then 方法
    then(resloveFn,rejectFn) {
        console.log(2);
        this._resolveQueue.push(resloveFn)
        this._rejectQueue.push(rejectFn)
    }
}

const p1 = new MyPromise((resolve, reject) => {
    console.log(1);
    setTimeout(() => {
      resolve('result')
    }, 1000);
})

p1.then(res=>{
    console.log(res);
})
console.log(3);

// 1,2,3,4,result
// 1.执行new promise的函数,遇到定时器任务，放定时器队列
// 2.then 方法调用 将事件推到队列中
// 3.执行下面的同步代码
// 4.定时任务被执行 resolve执行 调用then传入的方法
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
