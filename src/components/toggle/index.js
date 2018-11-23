/**
 * @author arzyu <https://github.com/arzyu>
 */

import angular from 'angular';

import './_toggle.scss';
import template from './toggle.tpl.html';
import controller from './ToggleCtrl';

const DDO = {
	template,
	bindings: {
		ngModel: '<',
		ngTrueValue: '<?',
		ngFalseValue: '<?',
		valueOn: '<?',
		valueOff: '<?',
		disabled: '<?ngDisabled',
		openText: '@?',
		closeText: '@?',
		textOn: '@?',
		textOff: '@?'
	},
	require: {
		ngModelController: '?ngModel'
	},
	controller
};

export default angular.module('ccms.components.toggle', [])
	.deprecatedComponent('ccSwitch', DDO, 'cc-switch 已废弃，请使用 cc-toggle 代替。')
	.component('ccToggle', DDO)
	.name;

