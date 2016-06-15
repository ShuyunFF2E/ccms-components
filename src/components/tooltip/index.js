import './_tooltip.scss';

import angular from 'angular';
import {FactoryCreator} from 'angular-es-utils';

import Tooltip from './Tooltip';
import {TooltipTriggerDirective, TooltipOpenedDirective} from './TooltipDirectives';

import TooltipCtrl from './TooltipCtrl';

const tooltipDDO = {
	restrict: 'A',
	controller: TooltipCtrl,
	controllerAs: '$tooltipCtrl',
	bindToController: {
		tooltipMsg: '<tooltip'
	}

};

export default angular.module('ccms.components.tooltip', [])
	.directive('tooltip', () => tooltipDDO)
	.directive('tooltipTrigger', FactoryCreator.create(TooltipTriggerDirective))
	.directive('tooltipOpened', FactoryCreator.create(TooltipOpenedDirective))
	.constant('Tooltip', Tooltip)
	.name;
