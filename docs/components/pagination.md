---
layout: docs
title: Pagination
group: components
---

## Contents

* toc
{:toc}

## pagination 指令配置

* `type` `String` (enum: ['normal', 'simple'], default: 'normal'), 设置分页的风格
* `totals` `Integer` (default: 0) 总条数
* `total-pages` `Integer` (default: 1) 总页数
* `page-num` `Integer` (default: 1) 当前页码
* `page-size` `Integer` (default: 20) 每页显示条目数
* `page-size-list` `Array(Integer)` (default: [10, 15, 20, 30, 50]) 每页显示条目数下拉选项
* `page-size-list-disabled` `Boolean` (default: false) 禁止配置每页显示条目数(disabled not hidden)
* `on-change` `Function` 翻页回调

## Examples

<iframe width="100%" height="400" src="//jsfiddle.net/arzyu/3aeku9ee/embedded/result,html,js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
