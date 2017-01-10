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
				{ id: '310000,310100,310101', name: '' },
				{ id: '310000,310100,310104', name: '' },
				{ id: '310000,310100,310105', name: '' },
				{ id: '310000,310100,310106', name: '' },
				{ id: '310000,310100,310107', name: '' },
				{ id: '310000,310100,310108', name: '' },
				{ id: '320000,320100', name: '' },
				{ id: '320000,321300', name: '' },
				{ id: '320000,321200,321281', name: '' },
				{ id: '440000,440100', name: '' },
				{ id: '440000,440300', name: '' },
				{ id: '440000,440600', name: '' },
				{ id: '440000,441900', name: '' },
				{ id: '440000,442000', name: '' },
				{ id: '440000,440400', name: '' },
				{ id: '440000,441300', name: '' },
				{ id: '440000,440700', name: '' },
				{ id: '440000,441200', name: '' },
				{ id: '110000', name: '' },
				{ id: '120000', name: '' },
				{ id: '130000', name: '' }
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
