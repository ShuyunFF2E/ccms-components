import angular from 'angular';
import { Inject, Bind } from 'angular-es-utils';

import dropdownService from './DropdownService';

@Inject('$element')
export default class DropdownCtrl {
	constructor() {
		this.panelCtrl = null;

		this._isOpen = false;
		this._phase = '';

		// 自动关闭下拉 enum: 'enabled', 'disabled'
		this.autoClose = 'enabled';

		this.ondropdownopen = () => {};
		this.ondropdownclose = () => {};
	}

	$onInit() {
		if (this.autoClose !== 'disabled') {
			this.autoClose = 'enabled';
		}

		this.ondropdownopen = this.ondropdownopen || (() => {});
		this.ondropdownclose = this.ondropdownclose || (() => {});
	}

	getElement() {
		return this._$element[0];
	}

	_setOpenState(openState) {
		this._isOpen = openState;

		// 设置 _phase 避免进入 set isOpen 循环
		this._phase = openState ? 'open' : 'close';
		this.isOpen = openState;
		this._phase = '';
	}

	get isOpen() {
		return this._isOpen;
	}

	set isOpen(openState) {
		if (typeof this._phase === 'string' && !this._phase.length && this.isOpen !== openState) {
			if (openState) {
				this.open();
			} else {
				this.close();
			}
		}
	}

	open() {
		dropdownService.open(this);
		this.panelCtrl.show();
		this._setOpenState(true);
		this.ondropdownopen();
	}

	close() {
		dropdownService.close(this);
		this.panelCtrl.hide();
		this._setOpenState(false);
		this.ondropdownclose();
	}
}

@Inject('$element')
export default class DropdownToggleCtrl {
	$postLink() {
		this.getElement().addEventListener('click', this.toggle);
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

@Inject('$element')
export default class DropdownPanelCtrl {
	$onInit() {
		this.parent.panelCtrl = this;
	}

	getElement() {
		return this._$element[0];
	}

	show() {
		this.getElement().classList.remove('hide');
	}

	hide() {
		this.getElement().classList.add('hide');
	}
}

const dropdownDDO = {
	restrict: 'EA',
	controller: DropdownCtrl,
	controllerAs: '$ctrl',
	scope: {
		isOpen: '=?',
		autoClose: '@?',
		onDropdownOpen: '&?',
		onDropdownClose: '&?'
	},
	bindToController: true
};

const dropdownToggleDDO = {
	restrict: 'EA',
	require: {
		parent: '^^dropdown'
	},
	controller: DropdownToggleCtrl,
	controllerAs: '$ctrl',
	scope: {},
	bindToController: true
};

const dropdownPanelDDO = {
	restrict: 'EA',
	require: {
		parent: '^^dropdown'
	},
	template: '<div ng-transclude></div>',
	transclude: true,
	controller: DropdownPanelCtrl,
	controllerAs: '$ctrl',
	scope: {},
	bindToController: true
};

export default angular
	.module('ccms.components.dropdown', [])
	.directive('dropdown', () => dropdownDDO)
	.directive('dropdownToggle', () => dropdownToggleDDO)
	.directive('dropdownPanel', () => dropdownPanelDDO)
	.name;

