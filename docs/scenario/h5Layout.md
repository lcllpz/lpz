---
title: h5布局篇
createTime: 2026/03/26 22:25:26
permalink: /scenario/3sdc5wr4/
---

## 核心单位深度解析

在布局设计时，我通常把这些单位分为三类：**绝对单位**、**视口单位**和**相对单位**。

### 1. 绝对单位

- **`px` (Pixels - CSS 像素)**：
  - **概念**：逻辑像素（独立于设备的像素）。在正常缩放比例下，它是最基础的度量单位。
  - **使用场景**：边框（`border: 1px`）、极小间距、不需要随屏幕缩放的固定元素、以及在 PC 端页面布局中的核心单位。

### 2. 视口单位 (Viewport Units) —— 现代移动端的主力

- **`vw` / `vh` (Viewport Width / Height)**：
  - **概念**：`1vw` 等于视口宽度的 1%，`1vh` 等于视口高度的 1%。
  - **使用场景**：取代 `rem` 的最佳方案。实现元素的尺寸、字体随屏幕宽度等比缩放。
- **`dvw` / `dvh` (Dynamic Viewport Width / Height) —— [高级必会]**：
  - **概念**：动态视口单位。
  - **痛点解决**：在手机浏览器（尤其是 Safari 和微信内置浏览器）中，上下滑动时**地址栏和底部工具栏会收缩或展开**。如果使用 `100vh`，当工具栏出现时，页面底部会被遮挡（出现滚动条）。`100dvh` 会**动态计算**当前实际可视区域的高度，完美解决首屏 100% 高度的适配问题。
  - **使用场景**：移动端全屏页面（如大屏 H5 抽奖页、首屏 Banner）。

### 3. 相对单位

- **`rem` (Root EM)**：
  - **概念**：相对于 HTML 根标签 `<html>` 的 `font-size` 进行计算。如果 `html { font-size: 16px; }`，那么 `1rem = 16px`。
  - **历史地位**：曾经移动端适配的王者（搭配 JS 动态计算根字体大小）。
  - **现状**：由于 `vw` 的普及，现在已经**不推荐**作为移动端缩放的首选方案（因为需要依赖 JS 介入，有页面闪烁风险），但在某些特定组件库中仍有应用。
- **`%` (Percentage)**：
  - **概念**：相对于其**包含块（通常是父元素）**的对应属性进行计算。
  - **痛点**：高度的百分比（`height: 100%`）只有在父元素有明确高度时才生效；`margin/padding` 的百分比计算是基于父元素的**宽度**（这是个高频面试题）。
  - **使用场景**：流式布局（如栅格系统 `width: 50%`）、占满父容器。
- **`em`**：
  - **概念**：用于字体大小时，相对于**父元素**的字体大小；用于长度单位（如 width）时，相对于**当前元素自身**的字体大小。
  - **痛点**：容易发生层级嵌套导致的级联放大/缩小，极其难以维护。
  - **使用场景**：极少用于宏观布局。通常只用于文本周围的间距控制（如首行缩进 `text-indent: 2em`）或 SVG Icon 与文字大小的等比对齐。

## 平时开发场景及 vw 的缺陷

在“**只有一份 375px 设计稿、追求一套代码低成本打天下**”的真实开发场景中，一套代码兼容 H5、Pad、PC、微信”且要求“开发省事”的场景。

- `vw` 的致命缺陷就是：**它永远相对于物理视口（浏览器窗口）计算。** 这意味着，即使你在最外层容器写了 `max-width: 480px; margin: 0 auto;` 试图在 PC 端把页面居中并限制宽度，但里面的元素如果写了 `width: 50vw`，在 1920px 的显示器上，它依然会变成 960px 宽，直接冲破容器，变成巨大的“脸盆 UI”。
- 如果只在 h5 或者 pc 一端那就是非常适合。在 pc 中即使放大缩小也能动态的调整页面，因为 vw 是视口单位

### 方案一：px->vw

**核心思想**：开发依然只写 `px`，完全不用管适配。交由 PostCSS 插件在编译时，自动生成一套“移动端用 `vw`，大屏端锁定为 `px`”的代码。

这里我强烈推荐一个专门解决此中国式业务痛点的插件：**`postcss-mobile-forever`**。

#### 运作原理：

