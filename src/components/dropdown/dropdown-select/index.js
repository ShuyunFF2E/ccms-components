import angular from 'angular';

import bindHtml from '../../bind-html';

import './_dropdown-select.scss';
import template from './dropdown-select.tpl.html';
import DropdownSelectCtrl from './DropdownSelectCtrl';

const dropdownSelectDDO = {
	restrict: 'E',
	require: 'dropdown',
	template,
	controller: DropdownSelectCtrl,
	controllerAs: '$ctrl',
	scope: {
		model: '=',
		mapping: '<',
		datalist: '<',
		searchable: '<',
		placeholder: '@'
	},
	bindToController: true
};

export default angular
	.module('ccms.components.dropdownSelect', [bindHtml])
	.directive('dropdownSelect', () => dropdownSelectDDO)
	.name;

