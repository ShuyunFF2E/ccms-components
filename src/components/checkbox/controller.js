/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

import { Inject } from 'angular-es-utils';

@Inject('$scope')
export default class CheckboxController {
	constructor() {}

	/**
	 * onChange method
	 * watch the ng-model change situation, when ngModel changed, the checked value changes
	 * @param {object} opt
	 */
	$onChanges(opt) {
		opt.ngModel && (this.ngChecked = opt.ngModel.currentValue === this._trueValue);
	}

	/**
	 * toggle the checked value when user click the checkbox
	 */
	toggleClick() {
		if (this.ngDisabled || this.indeterminate) return false;
		this.ngChecked = !this.ngChecked;
		this.ngModelController && this.updateNgModel(this.ngChecked);
	}

	get _trueValue() {
		return this.ngModelController ? (typeof this.ngTrueValue === 'undefined' ? true : this.ngTrueValue) : true;
	}

	get _falseValue() {
		return this.ngModelController ? (typeof this.ngFalseValue === 'undefined' ? false : this.ngFalseValue) : false;
	}

	/**
	 * update ng-model value
	 * @param {boolean} checked
	 */
	updateNgModel(checked) {
		let value = checked ? this._trueValue : this._falseValue;
		this.ngModelController.$setViewValue(value); // change model value & $setViewValue method will trigger method binding on modol
	}
}
