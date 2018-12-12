import angular from 'angular';
import { Inject } from 'angular-es-utils/decorators';
import cloneDeep from 'lodash.clonedeep';

import rowCellTemplate from './tpls/customer-row-cell.tpl.html';
import skuRowCellTemplate from './tpls/customer-sku-row-cell.tpl.html';
import emptyTpl from './tpls/customer-empty.tpl.html';
import selectedEmptyTpl from './tpls/customer-selected-empty.tpl.html';
import bodyTemplate from './addSection/customer-modal-body.tpl.html';
import headerTemplate from './tpls/customer-header.tpl.html';
import footerTemplate from './tpls/customer-footer.tpl.html';
import rowTemplate from './tpls/customer-row.tpl.html';
import formTpl from './tpls/form-template.tpl.html';

import matchHelper from './MatchHelper';
import sectionAddCtrl from './addSection/SectionAddCtrl';
import { apiPrefix, uniApiPrefix, getExceedSelectedNumberMsg, onceMaxSelectedNumber, getNotFoundMsg, statusList,
	getFieldsMap, exceedSelectedAllNumberMsg, getFormConfig, errorMsg, getBatchImportMsg, fieldsetConfig } from './constant';
import { utils } from './utils';
import { getFormTemplateConfig } from './formItemConfig';
import service from './service';


@Inject('$ccTips', '$element', 'modalInstance', 'selectedData', 'maxSelectedNumber', 'serverName', '$q',
	'shopInfoData', '$ccValidator', '$resource', '$scope', '$ccGrid', '$ccModal', '$ccGoodsSelector', '$filter', '$sce', '$compile',
	'isSupportedSku', '$labelChoose', 'isSupportedAddCondition', 'isSupportedTag', 'tenantId', 'conditions', 'isSingleSelect',
	'isSingleSelectShopList', '$ccShopSelector', 'isSupportedBatchAddition', 'isTotalChannel')

export default class GoodsSelectorCtrl {

	$onInit() {
		this.showLoading = true;
		this.formTpl = formTpl;
		// 是否是全渠道
		this.isTotalChannel = this._isTotalChannel;
		this.apiPrefix = this.isTotalChannel ? uniApiPrefix : apiPrefix;
		// 是否是单选
		this.isSingleSelect = this._isSingleSelect;
		// 单选按钮配置
		this.radio = {
			value: null,
			setting: [],
			disabled: false
		};
		// 已选的商品标签
		this.selectedLabels = [];
		this.selectedLabelsOfAll = [];
		this.selectedLabelsOfSelected = [];
		// 商品维度选择（是否支持显示sku）
		this.isSupportedSku = this._isSupportedSku;
		// 是否支持商品标签
		this.isSupportedTag = this._isSupportedTag;
		// 租户ID -> 查询商品标签参数
		this.tenantId = this.isTotalChannel ? this._tenantId : null;
		// 是否支持添加为搜索条件
		this.isSupportedAddCondition = this._isSupportedAddCondition;
		// 搜索条件
		this.conditions = cloneDeep(this._conditions);
		this.conditionsModel = cloneDeep(this._conditions);

		this.isShowMaskOfLoading = this.isSupportedAddCondition && this._conditions && JSON.stringify(this._conditions) !== '{}';

		// 店铺是否是单选
		this.isSingleSelectShopList = this._isSingleSelectShopList;
		// 用户传进来的店铺信息
		this.shopInfoData = this._shopInfoData;
		// 用户传进来的已选商品数组
		this.selectedData = this._selectedData;
		this.serverName = this._serverName;
		// 是否支持批量导入
		this.isSupportedBatchAddition = this._isSupportedBatchAddition;
		// 批量导入和搜索是本质上都是根据条件对表格数据进行筛选，但是却是两个不相关的操作，把它们看成两个开关，不同的开关对应不同的API，其下的分页操作分别使用对应的API
		this.gridPrefixApi = `${this.serverName}${this.apiPrefix}/items`;

		// 店铺信息 -> 如果是 array 或者店铺多选, 说明需要显示店铺列表
		//         -> 如果是 object并且不是店铺多选, 说明是单店铺
		//         -> 其它情况, 需要提示用户, 参数格式不正确
		this.isShowShopList = Array.isArray(this.shopInfoData);
		// 店铺列表
		this.shopList = this.isShowShopList ? this.shopInfoData : [this.shopInfoData];
		this.shopList.map(item => { item.shopId = String(item.shopId); return item; });
		this.isTaobao = this.shopList[0].plat === 'top' || this.shopList[0].plat === 'uni_top';
		this.isQiake = this.shopList[0].plat === 'offline';

		// 获取已选店铺 ID 数组
		this.selectedShopIdList = this.getSelectedShopIdList();

		// 商品状态
		this.statusList = statusList;

		const { shopListFieldsMap, categoriesFieldsMap, propsVidFieldsMap, statusListFieldsMap, brandsListFieldsMap } = getFieldsMap();
		this.shopListFieldsMap = shopListFieldsMap;
		this.shopCategoriesFieldsMap = this.categoriesFieldsMap = this.propsPidFieldsMap = categoriesFieldsMap;
		this.propsVidFieldsMap = propsVidFieldsMap;
		this.statusListFieldsMap = statusListFieldsMap;
		this.brandsListFieldsMap = brandsListFieldsMap;

		// form 区域价格校验
		this.validators = {
			// 价格校验 -> 只能输入数字或两位小数 && 前一个数字小于或者等于后一个数字
			price: {
				msg: '价格只能填写正数或两位小数.',
				fn: (modelValue, viewValue) => {
					const value = modelValue || viewValue;
					return value ? (/^[0-9]+([.][0-9]{0,2}){0,1}$/).test(value) : !value;
				}
			},
			lowPrice: {
				msg: '价格前项值必须小于后项值',
				fn: (modelValue, viewValue) => {
					const value = modelValue || viewValue;
					const l = parseFloat(value);
					const h = parseFloat(this.formModel.maxPrice);
					if (!isNaN(l) && !isNaN(h)) {
						return l < h;
					}
					return true;
				}
			},
			highPrice: {
				msg: '价格后项值必须大于前项值',
				fn: (modelValue, viewValue) => {
					const value = modelValue || viewValue;
					const l = parseFloat(this.formModel.minPrice);
					const h = parseFloat(value);
					if (!isNaN(l) && !isNaN(h)) {
						return l < h;
					}
					return true;
				}
			},
			// 数字校验
			number: {
				msg: '请输入整数',
				fn: (modelValue, viewValue) => {
					const value = modelValue || viewValue;
					return value ? (/(^\s*$)|(^\d+$)/).test(value) : !value;
				}
			}
		};

		let formConfigGroup = getFormConfig();
		this.formConfig = formConfigGroup.formConfig; // 已选商品 form 表单搜索配置项（前端搜索）
		this.skuFormConfig = formConfigGroup.skuFormConfig; // 已选商品 form 表单sku相关搜索配置项（前端搜索）

		// 当前平台对应的 form 表单项列表
		this.fieldsetConfigList = this.isTotalChannel ? fieldsetConfig['uni'] : fieldsetConfig[this.shopList[0].plat];

		this.initForm();

		const params = {
			isSupportedSku: this.isSupportedSku,
			isShowShopList: this.isShowShopList,
			isSupportedTag: this.isSupportedTag,
			isShowToggleSearchBtn: !this.isShowShopList && !this.isSupportedAddCondition
		};
		// 模板配置信息（模板项的显示隐藏、模板title文本）
		this.formTplConfig = getFormTemplateConfig(this.fieldsetConfigList, this.formModel, params);

		const { fieldsetConfigList } = this;
		let asyncMethods = [];
		// 获取商品标签数据并对selectedLabels进行初始化
		this.findEntityByName(fieldsetConfigList, 'tagItemIds') >= 0 && this.isSupportedAddCondition && asyncMethods.push(this.getTags());
		// 商品自自定义类目数据
		this.findEntityByName(fieldsetConfigList, 'shopCategoriesId') >= 0 && asyncMethods.push(this.getShopCategories());
		// 获取商品品牌
		this.findEntityByName(fieldsetConfigList, 'brandId') >= 0 && asyncMethods.push(this.getBrands());
		// 商品标准类目列表
		this.findEntityByName(fieldsetConfigList, 'categoriesId') >= 0 && asyncMethods.push(this.getCategories());

		this._$q.all(asyncMethods).then(res => {
			if (res.every(item => item)) {
				this.isShowMaskOfLoading = false;
			}
		});

		this.initCheckedAllStatus();
		this.initSelectedItems();
		this.preparePagerGridOptions();
		this.prepareSelectedPagerGridOptions();
	}

