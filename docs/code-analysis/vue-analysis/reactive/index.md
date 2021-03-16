# Vue 的响应式原理

> Vue 的核心思想就是数据驱动，当开发者修改了响应式的数据,vue内部会帮我们更新视图
> Vue.js 实现响应式的核心是利用了Object.defineProperty，IE8 及以下浏览器不能兼容的原因就是不支持这个api。
