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

			$scope.demo2 = false;
			$scope.demo3 = {
				trueValue: 'up',
				falseValue: 'down',
				state: 'up'
			};
			$scope.demo4 = {
				value: false,
				indeterminate: true
			};
			$scope.demo5 = {
				value: false,
				disabled: true
			};

			$scope.change = function () {
				console.log('something changed.');
			}
		});

})(window.angular);

