/**
 * @author fengqiu.wu
 */

import './_tabset.scss';

import angular from 'angular';
import {FactoryCreator} from 'angular-es-utils';

import TabsCtrl from './TabsetCtrl';

import tabsetTemplate from './tpls/tabset.tpl.html';
import tabTemplate from './tpls/tab.tpl.html';

import TabTitle from './TabTitleTransclude';
import TabContent from './TabContentTransclude';

const
	tabsetDDO = {
		transclude: true,
		template: tabsetTemplate,
		bindings: {
			active: '=?',
			type: '@'
		},
		controller: TabsCtrl,
		controllerAs: '$tabset'
	},

	tabDDO = {
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

export default angular
	.module('ccms.components.tabsets', [])
	.component('tabset', tabsetDDO)
	.component('tab', tabDDO)
	.directive('tabTitleTransclude', FactoryCreator.create(TabTitle))
	.directive('tabContentTransclude', FactoryCreator.create(TabContent))
	.name;
