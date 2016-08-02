/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-06-06 11:41
 */

const DEFAULT_OPTIONS = {
	openText: '开',
	closeText: '关'
};

export default class SwitchButtonController {
	/**
	 * @name $onInit
	 * controller init method, init values
	 */
	$onInit() {
		this.ngTrueValue = this.ngModelController ? (typeof this.ngTrueValue === 'undefined' ? true : this.ngTrueValue) : true;
		this.ngFalseValue = this.ngModelController ? (typeof this.ngFalseValue === 'undefined' ? false : this.ngFalseValue) : false;
		this.openText = typeof this.openText === 'undefined' ? DEFAULT_OPTIONS.openText : this.openText;
		this.closeText = typeof this.closeText === 'undefined' ? DEFAULT_OPTIONS.closeText : this.closeText;
		this.updateNgModel(this._state);
	}

	get _state() {
		return this.ngModel === this.ngTrueValue;
	}

	/**
	 * @name updateNgModel
	 * @param {boolean} state
	 * update ng-model value
	 */
	updateNgModel(state) {
		this.ngModelController.$setViewValue(state ? this.ngTrueValue : this.ngFalseValue); // change model value & $setViewValue method will trigger method binding on model
	}
}