	// 初始化全部全选 checkbox 的状态
	initCheckedAllStatus() {
		service.getSelectedItemsAll(this.serverName, this.shopList[0].plat, this.selectedShopIdList, this.apiPrefix, this.tenantId).get().$promise.then(res => {
			const data = res.data || [];
			const idArr = Object.keys(this.selectedData);
			this.isCheckedAll = data.length && data.every(item => {
				return idArr.findIndex(id => angular.equals(id, item.id)) >= 0;
			});
			if (this.isCheckedAll) {
				this.data = data;
			}
		});
	}

	// 获取已选店铺 ID 数组
	getSelectedShopIdList() {
		let selectedShopIdList = [];
		if (!this.isSingleSelectShopList) {
			if (this.isSupportedAddCondition && this.conditions.shopId) {
				selectedShopIdList = String(this.conditions.shopId).split(',').map(item => item.replace(/^\s+|\s+$/g, ''));
			} else {
				selectedShopIdList = this.shopList.map(item => String(item.shopId));
			}
		} else {
			if (this.isSupportedAddCondition && this.conditions.shopId && this.conditions.shopId !== 'undefined') {
				selectedShopIdList = [String(this.conditions.shopId)];
			} else {
				selectedShopIdList = [String(this.shopList[0].shopId)];
			}
		}
		return selectedShopIdList;
	}
	// 更新已选商品数组

	updateSelectedItems(entity) {
		let targetIndex = this.findEntity(this.selectedItems, entity);
		if (entity.checked || entity.partial) {
			if (targetIndex !== -1) {
				this.selectedItems.splice(targetIndex, 1, entity);
			} else {
				this.selectedItems.push(entity);
			}
		} else {
			if (targetIndex !== -1) {
				this.selectedItems.splice(targetIndex, 1);
			}
		}
	}

	// 更新 selectedItems 的副本 selectedItemsBuffer
	updateSelectedItemsBuffer() {
		this.selectedItemsBuffer = cloneDeep(this.selectedItems);
	}

	// form 表单初始化
	initForm() {
		let c = this.conditions; // 用户传进来的搜索条件
		// 日期组件的特殊性
		this.dateRange = {
			start: c.startListTime ? c.startListTime : null,
			end: c.endListTime ? c.endListTime : null,
			minDate: null,
			maxDate: new Date(),
			disabled: false,
			dateOnly: true
		};
		const formModel = {
			shopId: this.isSingleSelectShopList ? this.selectedShopIdList[0] : this.selectedShopIdList, // 店铺
			id: c.id || [], // 商品ID 数组
			name: c.name || null, // 商品名称 模糊匹配
			shopCategoriesId: c.shopCategoriesId || [], // shopCategories.id 自定义类目 数组
			categoriesId: c.categoriesId || null, // categories.id 标准类目
			propsPid: c.propsPid || null, // props.pid 商品属性 ID
			propsVid: c.propsVid || null, // props.vid 商品属性值 ID
			propsVname: c.propsVid ? null : c.propsVname, // props.vname 商品属性值对应的属性名称
			status: c.status ? String(c.status) : this.statusList[0].value, // 状态, 1 在架, 0 不在架， -1 不限
			skusPropsVname: c.skusPropsVname || null, // skus.props.vname SKU属性值 模糊匹配
			outerId: c.outerId || null, // 商品商家编码
			skusOuterId: c.skusOuterId || null, // skus.outerId SKU 商家编码
			skusId: c.skusId || [], // skus.id SKUID 数组
			startListTime: this.dateRange.start, // 上架时间起始值, Unix时间戳，毫秒
			endListTime: this.dateRange.end, // 上架时间结束值, Unix时间戳，毫秒
			minPrice: c.minPrice || null, // 商品价格下限
			maxPrice: c.maxPrice || null, // 商品价格下限,
			tagItemIds: [], // 商品标签 数组
			brandId: c.brandId || null // 品牌
		};
		// 初始化 tagItemIds
		if (c.tags && c.tags.length) {
			let ids = this.getTagItemIds(c.tags);
			formModel.tagItemIds = matchHelper.removeArrayDuplicate(ids);
		}
		this.formModel = Object.assign(utils.resolveFormModel(this.fieldsetConfigList, formModel, this.shopList[0].plat, this.isSupportedSku), {
			platform: c.plat ? c.plat : this.shopList[0].plat // 平台
		});

		this.formModelCopy = cloneDeep(this.formModel);
		this.allGoodsFormModel = {};
		this.selectedDateRangeModel = cloneDeep(this.dateRange);
		this.selectedGoodsFormModel = cloneDeep(this.formModel);
		// 将已选商品 form 表单恢复初始状态 —> 在初始化表单的时候由于已经存在的搜索条件，导致 form 表单项被赋值
		this.reset(this.selectedGoodsFormModel, this.selectedDateRangeModel);

		this.propsPid = this.formModel.propsPid;
		this.propsVid = this.formModel.propsVid;
		this.propsVname = this.formModel.propsVname;

		this.checkAllQueryParams = {
			shopId: this.formModel.shopId,
			platform: this.formModel.platform
		};
	}

	findEntityByName(collection, name) {
		return collection.findIndex(item => angular.equals(item.name, name));
	}
	// 初始化 selectedItems 和 selectedItemsBuffer
	initSelectedItems() {
		this.selectedItems = [];
		// selectedItemsBuffer 保存 selectedItems 中数据的副本（深拷贝）。维护 selectedItems 中数据状态。
		// 用作返回上一页时进行数据 merge，保持全部商品 tab 和已选商品 tab 的商品状态（checked/unchecked/partial、extend）一致。
		this.selectedItemsBuffer = [];

		// 用户传进来的已选商品处理
		const shopIdList = this.shopList.map(item => item.shopId);
		const goodsDataParams = {
			shopId: shopIdList,
			plat: this.shopList[0].plat,
			selectedGoods: this.selectedData,
			serverName: this.serverName,
			isSupportedSku: this.isSupportedSku,
			apiPrefix: this.apiPrefix,
			tenantId: this.tenantId
		};
		utils.transformGoodsData(goodsDataParams).then(data => {
			if (data && data.length) {
				data.forEach(entity => {
					this.updateSelectedItems(entity);
					this.updateSelectedItemsBuffer();
					if (this.isSingleSelect) {
						this.radio.value = entity.id;
					}
				});
				this.updateAllGoodsGrid();
			}
		});
	}

