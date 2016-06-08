---
layout: docs
title: Grid表格组件
group: components
redirect_from: "/components/"
---

### Grid配置

* opts 表格配置(required)
	* resource `ngResource`(default:null) 表格资源对象，获取数据时会调用其get方法
	* response `Object` 表格响应结果集，每次请求结束会更新，外部通过gridOpts.response可以获取
	* queryParams `Object`(default:null) 表格关联的查询参数
	* columnsDef `Object`(default:[]) 表格列定义，具备以下几个参数
		* displayName: `String` 字段展示名
		* field: `String` 字段
		* align: `String`(default:'left') 对齐方式 可选: center、left、right
		* width: `String` 列宽度 默认所有列等宽 如 width: '100px'
		* cellTemplate: `String` 表格元素的自定义html模板，支持全量的angular模板语法，上下文中包含变量entity(行数据实体)、column(列定义)
	* showPagination `Boolean`(default:true) 是否展示分页 
	* externalData `Array|Promise`(default:null) 当分页数据不由resource接口查询而来，可通过配置该参数展示数据。数据可以是一个数组，也可以是一个已经被resolve了的promise。**注意：该配置与resource配置互斥，当resource不为`null|undefined`时，该配置失效。**
	* headerTpl `String` 自定义表头模板，支持 字符串｜模板url
	* cellTpl `String` 表格元素模板，支持 字符串｜模板url
	* emptyTipTpl `String` 表格为空时的提示信息模板，支持 字符串｜模板url
	* pager `Object` 分页信息定义
		* totals `Number`(default:0) 数据总条数
		* totalPages `Number`(default:1) 总页数
		* pageNum `Number`(default:1) 当前页码
		* pageSize `Number`(default:20) 每页数据条数
		* pageSizeList `Array`(default:[10, 15, 20, 30, 50]) 可选的每页数据条数
* selectedItems `Array`(default:[]) 选中的数据集合
* type `String`(default:'default') 表格类型 目前支持'selectable'(带checkbox)配置。

### Grid配套服务

* $grid
	* refresh 手动刷新表格信息 return`Promise`

		```
		$grid.refresh(gridOpts, externalQueryParams).then(() => this.selectedItems.length = 0);
		```

### examples

基础表格:

<iframe width="100%" height="400" src="//jsfiddle.net/Kuitos/bny6tf2x/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

复杂表格:

<iframe width="100%" height="500" src="//jsfiddle.net/Kuitos/ypn7Lwza/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>




