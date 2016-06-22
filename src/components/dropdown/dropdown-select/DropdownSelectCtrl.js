import angular from 'angular';
import {Inject, Bind} from 'angular-es-utils';

@Inject('$scope', '$element')
export default class DropdownSelectCtrl {
	// 选项 item 字段映射
	static defaultMapping = {
		valueField: 'value',
		displayField: 'title'
	};

	constructor() {
		this.datalist = [];
		this._clampedDatalist = [];
		this.items = [];
		this.mapping = {};
		this.title = '';
		this.placeholder = '';
		this.searchable = false;
		this.model = null;
		this.focusIndex = 0;
		this.isOpen = false;
		this.isActive = false;

		this._openFn = null;
	}

	$onInit() {
		let scope = this.getScope();

		this.mapping = Object.assign({}, DropdownSelectCtrl.defaultMapping, this.mapping);

		scope.$watch(() => this.datalist, (datalist, oldDatalist) => {
			this.items = this._clampedDatalist = this._getClampedDatalist(datalist || []);

			// 选中预设值
			if (this.model !== null) {
				let valueField = this.mapping.valueField;
				let modelExisted = this.items.some(item => {
					if (angular.equals(item[valueField], this.model)) {
						this.title = item[this.mapping.displayField];
						return true;
					}
				});
				if (!modelExisted) {
					this.model = null;
				}
			}
		});
	}

	$postLink() {
		this._prepareMouseEvents();
		this._prepareKeyboardEvents();
	}

	_prepareMouseEvents() {
		let inputElement = this.getInputElement();

		if (!this.searchable) {
			inputElement.addEventListener('click', this.toggle);
		} else {
			this._openFn = this::(event => {
				let scope = this.getScope();
				this.open();
				scope.$root.$$phase || scope.$apply();
				inputElement.removeEventListener('click', this._openFn);
			});
			inputElement.addEventListener('click', this._openFn);
		}
	}

	_prepareKeyboardEvents() {
		let keydownFn = event => {
			let scope = this.getScope();
			let keyCode = event.keyCode;
			if (!this.isOpen) {
				// 下拉激活且关闭时，按 回车、上、下 键打开下拉
				if (keyCode === 13 || keyCode === 38 || keyCode === 40) {
					this.open();
				}
			} else {
				switch (keyCode) {
					case 13: // enter
						this.selectItemAt(this.focusIndex);
						break;
					case 38: // up
						this.focusUp();
						break;
					case 40: // down
						this.focusDown();
						break;
					default:
				}
			}
			scope.$root.$$phase || scope.$apply();
		};

		this.getScope().$watch(() => this.isActive, (isActive, oldState) => {
			if (isActive !== oldState) {
				let inputElement = this.getInputElement();
				if (isActive) {
					inputElement.addEventListener('keydown', keydownFn);
				} else {
					inputElement.removeEventListener('keydown', keydownFn);
				}
			}
		});
	}

	onSearchTextChange(text, oldText) {
		if (text !== oldText) {
			text = text.trim();
			if (!this.isOpen) {
				this.open();
			}
			if (text.length) {
				this._search(text);
			} else {
				this.items = this._clampedDatalist;
			}
			this.focusAt(0);
		}
	}

	onDropdownOpen() {
		let scope = this.getScope();
		this.getInputElement().focus();
		if (this.searchable && this.title.length) {
			this._search(this.title);
			this.focusAt(0);
			scope.$root.$$phase || scope.$apply();
		}
	}

	onDropdownClose() {
		let scope = this.getScope();
		if (this.searchable) {
			this.getInputElement().addEventListener('click', this._openFn);
			scope.$root.$$phase || scope.$apply();
		}
	}

	clearDropdownSelectInput() {
		this.title = '';
		this.items = this._getClampedDatalist(this.datalist);
		this.focusAt(0);
	}

	@Bind
	toggle() {
		let scope = this.getScope();
		if (this.isOpen) {
			this.close();
		} else {
			this.open();
		}
		scope.$root.$$phase || scope.$apply();
	}

	open() {
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}

	selectItemAt(index) {
		let item = this.items[index];
		if (item) {
			this.title = item[this.mapping.displayField];
			this.model = item[this.mapping.valueField];
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
		let datalist = this._clampedDatalist;
		let mapping = this.mapping;
		let searchFields = [mapping.valueField, mapping.displayField];
		let filteredItems = [];

		searchFields.forEach(field => {
			datalist.forEach(item => {
				if (item[field].indexOf(text) !== -1 && filteredItems.indexOf(item) === -1) {
					filteredItems.push(item);
				}
			});
		});

		this.items = filteredItems;
	}
};

