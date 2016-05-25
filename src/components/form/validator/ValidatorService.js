/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-18
 */

import {Inject} from 'angular-es-utils';

/**
 * <pre>
 *     表单校验服务,用于手动触发校验逻辑
 *     module: ccms.components.form
 *     service: $Validator
 * </pre>
 */
@Inject('$q')
export default class ValidatorService {

	/**
	 * 验证指定表单
	 * @requires ValidatorsDirective ValidatorDirective
	 * @param {controller} formCtrl 要校验的表单控制器.通过在表单区块声明name的方式将其自动存入当前scope中
	 * @return {Promise} 校验结果promise,校验成功会触发resolve,失败reject
	 */
	validate(formCtrl) {

		let deferred = this._$q.defer();
		formCtrl.$$validatedDefer = deferred;

		// 获取当前未校验通过的ngModel数量
		formCtrl.$$invalidNgModelCtrls = formCtrl.$$ngModelCtrls.filter(ctrl => ctrl.$invalid);
		formCtrl.$$invalidCount = formCtrl.$$invalidNgModelCtrls.length;

		if (formCtrl.$$invalidCount) {
			formCtrl.$$invalidNgModelCtrls.forEach(ctrl => {
				ctrl.$validate();
			});

		} else {
			deferred.resolve();
		}

		return deferred.promise;
	}

	setPristine(formCtrl) {

		if (formCtrl.$setPristine) {
			formCtrl.$setPristine();
		} else {
			formCtrl.$$ngModelCtrls.forEach(ctrl => ctrl.$setPristine());
		}

	}

}
