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


### `$ccMenus`配套服务
--

* `const current = $ccMenus.getCurrentPlatShop();` : 获取当前选中店铺信息 

* `$ccMenus.onShopChangeStart((defer, willPlatShop) => { // TODO 相关操作});`：店铺开始执行切换触发，回调中defer是一个推迟对象，willPlatShop是讲要切换的店铺信息。另外onShopChangeStart返回值为一个function，即销毁函数(在页面销毁的时候请运行此函数销毁此次监听)。 

* `const shopChange = $ccMenus.onShopChange((current => { // TODO 相关操作}));`：店铺切换成功后触发，回调中的current是指改变后的店铺信息。另外onShopChange返回值为一个function，即销毁函数(在页面销毁的时候请运行此函数销毁此次监听)。

* `$ccMenus.shopChangeEnable();`：设置店铺切换可用。

* `$ccMenus.shopChangeDisable();`：设置店铺切换不可用。

详细情况调用请查看下面例子:

## Example

<iframe width="100%" height="300" src="//jsfiddle.net/maxmu/hhf5y6ob/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

