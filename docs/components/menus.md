---
layout: docs
title: Menus组件使用说明
group: components
---


### menu-bar : 指令配置,其中包括如下:(*required*)
---

*           unfold: `Boolean`(default:**true**) 菜单展开标记
*        on-unfold: `Function`(default:**null**) 菜单展开收起回调函数
*    menu-source: `Array|ngResource` 菜单资源对象，若是`ngResource`时，获取菜单数据时调用其get方法
*    shop-source: `Array|ngResource` 店铺资源对象，若是`ngResource`时，获取菜单数据时调用其get方法
*     search-placeholder: `String`(default:**请输入店铺名称**) 店铺搜索框placeholder提示文字


### $menus配套服务
---

* $menus接口
	* `$menus.shopActive` : 获取当前选中店铺信息
* $scope 中注册监听
	* `$scope.$on('shop:change', (event, shop, defer) => { // TODO 相关操作});`: 监听当前选中店铺信息变化
	
* EventBus 中注册监听(需要引用angular-es-utils/event-bus,将其import到你的代码)
	* `EventBus.on('menu:change', menu => { // TODO 相关操作 });`：监听菜单信息变化
	* `EventBus.on('shop:change', (shop, defer) => { // TODO 相关操作});`: 监听当前选中店铺信息变化  
	`import {EventBus} from 'angular-es-utils';`
	
	`angular-es-utils` [NPM安装地址](https://www.npmjs.com/package/angular-es-utils)

* 若在切换店铺时需要用户确认时,请按照以下方式配置:

    1. 注入 `$menus` 服务,然后执行 `$menus.autoClose = false;`启用切换限制;
    2. 在`shop:change`监听中,会返回一个defer对象,如果确认切换调用`defer.resolve();`执行正常切换,若需要阻止切换则调用`defer.reject();`;
    3. 此种情况下不建议使用`$menus.shopActive`来获取当前选中的店铺,其原因是当切换店铺,并且点击确认切换时,`$menus.shopActive`中的数据还没有及时更新,此情况下调用`$menus.activeShop`得到的还是上次的数据;
    
详细情况调用请查看下面例子:
    
    
## Example 

<iframe width="100%" height="300" src="//jsfiddle.net/maxmu/hhf5y6ob/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
