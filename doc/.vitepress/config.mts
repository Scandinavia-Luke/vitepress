import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid"
import { set_sidebar } from './utils/auto-gen-sidebar.js'

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  base: '/vitepress/',
  lang: 'zh-CN',
  title: "Scandinavia Luke",
  description: "一个Scandinavia Luke的VitePress站点",
  head: [['link', { rel: 'icon', href: '/img/tutorial-64.ico' }]],
  themeConfig: {
    logo: '/img/vitepress-logo-mini.svg',
    // https://vitepress.dev/reference/default-theme-config
    outlineTitle: '导航目录',
    outline: [2, 3], // outline定义展示的标题级别，这里定义2-6级标题
    sidebarMenuLabel: '导航菜单', // 移动端侧边栏菜单按钮文字
    returnToTopLabel: '回到顶部', // 移动端返回顶部按钮文字
    // 页面底部上一页/下一页链接文字
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    // 导航栏配置
    nav: [
      { text: '首页', link: '/' },
      { text: 'VitePress 示例', link: '/示例/1.markdown-examples' },
      { text: '教程', link: '/tutorial/config-replace-floor-switch' },
      // { text: '配置更换楼层交换机', link: '/config-replace-floor-switch' }
    ],
    // 侧边栏配置
    sidebar: {
      '/示例': set_sidebar('/示例'),
      '/tutorial': set_sidebar('/tutorial'),
      /* '/示例/': [
        {
          text: 'VitePress 示例',
          items: [
            { text: '1.Markdown 示例', link: '/示例/1.markdown-examples' },
            { text: '2.Runtime API 示例', link: '/示例/2.api-examples' },
            { text: '3. .nojekyll文件分析', link: '/示例/3.nojekyll-analysis.md' },
          ]
        }
      ],
      '/tutorial/': [
        {
          text: '教程',
          items: [
            { text: '1.配置更换楼层交换机', link: '/tutorial/config-replace-floor-switch' }
          ]
        }
      ] */
    },
    // 社交链接，内置国外，国内需通过svg代码设置
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2026 Scandinavia Luke. All rights reserved.',
    },
    // 搜索功能
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档',
          },
          modal: {
            noResultsText: '没有找到相关文档',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择文档',
              navigateText: '导航到文档',
              closeText: '关闭搜索',
            }
          }
        }
      }
    }
  },
  // 配置markdown插件，用于渲染markdown图表
  markdown: {
    math: false,
    lineNumbers: true,
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详情',
    }
  },
  // 配置mermaid插件，用于渲染mermaid图表
   mermaid: {
    // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
  },
  mermaidPlugin: {
    class: "mermaid my-class", // set additional css classes for parent container
  },
}))
