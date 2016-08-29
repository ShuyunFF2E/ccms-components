import angular from 'angular';

import DropdownCtrl from './DropdownCtrl';
import DropdownToggleCtrl from './DropdownToggleCtrl';
import DropdownPanelCtrl from './DropdownPanelCtrl';

const dropdownDDO = {
	name: 'ccDropdown',
	restrict: 'EA',
	controller: DropdownCtrl,
	controllerAs: '$ctrl',
	scope: {
		isOpen: '=?',
		autoClose: '<?',
		onDropdownOpen: '&?',
		onDropdownClose: '&?'
	},
	bindToController: true
};

const dropdownToggleDDO = {
	restrict: 'EA',
	require: {
		parent: '^^ccDropdown'
	},
	controller: DropdownToggleCtrl,
	controllerAs: '$ctrl',
	scope: {},
	bindToController: true
};

const dropdownPanelDDO = {
	restrict: 'EA',
	require: {
		parent: '^^ccDropdown'
	},
	template: '<div class="content" ng-transclude></div>',
	transclude: true,
	controller: DropdownPanelCtrl,
	controllerAs: '$ctrl',
	scope: {},
	bindToController: true
};

export default angular
	.module('ccms.components.dropdown', [])
	.directive('ccDropdown', () => dropdownDDO)
	.deprecatedDirective('dropdown', () => dropdownDDO)
	.directive('ccDropdownToggle', () => dropdownToggleDDO)
	.deprecatedDirective('dropdownToggle', () => dropdownToggleDDO)
	.directive('ccDropdownPanel', () => dropdownPanelDDO)
	.deprecatedDirective('dropdownPanel', () => dropdownPanelDDO)
	.name;

