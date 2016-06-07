

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
