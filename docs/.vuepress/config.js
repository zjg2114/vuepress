module.exports = {
  title: "joe's blog",
  description: '周俊贵个人博客',
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      {
        text: '源码分析',
        items: [
          { text: 'vue', link: '/code-analysis/vue-analysis/' },
          { text: 'react', link: '/code-analysis/react-analysis/' }
        ]
      },
      { text: '基础理论', link: '/basic-knowledge/' },
      { text: '项目实践', link: '/project/' }
    ],
    sidebar: {
      '/code-analysis/vue-analysis/': ['', 'reactive','computed'],
      '/basic-knowledge/': ['javascript', 'css','network'],
    }
  }
};
