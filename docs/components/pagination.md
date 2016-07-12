---
layout: docs
title: Pagination
group: components
---

## Contents

* toc
{:toc}

## pagination 指令配置

* type `String` (enum: ['normal', 'simple'], default: 'normal'), 设置分页的风格
* totals `Integer` (default: 0) 总条数
* totalPages `Integer` (default: 1) 总页数
* pageNum `Integer` (default: 1) 当前页码
* pageSize `Integer` (default: 20) 每页显示条目数
* pageSizeList `Array(Integer)` (default: [10, 15, 20, 30, 50]) 每页显示条目数下拉选项
* disablePageSizeList `Boolean` (default: false) 禁止配置每页显示条目数(disabled not hidden)
* onChange `Function` 翻页回调

## Examples

<iframe width="100%" height="400" src="//jsfiddle.net/arzyu/3aeku9ee/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
