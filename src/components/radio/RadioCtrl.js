/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

export default class CheckboxController {
	/**
	 * @name $onInit
	 * controller init method, one of ngModel or value isn't set, method will console an error message
	 */
	$onInit() {
		(typeof this.ngModel === 'undefined' || typeof this._value === 'undefined') && (console.error('Radio button have to used with ng-model & ng-value') || (this.isError = true));
	}

	/**
	 * get value from ngValue | value
	 * @returns {boolean | undefined}
	 * @private
	 */
	get _value() {
		return typeof this.ngValue !== 'undefined' ? this.ngValue : (typeof this.value !== 'undefined' ? this.value : undefined);
	}

	/**
	 * @name updateNgModel
	 * @param {any} value
	 * update ng-model value
	 */
	updateNgModel(value) {
		this.ngModelController && this.ngModelController.$setViewValue(value); // change model value & $setViewValue method will trigger method binding on model
	}
}
