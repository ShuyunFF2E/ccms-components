;(function(angular) {

	'use strict';

	angular.module('app', ['ccms.components'])

		.controller('ctrl', function($scope, $ccGoodsSelector) {

			var selectedGoods = [
				{
					categories: [
						{name: '', id: '0'},
						{name: '', id: '0'}
					],
					checked: true,
					created: 1482719954000,
					delistTime: 1509874264000,
					detailUrl: '',
					id: '10199314998',
					inputPids: '',
					inputStr: '',
					interceptName: '尚都比拉2017春装新品条纹印花圆...',
					lastSync: 1522665338912,
					listTime: 1482768061000,
					modified: 1521627790000,
					name: '尚都比拉2017春装新品条纹印花圆领T恤女装韩版修身长袖套头上衣JDW71T0714443',
					order: 0,
					outerId: '',
					partial: false,
					picUrl: 'http://img13.360buyimg.com/n1/jfs/t3121/252/4975450055/282514/f604f5cb/58608247N8d88e818.jpg',
					platStatus: '2',
					price: 198,
					props: [],
					quantity: 4,
					shopCategories: [],
					shopId: '10026',
					skus: [],
					status: 0
				},
				{
					categories: [
						{name: '', id: '0'},
						{name: '', id: '0'}
					],
					checked: true,
					created: 1482719954000,
					delistTime: 1509874264000,
					detailUrl: '',
					id: '10303773895',
					inputPids: '',
					inputStr: '',
					interceptName: '尚都比拉2017春装新品条纹印花圆...',
					lastSync: 1522665338912,
					listTime: 1482768061000,
					modified: 1521627790000,
					name: '尚都比拉2017春装新品条纹印花圆领T恤女装韩版修身长袖套头上衣JDW71T0714443',
					order: 0,
					outerId: '',
					partial: false,
					picUrl: 'http://img13.360buyimg.com/n1/jfs/t3121/252/4975450055/282514/f604f5cb/58608247N8d88e818.jpg',
					platStatus: '2',
					price: 198,
					props: [],
					quantity: 4,
					shopCategories: [],
					shopId: '10026',
					skus: [],
					status: 0
				}
			];

			var taobaoWithShopList = [{shopId: 70866974, shopName: '数云食堂', plat: 'top'}, {shopId: 10001, shopName: 'JD数云食堂', plat: 'top'}];
			// var jsWithShopList = [{shopId: 24058, shopName: 'JD数云食堂', plat: 'jos'}, {shopId: 24058, shopName: '数云食堂', plat: 'jos'}];
			var jsWithShopList = [{shopId: 10026, shopName: 'JD数云食堂', plat: 'jos'}, {shopId: 24058, shopName: '数云食堂', plat: 'jos'}];
			var taobaoWithoutShopList = {shopId: 70866974, shopName: '数云食堂', plat: 'top'};
			var jdWithoutShopList = {shopId: 70866974, shopName: 'JD数云食堂', plat: 'jos'};

			var isOnlyChecked = false;

			// taobao + 店铺选择
			$scope.openTaobaoGoodsSelectorWithShopList = function() {
				$ccGoodsSelector
					.goodsSelector(taobaoWithShopList, isOnlyChecked)
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
					.goodsSelector(jsWithShopList, isOnlyChecked, selectedGoods)
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
					.goodsSelector(taobaoWithoutShopList, isOnlyChecked)
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
					.goodsSelector(jdWithoutShopList, isOnlyChecked)
					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

		});

})(window.angular);
