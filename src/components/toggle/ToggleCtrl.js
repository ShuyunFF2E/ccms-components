/**
 * @author Arz
 * @homepage https://github.com/arzyu
 */

const DEFAULT_OPTIONS = {
	textOn: '已开启',
	textOff: '已关闭'
};

export default class ToggleController {
	$onInit() {
		this._prepareOptions();
		this.updateNgModel(this.state);
	}

	_prepareOptions() {
		this.valueOn = this.ngModelController ? (typeof this.valueOn === 'undefined' ? true : this.valueOn) : true;
		this.valueOff = this.ngModelController ? (typeof this.valueOff === 'undefined' ? false : this.valueOff) : false;
		this.textOn = typeof this.textOn === 'undefined' ? DEFAULT_OPTIONS.textOn : this.textOn;
		this.textOff = typeof this.textOff === 'undefined' ? DEFAULT_OPTIONS.textOff : this.textOff;
	}

	get state() {
		return this.ngModel === this.valueOn;
	}

	updateNgModel(state) {
		const viewValue = state ? this.valueOn : this.valueOff;
		this.ngModelController.$setViewValue(viewValue);
	}
}
