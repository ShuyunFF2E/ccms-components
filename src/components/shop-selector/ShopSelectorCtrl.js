import angular from 'angular';
import { Inject } from 'angular-es-utils/decorators';
import cloneDeep from 'lodash.clonedeep';
import { getGridColumnDef, commonListFieldsMap, errorMsg, maxSelectNum, apiPrefix } from './Constant';
import service from './service';
import utils from './utils';

import rowCellTemplate from './tpls/row-cell.tpl.html';
import footerTemplate from './tpls/grid-footer.tpl.html';
import emptyTemplate from './tpls/empty.tpl.html';
import selectedRowTemplate from './tpls/selected-row.tpl.html';
import selectedRowCellTemplate from '../grid/tpls/default-row-cell.tpl.html';
import rowTemplateConfig from './RowTemplateConfig';


/**
 * 从集合中获取entity的index,找不到返回-1
 */
function findEntityById(collection, id) {
	return collection.findIndex(item => angular.equals(item.id, id));
}

@Inject('$resource', '$ccGrid', 'isSingleSelected', 'modalInstance', '$ccTips', 'tenantId', 'serverName', 'selectedShop', 'isSupportedChannel', 'platform', 'areaUrl', 'rowType', 'customRowConfig', 'customRowTemplate')
export default class ShopSelectorCtrl {
	constructor() {
		this.isSingleSelected = this._isSingleSelected; // 是否是单选
		this.tenantId = this._tenantId; // 租户 ID
		this.serverName = this._serverName;
		this.selectedShop = this._selectedShop; // 用户传进来的已选店铺列表
		this.isSupportedChannel = this._isSupportedChannel; // 是否支持平台
		this.platform = this._platform; // 用户传入的平台
		this.areaUrl = this._areaUrl;
		this.rowType = this._rowType;
		this.customRowConfig = this._customRowConfig;
		this.customRowTemplate = this._customRowTemplate; // 用户自定义行模板

		this.commonGridColumnDef = getGridColumnDef(this.isSupportedChannel);
		this.selectedItems = [];
		this.selectedItemsBuffer = cloneDeep(this.selectedItems);
		this.radio = {
			value: this.selectedItems.length ? this.selectedItems[0].id : null,
			setting: [],
			disabled: false
		};
		// 前搜索条件下的全部商品
		this.allGoodsList = [];

		this.initForm();
		this.prepareAllShopGridOptions();
		this.prepareSelectedShopGridOptions();
		if (this.selectedShop.length) {
			this.getSelectedShop().then(() => {
				this.getAllGoodsList();
			});
		} else {
			this.getAllGoodsList();
		}
	}

	// 获取当前搜索条件下的全部商品, 每次进行搜索时更新全部商品
	getAllGoodsList() {
		// 获取全部商品，更新全部全选状态
		this.isShowMask = true;
		const { serverName, tenantId, allShopGridOptions, formModel } = this;
		const { queryParams } = allShopGridOptions;
		service.getShopListAll({ serverName, tenantId, queryParams, formModel }).get(res => {
			const { list } = res;
			if (list && list.length) {
				this.allGoodsList = list.filter(entity => {
					const targetIndex = findEntityById(this.customRowConfig, entity.id);
					if (targetIndex !== -1) {
						Object.assign(entity, { isDisableChecked: this.rowType === 'DISABLED_ROW' }, this.customRowConfig[targetIndex]);
					}
					return entity;
				});
			}
			this.isSelectedAllPage = this.allGoodsList.length < maxSelectNum && this.isAllEntitySelected(this.allGoodsList, this.selectedItems);
			this.isShowMask = false;
		}, () => {
			this._$ccTips.error(errorMsg);
			this.isShowMask = false;
		});
	}

	// 是否所有商品都被选中
	isAllEntitySelected(allGoodsList = [], selectedItems = []) {
		return selectedItems.length && allGoodsList.every(entity => {
			return findEntityById(selectedItems, entity.id) !== -1 || entity.isDisableChecked;
		});
	}

