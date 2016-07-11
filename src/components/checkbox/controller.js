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
	 * init method
	 * if ng-model set on components, add a listener watch the model value to change the component checked state.
	 */
	$onInit() {
		this.trueValue = this.ngModelController ? (typeof this.ngTrueValue === 'undefined' ? true : this.ngTrueValue) : true;
		this.falseValue = this.ngModelController ? (typeof this.ngFalseValue === 'undefined' ? false : this.ngFalseValue) : false;

		this.ngModelController && this._$scope.$watch('$ctrl.ngModel', newValue => {
			this.checked = newValue === this.trueValue;
		});
	}

	/**
	 * onChange method
	 * watch the value pass from the component's attribute
	 * @param {object} opt
	 */
	$onChanges(opt) {
		opt.ngChecked && (this.checked = opt.ngChecked.currentValue);
		opt.ngChecked && this.ngModelController && this.updateNgModel(this.checked);
		opt.ngTrueValue && this.ngModelController && (this.trueValue = opt.ngTrueValue.currentValue);
		opt.ngFalseValue && this.ngModelController && (this.falseValue = opt.ngFalseValue.currentValue);
		opt.ngDisabled && (this.disabled = opt.ngDisabled.currentValue);
		opt.indeterminate && (this.indeterminate = opt.indeterminate.currentValue);
	}

	/**
	 * toggle the checked value when user click the checkbox
	 * @returns {boolean}
	 */
	toggleClick() {
		if (this.ngDisabled || this.indeterminate) return false;
		this.checked = !this.checked;
		this.ngModelController && this.updateNgModel(this.checked);
	}

	/**
	 * update ng-model value
	 * @param {boolean} checked
	 */
	updateNgModel(checked) {
		let value = checked ? this.trueValue : this.falseValue;
		this.ngModelController.$setViewValue(value); // change model value & $setViewValue method will trigger method binding on modol
	}
}
