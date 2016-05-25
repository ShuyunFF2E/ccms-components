/**
 * Created with app.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-03-04 10:36 AM
 * To change this template use File | Settings | File Templates.
 */


/**
 * menu-bar 指令使用说明:
 *
 *  <menu-bar options="menusOptions"></menu-bar>
 *
 *  options : 指令配置,其中包括如下:
 *
 *           unfold: 菜单展开标记   (bool)默认 true
 *      unfoldClick: 菜单展开收起回调函数  (function)默认为null
 *    menusResource: 菜单数据集合或者Resource  (array 或者 Resource)
 *       menusQuery: 菜单数据Resource查询参数  (object)
 *
 *            shops: 店铺配置是否启用   (bool) 默认false
 *    shopsResource: 店铺数据集合或者Resource  (array 或者 Resource)
 *       shopsQuery: 店铺数据Resource查询参数  (object)
 *
 * 样例:
 *
 * const shops=[],
 *       options={
 *			unfold: true,
 *			unfoldClick: () => {console.log('菜单展开或者收起');},
 *			shops: true,
 *			menusQuery: {
 *		     a:111
 *			},
 *			shopsQuery: null,
 *			menusResource: $resource('menus/'),
 *			shopsResource: shops
 *	  	}
 *
 *
 *  // -查询店铺是否有更改
 *  $rootScope.$on('shopSelect', function (event, shop) {
 *	 console.log(shop);
 *	// -查询当前选择的店铺
 *	 console.log('$menus.active:', $menus.shopActive);
 *  });
 *
 */



angular.module('componentsApp', ['ccms.components', 'ui.router', 'ngResource'])

	.controller('ctrl', function ($scope, $timeout, $resource) {

		var shops = [
			{
				"name": "天猫店铺",
				"value": "tb",
				"active": true,
				"child": [
					{
						"name": "小猫时尚旗舰店",
						"active": true,
						"value": "tb-cut",
						"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
					},
					{
						"name": "小狗时尚旗舰店",
						"value": "tb-dog",
						"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
					},
					{
						"name": "小仔时尚旗舰店",
						"value": "tb-cub",
						"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
					},
					{
						"name": "洋陽轩旗舰店",
						"value": "tb-yy",
						"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
					}
				]
			},
			{
				"name": "京东店铺",
				"value": "jd",
				"child": [
					{
						"name": "小猫时尚旗舰店",
						"value": "jd-cut",
						"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
					},
					{
						"name": "小狗时尚旗舰店",
						"value": "jd-dog",
						"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
					},
					{
						"name": "小仔时尚旗舰店",
						"value": "jd-cub",
						"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
					},
					{
						"name": "洋陽轩旗舰店",
						"value": "jd-yy",
						"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
					}
				]
			}
		];

		var menus = [
			{
				"name": "忠诚度设置",
				"state": "card",
				"icon": "",
				"child": [
					{
						"name": "积分类型",
						"state": "card.point",
						"icon": "",
						"child": []
					},
					{
						"name": "等级类型",
						"state": "card.grade",
						"icon": "",
						"child": []
					}
				]
			},
			{
				"name": "TAE会员专区",
				"state": "views",
				"icon": "",
				"child": [
					{
						"name": "界面设置",
						"state": "views.set",
						"icon": "",
						"child": [
							{
								"name": "手淘",
								"state": "views.set.st",
								"icon": "",
								"child": []
							}
						]
					},
					{
						"name": "赚积分",
						"state": "views.point",
						"icon": "",
						"child": [
							{
								"name": "签到",
								"state": "views.point.sign",
								"icon": "",
								"child": [
									{
										"name": "再签到",
										"state": "views.point.sign.reload",
										"icon": "",
										"child": []
									}
								]
							}
						]
					}
				]
			},
			{
				"name": "会员等级管理",
				"state": "grade",
				"icon": "",
				"child": []
			}
		];

		var self = this;

		//$resource('/pages');

		self.menusOptions = {
			unfold: true,
			unfoldClick: function (unfold) {
				console.log('结果:', unfold);
			},
			shops: true,
			menusResource: $resource('/menus'),
			//menusResource: menus,
			//shopsResource: $resource('/shops')
			shopsResource: shops
		};
	})
	.config(routerConfig)
	.run(runConfig);

routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
function routerConfig($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('card', {
			abstract: true,
			url: '/card',
			template: '<div ui-view></div>'
		})
		.state('card.point', {
			url: '/point',
			template: '积分类型'
		})
		.state('card.grade', {
			url: '/grade',
			template: '等级类型'
		})
		.state('views', {
			abstract: true,
			url: '/views',
			template: '<div ui-view></div>'
		})
		.state('views.set', {
			url: '/set',
			abstract: true,
			template: '<div ui-view></div>'
		})
		.state('views.set.st', {
			url: '/st',
			template: '手机淘宝'
		})
		.state('views.point', {
			abstract: true,
			url: '/point',
			template: '<div ui-view></div>'
		})
		.state('views.point.sign', {
			abstract: true,
			url: '/sign',
			template: '<div ui-view></div>'
		})
		.state('views.point.sign.reload', {
			url: '/sign',
			template: '签到绘声绘色'
		})
		.state('grade', {
			url: '/grade',
			template: '任性的一哥们儿'
		});
	$urlRouterProvider.otherwise('views/point/sign/sign');
}

runConfig.$inject = ['$state', '$rootScope', '$menus'];
function runConfig($state, $rootScope, $menus) {
	$rootScope.$state = $state;

	// -查询店铺是否有更改
	$rootScope.$on('shopSelect', function (event, shop) {
		console.log(shop);
		console.log('$menus.active:', $menus.shopActive);
	});
}
