/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

export default class CheckboxController {
	/**
	 * @name $onInit
	 * controller init method, init true, false values
	 */
	$onInit() {
		this.ngTrueValue = this.ngModelController ? (typeof this.ngTrueValue === 'undefined' ? true : this.ngTrueValue) : true;
		this.ngFalseValue = this.ngModelController ? (typeof this.ngFalseValue === 'undefined' ? false : this.ngFalseValue) : false;
		this.ngChecked = ('ngModel' in this) ? this.ngModel === this.ngTrueValue : this.ngChecked;
	}

	/**
	 * @name $onChanges
	 * @param {object} opt
	 * watch the ng-model change situation, when ngModel changed, the checked value changes
	 */
	$onChanges(opt) {
		opt.ngModel && (this.ngChecked = opt.ngModel.currentValue === this.ngTrueValue);
	}

	/**
	 * @name toggleClick
	 * toggle the checked value when user click the checkbox
	 */
	toggleClick($event) {
		if (this.ngDisabled) {
			// 当 checkbox 不可用时, 阻止其它注册的 click listener
			$event.stopImmediatePropagation();
			return false;
		}
		this.indeterminate = false;
		this.ngChecked = !this.ngChecked;
		this.ngModelController && this.updateNgModel(this.ngChecked);
	}

	/**
	 * @name updateNgModel
	 * @param {boolean} checked
	 * update ng-model value
	 */
	updateNgModel(checked) {
		let value = checked ? this.ngTrueValue : this.ngFalseValue;
		this.ngModelController.$setViewValue(value); // change model value & $setViewValue method will trigger method binding on model
	}
}
