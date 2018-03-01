;(function (angular) {

	'use strict';

	angular.module('app', ['ccms.components'])

		.controller('ctrl', function ($scope, $ccGoodsSelector) {

			var INPUT = [
				{ id: '310000,310100,310101', name: '上海市 > 市辖区 > 黄浦区' },
				{ id: '310000,310100,3101011', name: '上海市 > 市辖区 > 沈阳市' },
				{ id: '310000,310100,3101012', name: '上海市 > 市辖区 > 沈河区' },
				{ id: '310000,310100,310104', name: '上海市 > 市辖区 > 徐汇区' },
				{ id: '310000,310100,310105', name: '上海市 > 市辖区 > 长宁区' },
				{ id: '310000,310100,310106', name: '上海市 > 市辖区 > 静安区' },
				{ id: '310000,310100,310107', name: '上海市 > 市辖区 > 普陀区' },
				{ id: '310000,310100,310108', name: '上海市 > 市辖区 > 闸北区' },
				{ id: '320000,320100', name: '江苏省 > 南京市' },
				{ id: '320000,321300', name: '江苏省 > 宿迁市' },
				{ id: '320000,321200,321281', name: '江苏省 > 泰州市 > 兴华市' },
				{ id: '440000,440100', name: '广东省 > 广州市' },
				{ id: '440000,440300', name: '广东省 > 深圳市' },
				{ id: '110000', name: '北京市' },
				{ id: '120000', name: '天津市' },
				{ id: '130000', name: '河北省' }
			];

			var withShopList =  [{shopId: 11111, shopName: '数云食堂', plat: 'taobao'}, {shopId: 10001, shopName: 'JD数云食堂', plat: 'jos'}];
			var jdWithoutShopList = {shopId: 11111, shopName: '数云食堂', plat: 'taobao'};
			var taobaoWithoutShopList = {shopId: 10001, shopName: 'JD数云食堂', plat: 'jos'};

			// taobao + 店铺选择
			$scope.openTaobaoGoodsSelectorWithShopList = function () {
				 $ccGoodsSelector
					.goodsSelector(withShopList)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

			// jd + 店铺选择
			$scope.openJDGoodsSelectorWithShopList = function () {
				$ccGoodsSelector
					.goodsSelector(withShopList)
					.open().result.then(function(response) {
					console.log('-----------ok-----------');
					console.log(response);
				}, function() {
					console.log('----------cancel---------');
				});
			};

			// taobao 无店铺选择
			$scope.openTaobaoGoodsSelector = function () {
				$ccGoodsSelector
					.goodsSelector(taobaoWithoutShopList)
					.open().result.then(function(response) {
					console.log('-----------ok-----------');
					console.log(response);
				}, function() {
					console.log('----------cancel---------');
				});
			};

			// jd 无店铺选择
			$scope.openJDGoodsSelector = function () {
				$ccGoodsSelector
					.goodsSelector(jdWithoutShopList)
					.open().result.then(function(response) {
					console.log('-----------ok-----------');
					console.log(response);
				}, function() {
					console.log('----------cancel---------');
				});
			};

		});

})(window.angular);
