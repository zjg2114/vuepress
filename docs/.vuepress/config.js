module.exports = {
  title: "joe's blog",
  description: '周俊贵个人博客',
  head: [
    ['link', { rel: 'icon', href: '/docs/asserts/favicon.jpg' }]
  ],
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      {
        text: '源码分析',
        items: [
          { text: 'vue', link: '/code-analysis/vue-analysis/reactive' },
          { text: 'react', link: '/code-analysis/react-analysis/' }
        ]
      },
      { text: '基础理论', link: '/basic-knowledge/javascript' },
      // { text: '项目实践', link: '/project/' },
      { text: '日常笔记', link: '/daily-record/io' }
    ],
    sidebar: {
      '/code-analysis/vue-analysis/': ['reactive','computed'],
      '/basic-knowledge/': ['javascript','es2015+', 'css','network'],
      '/daily-record/': ['io','el-cascader','npm'],
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@asserts': '/docs/asserts'
      }
    }
  }
};
