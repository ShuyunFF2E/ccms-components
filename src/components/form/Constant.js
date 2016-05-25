/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-17
 */

function isRegExp(value) {
	return Object.prototype.toString.call(value) === '[object RegExp]';
}

function isObject(value) {
	return value !== null && typeof value === 'object';
}

function isString(value) {
	return typeof value === 'string';
}

/**
 * 配置ng内置的校验提示信息
 * @ignore
 */
export const VALIDATORS = {

	required: '必填',
	email: '邮件格式不合法',
	max: '输入值过大',
	maxlength: '输入值太长',
	min: '输入值过小',
	minlength: '输入值太短',
	number: '不合法的数字',
	pattern: '不合法的格式',
	url: '不合法的url',
	date: '不合法的日期',
	datetimelocal: '不合法的本地日期',
	time: '不合法的时间',
	week: '不合法的星期值',
	month: '不合法的月份值'

};

/**
 * 将配置的VALIDATORS格式化成可供angular直接使用的格式
 * @ignore
 * @param originalValidators 格式:
 *
 * {
 *  validatorId: string|Regex|Object
 * }
 *
 * Object:{
 *  msg: string,
 *  regex: Regex,
 *  fn: Function
 * }
 *
 * @returns {{errorMsg: {}, validators: {}}}
 */
export const formatValidator = originalValidators => {

	let errorMsg = {};
	let validators = {};

	Object.keys(originalValidators).forEach(id => {

		const validator = originalValidators[id];

		if (isString(validator)) {
			errorMsg[id] = validator;
		} else if (isRegExp(validator)) {

			validators[id] = (modelVal, viewVal) => {
				return validator.test(modelVal || viewVal);
			};

		} else if (isObject(validator)) {
			errorMsg[id] = validator.msg;
			validators[id] = (validator.fn && validator.fn.bind(validator)) ||
				((modelVal, viewVal) => {
					return validator.regex.test(modelVal || viewVal);
				});
		}

	});

	return {
		errorMsg,
		validators
	};

};
