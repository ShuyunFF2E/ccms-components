/**
 * @author fengqiu.wu
 */
import angular from 'angular';

import {FactoryCreator} from 'angular-es-utils';

import Tabset from './Tabset';
import Tab from './Tab';
import TabTitle from './TabTitleTransclude';
import TabContent from './TabContentTransclude';

export default angular
	.module('ccms.components.tabsets', [])
	.directive('tabTitleTransclude', FactoryCreator.create(TabTitle))
	.directive('tabContentTransclude', FactoryCreator.create(TabContent))
	.component('tabset', new Tabset())
	.component('tab', new Tab())
	.name;
