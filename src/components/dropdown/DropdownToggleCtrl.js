import angular from 'angular';
import { Inject, Bind } from 'angular-es-utils';

@Inject('$element')
export default class DropdownToggleCtrl {
	$onInit() {
		// 设置初始样式
		this._initStyles();
	}

	$postLink() {
		this.getElement().addEventListener('click', this.toggle);
	}

	_initStyles() {
		const element = angular.element(this.getElement());
		element.toggleClass('dropdown-toggle', true);
	}

	getElement() {
		return this._$element[0];
	}

	@Bind
	toggle(event) {
		let dropdownCtrl = this.parent;
		if (dropdownCtrl.isOpen) {
			dropdownCtrl.close();
		} else {
			dropdownCtrl.open();
		}
		event.stopPropagation();
	}
}

