/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

import angular from 'angular';

import './_radio.scss';
import controller from './RadioCtrl.js';
import template from './radio.tpl.html';

const ccmsRadioButtonSetting = {
	controller,
	transclude: true,
	template,
	bindings: {
		ngDisabled: '<?',
		ngModel: '=?',
		ngValue: '<?',
		value: '@?'
	},
	require: {
		ngModelController: '?ngModel'
	}
};

export default angular
	.module('ccms.components.radioButton', [])
	.component('ccmsRadioButton', ccmsRadioButtonSetting)
	.name;
