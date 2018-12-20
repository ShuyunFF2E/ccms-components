;(function(angular) {
	'use strict';

	angular.module('qkService', [])
		.factory('qkFactory', function() {
			return {
				openQkSingleSelectShopList,
				openQkMultipleSelectShopList
			};
		});

	var isOnlyChecked = false; // 是否包含 footer
	var maxSelectedNumber = 1000; // 最大允许选择的商品数量
	var serverName = ''; // http://qa-ual.fenxibao.com  或  http://ual.fenxibao.com
	var conditions = { // 搜索条件
		endListTime: new Date(1531843200000), // 下架时间
		id: ['11111'], // 商品ID
		maxPrice: '200', // 最高价
		minPrice: '100', // 最低价
		name: '22222', // 商品名称
		platform: 'top', // 平台
		categoriesId: '1089', // 商品标准类目 '111111'
		shopId: '72897',
		skusId: ['22342343'], // 商品编号
		skusPropsVname: '55555', // sku 规格
		startListTime: new Date(1530374400000), // 上架时间
		status: 1,
		brandId: '1111'
	};
	var isSingleSelectShopList = false; // 店铺选择（单选/多选）
	var tenantId = 'sjyj';

	// qiakr + sku 维度 + 店铺选择（单选）
	function openQkSingleSelectShopList($scope, $ccGoodsSelector, isSupportedAddCondition, isSupportedBatchAddition, isTotalChannel) {
		var shopList = isTotalChannel
			? [{shopId: '72903', shopName: '恰客', plat: 'uni_offline', partner: 'qiakr'}, {shopId: '72897', shopName: '恰客1', plat: 'uni_offline', partner: 'qiakr'}]
			: [{shopId: '72903', shopName: '恰客', plat: 'offline'}, {shopId: '72897', shopName: '恰客1', plat: 'offline'}];
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			isSupportedAddCondition,
			conditions,
			isSupportedBatchAddition,
			isTotalChannel,
			tenantId
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

	// qiakr + sku 维度 + 店铺选择（多选）
	function openQkMultipleSelectShopList($scope, $ccGoodsSelector, isSupportedAddCondition, isSupportedBatchAddition, isTotalChannel) {
		var shopList = isTotalChannel
			? [{shopId: '72903', shopName: '恰客', plat: 'uni_offline', partner: 'qiakr'},
				{shopId: '72899', shopName: '恰客1', plat: 'uni_offline', partner: 'qiakr'},
				{shopId: '64674', shopName: '恰客2', plat: 'uni_offline', partner: 'qiakr'},
				{shopId: '72916', shopName: '恰客3', plat: 'uni_offline', partner: 'qiakr'},
				{shopId: '72897', shopName: '恰客4', plat: 'uni_offline', partner: 'qiakr'}]
			: [{shopId: '72903', shopName: '恰客', plat: 'offline'},
				{shopId: '72899', shopName: '恰客1', plat: 'offline'},
				{shopId: '64674', shopName: '恰客2', plat: 'offline'},
				{shopId: '72916', shopName: '恰客3', plat: 'offline'},
				{shopId: '72897', shopName: '恰客4', plat: 'offline'}];
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			isSupportedAddCondition,
			conditions,
			isSingleSelectShopList,
			isSupportedBatchAddition,
			isTotalChannel,
			tenantId
		};
		var selectedGoods = {
			556820: null,
			550527: null
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
})(window.angular);
