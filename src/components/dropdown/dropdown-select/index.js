import angular from 'angular';

import bindHtml from '../../bind-html';

import './_dropdown-select.scss';
import template from './dropdown-select.tpl.html';
import DropdownSelectCtrl from './DropdownSelectCtrl';
import icon from '../../icon';

const dropdownSelectDDO = {
	restrict: 'E',
	require: 'ccDropdown',
	template,
	controller: DropdownSelectCtrl,
	controllerAs: '$ctrl',
	scope: {
		model: '=?',
		containerElement: '=?',
		isOpen: '<?',
		autoClose: '<?',
		mapping: '<?',
		datalist: '<',
		searchable: '<?',
		supportInputValue: '<?',
		disabled: '<?',
		placeholder: '@?',
		onSelectChange: '&?',
		onDropdownOpen: '&?',
		onDropdownClose: '&?',
		onBeforeSelectChange: '&?'
	},
	bindToController: true
};

export default angular
	.module('ccms.components.dropdownSelect', [bindHtml, icon])
	.directive('ccDropdownSelect', () => dropdownSelectDDO)
	.name;

