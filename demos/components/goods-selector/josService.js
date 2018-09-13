;(function(angular) {
	'use strict';

	angular.module('josService', [])
		.factory('josFactory', function() {
			return {
				openJosWithShopList,
				openJosWithoutShopList,
				openJosWithoutSkuWithShopList,
				openJosWithoutSkuWithoutShopList,
				openJosSingleSelectWithShopList,
				openJosSingleSelectWithoutShopList
			};
		});

	var isOnlyChecked = false; // 是否包含 footer
	var maxSelectedNumber = 1000; // 最大允许选择的商品数量
	var serverName = ''; // http://qa-ual.fenxibao.com  或  http://ual.fenxibao.com
	var isSupportedAddCondition = true; // 是否支持添加为搜索条件
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
		shopId: 24058, // 店铺ID
		skusId: ['22342343'], // 商品编号
		skusOuterId: '44444', // sku 商家编码
		skusPropsVname: '55555', // sku 规格
		startListTime: new Date(1530374400000), // 上架时间
		status: '1' // 商品状态
	};
	var isSupportedSku = false; // 是否支持 sku
	var isSingleSelect = true; // 是否是单选列表

	// jos + sku 维度 + 店铺选择
	function openJosWithShopList($scope, $ccGoodsSelector) {
		var shopList = [{shopId: '23591', shopName: 'JD数云食堂', plat: 'jos'}, {shopId: '24058', shopName: '数云食堂', plat: 'jos'}];
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			isSupportedAddCondition,
			conditions
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

	// jos + sku 维度 + 单店铺
	function openJosWithoutShopList($scope, $ccGoodsSelector) {
		var shopList = {shopId: '23591', shopName: 'JD数云食堂', plat: 'jos'};
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			isSupportedAddCondition,
			conditions
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

	// jos + 商品维度 + 店铺选择
	function openJosWithoutSkuWithShopList($scope, $ccGoodsSelector) {
		var shopList = [{shopId: '23591', shopName: 'JD数云食堂', plat: 'jos'}, {shopId: '24058', shopName: '数云食堂', plat: 'jos'}];
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			isSupportedAddCondition,
			conditions,
			isSupportedSku
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

	// jos + 商品维度 + 单店铺
	function openJosWithoutSkuWithoutShopList($scope, $ccGoodsSelector) {
		var shopList = {shopId: '23591', shopName: 'JD数云食堂', plat: 'jos'};
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			isSupportedAddCondition,
			conditions,
			isSupportedSku
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

	// jos + 商品维度 + 店铺选择 + 单选（微信CRM）
	function openJosSingleSelectWithShopList($scope, $ccGoodsSelector) {
		var shopList = [{shopId: '23591', shopName: 'JD数云食堂', plat: 'jos'}, {shopId: '24058', shopName: '数云食堂', plat: 'jos'}];
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			isSupportedAddCondition,
			conditions,
			isSupportedSku,
			isSingleSelect
		};
		var selectedGoods = { 10000227589: null };
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
	function openJosSingleSelectWithoutShopList($scope, $ccGoodsSelector) {
		var shopList = {shopId: '23591', shopName: 'JD数云食堂', plat: 'jos'};
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			isSupportedAddCondition,
			conditions,
			isSupportedSku,
			isSingleSelect
		};
		var selectedGoods = { 10000227589: null };
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
