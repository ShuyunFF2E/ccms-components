---
layout: docs
title: tabset
group: components
redirect_from: "/components/"
---

## Tabset组件

指令： tabset

参数说明：

| 参数名 | 是否必填 | 说明 | 类型 |
| --- | --- | --- | --- |
| tabs | 是 | 数据源 | Array |
| small | 否 | 版本 | Boolean |
| remove | 否 | 是否需要删除按钮 | Boolean |
| active | 否 | 第几个选中 | Number |
| onActive | 否 | 选中后触发 | Function |

tabs数据项 [object]：

| 参数名 | 是否必填 | 说明 | 类型 | 备注 |
| --- | --- | --- | --- | --- |
| title | 是 | tab标题 | String | -- |
| disabled | 否 | 是否禁用tab操作 | Boolean | -- |
| onActive | 否 | 选中后触发 | Function | 只在单项选中触发 |

<!-- TODO -->

## Examples
	> TODO

<iframe width="100%" height="300" src="//jsfiddle.net/fawziwu/wbL4Lvef/4/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
