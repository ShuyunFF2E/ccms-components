/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-05
 */

import angular from 'angular';
import {FactoryCreator} from 'angular-es-utils';

/**
 * 输入修正器
 */
class InputCorrector {

	constructor() {

		Object.assign(this, {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				corrector: '=inputCorrector'
			}
		});

	}

	/**
	 * 输入校验指令,调用者传入校验方法,校验成功校验方法返回有效值,否则返回null
	 * <example>
	 *     <input type="text" ng-model="test" input-corrector="validator">
	 * </example>
	 */
	link(scope, element, attrs, ngModelController) {

		function parser(value) {

			let correctViewValue = scope.corrector.call(null, value);

			// 如果关联的校验器校验失败,则使用之前的value
			if (!correctViewValue) {
				correctViewValue = ngModelController.$modelValue;
			}

			ngModelController.$setViewValue(correctViewValue);
			ngModelController.$render();

			return correctViewValue;
		}

		ngModelController.$parsers.push(parser);

	}

}

export default angular
	.module('ccms.components.inputCorrector', [])
	.directive('inputCorrector', FactoryCreator.create(InputCorrector))
	.name;
