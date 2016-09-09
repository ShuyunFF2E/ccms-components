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
	name: 'ccTabset',
	transclude: true,
	template: tabsetTemplate,
	scope: {
		active: '=?',
		type: '@'
	},
	controller: TabsCtrl,
	controllerAs: '$tabset',
	bindToController: true
};

const tabDDO = {
	name: 'ccTab',
	require: {
		tabset: '^ccTabset'
	},
	transclude: true,
	scope: {
		title: '@',
		onSelect: '&'
	},
	controller: TabsCtrl,
	controllerAs: '$tab',
	bindToController: true,
	template: tabTemplate
};

const tabTitleDDO = {
	restrict: 'A',
	require: '^ccTab',
	link: tabTitleTranscludeLink
};

const tabContentDDO = {
	restrict: 'A',
	require: '^ccTabset',
	scope: {},
	link: tabContentTranscludeLink
};

export default angular
	.module('ccms.components.tabsets', [])
	.directive('ccTabset', () => tabsetDDO)
	.deprecatedDirective('tabset', () => tabsetDDO)
	.directive('ccTab', () => tabDDO)
	.deprecatedDirective('tab', () => tabDDO)
	.directive('tabTitleTransclude', () => tabTitleDDO)
	.directive('tabContentTransclude', () => tabContentDDO)
	.name;
