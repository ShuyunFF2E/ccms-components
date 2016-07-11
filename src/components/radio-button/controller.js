/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

import { Inject } from 'angular-es-utils';

@Inject('$scope')
export default class CheckboxController {
	constructor() {}

	$onInit() {
		(typeof this.ngModel === 'undefined' || typeof this._value === 'undefined') && (console.error('Radio button have to used with ng-model & ng-value') || (this.isError = true));
	}

	get _value() {
		return this.ngValue ? this.ngValue : this.value ? this.value : undefined;
	}

	/**
	 * update ng-model value
	 * @param {any} value
	 */
	updateNgModel(value) {
		this.ngModelController && this.ngModelController.$setViewValue(value); // change model value & $setViewValue method will trigger method binding on model
	}
}
