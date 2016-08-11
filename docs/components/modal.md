---
layout: docs
title: Modal 弹出框服务
group: components
---

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## 使用说明
通过调用`$ccModal`服务来触发弹框及二次确认框。

## Methods

### `modal(options)`
生成 modal 实例,可以通过调用实例的 open 方法呼出弹出框。

options 包含以下配置:

|---------|----------|-----------|
|参数|类型|说明|
|scope|$scope|default: `$rootScope` modal需要继承的scope|
|title|string|default:`undefined` modal框的标题|
|style|object|default: `undefined` modal自定义样式。注意,modal组件有默认 min-height 和 min-width,如果需要设置小于该值|
|fullscreen|boolean|default:`false` 是否允许全屏|
|hasFooter|boolean|default:`false` 是否有底部按钮|
|body|string|default: `undefined` modal主体内容区,值为模板url|
|footer|string|default: `undefined` modal footer按钮区,值为模板url|
|locals|object|default: `undefined` 需要传递到modal控制器中的数据,以服务的方式注入|
|controller|class\|function|default: `undefined` modal对应的控制器,当使用弹出框默认的footer时,可以通过覆写控制器的ok、cancel、close方法实现自有逻辑(不覆写则为关闭弹框的默认逻辑)|
|controllerAs|string|default: `$ctrl` 控制器别名|
|bindings|object\|boolean|default: `undefined` 为true时则从scope中复制数据,为object则直接从提供的这个对象中复制数据(浅复制)|
|onClose|function|default: `undefined` 点击弹框右上角关闭按钮时触发的回调|
|uid|string|default: `undefined` 弹出框根节点绑定的 data-uid 属性的值,可以通过该特性做个性化弹框样式处理|

**Returns**  
`object`	modal实例,具备result属性。result为一个promise,modal确认时会触发promise resolve,取消时触发promise reject

### `confirm(msg, onClose)`

|---------|----------|-----------|
|参数|类型|说明|
|msg|string|default: `undefined` 二次确认信息,支持混入html模板|
|onClose|function|default: `undefined` 点击右上角关闭按钮时触发的回调|

**Returns**  
`object`	弹框实例,具备result属性。result为一个promise,modal确认时会触发promise resolve,取消时触发promise reject

## Examples
<iframe width="100%" height="600" src="//jsfiddle.net/Kuitos/hnbkk9sz/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
