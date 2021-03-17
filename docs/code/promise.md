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