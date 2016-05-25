/**
 * Created by AshZhang on 2016-3-12.
 */

/**
 * 补零至两位数
 * @param val
 * @returns {string}
 * @private
 */
function addZero(val) {
	val += '';

	return val.length === 1 ? '0' + val : val;
}

/**
 * 将字符串解析为数字
 * @param val
 * @returns {Number}
 * @private
 */
function parseNumber(val) {
	if (+val === 0) return 0;

	return parseInt(('' + val).replace(/^0+/, ''), 10);
}

/**
 * 将日期对象分解成时分秒
 * @param dateValue
 * @param dateOnly
 * @returns {*}
 */
function destructDate(dateValue, dateOnly) {
	let result;

	if (dateValue && !isNaN(dateValue.valueOf())) {
		result = {
			year: dateValue.getFullYear() + '',
			month: addZero(dateValue.getMonth() + 1),
			date: addZero(dateValue.getDate())
		};

		if (dateOnly) {
			result.hour = '00';
			result.minute = '00';
			result.second = '00';
		} else {
			result.hour = addZero(dateValue.getHours());
			result.minute = addZero(dateValue.getMinutes());
			result.second = addZero(dateValue.getSeconds());
		}
	} else {
		result = {};
	}

	return result;
}

/**
 * 根据文本长度, 设置 input 的宽度
 * @param input
 * @private
 */
function setTextWidth(input) {

	setTimeout(() => {
		if (!input.value) {
			input.style.width = '';
			return;
		}

		const span = document.createElement('span'),
			inputStyle = window.getComputedStyle(input);

		span.innerHTML = input.value;
		span.style.position = 'absolute';
		span.style.left = '-9999px';
		span.style.fontSize = inputStyle.fontSize;
		span.style.fontFamily = inputStyle.fontFamily;

		document.body.appendChild(span);

		input.style.width = Math.round(parseFloat(window.getComputedStyle(span).width)) + 'px';

		document.body.removeChild(span);
	}, 0);
}

export {
	addZero,
	parseNumber,
	destructDate,
	setTextWidth
};
