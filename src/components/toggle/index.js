/**
 * @author Arz
 * @homepage https://github.com/arzyu
 */

import angular from 'angular';

import './_toggle.scss';
import template from './toggle.tpl.html';
import controller from './ToggleCtrl';

const DDO = {
	template,
	bindings: {
		ngModel: '<',
		valueOn: '<?',
		valueOff: '<?',
		disabled: '<?ngDisabled',
		textOn: '@?',
		textOff: '@?'
	},
	require: {
		ngModelController: '?ngModel'
	},
	controller
};

export default angular.module('ccms.components.toggle', [])
	.component('ccToggle', DDO)
	.name;

