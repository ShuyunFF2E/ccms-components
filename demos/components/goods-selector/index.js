;(function(angular) {

	'use strict';

	angular.module('app', ['ccms.components'])

		.controller('ctrl', function($scope, $ccGoodsSelector) {
			// 当需要从外部传入已选商品时 --> 支持 sku -> 已选商品作为对象传入，key 值代表商品 ID，value 是由该商品包含的被选中的 sku id 组成的数组
			// 					       --> 不支持 sku 即商品维度选择 -> key 值代表商品 ID，value 为 null
			// 当无需从外部传入已选商品时 -->  省略 selectedGoods 参数
			var selectedGoods = {
				541920723552: ['3419076274289'],
				532988558193: null,
				554208360201: ['3577205138168'],
				562099525613: null
			};

			var taobaoWithShopList = [{shopId: 106878997, shopName: '数云食堂', plat: 'top'}, {shopId: 157263193, shopName: '0黑色的琴键0', plat: 'top'}, {shopId: 65305757, shopName: '安踏', plat: 'top'}];
			// var jsWithShopList = [{shopId: 24058, shopName: 'JD数云食堂', plat: 'jos'}, {shopId: 24058, shopName: '数云食堂', plat: 'jos'}];
			var jsWithShopList = [{shopId: 23591, shopName: 'JD数云食堂', plat: 'jos'}, {shopId: 24058, shopName: '数云食堂', plat: 'jos'}];
			var taobaoWithoutShopList = {shopId: 106878997, shopName: '黑色', plat: 'top'};
			var jdWithoutShopList = {shopId: 70866974, shopName: 'JD数云食堂', plat: 'jos'};

			var isOnlyChecked = false; // 是否包含 footer
			var maxSelectedNumber = 400; // 最大允许选择的商品数量
			var serverName = ''; // http://qa-ual.fenxibao.com  或  http://ual.fenxibao.com
			var isSupportedGoodsLabel = true; // 是否支持商品标签
			var isSupportedAddCondition = true; // 是否支持添加为搜索条件
			var options = {
				isOnlyChecked,
				maxSelectedNumber,
				serverName,
				isSupportedGoodsLabel,
				isSupportedAddCondition
			};
			// 如果是商品维度选择，isSupportedSku 值为 false，否则为 true，默认值为 true
			var isSupportedSku = false;
			var selectedGoodsWithoutSku = {
				541920723552: null,
				532988558193: null,
				554208360201: null,
				562099525613: null
			};
			var optionsWithoutSku = {
				isOnlyChecked,
				maxSelectedNumber,
				serverName,
				isSupportedSku,
				isSupportedGoodsLabel,
				isSupportedAddCondition
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
			// taobao + 店铺选择 + 商品维度选择
			$scope.openTaobaoGoodsSelectorWithShopListWithoutSku = function() {
				$ccGoodsSelector
					.goodsSelector(taobaoWithShopList, optionsWithoutSku, selectedGoodsWithoutSku)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

			// jd + 店铺选择 + 商品维度选择
			$scope.openJDGoodsSelectorWithShopListWithoutSku = function() {
				$ccGoodsSelector
					.goodsSelector(jsWithShopList, optionsWithoutSku, selectedGoodsWithoutSku)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

			// taobao 无店铺选择 + 商品维度选择
			$scope.openTaobaoGoodsSelectorWithoutSku = function() {
				$ccGoodsSelector
					.goodsSelector(taobaoWithoutShopList, optionsWithoutSku, selectedGoodsWithoutSku)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
				});
			};

			// jd 无店铺选择 + 商品维度选择
			$scope.openJDGoodsSelectorWithoutSku = function() {
				$ccGoodsSelector
					.goodsSelector(jdWithoutShopList, optionsWithoutSku, selectedGoodsWithoutSku)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
				});
			};
		});

})(window.angular);
