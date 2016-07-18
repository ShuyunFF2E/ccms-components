---
layout: docs
title: Dropdown
group: components
---

## Contents

* toc
{:toc}

## 单选 | dropdown-select

### 指令配置参数

* model `item[mapping.valueField]` 单选绑定的变量，为选项值
* datalist `Array` (default: []) 数据源
* mapping `Object` 自定义数据字段映射
	* valueField `String` (default: 'value') 数据源值字段映射
	* displayField `String` (default: 'title') 数据源显示字段映射
* placeholder `String` (default: '') 提示文本
* searchable `Boolean` (default: false) 启用搜索功能

### Examples

<iframe width="100%" height="400" src="//jsfiddle.net/arzyu/9hsa6ds1/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## 多选 | dropdown-multiselect

### 指令配置参数

* model `Array(item[mapping.valueField])` 多选绑定的变量，为选项值的列表
* datalist `Array` (default: []) 数据源
* mapping `Object` 自定义数据字段映射
	* valueField `String` (default: 'value') 数据源值字段映射
	* displayField `String` (default: 'title') 数据源显示字段映射
* placeholder `String` (default: '') 提示文本
* searchable `Boolean` (default: false) 启用搜索功能
* confirm-button `Boolean` (default: false) 启用"确认/取消"选择的按钮

### Examples

<iframe width="100%" height="400" src="//jsfiddle.net/arzyu/9hsa6ds1/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

