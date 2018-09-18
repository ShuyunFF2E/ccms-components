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
		hasSelectAll: '<?',
		autoClose: '<?',
		mapping: '<?',
		disabled: '<?',
		datalist: '<',
		searchable: '<?',
		confirmButton: '<?',
		placeholder: '@?',
		searchFields: '=?',
		onSelectChange: '&?',
		onDropdownOpen: '&?',
		onDropdownClose: '&?'
	},
	bindToController: true
};

export default angular
	.module('ccms.components.dropdownMultiselect', [bindHtml])
	.directive('ccDropdownMultiselect', () => dropdownMultiselectDDO)
	.name;