	// 全部商品表格配置
	preparePagerGridOptions() {
		// 全部商品表格配置
		this.pagerGridOptions = {
			resource: this._$resource(`${this.serverName}${this.apiPrefix}/items`, null, {
				get: {
					method: 'POST'
				}
			}),
			response: null,
			queryParams: {
				shopId: this.formModel.shopId,
				platform: this.formModel.platform,
				tenantId: this.tenantId,
				pageSize: this.isQiake ? 50 : 15,
				pageNum: 1
			},
			pager: {
				pageSizeList: [10, 15, 20, 25, 50]
			},
			columnsDef: [
				{
					field: 'id',
					displayName: !this.isSupportedSku ? '商品ID' : (this.isTaobao ? '商品ID/SKU ID' : '商品ID/商品编号'),
					align: 'left'
				}
			],
			headerTpl: headerTemplate,
			rowTpl: rowTemplate,
			footerTpl: footerTemplate,
			emptyTipTpl: emptyTpl,
			rowCellTemplate: rowCellTemplate,
			skuRowCellTemplate: skuRowCellTemplate,
			selectedData: this.selectedItems,
			resInfo: this.resInfo,
			formModel: this.formModel,
			isQiake: this.isQiake,
			conditionLength: this.isSupportedAddCondition ? this.getConditionsLength(this.formModel) : 0, // 已选条件数量
			postData: {},
			radio: this.radio,
			isSingleSelect: this.isSingleSelect,
			isSingleSelectShopList: this.isSingleSelectShopList,
			getSkuName: utils.getSkuName, // 获取 sku 标题，后端返回的是数组，需要前端自行拼接
			lightText: utils.lightText, // 高亮显示搜索关键字
			getPrice: utils.getPrice, // 价格保留两位小数
			listCharacterIntercept: utils.listCharacterIntercept // 超过 maxLength 个字则隐藏多余字，显示 '...'
		};

		// 对请求回来的表格数据进行处理
		this.pagerGridOptions.transformer = res => {
			if (res.flag === 'fail' && res.msg === 'Result window is too large, window size must be less than or equal to: [10000]') {
				this._$ccTips.error('<span class="sd-max-number-error-msg"></span>');
				let warnMsg = this._$compile('<span>出错提示：最多允许查询10000条商品数据, 请刷新表格。&nbsp;</span><span style="color: #0083ba; cursor: pointer" ng-click="$ctrl.refreshAllGoodsGrid()">刷新</span>')(this._$scope);
				let tipsArr = document.querySelectorAll('.float-tips-container .float-tips .message .sd-max-number-error-msg');
				tipsArr.forEach(item => {
					angular.element(item).parent().empty().append(warnMsg);
				});
			}
			res['list'] = res['data'] && res.flag !== 'fail' ? res['data'] : [];
			delete res['data'];
			res['totals'] = res['totalCount'] ? res['totalCount'] : [];
			delete res['totalCount'];

			if (res.list && res.list.length) {
				if (!this.isSingleSelect) {
					// 批量添加，返回值全部被 checked
					if (this.isAddSection) {
						res.list.forEach(entity => {
							this.checkRootItem(entity);
							this.updateSelectedItems(entity);
						});
						this.updateSelectedItemsBuffer();
					}
					this.dataMerge(res.list, this.selectedItemsBuffer);
					this.currentPageChecked = utils.isAllChildrenSelected(res.list);
					res.list.forEach(entity => {
						entity.extend = this.allGoodsSkuSearch || this.isAddSectionExtend;
						if (!this.isSupportedSku && entity.skus && entity.skus.length) {
							delete entity.skus;
						}
					});
					this.isExtendAll = utils.isAllChildrenExtend(res.list);
				} else {
					res.list.forEach(entity => {
						this.pagerGridOptions.radio.setting.push(entity.id);
					});
				}
			}
			this.resInfo = res;
			return res;
		};

		// 表格子行的展开和收起
		this.pagerGridOptions.handleTreeIcon = entity => {
			entity.extend = !entity.extend;
			this.isSelectedGoodsTab ? this.isSelectedExtendAll = utils.isAllChildrenExtend(this.selectedItems) : utils.isAllChildrenExtend(this.resInfo.list);
			this.wakeupScroll();
		};

		// checked 父亲, 所有孩子 checked, 反之 unchecked 父亲, 所有孩子 unchecked
		this.pagerGridOptions.selectTreeRootItem = entity => {
			entity.checked = !entity.checked;
			entity.partial = false;
			entity.skus && entity.skus.forEach(item => {
				item.checked = entity.checked;
			});
			this.currentPageChecked = utils.isAllChildrenSelected(this.resInfo.list);
			!entity.checked && (this.isCheckedAll = false);

			this.updateSelectedItems(entity);
			this.updateSelectedItemsBuffer();
		};

		// 孩子中的一部分 checked, 父亲半选 partial，全部孩子 checked, 父亲 checked
		this.pagerGridOptions.selectTreeLeafItem = (entity, sku) => {
			sku.checked = !sku.checked;
			entity.checked = utils.isAllChildrenSelected(entity.skus);
			entity.partial = utils.isSomeChildrenSelected(entity.skus);
			this.currentPageChecked = utils.isAllChildrenSelected(this.resInfo.list);
			!entity.checked && (this.isCheckedAll = false);

			this.updateSelectedItems(entity);
			this.updateSelectedItemsBuffer();
		};

		this.pagerGridOptions.selectSingleTreeRootItem = entity => {
			this.selectedItems.splice(0, 1, entity);
			this.updateSelectedItemsBuffer();
		};
	}

	// 已选商品表格配置
	prepareSelectedPagerGridOptions() {
		// 已选商品->表格配置
		this.selectedPagerGridOptions = {};
		for (let key in this.pagerGridOptions) {
			if (this.pagerGridOptions.hasOwnProperty(key)) {
				this.selectedPagerGridOptions[key] = this.pagerGridOptions[key];
			}
		}
		this.selectedPagerGridOptions.resource = null;
		this.selectedPagerGridOptions.externalData = this.selectedItems;
		this.selectedPagerGridOptions.transformer = null;
		this.selectedPagerGridOptions.emptyTipTpl = selectedEmptyTpl;
		this.selectedPagerGridOptions.pager = {
			pageNum: 1,
			pageSize: this.isQiake ? 50 : 15,
			pageSizeList: [10, 15, 20, 25, 50]
		};

		// 移除父亲: 从已选商品中删除父亲（包括 sku）。
		this.selectedPagerGridOptions.removeTreeRootItem = entity => {
			this.resetRootItem(entity);
			this.currentPageChecked = utils.isAllChildrenSelected(this.resInfo.list);
			this.isCheckedAll = false;

			this.updateSelectedItems(entity);
			this.updateSelectedItemsBuffer();
			// 刷新
			if (this.selectedPagerGridOptions.pager.pageNum !== 1 && this.selectedPagerGridOptions.externalData.length === 1) {
				this.selectedPagerGridOptions.pager.pageNum -= 1;
			}
			this.selectedPagerGridOptions.onRefresh(this.selectedPagerGridOptions);
		};

		// 移除孩子
		this.selectedPagerGridOptions.removeTreeLeafItem = (entity, sku) => {
			sku.checked = false;
			if (utils.isAllChildrenRemoved(entity.skus)) {
				this.resetRootItem(entity);
			} else {
				entity.partial = true;
				entity.checked = false;
			}
			this.currentPageChecked = utils.isAllChildrenSelected(this.resInfo.list);
			this.isCheckedAll = false;
			this.updateSelectedItems(entity);
			this.updateSelectedItemsBuffer();
			// 移除部分孩子不需要刷新表格
			if (utils.isAllChildrenRemoved(entity.skus)) {
				this.selectedPagerGridOptions.onRefresh(this.selectedPagerGridOptions);
			}
		};

		this.selectedPagerGridOptions.removeSingleTreeRootItem = () => {
			this.radio.value = null;
			this.selectedItems.splice(0, 1);
			this.updateSelectedItemsBuffer();
			this.selectedPagerGridOptions.onRefresh(this.selectedPagerGridOptions);
		};

		// 表格数据来自于 externalData 时，分页操作
		const wrapGridData = (currentPage, pageSize, data) => {
			this.selectedPagerGridOptions.pager.pageNum = currentPage;
			this.selectedPagerGridOptions.pager.pageSize = pageSize;
			this.selectedPagerGridOptions.pager.totalPages = Math.ceil((data.length || 0) / pageSize);
			this.selectedPagerGridOptions.externalData = data.slice(pageSize * (currentPage - 1), pageSize * currentPage);
			return this.selectedPagerGridOptions;
		};

		this.selectedPagerGridOptions.onRefresh = opts => {
			const currentPage = opts.pager.pageNum; // 当前页
			const pageSize = opts.pager.pageSize; // 分页大小
			let externalData = [];
			this.selectedItems.forEach(entity => {
				if (!entity.isHide) {
					externalData.push(entity);
				}
			}); // 已选商品表格条件搜索后的数据

			this.selectedItems.forEach(entity => {
				entity.extend = this.selectedGoodsSkuSearch || this.isAddSectionExtend;
			});
			this.isSelectedExtendAll = utils.isAllChildrenExtend(this.selectedItems);
			// 刷新表格
			this._$ccGrid.refresh(wrapGridData(currentPage, pageSize, externalData)).then(() => { this.showLoading = false; });
		};
	}

