---
layout: docs
title: tooltip
group: components
maintainer: kui.liu
---

## Contents

* toc
{:toc}

## tooltip 工具提示组件

组件: cc-tooltip

类型: 属性(A)

| 参数名 | 是否必填 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| cc-tooltip | 是 | `expression` | undefined | tooltip绑定的消息体 |
| tooltip-trigger | 否 | `string` | undefined | tooltip显示隐藏的触发时机,默认为`mouseenter``mouseleave`。调用者可以手动指定其他事件,目前只支持 dom 原生事件绑定 | 
| tooltip-placement | 否 | `string` | top-left | tooltip显示的位置,支持 top/top-left/top-right、bottom/bottom-left/bottom-right、left、right。注: tooltip会根据当前可视区域自动调整展示位置 |
| tooltip-opened | 否 | `expression` | undefined | 设置tooltip显示还是隐藏,boolean类型 |
| tooltip-type | 否 | `string` | normal | 工具提示展示方式,默认为 normal(普通气泡),支持 error-minor(错误提示气泡) 及 error-major(错误文字提示) 参考 form 组件介绍
| tooltip-append-to-body | 否 | `expression` | false | 默认tooltip追加到关联元素的后面作为兄弟元素, 为 true 时则添加为 body 的子元素 |
| tooltip-compilable | 否 | `expression` | false | tooltip绑定的消息体是否需要编译 |
| tooltip-open-delay | 否 | `string` | undefined | tooltip展示时的延时 |
| tooltip-close-delay | 否 | `string` | undefined | tooltip关闭时的延时 |

## Examples

<iframe width="100%" height="600" src="//jsfiddle.net/Kuitos/Ldvbmg09/embedded/html,js,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
