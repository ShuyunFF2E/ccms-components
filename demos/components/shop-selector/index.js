;(function(angular) {

	'use strict';

	angular.module('app', ['ccms.components'])

		.controller('ctrl', function($scope, $ccShopSelector) {
			let isOnlyChecked = false;
			let tenantId = 'test';
			let serverName = '';
			let isSupportedChannel = true;
			let singleSelectedShop = ['qiakr_6998868227'];
			let multipleSelectedShop = ['qiakr_6998868227', 'taobao_69988684534586', 'taobao_6956469886888l'];

			let singleOptions = {
				isOnlyChecked,
				selectedShop: singleSelectedShop,
				isSingleSelected: true,
				serverName,
				isSupportedChannel
			};

			let multipleOptions = {
				isOnlyChecked,
				selectedShop: multipleSelectedShop,
				isSingleSelected: false,
				serverName,
				isSupportedChannel
			};

			// 单选店铺选择器
			$scope.openSingleShopSelector = function() {
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
			// 多选店铺选择器
			$scope.openMultipleShopSelector = function() {
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
		});

})(window.angular);