	// 点击简单搜索按钮
	clickSimpleSearch() {
		for (let attr in this.formModel) {
			const index = this.findEntityByName(this.fieldsetConfigList, attr);
			if (index >= 0 && !this.fieldsetConfigList[index].isSimpleSearchItem && attr !== 'shopId' && attr !== 'platform') {
				if (Array.isArray(this.formModel[attr])) {
					this.formModel[attr] = [];
				} else {
					this.formModel[attr] = null;
				}
				this.formTplConfig[`show-${attr}`] = false;
			}
		}
		this.dataMerge.start = this.dateRange.end = null;
		this.wakeupScroll();
	}

	// 点击高级搜索按钮
	clickSeniorSearch() {
		for (let attr in this.formModel) {
			if (this.formModel.hasOwnProperty(attr)) {
				const index = this.findEntityByName(this.fieldsetConfigList, attr);
				this.formTplConfig[`show-${attr}`] = index >= 0 && attr !== 'shopId' && attr !== 'platform';
			}
		}
		this.wakeupScroll();
	}

	// 触发 scroll 监听的事件 TODO -> it is absolutely not a good solution
	wakeupScroll() {
		let node = document.createElement('span');
		if (this.isSelectedGoodsTab) {
			document.querySelector('.checked-goods-panel .cc-grid-table tbody').appendChild(node);
			document.querySelector('.checked-goods-panel .cc-grid-table tbody').removeChild(node);
		} else {
			document.querySelector('.all-goods-panel .cc-grid-table tbody').appendChild(node);
			document.querySelector('.all-goods-panel .cc-grid-table tbody').removeChild(node);
		}
	}

	// 获取商品自自定义类目数据
	getShopCategories() {
		return service.getShopCategories(this.serverName, this.formModel.platform, this.formModel.shopId, this.apiPrefix, this.tenantId).get().$promise.then(res => {
			let data = res.data || [];
			// 只显示叶子类目
			this.shopCategoriesList = data.filter(item => item.isLeaf === true);
			this.shopCategoriesList.forEach(item => {
				item.name = utils.htmlDecodeByRegExp(item.name);
			});
			// 由于商品自定义类目数据是异步请求，所以需要在数据回来以后更新表单中 shopCategoriesId 的值，更新后清空，保证数据只赋值一次
			if (this.conditions.shopCategoriesId && this.conditions.shopCategoriesId.length) {
				this.formModel.shopCategoriesId = this.conditions.shopCategoriesId;
				this.conditions.shopCategoriesId = [];
			}
			return this.shopCategoriesList;
		}).catch(() => {
			this._$ccTips.error(errorMsg);
		});
	}

	// 获取商品标准类目列表
	getCategories() {
		return service.getCategories(this.serverName, this.formModel.platform, this.formModel.shopId, this.apiPrefix, this.tenantId).get().$promise.then(res => {
			let data = res.data || [];
			this.categoriesList = data.filter(item => item.isLeaf === true);
			// 由于商品标准类目数据是异步请求，所以需要在数据回来以后更新表单中 categoriesId 的值，更新后清空，保证数据只赋值一次
			if (this.conditions.categoriesId) {
				this.formModel.categoriesId = this.conditions.categoriesId;
				this.conditions.categoriesId = null;
			}
			if (!this.formModel.categoriesId) {
				this.formModel.categoriesId = null;
			}
			return this.categoriesList;
		}).catch(() => {
			this._$ccTips.error(errorMsg);
		});
	}

	// 获取商品品牌
	getBrands() {
		return service.getBrands(this.serverName, this.formModel.platform, this.formModel.shopId, this.apiPrefix, this.tenantId).get().$promise.then(res => {
			this.brandsList = res.data || [];
			// 由于商品品牌数据是异步请求，所以需要在数据回来以后更新表单中 brandId 的值，更新后清空，保证数据只赋值一次
			if (this.conditions.brandId) {
				this.formModel.brandId = this.conditions.brandId;
				this.conditions.brandId = null;
			}
			return this.brandsList;
		}).catch(() => {
			this._$ccTips.error(errorMsg);
		});
	}

	// 获取商品标签，初始化的时候调用
	getTags() {
		return service.getTags(this.serverName, this.formModel.platform, this.tenantId, this.apiPrefix, this.tenantId).get().$promise.then(res => {
			res.data = res.data || [];
			if (res.data.length && this.conditions.tags && this.conditions.tags.length) {
				// 如果用户传进来的商品标签存在于商品标签列表中，那么将商品标签 push 到 selectedLabels 中
				this.conditions.tags.forEach(tag => {
					let targetIndex = this.findEntity(res.data, tag);
					if (targetIndex !== -1) {
						this.selectedLabels.push(tag);
					}
				});
			}
			return res.data;
		}).catch(() => {
			this._$ccTips.error(errorMsg);
		});
	}

	// 级联菜单 -> 商品标准类目 select 框 change
	categorySelectChange(newValue, oldValue, itemIndex, item) {
		if (this.formModel.categoriesId && item) {
			return service.getProperties(this.serverName, this.formModel.platform, this.formModel.shopId, item.id, this.apiPrefix, this.tenantId).get().$promise.then(res => {
				this.propsPidList = res.data || [];
				this.formModel.propsPid = this.propsPid;
				this.propsPid = null;
			}).catch(() => {
				this._$ccTips.error(errorMsg);
			});
		} else {
			this.propsPidList = [];
			this.formModel.propsPid = null;
			this.propsPid = null;
		}
	};

	// 级联菜单 -> 商品属性 select 框 change
	propSelectChange(newValue, oldValue, itemIndex, item) {
		if (this.formModel.propsPid && itemIndex !== -1) {
			this.propsVidList = this.propsPidList[itemIndex].values;
			this.formModel.propsVid = this.propsVid || this.propsVname;
			this.propsVid = this.propsVname = null;
		} else {
			this.propsVidList = [];
			this.formModel.propsVid = undefined;
			this.formModel.propsVname = null;
		}
	};

	// 店铺 select 框 change
	shopSelectChange(newValue, oldValue, itemIndex, item) {
		const collection = this.fieldsetConfigList;
		this.findEntityByName(collection, 'shopCategoriesId') >= 0 && this.getShopCategories();
		this.findEntityByName(collection, 'categoriesId') && this.getCategories();
		this.findEntityByName(collection, 'brandId') >= 0 && this.getBrands();
	};

	// 商品属性值 select 框 change
	propsVidSelectChange(newValue, oldValue, itemIndex, item) {
		if (newValue && itemIndex === -1) {
			this.formModel.propsVname = newValue;
		} else {
			this.formModel.propsVname = null;
		}
	};

	// 将时间转换成时间戳格式
	transformDateParams() {
		this.formModel.startListTime = this.dateRange.start ? Date.parse(this.dateRange.start) : null;
		this.formModel.endListTime = this.dateRange.end ? Date.parse(this.dateRange.end) : null;
	}

	// 前端搜索 -> 对已选商品列表进行处理
	transformSelectedItems() {
		this.selectedItems.forEach(item => {
			item.isHide = false;
			item.shopCategoriesId = this.getNewArray(item.shopCategories, 'id');
			item.categoriesId = this.getNewArray(item.categories, 'id');
			item.propsPid = this.getNewArray(item.props, 'pid');
			item.propsVid = this.getNewArray(item.props, 'vid');
			item.propsVname = this.getNewArray(item.props, 'vname');
			item.maxPrice = item.minPrice = item.price;
			item.startListTime = item.listTime;
			item.endListTime = item.delistTime;
			item.skus && item.skus.length && item.skus.forEach(sku => {
				sku.isHide = false;
				sku.skusOuterId = sku.outerId;
				sku.skusId = sku.id;
				sku.skusPropsVname = this.getNewArray(sku.props, 'vname');
			});
			matchHelper.match(this.formModel, item.skus, this.skuFormConfig);
			if (item.skus && item.skus.length) {
				item.isHide = utils.isAllChildrenHide(item.skus);
			}
		});
	}

