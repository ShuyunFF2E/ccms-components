/**
 * @author fengqiu.wu
 */

import './_tabset.scss';

import angular from 'angular';

import TabsCtrl from './TabsetCtrl';

import tabsetTemplate from './tpls/tabset.tpl.html';
import tabTemplate from './tpls/tab.tpl.html';

import tabTitleTranscludeLink from './tabTitleTranscludeLink';
import tabContentTranscludeLink from './tabContentTranscludeLink';

const tabsetDDO = {
	transclude: true,
	template: tabsetTemplate,
	bindings: {
		active: '=?',
		type: '@'
	},
	controller: TabsCtrl,
	controllerAs: '$tabset'
};

const tabDDO = {
	require: {
		tabset: '^tabset'
	},
	transclude: true,
	bindings: {
		title: '@',
		onSelect: '&'
	},
	controllerAs: '$tab',
	template: tabTemplate
};

const tabTitleDDO = {
	restrict: 'A',
	require: '^tab',
	link: tabTitleTranscludeLink
};

const tabContentDDO = {
	restrict: 'A',
	require: '^tabset',
	scope: {},
	link: tabContentTranscludeLink
};

export default angular
	.module('ccms.components.tabsets', [])
	.component('tabset', tabsetDDO)
	.component('tab', tabDDO)
	.directive('tabTitleTransclude', () => tabTitleDDO)
	.directive('tabContentTransclude', () => tabContentDDO)
	.name;
