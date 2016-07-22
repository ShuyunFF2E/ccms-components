/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

;(function (angular, undefined) {

	'use strict';

	angular
		.module('app', ['ccms.components'])
		.controller('ctrl', function ($scope, CustomerProfileBoardService) {

			$scope.pop = function() {
				CustomerProfileBoardService.popProfileBoardModal($scope);
			}
		});

})(window.angular);

