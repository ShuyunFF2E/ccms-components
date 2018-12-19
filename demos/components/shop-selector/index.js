;(function(angular) {

	'use strict';

	angular.module('app', ['ccms.components'])

	// todo: 添加用户平台参数platform，数组形式，['jos', 'top', 'offline']
		.controller('ctrl', function($scope, $ccShopSelector) {
			let hasFooter = true;
			let tenantId = 'qiushi6';
			let serverName = ''; // http://qa-ual.shuyun.com 或者 http://ual.shuyun.com
			let isSupportedChannel = true;
			let singleSelectedShop = ['qiakr_6998868227']; // ['weixin_wxf8e64372a94529ac'] ['qiakr_6998868227'];
			let multipleSelectedShop = ['qiakr_6998868227', 'taobao_69988684534586', 'taobao_6956469886888l']; // ['weixin_wxf8e64372a94529ac', 'weixin_wxc724d28eef67468f'] ['qiakr_6998868227', 'taobao_69988684534586', 'taobao_6956469886888l'];
			let areaUrl = 'http://qa-ual.shuyun.com/shuyun-searchapi/1.0/area?platform=top';

			let commonSingleOptions = {
				hasFooter,
				selectedShop: singleSelectedShop,
				isSingleSelected: true,
				serverName,
				isSupportedChannel
				// areaUrl
			};

			let commonMultipleOptions = {
				hasFooter,
				selectedShop: multipleSelectedShop,
				isSingleSelected: false,
				serverName,
				isSupportedChannel
				// areaUrl
			};

			// 单选店铺选择器-用户传入多个平台
			$scope.openSingleShopSelector = function() {
				let singleOptions = {
					platform: ['jos', 'taobao', 'offline'],
					...commonSingleOptions
				};
				$ccShopSelector.shopSelector(tenantId, singleOptions)
					.open()
					.result
					.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('-----------ok-----------');
					});
			};
			// 多选店铺选择器-用户传入多个平台
			$scope.openMultipleShopSelector = function() {
				let multipleOptions = {
					platform: ['jos', 'taobao', 'offline'],
					...commonMultipleOptions
				};
				$ccShopSelector.shopSelector(tenantId, multipleOptions)
					.open()
					.result
					.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('-----------ok-----------');
					});
			};
			// 单选店铺选择器-用户传入1个平台
			$scope.openSingleShopSelector1 = function() {
				let singleOptions = {
					platform: ['offline'],
					...commonSingleOptions
				};
				$ccShopSelector.shopSelector(tenantId, singleOptions)
					.open()
					.result
					.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('-----------ok-----------');
					});
			};
			// 多选店铺选择器-用户传入1个平台
			$scope.openMultipleShopSelector1 = function() {
				let multipleOptions1 = {
					platform: ['offline'],
					...commonMultipleOptions
				};
				$ccShopSelector.shopSelector(tenantId, multipleOptions1)
					.open()
					.result
					.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('-----------ok-----------');
					});
			};
			// 单选店铺选择器-用户不传平台(显示所有平台)
			$scope.openSingleShopSelector2 = function() {
				$ccShopSelector.shopSelector(tenantId, commonSingleOptions)
					.open()
					.result
					.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('-----------ok-----------');
					});
			};
			// 多选店铺选择器-用户不传平台(显示所有平台)
			$scope.openMultipleShopSelector2 = function() {
				$ccShopSelector.shopSelector(tenantId, commonMultipleOptions)
					.open()
					.result
					.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('-----------ok-----------');
					});
			};
		});

})(window.angular);