	initForm() {
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

		this.validators = {
			maxLength: {
				msg: '最多允许输入100个字符',
				fn: (modelValue, viewValue) => {
					const value = modelValue || viewValue;
					return value ? value.length <= 100 : !value;
				}
			}
		};

		this.commonListFieldsMap = commonListFieldsMap;

		// 如果不显示平台，则不发请求，也不显示店铺类型，如果显示平台并且由用户传入，则发请求，然后过滤店铺
		if (this.isSupportedChannel) {
			this.getChannelList({ platform: this.platform }).then(channelList => {
				this.channelList = channelList;
				this.formModel.channel = channelList[0][this.commonListFieldsMap.valueField];
				this.resData && this.resData.length && this.getNameByGridList(this.resData, this.channelList);
				this.selectedItems.length && this.getNameByGridList(this.selectedItems, this.channelList);

				this.allShopFormModel = cloneDeep(this.formModel);
				this.selectedShopFormModel = cloneDeep(this.formModel);
			});
		}
	}

	prepareAllShopGridOptions() {
		this.allShopGridOptions = {
			resource: this._$resource(`${ this.serverName }${ apiPrefix }/shopDetails`),
			queryParams: {
				pageNum: 1,  // 当前页码
				pageSize: 20, // 每页大小
				tenantId: this.tenantId, // 租户 ID
				channel: this.platform ? this.platform.join(',') : null // 平台
			},
			columnsDef: this.commonGridColumnDef,
			rowType: this.rowType,
			rowTpl: this.customRowTemplate || rowTemplateConfig[this.rowType],
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
				if (!entity.isDisableChecked) {
					entity.$selected = !entity.$selected;
					this.updateSelectedItems(entity);
					this.isSelectedPage = this.isSelectedPageAll(this.resData);
					if (entity.$selected) {
						this.isSelectedAllPage = this.isAllEntitySelected(this.allGoodsList, this.selectedItems);
					} else {
						this.isSelectedAllPage = false;
					}
				}
				entity.callback && entity.callback(entity);
			},
			// 单选
			switchSingleSelectItem: entity => {
				if (!entity.isDisableChecked) {
					this.allShopGridOptions.radio.value = entity.id;
					this.selectedItems.splice(0, this.selectedItems.length, entity);
				}
				entity.callback && entity.callback(entity);
			},
			transformer: res => {
				res.list = res.list || [];
				this.resData = res.list;
				this.getNameByGridList(res.list, this.channelList);
				this.resListMerge(res.list, this.selectedItemsBuffer, this.customRowConfig);
				if (this.isSingleSelected) {
					res.list.forEach(entity => {
						this.allShopGridOptions.radio.setting.push(entity.id);
					});
				} else {
					this.isSelectedPage = this.isSelectedPageAll(this.resData);
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
				...this.commonGridColumnDef,
				{
					displayName: '操作',
					align: 'center',
					cellTemplate: '<span ng-click="$ctrl.removeItem(entity)">移除</span>'
				}
			],
			rowTpl: selectedRowTemplate,
			rowCellTemplate: selectedRowCellTemplate,
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
		return service.getShopList(this.serverName, this.tenantId, this.selectedShop, 'shopIdIn').get().$promise.then(res => {
			res.list = res.list || [];
			this.getNameByGridList(res.list, this.channelList);
			res.list.forEach(entity => {
				if (this.isSingleSelected) {
					this.radio.value = entity.id;
				}
				entity.$selected = true;
				this.updateSelectedItems(entity);
			});
			if (this.resData && this.resData.length) {
				this.resListMerge(this.resData, this.selectedItemsBuffer, this.customRowConfig);
			}
		}).catch(() => {
			this._$ccTips.error(errorMsg);
		});
	}

	// 获取渠道名称和店铺类型
	getNameByGridList(list, channelList) {
		list.forEach(entity => {
			const displayField = this.commonListFieldsMap.displayField;
			if (channelList && channelList.length) {
				const index = findEntityById(channelList, entity.channel);
				if (index !== -1) {
					entity['channelName'] = channelList[index][displayField];
					channelList.forEach(item => {
						let shopTypes = item.shopTypes;
						if (shopTypes && shopTypes.length) {
							let targetIndex = findEntityById(shopTypes, String(entity.type));
							if (targetIndex !== -1) {
								entity['typeName'] = shopTypes[targetIndex][displayField];
							}
						}
					});
				}
			}
		});
	}

	// 已选店铺 tab 刷新表格
	onRefresh(opts) {
		const wrapGridData = (pageNum, pageSize, data) => {
			Object.assign(this.selectedShopGridOptions, {
				pager: {
					pageNum,
					pageSize,
					totalPages: Math.ceil((data.length || 0) / pageSize)
				},
				externalData: data.slice(pageSize * (pageNum - 1), pageSize * pageNum)
			});
			return this.selectedShopGridOptions;
		};
		const { pageNum, pageSize } = opts.pager;
		const data = this.selectedItems.filter(entity => {
			if (!entity.isHide) {
				return entity;
			}
		});
		this._$ccGrid.refresh(wrapGridData(pageNum, pageSize, data));
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

	// merge 数据，维持商品的状态（是否被选中 是否不可操作）
	resListMerge(resList = [], buffer = [], customRowConfig = []) {
		resList.forEach((entity, index) => {
			if (findEntityById(buffer, entity.id) !== -1) {
				resList[index].$selected = true;
			}
			const targetIndex = findEntityById(customRowConfig, entity.id);
			if (targetIndex !== -1) {
				Object.assign(resList[index], { isDisableChecked: this.rowType === 'DISABLED_ROW' }, this.customRowConfig[targetIndex]);
			}
		});
	}

	// 全选当页
	switchSelectPage(isSelectedPage) {
		const { data } = this.allShopGridOptions;
		data && data.length && data.forEach(entity => {
			if (!entity.isDisableChecked) {
				entity.$selected = isSelectedPage;
				this.updateSelectedItems(entity);
			}
		});
		if (isSelectedPage) {
			this.isSelectedAllPage = this.isAllEntitySelected(this.allGoodsList, this.selectedItems);
		} else {
			this.isSelectedAllPage = false;
		}
	}

	// 点击全部全选前
	clickSelectAllPageBefore(event) {
		const target = event.target;
		const targetScope = angular.element(target).scope();
		if (target.classList.contains('cc-checkbox-input') && !targetScope.$ctrl.ngChecked || target.parentNode.parentNode.parentNode.classList.contains('check-all') && !targetScope.$parent.$ctrl.ngChecked) {
			if (this.allGoodsList.length > maxSelectNum) {
				event.stopPropagation();
				this._$ccTips.error(`最多允许选择${maxSelectNum}数据`);
			}
		}
	}

	// 全选全部，更新selectedItems，全部商品只更新当页商品状态
	switchSelectAllPage(isSelectedAllPage) {
		this.isSelectedPage = isSelectedAllPage;
		this.updateCurrentItems(isSelectedAllPage);
		this.allGoodsList.forEach(entity => {
			if (!entity.isDisableChecked) {
				entity.$selected = isSelectedAllPage;
				this.updateSelectedItems(entity);
			}
		});
	}

	// 更新当页数据状态
	updateCurrentItems(isSelectedAllPage) {
		const { resData } = this;
		resData && resData.length && resData.forEach(entity => {
			!entity.isDisableChecked && (entity.$selected = isSelectedAllPage);
		});
	}

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
			this.resetShopStatus(entity);
			this.isSelectedAllPage = this.isAllEntitySelected(this.allGoodsList, this.selectedItems);
		}
	};

