import angular from 'angular';
import { Inject } from 'angular-es-utils';

import dropdownService from '../DropdownService';

@Inject('$scope', '$element')
export default class DropdownSelectCtrl {
	// 选项 item 字段映射
	static defaultMapping = {
		valueField: 'value',
		displayField: 'title'
	};

	constructor() {
		this.datalist = [];
		this.items = [];
		this.mapping = {};
		this.title = '';
		this.value = null;
		this.placeholder = '';
		this.searchable = false;
		this.focusIndex = 0;

		this._dropdownCtrl = null;
		this._openFn = null;
	}

	$onInit() {
		let scope = this.getScope();

		scope.$watch(() => this.datalist, ::this.onDatalistChange);

		this.mapping = Object.assign({}, DropdownSelectCtrl.defaultMapping, this.mapping);
		this.datalist = this.datalist || [];
	}

	$postLink() {
		let inputElement = this.getInputElement();

		this._dropdownCtrl = this._getDropdownCtrl();

		this._openFn = this::(() => {
			this.open();
			inputElement.removeEventListener('click', this._openFn);
		});

		if (!this.searchable) {
			inputElement.addEventListener('click', ::this.toggle);
		} else {
			inputElement.addEventListener('click', this._openFn);
		}

		this._registerKeyboardEvent();
	}

	_registerKeyboardEvent() {
		let inputElement = this.getInputElement();
		let keydownFn = event => {
			let scope = this.getScope();
			let keyCode = event.keyCode;

			// 关闭状态时按键打开
			if (!this._dropdownCtrl.getIsOpen()) {
				if (keyCode === 13 || keyCode === 38 || keyCode === 40) {
					this.open();
					return;
				}
			}

			switch (event.keyCode) {
				case 13: // enter
					this.selectItemAt(this.focusIndex);
					break;
				case 38: // up
					this.focusUp();
					scope.$root.$$phase || scope.$apply();
					break;
				case 40: // down
					this.focusDown();
					scope.$root.$$phase || scope.$apply();
					break;
				default:
			}
		};
		inputElement.addEventListener('focus', event => {
			let target = event.currentTarget;
			target.addEventListener('keydown', keydownFn);
		});
		inputElement.addEventListener('blur', event => {
			let target = event.currentTarget;
			target.removeEventListener('keydown', keydownFn);
		});
	}

	onDatalistChange(datalist, oldDatalist) {
		this.items = this._getClampedDatalist(datalist || []);
	}

	onSearchTextChange(text, oldText) {
		if (text !== oldText) {
			text = text.trim();
			if (!this._dropdownCtrl.getIsOpen()) {
				this.open();
			}
			if (text.length) {
				this._search(text);
			} else {
				this.items = this._getClampedDatalist(this.datalist);
			}
			this.focusAt(0);
		}
	}

	onDropdownOpen() {
		this.getInputElement().focus();
		if (this.searchable && this.title.length) {
			this._search(this.title);
			this.focusAt(0);
		}
	}

	onDropdownClose() {
		if (this.searchable) {
			this.getInputElement().addEventListener('click', this._openFn);
		}
	}

	clearDropdownSelectInput() {
		this.title = '';
		this.items = this._getClampedDatalist(this.datalist);
		this.focusAt(0);
	}

	toggle() {
		if (this._dropdownCtrl.getIsOpen()) {
			this.close();
		} else {
			this.open();
		}
	}

	open() {
		dropdownService.open(this._dropdownCtrl);
	}

	close() {
		dropdownService.close(this._dropdownCtrl);
	}

	selectItemAt(index) {
		let item = this.items[index];
		if (item) {
			this.title = item[this.mapping.displayField];
			this.value = item[this.mapping.valueField];
			this.focusAt(index);
			this.close();
		}
	}

	focusAt(index) {
		this.focusIndex = index;
	}

	focusUp() {
		if (--this.focusIndex < 0) {
			this.focusIndex = 0;
		}
	}

	focusDown() {
		let listCount = this.items.length;
		if (++this.focusIndex > listCount - 1) {
			this.focusIndex = listCount - 1;
		}
	}

	getElement() {
		return this._$element[0];
	}

	getInputElement() {
		return this.getElement().querySelector('.dropdown-select-input');
	}

	getScope() {
		return this._$scope;
	}

	highlight(content, hiText) {
		if (!this.searchable || !hiText) {
			return content;
		}
		return content.replace(new RegExp(hiText, 'gi'), '<span class="highlight">$&</span>');
	}

	_getClampedDatalist(datalist) {
		// 将每个 item 构造为对象
		// e.g. 将 ['北京', '上海'] 构造为
		// [{title: '北京', value: '北京'}, {title: '上海', value: '上海'}]
		return datalist.map(item => {
			if (typeof item !== 'object') {
				return {
					[this.mapping.displayField]: item,
					[this.mapping.valueField]: item
				};
			} else {
				return item;
			}
		});
	}

	_search(text) {
		let datalist = this._getClampedDatalist(this.datalist);
		let mapping = this.mapping;
		let searchFields = [mapping.valueField, mapping.displayField];
		let filteredItems = [];

		searchFields.forEach(field => {
			for (let i = datalist.length - 1; i > -1; i--) {
				let item = datalist[i];
				if (item[field].indexOf(text) !== -1) {
					filteredItems.push(item);
					datalist.splice(i, 1);
				}
			}
		});

		this.items = filteredItems;
	}

	_getDropdownCtrl() {
		let element = this.getElement();
		let dropdownElement = element.querySelector('dropdown') ||
					element.querySelector('[dropdown]');
		return angular.element(dropdownElement).controller('dropdown');
	}
};

