// TODO: 组件库 Tab, 目前存在 issue 不能和 grid 一起使用, 临时写一个简单 tab, 待 issue 修复, 进行重构
import './_tabs.scss';
import angular from 'angular';

import tabsTemplate from './tabs.tpl.html';
import panelTemplate from './panel.tpl.html';
import TabCtrl from './TabsCtrl';
import PanelCtrl from './PanelCtrl';

const tabsDDO = {
	transclude: true,
	controller: TabCtrl,
	template: tabsTemplate
};

const paneDDO = {
	transclude: true,
	require: {
		tabsCtrl: '^gsTabs'
	},
	bindings: {
		text: '@',
		tabClick: '&'
	},
	controller: PanelCtrl,
	template: panelTemplate
};

export default angular.module('ccms.components.goodsSelector.gsTabs', [])
	.component('gsTabs', tabsDDO)
	.component('gsPanel', paneDDO)
	.name;