	// 移除当页
	removePage() {
		this.selectedShopGridOptions.externalData.forEach(entity => {
			entity.$selected = false;
			this.updateSelectedItems(entity);
			this.resetShopStatus(entity);
		});
		this.onRefresh(this.selectedShopGridOptions);
		this.isSelectedAllPage = this.isAllEntitySelected(this.allGoodsList, this.selectedItems);
	}

	// 重置店铺列表中被移除的店铺状态
	resetShopStatus(entity) {
		let targetIndex = findEntityById(this.allShopGridOptions.data, entity.id);
		if (targetIndex !== -1) {
			this.allShopGridOptions.data[targetIndex].$selected = false;
		}
	}

	// 移除全部
	removeAll() {
		this.selectedItems.splice(0, this.selectedItems.length);
		this.selectedItemsBuffer.splice(0, this.selectedItemsBuffer.length);
		const { data } = this.allShopGridOptions;
		data && data.length && data.forEach(entity => { entity.$selected = false; });
		this.onRefresh(this.selectedShopGridOptions);
		this.isSelectedAllPage = false;
	}

	// 是否全部被选
	isSelectedPageAll(list = []) {
		if (list.length) {
			return list.every(item => {
				return item.$selected || item.isDisableChecked;
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
			this.isSelectedPage = this.isSelectedPageAll(this.resData);
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
		} else if (formModel.channel === 'offline') {
			this.provinceList = this._provinceList;
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
		return service.getAreaData(this.areaUrl).get().$promise.then(res => {
			this._provinceList = res || [];
		}).catch(() => {
			this._$ccTips.error(errorMsg);
		});
	}

	// 获取渠道列表，如果平台从外部传入，需要进行过滤
	getChannelList({ platform }) {
		return new Promise((resolve, reject) => {
			service.getChannelList(this.serverName).get().$promise.then(res => {
				let channelList = res || [];
				if (platform) {
					if (platform.length === 1) {
						// 传入一个平台，则只显示当前平台
						channelList = this.filterPlatform(res, platform);
					} else {
						// 传入多个平台，则显示多个，默认'不限'
						channelList = this.resolveDataList(this.filterPlatform(res, platform));
					}
				} else {
					// 用户不传入平台，显示所有平台，默认'不限'
					channelList = this.resolveDataList(res);
				}
				resolve(channelList);
			}).catch(err => {
				this._$ccTips.error(errorMsg);
				reject(err);
			});
		});
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

	// 过滤平台数据，返回用户传入平台id对应的平台列表
	filterPlatform(channelList, platform) {
		let result = [];
		platform.forEach(platId => {
			const targetIndex = findEntityById(channelList, platId);
			if (targetIndex !== -1) {
				result.push(channelList[targetIndex]);
			}
		});
		return result;
	}

	// 渠道 select 框 change
	channelSelectChange(model, oldModel, itemIndex, item) {
		if (itemIndex > 0) {
			if (model !== oldModel) {
				this.formModel.type = this.type || null;
				this.type = null;
			}
		} else {
			this.formModel.type = null;
		}
		this.typeList = item.shopTypes && item.shopTypes.length ? this.resolveDataList(item.shopTypes) : [];
		if (model === 'offline') {
			if (this._provinceList) {
				this.provinceList = this._provinceList;
			} else {
				this.getAreaData().then(() => {
					this.provinceList = this._provinceList;
				});
			}
		} else {
			this.provinceList = [];
		}
	}

	// 省份 select 框 change
	provinceSelectChange(model, oldModel, itemIndex, item) {
		if (itemIndex >= 0) {
			if (model !== oldModel) {
				this.formModel.city = this.city;
				this.city = null;
				this.formModel.provinceName = item[this.commonListFieldsMap.displayField];
				this.cityList = item.children && item.children.length ? item.children : [];
			}
		} else {
			this.formModel.city = null;
			this.formModel.provinceName = null;
			this.cityList = [];
		}
	}

	// 城市 select 框 change
	citySelectChange(model, oldModel, itemIndex, item) {
		if (itemIndex >= 0) {
			this.formModel.district = this.district;
			this.district = null;
			this.formModel.cityName = item[this.commonListFieldsMap.displayField];
			this.districtList = item.children && item.children.length ? item.children : [];
		} else {
			this.formModel.district = null;
			this.formModel.cityName = null;
			this.districtList = [];
		}
	}

	// 地区 select 框 change
	districtSelectChange(model, oldModel, itemIndex, item) {
		if (itemIndex >= 0) {
			this.formModel.districtName = item[this.commonListFieldsMap.displayField];
		}
	}

	search() {
		if (this.isSelectedTab) {
			// 已选商品 tab 搜索 -> 前端搜索
			utils.match(this.formModel, this.selectedItems);
			this.onRefresh(this.selectedShopGridOptions);
		} else {
			// 全部商品 tab 搜索 -> 后端搜索
			this.getAllShopPagerQueryParams();
			this._$ccGrid.refresh(this.allShopGridOptions);
			this.getAllGoodsList();
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
		collection.pageNum = 1;
		Object.assign(this.allShopGridOptions.queryParams, collection);
		// 如果平台由外部传入，那么平台选择'不限'的时候，参数为外部传入的所有平台
		const { channel } = this.formModel;
		if (this.platform && this.platform.length) {
			this.allShopGridOptions.queryParams['channel'] = channel || this.platform.join(',');
		} else {
			this.allShopGridOptions.queryParams['channel'] = channel;
		}
	}

	// 重置
	reset() {
		for (let attr in this.formModel) {
			if (this.formModel.hasOwnProperty(attr)) {
				// 如果平台由外部传入，且只有一个平台，则重置平台为该平台
				if (attr === 'channel' && this.platform && this.platform.length === 1) {
					this.formModel.channel = this.platform[0];
				} else {
					this.formModel[attr] = null;
				}
			}
		}
	}
}
