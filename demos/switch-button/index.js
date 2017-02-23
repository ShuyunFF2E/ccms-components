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

			$scope.demo1 = false;
		});

})(window.angular);

