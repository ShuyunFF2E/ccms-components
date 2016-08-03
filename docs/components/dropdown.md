---
layout: docs
title: Dropdown
group: components
---

## Contents

* toc
{:toc}

## 下拉 | dropdown / dropdown-toggle / dropdown-panel

### dropdown 指令配置参数

* `is-open`: (可选参数)，**双向绑定**的变量，控制/获取下拉打开/关闭的状态
* `auto-close`: `Boolean(Expr)`，(default: true)，设置下拉是否自动关闭
* `on-dropdown-open`: `Function`，(可选参数)，下拉打开后的回调
* `on-dropdown-close`: `Function`，(可选参数)，下拉关闭后的回调

### Examples
<iframe width="100%" height="400" src="//jsfiddle.net/arzyu/dg3sm4nk/4/embedded/result,html,js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## 单选 | dropdown-select

### 指令配置参数

* `model`: **双向绑定**的变量，值为选中项的 value
* `datalist`: `Array` (default: []) 数据源
* `mapping`: `Object` 自定义数据字段映射
	* `valueField`: `String` (default: 'value') 数据源值字段映射
	* `displayField`: `String` (default: 'title') 数据源显示字段映射
* `placeholder`: `String` (default: '') 提示文本
* `searchable`: `Boolean` (default: false) 启用搜索功能
* `readonly` `Boolean` (default: false) 启用只读模式

### Examples

<iframe width="100%" height="400" src="//jsfiddle.net/arzyu/9hsa6ds1/embedded/result,html,js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## 多选 | dropdown-multiselect

### 指令配置参数

* `model`: **双向绑定**的变量，值为选中项的 value 列表
* `datalist`: `Array` (default: []) 数据源
* `mapping`: `Object` 自定义数据字段映射
	* `valueField`: `String` (default: 'value') 数据源值字段映射
	* `displayField`: `String` (default: 'title') 数据源显示字段映射
* `placeholder`: `String` (default: '') 提示文本
* `searchable`: `Boolean` (default: false) 启用搜索功能
* `confirm-button`: `Boolean` (default: false) 启用"确认/取消"选择的按钮

### Examples

<iframe width="100%" height="400" src="//jsfiddle.net/arzyu/opg6xamo/embedded/result,html,js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

