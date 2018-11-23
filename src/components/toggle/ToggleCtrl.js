import angular from 'angular';
import { Inject } from 'angular-es-utils';

@Inject('$element')
export default class ToggleController {
	static valueOn = true;
	static valueOff = false;
	static textOn = '已开启';
	static textOff = '已关闭';

	$onInit() {
		this._prepareOptions();
		this.updateNgModel(this.state);
	}

	$onChanges(changedObjects) {
		// 使用 .no-animation 来禁用初始动画
		// 在手动触发 ngModel 变化时移除 .no-animation
		const ngModelObject = changedObjects.ngModel;
		if (ngModelObject &&
				!ngModelObject.isFirstChange() &&
				angular.isDefined(ngModelObject.previousValue)) {

			angular
				.element(this.getElement().querySelector('.cc-toggle'))
				.toggleClass('no-animation', false);
		}
	}

	_prepareOptions() {
		if (angular.isUndefined(this.valueOn)) {
			if (angular.isDefined(this.ngTrueValue)) {
				this.valueOn = this.ngTrueValue;
				console.warn('cc-toggle/cc-switch: ng-true-value/ng-false-value 参数已废弃，请使用 value-on/value-off 代替。');
			} else {
				this.valueOn = ToggleController.valueOn;
			}
		}

		if (angular.isUndefined(this.valueOff)) {
			if (angular.isDefined(this.ngFalseValue)) {
				this.valueOff = this.ngFalseValue;
				console.warn('cc-toggle/cc-switch: ng-true-value/ng-false-value 参数已废弃，请使用 value-on/value-off 代替。');
			} else {
				this.valueOff = ToggleController.valueOff;
			}
		}

		if (angular.isUndefined(this.textOn)) {
			if (angular.isDefined(this.openText)) {
				this.textOn = this.openText;
				console.warn('cc-toggle/cc-switch: open-text/close-text 参数已废弃，请使用 text-on/text-off 代替。');
			} else {
				this.textOn = ToggleController.textOn;
			}
		}

		if (angular.isUndefined(this.textOff)) {
			if (angular.isDefined(this.closeText)) {
				this.textOff = this.closeText;
				console.warn('cc-toggle/cc-switch: open-text/close-text 参数已废弃，请使用 text-on/text-off 代替。');
			} else {
				this.textOff = ToggleController.textOff;
			}
		}
	}

	get state() {
		return this.ngModel === this.valueOn;
	}

	updateNgModel(state) {
		const viewValue = state ? this.valueOn : this.valueOff;
		this.ngModelController.$setViewValue(viewValue);
	}

	getElement() {
		return this._$element[0];
	}
}
