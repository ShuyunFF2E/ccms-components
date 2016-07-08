/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

import angular from 'angular';

import './style.scss';
import controller from './controller.js';
import template from './checkbox.tpl.html';

const ccmsCheckboxSetting = {
	controller,
	transclude: true,
	template,
	bindings: {
		ngChecked: '<?',
		ngDisabled: '<?',
		ngModel: '=?',
		ngTrueValue: '<?',
		ngFalseValue: '<?',
		indeterminate: '<?'
	},
	require: {
		ngModelController: '?ngModel'
	}
};

export default angular
	.module('ccms.components.checkbox', [])
	.component('ccmsCheckbox', ccmsCheckboxSetting)
	.name;
