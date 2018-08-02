import angular from 'angular';
import { Inject } from 'angular-es-utils/decorators';
import cloneDeep from 'lodash.clonedeep';
import { commonGridColumnDef } from './Constant';

import allShopFormTemplate from './tpls/all-shop-form.tpl.html';
import selectedShopFormTemplate from './tpls/selected-shop-form.tpl.html';
import rowTemplate from './tpls/row.tpl.html';
import rowCellTemplate from './tpls/row-cell.tpl.html';
import footerTemplate from './tpls/grid-footer.tpl.html';
import emptyTemplate from './tpls/empty.tpl.html';


/**
 * 从集合中获取entity的index,找不到返回-1
 */
function findEntityById(collection, entity) {
	return collection.findIndex(item => angular.equals(item.id, entity.id));
}

@Inject('$resource', '$ccGrid', 'isSingleSelected', 'modalInstance')
export default class ShopSelectorCtrl {
	constructor() {
		this.isSingleSelected = this._isSingleSelected; // 是否是单选
		this.selectedItems = [{id: '35647605646', age: 25, gender: '男', $selected: true}];
		this.selectedItemsBuffer = cloneDeep(this.selectedItems);
		this.radio = {
			value: this.selectedItems.length ? this.selectedItems[0].id : null,
			setting: [],
			disabled: false
		};
		this.initForm();
		this.prepareAllShopGridOptions();
		this.prepareSelectedShopGridOptions();
	}

	initForm() {
		this.allShopFormTemplate = allShopFormTemplate;
		this.selectedShopFormTemplate = selectedShopFormTemplate;
	}

	prepareAllShopGridOptions() {
		this.allShopGridOptions = {
			resource: this._$resource('/api/test'),
			queryParams: {
				pageNum: 1,  // 当前页码
				pageSize: 20 // 每页大小
			},
			columnsDef: commonGridColumnDef,
			rowTpl: rowTemplate,
			rowCellTemplate: rowCellTemplate,
			footerTpl: footerTemplate,
			emptyTipTpl: emptyTemplate,
			pager: {
				totals: 0,  // 总条数
				totalPages: 1,  // 总页数
				pageNum: 1,  // 当前页码
				pageSize: 20, // 每页大小
				pageSizeList: [10, 20, 30, 50],
				pageSizeListDisabled: false
			},
			isSingleSelected: this.isSingleSelected,
			radio: this.radio,
			selectedItems: this.selectedItems,
			// 多选
			switchSelectItem: ($selected, entity) => {
				if ($selected) {
					this.selectedItems.push(entity);
				} else {
					this.selectedItems.splice(findEntityById(this.selectedItems, entity), 1);
				}
				this.updateSelectedItemsBuffer(entity);
			},
			// 单选
			switchSingleSelectItem: entity => {
				this.allShopGridOptions.radio.value = entity.id;
				this.selectedItems.splice(0, this.selectedItems.length, entity);
			},
			isEntitySelected: entity => {
				return findEntityById(this.selectedItems, entity) !== -1;
			},
			transformer: res => {
				this.resData = res.list || [];
				this.resListMerge(res.list, this.selectedItemsBuffer);
				if (this.isSingleSelected) {
					res.list.forEach(entity => {
						this.allShopGridOptions.radio.setting.push(entity.id);
					});
				} else {
					this.isSelectedPage = this.isSelectedPageAll();
				}
				return res;
			}
		};
	}

	prepareSelectedShopGridOptions() {
		this.selectedShopGridOptions = {
			queryParams: {
				pageNum: 1,  // 当前页码
				pageSize: 20 // 每页大小
			},
			columnsDef: [
				...commonGridColumnDef,
				{
					displayName: '操作',
					align: 'left',
					cellTemplate: '<span ng-click="$ctrl.removeItem(entity)">移除</span>'
				}
			],
			footerTpl: footerTemplate,
			emptyTipTpl: emptyTemplate,
			pager: {
				totals: 0,  // 总条数
				totalPages: 1,  // 总页数
				pageNum: 1,  // 当前页码
				pageSize: 20, // 每页大小
				pageSizeList: [10, 20, 30, 50],
				pageSizeListDisabled: false
			},
			selectedItems: this.selectedItems
		};
	}

