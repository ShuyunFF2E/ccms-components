/**
 * @author Arz
 * @since 2/14/17
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
		ngDisabled: '<?',
		textOn: '@?',
		textOff: '@?',
		openText: '@?textOn',
		closeText: '@?textOff'
	},
	require: {
		ngModelController: '?ngModel'
	},
	controller
};

export default angular.module('ccms.components.arzSwitch', [])
	.component('ccToggle', DDO)
	.name;

