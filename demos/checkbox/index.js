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

			$scope.demo1 = false;
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
			$scope.demo5 = false;

			$scope.change = function () {
				console.log('something changed.');
			}
		});

})(window.angular);

