import angular from 'angular';
import { Inject } from 'angular-es-utils';

import dropdownService from './DropdownService';

@Inject('$element')
export default class DropdownCtrl {
	constructor() {
		this._isOpen = false;
		this._phase = '';
	}

	$onInit() {
		if (typeof this.autoClose !== 'undefined' && this.autoClose !== false) {
			this.autoClose = true;
		}

		// 设置初始样式
		this._initStyles();

		// 设置初始状态
		this.isOpen ? this.open() : this.close();
	}

	_initStyles() {
		const element = angular.element(this.getElement());
		element.toggleClass('dropdown', true);
	}

	getElement() {
		return this._$element[0];
	}

	_setOpenState(openState) {
		this._isOpen = openState;

		// 设置 _phase 避免进入 set isOpen 循环
		this._phase = openState ? 'opening' : 'closing';
		this.isOpen = openState;
		this._phase = '';
	}

	_setOpenStateClass(openState) {
		const element = angular.element(this.getElement());
		element.toggleClass('dropdown-opened', openState);
		element.toggleClass('dropdown-closed', !openState);
	}

	get isOpen() {
		return this._isOpen;
	}

	set isOpen(openState) {
		// 排除 constructor 运行之前就会执行的调用，bug ?
		// 调用栈 angular-es-utils/decorators/Inject.js
		if (typeof this._phase !== 'string') {
			return;
		}

		// 设置 isOpen 变量的时候需会调用此 setter，然后按需执行 open/close 操作
		// 为向组件外层反馈 isOpen 状态，实现双向绑定，
		// 调用 open/close 时也会设置 isOpen 变量
		// 为了避免如此循环，使用 _phase 记录状态，如果正在进行操作，就跳出循环
		if (this._phase.length) {
			return;
		}

		// 改变 isOpen 状态时，按需执行 open/close 操作
		if (this.isOpen !== openState) {
			openState ? this.open() : this.close();
		}
	}

	open() {
		dropdownService.open(this);
		this._setOpenStateClass(true);
		this._setOpenState(true);
		this.onDropdownOpen && this.onDropdownOpen();
	}

	close() {
		dropdownService.close(this);
		this._setOpenStateClass(false);
		this._setOpenState(false);
		this.onDropdownClose && this.onDropdownClose();
	}
}