	// 点击 tab
	tabClick(text) {
		if (text === '已选商品') {
			this.isSelectedGoodsTab = true;
			this.initConditionsMsg();
			// 克隆表单数据，保存到allDateRangeModel、allGoodsFormModel、selectedLabelsOfAll中，当切换回全部商品tab时用作数据回显
			this.allDateRangeModel = cloneDeep(this.dateRange);
			this.allGoodsFormModel = cloneDeep(this.formModel);
			this.selectedLabelsOfAll = cloneDeep(this.selectedLabels);
			this.handleForm(this.selectedDateRangeModel, this.selectedGoodsFormModel, this.selectedLabelsOfSelected);
			this.isSelectedExtendAll = utils.isAllChildrenExtend(this.selectedItems);
			this.showLoading = true;
			setTimeout(() => {
				this.selectedPagerGridOptions.pager.pageNum = 1;
				this.selectedPagerGridOptions.onRefresh(this.selectedPagerGridOptions);
			}, 0);
		} else {
			this.isSelectedGoodsTab = false;
			// 克隆表单数据，保存到selectedDateRangeModel、selectedGoodsFormModel、selectedLabelsOfSelected中，当切换回全部商品tab时用作数据回显
			this.selectedDateRangeModel = cloneDeep(this.dateRange);
			this.selectedGoodsFormModel = cloneDeep(this.formModel);
			this.selectedLabelsOfSelected = cloneDeep(this.selectedLabels);
			this.handleForm(this.allDateRangeModel, this.allGoodsFormModel, this.selectedLabelsOfAll);
			if (this.isAddSection) {
				this.getBatchImportApi();
				this._$ccGrid.refresh(this.pagerGridOptions).then(() => {
					this.isAddSection = false;
				});
				this.isCheckedAll = false;
			}
			this.hasResInfoList() && this.dataMerge(this.resInfo.list, this.selectedItemsBuffer);
			this.extendAll(this.isExtendAll, this.resInfo.list);
			this.currentPageChecked = this.hasResInfoList() ? utils.isAllChildrenSelected(this.resInfo.list) : false;
		}
	};

	// 初始化搜索条件信息，只调用一次（打开弹窗 -> 重置操作/选择商品标签/点击已选商品 tab -> 获取条件信息后并关闭操作）
	initConditionsMsg() {
		!this.hasInitConditionMsg && this.conditions && this.getConditionMsg(this.formModelCopy);
		this.hasInitConditionMsg = true;
	}
	// 批量添加操作下的 api 和 表格查询参数
	getBatchImportApi() {
		// 当使用批量添加的时候一切表格数据相关请求访问该路径，当使用表单搜索的时候，一切表格数据相关请求访问原来的路径
		this.gridPrefixApi = `${this.serverName}${this.apiPrefix}/items/batchImportIds`;
		// 更新表格，表格查询参数为 pageNum, pageSize, id/sku.outerId,outerId, shopId, platform
		this.pagerGridOptions.resource = this._$resource(this.gridPrefixApi, null, {
			get: {
				method: 'POST'
			}
		});
		this.pagerGridOptions.postData = this.addSectionQueryParams;
		let pager = {
			pageNum: 1,
			pageSize: this.pagerGridOptions.queryParams.pageSize
		};
		this.pagerGridOptions.queryParams = Object.assign({}, pager);
	}

	// tab 切换时 form 表单处理
	handleForm(dateRangeModel, formModel, selectedLabels) {
		this.dateRange = cloneDeep(dateRangeModel);
		this.selectedLabels = cloneDeep(selectedLabels);
		const categoriesId = this.formModel.categoriesId;
		const propsPid = this.formModel.propsPid;
		for (let attr in formModel) {
			if (formModel.hasOwnProperty(attr)) {
				if (attr !== 'propsPid' && attr !== 'propsVid') {
					this.formModel[attr] = cloneDeep(formModel[attr]);
				}
			}
		}
		this.propsPid = formModel.propsPid;
		if (categoriesId === formModel.categoriesId) {
			this.formModel.propsPid = this.propsPid;
		}
		this.propsVid = formModel.propsVid;
		if (propsPid === formModel.propsPid) {
			this.formModel.propsVid = this.propsVid;
		}
	}

	// 筛选
	search(isSelectedGoodsTab) {
		this.getSearchApi();
		this.isAddSectionExtend = false;
		this.isCheckedAll = false;
		if (!this.formModel.shopId || Array.isArray(this.formModel.shopId) && !this.formModel.shopId.length) {
			this._$ccTips.error('请至少选择一个店铺');
		} else {
			this._$ccValidator.validate(this.goodsSelectorForm).then(() => {
				this.transformDateParams();
				if (!isSelectedGoodsTab) {
					// 全部商品 tab，后端搜索
					this.allGoodsSkuSearch = this.formModel.skusPropsVname || this.formModel.skusId && this.formModel.skusId.length || this.formModel.skusOuterId; // 搜索条件是否包含 sku
					utils.transformParams(this.pagerGridOptions.queryParams, this.formModel);
					this.updateAllGoodsGrid();
					Object.assign(this.checkAllQueryParams, this.formModel);
				} else {
					// 已选商品 tab，前端搜索
					this.selectedGoodsSkuSearch = this.formModel.skusPropsVname || this.formModel.skusId && this.formModel.skusId.length || this.formModel.skusOuterId;
					this.transformSelectedItems();
					matchHelper.match(this.formModel, this.selectedItems, this.formConfig);
					this.selectedItems.forEach(item => {
						if (!item.skus || !item.skus.length) {
							if (this.formModel.skusOuterId || this.formModel.skusPropsVname) {
								item.isHide = true;
							}
						} else {
							if (utils.isAllChildrenHide(item.skus)) {
								item.isHide = true;
							}
						}
					});
					// 商品标签筛选单独处理，因为 form 表单中保存的是商品标签对应的商品ID数组，而不是商品标签本身，查询的时候需要直接筛选出包含在商品ID数组中的所有商品
					matchHelper.goodsLabelSearch(this.selectedItems, this.selectedLabels);
					this.selectedPagerGridOptions.onRefresh(this.selectedPagerGridOptions);
				}
			}, () => {});
		}
	};

	// 搜索操作下的 api 和 表格查询参数
	getSearchApi() {
		this.gridPrefixApi = `${this.serverName}${this.apiPrefix}/items`;
		this.pagerGridOptions.resource = this._$resource(this.gridPrefixApi, null, {
			get: {
				method: 'POST'
			}
		});
		let ids = this.getTagItemIds(this.selectedLabels);
		this.formModel.tagItemIds = matchHelper.removeArrayDuplicate(ids);
		this.pagerGridOptions.postData = !this.isSelectedGoodsTab && this.selectedLabels.length ? { tagItemIds: this.formModel.tagItemIds } : {};
	}

	// 重置表单，恢复初始值
	reset(formModel, dateRange, formCtrl = null) {
		if (formCtrl) {
			this._$ccValidator.setPristine(formCtrl);
			this.initConditionsMsg();
			this.selectedLabels = [];
			this.selectedShopIdList = this.isSingleSelectShopList ? [this.shopList[0].shopId] : cloneDeep(this.selectedShopIdList);
			this.formModel.shopId = this.isSingleSelectShopList ? this.selectedShopIdList[0] : cloneDeep(this.selectedShopIdList);
		}
		if (this.isSelectedGoodsTab) {
			this.selectedLabelsOfSelected = [];
		} else {
			this.selectedLabelsOfAll = [];
		}
		for (let attr in formModel) {
			if (formModel.hasOwnProperty(attr) && attr !== 'platform' && attr !== 'shopId' && attr !== 'status') {
				if (Array.isArray(formModel[attr])) {
					formModel[attr] = [];
				} else {
					formModel[attr] = null;
				}
			}
		}
		formModel.shopId = this.isSingleSelectShopList ? this.shopList[0].shopId : this.shopList.map(item => item.shopId);
		formModel.status = '-1';
		dateRange.start = dateRange.end = null;
	};

