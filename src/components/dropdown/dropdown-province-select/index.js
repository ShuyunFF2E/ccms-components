import angular from 'angular';

import bindHtml from '../../bind-html';

import './_dropdown-province-select.scss';
import template from './dropdown-province-select.tpl.html';
import DropdownProvinceSelectCtrl from './DropdownProvinceSelectCtrl';

const dropdownProvinceSelectCtrlDDO = {
	require: 'ccDropdown',
	template,
	controller: DropdownProvinceSelectCtrl,
	bindings: {
		model: '=?',
		placeholder: '@?',
		style: '@?'
	}
};

export default angular
	.module('ccms.components.dropdownProvinceSelect', [bindHtml])
	.component('ccDropdownProvinceSelect', dropdownProvinceSelectCtrlDDO)
	.name;

