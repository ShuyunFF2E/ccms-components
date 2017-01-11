---
layout: docs
title: Area Selector
group: components
maintainer: ying.du
-------------------

  ## Contents  

* toc 
{:toc}  

## 使用说明
 通过调用`$ccAreaSelector`服务来触发地址选择器的弹框

  ## Methods

### `areaSelector(options)`
生成 areaSelector实例,可以通过调用实例的 open 方法呼出弹出框.

options 包含以下配置:
|---------|----------|-----------|
|参数|类型|说明|
|scope|$scope|default: `$rootScope` areaSelector需要继承的scope|
|locals|object|default: `undefined` 需要传递到areaSelector控制器中的数据,以服务的方式注入|

**Returns**
`object`	areaSelector实例,具备result属性。result为一个promise,modal确认时会触发promise resolve,取消时触发promise reject

## Examples
<iframe width="100%" height="400" src="//jsfiddle.net/Dale_/hnbkk9sz/5/embed/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
