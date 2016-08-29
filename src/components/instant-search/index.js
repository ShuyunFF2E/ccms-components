/**
 * @author arzyu
 */

import angular from 'angular';
import ngResource from 'angular-resource';

import template from './instant-search.tpl.html';
import InstantSearchCtrl from './InstantSearchCtrl';
import instantSearchLink from './instantSearchLink';

const ddo = {
	template,
	controller: InstantSearchCtrl,
	controllerAs: '$ctrl',
	link: instantSearchLink,
	scope: {
		selectedItem: '=model',
		options: '<'
	}
};

export default angular
	.module('ccms.components.instantSearch', [ngResource])
	.directive('instantSearch', () => ddo)
	.name;

