;(function(angular) {

	'use strict';

	angular.module('app', ['ccms.components'])

		.controller('ctrl', function($scope, $ccShopSelector) {
			let isOnlyChecked = false;
			let tenantId = 'test';
			let serverName = '';

			let singleSelectedShop = ['qiakr_69988687'];
			let singleOptions = {
				isOnlyChecked,
				selectedShop: singleSelectedShop,
				isSingleSelected: true,
				serverName
			};

			let mutipleSelectedShop = ['qiakr_69988687', 'qiakr_699886871', 'taobao_699886882p'];
			let multipleOptions = {
				isOnlyChecked,
				selectedShop: mutipleSelectedShop,
				isSingleSelected: false,
				serverName
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
