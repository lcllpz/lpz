---
title: css计算过程
createTime: 2026/03/15 22:59:35
permalink: /HtmlAndCss/vt05yez2/
---

## 浏览器查看最终结果样式

![](https://raw.githubusercontent.com/lcllpz/storage-imgs/main/css计算过程/1.浏览器查看最终结果样式.png)

## 过程

- 属性值的计算过程、视觉格式化模型
- 宽高（padding、border、margin）设置的 `auto`、`rem`、`vh`、`vw`、`%`、`em` 都会被转成 `px`
- `属性值的计算过程：元素所有 CSS 属性没有值到有值的过程`

![](https://raw.githubusercontent.com/lcllpz/storage-imgs/main/css计算过程/属性值的计算过程.png)

### 1. 确定声明值

- 找到**没有冲突**的样式值直接作为计算后的最终样式。这个设置确定的值，不再进行 **2、3 步骤**。
- 冲突：标签上的选择器中的样式设置（作者样式表）与浏览器设置的默认值样式的冲突。

![](https://raw.githubusercontent.com/lcllpz/storage-imgs/main/css计算过程/确定声明值.png)

### 2. 层叠冲突

对冲突的值使用`层叠规则`，确定 CSS 的值。

#### 2.1 比较重要性

1. 作者样式表高于浏览器默认样式表

![](https://raw.githubusercontent.com/lcllpz/storage-imgs/main/css计算过程/1.比较重要性.png)

#### 2.2 比较特殊性（权重）

`!important` > 行内样式 > ID 选择器 > 类选择器 > 标签 > 通配符 > 继承（样式权重高的取赋值）

![](https://raw.githubusercontent.com/lcllpz/storage-imgs/main/css计算过程/2.比较特殊性权重.png)

#### 2.3 比较源次序

相同样式属性代码，后面覆盖前面的。

![](https://raw.githubusercontent.com/lcllpz/storage-imgs/main/css计算过程/3.比较源次序.png)

### 3. 继承

- 该属性值仍然还没有被赋值的情况下，若可以继承则继承。
- 可继承样式：宽度（`width`）和高度（`height`）属性默认是不会被继承的。

![](https://raw.githubusercontent.com/lcllpz/storage-imgs/main/css计算过程/继承1.png)
![](https://raw.githubusercontent.com/lcllpz/storage-imgs/main/css计算过程/继承2.png)

### 4. 使用默认值

- 对仍然没有值的属性，直接使用默认值。

![](https://raw.githubusercontent.com/lcllpz/storage-imgs/main/css计算过程/4.使用默认值.png)

### 5. 注意

该顺序并不是缺一不可的。1、2 步骤是可以影响 3、4 步骤的。（比如浏览器设置了默认值，代码也没有给这个属性赋值）：例子 -> `a` 标签（`color` 会在 1 步设置默认的样式）。

- 解决 CSS 不继承的问题：使用父元素的值 `inherit`
- CSS 设置默认值：`initial`
- 清除浏览器默认样式：`unset`（跳过 1、2 步）
- 恢复浏览器默认样式：`revert`（还原到具有由浏览器或用户创建的自定义样式表）

## 练习

```html
<body>
  <div class="box">
    <a href="">嘿嘿</a>
  </div>
  <div class="box2">
    <a href="" class="mya">嘿嘿2</a>
  </div>
</body>
<style>
  * {
    margin: 0;
    padding: 0;
  }

  div {
    width: 100px;
    height: 100px;
  }

  .box {
    color: red;
    outline: 1px;
  }

  .box2 {
    outline: 1px;
  }

  .mya {
    text-decoration: none;
    color: inherit;
    color: red;
  }
</style>
```

![](https://raw.githubusercontent.com/lcllpz/storage-imgs/main/css计算过程/结果.png)

### 1. 分析 `* { margin: 0; padding: 0; }` 这段代码的计算过程

#### 确定声明值

- 作者：`margin: 0; padding: 0;`
- 浏览器给默认值：
- 没有冲突，确定了值 `margin: 0; padding: 0;`，不会再进行后续。

### 2. 分析第一个 `a` 元素为啥没有被设置为红色

#### 确定声明值

- 作者：
- 浏览器给默认值：`color: -webkit-link;`
- 没有冲突，确定了值 `margin: 0; padding: 0;`，不会再进行后续。

### 3. 分析第二个 `a` 元素为啥没有被设置为红色

#### 确定声明值

- 作者：`color: inherit;`
- 浏览器给默认值：`color: -webkit-link;`
- 冲突

#### 层叠

1. 比较重要性
   `color: inherit;` > `color: -webkit-link;`
   所以确定为 `color: inherit;`，`inherit` 获取父级的 `color`，不会再进行后续。

### 4. 分析第 `p` 元素为为红色

#### 确定声明值

- 作者：`color` 没有设置
- 浏览器给默认值：`color` 没有设置
- 冲突

#### 层叠

1. 比较重要性
   作者：`color` 没有设置
2. 权重
   作者：`color` 没有设置
3. 顺序
   作者：`color` 没有设置

#### 继承

父级有 `color: red` 给它。
