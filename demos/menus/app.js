/**
 * Created with app.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-03-04 10:36 AM
 */
const menusList = [
	{
		"name": "忠诚度设置",
		"state": "card",
		"icon": "",
		"children": [
			{
				"name": "积分类型",
				"state": "card.point",
				"icon": "",
				"children": []
			},
			{
				"name": "等级类型",
				"state": "card.grade",
				"icon": "",
				"children": []
			}
		]
	},
	{
		"name": "TAE会员专区",
		"state": "views",
		"icon": "",
		"children": [
			{
				"name": "界面设置",
				"state": "views.set",
				"icon": "",
				"children": [
					{
						"name": "手淘",
						"state": "views.set.st",
						"icon": "",
						"children": []
					}
				]
			},
			{
				"name": "赚积分",
				"state": "views.point",
				"icon": "",
				"children": [
					{
						"name": "签到",
						"state": "views.point.sign",
						"icon": "",
						"children": [
							{
								"name": "再签到",
								"state": "views.point.sign.reload",
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
		"state": "grade",
		"icon": "",
		"children": []
	}
];
const shopsList = [
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
angular
	.module('componentsApp', ['ccms.components', 'ui.router', 'ngResource'])

	.controller('ctrl', function ($scope, $timeout, $resource, MENULIST, SHOPLIST) {

		var self = this;

		self.titleName = '头部XXX';

		self.menusOptions = {
			unfold: true,
			unfoldClick: function (unfold) {
				console.log('结果:', unfold);
			},
			menusResource: $resource('/menus'),
			//menusResource: menus,
			shopsResource: $resource('/shops'),
			searchPlaceholder: '请输入XXX'
		};
	})
	.config(routerConfig)
	.constant('MENULIST', menusList)
	.constant('SHOPLIST', shopsList)
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
			template: '<input type="text" ng-model="point.name" ng-change="point.formChange()">',
			controller: pointController,
			controllerAs: 'point'
		})
		.state('card.grade', {
			url: '/grade',
			template: '就是测试页面,没有其他用处!!',
			controller: gradeController,
			controllerAs: 'grade'
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

runConfig.$inject = ['$state', '$rootScope', '$ccMenus'];
function runConfig($state, $rootScope, $ccMenus) {
	$rootScope.$state = $state;
}


gradeController.$inject = ['$scope', '$ccMenus'];

// - 关闭自动开启功能
function gradeController($scope, $ccMenus) {

	$scope.$on('shop:change', (event, current) => {
		const serveCurrent = $ccMenus.getCurrentPlatShop();
		// --TODO 执行其他操作
		console.log('事件广播:', current.plat.name + '|' + current.shop.name);
		console.log('服务接口:', serveCurrent.plat.name + '|' + serveCurrent.shop.name);

	});
}


pointController.$inject = ['$scope', '$ccMenus'];

// - 开启自动关闭功能
function pointController($scope, $ccMenus) {

	this.name = '老司机飙车速度疾';

	let isChange = false;

	$scope.$on('shop:changeStart', (event, defer) => {

		if (isChange) {
			const state = window.confirm('确定切换店铺?');
			if (state) {
				defer.resolve();
			} else {
				defer.reject();
			}
			isChange = false;
		}
	});

	$scope.$on('shop:change', (event, current) => {
		const serveCurrent = $ccMenus.getCurrentPlatShop();

		if (isChange) {
			const state = window.confirm('确定切换店铺?');
			if (state) {
				defer.resolve();
			} else {
				defer.reject();
			}
			isChange = false;
		}
	});

	$scope.$on('shop:change', (event, current) => {
		const serveCurrent = $ccMenus.getCurrentPlatShop();
		console.log('事件广播:', current.plat.name + '|' + current.shop.name);
		console.log('服务接口:', serveCurrent.plat.name + '|' + serveCurrent.shop.name);
	});

	/**
	 * 表单修改
	 */
	this.formChange = () => {
		isChange = true;
	};
}
