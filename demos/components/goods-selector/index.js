;(function(angular) {

	'use strict';

	angular.module('app', ['ccms.components'])

		.controller('ctrl', function($scope, $ccGoodsSelector) {

			var selectedGoods = {
				556311744305: null,
				556337565814:["3442328164921"],
				559059470281:["3479833168658"]
			};

			var taobaoWithShopList = [{shopId: 106878997, shopName: '数云食堂', plat: 'top'}, {shopId: 157263193, shopName: '0黑色的琴键0', plat: 'top'}, {shopId: 65305757, shopName: '安踏', plat: 'top'}];
			// var jsWithShopList = [{shopId: 24058, shopName: 'JD数云食堂', plat: 'jos'}, {shopId: 24058, shopName: '数云食堂', plat: 'jos'}];
			var jsWithShopList = [{shopId: 23591, shopName: 'JD数云食堂', plat: 'jos'}, {shopId: 24058, shopName: '数云食堂', plat: 'jos'}];
			var taobaoWithoutShopList = {shopId: 157263193, shopName: '黑色', plat: 'top'};
			var jdWithoutShopList = {shopId: 70866974, shopName: 'JD数云食堂', plat: 'jos'};

			var isOnlyChecked = false;
			var maxSelectedNumber = 100;
			var serverName = ''; // http://qa-ual.fenxibao.com  或  http://ual.fenxibao.com
			var options = {
				isOnlyChecked,
				maxSelectedNumber,
				serverName
			};
			// taobao + 店铺选择
			$scope.openTaobaoGoodsSelectorWithShopList = function() {
				$ccGoodsSelector
					.goodsSelector(taobaoWithShopList, options)
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
					.goodsSelector(jsWithShopList, options, selectedGoods)
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
					.goodsSelector(taobaoWithoutShopList, options, selectedGoods)
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
					.goodsSelector(jdWithoutShopList, options)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

		});

})(window.angular);
