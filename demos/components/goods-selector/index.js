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
				10000227589: ['10001555180'],
				10000200026: null,
				10000229165: ['10001562137']
			};

			var taobaoWithShopList = [{shopId: 106878997, shopName: '数云食堂', plat: 'top'}, {shopId: 157263193, shopName: '0黑色的琴键0', plat: 'top'}, {shopId: 65305757, shopName: '安踏', plat: 'top'}];
			var jdWithShopList = [{shopId: 23591, shopName: 'JD数云食堂', plat: 'jos'}, {shopId: 24058, shopName: '数云食堂', plat: 'jos'}];
			var taobaoWithoutShopList = {shopId: 106878997, shopName: '黑色', plat: 'top'};
			var jdWithoutShopList = {shopId: 70866974, shopName: 'JD数云食堂', plat: 'jos'};
			var qkWithoutShopList = [{shopId: 2260, shopName: '恰客', plat: 'qiakr'}, {shopId: 234234, shopName: '恰客1', plat: 'qiakr'}];

			var isOnlyChecked = false; // 是否包含 footer
			var maxSelectedNumber = 1000; // 最大允许选择的商品数量
			var serverName = ''; // http://qa-ual.fenxibao.com  或  http://ual.fenxibao.com
			var tenantId = 'sjyj'; // 如果支持商品标签，那么租户ID tenantId 必填
			var isSupportedAddCondition = false; // 是否支持添加为搜索条件
			var conditions = { // 搜索条件
				categoriesId: '111111', // 商品标准类目 1629
				endListTime: new Date(1531843200000), // 下架时间
				id: ['11111'], // 商品ID
				maxPrice: '200', // 最高价
				minPrice: '100', // 最低价
				name: '22222', // 商品名称
				outerId: '33333', // 商品商家编码
				propsPid: '1', // 商品属性 20021
				propsVid: '11', // 属性值 21540056
				propsVname: null, // 属性值名称
				shopCategoriesId: ['111111'], // 商品自定义类目 ['810124529', '809546836']
				shopId: 157263193, // 店铺ID
				skusId: ['22342343'], // 商品编号
				skusOuterId: '44444', // sku 商家编码
				skusPropsVname: '55555', // sku 规格
				startListTime: new Date(1530374400000), // 上架时间
				status: '1', // 商品状态
				tags: [
					{
						created: 1532344817277,
						itemIds: [
							'35469357993',
							'35470631273',
							'35454455926',
							'35470522864',
							'35469359534',
							'35470631420',
							'35454659178',
							'35470522868',
							'35470266351',
							'35468870483',
							'35470595798',
							'35470266520',
							'35469267402',
							'35470602599',
							'35470362412',
							'3276156480745337',
							'35469291815',
							'35470623615',
							'3353913288635786',
							'35470474978'
						],
						tenantId: 'sjyj',
						name: 'wetian',
						tagCreated: 1414570968000,
						id: '标签ID1',
						createrName: 'lucong',
						status: 1
					},
					{
						created: 223423423,
						itemIds: [
							'10368117022',
							'10355523047726332',
							'10659506366',
							'10586601480',
							'10369349878',
							'10600475238',
							'10322352628',
							'10600838324',
							'10369001412',
							'10545125104',
							'10260793936',
							'10367861120',
							'10630194084',
							'1004731534060523',
							'10368493452',
							'10619921636726328',
							'10130853576',
							'10545056768',
							'10357233836',
							'10642773218',
							'10600541566',
							'10130506556',
							'10482617558',
							'10620202451726327'
						],
						tenantId: 'sjyj',
						name: 'tansong',
						tagCreated: 1414571015000,
						id: 345345,
						createrName: 'lucong',
						status: 1
					},
					{
						created: 1532344817281,
						tenantId: 'sjyj',
						name: '123321',
						tagCreated: 1416989861000,
						id: 11,
						createrName: 'lucong',
						status: 1
					}
				],
				brandId: '1111'
			};
			var options = {
				isOnlyChecked,
				maxSelectedNumber,
				serverName,
				tenantId,
				isSupportedAddCondition,
				conditions
			};
			// taobao + 店铺选择
			$scope.openTaobaoGoodsSelectorWithShopList = function() {
				$ccGoodsSelector
					.goodsSelector(taobaoWithShopList, options, selectedGoods)
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
					.goodsSelector(jdWithShopList, options, jdSelectedGoods)
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

			var qiakeConditions = { // 搜索条件
				endListTime: new Date(1531843200000), // 下架时间
				id: ['11111'], // 商品ID
				maxPrice: '200', // 最高价
				minPrice: '100', // 最低价
				name: '22222', // 商品名称
				platform: 'top', // 平台
				categoriesId: '44556677881', // 商品标准类目
				shopId: 2260, // 店铺ID
				skusId: ['22342343'], // 商品编号
				skusPropsVname: '55555', // sku 规格
				startListTime: new Date(1530374400000), // 上架时间
				status: '1',
				brandId: '7654321'
			};
			var qiakeOptions = {
				isOnlyChecked,
				maxSelectedNumber,
				serverName,
				tenantId,
				isSupportedAddCondition,
				conditions: qiakeConditions
			};

			// qk 无店铺选择
			$scope.openQKGoodsSelector = function() {
				$ccGoodsSelector
					.goodsSelector(qkWithoutShopList, qiakeOptions)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
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
				10000227589: null,
				10000200007: null,
				10001027790: null
			};
			var optionsWithoutSku = {
				isOnlyChecked,
				maxSelectedNumber,
				serverName,
				isSupportedSku,
				tenantId,
				isSupportedAddCondition,
				conditions
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
					.goodsSelector(jdWithShopList, optionsWithoutSku, jdSelectedGoodsWithoutSku)
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

			// 单选，商品维度选择器
			var singleOptionsWithoutSku = {
				isOnlyChecked,
				maxSelectedNumber,
				serverName,
				isSupportedSku,
				tenantId,
				isSupportedAddCondition,
				conditions,
				isSingleSelect: true
			};
			var singleTaobaoSelectedGoodsWithoutSku = {
				35647605646: null
			};
			var singleJDSelectedGoodsWithoutSku = {
				10000227589: null
			};

			// 单选 + taobao + 店铺选择 + 商品维度选择
			$scope.openSingleTaobaoSelectorWithShopListWithoutSku = function() {
				$ccGoodsSelector
					.goodsSelector(taobaoWithShopList, singleOptionsWithoutSku, singleTaobaoSelectedGoodsWithoutSku)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

			// 单选 + jd + 店铺选择 + 商品维度选择
			$scope.openSingleJDGoodsSelectorWithShopListWithoutSku = function() {
				$ccGoodsSelector
					.goodsSelector(jdWithShopList, singleOptionsWithoutSku, singleJDSelectedGoodsWithoutSku)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

			// 单选 + taobao 无店铺选择 + 商品维度选择
			$scope.openSingleTaobaoGoodsSelectorWithoutSku = function() {
				$ccGoodsSelector
					.goodsSelector(taobaoWithoutShopList, singleOptionsWithoutSku, singleTaobaoSelectedGoodsWithoutSku)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

			// 单选 + jd 无店铺选择 + 商品维度选择
			$scope.openSingleJDGoodsSelectorWithoutSku = function() {
				$ccGoodsSelector
					.goodsSelector(jdWithoutShopList, singleOptionsWithoutSku, singleJDSelectedGoodsWithoutSku)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};
		});

})(window.angular);
