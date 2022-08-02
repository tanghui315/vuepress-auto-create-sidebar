const docConfig = require('../doc.config.json')

const { searchPlugin } = require('@vuepress/plugin-search')
const { backToTopPlugin } = require('@vuepress/plugin-back-to-top')
const { mediumZoomPlugin } = require('@vuepress/plugin-medium-zoom')
const { nprogressPlugin } = require('@vuepress/plugin-nprogress')
const taskLists = require('markdown-it-task-lists')

const { defaultTheme } = require('vuepress')
const sidebar = require('./auto-sidebar')



module.exports = {
  base: '',
  dest: 'dist',
  public: 'runtime/public',
  lang: 'zh-CN',
  title: docConfig.title,
  description: docConfig.description,

  plugins: [
    searchPlugin({
      hotKeys: ['/']
    }),
    backToTopPlugin(),
    mediumZoomPlugin(),
    nprogressPlugin()
  ],

  extendsMarkdown: (md) => {
    md.use(taskLists);
  },

  theme: defaultTheme({
    sidebar: sidebar.getSidebar(),
  })
}
