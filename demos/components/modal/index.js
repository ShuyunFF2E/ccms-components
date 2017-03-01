/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-02-28
 */
;(function(angular) {

	'use strict';

	Controller.$inject = ['$log', '$ccTips', '$element', 'modalInstance', 'data'];
	function Controller($log, $ccTips, $element, modalInstance, data) {

		$log.log('1111', data);

		this.entity = ['A', 'B', 'C'];

		this.join = function(entity) {
			return entity.join(',');
		};

		this.opened = true;

		this.template = '<div>' +
			'<div ng-repeat="i in $ctrl.entity" ng-bind="i"></div>' +
			'</div>';

		this.scopedArray = 'a b c d e f g h i j k l m n o p q r s t u v w x y z'.split(' ');

		this.showSuccess = () => {
			$ccTips.success('sdfsfsdfsfsfdsfsd', $element[0].querySelector('.modal-body'));
		};

		this.showError = () => {

			$ccTips.error('sdfsfsdfsfsfdsfsd', $element[0].querySelector('.modal-body'));
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


		this.channelInfo = [
			{
				name: 'GatewayType 0',
				gatewayType: 0,
				keywords: [
					// {
					// 	name: 'XBL',
					// 	text: '小变量',
					// 	defaultValue: '小变量'
					// },
					// {
					// 	name: 'DBL',
					// 	text: '大变量',
					// 	defaultValue: '大变量'
					// },
					{
						type: 'taobao',
						name: 'XMTB',
						text: '姓名淘宝',
						defaultValue: '西凉少女Ash'
					},
					{
						type: 'taobao',
						name: 'XMJDWMRZ',
						text: '姓名京东无默认值'
					},
					{
						type: 'taobao',
						name: 'DDBH',
						text: '订单编号',
						defaultValue: '6666666666'
					},
					{
						type: 'taobao',
						name: 'LXDH',
						text: '联系电话',
						defaultValue: '180-0000-0000'
					},
					{
						type: 'taobao',
						name: 'YBD_1',
						text: '用不到 1',
						defaultValue: '用不到 1'
					},
					{
						type: 'taobao',
						name: 'YBD_2',
						text: '用不到 2',
						defaultValue: '用不到 2'
					},
					{
						type: 'taobao',
						name: 'YBD_2',
						text: '用不到 2',
						defaultValue: '用不到 2'
					},
					{
						type: 'taobao',
						name: 'YBD_2',
						text: '用不到 2',
						defaultValue: '用不到 2'
					},
					{
						type: 'taobao',
						name: 'YBD_2',
						text: '用不到 2',
						defaultValue: '用不到 2'
					}
				],
				unsubscribeText: '退订回复TD',
				//useUnsubscribe: true,
				content: '亲爱的$$_[taobao]XMTB_$$ / $$_[taobao]XMJDWMRZ_$$, 您的订单$$_[taobao]DDBH_$$正在派送.  ($$ $ $$) 签名: $$_XBL_$$ http://www.taobao.com# {emo-5}',
				signature: '[通道签名 1]',
				disabled: true
			},
			{
				name: 'GatewayType 1',
				gatewayType: 1,
				keywords: [
					{
						type: 'taobao',
						name: 'YBD_1',
						text: '用不到 1',
						defaultValue: '用不到 1'
					},
					{
						type: 'taobao',
						name: 'YBD_2',
						text: '用不到 2',
						defaultValue: '用不到 2'
					}
				],
				content: '<span id="normal_1000" class="iframeButton 1000">淘宝昵称</span> &nbsp;'
			},
			{
				name: 'GatewayType 2',
				gatewayType: 2,
				signature: '[通道签名 2]',
				content: '  1  1  '
			},
			{
				name: 'GatewayType 3',
				gatewayType: 3,
				signature: '[通道签名 3]',
				content: '1$$_[taobao]XMTB_$$1'
			}
		];

		this.channel = this.channelInfo[0];

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
						body: '/demos/components/modal/modal-body.tpl.html',
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
						body: '/demos/components/modal/modal-body.tpl.html',
						footer: '/demos/components/modal/modal-footer.tpl.html',
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
