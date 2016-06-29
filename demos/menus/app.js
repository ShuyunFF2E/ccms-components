/**
 * Created with app.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-03-04 10:36 AM
 * To change this template use File | Settings | File Templates.
 */

angular
	.module('componentsApp', ['ccms.components', 'ui.router', 'ngResource'])

	.controller('ctrl', function($scope, $timeout, $resource) {

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
				"url": "card",
				"icon": "",
				"children": [
					{
						"name": "积分类型",
						"url": "card.point",
						"icon": "",
						"children": []
					},
					{
						"name": "等级类型",
						"url": "card.grade",
						"icon": "",
						"children": []
					}
				]
			},
			{
				"name": "TAE会员专区",
				"url": "views",
				"icon": "",
				"children": [
					{
						"name": "界面设置",
						"url": "views.set",
						"icon": "",
						"children": [
							{
								"name": "手淘",
								"url": "views.set.st",
								"icon": "",
								"children": []
							}
						]
					},
					{
						"name": "赚积分",
						"url": "views.point",
						"icon": "",
						"children": [
							{
								"name": "签到",
								"url": "views.point.sign",
								"icon": "",
								"children": [
									{
										"name": "再签到",
										"url": "views.point.sign.reload",
										"icon": "",
										"children": []
									}
								]
							}
						]
					}
				]
			},
			{
				"name": "会员等级管理",
				"url": "grade",
				"icon": "",
				"children": []
			}
		];

		var self = this;

		self.titleName = '头部XXX';
		self.unfold = true;
		self.unfoldClick = function(unfold) {
			console.log('结果:', unfold);
		};
		self.shops = true;
		//self.menusResource = menus;
		self.menusResource = $resource('/menus');
		//self.shopsResource = shops;
		self.shopsResource = $resource('/shops');
		self.searchPlaceholder = '请输入XXX';

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
	$rootScope.$on('shopSelect', function(event, shop) {
		console.log(shop.plat.name + '|' + shop.shop.name);
		console.log('$menus.active:', $menus.shopActive.plat.name + '|' + $menus.shopActive.shop.name);
	});
}
