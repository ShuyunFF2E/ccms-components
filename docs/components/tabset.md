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
| small | 否 | 大小设置 | Boolean |
| remove | 否 | 是否可删除选项 | Boolean |

指令： tab

| 参数名 | 是否必填 | 说明 | 类型 | 依赖组件 |
| --- | --- | --- | --- | --- |
| data | 是 | 数据源 | Object | tabset |

data数据说明：

| 参数名 | 是否必填 | 说明 | 类型 | 备注 |
| --- | --- | --- | --- | --- |
| title | 是 | tab标题 | String | -- |
| content | -- | tab普通内容 | String | 跟templateUrl取其一 |
| templateUrl | -- | 模板路径 | String |  跟content取其一 |
| scope | -- | 模板作用域 | Object | 需配合templateUrl使用，且才有效 |
| active | 否 | 是否选中 | Boolean | 优先级高，同时多选项设置最后一个生效 |
| disabled | 否 | 是否禁用tab操作 | Boolean | -- |
| event | 否 | 选中后的事件 | Function | 选中该选项后的一个回调 |

## Examples
<iframe width="100%" height="300" src="//jsfiddle.net/fawziwu/wbL4Lvef/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
