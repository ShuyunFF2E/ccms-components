/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-16
 */

function getStyle(el, cssprop) {
	if (el.currentStyle) { //IE
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

export default class PositionService {
	/**
	 * Provides read-only equivalent of jQuery's position function:
	 * http://api.jquery.com/position/
	 */
	static position(element) {
		let elBCR = this.offset(element);
		let offsetParentBCR = {top: 0, left: 0};
		let offsetParentEl = parentOffsetEl(element);
		if (offsetParentEl !== document) {
			offsetParentBCR = this.offset(offsetParentEl);
			offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
			offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
		}

		let boundingClientRect = element.getBoundingClientRect();
		return {
			width: boundingClientRect.width || element.offsetWidth,
			height: boundingClientRect.height || element.offsetHeight,
			top: elBCR.top - offsetParentBCR.top,
			left: elBCR.left - offsetParentBCR.left
		};
	}

	/**
	 * Provides read-only equivalent of jQuery's offset function:
	 * http://api.jquery.com/offset/
	 */
	static offset(element) {
		let boundingClientRect = element.getBoundingClientRect();
		return {
			width: boundingClientRect.width || element.offsetWidth,
			height: boundingClientRect.height || element.offsetHeight,
			top: boundingClientRect.top + (window.pageYOffset || document.documentElement.scrollTop),
			left: boundingClientRect.left + (window.pageXOffset || document.documentElement.scrollLeft)
		};
	}

}