	// 更新表格数据（数据从后端请求）
	updateAllGoodsGrid() {
		this._$ccGrid.refresh(this.pagerGridOptions);
	}

	// 将商品状态恢复成初始状态
	resetRootItem(entity) {
		entity.checked = false;
		entity.partial = false;
		entity.skus && entity.skus.forEach(sku => {
			sku.checked = false;
		});
	}

	// 选中商品
	checkRootItem(entity) {
		entity.checked = true;
		entity.partial = false;
		entity.skus && entity.skus.forEach(sku => {
			sku.checked = true;
		});
	}

	// 展开/折叠全部
	extendAll(isExtend, data) {
		data && data.length && data.forEach(item => {
			item.extend = isExtend;
		});
		this.wakeupScroll();
	};

	// this.resInfo.list 是否存在
	hasResInfoList() {
		return this.resInfo && this.resInfo.list && this.resInfo.list.length;
	}
	// 全选当页
	selectCurrentPageAll() {
		this.currentPageChecked = !this.currentPageChecked;
		!this.currentPageChecked && (this.isCheckedAll = false);
		this.hasResInfoList() && this.resInfo.list.forEach(item => {
			item['checked'] = this.currentPageChecked;
			item['partial'] = false;
			item.skus && item.skus.length && item.skus.forEach(sku => {
				sku['checked'] = this.currentPageChecked;
			});
		});
		this.hasResInfoList() && this.resInfo.list.forEach(entity => {
			this.updateSelectedItems(entity);
		});
		this.updateSelectedItemsBuffer();
	};

	// 全部全选
	checkedAll() {
		this.currentPageChecked = true;
		this.data.forEach(entity => {
			this.checkRootItem(entity);
			this.updateSelectedItems(entity); // 更新已选商品数组
		});
		this.hasResInfoList() && this.resInfo.list.forEach(entity => {
			this.checkRootItem(entity);
			this.updateSelectedItems(entity); // 维持已选商品和全部商品的引用关系
		});
		this.updateSelectedItemsBuffer();
		this.isShowMask = false;
	}

	// 全部不选
	uncheckedAll() {
		this.currentPageChecked = false;
		this.data.forEach(entity => {
			this.resetRootItem(entity);
			this.updateSelectedItems(entity); // 更新已选商品数组
		});
		this.hasResInfoList() && this.resInfo.list.forEach(entity => {
			this.resetRootItem(entity);
			this.updateSelectedItems(entity); // 维持已选商品和全部商品的引用关系
		});
		this.updateSelectedItemsBuffer();
	}

	// 移除当页
	removeCurrentPage() {
		this.selectedPagerGridOptions.externalData.forEach(entity => {
			let targetIndex = this.findEntity(this.selectedItems, entity);
			if (targetIndex !== -1) {
				this.resetRootItem(this.selectedItems[targetIndex]);
				this.updateSelectedItems(this.selectedItems[targetIndex]);
			}
		});
		this.updateSelectedItemsBuffer();
		// 刷新
		if (this.selectedPagerGridOptions.pager.pageNum !== 1) {
			this.selectedPagerGridOptions.pager.pageNum -= 1;
		}
		this.selectedPagerGridOptions.onRefresh(this.selectedPagerGridOptions);
		this.isCheckedAll = false;
	};

	// 移除全部
	removeAll() {
		this.selectedItems.forEach(entity => {
			this.resetRootItem(entity);
		});
		this.selectedItemsBuffer.splice(0, this.selectedItemsBuffer.length);
		this.selectedItems.splice(0, this.selectedItems.length);
		this.selectedPagerGridOptions.onRefresh(this.selectedPagerGridOptions);
		this.currentPageChecked = false;
		this.isCheckedAll = false;
	};

	// 返回一个新数组，新数组元素为原数组中元素对象的某个属性的值
	getNewArray(sourceArr, fieldName) {
		sourceArr = sourceArr || [];
		return sourceArr.map(item => {
			return (item[fieldName]);
		});
	}

	// 从集合中获取 entity 的 index, 找不到返回 -1
	findEntity(collection, entity) {
		return collection.findIndex(item => angular.equals(item.id, entity.id));
	}

	// merge->分页时进行页的切换时需要保持商品被选状态
	dataMerge(list = [], listBuffer = []) {
		if (!listBuffer.length) {
			list.forEach(entity => {
				this.resetRootItem(entity);
			});
		}
		listBuffer.forEach(buffer => {
			let targetIndex = this.findEntity(list, buffer);
			if (targetIndex !== -1) {
				if (buffer.skus && list[targetIndex].skus) {
					buffer.skus.forEach(sku => {
						let index = this.findEntity(list[targetIndex].skus, sku);
						if (index !== -1) {
							list[targetIndex].skus[index] = Object.assign(sku);
						}
					});
					list[targetIndex].checked = utils.isAllChildrenSelected(list[targetIndex].skus);
					list[targetIndex].partial = utils.isSomeChildrenSelected(list[targetIndex].skus);
				} else {
					this.checkRootItem(list[targetIndex]);
				}
				this.updateSelectedItems(list[targetIndex]);
				this.updateSelectedItemsBuffer();
			}
		});
	}

	// 点击商品/sku前面的 checkbox，如果已选商品数超过允许的最大已选商品数，则用户不能 check
	checkCheckboxBefore(event) {
		const target = event.target;
		const targetScope = angular.element(target).scope();
		if (target.parentNode.parentNode.classList.contains('sd-root-node')) {
			if (!targetScope.$parent.entity['checked'] && this.selectedItems.length + 1 > this._maxSelectedNumber) {
				this.moreThanSelectedMaxNumber(event);
			}
		} else if (target.parentNode.parentNode.classList.contains('sd-child-node')) {
			if (!targetScope.$parent.$parent.entity['partial'] && this.selectedItems.length + 1 > this._maxSelectedNumber) {
				this.moreThanSelectedMaxNumber(event);
			}
		}
	}

	// 点击商品全选当页 checkbox，如果已选商品数超过允许的最大已选商品数，则用户不能 check
	checkCurrentPageBefore(event) {
		const target = event.target;
		const targetScope = angular.element(target).scope();
		const uncheckedItems = this.hasResInfoList() ? this.getUncheckedItems(this.resInfo.list) : [];
		if (!targetScope.$parent.$ctrl.ngChecked && this.selectedItems.length + uncheckedItems.length > this._maxSelectedNumber) {
			this.moreThanSelectedMaxNumber(event);
		}
	}

	// 点击全部全选的 checkbox
	checkAllBefore(event) {
		const target = event.target;
		const targetScope = angular.element(target).scope();
		const totals = this.pagerGridOptions.pager.totals || 0;
		if ((!targetScope.$parent.$ctrl.ngChecked && target.parentNode.classList.contains('cc-checkbox-label')) || (!targetScope.$ctrl.ngChecked && (target.classList.contains('cc-checkbox-input') || target.classList.contains('cc-checkbox')))) {
			if (onceMaxSelectedNumber <= this._maxSelectedNumber) {
				this.maxMoreThanOnce(totals);
			} else {
				this.onceMoreThanMax(totals);
			}
		} else if (totals) {
			this.uncheckedAll();
		}
	}

	// 单次全选的最大值大于全选商品允许的最大值
	onceMoreThanMax(totals) {
		if (totals > onceMaxSelectedNumber * 2) {
			this.moreThanSelectedMaxNumber(event);
		} else if (totals) {
			this.isShowMask = true;
			if (totals === 0) {
			} else if (totals + 1 > onceMaxSelectedNumber) {
				this.moreThanSelectedMaxNumber(event);
			} else {
				this.getGridData(totals).then(res => {
					this.data = res.data || [];
					let uncheckedGoods = this.getUncheckedItemsFromAll(this.data);
					if (this.selectedItems.length + uncheckedGoods.length > this._maxSelectedNumber) {
						this.moreThanSelectedMaxNumber(event);
					} else {
						this.checkedAll();
					}
				}, res => {});
			}
		}
	}

