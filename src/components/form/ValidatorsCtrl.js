/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-17
 */
import {Inject} from 'angular-es-utils';

import {DEFAULT_VALIDATORS, formatValidator} from './Constant';

@Inject('$element', '$parse', '$scope')
export default class ValidatorsCtrl {

	$onInit() {

		// 当未使用form/ngForm声明表单时,同样支持name方式给表单命名
		if (!this.formCtrl && this.name) {
			const setter = this._$parse(this.name).assign;
			setter(this._$scope, this);
		}

		const formattedValidator = formatValidator(Object.assign({}, DEFAULT_VALIDATORS, this.validators));

		this.element = this._$element[0];
		this.validators = formattedValidator.validators;
		this.errorMsg = formattedValidator.errorMsg;
	}

	$postLink() {

		// 关闭浏览器自带的校验交互
		if (this.element.tagName === 'form'.toUpperCase()) {
			this.element.setAttribute('novalidate', 'true');
		}
	}

}
