/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-16
 */

import {isNumber, isDefined} from 'angular-es-utils/type-auth';

/* ------------------------------- position utils ------------------------------------------ */
const PLACEMENT_REGEX = {
	auto: /\s?auto?\s?/i,
	primary: /^(top|bottom|left|right)$/,
	secondary: /^(top|bottom|left|right|center)$/,
	vertical: /^(top|bottom)$/
};

const OVERFLOW_REGEX = {
	normal: /(auto|scroll)/,
	hidden: /(auto|scroll|hidden)/
};

function getStyle(el, cssprop) {
	if (el.currentStyle) { // IE
		return el.currentStyle[cssprop];
	} else if (window.getComputedStyle) {
		return window.getComputedStyle(el)[cssprop];
	}
	// finally try and get inline style
	return el.style[cssprop];
}

function parseStyle(value) {
	value = parseFloat(value);
	return isFinite(value) ? value : 0;
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

/**
 * Provides coordinates for an element to be positioned relative to
 * another element.  Passing 'auto' as part of the placement parameter
 * will enable smart placement - where the element fits. i.e:
 * 'auto left-top' will check to see if there is enough space to the left
 * of the hostElem to fit the targetElem, if not place right (same for secondary
 * top placement).  Available space is calculated using the viewportOffset
 * function.
 *
 * @param {element} hostElem - The element to position against.
 * @param {element} targetElem - The element to position.
 * @param {string=} [placement=top] - The placement for the targetElem,
 *   default is 'top'. 'center' is assumed as secondary placement for
 *   'top', 'left', 'right', and 'bottom' placements.  Available placements are:
 *   <ul>
 *     <li>top</li>
 *     <li>top-right</li>
 *     <li>top-left</li>
 *     <li>bottom</li>
 *     <li>bottom-left</li>
 *     <li>bottom-right</li>
 *     <li>left</li>
 *     <li>left-top</li>
 *     <li>left-bottom</li>
 *     <li>right</li>
 *     <li>right-top</li>
 *     <li>right-bottom</li>
 *   </ul>
 * @param {boolean=} [appendToBody=false] - Should the top and left values returned
 *   be calculated from the body element, default is false.
 *
 * @returns {object} An object with the following properties:
 *   <ul>
 *     <li>**top**: Value for targetElem top.</li>
 *     <li>**left**: Value for targetElem left.</li>
 *     <li>**placement**: The resolved placement.</li>
 *   </ul>
 */
function positionElements(hostElem, targetElem, placement, appendToBody) {

	// need to read from prop to support tests.
	const targetWidth = isDefined(targetElem.offsetWidth) ? targetElem.offsetWidth : targetElem.prop('offsetWidth');
	const targetHeight = isDefined(targetElem.offsetHeight) ? targetElem.offsetHeight : targetElem.prop('offsetHeight');

	placement = parsePlacement(placement);

	const hostElemPos = appendToBody ? offset(hostElem) : position(hostElem);
	const targetElemPos = {top: 0, left: 0, placement: ''};

	if (placement[2]) {
		const viewportOffset = getViewportOffset(hostElem, appendToBody);

		const targetElemStyle = window.getComputedStyle(targetElem);
		const adjustedSize = {
			width: targetWidth + Math.round(Math.abs(parseStyle(targetElemStyle.marginLeft) + parseStyle(targetElemStyle.marginRight))),
			height: targetHeight + Math.round(Math.abs(parseStyle(targetElemStyle.marginTop) + parseStyle(targetElemStyle.marginBottom)))
		};

		placement[1] = placement[1] === 'top' && adjustedSize.height - hostElemPos.height > viewportOffset.bottom && adjustedSize.height - hostElemPos.height <= viewportOffset.top
			? 'bottom' : placement[1] === 'bottom' && adjustedSize.height - hostElemPos.height > viewportOffset.top && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom
			? 'top' : placement[1] === 'left' && adjustedSize.width - hostElemPos.width > viewportOffset.right && adjustedSize.width - hostElemPos.width <= viewportOffset.left
			? 'right' : placement[1] === 'right' && adjustedSize.width - hostElemPos.width > viewportOffset.left && adjustedSize.width - hostElemPos.width <= viewportOffset.right
			? 'left' : placement[1];

		placement[0] = placement[0] === 'top' && adjustedSize.height > viewportOffset.top && adjustedSize.height <= viewportOffset.bottom
			? 'bottom' : placement[0] === 'bottom' && adjustedSize.height > viewportOffset.bottom && adjustedSize.height <= viewportOffset.top
			? 'top' : placement[0] === 'left' && adjustedSize.width > viewportOffset.left && adjustedSize.width <= viewportOffset.right
			? 'right' : placement[0] === 'right' && adjustedSize.width > viewportOffset.right && adjustedSize.width <= viewportOffset.left
			? 'left' : placement[0];

		if (placement[1] === 'center') {
			if (PLACEMENT_REGEX.vertical.test(placement[0])) {
				const xOverflow = hostElemPos.width / 2 - targetWidth / 2;
				if (viewportOffset.left + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.right) {
					placement[1] = 'left';
				} else if (viewportOffset.right + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.left) {
					placement[1] = 'right';
				}
			} else {
				const yOverflow = hostElemPos.height / 2 - adjustedSize.height / 2;
				if (viewportOffset.top + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom) {
					placement[1] = 'top';
				} else if (viewportOffset.bottom + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.top) {
					placement[1] = 'bottom';
				}
			}
		}
	}

	switch (placement[0]) {
		case 'top':
			targetElemPos.top = hostElemPos.top - targetHeight;
			break;
		case 'bottom':
			targetElemPos.top = hostElemPos.top + hostElemPos.height;
			break;
		case 'left':
			targetElemPos.left = hostElemPos.left - targetWidth;
			break;
		case 'right':
			targetElemPos.left = hostElemPos.left + hostElemPos.width;
			break;
	}

	switch (placement[1]) {
		case 'top':
			targetElemPos.top = hostElemPos.top;
			break;
		case 'bottom':
			targetElemPos.top = hostElemPos.top + hostElemPos.height - targetHeight;
			break;
		case 'left':
			targetElemPos.left = hostElemPos.left;
			break;
		case 'right':
			targetElemPos.left = hostElemPos.left + hostElemPos.width - targetWidth;
			break;
		case 'center':
			if (PLACEMENT_REGEX.vertical.test(placement[0])) {
				targetElemPos.left = hostElemPos.left + hostElemPos.width / 2 - targetWidth / 2;
			} else {
				targetElemPos.top = hostElemPos.top + hostElemPos.height / 2 - targetHeight / 2;
			}
			break;
	}

	targetElemPos.top = Math.round(targetElemPos.top);
	targetElemPos.left = Math.round(targetElemPos.left);
	targetElemPos.placement = placement[1] === 'center' ? placement[0] : placement[0] + '-' + placement[1];

	return targetElemPos;
}

function getViewportOffset(elem, useDocument, includePadding) {
	includePadding = includePadding !== false;

	const elemBCR = elem.getBoundingClientRect();
	const offsetBCR = {top: 0, left: 0, bottom: 0, right: 0};

	const offsetParent = useDocument ? document.documentElement : scrollParent(elem);
	const offsetParentBCR = offsetParent.getBoundingClientRect();

	offsetBCR.top = offsetParentBCR.top + offsetParent.clientTop;
	offsetBCR.left = offsetParentBCR.left + offsetParent.clientLeft;
	if (offsetParent === document.documentElement) {
		offsetBCR.top += window.pageYOffset;
		offsetBCR.left += window.pageXOffset;
	}
	offsetBCR.bottom = offsetBCR.top + offsetParent.clientHeight;
	offsetBCR.right = offsetBCR.left + offsetParent.clientWidth;

	if (includePadding) {
		const offsetParentStyle = window.getComputedStyle(offsetParent);
		offsetBCR.top += parseStyle(offsetParentStyle.paddingTop);
		offsetBCR.bottom -= parseStyle(offsetParentStyle.paddingBottom);
		offsetBCR.left += parseStyle(offsetParentStyle.paddingLeft);
		offsetBCR.right -= parseStyle(offsetParentStyle.paddingRight);
	}

	return {
		top: Math.round(elemBCR.top - offsetBCR.top),
		bottom: Math.round(offsetBCR.bottom - elemBCR.bottom),
		left: Math.round(elemBCR.left - offsetBCR.left),
		right: Math.round(offsetBCR.right - elemBCR.right)
	};
}

function scrollParent(elem, includeHidden, includeSelf) {

	const overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
	const documentEl = document.documentElement;
	const elemStyle = window.getComputedStyle(elem);
	if (includeSelf && overflowRegex.test(elemStyle.overflow + elemStyle.overflowY + elemStyle.overflowX)) {
		return elem;
	}

	let excludeStatic = elemStyle.position === 'absolute';
	let scrollParent = elem.parentElement || documentEl;

	if (scrollParent === documentEl || elemStyle.position === 'fixed') {
		return documentEl;
	}

	while (scrollParent.parentElement && scrollParent !== documentEl) {
		const spStyle = window.getComputedStyle(scrollParent);
		if (excludeStatic && spStyle.position !== 'static') {
			excludeStatic = false;
		}

		if (!excludeStatic && overflowRegex.test(spStyle.overflow + spStyle.overflowY + spStyle.overflowX)) {
			break;
		}
		scrollParent = scrollParent.parentElement;
	}

	return scrollParent;
}

function parsePlacement(placement) {
	const autoPlace = PLACEMENT_REGEX.auto.test(placement);
	if (autoPlace) {
		placement = placement.replace(PLACEMENT_REGEX.auto, '');
	}

	placement = placement.split('-');

	placement[0] = placement[0] || 'top';
	if (!PLACEMENT_REGEX.primary.test(placement[0])) {
		placement[0] = 'top';
	}

	placement[1] = placement[1] || 'center';
	if (!PLACEMENT_REGEX.secondary.test(placement[1])) {
		placement[1] = 'center';
	}

	placement[2] = !!autoPlace;

	return placement;
}

/* ------------------------------- position utils end ------------------------------------------ */

const chopStyle2Num = style => {
	return Number(style.substr(0, style.length - 2));
};

const closestTagParent = (element, tagName) => {

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

const closestAttrParent = (element, attrName) => {

	let parentNode = element.parentNode;

	while (!parentNode.hasAttribute(attrName)) {
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
	isContentOverflow,
	closestTagParent,
	closestAttrParent,
	position,
	positionElements,
	offset
};
