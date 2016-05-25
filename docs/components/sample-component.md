---
layout: docs
title: Simple component
group: components
redirect_from: "/components/"
---

{% callout info %}
#### 提醒
这是一篇样例文档
{% endcallout %}

{% callout warning %}
这篇文档的细节须要补充。
{% endcallout %}

{% callout danger %}
请勿删除。
{% endcallout %}

## Contents (< _ <, table of contents)

* toc 需要一个列表标记，必须的，本行的开头用了星号（*）
{:toc}

## Examples

<script src="{{ site.baseurl }}/demos/modal/modal.js"></script>

<div ng-app="demos.modal" ng-controller="ctrl as Ctrl">

{% example html%}
<button type="button" ng-click="openBase()">open base modal</button>
<button type="button" ng-click="open()">open modal</button>
<button type="button" ng-click="confirm()">confirm</button>
{% endexample %}

</div>

## Test highlight

### Highlight html

{% highlight html %}
<div class="test-highlight-html"></div>
{% endhighlight %}

### Highlight css

{% highlight css %}
body {
  font-size: 2rem;
}
{% endhighlight %}

### Highlight js

{% highlight js %}
window.alert('...');
{% endhighlight %}

## Use markdown table

| Handle | Description |
| --- | --- |
| `ctrl.openBase()` | 打开一个基础的 `modal`. |

