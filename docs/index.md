---
layout: home
title: Home &middot; CCMS 组件库
---

## 组件库说明

1. 组件库提供的组件均以 `cc-` 作为前缀(ccms-components),如 `cc-grid`、`cc-tooltip`。
2. 组件库提供的服务均以 `$cc` 作为前缀, 如 `$ccModal`。

## 添加 Components 文档

以 `Simple Component` 为例

1.在 `docs/_data/nav.yml` 中 `Components` 下增加一行 `title` 

{% highlight yml %}
# docs/_data/nav.yml
- title: Components
  pages:
    - title: Simple Component
{% endhighlight %}

2.在 `docs/components/` 中创建 `simple-component.md`，在此编写你的文档内容。你的 demo 相关的文件放置在 `docs/demos/` 目录下。

3. [jsfiddle base](https://jsfiddle.net/Kuitos/bny6tf2x/)

4.常用的示例都已经写在 `docs/components/simple-component.md` 中，可以参考 [Sample component](//docs/components/sample-component/) 的效果。

