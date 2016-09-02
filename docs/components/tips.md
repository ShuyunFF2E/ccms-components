---
layout: docs
title: tips
group: components
maintainer: kui.liu
---

## Contents

* toc
{:toc}

## 消息提示组件

组件: cc-tips

类型: 元素(E)

| 参数名 | 是否必填 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| msg | 是 | `string` | undefined | 提示信息内容 |
| type | 否 | `string` | normal | 提示信息类型,默认为普通类型。可选的有: major(重要常显) warning(警告常显) |

## 浮动消息提示

服务: $ccTips

Methods:

* success(msg, container)

	弹出操作成功的消息提示,可指定提示出现的区域(默认为业务系统业务模块区)。成功提示3秒之后自动消失(或手动点击关闭按钮)。
		
	returns: tips instance (包含 open/close 方法)
		
* error(msg, container)

	弹出操作失败的消息提示,可指定提示出现的区域(默认为业务系统业务模块区)。只能手动关闭。
	returns: tips instance (包含 open/close 方法)

## Examples

<iframe width="100%" height="600" src="//jsfiddle.net/Kuitos/y4rd7mus/embedded/html,js,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
