import angular from 'angular';
import { Inject } from 'angular-es-utils/decorators';
import cloneDeep from 'lodash.clonedeep';
import { commonGridColumnDef, apiPrefix, commonListFieldsMap, errorMsg, channelList } from './Constant';
import service from './service';
import utils from './utils';

import shopFormTemplate from './tpls/shop-form.tpl.html';
import rowTemplate from './tpls/row.tpl.html';
import rowCellTemplate from './tpls/row-cell.tpl.html';
import footerTemplate from './tpls/grid-footer.tpl.html';
import emptyTemplate from './tpls/empty.tpl.html';


/**
 * 从集合中获取entity的index,找不到返回-1
 */
function findEntityById(collection, id) {
	return collection.findIndex(item => angular.equals(item.id, id));
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

		this.initForm();
		this.initSelectedShopForm();
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

	// 已选店铺表单初始化
	initSelectedShopForm() {
		this.formMatchConfig = {
			channel: 'equal', // 渠道
			type: 'equal' // 店铺类型
		};
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
			switchSelectItem: entity => {
				this.updateSelectedItems(entity);
				this.isSelectedPage = this.isSelectedPageAll();
			},
			// 单选
			switchSingleSelectItem: entity => {
				this.allShopGridOptions.radio.value = entity.id;
				this.selectedItems.splice(0, this.selectedItems.length, entity);
			},
			isEntitySelected: entity => {
				return findEntityById(this.selectedItems, entity.id) !== -1;
			},
			transformer: res => {
				this.resData = res.list || [];
				this.getSelectedShop().then(() => {
					this.getNameByGridList(res.list);
					this.getNameByGridList(this.selectedItems);
					this.resListMerge(res.list, this.selectedItemsBuffer);
				}).catch(() => {});

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
		return service.getShopList(this.serverName, this.selectedShop, 'id').get().$promise.then(res => {
			res.list = res.list || [];
			res.list.forEach(entity => {
				if (this.isSingleSelected) {
					this.radio.value = entity.id;
				}
				entity.$selected = true;
				this.updateSelectedItems(entity);
			});
		}).catch(() => {
			this._$ccTips.error(errorMsg);
		});
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

	// 获取去重后的 selectedItems 并更新 selectedItemsBuffer
	updateSelectedItems(entity) {
		let targetIndex = findEntityById(this.selectedItems, entity.id);
		if (targetIndex === -1 && entity.$selected) {
			this.selectedItems.push(entity);
		} else if (targetIndex !== -1 && !entity.$selected) {
			this.selectedItems.splice(targetIndex, 1);
		}
		this.selectedItemsBuffer = cloneDeep(this.selectedItems);
	}

	resListMerge(resList = [], buffer = []) {
		buffer.forEach(entity => {
			let targetIndex = findEntityById(resList, entity.id);
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
			this.onRefresh(this.selectedShopGridOptions);
			let targetIndex = findEntityById(this.allShopGridOptions.data, entity.id);
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
			let targetIndex = findEntityById(this.allShopGridOptions.data, entity.id);
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
		const channel = this.formModel.channel;
		const province = this.formModel.province;
		const city = this.formModel.city;
		const expectList = ['type', 'city', 'district'];
		for (let attr in formModel) {
			if (formModel.hasOwnProperty(attr) && expectList.indexOf(attr) < 0) {
				this.formModel[attr] = cloneDeep(formModel[attr]);
			} else {
				this.formModel[attr] = null;
			}
		}
		// 处理级联菜单
		this.type = formModel.type;
		if (channel === formModel.channel) {
			this.formModel.type = this.type;
		}
		this.city = formModel.city;
		if (province === formModel.province) {
			this.formModel.city = this.city;
		}
		this.district = formModel.district;
		if (city === this.formModel.city) {
			this.formModel.district = this.district;
		}
	}

	// 获取地区数据
	getAreaData() {
		service.getAreaData(this.serverName, 'top').get(res => {
			this.provinceList = res || [];
			this.resolveDataList(this.provinceList);
		}, () => {
			this._$ccTips.error(errorMsg);
		});
	}

	// 获取渠道列表
	getChannelList() {
		this.channelList = this.resolveDataList(channelList);
	}

	ok() {
		this._modalInstance.ok(this.selectedItems);
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
		if (itemIndex > 0) {
			if (model !== oldModel) {
				this.formModel.type = this.type;
				this.type = null;
				this.typeList = item.shopTypes && item.shopTypes.length ? this.resolveDataList(item.shopTypes) : [];
			}
		} else {
			this.formModel.type = null;
			this.typeList = [];
		}
	}

	// 省份 select 框 change
	provinceSelectChange(model, oldModel, itemIndex, item) {
		if (itemIndex > 0) {
			if (model !== oldModel) {
				this.formModel.city = this.city;
				this.city = null;
				this.formModel.provinceName = item[this.commonListFieldsMap.displayField];
				this.cityList = item.children && item.children.length ? this.resolveDataList(item.children) : [];
			}
		} else {
			this.formModel.city = null;
			this.formModel.provinceName = null;
			this.cityList = [];
		}
	}

	// 城市 select 框 change
	citySelectChange(model, oldModel, itemIndex, item) {
		if (itemIndex > 0) {
			this.formModel.district = this.district;
			this.district = null;
			this.formModel.cityName = item[this.commonListFieldsMap.displayField];
			this.districtList = item.children && item.children.length ? this.resolveDataList(item.children) : [];
		} else {
			this.formModel.district = null;
			this.formModel.cityName = null;
			this.districtList = [];
		}
	}

	// 地区 select 框 change
	districtSelectChange(model, oldModel, itemIndex, item) {
		if (itemIndex > 0) {
			this.formModel.districtName = item[this.commonListFieldsMap.displayField];
		}
	}

	search() {
		if (this.isSelectedTab) {
			// 已选商品 tab 搜索 -> 前端搜索
			utils.match(this.formModel, this.selectedItems, this.formMatchConfig);
			this.onRefresh(this.selectedShopGridOptions);
		} else {
			// 全部商品 tab 搜索 -> 后端搜索
			this.getAllShopPagerQueryParams();
			this._$ccGrid.refresh(this.allShopGridOptions);
		}
	}

	// 获取表格查询参数
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

	// 获取渠道名称和店铺类型
	getNameByGridList(list) {
		list.forEach(entity => {
			const displayField = this.commonListFieldsMap.displayField;
			entity['channelName'] = this.channelList[findEntityById(this.channelList, entity.channel)][displayField];
			this.channelList.forEach(item => {
				let shopTypes = item.shopTypes;
				if (shopTypes && shopTypes.length) {
					let targetIndex = findEntityById(shopTypes, entity.type);
					if (targetIndex !== -1) {
						entity['typeName'] = shopTypes[targetIndex][displayField];
					}
				}
			});
		});
	}
}
