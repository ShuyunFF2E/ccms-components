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

			const customerInformation = {
				nickName: 's_peggy',
				shopId: '62847409',
				platName: 'taobao'
			};

			$scope.pop = function() {
				CustomerProfileBoardService.popProfileBoardModal($scope, customerInformation);
			}
		});

})(window.angular);

