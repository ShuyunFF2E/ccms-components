---
layout: home
title: Home &middot; CCMS 组件库
---

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

{% callout danger %}
#### 样式冲突
由于 demo 直接嵌入在文档页面中，有时候会出现一些样式冲突，导致显示问题。

通常可以针对你的 demo 做一个样式覆写，统一写在 `docs/_sass/_CONFLICT.scss` 即可。
{% endcallout %}

