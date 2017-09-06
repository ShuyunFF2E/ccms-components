/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-17
 */
import {Inject} from 'angular-es-utils/decorators';

import Tooltip from '../tooltip/Tooltip';
import {TOOLTIP_TYPE} from '../tooltip/Contants';
import {closestTagParent, closestAttrParent} from '../../common/utils/style-helper';

import {DEFAULT_VALIDATORS, formatValidator} from './Constant';

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
@Inject('$element', '$attrs')
export default class ValidatorCtrl {

	$onInit() {

		// dependency check
		if (!this.formCtrl) {
			console.warn('不推荐直接使用validator指令,建议配合form/ngForm使用!');

			if (!this.validatorsCtrl) {
				throw new Error('validator指令必须配合form/ngFrom/validators其中至少一个指令使用!');
			} else {
				this.formCtrl = this.validatorsCtrl;
			}

		} else {

			// 如果未使用validators声明需要校验的区域,表明这时候肯定是通过form/ngForm来实现的表单
			if (!this.validatorsCtrl) {
				this.validatorsCtrl = this._initNonValidatorsDeclaredCtrl();
			}

			// attention! 必须保证formCtrl跟原始formCtrl持有同一个引用
			this.formCtrl = Object.assign(this.formCtrl, this.validatorsCtrl);
		}

		this.tooltip = null;

		this.tooltipType = this.formCtrl.element.getAttribute('tooltip-type');
		this.tooltipPlacement = this.formCtrl.element.getAttribute('tooltip-placement');

		// 根据当前元素绑定的验证器id,将相应的validator赋给ctrl.$validators
		// angular private api
		if (this.validator) {

			const validators = this.formCtrl.validators;
			this.validator.split(',').forEach(prop => {

				const field = prop.trim();
				if (validators[field]) {
					this.ngModelCtrl.$validators[field] = validators[field];
				}
			});
		}
	}

	$postLink() {

		const {formCtrl, ngModelCtrl} = this;

		/*
		 * 保存ngModelCtrl到表单控制器中
		 */
		formCtrl.$$ngModelCtrls = formCtrl.$$ngModelCtrls || [];
		formCtrl.$$ngModelCtrls.push(ngModelCtrl);

		/*
		 * 重写ngModelCtrl的setPristine方法
		 */
		const originalSetPristine = ngModelCtrl.$setPristine;
		ngModelCtrl.$setPristine = () => {
			originalSetPristine();
			this._closeTooltip();
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
					this._toggleTooltip();
				}

				// 如果已经全部校验完成(包括$$invalidCount一开始就为0的情况),则根据校验结果触发defer相应的动作
				if (--formCtrl.$$invalidCount <= 0) {
					formCtrl.$$validatedDefer[isFormValid(formCtrl) ? 'resolve' : 'reject']();
				}

			};

			originValidatorFn(modelValue, viewValue, doneCallback);
		};

	}

	/**
	 * 初始化未使用validators声明的表单校验控制器
	 * @return {{element}, validators, errorMsg}
	 */
	_initNonValidatorsDeclaredCtrl() {

		let formEl = closestTagParent(this._$element[0], 'form');

		if (!formEl) {
			formEl = closestAttrParent(this._$element[0], 'ng-form');
		}

		return {...formatValidator(DEFAULT_VALIDATORS), element: formEl};
	}

	_openTooltip(msg) {
		this.tooltip = this.tooltip || new Tooltip(this._$element[0], this.tooltipType ? `error-${this.tooltipType}` : TOOLTIP_TYPE.ERROR_MINOR, null, this.tooltipPlacement ? this.tooltipPlacement : undefined);
		this.tooltip.open(msg);
	}

	_closeTooltip() {
		if (this.tooltip) {
			this.tooltip.close();
			this.tooltip = null;
		}
	}

	_toggleTooltip() {

		const {ngModelCtrl, formCtrl, _$attrs} = this;

		for (let id in ngModelCtrl.$error) {

			if (ngModelCtrl.$error.hasOwnProperty(id)) {

				let msg = _$attrs[`${id}Msg`] || formCtrl.errorMsg[id];
				if (ngModelCtrl.$error.hasOwnProperty(id) && msg) {
					this._openTooltip(msg);
					return;
				}
			}
		}

		this._closeTooltip();
	}

}
