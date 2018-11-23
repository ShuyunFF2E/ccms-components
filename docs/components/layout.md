---
layout: docs
title: Layout使用说明
group: components
maintainer: chaoyang.mu, kui.liu
---

整个布局主要分为四部分:

{% callout info %}
建议使用
{% endcallout %}
* 主容器即 `cc-main-container`
* 左侧容器即 `cc-side-container` 
* 中间容器即 `cc-content-container`
* 右侧容器即 `cc-aside-container`

推荐示例代码：
{% highlight html%}
<main style="height: 100vh;">
	
	<article class="cc-main-container">
		
		<cc-menu-bar class="cc-side-container"
		             unfold="app.menusOptions.unfold"
		             on-unfold="app.menusOptions.unfoldClick"
		             menu-source="app.menusOptions.menusResource"
		             shop-source="app.menusOptions.shopsResource"
		             search-placeholder="app.menusOptions.searchPlaceholder">

		</cc-menu-bar>

		<ui-view class="cc-content-container"></ui-view>

		<aside class="cc-aside-container"></aside>

	</article>
	
</main>
{% endhighlight %}

{% callout danger %}
Deprecated！已不推荐使用！
{% endcallout %}

* 主容器即 `ccmsc-main-container` ,若左侧容器收起时,则需要添加 `contract-left`
* 左侧容器即 `left-container` 
* 中间容器即 `center-container`
* 右侧容器即 `right-container`

使用的过程中 **左侧容器、中间容器、右侧容器** 配置不变,只有**主容器**有相关变化,详情看以下举例。

## Layout模式一 (两栏)
默认配置分左右两栏,并且 **中间容器** 为主容器, **左侧容器** 收起时只需要给 **主容器** 样式添加 `contract-left`即可;

<iframe width="100%" height="300" src="//jsfiddle.net/maxmu/b0efy6no/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Layout模式二 (三栏,中间为主容器))
此配置分为左、中、右三栏,其中 **中间容器** 为主容器,此时只需要为 **主容器** 样式添加 `type-two`即可,另外 **左侧容器** 收起时只需要给 **主容器** 样式添加 `contract-left`即可;

<iframe width="100%" height="300" src="//jsfiddle.net/maxmu/mf52zjL8/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


## Layout模式三(三栏,右侧为主容器))
此配置分为左、中、右三栏,其中 **右侧容器** 为主容器, **中间容器** 为定固定宽度,此时只需要为 **主容器** 样式添加 `type-three`即可,另外 **左侧容器** 收起时只需要给 **主容器** 样式添加 `contract-left`即可;

<iframe width="100%" height="300" src="//jsfiddle.net/maxmu/0qvs4xnn/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

	
