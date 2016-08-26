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
		this._prepareOptions();
		this._prepareWatches();
	}

	$postLink() {
		this._prepareMouseEvents();
		this._prepareKeyboardEvents();
	}

	_prepareOptions() {
		const defaultMapping = DropdownSelectCtrl.defaultMapping;
		this.mapping = Object.assign({}, defaultMapping, this.mapping);

		if (typeof this.disabled === 'undefined') {
			this.disabled = false;
		}
	}

	_prepareWatches() {
		const scope = this.getScope();

		scope.$watch(() => this.datalist, (datalist, oldDatalist) => {
			this.items = this._clampedDatalist = this._getClampedDatalist(datalist || []);

			// 选中预设值
			this.setModelValue(this.model);
			// 设置预设值的 focusIndex
			this.focusAt(this.getItemIndexByItemValue(this.model, this.items));
		});

		scope.$watch(() => this.model, (model, oldModel) => {
			if (!angular.equals(model, oldModel)) {
				this.setModelValue(this.model);
			}
		});

		if (this.disabled) {
			scope.$watch(() => this.isOpen, (openState, oldOpenstate) => {
				if (openState) {
					this.isOpen = false;
				}
			});
		}
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

	onSearchTextChange(text, oldText) {
		if (text !== oldText) {
			text = text.trim();
			if (!this.isOpen) {
				this.open();
			}
			if (text.length) {
				this._search(text);
			} else {
				this.setModelValue(null);
				this.items = this._clampedDatalist;
			}
			this.focusAt(0);
		}
	}

	onOpen() {
		let scope = this.getScope();
		this.getInputElement().focus();
		if (this.searchable && this.title.length) {
			this._search(this.title);
			this.focusAt(0);
			scope.$root.$$phase || scope.$apply();
		}
	}

	onClose() {
		let scope = this.getScope();
		if (this.searchable) {
			this.getInputElement().addEventListener('click', this._openFn);
			this.setModelValue(this.model);
			scope.$root.$$phase || scope.$apply();
		}
	}

	setModelValue(modelValue) {
		if (modelValue !== null) {
			let valueField = this.mapping.valueField;
			let modelExisted = this.items.some(item => {
				if (angular.equals(item[valueField], this.model)) {
					this.title = item[this.mapping.displayField];
					return true;
				}
			});
			if (!modelExisted) {
				this.title = '';
				this.model = null;
			}
		} else {
			this.title = '';
			this.model = null;
		}
	}

	clear() {
		this.setModelValue(null);
		this.items = this._getClampedDatalist(this.datalist);
		this.getInputElement().focus();
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

	getItemIndexByItemValue(ItemValue, items) {
		return items.findIndex(item => {
			return item[this.mapping.valueField] === ItemValue;
		});
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
				const fieldValue = item[field];
				if (fieldValue.toString().indexOf(text) !== -1 &&
						filteredItems.indexOf(item) === -1) {

					filteredItems.push(item);
				}
			});
		});

		this.items = filteredItems;
	}
};

