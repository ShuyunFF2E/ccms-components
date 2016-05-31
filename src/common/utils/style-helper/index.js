/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-16
 */

import Position from '../position';

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
	const isContentOverflow = Position.offset(span).width > (Position.offset(element).width - paddingSides);

	// 移除临时元素
	document.body.removeChild(span);

	return isContentOverflow;

};

export {
	chopStyle2Num,
	closestParent,
	isContentOverflow
};
