/**
 * @author Arz
 * @since 2/14/17
 */

export default class ToggleController {
	$onInit() {
		this._prepareOptions();
		this.updateNgModel(this.state);
	}

	_prepareOptions() {
		this.ngTrueValue = true;
		this.ngFalseValue = false;
		this.textOn = '已开启 HARD 模式';
		this.textOff = '已关闭';
	}

	get state() {
		return this.ngModel === this.ngTrueValue;
	}

	updateNgModel(state) {
		const viewValue = state ? this.ngTrueValue : this.ngFalseValue;
		this.ngModelController.$setViewValue(viewValue);
	}
}