它会在屏幕小于某个界限（如 768px）时，把你的 `px` 转成 `vw` 等比缩放；当屏幕大于这个界限（Pad、PC 端）时，它会自动帮你把宽度锁定，并限制在居中的容器内。

#### 如何使用：

1. 安装插件：`npm i postcss-mobile-forever -D`
2. 在 `postcss.config.js` 中配置：

```javascript
module.exports = {
  plugins: {
    "postcss-mobile-forever": {
      viewportWidth: 375, // 设计稿宽度
      maxDisplayWidth: 600, // 超过 600px 的屏幕（如 Pad/PC）将停止放大！
      rootSelector: "#app", // 你的 Vue/React 根容器 ID
      appSelector: "#app", // 限制最大宽度的容器
      border: true, // 在桌面端居中显示时，自动加个边框或阴影以示区分
    },
  },
};
```

**优点**：前端开发“完全无感”，直接照抄设计稿 px。构建工具解决一切，完美实现手机端等比放大，Pad/PC 端居中且尺寸正常。

#### 编译前后的真实对比

假设你的配置是：设计稿 `375px`，最大限制宽度 `600px`。

**你写的源代码（开发时）：**

```css
.box {
  width: 100px;
  font-size: 16px;
}
```

**经过 PostCSS 插件编译后的产物（打包后）：**

```css
/* 1. 默认情况（移动端）：转成 vw，实现等比缩放 */
.box {
  width: 26.66667vw; /* 100 / 375 * 100 */
  font-size: 4.26667vw; /* 16 / 375 * 100 */
}

/* 2. 注入媒体查询：当屏幕 >= 600px 时生效，覆盖上面的 vw */
@media (min-width: 600px) {
  .box {
    /* 这里的 px 是怎么来的？ 
       是按照 600px 屏幕时的极限比例算出来的：
       width: 100 * (600 / 375) = 160px
       font-size: 16 * (600 / 375) = 25.6px
    */
    width: 160px;
    font-size: 25.6px;
  }
}
```

---

#### 缺点（你可能会担心的点）：

1. **代码体积变大**：因为每个包含了 `px` 的类名，都会在底部生成一段 `@media` 代码，导致打包后的 `.css` 文件体积明显变大（大约增加 30% - 50%）。虽然文件体积变大了，但其实**完全不用担心**。因为增加的代码都是高度重复的（都是 `@media (min-width: 600px)`），而服务器开启 **Gzip 或 Brotli 压缩** 时，对这种重复文本的压缩率极高。实测下来，网络传输的真实体积增加几乎可以忽略不计（不到 2KB）。
2. 兼容性：比 rem 的兼容性略差点

**经过现代函数编译后的产物可能长这样：**

```css
.box {
  /* 
     min(随屏幕变大的vw值, 封顶的px极限值)
     在手机上：26.66vw 小于 160px，所以取 vw（等比缩放）
     在 Pad/PC 上：屏幕宽了，26.66vw 大于 160px 了，min() 就会取 160px（停止缩放）
  */
  width: min(26.66667vw, 160px);
  font-size: min(4.26667vw, 25.6px);
}
```

_注：目前市面上也有基于 `min()` 和 `clamp()` 函数的 PostCSS 插件（例如 `postcss-px-to-clamp`），它的原理就是利用 CSS 原生数学函数取代媒体查询，打包产物更小！但是 CSS 函数 min()、max() 和 clamp() 虽然极其优雅，但它们确实存在兼容性门槛。_

### 方案二：px->`rem`

**在面临“限制最大缩放比例”的需求时，`rem` 反而是最佳选择**！

#### 运作原理：

利用 PostCSS 把 `px` 转成 `rem`。然后写一小段 JS 监听屏幕宽度：当屏幕变宽，`font-size` 变大；但当屏幕宽到一定程度（比如大于 540px 时），`font-size` 锁定不变。

#### 如何使用：

1. PostCSS 使用传统的 `postcss-pxtorem` 插件。

- antd-mobile 也是基于 rem 所以会被影响，这里我排除掉

