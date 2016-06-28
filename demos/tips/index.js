/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-08
 */
;(function (angular, undefined) {

	'use strict';

	angular
		.module('app', ['ccms.components'])
		.controller('ctrl', function ($scope, TipsService, ModalService) {

			let tips = null;

			$scope.showSuccess = function () {
				TipsService.success('成功提示');
			};

			$scope.showError = function () {
				if (!tips || !tips.element) {
					tips = TipsService.error('出错提示' + Math.random());
				}
			};

			$scope.showModal = function () {
				ModalService.modal({

					title: 'tips in modal',
					body: '/demos/tips/modal-body.tpl.html',
					controller: ['$element', function ($element) {

						this.showSuccess = function () {
							TipsService.success('hhhhh', $element[0].querySelector('.modal-body'));
						};

						this.showError = function () {
							TipsService.error('sssssss', $element[0].querySelector('.modal-body'));
						};

					}]

				}).open();
			};
		});

})(window.angular);

