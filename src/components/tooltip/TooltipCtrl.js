/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-16
 */

import {Bind, Inject} from 'angular-es-utils/decorators';
import Tooltip from './Tooltip';
import {TOOLTIP_TYPE} from './Contants';

@Inject('$element', '$attrs', '$compile', '$scope')
export default class TooltipCtrl {

	$onInit() {
		this.hostElement = this._$element;
		this.element = null;
	}

	$postLink() {
		// 默认通过mouseenter/mouseleave触发(当未手动配置trigger/opened)
		if (!this._$attrs.tooltipTrigger && !this._$attrs.tooltipOpened) {
			this.hostElement.bind('mouseenter mouseleave', this.toggle);
		}

		if (this.trigger) {
			this.hostElement.bind(this.trigger, this.toggle);
		}
	}

	$onDestroy() {
		this.hostElement.unbind('mouseenter mouseleave', this.toggle);
		this.hostElement.unbind(this.trigger, this.toggle);
	}

	@Bind
	toggle() {
		this.opened = !this.opened;
	}

	// content变化
	set content(content) {
		this._content = content;
		if (this.opened) {
			this.opened = !!content;
		}
	}

	get content() {
		return this._content;
	}

	// watch opened
	set opened(opened) {

		if (opened !== undefined) {
			if (this.content) {
				this._opened = opened;
			} else {
				// 无信息时将tooltip置为关闭状态
				this._opened = false;
			}

			this[this._opened ? 'open' : 'close']();
		}
	}

	get opened() {
		return this._opened;
	}

	open() {
		if (!this.element) {
			this.element = new Tooltip(this.hostElement[0], this.type || TOOLTIP_TYPE.NORMAL, this.appendToBody);
		}

		let compiledContent = this.content;
		if (this.compilable) {
			compiledContent = this._$compile(this.content)(this._$scope)[0];
			this._$scope.$digest();
		}

		this.element.open(compiledContent);
	}

	close() {
		if (this.element) {
			this.element.close();
		}
		this.element = null;
	}

}
