---
layout: docs
title: Menus组件使用说明
group: components
maintainer: chaoyang.mu
---

### menu-bar : 指令配置,其中包括如下:(*required*)
--

*           unfold: `Boolean`(default:**true**) 菜单展开标记
*        on-unfold: `Function`(default:**null**) 菜单展开收起回调函数
*    menu-source: `Array|ngResource` 菜单资源对象，若是`ngResource`时，获取菜单数据时调用其get方法
*    shop-source: `Array|ngResource` 店铺资源对象，若是`ngResource`时，获取菜单数据时调用其get方法
*     search-placeholder: `String`(default:**请输入店铺名称**) 店铺搜索框placeholder提示文字


### `$menus`配套服务
--

* `const current = $menus.getCurrentPlatShop();` : 获取当前选中店铺信息 

### `EventBus.on`事件订阅(需要引用angular-es-utils/event-bus,将其import到业务代码)
--

* `EventBus.on('menu:change', menu => { // TODO 相关操作 });`：监听菜单信息变化

* `EventBus.on('shop:changeStart', (shop, defer) => { // TODO 相关操作});`: 将要切换店铺时触发（不建议在其中使用`$menus.getCurrentPlatShop()`获取当前选中的店铺）

* `EventBus.on('shop:change', (shop, defer) => { // TODO 相关操作});`: 店铺切换成功后触发

`EventBus`的使用步骤：

	1. npm install angular-es-utils
	
	2. 在代码中使用import将其引入即 import {EventBus} from 'angular-es-utils';
	
	3. 接下来使用EventBus.on('订阅名称', change => {// TODO 相关操作});



### `$scope.$on`事件广播**（此类监听不建议使用，并且此类监听将在下版本中移除，请修改为EventBus）**
---

* `$scope.$on('shop:changeStart', (event, defer) => { // TODO 相关操作});`: 将要切换店铺时触发（不建议在其中使用`$menus.getCurrentPlatShop()`获取当前选中的店铺）

* `$scope.$on('shop:change', (event, shop) => { // TODO 相关操作});`: 店铺切换成功后触发


将要切换店铺时触发的使用步骤：

	使用shop:changeStart监听,此监听会返回一个defer对象,当需要确认切换时调用defer.resolve();正常切换；当需要阻止切换调用defer.reject();阻止切换；
    
详细情况调用请查看下面例子:

## Example

<iframe width="100%" height="300" src="//jsfiddle.net/maxmu/hhf5y6ob/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

