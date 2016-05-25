/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-17
 */

import ValidatorsCtrl from './ValidatorsCtrl';

/**
 * <pre>
 *  基于angular表单校验api实现的自动表单校验提示指令
 *  requires: {@link ValidatorDirective}
 *  module: ccms.components.form
 *  directive: validators
 *
 *     配置表单使用的校验规则
 *
 *     默认的规则提示信息(可以复写):
 *      required: '必填',
 *      email: '邮件格式不合法',
 *      max: '输入值过大',
 *      maxlength: '输入值太长',
 *      min: '输入值过小',
 *      minlength: '输入值太短',
 *      number: '不合法的数字',
 *      pattern: '不合法的格式',
 *      url: '不合法的url',
 *      date: '不合法的日期',
 *      datetimelocal: '不合法的本地日期',
 *      time: '不合法的时间',
 *      week: '不合法的星期值',
 *      month: '不合法的月份值'
 *
 *     配合使用的关联属性:
 *      name: 表单控制器名称,如果指定了会挂载在当前scope上,用于主动触发校验逻辑 ({@link ValidatorService})$Validator.validate($scope.formName)
 *      tooltip-type: tooltip类型 major(表单空间足够)|minor(默认,当表单空间不够时用浮动提示)
 * </pre>
 *
 * <a href="/demos/form" target="_blank">DEMO</a>
 * @example
 * <caption>最简用法(使用form表单&使用内置校验器&首选的信息提示方式)</caption>
 * <form class="form-wrapper" tooltip-type="major">
 *  <fieldset>
 *   <label for="info1">姓名(必填)</label><input type="text" id="info1" ng-model="info1" validator required placeholder="必填">
 *  </fieldset>
 *  <fieldset>
 *   <label for="info">姓名(必填)</label><input type="email" id="info" ng-model="info" validator required placeholder="必填">
 *  </fieldset>
 * </form>
 *
 * @example
 * <caption>使用自定义校验器</caption>
 * <form class="form-wrapper" validators="$ctrl.validators">
 *  <fieldset>
 *   <label for="info1">姓名(必填)</label><input type="text" id="info1" ng-model="info1" validator="tall,rich,handsome" required placeholder="必填">
 *  </fieldset>
 *  <fieldset>
 *   <label for="info">姓名(必填)</label><input type="email" id="info" ng-model="info" validator required placeholder="必填">
 *  </fieldset>
 * </form>
 *
 * this.validators = {
 *  required: '要填东西哦亲!',    // 覆写required校验提示信息
 *  number: /(^\s*$)|(^\d+$)/,  // 覆写number校验的正则
 *  handsome: { // 配置新的handsome校验规则
 *      msg: '不够帅',
 *      fn: (modelValue, viewValue) => {
 *          const value = modelValue || viewValue;
 *          return value ? value.startsWith('kuitos') : !value;
 *      }
 *  }
 *
 *  letter: {   // 配置新的letter校验规则
 *      msg: '必须为字母',
 *      regex: /(^\s*$)|(^\w+$)/
 *  }
 * };
 *
 * @example
 * <caption>使用手动触发校验的方式(使用非form标签则必须使用validators标记表单)</caption>
 * <div class="form-wrapper" validators="$ctrl.validators" name="divForm">
 *  <fieldset>
 *   <label for="info1">姓名(必填)</label><input type="text" id="info1" ng-model="info1" validator="tall,rich,handsome" required placeholder="必填">
 *  </fieldset>
 *  <fieldset>
 *   <label for="info">姓名(必填)</label><input type="email" id="info" ng-model="info" validator required placeholder="必填">
 *  </fieldset>
 * </div>
 *
 * <button type="button" ng-click="$ctrl.validate()">validate</button>
 *
 * this.validate = () => {$Validator.validate($scope.divForm).then(successCb, errorCb)}
 */
export default class ValidatorsDirective {

	/** @private */
	constructor() {
		/** @private */
		this.restrict = 'A';
		/** @private */
		this.require = ['?form', 'validators'];
		/** @private */
		this.controller = ValidatorsCtrl;
	}

	/** @private */
	link(scope, element, attr, ctrls) {

		// 如果是form表单则直接使用ng生成的form控制器,否则使用validators指令的控制
		let formCtrl = ctrls[0] || ctrls[1];

		if (element[0].tagName === 'form'.toUpperCase()) {
			attr.$set('novalidate', true);
		}

		// 如果表单配置了name,则将控制器实例挂载在scope的name值字段下
		if (attr.name) {
			scope[attr.name] = formCtrl;
		}

	}

}
