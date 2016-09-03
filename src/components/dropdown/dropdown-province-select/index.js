import angular from 'angular';

import bindHtml from '../../bind-html';

import './_dropdown-province-select.scss';
import template from './dropdown-province-select.tpl.html';
import DropdownProvinceSelectCtrl from './DropdownProvinceSelectCtrl';

const dropdownProvinceSelectCtrlDDO = {
	restrict: 'E',
	require: 'ccDropdown',
	template,
	controller: DropdownProvinceSelectCtrl,
	controllerAs: '$ctrl',
	scope: {
		model: '=?',
		placeholder: '@?',
		style: '@?'
	},
	bindToController: true
};

export default angular
	.module('ccms.components.dropdownProvinceSelect', [bindHtml])
	.directive('ccDropdownProvinceSelect', () => dropdownProvinceSelectCtrlDDO)
	.deprecatedDirective('dropdownProvinceSelect', () => dropdownProvinceSelectCtrlDDO)
	.name;

