/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-15
 */

import angular from 'angular';

import Popup from '../../common/bases/Popup';
import {chopStyle2Num} from '../../common/utils/style-helper';
import Position from '../../common/utils/position';

import template from './tooltip.tpl.html';
import {TOOLTIP_TYPE} from './Contants';

const OPENED_CLASS = 'tooltip-opened';
const ARROW_MARGIN = 2;
const TOOLTIP_EL = angular.element(template)[0];

export default class Tooltip extends Popup {

	constructor(hostEl, type = TOOLTIP_TYPE.NORMAL, append2Body) {

		let toolTipEl = TOOLTIP_EL.cloneNode(false);
		toolTipEl.classList.add(`${type}-tooltip`);
		super(toolTipEl, append2Body ? document.body : hostEl.parentNode, OPENED_CLASS);

		this.hostEl = hostEl;
		this.type = type;
		this.append2Body = !!append2Body;
	}

	setContent(msg) {
		this.element.innerHTML = msg;
	}

	/**
	 * @override
	 * @param msg
	 */
	open(msg) {

		if (!this.append2Body) {
			this.init(false, this.hostEl.nextSibling);
		} else {
			this.init(true);
		}

		if (msg) {
			this.setContent(msg);
		}

		// 这里必须先show再给tooltip定位,因为tooltip在show之前是display:none,这时候tooltip不被渲染从而无法获取其坐标
		this.show();
		// 给宿主元素添加新的样式
		this.hostEl.classList.add(`${this.type}-tooltip-attached`);

		switch (this.type) {

			case TOOLTIP_TYPE.NORMAL:
			case TOOLTIP_TYPE.ERROR_MINOR:

				/* ------------------为tooltip设置合适的位置------------------- */
				let tooltipEl = this.element;

				const hostPos = this.append2Body ? Position.offset(this.hostEl) : Position.position(this.hostEl);

				// 获取箭头的高度
				const arrowHeight = chopStyle2Num(window.getComputedStyle(tooltipEl, ':after').getPropertyValue('border-top-width'));
				// tooltipEl.style.maxWidth = `${hostPos.width}px`;

				// 获取tooltip的top位置
				const tooltipPos = Position.offset(tooltipEl);
				tooltipEl.style.top = hostPos.top - tooltipPos.height - arrowHeight - ARROW_MARGIN + 'px';
				tooltipEl.style.left = `${hostPos.left}px`;

				break;

			case TOOLTIP_TYPE.ERROR_MAJOR:
				break;

			// no default

		}
	}

	close() {
		this.hostEl.classList.remove(`${this.type}-tooltip-attached`);
		this.destroy();
	}

}
