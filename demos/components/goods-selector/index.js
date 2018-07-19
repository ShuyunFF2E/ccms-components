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
			var jdSelectedGoods = {
				10000197594: ['10001406294'],
				10000200026: null,
				10000229165: ['10001562137']
			};

			var taobaoWithShopList = [{shopId: 106878997, shopName: '数云食堂', plat: 'top'}, {shopId: 157263193, shopName: '0黑色的琴键0', plat: 'top'}, {shopId: 65305757, shopName: '安踏', plat: 'top'}];
			var jsWithShopList = [{shopId: 23591, shopName: 'JD数云食堂', plat: 'jos'}, {shopId: 24058, shopName: '数云食堂', plat: 'jos'}];
			var qkWithShopList = [{shopId: 23591, shopName: '恰客1', plat: 'qk'}, {shopId: 23423, shopName: '恰客2', plat: 'qk'}];
			var taobaoWithoutShopList = {shopId: 106878997, shopName: '黑色', plat: 'top'};
			var jdWithoutShopList = {shopId: 70866974, shopName: 'JD数云食堂', plat: 'jos'};
			var qkWithoutShopList = {shopId: 23591, shopName: '恰客', plat: 'qk'};

			var isOnlyChecked = false; // 是否包含 footer
			var maxSelectedNumber = 1000; // 最大允许选择的商品数量
			var serverName = ''; // http://qa-ual.fenxibao.com  或  http://ual.fenxibao.com
			var isSupportedGoodsLabel = true; // 是否支持商品标签,如果支持，那么租户ID tenantId 必填
			var tenantId = '2324234234';
			var isSupportedAddCondition = true; // 是否支持添加为搜索条件
			var conditions = { // 搜索条件
				categoriesId: '222222', // 商品自定义类目
				endListTime: new Date(1531843200000), // 下架时间
				id: ['11111'], // 商品ID
				maxPrice: '200', // 最高价
				minPrice: '100', // 最低价
				name: '22222', // 商品名称
				outerId: '33333', // 商品商家编码
				platform: 'top', // 平台
				propsPid: '4', // 商品属性
				propsVid: null, // 属性值
				propsVname: 'dgsgsdfgs', // 属性值名称
				shopCategoriesId: ['111111', '222222'], // 商品标准类目
				shopId: 106878997, // 店铺ID
				skusId: [], // sku ID
				skusOuterId: '44444', // sku 商家编码
				skusPropsVname: '55555', // sku 规格
				startListTime: new Date(1530374400000), // 上架时间
				status: '1', // 商品状态
				tags: [ // 商品标签
					{
						'id': '标签ID3',
						'name': '标签3',
						'itemIds': ['36177640302', '40948502941', '41897960122']
					},
					{
						'id': '标签ID4',
						'name': '标签4',
						'itemIds': ['41897960122', '41898176511', '41982082920']
					}
				]
			};
			var options = {
				isOnlyChecked,
				maxSelectedNumber,
				serverName,
				isSupportedGoodsLabel,
				tenantId,
				isSupportedAddCondition,
				conditions
			};
			// 如果是商品维度选择，isSupportedSku 值为 false，否则为 true，默认值为 true
			var isSupportedSku = false;
			var selectedGoodsWithoutSku = {
				541920723552: null,
				532988558193: null,
				554208360201: null,
				562099525613: null
			};
			var jdSelectedGoodsWithoutSku = {
				10000197594: null,
				10000200007: null,
				10001027790: null,
				10000229165: null
			};
			var optionsWithoutSku = {
				isOnlyChecked,
				maxSelectedNumber,
				serverName,
				isSupportedSku,
				isSupportedGoodsLabel,
				tenantId,
				isSupportedAddCondition,
				conditions
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
					.goodsSelector(jsWithShopList, options, jdSelectedGoods)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

			// QK + 店铺选择
			$scope.openQKGoodsSelectorWithShopList = function() {
				$ccGoodsSelector
					.goodsSelector(qkWithShopList, options, selectedGoods)
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

			// qk 无店铺选择
			$scope.openQKGoodsSelector = function() {
				$ccGoodsSelector
					.goodsSelector(qkWithoutShopList, options)
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
					.goodsSelector(jsWithShopList, optionsWithoutSku, jdSelectedGoodsWithoutSku)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

			// qk + 店铺选择 + 商品维度选择
			$scope.openQKGoodsSelectorWithShopListWithoutSku = function() {
				$ccGoodsSelector
					.goodsSelector(qkWithShopList, optionsWithoutSku, selectedGoodsWithoutSku)
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

			// qk 无店铺选择 + 商品维度选择
			$scope.openQKGoodsSelectorWithoutSku = function() {
				$ccGoodsSelector
					.goodsSelector(qkWithoutShopList, optionsWithoutSku, selectedGoodsWithoutSku)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};
		});

})(window.angular);
