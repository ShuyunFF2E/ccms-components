;(function (angular) {

	'use strict';

	angular.module('app', ['ccms.components'])

		.controller('ctrl', function($scope, $ccGoodsSelector) {
			var SELECTEDGOODS = [];

			var taobaoWithShopList = [{shopId: 11111, shopName: '数云食堂', plat: 'taobao'}, {shopId: 10001, shopName: 'JD数云食堂', plat: 'jos'}];
			var jsWithShopList = [{shopId: 10001, shopName: 'JD数云食堂', plat: 'jos'}, {shopId: 11111, shopName: '数云食堂', plat: 'taobao'}];
			var taobaoWithoutShopList = {shopId: 11111, shopName: '数云食堂', plat: 'taobao'};
			var jdWithoutShopList = {shopId: 10001, shopName: 'JD数云食堂', plat: 'jos'};

			// taobao + 店铺选择
			$scope.openTaobaoGoodsSelectorWithShopList = function() {
				$ccGoodsSelector
					.goodsSelector(taobaoWithShopList, SELECTEDGOODS)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

			// jd + 店铺选择
			$scope.openJDGoodsSelectorWithShopList = function() {
				$ccGoodsSelector
					.goodsSelector(jsWithShopList, SELECTEDGOODS)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
				});
			};

			// taobao 无店铺选择
			$scope.openTaobaoGoodsSelector = function() {
				$ccGoodsSelector
					.goodsSelector(taobaoWithoutShopList, SELECTEDGOODS)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
				});
			};

			// jd 无店铺选择
			$scope.openJDGoodsSelector = function() {
				$ccGoodsSelector
					.goodsSelector(jdWithoutShopList, SELECTEDGOODS)
					.open().result.then(function(response) {
					console.log('-----------ok-----------');
					console.log(response);
				}, function() {
					console.log('----------cancel---------');
				});
			};

		});

})(window.angular);
