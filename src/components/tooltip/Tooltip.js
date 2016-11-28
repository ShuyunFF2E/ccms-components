/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-15
 */
import angular from 'angular';
import { isElement } from 'angular-es-utils/type-auth';
import Popup from '../../common/bases/Popup';
import { positionElements, chopStyle2Num, offset, position, adjustTop } from '../../common/utils/style-helper';
import template from './tooltip.tpl.html';
import { TOOLTIP_TYPE } from './Contants';

const OPENED_CLASS = 'tooltip-opened';
const ARROW_MARGIN = 2;
const TOOLTIP_EL = angular.element(template)[0];
const DEFAULT_PLACEMENT = 'auto top-left';

export default class Tooltip extends Popup {

	constructor(hostEl, type = TOOLTIP_TYPE.NORMAL, append2Body, placement = DEFAULT_PLACEMENT) {

		let toolTipEl = TOOLTIP_EL.cloneNode(false);
		toolTipEl.classList.add(`${type}-tooltip`);
		super(toolTipEl, append2Body ? document.body : hostEl.parentNode, OPENED_CLASS);

		this.hostEl = hostEl;
		this.type = type;
		this.append2Body = !!append2Body;
		this.placement = placement;
	}

	setContent(content) {

		if (isElement(content)) {
			this.element.innerHTML = '';
			this.element.appendChild(content);
		} else {
			this.element.innerHTML = content;
		}
	}

	/**
	 * @override
	 * @param content optional
	 */
	open(content) {

		if (!this.append2Body) {
			this.init(false, this.hostEl.nextSibling);
		} else {
			this.init(true);
		}

		if (content) {
			this.setContent(content);
		}

		// 这里必须先show再给tooltip定位,因为tooltip在show之前是display:none,这时候tooltip不被渲染从而无法获取其坐标
		this.show();
		// 给宿主元素添加新的样式
		this.hostEl.classList.add(`${this.type}-tooltip-attached`);

		switch (this.type) {

			case TOOLTIP_TYPE.NORMAL:
			case TOOLTIP_TYPE.ERROR_MINOR:

				/* ------------------为tooltip设置合适的位置------------------- */
				let tooltip = this.element;

				const ttPos = positionElements(this.hostEl, tooltip, this.placement, this.append2Body);
				var hostElPos = this.append2Body ? offset(this.hostEl) : position(this.hostEl);
				const initialHeight = tooltip.offsetHeight;

				const placement = ttPos.placement.split('-');

				// 获取箭头的高度
				const arrowHeight = chopStyle2Num(window.getComputedStyle(tooltip, ':after').getPropertyValue(`border-${placement[0]}-width`));
				// tooltipEl.style.maxWidth = `${hostPos.width}px`;

				let ttOffset = {
					top: ttPos.top,
					left: ttPos.left
				};

				switch (placement[0]) {
					case 'top':
						ttOffset.top = ttPos.top - arrowHeight - ARROW_MARGIN;
						break;
					case 'bottom':
						ttOffset.top = ttPos.top + arrowHeight + ARROW_MARGIN;
						break;
					case 'left':
						ttOffset.left = ttPos.left - arrowHeight - ARROW_MARGIN;
						break;
					case 'right':
						ttOffset.left = ttPos.left + arrowHeight + ARROW_MARGIN;
						break;
				}

				tooltip.style.top = `${ttOffset.top}px`;
				tooltip.style.left = `${ttOffset.left}px`;

				const adjustment = adjustTop(placement, hostElPos, initialHeight, tooltip.offsetHeight);
				if (adjustment) {
					tooltip.style.top = `${adjustment.top - arrowHeight - ARROW_MARGIN}px`;
				}

				tooltip.classList.add(ttPos.placement);

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
