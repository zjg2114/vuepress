# 发布-订阅

- 模式应用：Vue的响应式更新视图

```js
class Dep {
  constructor() {
    this.eventBus = [];
  }
  // 需要有三个方法,订阅/取消订阅/发布

  //订阅
  subscrible(event, callback) {
    if (
      typeof event !== "string" &&
      Object.prototype.toString.call(callback) !== "[object Function]"
    ) {
      throw new Error("传入参数格式错误");
    }
    if (!this.eventBus[event]) {
      this.eventBus[event] = [];
    }
    this.eventBus[event].push(callback.bind());
    // 链式调用
    return this;
  }
  // 取消订阅
  unsubscrible(event, callback) {
    if (
      typeof event !== "string" &&
      Object.prototype.toString.call(callback) !== "[object Function]"
    ) {
      throw new Error("传入参数格式错误");
    }
    if (!this.eventBus[event] || this.eventBus[event].length === 0) {
      throw new Error("没有事件可取消订阅");
    }
    this.eventBus[event].forEach((item, index, arr) => {
      if (item === callback) {
        arr.splice(index, 1);
      }
    });
    // 链式调用
    return this;
  }
  // 通知发布
  notify(event) {
    const args = [...arguments].slice(1);
    this.eventBus[event].forEach((callback) => {
      callback.apply(this, args);
    });
  }
}
let dep = new Dep();

const event1 = function () {
  console.log("event1触发");
};

dep.subscrible("click", event1).notify("click");
```
