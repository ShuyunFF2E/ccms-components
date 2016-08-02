/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-06-07
 * switch button component
 * @usage <ccms-switch-button state="false"></ccms-switch-button>
 */

import angular from 'angular';

import './style.scss';
import template from './template.html';
import controller from './controller';

const componentSetting = {
	template,
	bindings: {
		state: '=?',
		openText: '@?',
		closeText: '@?'
	},
	controller
};

export default angular.module('ebm.components.directive.switchButton', [])
	.component('ccSwitchButton', componentSetting)
	.name;
