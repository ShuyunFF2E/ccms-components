import angular from 'angular';
import { Inject } from 'angular-es-utils';

import dropdownService from './DropdownService';

@Inject('$scope', '$element')
export default class DropdownCtrl {
	constructor() {
		this.panelCtrl = null;

		// 自动关闭下拉 enum: 'enabled', 'disabled'
		this.autoClose = 'enabled';

		this.onDropdownOpen = () => {};
		this.onDropdownClose = () => {};
	}

	$onInit() {
		if (this.autoClose !== 'disabled') {
			this.autoClose = 'enabled';
		}

		this.onDropdownOpen = this.onDropdownOpen || (() => {});
		this.onDropdownClose = this.onDropdownClose || (() => {});
	}

	getElement() {
		return this._$element[0];
	}

	getScope() {
		return this._$scope;
	}

	getIsOpen() {
		return this.panelCtrl.isVisible;
	}

	open() {
		this.panelCtrl.show();
		this.onDropdownOpen();
	}

	close() {
		this.panelCtrl.hide();
		this.onDropdownClose();
	}
}

@Inject('$element')
export default class DropdownToggleCtrl {
	$postLink() {
		this.getElement().addEventListener('click', event => {
			this.toggle();
			event.stopPropagation();
		});
	}

	getElement() {
		return this._$element[0];
	}

	toggle() {
		let dropdownCtrl = this.parent;
		if (!dropdownCtrl.getIsOpen()) {
			dropdownService.open(dropdownCtrl);
		} else {
			dropdownService.close(dropdownCtrl);
		}
	}
}

@Inject('$element')
export default class DropdownPanelCtrl {
	constructor() {
		this.isVisible = false;
	}

	$onInit() {
		this.parent.panelCtrl = this;
	}

	show() {
		this.isVisible = true;
	}

	hide() {
		this.isVisible = false;
	}
}

const dropdownDDO = {
	restrict: 'EA',
	controller: DropdownCtrl,
	controllerAs: '$ctrl',
	scope: {
		autoClose: '@',
		onDropdownOpen: '&',
		onDropdownClose: '&'
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
	scope: true,
	bindToController: true
};

export default angular
	.module('ccms.components.dropdown', [])
	.directive('dropdown', () => dropdownDDO)
	.directive('dropdownToggle', () => dropdownToggleDDO)
	.directive('dropdownPanel', () => dropdownPanelDDO)
	.name;

