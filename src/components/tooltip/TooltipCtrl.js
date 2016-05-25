/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-16
 */

import {Bind} from 'angular-es-utils/decorators';

export default class TooltipCtrl {

	constructor() {
		this.tooltip = null;
		this.opened = false;
	}

	@Bind
	toggle() {
		this[(this.opened = !this.opened) ? 'open' : 'close']();
	}

	open() {
		this.tooltip.open();
		this.opened = true;
	}

	close() {
		this.tooltip.close();
		this.opened = false;
	}

}
