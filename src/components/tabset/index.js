/**
 * @author fengqiu.wu
 */
import './_tabset.scss';

import angular from 'angular';
import {FactoryCreator} from 'angular-es-utils';

import TabsCtrl from './TabsetCtrl';
import tabTemplate from './tpls/tab.tpl.html';
import tabsetTemplate from './tpls/tabset.tpl.html';
import TabContent from './TabContentTransclude';
import TabMoreDirective from './TabMoreDirective';

const TabsetComponent = {
	transclude: true,
	template: tabsetTemplate,
	bindings: {
		tabs: '=',
		small: '<',
		remove: '<'
	},
	controller: TabsCtrl,
	controllerAs: '$tabsetCtrl'
};

const TabComponent = {
	require: {
		tabset: '^tabset'
	},
	bindings: {
		tab: '=data'
	},
	controllerAs: '$tabCtrl',
	template: tabTemplate
};

export default angular
	.module('ccms.components.tabsets', [])
	.directive('tabContentTransclude', FactoryCreator.create(TabContent))
	.directive('tabMore', FactoryCreator.create(TabMoreDirective))
	.component('tabset', TabsetComponent)
	.component('tab', TabComponent)
	.name;
