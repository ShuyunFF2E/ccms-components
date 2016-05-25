/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-17
 */

import '../_form.scss';
import Tooltip from '../../tooltip/Tooltip';
import {TOOLTIP_TYPE} from '../../tooltip/Contants';
import {closestParent} from '../../../common/utils/style-helper';

import {VALIDATORS, formatValidator} from '../Constant';

/**
 * <pre>校验提示指令</pre>
 * <pre>
 * 声明当前输入会绑定校验提示
 * 自动触发的时机处于绑定的model更新时刻. 也就是可以通过配置{@link ng-model-options}来控制model更新时机,从而控制自动校验的时机.
 * 如果需要手动触发校验,可以调用$Validator.validate方法来实现.
 * 支持异步校验(比如校验输入的用户名是否存在).
 * </pre>
 *
 * <a href="/demos/form" target="_blank">DEMO</a>
 * @example
 * <caption>光标移除时才触发校验</caption>
 * <div validators name="formCtrl">
 *  <input ng-model="model" ng-model-options="{updateOn:'default blur'}" type="input" validator>
 * </div>
 */
export default class ValidatorDirective {

	/**
	 * @private
	 */
	constructor() {
		/** @private */
		this.restrict = 'A';
		/** @private */
		this.require = ['ngModel', '?^^validators', '?^^form'];
	}

	/**
	 * @private
	 */
	link(scope, element, attr, ctrls) {

		const ngModelCtrl = ctrls[0];
		const validatorsCtrl = ctrls[1] || formatValidator(VALIDATORS);

		// 根据当前元素绑定的验证器id,将相应的validator赋给ctrl.$validators
		if (attr.validator) {

			attr.validator.split(',').forEach(prop => {

				const field = prop.trim();
				if (validatorsCtrl.validators[field]) {
					ngModelCtrl.$validators[field] = validatorsCtrl.validators[field];
				}
			});
		}

		let formEl;
		// 如果未使用validators声明需要校验的区域,表明这时候肯定是通过form来实现的表单
		if (!ctrls[1]) {
			formEl = closestParent(element[0], 'form');
		} else {
			formEl = ctrls[1].element;
		}

		const tooltipType = formEl.getAttribute('tooltip-type');
		const tooltip = new Tooltip(element[0], tooltipType ? `error-${tooltipType}` : TOOLTIP_TYPE.ERROR_MINOR);
		const toggleTips = () => {

			for (let id in ngModelCtrl.$error) {

				if (ngModelCtrl.$error.hasOwnProperty(id)) {

					let msg = attr[`${id}Msg`] || validatorsCtrl.errorMsg[id];
					if (ngModelCtrl.$error.hasOwnProperty(id) && msg) {
						tooltip.open(msg);
						return;
					}
				}
			}

			tooltip.close();
		};

		/*
		 * 判断需要校验的表单是否合法
		 * 如果使用的是ng自带的form指令,则直接返回formCtrl.$valid,否则检查每一个需要校验的ngModel
		 */
		const isFormValid = formCtrl => {

			if (formCtrl.$valid !== undefined) {
				return formCtrl.$valid;
			} else {

				return formCtrl.$$ngModelCtrls.every(ctrl => {
					return ctrl.$valid;
				});
			}
		};

		// 检查是否是用的ng自带的form指令
		const formCtrl = ctrls[2] || validatorsCtrl;
		formCtrl.$$ngModelCtrls = formCtrl.$$ngModelCtrls || [];
		formCtrl.$$ngModelCtrls.push(ngModelCtrl);

		const originalSetPristine = ngModelCtrl.$setPristine;
		ngModelCtrl.$setPristine = () => {
			originalSetPristine();
			tooltip.close();
		};

		/*
		 * aop
		 * 在触发校验器的原始方法中加入错误提示钩子
		 * 黑魔法,小孩子不要随便用
		 * @see https://github.com/angular/angular.js/blob/master/src%2Fng%2Fdirective%2FngModel.js#L584
		 */
		const originValidatorFn = ngModelCtrl.$$runValidators;
		ngModelCtrl.$$runValidators = (modelValue, viewValue, doneCallback) => {

			// 改写校验完成的回调,加入后置方法
			const originCb = doneCallback;
			doneCallback = allValid => {
				originCb(allValid);

				// 用户已经有过输入交互才开始校验逻辑
				// 或者当前validate是用户手动触发的
				if (ngModelCtrl.$dirty || formCtrl.$$invalidCount > 0) {
					toggleTips();
				}

				// 如果已经全部校验完成(包括$$invalidCount一开始就为0的情况),则根据校验结果触发defer相应的动作
				if (--formCtrl.$$invalidCount <= 0) {
					formCtrl.$$validatedDefer[isFormValid(formCtrl) ? 'resolve' : 'reject']();
				}

			};

			originValidatorFn(modelValue, viewValue, doneCallback);
		};

	}

}
