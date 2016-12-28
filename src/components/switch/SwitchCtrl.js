/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-06-06 11:41
 */

const DEFAULT_OPTIONS = {
	openText: '已开启',
	closeText: '已关闭'
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
	get _width() {
		let openTextWidth = (this.openText.replace(/[\u4e00-\u9fa5]/g, '**')).length;
		let closeTextWidth = (this.closeText.replace(/[\u4e00-\u9fa5]/g, '**')).length;
		return (Math.floor(Math.max(openTextWidth, closeTextWidth) / 2) + 3) + 'em';
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
