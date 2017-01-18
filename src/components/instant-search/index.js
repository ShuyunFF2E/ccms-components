/**
 * @author arzyu
 */

import angular from 'angular';
import ngResource from 'angular-resource';

import './_instant-search.scss';
import template from './instant-search.tpl.html';
import InstantSearchCtrl from './InstantSearchCtrl';

const DDO = {
	restrict: 'E',
	template,
	controller: InstantSearchCtrl,
	controllerAs: '$ctrl',
	scope: {
		selectedItem: '=model',
		options: '<',
		onSelect: '&?'
	},
	bindToController: true
};

export default angular
	.module('ccms.components.instantSearch', [ngResource])
	.directive('instantSearch', () => DDO)
	.name;

