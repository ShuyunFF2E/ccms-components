/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-17
 */
import {Inject} from 'angular-es-utils';

import {VALIDATORS, formatValidator} from '../Constant';

/**
 * @ignore
 */
@Inject('$scope', '$element', '$attrs')
export default class ValidatorsCtrl {

	// todo 使用$onInit重构
	constructor($scope, $element, $attrs) {

		let customValidators = Object.assign({}, VALIDATORS, $scope.$eval($attrs.validators));
		const formattedValidator = formatValidator(customValidators);

		this.element = $element[0];
		this.validators = formattedValidator.validators;
		this.errorMsg = formattedValidator.errorMsg;

	}

}
