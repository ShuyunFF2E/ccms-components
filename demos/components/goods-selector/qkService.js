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
	var tenantId = 'yangyangyang3'; // 租户ID
	var conditions = { // 搜索条件
		endListTime: new Date(1531843200000), // 下架时间
		id: ['11111'], // 商品ID
		maxPrice: '200', // 最高价
		minPrice: '100', // 最低价
		name: '22222', // 商品名称
		platform: 'top', // 平台
		categoriesId: '1089', // 商品标准类目 '111111'
		shopId: 'qiakr_2230, qiakr_2223',
		skusId: ['22342343'], // 商品编号
		skusPropsVname: '55555', // sku 规格
		startListTime: new Date(1530374400000), // 上架时间
		status: '1',
		brandId: '1111'
	};
	var isSingleSelectShopList = false; // 店铺选择（单选/多选）
	var selectedShopId = ['taobao_23456789', 'qiakr_2230', 'qiakr_2223']; // 店铺多选时，已选店铺ID数组

	// qiakr + sku 维度 + 店铺选择（单选）
	function openQkSingleSelectShopList($scope, $ccGoodsSelector, isSupportedAddCondition) {
		var shopList = [{shopId: '2260', shopName: '恰客', plat: 'qiakr'}, {shopId: '234234', shopName: '恰客1', plat: 'qiakr'}];
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			isSupportedAddCondition,
			conditions,
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
	function openQkMultipleSelectShopList($scope, $ccGoodsSelector, isSupportedAddCondition) {
		var shopIdArr = ['qiakr_699886823271', 'taobao_69988656765882', 'qiakr_69983486873', 'qiakr_6998868227', 'taobao_69988683345348', 'taobao_699886456546884', 'qiakr_699834586875', 'taobao_69988684534586', 'qiakr_699845686877a', 'taobao_699886888456456b', 'qiakr_69957688687c', 'taobao_6994564588688d', 'qiakr_699886576871e', 'taobao_6994564564886882f', 'qiakr_69985686873g', 'taobao_65465499886884h', 'qiakr_699885676875i', 'taobao_6456499886886j', 'qiakr_699886876877k', 'taobao_6956469886888l', 'qiakr_699886345387m', '45645645', 'qiakr_69988345356871o', 'taobao_699886845645682p', 'qiakr_69983463486873q', 'taobao_69988645645645884r', 'qiakr_69985675686875s', 'taobao_699885645646886t', 'qiakr_699882342346877u', 'taobao_699823423486888v'];
		var shopList = shopIdArr.map(id => {
			return {
				shopId: id,
				shopName: '洽课' + id,
				plat: 'qiakr'
			};
		});
		var options = {
			isOnlyChecked,
			maxSelectedNumber,
			serverName,
			isSupportedAddCondition,
			conditions,
			isSingleSelectShopList,
			tenantId,
			selectedShopId
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
