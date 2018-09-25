;(function(angular) {
	'use strict';

	angular.module('topService', [])
		.factory('topFactory', function() {
			return {
				openTopWithShopList,
				openTopWithoutShopList,
				openTopWithoutSkuWithShopList,
				openTopWithoutSkuWithoutShopList,
				openTopSingleSelectWithShopList,
				openTopSingleSelectWithoutShopList
			};
		});

	var isOnlyChecked = false; // 是否包含 footer
	var maxSelectedNumber = 1000; // 最大允许选择的商品数量
	var serverName = ''; // http://qa-ual.fenxibao.com  或  http://ual.fenxibao.com
	var isSupportedTag = false; // 是否支持商品标签
	var tenantId = 'sjyj'; // 租户ID tenantId
	var conditions = { // 搜索条件
		categoriesId: '50012906', // 商品标准类目 '111111'
		endListTime: new Date(1531843200000), // 下架时间
		id: ['11111'], // 商品ID
		maxPrice: '200', // 最高价
		minPrice: '100', // 最低价
		name: '22222', // 商品名称
		outerId: '33333', // 商品商家编码
		propsPid: '122216563', // 商品属性 '1'
		propsVid: '3376399', // 属性值 '11'
		propsVname: null, // 属性值名称
		shopCategoriesId: ['810124529', '809546836'], // 商品自定义类目 ['111111']
		shopId: 157263193, // 店铺ID
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
		]
	};
	var isSupportedSku = false; // 是否支持 sku
	var isSingleSelect = true; // 是否是单选列表

	// top + sku 维度 + 店铺选择
	function openTopWithShopList($scope, $ccGoodsSelector, isSupportedAddCondition, isSupportedBatchAddition) {
		var shopList = [{shopId: '106878997', shopName: '数云食堂', plat: 'top'}, {shopId: '157263193', shopName: '0黑色的琴键0', plat: 'top'}, {shopId: '65305757', shopName: '安踏', plat: 'top'}];
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			tenantId,
			isSupportedAddCondition,
			conditions,
			isSupportedTag,
			isSupportedBatchAddition
		};
		var selectedGoods = {
			541920723552: ['3419076274289'],
			532988558193: null,
			554208360201: ['3577205138168'],
			562099525613: null
		};
		$ccGoodsSelector
			.goodsSelector(shopList, options, selectedGoods)
			.open().result.then(function(response) {
				console.log('-----------ok-----------');
				console.log(response);
			}, function() {
				console.log('----------cancel---------');
			});
	}

	// top + sku 维度 + 单店铺
	function openTopWithoutShopList($scope, $ccGoodsSelector, isSupportedAddCondition, isSupportedBatchAddition) {
		var shopList = {shopId: '106878997', shopName: '黑色', plat: 'top'};
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			tenantId,
			isSupportedAddCondition,
			conditions,
			isSupportedTag,
			isSupportedBatchAddition
		};
		var selectedGoods = {
			541920723552: ['3419076274289'],
			532988558193: null,
			554208360201: ['3577205138168'],
			562099525613: null
		};
		$ccGoodsSelector
			.goodsSelector(shopList, options, selectedGoods)
			.open().result.then(function(response) {
				console.log('-----------ok-----------');
				console.log(response);
			}, function() {
				console.log('----------cancel---------');
			});
	}

	// top + 商品维度 + 店铺选择
	function openTopWithoutSkuWithShopList($scope, $ccGoodsSelector, isSupportedAddCondition, isSupportedBatchAddition) {
		var shopList = [{shopId: '106878997', shopName: '数云食堂', plat: 'top'}, {shopId: '157263193', shopName: '0黑色的琴键0', plat: 'top'}, {shopId: '65305757', shopName: '安踏', plat: 'top'}];
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			tenantId,
			isSupportedAddCondition,
			conditions,
			isSupportedSku,
			isSupportedTag,
			isSupportedBatchAddition
		};
		var selectedGoods = {
			541920723552: null,
			532988558193: null,
			554208360201: null,
			562099525613: null
		};
		$ccGoodsSelector
			.goodsSelector(shopList, options, selectedGoods)
			.open().result.then(function(response) {
				console.log('-----------ok-----------');
				console.log(response);
			}, function() {
				console.log('----------cancel---------');
			});
	}

	// top + 商品维度 + 单店铺
	function openTopWithoutSkuWithoutShopList($scope, $ccGoodsSelector, isSupportedAddCondition, isSupportedBatchAddition) {
		var shopList = {shopId: '106878997', shopName: '黑色', plat: 'top'};
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			tenantId,
			isSupportedAddCondition,
			conditions,
			isSupportedSku,
			isSupportedTag,
			isSupportedBatchAddition
		};
		var selectedGoods = {
			541920723552: null,
			532988558193: null,
			554208360201: null,
			562099525613: null
		};
		$ccGoodsSelector
			.goodsSelector(shopList, options, selectedGoods)
			.open().result.then(function(response) {
				console.log('-----------ok-----------');
				console.log(response);
			}, function() {
				console.log('----------cancel---------');
			});
	}

	// top + 商品维度 + 店铺选择 + 单选（微信CRM）
	function openTopSingleSelectWithShopList($scope, $ccGoodsSelector, isSupportedAddCondition, isSupportedBatchAddition) {
		var shopList = [{shopId: '106878997', shopName: '数云食堂', plat: 'top'}, {shopId: '157263193', shopName: '0黑色的琴键0', plat: 'top'}, {shopId: '65305757', shopName: '安踏', plat: 'top'}];
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			tenantId,
			isSupportedAddCondition,
			conditions,
			isSupportedSku,
			isSingleSelect,
			isSupportedTag,
			isSupportedBatchAddition
		};
		var selectedGoods = { 35647605646: null };
		$ccGoodsSelector
			.goodsSelector(shopList, options, selectedGoods)
			.open().result.then(function(response) {
				console.log('-----------ok-----------');
				console.log(response);
			}, function() {
				console.log('----------cancel---------');
			});
	}

	// top + 商品维度 + 单店铺 + 单选（微信CRM）
	function openTopSingleSelectWithoutShopList($scope, $ccGoodsSelector, isSupportedAddCondition, isSupportedBatchAddition) {
		var shopList = {shopId: '106878997', shopName: '黑色', plat: 'top'};
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			tenantId,
			isSupportedAddCondition,
			conditions,
			isSupportedSku,
			isSingleSelect,
			isSupportedTag,
			isSupportedBatchAddition
		};
		var selectedGoods = { 35647605646: null };
		$ccGoodsSelector
			.goodsSelector(shopList, options, selectedGoods)
			.open().result.then(function(response) {
				console.log('-----------ok-----------');
				console.log(response);
			}, function() {
				console.log('----------cancel---------');
			});
	}
})(window.angular);
