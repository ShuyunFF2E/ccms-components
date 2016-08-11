/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-02-28
 */
;(function(angular) {

	'use strict';

	Controller.$inject = ['$log', 'TipsService', '$element', '$scope', 'modalInstance', 'data'];
	function Controller($log, TipsService, $element, $scope, modalInstance, data) {

		$log.log('1111', data);

		this.scopedArray = 'a b c d e f g h i j k l m n o p q r s t u v w x y z'.split(' ');

		this.showSuccess = () => {
			TipsService.success('sdfsfsdfsfsfdsfsd', $element[0].querySelector('.modal-body'));
		};

		this.showError = () => {

			TipsService.error('sdfsfsdfsfsfdsfsd', $element[0].querySelector('.modal-body'));
		};

		this.addRandom = function() {
			this.scopedArray.push(Math.random());
		};

		/**
		 * 通过复写modal的 ok cancel close 方法的方式加入自己的逻辑
		 * 未复写则使用默认逻辑(简单的关闭弹出框,不做任何业务操作)
		 */
		this.ok = function() {
			modalInstance.ok(this.scopedArray);
		};

		this.cancel = function() {
			modalInstance.cancel(this.scopedArray);
		};

		this.close = function() {
			console.log('close');
			modalInstance.close();
		};

		this.previous = function() {
			console.log('上一步');
		};

		this.sure = function() {
			console.log('sure');
			modalInstance.ok([]);
		};

		this.fuckOff = function() {
			console.log('fuck off');
			modalInstance.cancel();
		};

	}

	angular.module('app', ['ccms.components'])

		.controller('ctrl', function($scope, $ccModal) {

			//$scope.array = [1, 2, 3, 4, 5];

			var self = this;

			this.array = [1, 2, 3];

			$scope.confirm = function() {

				var modalInstance = $ccModal.confirm('活动删除后将无法恢复,确定要删除活动吗?<span style="color: red">ssss</span>', function() {
					console.log('close');
				});

				modalInstance.open().result.then(function() {
					console.log('确认');
				}, function() {
					console.log('取消');
				});

			};

			$scope.openBase = function() {
				$ccModal

					.modal({
						title: '基础模态框',
						hasFooter: false,
						style: {
							// 'min-height': '200px',
							height: '300px',
							'min-width': '300px'
						},
						locals: {
							data: [1, 2, 3]
						},
						body: '/demos/modal/modal-body.tpl.html',
						controller: Controller,
						onClose: function(...args) {
							console.log(args);
						}
					})

					.open();
			};

			$scope.open = function() {

				var modalInstance = $ccModal

					.modal({
						scope: $scope,
						title: '这个星球最好用的modal',
						fullscreen: true,
						locals: {
							data: [1, 2, 3]
						},
						style: {
							// width: '800px',
							// 'max-width': '400px'
							//height: '850px'
						},
						body: '/demos/modal/modal-body.tpl.html',
						footer: '/demos/modal/modal-footer.tpl.html',
						controller: Controller,
						bindings: self
					})

					.open();

				// 收集modal的操作反馈,确认为成功回调,取消为失败回调
				modalInstance.result.then(function(v) {
					self.array = v;
					console.log('resolved', v);
				}, function(v) {
					self.array.length = 0;
					console.log('rejected', v);

				});
			};

		});

})(window.angular);
