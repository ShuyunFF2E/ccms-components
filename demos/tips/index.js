/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-08
 */
;(function (angular, undefined) {

	'use strict';

	angular
		.module('app', ['ccms.components', 'ui.router'])
		.config(function ($stateProvider, $urlRouterProvider) {

			$urlRouterProvider.otherwise('/app');

			$stateProvider
				.state('app', {
					url: '/app',
					template: '<div>' +
					'<h2>第一层容器</h2>' +
					'<ul>' +
					'<li><a ui-sref="app.container1">module1</a></li>' +
					'<li><a ui-sref="app.container2">module2</a></li>' +
					'</ul>' +
					'<ui-view></ui-view>' +
					'</div>'
				})
				.state('app.container1', {
					url: '/module1',
					template: '<span>第二层容器:container1</span>'
				})
				.state('app.container2', {
					url: '/module2',
					template: '<span>第二层容器:container2</span>'
				});

		})
		.controller('ctrl', function($scope, $ccTips, $ccModal) {

			let tips = null;

			$scope.showSuccess = function() {
				$ccTips.success('成功提示');
			};

			$scope.showError = function() {
				if (!tips || !tips.element) {
					tips = $ccTips.error('<p style="color: red;">出错提示</p>出错提示出错提示出错提示出错提示出错提示出错提示出错提示出错提示' + Math.random());
				}
			};

			$scope.showModal = function() {
				$ccModal.modal({

					title: 'tips in modal',
					body: '/demos/tips/modal-body.tpl.html',
					controller: ['$element', function($element) {

						this.showSuccess = function() {
							$ccTips.success('hhhhh', $element[0].querySelector('.modal-body'));
						};

						this.showError = function() {
							$ccTips.error('sssssss', $element[0].querySelector('.modal-body'));
						};

					}]

				}).open();
			};
		});

})(window.angular);

