/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

;(function (angular, undefined) {

	'use strict';

	angular
		.module('app', ['ccms.components'])
		.controller('ctrl', function ($scope) {

			var href = window.location.href;

			$scope.highlight_item = href.substring(href.indexOf('/demos/') + 7, href.lastIndexOf('/'));

			$scope.demo = {
				value: 'a',
				setting: ['a', 'b', 'c', 'd'],
				disabled: false
			};

			$scope.generatorValues = () =>{
				$scope.demo.setting = $scope.demo.setting.map(() => Math.floor(Math.random() * 10));
			};

			$scope.change = function () {
				console.log('something changed.');
			}
		});

})(window.angular);

