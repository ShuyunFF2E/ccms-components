/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-06-07
 * switch button component
 * @usage <ccms-switch-button state="false"></ccms-switch-button>
 */

import angular from 'angular';

import './_switch.scss';
import template from './switch.tpl.html';
import controller from './SwitchCtrl';

const componentSetting = {
	template,
	bindings: {
		ngModel: '<',
		ngTrueValue: '<?',
		ngFalseValue: '<?',
		ngDisabled: '<?',
		openText: '@?',
		closeText: '@?',
		fontSize: '@?'
	},
	require: {
		ngModelController: '?ngModel'
	},
	controller
};

export default angular.module('ccms.components.switch', [])
	.component('ccSwitch', componentSetting)
	.name;
