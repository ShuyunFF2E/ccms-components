/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

;(function (angular) {

	'use strict';

	angular.module('app', ['ccms.components'])

		.controller('ctrl', function ($scope, $ccAreaSelector) {

			var href = window.location.href;

			$scope.highlight_item = href.substring(href.indexOf('/demos/') + 7, href.lastIndexOf('/'));

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

			$scope.open = function () {

				var areaSelectorInstance = $ccAreaSelector

					.areaSelector({
						areaSelectorData: INPUT
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
