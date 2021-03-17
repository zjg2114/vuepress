module.exports = {
  title: "joe's blog",
  description: '周俊贵个人博客',
  head: [
    ['link', { rel: 'icon', href: `/favicon.ico` }]
  ],
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      {
        text: '源码分析',
        items: [
          { text: 'vue', link: '/code-analysis/vue-analysis/reactive/' },
          { text: 'react', link: '/code-analysis/react-analysis/' }
        ]
      },
      { text: '基础理论', link: '/basic-knowledge/javascript' },
      { text: 'coding', link: '/code/debounce&throttle' },
      { text: '日常笔记', link: '/daily-record/io' }
    ],
    sidebar: {
      '/code-analysis/vue-analysis/': [
      {
        title: '深入响应式原理',
        collapsable: false,
        children: [
          'reactive/',
          'reactive/reactive-object',
          'reactive/getters',
          'reactive/setters',
          'reactive/next-tick',
          'reactive/computed-watcher',
          'reactive/extra-question',
        ]
      },],
      '/basic-knowledge/': ['javascript','es2015+','network'],
      '/code/':['debounce&throttle','bind&call&apply','array_method','promise','watcher','subscrible&publish','LRU',"tree"],
      '/daily-record/': ['io','el-cascader','npm','mysql日期时间类型'],
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@asserts': '/asserts'
      }
    }
  }
};
