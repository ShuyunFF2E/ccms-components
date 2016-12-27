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

			$scope.open = function () {

				var areaSelectorInstance = $ccAreaSelector

					.areaSelector({
						scope: $scope,
						bindings: self
					})

					.open();
			};

		});

})(window.angular);
