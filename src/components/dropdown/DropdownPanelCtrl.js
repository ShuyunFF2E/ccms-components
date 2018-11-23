import angular from 'angular';
import { Inject } from 'angular-es-utils';

@Inject('$element')
export default class DropdownPanelCtrl {
	$onInit() {
		// 设置初始样式
		this._initStyles();
	}

	_initStyles() {
		const element = angular.element(this.getElement());
		element.toggleClass('dropdown-panel', true);
	}

	getElement() {
		return this._$element[0];
	}
}

