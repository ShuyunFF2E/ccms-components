/**
 * @author fengqiu.wu
 */
import angular from 'angular';

import {FactoryCreator} from 'angular-es-utils';

import TabsetComponent from './TabsetComponent';
import TabComponent from './TabComponent';
import TabMoreDirective from './TabMoreDirective';
import TabContent from './TabContentTransclude';

export default angular
	.module('ccms.components.tabsets', [])
	.directive('tabContentTransclude', FactoryCreator.create(TabContent))
	.directive('tabMore', FactoryCreator.create(TabMoreDirective))
	.component('tabset', new TabsetComponent())
	.component('tab', new TabComponent())
	.name;