	// 单次全选的最大值小于等于全选商品允许的最大值
	maxMoreThanOnce(totals) {
		if (totals > this._maxSelectedNumber * 2) {
			this.moreThanSelectedMaxNumber(event);
		} else if (totals) {
			this.isShowMask = true;
			this.getGridData(totals).then(res => {
				this.data = res.data || [];
				let uncheckedGoods = this.getUncheckedItemsFromAll(this.data);
				if (uncheckedGoods.length + 1 > onceMaxSelectedNumber) { // 测试 500
					if (this.selectedItems.length + uncheckedGoods.length > this._maxSelectedNumber) { // 测试 700
						this.moreThanSelectedMaxNumber(event);
					} else {
						this.moreThanOnceSelectedMaxNumber(event);
					}
				} else {
					if (this.selectedItems.length + uncheckedGoods.length > this._maxSelectedNumber) { // 测试 700
						this.moreThanSelectedMaxNumber(event);
					} else {
						this.checkedAll();
					}
				}
			}, res => {});
		}
	}

	// 全部全选操作获取表格数据
	getGridData(totals) {
		let postData = this.addSectionQueryParams;
		if (this.gridPrefixApi === `${this.serverName}${this.apiPrefix}/items`) {
			postData = this.pagerGridOptions.postData;
			// 不是批量导入
			let exceptList = ['pageNum', 'pageSize', 'tagItemIds'];
			let paramStr = utils.getStandardParams(this.checkAllQueryParams, exceptList);
			return service.getGridItems(this.serverName, 1, totals, paramStr, this.apiPrefix, this.tenantId).save(postData).$promise;
		} else {
			return service.getGridBatchItems(this.serverName, 1, totals, this.apiPrefix, this.tenantId).save(postData).$promise;
		}
	}

	// 获取一个数组中状态为 unchecked 的商品
	getUncheckedItems(data) {
		return data.filter(item => {
			return !item.checked && !item.partial;
		});
	}

	// 从所有商品的数组中获取不包含在已选商品数组中的所有商品
	getUncheckedItemsFromAll(data) {
		return data.filter(item => {
			let targetIndex = this.findEntity(this.selectedItems, item);
			if (targetIndex === -1) {
				return item;
			}
		});
	}

	// 已选商品数超过已选商品最大允许选择数
	moreThanSelectedMaxNumber(event) {
		event.stopPropagation();
		this._$ccTips.error(getExceedSelectedNumberMsg(this._maxSelectedNumber));
		this.isShowMask = false;
		this.isCheckedAll = false;
	}

	// 已选商品数超过单次最大允许全选商品数
	moreThanOnceSelectedMaxNumber(event) {
		event.stopPropagation();
		this._$ccTips.error(exceedSelectedAllNumberMsg);
		this.isShowMask = false;
		this.isCheckedAll = false;
	}
	/**
	 * @name ok 点击确认按钮
	 */
	ok() {
		this.selectedItems.forEach(item => {
			if (item.skus && item.skus.length) {
				item.skus = item.skus.filter(sku => { return sku.checked; });
			}
		});
		// 如果支持添加为搜索条件功能，那么将搜索条件传给用户
		if (this.isSupportedAddCondition) {
			this._modalInstance.ok([this.selectedItems, this.conditionsModel]);
		} else {
			this._modalInstance.ok(this.selectedItems);
		}
	}

	// 批量添加 -- 后端查询
	addSection() {
		const modalInstance = this._$ccModal
			.modal({
				scope: this._$scope,
				title: '批量导入商品ID',
				fullscreen: false,
				locals: {
					isQiake: this.isQiake
				},
				style: {
					width: '568px',
					'min-width': '568px',
					height: '265px'
				},
				__body: bodyTemplate,
				controller: sectionAddCtrl,
				controllerAs: '$ctrl'
			})
			.open();
		// 收集modal的操作反馈,确认为成功回调,取消为失败回调
		modalInstance.result.then(obj => {
			this.addSectionQueryParams = {
				platform: this.formModel.platform,
				shopId: Array.isArray(this.formModel.shopId) ? this.formModel.shopId.join(',') : this.formModel.shopId,
				id: obj.inputKey === 'id' ? obj.inputValue : [],
				outerId: obj.inputKey === 'number' ? obj.inputValue : [],
				'skus.outerId': obj.inputKey === 'skuNumber' ? obj.inputValue : []
			};
			let inputObjHash = {
				'id': '商品ID',
				'number': '商品商家编码',
				'skuNumber': 'sku商家编码'
			};
			this.getBatchImportResult(obj, this.addSectionQueryParams, inputObjHash);
			this.getBatchImportIds(obj, this.addSectionQueryParams);
		}, v => {
		});
	}

	// 获取批量导入数据的结果（导入总数、导入失败数据列表）
	getBatchImportResult(obj, queryParams, inputObjHash) {
		service.getBatchImportResult(this.serverName, this.apiPrefix, this.tenantId).save(queryParams, res => {
			let currentTime = Date.parse(new Date());
			this[`addSectionFailedData${currentTime}`] = res.notFound; // 导入失败的数据
			const addSectionTotalsNumber = queryParams['id'].length ? queryParams['id'].length : (queryParams['outerId'].length ? queryParams['outerId'].length : queryParams['skus.outerId'].length); // 导入数据总量
			const successNumber = res.foundNum; // 导入成功的数据总量
			const failedNumber = res.notFound.length; // 导入失败的数据总量
			const repeatNumber = addSectionTotalsNumber - successNumber - failedNumber; // 重复的数据量
			let msg = getBatchImportMsg(currentTime, inputObjHash[obj.inputKey], successNumber, failedNumber, repeatNumber);
			// 批量导入结果提示信息
			if (failedNumber) {
				this._$ccTips.error(msg, document.querySelector('.goods-selector'));
				let notFoundNode = this._$compile(getNotFoundMsg(currentTime, inputObjHash[obj.inputKey]))(this._$scope);
				angular.element(document.querySelector(`#batch-${currentTime}`)).append(notFoundNode);
			} else {
				this._$ccTips.success(msg, document.querySelector('.goods-selector'));
			}
		}, () => {
			this._$ccTips.error(errorMsg);
		});
	}

	// 获取批量导入数据后返回的表格数据
	getBatchImportIds(obj, queryParams) {
		service.getBatchImportIds(this.serverName, this.apiPrefix, this.tenantId).save(queryParams, res => {
			if (res.data && res.data.length) {
				this.isAddSectionExtend = (obj.inputKey === 'skuNumber');
				this.isAddSection = true; // 批量导入
				// 更新已选商品状态
				res.data.forEach(entity => {
					this.checkRootItem(entity);
					this.updateSelectedItems(entity);
				});
				// 更新已选商品状态
				this.selectedItems.forEach(entity => {
					entity.extend = (obj.inputKey === 'skuNumber');
				});
				this.updateSelectedItemsBuffer();
				this.jumpToSelectedGoodsTabs(this._$scope);
			}
		}, () => {
			this._$ccTips.error(errorMsg);
		});
	}

	// 跳转到已选商品 tab
	jumpToSelectedGoodsTabs(scope) {
		if (!scope.$$phase && !scope.$root.$$phase) {
			scope.$apply();
			document.querySelector('.gs-tabs-nav li:last-child').click();
		} else {
			setTimeout(() => {
				this.jumpToSelectedGoodsTabs(scope);
			}, 200);
		}
	}

	// 查看未导入成功明细
	checkNotFoundDetails(currentTime) {
		if (!this[`isShowNotFoundDetails${currentTime}`]) {
			this[`isCopied${currentTime}`] = false;
		}
		this[`isShowNotFoundDetails${currentTime}`] = true;
	}

