/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-16
 */

import {Bind} from 'angular-es-utils/decorators';
import Tooltip from './Tooltip';
import {TOOLTIP_TYPE} from './Contants';

export default class TooltipCtrl {

	constructor($element, $attrs, $compile, $scope) {
		this._$element = $element;
		this._$attrs = $attrs;
		this._$compile = $compile;
		this._$scope = $scope;

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

			// getter/setter 会在初始化的时候会触发,这时候有可能constructor还没有初始化(因为使用的Object.create(Ctrl.prototype)),所以这里需要手动delay
			// @see https://github.com/angular/angular.js/blob/master/src/ng/controller.js#L139
			setTimeout(() => {
				this[this._opened ? 'open' : 'close']();
			}, 0);
		}
	}

	get opened() {
		return this._opened;
	}

	@Bind
	toggle() {
		this.opened = !this.opened;
	}

	open() {
		if (!this.element) {
			this.element = new Tooltip(this.hostElement[0], this.type || TOOLTIP_TYPE.NORMAL, this.appendToBody, this.placement);
		}

		let compiledContent = this.content;
		if (this.compilable) {
			compiledContent = this._$compile(this.content)(this._$scope.$parent)[0];
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

TooltipCtrl.$inject = ['$element', '$attrs', '$compile', '$scope'];
