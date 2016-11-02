import angular from 'angular';

import bindHtml from '../../bind-html';

import './_dropdown-multiselect.scss';
import template from './dropdown-multiselect.tpl.html';
import DropdownMultiselectCtrl from './DropdownMultiselectCtrl';

const dropdownMultiselectDDO = {
	restrict: 'E',
	require: 'ccDropdown',
	template,
	controller: DropdownMultiselectCtrl,
	controllerAs: '$ctrl',
	scope: {
		model: '=?',
		isOpen: '<?',
		autoClose: '<?',
		mapping: '<?',
		datalist: '<',
		searchable: '<?',
		confirmButton: '<?',
		placeholder: '@?'
	},
	bindToController: true
};

export default angular
	.module('ccms.components.dropdownMultiselect', [bindHtml])
	.directive('ccDropdownMultiselect', () => dropdownMultiselectDDO)
	.name;