	// 已选店铺 tab 刷新表格
	onRefresh(opts) {
		const wrapGridData = (currentPage, pageSize, data) => {
			this.selectedShopGridOptions.pager.pageNum = currentPage;
			this.selectedShopGridOptions.pager.pageSize = pageSize;
			this.selectedShopGridOptions.pager.totalPages = Math.ceil((data.length || 0) / pageSize);
			this.selectedShopGridOptions.externalData = data.slice(pageSize * (currentPage - 1), pageSize * currentPage);
			return this.selectedShopGridOptions;
		};
		const currentPage = opts.pager.pageNum;
		const pageSize = opts.pager.pageSize;
		const data = this.selectedItems;
		this._$ccGrid.refresh(wrapGridData(currentPage, pageSize, data));
	}

	// 获取去重后的 selectedItemsBuffer
	updateSelectedItemsBuffer(entity) {
		let targetIndex = findEntityById(this.selectedItemsBuffer, entity);
		if (targetIndex === -1 && entity.$selected) {
			this.selectedItemsBuffer.push(cloneDeep(entity));
		} else if (targetIndex !== -1 && !entity.$selected) {
			this.selectedItemsBuffer.splice(targetIndex, 1);
		}
	}

	// 获取去重后的 selectedItems
	updateSelectedItems(entity) {
		let targetIndex = findEntityById(this.selectedItems, entity);
		if (targetIndex === -1 && entity.$selected) {
			this.selectedItems.push(entity);
		} else if (targetIndex !== -1 && !entity.$selected) {
			this.selectedItems.splice(targetIndex, 1);
		}
	}

	resListMerge(resList = [], buffer = []) {
		buffer.forEach(entity => {
			let targetIndex = findEntityById(resList, entity);
			if (targetIndex !== -1) {
				resList[targetIndex].$selected = true;
			}
		});
	}

	// 全选当页
	switchSelectPage(isSelectedPage) {
		this.allShopGridOptions.data.forEach(entity => {
			entity.$selected = isSelectedPage;
			this.updateSelectedItems(entity);
			this.updateSelectedItemsBuffer(entity);
		});
	}

	// 之前的做法是将单选移除和多选移除分成两个函数分别在自定义的 cellTemplate 里面调用，但是多选的移除操作得不到 entity 的值，没有找到原因
	removeItem(entity) {
		// 移除 (单选)
		if (this.isSingleSelected) {
			this.allShopGridOptions.radio.value = null;
			this.selectedItems.splice(0, this.selectedItems.length);
			this.onRefresh(this.selectedShopGridOptions);
		} else {
			// 移除 (多选)
			entity.$selected = false;
			this.updateSelectedItems(entity);
			this.updateSelectedItemsBuffer(entity);
			this.onRefresh(this.selectedShopGridOptions);
			let targetIndex = findEntityById(this.allShopGridOptions.data, entity);
			if (targetIndex !== -1) {
				this.allShopGridOptions.data[targetIndex].$selected = false;
			}
		}
	};

	// 移除当页
	removePage() {
		this.selectedShopGridOptions.externalData.forEach(entity => {
			entity.$selected = false;
			this.updateSelectedItems(entity);
			this.updateSelectedItemsBuffer(entity);
			let targetIndex = findEntityById(this.allShopGridOptions.data, entity);
			if (targetIndex !== -1) {
				this.allShopGridOptions.data[targetIndex].$selected = false;
			}
		});
		this.onRefresh(this.selectedShopGridOptions);
	}

	// 移除全部
	removeAll() {
		this.selectedItems.splice(0, this.selectedItems.length);
		this.selectedItemsBuffer.splice(0, this.selectedItemsBuffer.length);
		this.allShopGridOptions.data.forEach(entity => { entity.$selected = false; });
		this.onRefresh(this.selectedShopGridOptions);
	}

	// 是否全部被选
	isSelectedPageAll() {
		if (this.resData.length) {
			return this.resData.every(item => {
				return item.$selected;
			});
		}
		return false;
	}

	// 切换 tab
	tabClick(text) {
		if (text === '已选店铺') {
			this.onRefresh(this.selectedShopGridOptions);
		} else {
			this.isSelectedPage = this.isSelectedPageAll();
		}
	}

	ok() {
		this._modalInstance.ok(this.selectedItems);
	}
}
