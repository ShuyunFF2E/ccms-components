;(function(angular) {

	'use strict';

	angular.module('app', ['ccms.components'])

		.controller('ctrl', function($scope, $ccShopSelector) {
			let hasFooter = false;
			let tenantId = 'qiushi6';
			let serverName = ''; // http://qa-ual.shuyun.com 或者 http://ual.shuyun.com
			let isSupportedChannel = true;
			let singleSelectedShop = ['qiakr_6998868227']; // ['weixin_wxf8e64372a94529ac'] ['qiakr_6998868227'];
			let multipleSelectedShop = ['qiakr_6998868227', 'taobao_69988684534586', 'taobao_6956469886888l']; // ['weixin_wxf8e64372a94529ac', 'weixin_wxc724d28eef67468f'] ['qiakr_6998868227', 'taobao_69988684534586', 'taobao_6956469886888l'];

			let singleOptions = {
				hasFooter,
				selectedShop: singleSelectedShop,
				isSingleSelected: true,
				serverName,
				isSupportedChannel
			};

			let multipleOptions = {
				hasFooter,
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
