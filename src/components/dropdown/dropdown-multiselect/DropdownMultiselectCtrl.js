import angular from 'angular';
import {Inject, Bind} from 'angular-es-utils';

@Inject('$scope', '$element')
export default class DropdownMultiselectCtrl {
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
		this.model = [];
		this.selection = [];
		this.placeholder = '';
		this.searchable = false;
		this.confirmButton = false;
		this.autoClose = true;
		this.focusIndex = -1;
		this.isOpen = false;
		this.isActive = false;

		this._openFn = null;
	}

	$onInit() {
		this._prepareOptions();
		this._prepareWatches();
	}

	$postLink() {
		this._prepareMouseEvents();
		this._prepareKeyboardEvents();
	}

	_prepareOptions() {
		this.mapping = Object.assign({}, DropdownMultiselectCtrl.defaultMapping, this.mapping);

		if (typeof this.searchable === 'undefined') {
			this.searchable = false;
		}

		if (typeof this.confirmButton === 'undefined') {
			this.confirmButton = false;
			this.autoClose = true;
		} else if (this.confirmButton !== false) {
			this.autoClose = false;
		}
	}

	_prepareWatches() {
		let scope = this.getScope();

		scope.$watch(() => this.datalist, (datalist, oldDatalist) => {
			this.items = this._clampedDatalist = this._getClampedDatalist(datalist || []);

			// 选中预设值
			this.selection = this._getItemsByValues(this.model);
			this.updateTitle();
		});

		scope.$watchCollection(() => this.selection, () => {
			this.updateTitle();
		});

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
						this.toggleSelection(this.items[this.focusIndex]);
						break;
					case 38: // up
						this.focusUp();
						event.preventDefault();
						break;
					case 40: // down
						this.focusDown();
						event.preventDefault();
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

	setTitle(title) {
		this.title = title;
	}

	updateTitle() {
		let titleList = this.selection.map(item => item[this.mapping.displayField]);
		this.setTitle(titleList.join(','));
	}

	_getItemsByValues(values) {
		let items = [];
		let itemsList = this._clampedDatalist;
		let valueField = this.mapping.valueField;

		values.forEach(value => {
			let targetItem = itemsList.find(item => {
				return angular.equals(item[valueField], value);
			});
			if (targetItem) {
				items.push(targetItem);
			}
		});

		return items;
	}

	toggleSelection(item) {
		let index = this.selection.indexOf(item);
		if (index > -1) {
			this.selection.splice(index, 1);
		} else {
			this.selection.push(item);
		}
	}

	confirmSelection() {
		this.setValue(this.selection);
		this.close();
	}

	cancelSelection() {
		this.selection = this._getItemsByValues(this.model);
		this.close();
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
				// TODO: setValue
				this.items = this._clampedDatalist;
			}
		}
	}

	onOpen() {
		let scope = this.getScope();
		this.getInputElement().focus();
		if (this.searchable && this.title.length) {
			this._search(this.title);
			scope.$root.$$phase || scope.$apply();
		}
	}

	onClose() {
		let scope = this.getScope();
		if (this.searchable) {
			this.getInputElement().addEventListener('click', this._openFn);
			// TODO: setValue
		}

		this.model = this.selection.map(item => item[this.mapping.valueField]);
		this.updateTitle();
		scope.$root.$$phase || scope.$apply();
	}

	setValue(modelValue) {
		this.model = modelValue;
	}

	clear() {
		this.items = this._clampedDatalist;
		this.setTitle('');
		this.getInputElement().focus();
		if (!this.isOpen) {
			this.open();
		}
	}

	setActiveState(isActive) {
		this.isActive = isActive;
		if (isActive && this.searchable) {
			this.items = this._clampedDatalist;
			this.setTitle('');
		}
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

	focusAt(index) {
		this.focusIndex = index;
	}

	focusUp() {
		let index = this.focusIndex - 1;
		if (index < 0) {
			index = 0;
		}
		this.focusAt(index);

		let itemElement = this.getItemElementAt(index);
		if (itemElement) {
			itemElement.scrollIntoView(true);
		}
	}

	focusDown() {
		let listCount = this.items.length;
		let index = this.focusIndex + 1;
		if (index > listCount - 1) {
			index = listCount - 1;
		}
		this.focusAt(index);

		let itemElement = this.getItemElementAt(index);
		if (itemElement) {
			itemElement.scrollIntoView(false);
		}
	}

	getElement() {
		return this._$element[0];
	}

	getInputElement() {
		return this.getElement().querySelector('.dropdown-select-input');
	}

	getItemElementAt(index) {
		return this.getElement()
				.querySelector('.dropdown-list')
				.querySelectorAll('li:not(.empty-list-item)')[index];
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

