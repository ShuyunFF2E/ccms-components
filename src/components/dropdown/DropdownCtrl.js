import { Inject } from 'angular-es-utils';

import dropdownService from './DropdownService';

@Inject('$element')
export default class DropdownCtrl {
	constructor() {
		this.panelCtrl = null;

		this._isOpen = false;
		this._phase = '';

		this.autoClose = true;

		this.onDropdownOpen = () => {};
		this.onDropdownClose = () => {};
	}

	$onInit() {
		if (typeof this.autoClose !== 'undefined' && this.autoClose !== false) {
			this.autoClose = true;
		}

		this.onDropdownopen = this.onDropdownOpen || (() => {});
		this.onDropdownclose = this.onDropdownClose || (() => {});
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
		this.onDropdownOpen();
	}

	close() {
		dropdownService.close(this);
		this.panelCtrl.hide();
		this._setOpenState(false);
		this.onDropdownClose();
	}
}

