/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-16
 */

import {Bind, Inject} from 'angular-es-utils/decorators';
import Tooltip from './Tooltip';
import {TOOLTIP_TYPE} from './Contants';

@Inject('$element', '$attrs')
export default class TooltipCtrl {

	$onInit() {
		this.tooltip = null;
		this.opened = false;
	}

	$onChanges(models) {

		// tooltip内容发生变更时内容也相应变更
		if (this.tooltip && !models.tooltipMsg.isFirstChange()) {
			this.tooltip.open(models.tooltipMsg.currentValue);
		}
	}

	$postLink() {
		// 默认通过mouseenter/mouseleave触发
		if (!this._$attrs.tooltipTrigger && !this._$attrs.tooltipOpened) {
			this._$element.bind('mouseenter mouseleave', this.toggle);
		}
	}

	$onDestroy() {
		this._$element.unbind('mouseenter mouseleave', this.toggle);
	}

	@Bind
	toggle() {
		this[(this.opened = !this.opened) ? 'open' : 'close']();
	}

	open() {
		this.tooltip = new Tooltip(this._$element[0], this._$attrs.tooltipType || TOOLTIP_TYPE.NORMAL, this._$attrs.tooltipAppendToBody);
		this.tooltip.open(this.tooltipMsg);
		this.opened = true;
	}

	close() {
		this.tooltip.close();
		this.tooltip = null;
		this.opened = false;
	}

}
