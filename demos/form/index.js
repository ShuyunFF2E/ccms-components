/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-08
 */
;(function (angular, undefined) {

	'use strict';

	angular
		.module('app', ['ccms.components'])
		.controller('appCtrl', function ($Validator) {

			this.validators = {

				required: '要填东西哦亲!',

				number: /(^\s*$)|(^\d+$)/,

				handsome: {
					msg: '不够帅',
					fn: (modelValue, viewValue) => {
						const value = modelValue || viewValue;
						return value ? value.startsWith('kuitos') : !value;
					}
				},

				letter: {
					msg: '必须为字母',
					regex: /(^\s*$)|(^\w+$)/
				}

			};

			this.reset = function (formCtrl) {
				$Validator.setPristine(formCtrl);
			};

			this.validateGay = function () {
				$Validator.validate(this.gay).then(() => {
					console.log('校验成功!');
				}, () => {
					console.log('校验失败!');
				});
			};

			this.validate = function () {

				$Validator.validate(this.guy).then(() => {
					console.log('校验成功!');
				}, () => {
					console.log('校验失败!');
				});

			};
		});

})(window.angular);