	// 复制未导入成功的商品ID/商品商家编码/sku 商家编码
	copyToBoard(currentTime) {
		let notFoundCopy = this[`addSectionFailedData${currentTime}`].join('\n');
		let textArea = document.createElement('textarea');
		textArea.value = notFoundCopy;
		document.body.appendChild(textArea);
		textArea.select();
		if (document.execCommand('copy')) {
			document.execCommand('copy');
		}
		document.body.removeChild(textArea);
	}

	// 点击商品标签
	openGoodsLabelModel() {
		const title = '标签筛选条件设置';
		let placeholderText = '标签名称';
		let mapping = {
			displayField: 'name',
			valueField: 'id'
		};
		let opts = {
			placeholderText,
			selectedLabels: this.selectedLabels,
			mapping
		};
		service.getTags(this.serverName, this.formModel.platform, this.tenantId, this.apiPrefix, this.tenantId).get(res => {
			res.data = res.data || [];
			this._$labelChoose.labelChoose(title, res.data, opts).open()
				.result.then(res => {
					// 获取搜索条件信息
					this.initConditionsMsg();
					this.selectedLabels = res.length ? res : [];
					// 处理商品标签数组，取出所有商品标签对应的商品ID并去重
					let ids = this.getTagItemIds(this.selectedLabels);
					this.formModel.tagItemIds = matchHelper.removeArrayDuplicate(ids);
				});
		}, () => {
			this._$ccTips.error(errorMsg);
		});
	}

	// 获取商品标签对应的商品 ID
	getTagItemIds(selectedLabels) {
		let ids = [];
		selectedLabels.forEach(item => {
			if (item.itemIds && item.itemIds.length) {
				ids.push(...item.itemIds);
			}
		});
		return ids;
	}

	// 获取搜索条件信息
	getConditionMsg(formModel) {
		if (this.conditions && JSON.stringify(this.conditions) !== '{}') {
			this.formConditionConfig = {
				shopId: {
					method: 'queryTitleByValueStr',
					params: {
						dataList: this.shopList,
						valueName: 'shopId',
						value: formModel.shopId,
						titleName: 'shopName',
						title: '店铺名称'
					}
				},
				shopCategoriesId: {
					method: 'queryTitleByValueArray',
					params: {
						dataList: this.shopCategoriesList,
						valueName: 'id',
						value: formModel.shopCategoriesId,
						titleName: 'name',
						title: '自定义类目'
					}
				},
				categoriesId: {
					method: 'queryTitleByValue',
					params: {
						dataList: this.categoriesList,
						valueName: 'id',
						value: formModel.categoriesId,
						titleName: 'name',
						title: '标准类目'
					}
				},
				propsPid: {
					method: 'queryTitleByValue',
					params: {
						dataList: this.propsPidList,
						valueName: 'id',
						value: formModel.propsPid,
						titleName: 'name',
						title: '商品属性'
					}
				},
				propsVid: {
					method: 'queryTitleByValue',
					params: {
						dataList: this.propsVidList,
						valueName: 'id',
						value: formModel.propsVid,
						titleName: 'value',
						title: '属性值'
					}
				},
				propsVname: {
					method: 'getValue',
					params: {
						value: formModel.propsVname,
						title: '属性值'
					}
				},
				status: {
					method: 'queryTitleByValue',
					params: {
						dataList: this.statusList,
						valueName: 'value',
						value: formModel.status,
						titleName: 'title',
						title: '在架状态'
					}
				},
				startListTime: {
					method: 'getListTime',
					params: {
						time: Date.parse(this.dateRange.start),
						title: '上架时间'
					}
				},
				endListTime: {
					method: 'getListTime',
					params: {
						time: Date.parse(this.dateRange.end),
						title: '下架时间'
					}
				},
				id: {
					method: 'getValue',
					params: {
						value: formModel.id,
						title: '商品ID'
					}
				},
				maxPrice: {
					method: 'getValue',
					params: {
						value: formModel.maxPrice,
						title: '最高价'
					}
				},
				minPrice: {
					method: 'getValue',
					params: {
						value: formModel.minPrice,
						title: '最低价'
					}
				},
				name: {
					method: 'getValue',
					params: {
						value: formModel.name,
						title: '商品名称'
					}
				},
				outerId: {
					method: 'getValue',
					params: {
						value: formModel.outerId,
						title: '商品商家编码'
					}
				},
				skusId: {
					method: 'getValue',
					params: {
						value: formModel.skusId,
						title: '商品编号'
					}
				},
				skusOuterId: {
					method: 'getValue',
					params: {
						value: formModel.skusOuterId,
						title: 'sku商家编码'
					}
				},
				skusPropsVname: {
					method: 'getValue',
					params: {
						value: formModel.skusPropsVname,
						title: 'sku规格'
					}
				},
				tagItemIds: {
					method: 'queryTitleByArray',
					params: {
						dataList: this.selectedLabels,
						titleName: 'name',
						title: '商品标签'
					}
				},
				brandId: {
					method: 'queryTitleByValue',
					params: {
						dataList: this.brandsList,
						valueName: 'brandId',
						value: formModel.brandId,
						titleName: 'brandName',
						title: '品牌'
					}
				}
			};
			this.conditionContent = matchHelper.getFormCondition(this.formConditionConfig);
		}
	}

	// 点击添加为搜索条件按钮 this.conditionsModel -> 关闭弹出框时传给用户
	clickCondition() {
		this.hasInitConditionMsg = true;
		for (let attr in this.formModel) {
			if (this.formModel.hasOwnProperty(attr)) {
				if (attr !== 'platform' && attr !== 'startListTime' && attr !== 'endListTime') {
					let item = this.formModel[attr];
					if (Array.isArray(item) && (item.length > 1 || item.length === 1 && item[0] !== '') || !Array.isArray(item) && (item || item === 0)) {
						this.conditionsModel[attr] = cloneDeep(item);
					} else {
						delete this.conditionsModel[attr];
					}
				}
			}
			// 日期组件 单独处理
			attr === 'startListTime' && !this.dateRange.start && delete this.conditionsModel.startListTime;
			attr === 'endListTime' && !this.dateRange.end && delete this.conditionsModel.endListTime;
			attr === 'platform' && delete this.conditionsModel.platform;
		}
		// 商品标签 单独处理
		this.selectedLabels.length ? this.conditionsModel.tags = cloneDeep(this.selectedLabels) : delete this.conditionsModel.tags;
		delete this.conditionsModel.tagItemIds;

		this.getConditionMsg(this.formModel);
		this.pagerGridOptions.conditionLength = this.selectedPagerGridOptions.conditionLength = this.getConditionsLength(this.formModel);
		this._$ccTips.success('成功添加一组搜索条件', document.querySelector('.goods-selector'));
		this.wakeupScroll();
	}

	// 获取搜索条件的长度
	getConditionsLength(formModel) {
		let conditionsLength = 0;
		const exceptList = ['platform', 'startListTime', 'endListTime'];
		for (let attr in formModel) {
			if (formModel.hasOwnProperty(attr) && exceptList.indexOf(attr) === -1) {
				let value = formModel[attr];
				if (Array.isArray(value)) {
					// TODO 商品 ID 数组在手动清空后变成了['']而非[]
					value.length && (value.length > 1 || value.length === 1 && value[0] !== '') && conditionsLength++;
				} else if (value && value !== 0 || value === 0) {
					conditionsLength++;
				}
			}
			// 日期组件 单独处理
			if (formModel.hasOwnProperty(attr) && attr === 'startListTime') {
				this.dateRange.start && conditionsLength++;
			}
			if (formModel.hasOwnProperty(attr) && attr === 'endListTime') {
				this.dateRange.end && conditionsLength++;
			}
		}
		return conditionsLength;
	}

	// 移除已选的搜索条件
	removeCondition() {
		this.conditionContent = null;
		this.conditionsModel = {};
		this.pagerGridOptions.conditionLength = this.selectedPagerGridOptions.conditionLength = 0;
		this.wakeupScroll();
	}
}
