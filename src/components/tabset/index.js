/**
 * @author fengqiu.wu
 */
import './_tabset.scss';

import angular from 'angular';

import TabsCtrl from './TabsetCtrl';
import tabsetTemplate from './tabset.tpl.html';

const TabsetComponent = {
	template: tabsetTemplate,
	bindings: {
		tabs: '=',
		active: '<',
		remove: '<',
		smaller: '<',
		justified: '<',
		onActive: '&'
	},
	controller: TabsCtrl,
	controllerAs: '$tabsetCtrl'
};

export default angular
	.module('ccms.components.tabsets', [])
	.component('tabset', TabsetComponent)
	.name;
