import angular from 'angular';
import {Inject, Bind} from 'angular-es-utils';
import {hasScrolled} from '../../../common/utils/style-helper';

@Inject('$scope', '$element')
export default class DropdownMultiselectCtrl {
	// 选项 item 字段映射
	static defaultMapping = {
		valueField: 'value',
		displayField: 'title'
	};

	constructor() {
		this.selectAll = false;
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
		this.oldText = '';

		this.onDropdownOpen = () => {};
		this.onDropdownClose = () => {};
		this.onSelectChange = () => {};

		this._openFn = null;
	}

	$onInit() {
		this._prepareOptions();
		this._prepareWatches();
		this._prepareSelection();
	}

	$postLink() {
		this._prepareMouseEvents();
		this._prepareKeyboardEvents();
	}

	_prepareOptions() {
		this.mapping = Object.assign({}, DropdownMultiselectCtrl.defaultMapping, this.mapping);

		if (typeof this.searchFields === 'undefined') {
			this.searchFields = [this.mapping.valueField, this.mapping.displayField];
		} else {
			this.searchFields = this.searchFields.map(field => this.mapping[field]);
		}

		if (typeof this.searchable === 'undefined') {
			this.searchable = false;
		}

		if (typeof this.confirmButton === 'undefined') {
			this.confirmButton = false;
			this.autoClose = true;
		} else if (this.confirmButton !== false) {
			this.autoClose = false;
		}

		if (typeof this.disabled === 'undefined') {
			this.disabled = false;
		}

		this.onSelectChange = this.onSelectChange || (() => {});
	}

	_prepareWatches() {
		let scope = this.getScope();

		scope.$watch(() => this.datalist, (datalist, oldDatalist) => {
			this.items = this._clampedDatalist = this._getClampedDatalist(datalist || []);

			// 选中预设值
			this.selection = this._getItemsByValues(this.model);
			this.updateTitle();

			// 当 datalist 发生变化时. 这些常用的数据. 需要进行重算
			this._clampedDatalist = this._getClampedDatalist(this.datalist || []);
			this._clampedEnabledDatalist = this._getClampedDatalist(this._getEnabledItemFromDataList());
			this.selectAll = this._clampedEnabledDatalist.length > 0 && this.selection.length >= this._clampedEnabledDatalist.length;
		});

		scope.$watch(() => this.model, (model, oldModel) => {
			if (!angular.equals(model, oldModel)) {
				let oldSelection = this._getItemsByValues(oldModel);
				this.selection = this._getItemsByValues(model);
				this.updateTitle();
				this.selectAll = this._clampedEnabledDatalist.length > 0 && this.selection.length >= this._clampedEnabledDatalist.length;

				this.onSelectChange({ model, oldModel, selection: this.selection, oldSelection });
			}
		});

		scope.$watchCollection(() => this.selection, () => {
			this.updateTitle();
		});

		scope.$watch(() => this.isOpen, (openState, oldOpenstate) => {
			if (this.disabled && openState) {
				this.isOpen = false;
			}
		});
	}

	_prepareSelection() {
		this._clampedDatalist = this._getClampedDatalist(this.datalist || []);
		this._clampedEnabledDatalist = this._getClampedDatalist(this._getEnabledItemFromDataList());
		this.selection.push(...this._getItemsByValues(this.model));
		// 初始化是否全选
		this.selectAll = this.selection.length >= this._clampedEnabledDatalist.length;
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
						if (this.focusIndex > -1) this.toggleSelection(this.items[this.focusIndex]);
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
			this.selectAll = false;
		} else {
			this.selection.push(item);
			this.selectAll = this.selection.length >= this._clampedEnabledDatalist.length;
		}
	}

	_getEnabledItemFromDataList() {
		return (this.datalist || []).filter(item => item.disabled !== true);
	}

	toggleAll(selectAll) {
		this.selectAll = selectAll;

		// 已选择且 disabled item
		let selectedAndDisabledItems = this.selection.filter(item => item.disabled === true);

		if (this.selectAll) {
			this.selection = this._clampedEnabledDatalist.concat(selectedAndDisabledItems);
		} else {
			this.items = this._clampedDatalist;
			this.selection = selectedAndDisabledItems;
		}
	}

	confirmSelection() {
		this.setValue(this.selection.map(item => item[this.mapping.valueField]));
		this.close();
	}

	cancelSelection() {
		this.selection = this._getItemsByValues(this.model);
		this.close();
	}

	onSearchTextChange(text) {
		if (text !== this.oldText) {
			this.oldText = text;
			text = text.trim();
			if (!this.isOpen) {
				this.open();
			}
			if (text.length) {
				this._search(text);
			} else {
				this.items = this._clampedDatalist;
			}
		}
	}

	onOpen() {
		let scope = this.getScope();

		const input = this.getInputElement();
		input.focus();

		if (this.searchable && this.title.length) {
			this._search(this.title);
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
		}

		this.model = this.selection.map(item => item[this.mapping.valueField]);
		this.updateTitle();
		scope.$root.$$phase || scope.$apply();
		this.onDropdownClose();
	}

	setValue(modelValue) {
		this.model = modelValue;
	}

	clear() {
		if (this.disabled === true) return;
		this.items = this._clampedDatalist;
		this.selection = this.selection.filter(item => item.disabled === true);
		this.selectAll = false;
		this.setTitle('');
		this.oldText = '';
		// this.getInputElement().focus();
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
		let filteredItems = [];

		this.searchFields.forEach(field => {
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

