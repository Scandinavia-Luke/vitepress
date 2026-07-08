// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import { inBrowser, type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { NProgress } from 'nprogress-v2/dist/index.js' // 导入进度条
import 'nprogress-v2/dist/index.css' // 导入进度条样式
// @ts-ignore
import busuanzi from 'busuanzi.pure.js'
import Bsz from './components/bsz.vue'
import './style.css'
import './style/index.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      // 指定组件使用layout-bottom插槽
      'layout-bottom': () => h(Bsz),
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    if (inBrowser) {
      NProgress.configure({ showSpinner: false })
      router.onBeforeRouteChange = () => {
        NProgress.start() // 开始进度条
      }
      router.onAfterRouteChange = () => {
        busuanzi.fetch()
        NProgress.done()
      }
    }
  }
} satisfies Theme
