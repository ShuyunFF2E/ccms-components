/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

;(function (angular) {

	'use strict';

	angular.module('app', ['ccms.components'])
		.config(function(ccAreaSelectorProvider){
			// 启用后端数据 http://qa-ual.fenxibao.com/shuyun-searchapi/1.0/area  或  http://ual.fenxibao.com/shuyun-searchapi/1.0/area
			ccAreaSelectorProvider.configSetting('/api/area', 'jd');
		})
		.controller('ctrl', function ($scope, $ccAreaSelector) {

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

			$scope.responseWithIdAndName = function () {

				var areaSelectorInstance = $ccAreaSelector

					.areaSelector({
						areaSelectorData: INPUT,
						valueFormat: $ccAreaSelector.ID_ONLY
					})

					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

			$scope.responseWithName = function () {

				var areaSelectorInstance = $ccAreaSelector

					.areaSelector({
						areaSelectorData: INPUT,
						valueFormat: $ccAreaSelector.ID_NAME
					})

					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

			var JDINPUT = [{ id: '-27,-2376', name: '陕西省 > 西安市' }];
			var customAreas = [
				{
					'id': 7,
					'name': '大西安',
					'subArea': ['-27,-2376', '-27,-2402']
				},
				{
					'id': 1, // id 相同会覆盖前面的数据
					'name': '关中城市圈',
					'subArea': ['-27,-2376', '-27,-2402', '-27,-2386', '-27,-2416', '-27,-2390']
				}
			];


			$scope.responseWithIdAndNameJD = function () {

				var areaSelectorInstance = $ccAreaSelector

					.areaSelector({
						areaSelectorData: JDINPUT,
						valueFormat: $ccAreaSelector.ID_ONLY,
						platform: 'jd',
						customAreas: customAreas
					})

					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

			$scope.responseWithNameJD = function () {

				var areaSelectorInstance = $ccAreaSelector

					.areaSelector({
						areaSelectorData: JDINPUT,
						valueFormat: $ccAreaSelector.ID_NAME,
						platform: 'jd',
						customAreas: customAreas
					})

					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};

			const MARKETING_COMMON_AREAS = [
				{
					'id': 1,
					'name': '华东地区',
					'subArea': ['310000', '320000', '330000', '340000', '350000', '370000']
				},
				{
					'id': 2,
					'name': '华南地区',
					'subArea': ['440000', '450000', '460000']
				},
				{
					'id': 3,
					'name': '华中地区',
					'subArea': ['360000', '410000', '420000', '430000']
				},
				{
					'id': 4,
					'name': '华北地区',
					'subArea': ['110000', '120000', '130000', '140000', '150000']
				},
				{
					'id': 5,
					'name': '西北地区',
					'subArea': ['610000', '620000', '630000', '640000', '650000']
				},
				{
					'id': 6,
					'name': '西南地区',
					'subArea': ['500000', '510000', '520000', '530000', '540000']
				},
				{
					'id': 7,
					'name': '东北地区',
					'subArea': ['210000', '220000', '230000']
				},
				{
					'id': 8,
					'name': '台港澳地区',
					'subArea': ['710000', '810000', '820000']
				}
			];



			$scope.responseMarketing = function () {

				var areaSelectorInstance = $ccAreaSelector

					.areaSelector({
						areaSelectorData: [],
						valueFormat: $ccAreaSelector.ID_NAME,
						customAreas: MARKETING_COMMON_AREAS,
					})

					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);

					}, function() {
						console.log('----------cancel---------');
					});
			};

			$scope.responseMarketingIDNAME = function () {

				var areaSelectorInstance = $ccAreaSelector

					.areaSelector({
						areaSelectorData: [],
						valueFormat: $ccAreaSelector.ID_ONLY,
						customAreas: MARKETING_COMMON_AREAS,
					})

					.open().result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);

					}, function() {
						console.log('----------cancel---------');
					});
			};


		});

})(window.angular);
