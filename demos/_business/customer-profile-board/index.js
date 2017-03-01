/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

;(function (angular, undefined) {

	'use strict';

	angular
		.module('app', ['ccms.components'])
		.config(['$ccCustomerProfileBoardProvider', function($ccCustomerProfileBoardProvider) {
			$ccCustomerProfileBoardProvider.setAPI('//qa-ual.fenxibao.com');
		}])
		.controller('ctrl', function ($scope, $ccCustomerProfileBoard) {

			$scope.customerInformation = {
				nickName: 'xinlee0606',
				shopId: '71677914',
				tenantId: 'qiushi6',
				platName: '1'
			};

			$scope.pop = function() {
				$ccCustomerProfileBoard.popProfileBoardModal($scope.customerInformation);
			}
		});

})(window.angular);
