import angular from 'angular';
import { Inject, Bind } from 'angular-es-utils';
import {hasScrolled} from '../../../common/utils/style-helper';

@Inject('$scope', '$element')
export default class DropdownSelectCtrl {
	// 选项 item 字段映射
	static defaultMapping = {
		valueField: 'value',
		displayField: 'title',
		iconField: 'icon'
	};

	constructor() {
		this.datalist = [];
		this._clampedDatalist = [];
		this.items = [];
		this.mapping = {};
		this.title = '';
		this.placeholder = '';
		this.searchable = false;
		this.supportInputValue = false;
		this.model = null;
		this.focusIndex = 0;
		this.isOpen = false;
		this.autoClose = true;
		this.isActive = false;
		this.oldText = '';

		this.onSelectChange = () => {};
		this.onDropdownOpen = () => {};
		this.onDropdownClose = () => {};

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
		this.items = this._getClampedDatalist(this.datalist || []);

		if (typeof this.autoClose !== 'undefined' && this.autoClose !== false) {
			this.autoClose = true;
		}

		if (typeof this.disabled === 'undefined') {
			this.disabled = false;
		}

		this.onSelectChange = this.onSelectChange || (() => {});
	}

	_prepareWatches() {
		const scope = this.getScope();

		scope.$watch(() => this.datalist, (datalist, oldDatalist) => {
			this.model = this.modelCopy ? this.modelCopy : this.model;
			this.items = this._clampedDatalist = this._getClampedDatalist(datalist || []);
			// TODO: SB requirement
			if (this.supportInputValue) {
				this._searchText = this.model;
			}
			// 选中预设值
			this.setModelValue(this.model);
			// 设置预设值的 focusIndex
			this.focusAt(this.getItemIndexByItemValue(this.model, this.items));
		});

		scope.$watch(() => this.model, (model, oldModel) => {
			if (this.model && (!this.items || !this.items.length)) {
				this.modelCopy = this.model;
			}
			if (!angular.equals(model, oldModel)) {
				const item = this.getItemByValue(this.model);
				const itemIndex = this.getItemIndexByItemValue(this.model, this.items);
				if (this.supportInputValue) {
					this._searchText = this.model;
				}
				this.setModelValue(this.model);
				this.focusAt(itemIndex);
				// 增加回调参数 itemIndex item
				this.onSelectChange({ model, oldModel, itemIndex, item });
			}
		});

		scope.$watch(() => this.isOpen, (openState, oldOpenstate) => {
			if (this.disabled && openState) {
				this.isOpen = false;
			}
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
			scope.$root.$$phase || scope.$digest();
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

	onSearchTextChange(text) {
		this._searchText = text;
		if (text !== this.oldText) {
			this.oldText = text;
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
		const input = this.getInputElement();
		input.focus();

		if (this.searchable && this.title && this.title.length) {
			this._search(this.title);
			this.focusAt(0);
			scope.$root.$$phase || scope.$apply();
		}

		// 如果有下拉选项框有滚动条, 且滚动条没有置顶, 进行置顶
		const itemList = this.getItemListElement();
		if (hasScrolled(itemList) && itemList.scrollTop !== 0) {
			itemList.scrollTop = 0;
		}

		// 将菜单滚动到可视区域
		if (input.getClientRects()[0].bottom + itemList.getClientRects()[0].height > document.documentElement.clientHeight) {
			itemList.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
		}

		this.onDropdownOpen();
	}

	onClose() {
		let scope = this.getScope();
		if (this.searchable) {
			this.getInputElement().addEventListener('click', this._openFn);
			this.setModelValue(this.model);
			scope.$root.$$phase || scope.$apply();
		}
		this.onDropdownClose();
	}

	getItemByValue(value) {
		const valueField = this.mapping.valueField;
		return this.items.find(item => angular.equals(item[valueField], value));
	}

	setModelValue(modelValue) {
		const displayField = this.mapping.displayField;
		const iconField = this.mapping.iconField;
		const newItem = this.getItemByValue(modelValue);

		if (newItem) {
			this.title = newItem[displayField];
			this.model = modelValue;
			this.icon = newItem[iconField];
		} else {
			if (this.supportInputValue) {
				this.title = this._searchText;
				this.model = this._searchText;
				this.icon = false;
				this.items = this._clampedDatalist;
			} else {
				this.title = '';
				this.model = null;
				this.icon = false;
				this.items = this._clampedDatalist;
			}
		}
	}

	clear() {
		this._searchText = null;
		this.modelCopy = null;
		this.setModelValue(null);
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
		const item = this.items[index];
		const scope = this.getScope();

		if (!item) {
			return;
		}

		const onBeforeSelectChange = this.onBeforeSelectChange || (() => Promise.resolve());

		onBeforeSelectChange({ item })
			.then(() => {
				scope.$evalAsync(() => {
					this.title = item[this.mapping.displayField];
					this.model = item[this.mapping.valueField];
					this.icon = item[this.mapping.iconField];

					this.focusAt(index);
					this.close();
				});
			})
			.catch(() => {
				scope.$evalAsync(() => this.close());
			});
		// todo Promise.prototype.finally travis-ci  暂时不支持等支持后修改
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

	getItemListElement() {
		return this.getElement()
			.querySelector('.dropdown-list');
	}

	getItemElementAt(index) {
		return this.getItemListElement()
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
				if (fieldValue.toString().toLocaleUpperCase().indexOf(text && text.toLocaleUpperCase()) !== -1 &&
					filteredItems.indexOf(item) === -1) {
					filteredItems.push(item);
				}
			});
		});

		this.items = filteredItems;
	}
};

