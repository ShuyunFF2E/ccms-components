/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-16
 */

import {isNumber} from 'angular-es-utils/type-auth';

function getStyle(el, cssprop) {
	if (el.currentStyle) { // IE
		return el.currentStyle[cssprop];
	} else if (window.getComputedStyle) {
		return window.getComputedStyle(el)[cssprop];
	}
	// finally try and get inline style
	return el.style[cssprop];
}

/**
 * Checks if a given element is statically positioned
 * @param element - raw DOM element
 */
function isStaticPositioned(element) {
	return (getStyle(element, 'position') || 'static') === 'static';
}

/**
 * returns the closest, non-statically positioned parentOffset of a given element
 * @param element
 */
function parentOffsetEl(element) {
	let offsetParent = element.offsetParent || document;
	while (offsetParent && offsetParent !== document && isStaticPositioned(offsetParent)) {
		offsetParent = offsetParent.offsetParent;
	}
	return offsetParent || document;
}

/**
 * Provides read-only equivalent of jQuery's position function:
 * http://api.jquery.com/position/
 */
function position(element) {
	let elemOffset = offset(element);
	let offsetParentBCR = {top: 0, left: 0};
	let offsetParentEl = parentOffsetEl(element);
	if (offsetParentEl !== document) {
		offsetParentBCR = offset(offsetParentEl);
		offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
		offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
	}

	return {
		width: Math.round(isNumber(elemOffset.width) ? elemOffset.width : element.offsetWidth),
		height: Math.round(isNumber(elemOffset.height) ? elemOffset.height : element.offsetHeight),
		top: Math.round(elemOffset.top - offsetParentBCR.top),
		left: Math.round(elemOffset.left - offsetParentBCR.left)
	};
}

/**
 * Provides read-only equivalent of jQuery's offset function:
 * http://api.jquery.com/offset/
 */
function offset(element) {
	const elemBCR = element.getBoundingClientRect();
	return {
		width: Math.round(isNumber(elemBCR.width) ? elemBCR.width : element.offsetWidth),
		height: Math.round(isNumber(elemBCR.height) ? elemBCR.height : element.offsetHeight),
		top: Math.round(elemBCR.top + (window.pageYOffset || document.documentElement.scrollTop)),
		left: Math.round(elemBCR.left + (window.pageXOffset || document.documentElement.scrollLeft))
	};
}

const chopStyle2Num = style => {
	return Number(style.substr(0, style.length - 2));
};

const closestParent = (element, tagName) => {

	let parentNode = element.parentNode;

	while (parentNode.nodeName.toLowerCase() !== tagName) {
		parentNode = parentNode.parentNode;

		if (parentNode === document.body) {
			parentNode = null;
			break;
		}
	}

	return parentNode;
};

const isContentOverflow = (element, content) => {

	// 创建临时span
	let span = document.createElement('span');
	const computedStyle = window.getComputedStyle(element);

	span.innerHTML = content;
	span.style.opacity = 0;
	span.style.display = 'inline-block';
	span.style.fontSize = computedStyle.getPropertyValue('font-size');
	span.style.fontFamily = computedStyle.getPropertyValue('font-family');
	document.body.appendChild(span);

	const paddingSides = chopStyle2Num(computedStyle.getPropertyValue('padding-left')) + chopStyle2Num(computedStyle.getPropertyValue('padding-right'));

	// 得到文本是否超出的flag
	const isContentOverflow = offset(span).width > (offset(element).width - paddingSides);

	// 移除临时元素
	document.body.removeChild(span);

	return isContentOverflow;

};

export {
	chopStyle2Num,
	closestParent,
	isContentOverflow,
	position,
	offset
};
