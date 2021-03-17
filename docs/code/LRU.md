# LRU算法

一种常见的缓存淘汰算法(最近最少使用), 比如Vue的keepalive的缓存策略

```js
// 数组和对象实现
class LruFir {
  constructor(max) {
    this.cache = {};
    this.keys = [];
    this.max = max;
  }
  get(key) {
    if (!this.keys.includes(key)) return "不存在";
    this.keys = this.keys.filter((item) => item !== key);
    this.keys.push(key);
    return this.cache[key];
  }
  add(key, value) {
    // 已存在的话 将keys中原本保留的key过滤重新添加
    if (this.keys.includes(key)) {
      this.keys = this.keys.filter((item) => item !== key);
    }
    // 如果超过限制
    if (this.keys.length >= this.max) {
      const preKey = this.keys.shift();
      delete this.cache[preKey];
    }
    this.cache[key] = value;
    this.keys.push(key);
  }
}

// Map实现
class LruSec {
  constructor(max) {
    this.max = max;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return "不存在";
    const preValue = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, preValue);
    return this.cache.get(key);
  }
  add(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    if (this.cache.size >= this.max) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}

const lru = new LruFir(3);
lru.add(1,1)
lru.add(2,2)
lru.add(1,3)
lru.add(3,3)
lru.get(2)
lru.add(4,4)
console.log(lru.cache);
console.log(lru.keys);

```
