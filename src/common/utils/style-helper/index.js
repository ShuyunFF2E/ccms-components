/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-16
 */

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
	span.innerHTML = content;
	span.style.opacity = 0;
	document.body.appendChild(span);

	const paddingSides = chopStyle2Num(window.getComputedStyle(element).getPropertyValue('padding-left')) + chopStyle2Num(window.getComputedStyle(element).getPropertyValue('padding-right'));

	// 得到文本是否超出的flag
	const isContentOverflow = span.offsetWidth > (element.clientWidth - paddingSides);

	// 移除临时元素
	document.body.removeChild(span);

	return isContentOverflow;

};

export {
	chopStyle2Num,
	closestParent,
	isContentOverflow
};
