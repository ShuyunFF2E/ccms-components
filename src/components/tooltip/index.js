import './_tooltip.scss';

import angular from 'angular';

import Tooltip from './Tooltip';
import TooltipCtrl from './TooltipCtrl';

const tooltipDDO = {
	restrict: 'A',
	controller: TooltipCtrl,
	controllerAs: '$$tooltipCtrl',
	bindToController: {
		content: '<ccTooltip',
		oldContent: '<?tooltip', // TODO needs remove after migration
		trigger: '@?tooltipTrigger',
		placement: '@?tooltipPlacement',
		opened: '<?tooltipOpened',
		type: '@?tooltipType',
		appendToBody: '<?tooltipAppendToBody',
		compilable: '<?tooltipCompilable',
		openDelay: '@?tooltipOpenDelay',
		closeDelay: '@?tooltipCloseDelay'
	}
};

export default angular.module('ccms.components.tooltip', [])
	.directive('ccTooltip', () => tooltipDDO)
	.value('$ccTooltip', Tooltip)
	.deprecatedDirective('tooltip', () => tooltipDDO)
	.deprecatedValue('Tooltip', Tooltip)
	.name;