```js
// postcss.config.js
module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 37.5, // 确保这里是 37.5
      propList: ["*"],
      unitPrecision: 5,
      //   #app做宽度限制，所以不转rem
      selectorBlackList: ["#app"], // 忽略 #app 选择器下
      replace: true,
      mediaQuery: false,
      minPixelValue: 2,
      // 或者精准包含 antd-mobile
      exclude: (file) => {
        // 如果你希望 antd-mobile 也转，就只排除掉其他的 node_modules
        if (file.indexOf("antd-mobile") !== -1) return false;
        return /node_modules/i.test(file);
      },
    },
  },
};
```

2. 在项目 `index.html` 的 `<head>` 里加上这段核心的“封顶 JS”：

```html
<script>
  function setRem() {
    const html = document.documentElement;
    const clientWidth = html.clientWidth;

    // 核心逻辑：设置最大限制宽度（比如 540px）
    // 如果屏幕大于 540，就强制认为它是 540
    const maxWidth = 540;
    const designWidth = 375;

    const actualWidth = Math.min(clientWidth, maxWidth);

    // 假设设计稿下 1rem = 100px (方便计算)
    html.style.fontSize = (actualWidth / designWidth) * 100 + "px";
  }

  // 初始化和窗口缩放时触发
  setRem();
  window.addEventListener("resize", setRem);
</script>

<style>
  /* 在全局样式中，把身体居中，背景设为灰色，模拟大厂 H5 在 PC 的预览效果 */
  body {
    margin: 0;
    background-color: #f5f5f5; /* PC 端背景 */
  }
  #app {
    max-width: 540px; /* 和上面的 maxWidth 保持一致 */
    height: 100vh; /* dvh不生效兜底 */
    height: 100dvh;
    margin: 0 auto;
    background-color: #fff; /* 内容区背景 */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
</style>
**优点**：完全掌控缩放逻辑，一套代码在 Pad 和 PC
上表现为一个优雅的、居中的“手机壳”页面，绝不会出现超大字体。
```

### 总结：个人觉得`rem`最稳妥的经典方案

虽然方案一（通过 PostCSS 插件生成媒体查询限制 `vw`）在技术思路上看起来很“讨巧”且纯净（不需要 JS），但它在实际落地时有几个难以忽视的**工程化硬伤**，而这些正是方案二能完美解决的。

我们来深度对比如下，为什么最终大厂的这类业务都老老实实回到了方案二：

#### 为什么方案一（低 Star 插件）在生产环境有风险？

1.  **生态与维护风险（最致命）**：`postcss-mobile-forever` 或类似的插件通常是个人开发者为了解决某个特定业务痛点写的。Star 少意味着经过边缘测试（Edge Cases）的场景少。一旦你遇到复杂的 CSS（比如嵌套的 `calc()` 函数，或者使用了 CSS Modules），插件抛出 AST 转换错误，你连求助的地方都没有，甚至得自己去 fork 改源码。
2.  **第三方 UI 组件库的兼容灾难**：你大概率会用到 Vant (Vue) 或 Ant Design Mobile (React)。这些组件库的内部样式非常复杂。小众插件在转换这些第三方 Node_Modules 里的 CSS 时，极容易出现样式错乱或者漏转。
3.  **调试困难**：由于它在底层强行注入了大量的 `@media` 和覆盖样式，当你在浏览器控制台（DevTools）检查元素时，会看到长长的一串被划掉的样式，找真实的生效代码非常痛苦。

---

#### 为什么方案二（`rem` + JS 动态限制）是真正的工业级标杆？

如果你追求“一套代码打天下 + PC 端封顶居中”，方案二是目前**确定性最高、坑最少**的方案。

1.  **基建极其成熟**：它依赖的是 `postcss-pxtorem` 这个插件。这个插件有高达几千的 Star，几乎所有的移动端开源模板、UI 组件库官方文档（比如 Vant）都在推荐它。它对各种 CSS 语法的解析稳定得令人发指。
2.  **逻辑完全透明（极度可控）**：缩放的核心逻辑不在黑盒插件里，而在你写的那十几行 JS 代码里。你想限制 540px 还是 768px？你想在 PC 端加个特殊逻辑？直接改 JS 里的 `Math.min()` 即可，连刚入行的前端都能看懂并维护。
3.  **完美兼容第三方库**：只需在 PostCSS 配置里忽略掉不想转换的文件，或者利用 `rootValue` 函数针对第三方库做专门的比例设置，生态支持极其完善。

---
