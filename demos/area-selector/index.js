/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

;(function (angular) {

	'use strict';

	angular.module('app', ['ccms.components'])

		.controller('ctrl', function ($scope, $ccAreaSelector) {

			var self = this;

			var INPUT = [
				'310000,310100,310101',
				'310000,310100,310104',
				'310000,310100,310105',
				'310000,310100,310106',
				'310000,310100,310107',
				'310000,310100,310108',
				'320000,320100',
				'320000,321300',
				'320000,321200,321281',
				'440000,440100',
				'440000,440300',
				'440000,440600',
				'440000,441900',
				'440000,442000',
				'440000,440400',
				'440000,441300',
				'440000,440700',
				'440000,441200',
				'110000',
				'120000',
				'130000'
			];


			$scope.open = function () {

				var areaSelectorInstance = $ccAreaSelector

					.areaSelector({
						scope: $scope,
						areaSelectorData: {
							selectedData: INPUT
						}
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
