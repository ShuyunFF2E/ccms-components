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
				'320000,321200,321281'
			];


			$scope.open = function (INPUT) {

				var areaSelectorInstance = $ccAreaSelector

					.areaSelector({
						scope: $scope,
						bindings: self
					})

					.open(INPUT).result.then(function(response) {
						console.log('-----------ok-----------');
						console.log(response);
					}, function() {
						console.log('----------cancel---------');
					});
			};
		});

})(window.angular);
