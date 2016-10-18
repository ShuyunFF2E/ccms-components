/**
 * Created with app.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-03-04 10:36 AM
 */
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
			template: '手机淘宝<cc-date-picker ng-model="date"></cc-date-picker>',
			controller: phoneTaoBaoController,
			controllerAs: 'st'
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
			template: '签到绘声绘色',
			controller: pointSignReloadController,
			controllerAs: 'reload'
		})
		.state('grade', {
			url: '/grade',
			template: '<span ng-click="manage.searchPlatShop()"> 任性的一哥们儿</span>',
			controller: gradeManageController,
			controllerAs: 'manage'
		});
	$urlRouterProvider.otherwise('views/point/sign/sign');
}

runConfig.$inject = ['$state', '$rootScope', '$ccMenus'];
function runConfig($state, $rootScope) {
	$rootScope.$state = $state;
}


gradeController.$inject = ['$scope', '$ccMenus'];

// - 关闭自动开启功能
function gradeController($scope, $ccMenus) {

	$ccMenus.getCurrentPlatShop().then(current => {
		console.log('等级类型:(server)', current.plat.name + '|' + current.shop.name);
	});

	const change = $ccMenus.onShopChange(current => {
		console.log('等级类型:(listener)', current.plat.name + '|' + current.shop.name);
	}, $scope);
}


pointController.$inject = ['$scope', '$ccMenus', '$ccModal'];

// - 开启自动关闭功能
function pointController($scope, $ccMenus, $ccModal) {

	$ccMenus.getCurrentPlatShop().then(current => {
		console.log('积分类型:(server)', current.plat.name + '|' + current.shop.name)
	});

	this.name = '老司机飙车速度疾';

	let isChange = false;

	/**
	 * 表单修改
	 */
	this.formChange = () => {
		isChange = true;
	};

	$ccMenus.onShopChange(current => {
		console.log('积分类型:(listener)', current.plat.name + '|' + current.shop.name);
	}, $scope);

	$ccMenus.onShopChangeStart((defer, toShop)=> {
		if (isChange) {

			$ccModal.confirm('切换店铺中,确定要切换至' + toShop.plat.name + '下的' + toShop.shop.name + '吗?', {
				onClose: function () {
					console.log('close');
				}
			}).open().result.then(() => {
				defer.resolve();
				isChange = false;
			}, () => {
				defer.reject();
			});
		} else {

			defer.resolve();
		}
	}, $scope);

}


gradeManageController.$inject = ['$scope', '$ccMenus'];
function gradeManageController($scope, $ccMenus) {

	$ccMenus.getCurrentPlatShop().then(current => {
		console.log('1会员等级管理:(server)', current.plat.name + '|' + current.shop.name);
	});


	$ccMenus.onShopChange(current => {
		console.log('会员等级管理:(listener)', current.plat.name + '|' + current.shop.name);

		$ccMenus.getCurrentPlatShop().then(current => {
			console.log('3会员等级管理:(server)', current.plat.name + '|' + current.shop.name);
		});
	}, $scope);

	this.searchPlatShop = () => {
		$ccMenus.getCurrentPlatShop().then(current => {
			console.log('会员等级管理:(search)', current.plat.name + '|' + current.shop.name);
		});
	};

}

pointSignReloadController.$inject = ['$scope', '$ccMenus'];
function pointSignReloadController($scope, $ccMenus) {

	$ccMenus.getCurrentPlatShop().then(current => {
		console.log('再签到:(server)', current.plat.name + '|' + current.shop.name);
	}, $scope);

	$ccMenus.onShopChange(current => {
		console.log('再签到:(listener)', current.plat.name + '|' + current.shop.name);
	}, $scope);
}
phoneTaoBaoController.$inject = ['$scope', '$ccMenus'];
function phoneTaoBaoController($scope, $ccMenus) {

	$ccMenus.getCurrentPlatShop().then(current => {
		console.log('手机淘宝:(server)', current.plat.name + '|' + current.shop.name);
	}, $scope);

	$ccMenus.onShopChange(current => {
		console.log('手机淘宝:(listener)', current.plat.name + '|' + current.shop.name);
	}, $scope);
}
