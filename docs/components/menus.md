---
layout: docs
title: Menus组件使用说明
group: components
---


### menu-bar : 指令配置,其中包括如下:(*required*)
---

*                 unfold: `Boolean`(default:**true**) 菜单展开标记
*        unfold-callback: `Function`(default:**null**) 菜单展开收起回调函数
*    menus-data-resource: `Array|ngResource` 菜单资源对象，若是`ngResource`时，获取菜单数据时调用其get方法
*    shops-data-resource: `Array|ngResource` 店铺资源对象，若是`ngResource`时，获取菜单数据时调用其get方法
*     search-placeholder: `String`(default:**请输入店铺名称**) 店铺搜索框placeholder提示文字

### $menus配套服务
---

* $menus接口
	* `$menus.shopActive` : 获取当前选中店铺信息
* $rootScope 中注册监听
	* `$rootScope.$on('shopSelect', (event, shop) => { // TODO 相关操作});`: 监听当前选中店铺信息变化
	
* EventBus 中注册监听(需要引用angular-es-utils/event-bus,将其import到你的代码)
	* `EventBus.on('menuSelect', menu => { // TODO 相关操作 });`：监听菜单信息变化
	* `EventBus.on('shopSelect', shop => { // TODO 相关操作});`: 监听当前选中店铺信息变化  
	`import {EventBus} from 'angular-es-utils';`
	
	`angular-es-utils` [NPM安装地址](https://www.npmjs.com/package/angular-es-utils)

## Example

<iframe width="100%" height="300" src="//jsfiddle.net/maxmu/hhf5y6ob/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>



	
