---
layout: docs
title: dynamic-attr
group: components
maintainer: kui.liu
---

## Contents

* toc
{:toc}

## 动态属性绑定组件

组件: cc-dynamic-attr

类型: 属性(A)

| 参数名 | 是否必填 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| cc-dynamic-attr | 是 | `expression` | undefined | 对应属性计算结果为true时,载入相应指令,否则卸载相应指令(k-v 结构)。目前只支持 ng 内置的事件指令,如 ng-click、ng-blur 等 |

## Examples
{% highlight html %}
<button
    ng-click="app.click()"
    cc-dynamic-attr="{'ng-click': app.status}"
    >
    button
</button>
<button ng-click="app.status = !app.status">toggle</button>
{% endhighlight %}
