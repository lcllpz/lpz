/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from "vuepress-theme-plume";

export default defineNavbarConfig([
  { text: "首页", link: "/" },
  { text: "博客", link: "/blog/" },
  // { text: '标签', link: '/blog/tags/' },
  // { text: '归档', link: '/blog/archives/' },
  {
    text: "前端基础",
    items: [
      { text: "HtmlAndCss", link: "/HtmlAndCss/" },
      { text: "Css", link: "/Css/README.md" },
      { text: "Javascript", link: "/Javascript/README.md" },
      { text: "浏览器", link: "/WebBrowser/README.md" },
      { text: "网络", link: "/Network/README.md" },
      { text: "Typescript", link: "/Javascript/README.md" },
    ],
  },
  {
    text: "前端工程化",
    items: [
      { text: "Webpack", link: "/Webpack/README.md" },
      { text: "Vite", link: "/Vite/README.md" },
      { text: "包管理工具", link: "/FrontTools/README.md" },
    ],
  },
  {
    text: "前端框架",
    items: [
      { text: "Vue", link: "/Vue/README.md" },
      { text: "React", link: "/React/README.md" },
    ],
  },
  { text: "面试", link: "/JobInterview/" },
  { text: "AI", link: "/AI/VibeCodeing.md" },
  { text: "场景", link: "/scenario/README.md" },

  // // { text: "", link: "/demo/README.md" },
  // { text: "示例", link: "/demo/README.md" },
  // {
  //   text: "React",
  //   // link: "/demo/README.md",
  //   items: [
  //     { text: "示例", link: "/demo/README.md" },
  //     { text: "React", link: "/demo/README.md" },
  //   ],
  // },
  // {
  //   text: "笔记",
  //   items: [

  //   ],
  // },
]);
