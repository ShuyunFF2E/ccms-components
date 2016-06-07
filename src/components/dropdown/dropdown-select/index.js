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
		value: '=',
		options: '<',
		datalist: '<',
		searchable: '<',
		placeholder: '@'
	},
	bindToController: true
};

const valueFn = value => () => value;

export default angular
	.module('ccms.components.dropdownSelect', [bindHtml])
	.directive('dropdownSelect', valueFn(dropdownSelectDDO))
	.name;

