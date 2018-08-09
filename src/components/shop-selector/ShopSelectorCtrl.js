import angular from 'angular';
import { Inject } from 'angular-es-utils/decorators';
import cloneDeep from 'lodash.clonedeep';
import { commonGridColumnDef, apiPrefix, commonListFieldsMap, errorMsg } from './Constant';
import { areaData } from './tbAreas';
import service from './service';

import shopFormTemplate from './tpls/shop-form.tpl.html';
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

@Inject('$resource', '$ccGrid', 'isSingleSelected', 'modalInstance', '$ccTips', 'tenantId', 'serverName', 'selectedShop')
export default class ShopSelectorCtrl {
	constructor() {
		this.isSingleSelected = this._isSingleSelected; // 是否是单选
		this.tenantId = this._tenantId; // 租户 ID
		this.serverName = this._serverName;
		this.selectedShop = this._selectedShop; // 用户传进来的已选店铺列表

		this.selectedItems = [];
		this.selectedItemsBuffer = cloneDeep(this.selectedItems);
		this.radio = {
			value: this.selectedItems.length ? this.selectedItems[0].id : null,
			setting: [],
			disabled: false
		};

		this.getSelectedShop();
		this.initForm();
		this.prepareAllShopGridOptions();
		this.prepareSelectedShopGridOptions();
	}

	initForm() {
		this.shopFormTemplate = shopFormTemplate;

		this.formModel = {
			channel: null, // 渠道
			type: null, // 店铺类型
			sign: null, // 店铺名称
			province: null, // 省份
			provinceName: null,
			city: null, // 城市
			cityName: null,
			district: null, // 区
			districtName: null
		};
		this.allShopFormModel = cloneDeep(this.formModel);
		this.selectedShopFormModel = cloneDeep(this.formModel);

		this.validators = {
			shopName: {
				msg: '只能输入中文、英文、数字和符号(@、.、_、*、(、))',
				fn: (modelValue, viewValue) => {
					const value = modelValue || viewValue;
					return value ? (/^[0-9a-zA-Z\4E00-\u9FA5\@\.\_\*]/).test(value) : !value;
				}
			},
			maxLength: {
				msg: '最多允许输入100个字符',
				fn: (modelValue, viewValue) => {
					const value = modelValue || viewValue;
					return value ? value.length <= 100 : !value;
				}
			}
		};

		this.commonListFieldsMap = commonListFieldsMap;

		this.getChannelList();
		this.getAreaData();
	}

	prepareAllShopGridOptions() {
		this.allShopGridOptions = {
			resource: this._$resource(`${ apiPrefix }/shopDetails`),
			queryParams: {
				pageNum: 1,  // 当前页码
				pageSize: 20, // 每页大小
				tenantId: this.tenantId // 租户 ID
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
					align: 'center',
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

	// 获取已选店铺列表
	getSelectedShop() {
		service.getShopList(this.serverName, this.selectedShop, 'id').get(res => {
			res.list = res.list || [];
			res.list.forEach(entity => {
				if (this.isSingleSelected) {
					this.radio.value = entity.id;
				}
				entity.$selected = true;
				this.updateSelectedItems(entity);
				this.updateSelectedItemsBuffer(entity);
			});
		}, res => {});
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
		this.isSelectedTab = true;
		if (text === '已选店铺') {
			this.onRefresh(this.selectedShopGridOptions);
			this.allShopFormModel = cloneDeep(this.formModel);
			this.handleFormModel(this.selectedShopFormModel);
		} else {
			this.isSelectedTab = false;
			this.isSelectedPage = this.isSelectedPageAll();
			this.selectedShopFormModel = cloneDeep(this.formModel);
			this.handleFormModel(this.allShopFormModel);
		}
	}

	handleFormModel(formModel) {
		let expectList = ['type', 'city', 'district'];
		for (let attr in formModel) {
			if (formModel.hasOwnProperty(attr) && expectList.indexOf(attr) < 0) {
				this.formModel[attr] = cloneDeep(formModel[attr]);
			} else {
				this.formModel[attr] = null;
			}
		}
		this.type = formModel.type;
		this.city = formModel.city;
		this.district = formModel.district;
	}

	ok() {
		this._modalInstance.ok(this.selectedItems);
	}

	// 获取渠道列表
	getChannelList() {
		service.getChannelList(this.serverName).get(res => {
			this.channelList = this.resolveDataList(res);
			this.channelList.forEach(item => {
				if (item.shopTypes && item.shopTypes.length) {
					this.resolveDataList(item.shopTypes);
				}
			});
		}, res => {
			this._$ccTips.error(errorMsg);
		});
	}

	// 处理返回的数据
	resolveDataList(dataList = [], valueField = 'id', displayField = 'name') {
		if (dataList[0][valueField] !== null) {
			dataList.unshift({
				[valueField]: null,
				[displayField]: '不限'
			});
		}
		return dataList;
	}

	// 渠道 select 框 change
	channelSelectChange(model, oldModel, itemIndex, item) {
		if (itemIndex > 0 && item.shopTypes && item.shopTypes.length) {
			this.typeList = item.shopTypes;
			if (model !== oldModel) {
				this.formModel.type = this.type ? this.type : null;
				this.type = null;
			}
		} else {
			this.typeList = [];
			this.formModel.type = this.type ? this.type : null;
		}
	}

	// 获取地区数据
	getAreaData() {
		this.provinceList = this.resolveDataList(areaData);
	}

	// 省份 select 框 change
	provinceSelectChange(model, oldModel, itemIndex, item) {
		if (itemIndex > 0) {
			this.cityList = item.children && item.children.length ? this.resolveDataList(item.children) : [];
			if (model !== oldModel) {
				this.formModel.city = this.city ? this.city : null;
				this.city = null;
			}
			this.formModel.provinceName = item[this.commonListFieldsMap.displayField];
		} else {
			this.formModel.city = null;
			this.formModel.provinceName = null;
			this.cityList = [];
		}
	}

	// 城市 select 框 change
	citySelectChange(model, oldModel, itemIndex, item) {
		if (itemIndex > 0) {
			this.districtList = item.children && item.children.length ? this.resolveDataList(item.children) : [];
			if (model !== oldModel) {
				this.formModel.district = this.district ? this.district : null;
				this.district = null;
			}
			this.formModel.cityName = item[this.commonListFieldsMap.displayField];
		} else {
			this.formModel.district = null;
			this.formModel.cityName = null;
			this.districtList = [];
		}
	}

	districtSelectChange(model, oldModel, itemIndex, item) {
		if (itemIndex > 0) {
			this.formModel.districtName = item[this.commonListFieldsMap.displayField];
		} else {
			this.formModel.districtName = null;
		}
	}

	search() {
		console.log(this.formModel);
		if (this.isSelectedTab) {
			// 已选商品 tab 搜索 -> 前端搜索
		} else {
			// 全部商品 tab 搜索 -> 后端搜索
			this.getAllShopPagerQueryParams();
			this.updateAllShopGrid();
		}
	}

	getAllShopPagerQueryParams() {
		let collection = cloneDeep(this.formModel);
		let attrList = ['province', 'city', 'district'];
		for (let attr in collection) {
			if (collection.hasOwnProperty(attr) && attrList.indexOf(attr) >= 0) {
				collection[attr] = collection[`${attr}Name`];
				delete collection[`${attr}Name`];
			}
		}
		return Object.assign(this.allShopGridOptions.queryParams, collection);
	}

	updateAllShopGrid() {
		this._$ccGrid.refresh(this.allShopGridOptions);
	}
}
