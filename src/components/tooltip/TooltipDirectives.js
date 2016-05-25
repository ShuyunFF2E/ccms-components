import './_tooltip.scss';

import Tooltip from './Tooltip';
import {TOOLTIP_TYPE} from './Contants';
import TooltipCtrl from './TooltipCtrl';

export class TooltipDirective {

	constructor() {
		this.restrict = 'EA';
		this.require = 'tooltip';
		this.controller = TooltipCtrl;
	}

	link(scope, element, attr, tooltipCtrl) {

		tooltipCtrl.tooltip = new Tooltip(element[0], attr.tooltipType || TOOLTIP_TYPE.NORMAL);

		scope.$watch(attr.tooltip, msg => {
			if (msg !== undefined) {
				tooltipCtrl.tooltip.setContent(msg);
			}
		});

		// 默认通过mouseenter/mouseleave触发
		if (!attr.tooltipTrigger && !attr.tooltipOpened) {
			element.bind('mouseenter mouseleave', tooltipCtrl.toggle);
		}

		scope.$on('$destroy', () => {
			element.unbind('mouseenter mouseleave', tooltipCtrl.toggle);
		});
	}
}

export class TooltipOpenedDirective {

	constructor() {
		this.restrict = 'A';
		this.require = 'tooltip';
	}

	link(scope, element, attr, tooltipCtrl) {

		scope.$watch(attr.tooltipOpened, isOpen => {
			if (isOpen !== undefined) {
				tooltipCtrl[isOpen ? 'open' : 'close']();
			}
		});

	}

}

export class TooltipTriggerDirective {

	constructor() {
		this.restrict = 'A';
		this.require = 'tooltip';
	}

	link(scope, element, attr, tooltipCtrl) {

		let trigger = attr.tooltipTrigger;

		element.bind(trigger, tooltipCtrl.toggle);

		scope.$on('$destroy', () => {
			element.unbind(trigger, tooltipCtrl.toggle);
		});

	}

}
