/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-11
 */

import angular from 'angular';

import EventBus from 'angular-es-utils/event-bus';
import Performance from './performance';
import TplReqHelper from './tpl-req-helper';

export default angular
	.module('ccms.components.utils', [])
	.service('Performance', Performance)
	.value('TplReqHelper', TplReqHelper)
	.value('EventBus', EventBus)
	.name;
