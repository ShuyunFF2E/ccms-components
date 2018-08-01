import angular from 'angular';
import { Inject } from 'angular-es-utils/decorators';
import cloneDeep from 'lodash.clonedeep';
import genResource from 'angular-es-utils/rs-generator';

import rowCellTemplate from './tpls/customer-row-cell.tpl.html';
import skuRowCellTemplate from './tpls/customer-sku-row-cell.tpl.html';
import emptyTpl from './tpls/customer-empty.tpl.html';
import selectedEmptyTpl from './tpls/customer-selected-empty.tpl.html';
import bodyTemplate from './addSection/customer-modal-body.tpl.html';
import headerTemplate from './tpls/customer-header.tpl.html';
import footerTemplate from './tpls/customer-footer.tpl.html';
import rowTemplate from './tpls/customer-row.tpl.html';

import matchHelper from './MatchHelper';
import sectionAddCtrl from './addSection/SectionAddCtrl';
import { apiPrefix, getExceedSelectedNumberMsg, onceMaxSelectedNumber, getNotFoundMsg, statusList, getFieldsMap, getFormConfig } from './constant';
import { transformGoodsData } from './utils';


@Inject('$ccTips', '$element', 'modalInstance', 'selectedData', 'maxSelectedNumber', 'serverName',
	'shopInfoData', '$ccValidator', '$resource', '$scope', '$ccGrid', '$ccModal', '$ccGoodsSelector', '$filter', '$sce', '$compile',
	'isSupportedSku', '$labelChoose', 'isSupportedAddCondition', 'tenantId', 'conditions')

export default class GoodsSelectorCtrl {

	$onInit() {
		this.showLoading = true;
		this.isMoreThanHundred = false;

		// 已选的商品标签
		this.selectedLabels = [];
		this.selectedLabelsOfAll = [];
		this.selectedLabelsOfSelected = [];
		// 商品维度选择（是否支持显示sku）
		this.isSupportedSku = this._isSupportedSku;
		// 租户ID -> 查询商品标签参数
		this.tenantId = this._tenantId;
		// 是否支持添加为搜索条件
		this.isSupportedAddCondition = this._isSupportedAddCondition;
		// 搜索条件
		this.conditions = cloneDeep(this._conditions);
		this.conditionsModel = cloneDeep(this._conditions);

		// 批量导入和搜索是本质上都是根据条件对表格数据进行筛选，但是却是两个不相关的操作，把它们看成两个开关，不同的开关对应不同的API，其下的分页操作分别使用对应的API
		this.gridPrefixApi = `${this._serverName}${apiPrefix}/items`;

		// 店铺信息 -> 如果是 array, 说明需要显示店铺列表
		//         -> 如果是 object, 说明是单店铺
		//         -> 其它情况, 需要提示用户, 参数格式不正确
		this.isShowShopList = Array.isArray(this._shopInfoData);
		this.isTaobao = this.isShowShopList ? this._shopInfoData[0].plat === 'top' : this._shopInfoData.plat === 'top';
		this.isQiake = this.isShowShopList ? this._shopInfoData[0].plat === 'qiakr' : this._shopInfoData.plat === 'qiakr';
		// 店铺列表
		this.shopList = this.isShowShopList ? this._shopInfoData : [this._shopInfoData];
		this.tips = null;
		// 商品状态
		this.statusList = statusList;

		let fieldsMapGroup = getFieldsMap();
		this.shopListFieldsMap = fieldsMapGroup.shopListFieldsMap;
		this.shopCategoriesFieldsMap = this.categoriesFieldsMap = this.propsPidFieldsMap = fieldsMapGroup.categoriesFieldsMap;
		this.propsVidFieldsMap = fieldsMapGroup.propsVidFieldsMap;
		this.statusListFieldsMap = fieldsMapGroup.statusListFieldsMap;
		this.brandsListFieldsMap = fieldsMapGroup.brandsListFieldsMap;

		// form 区域价格校验
		this.validators = {
			/**
			 * 价格校验
			 * -> 只能输入数字或两位小数
			 * -> 前一个数字小于或者等于后一个数字
			 * -> 价格区间必须都写, 校验才生效
			 * */
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

		this.initForm();
		// 获取搜索条件信息，条件之间用';'分隔
		this.getConditionMsg();

		if (this.isTaobao) {
			// 获取商品标签数据并对selectedLabels进行初始化
			this.getTags();
			// 商品自自定义类目数据
			this.getShopCatories();
		} else if (this.isQiake) {
			// 获取商品品牌
			this.getBrands();
		}
		// 商品标准类目列表
		this.getCategories();

		// 全部全选操作的查询参数，考虑到当用户选择条件后，并没有点击搜索触发搜索操作，因此这时全部全选操作不能使用当前form表单作为查询参数。
		this.checkedAllQueryParams = {
			shopId: this.formModel.shopId,
			platform: this.formModel.platform
		};

		// 全部商品->表格配置
		this.selectedItems = [];
		// selectedItemsBuffer 保存 selectedItems 中数据的副本（深拷贝）。维护 selectedItems 中数据状态。
		// 用作返回上一页时进行数据 merge，保持全部商品 tab 和已选商品 tab 的商品状态（checked/unchecked/partial、extend）一致。
		this.selectedItemsBuffer = [];

		// 用户传进来的已选商品处理
		transformGoodsData(this._shopInfoData, this._selectedData, this._serverName, this.isSupportedSku).then(data => {
			if (data && data.length) {
				data.forEach(entity => {
					this.selectedItems.push(entity);
					this.selectedItemsBuffer.push(cloneDeep(entity));
				});
				this.updateGrid();
			}
		});

		this.preparePagerGridOptions();
		this.prepareSelectedPagerGridOptions();
	}

	// form 表单初始化
	initForm() {
		let c = this.conditions; // 用户传进来的搜索条件
		this.formModel = {
			platform: c.plat ? c.plat : this.shopList[0].plat, // 平台
			shopId: c.shopId ? c.shopId : this.shopList[0].shopId, // 店铺
			id: c.id ? c.id : [], // 商品ID 数组
			name: c.name ? c.name : null, // 商品名称 模糊匹配
			shopCategoriesId: !this.isTaobao ? [] : (c.shopCategoriesId ? c.shopCategoriesId : []), // shopCategories.id 自定义类目 数组
			categoriesId: c.categoriesId ? c.categoriesId : null, // categories.id 标准类目
			propsPid: this.isQiake ? null : (c.propsPid ? c.propsPid : null), // props.pid 商品属性 ID
			propsVid: this.isQiake ? null : (c.propsVid ? c.propsVid : null), // props.vid 商品属性值 ID
			propsVname: this.isQiake ? null : (c.propsVid ? null : c.propsVname), // props.vname 商品属性值对应的属性名称
			status: c.status ? String(c.status) : this.statusList[0].value, // 状态, true 在架, false 不在架
			skusPropsVname: this.isQiake || !this.isSupportedSku ? null : (c.skusPropsVname ? c.skusPropsVname : null), // skus.props.vname SKU属性值 模糊匹配
			outerId: this.isQiake ? null : (c.outerId ? c.outerId : null), // 商品商家编码
			skusOuterId: this.isQiake || !this.isSupportedSku ? null : (c.skusOuterId ? c.skusOuterId : null), // skus.outerId SKU 商家编码
			skusId: this.isTaobao ? [] : (c.skusId ? c.skusId : []), // skus.id SKUID 数组
			startListTime: c.startListTime ? c.startListTime : null, // 上架时间起始值, Unix时间戳，毫秒
			endListTime: c.endListTime ? c.endListTime : null, // 上架时间结束值, Unix时间戳，毫秒
			minPrice: c.minPrice ? c.minPrice : null, // 商品价格下限
			maxPrice: c.maxPrice ? c.maxPrice : null, // 商品价格下限,
			tagItemIds: [], // 商品标签 数组
			brandId: !this.isQiake ? null : (c.brandId ? c.brandId : null) // 品牌
		};
		// 日期组件的特殊性
		this.dateRange = {
			start: c.startListTime ? c.startListTime : null,
			end: c.endListTime ? c.endListTime : null,
			minDate: null,
			maxDate: new Date(),
			disabled: false,
			dateOnly: true
		};

		this.allGoodsFormModel = {};
		this.selectedDateRangeModel = cloneDeep(this.dateRange);
		this.selectedGoodsFormModel = cloneDeep(this.formModel);
		// 将已选商品 form 表单恢复初始状态 —> 在初始化表单的时候由于已经存在的搜索条件，导致 form 表单项被赋值
		this.reset(this.selectedGoodsFormModel, this.selectedDateRangeModel);
	}

	// 全部商品表格配置
	preparePagerGridOptions() {
		// 全部商品表格配置
		this.pagerGridOptions = {
			resource: this._$resource(`${this._serverName}${apiPrefix}/items`, null, {
				get: {
					method: 'POST'
				}
			}),
			response: null,
			queryParams: {
				shopId: this.formModel.shopId,
				platform: this.formModel.platform,
				pageSize: 15,
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
			transformer: res => {
				if (res.flag === 'fail' && res.msg === 'Result window is too large, window size must be less than or equal to: [10000]') {
					this._$ccTips.error('<span class="sd-max-number-error-msg"></span>');
					let warnMsg = this._$compile('<span>出错提示：最多允许查询10000条商品数据, 请刷新表格。&nbsp;</span><span style="color: #0083ba; cursor: pointer" ng-click="$ctrl.refreshGrid()">刷新</span>')(this._$scope);
					let tipsArr = document.querySelectorAll('.float-tips-container .float-tips .message .sd-max-number-error-msg');
					tipsArr.forEach(item => {
						angular.element(item).parent().empty().append(warnMsg);
					});
				}
				if (res['data'] && res.flag !== 'fail') {
					res['list'] = res['data'];
					delete res['data'];
				} else {
					res['list'] = [];
				}
				if (res['totalCount']) {
					res['totals'] = res['totalCount'];
					delete res['totalCount'];
					delete res['totalCount'];
				}
				if (res.list && res.list.length) {
					// 全部商品列表 -> 当表格数据刷新时，更新列表中的商品状态，保持和已选商品状态一致。
					this.dataMerge(res.list, this.selectedItemsBuffer);
					// 已选商品列表 -> 当表格数据刷新时，更新已选商品状态
					this.selectedItems.forEach((item, index) => {
						let targetIndex = this.findEntity(res.list, item);
						if (targetIndex !== -1) {
							this.selectedItems.splice(index, 1);
							this.selectedItems.push(res.list[targetIndex]);
						}
					});
					// 表格刷新，判断当页全选按钮的状态
					this.currentPageChecked = this.isAllChildrenSelected(res.list);
					// 如果搜索条件含有 sku 相关项或者批量导入的是 sku 商家编码，那么展开 sku，否则不展开 sku
					// 如果是商品维度（不支持 sku）,则删除 sku
					res.list.forEach(item => {
						item.extend = this.allGoodsSkuSearch || this.isAddSectionExtend;
						if (!this.isSupportedSku && item.skus && item.skus.length) {
							delete item.skus;
						}
					});
					// 表格刷新，判断全部展开/折叠按钮的状态
					this.isExtendAll = this.isAllChildrenExtend(res.list);
				}
				this.resInfo = res;
				return res;
			}
		};
		this.pagerGridOptions.rowCellTemplate = rowCellTemplate;
		this.pagerGridOptions.skuRowCellTemplate = skuRowCellTemplate;
		this.pagerGridOptions.selectedData = this.selectedItems;
		this.pagerGridOptions.isQiake = this.isQiake;
		this.pagerGridOptions.conditionLength = this.getConditionLength(); // 已选条件数量
		this.pagerGridOptions.postData = {};

		// 获取 sku 标题，后端返回的是数组，需要前端自行拼接
		this.pagerGridOptions.getSkuName = sku => {
			let propName = '';
			if (sku.props && sku.props.length) {
				for (let i = 0; i < sku.props.length; i++) {
					if (i === sku.props.length - 1) {
						if (sku.props[i].pname) {
							propName += sku.props[i].pname + '：' + sku.props[i].vname;
						} else {
							propName += sku.props[i].vname;
						}
					} else {
						if (sku.props[i].pname) {
							propName += sku.props[i].pname + '：' + sku.props[i].vname + '；';
						} else {
							propName += sku.props[i].vname + '；';
						}
					}
				}
			}
			return propName;
		};

		// 高亮显示搜索关键字
		this.pagerGridOptions.lightText = (originText, keyWords) => {
			originText = originText || '';
			let reg = new RegExp(keyWords, 'g');
			let result = '';
			if (keyWords && keyWords.length !== 0 && originText.indexOf(keyWords) > -1) {
				result = originText.toString().replace(reg, `<span class="highlight">${keyWords}</span>`);
			} else {
				result = originText.toString();
			}
			return this._$sce.trustAsHtml(result);
		};

		// 价格保留两位小数
		this.pagerGridOptions.getPrice = price => {
			let buffer = [];
			if (price || price === 0) {
				buffer = String(price).split('.');
			}
			if (buffer.length === 2) {
				buffer[0] = buffer[0].replace(/(?=(?!\b)(\d{3})+$)/g, ',');
				if (buffer[1].length === 1) {
					price = buffer[0] + '.' + buffer[1] + '0';
				} else if (buffer[1].length === 2) {
					price = buffer[0] + '.' + buffer[1];
				} else {
					price = buffer[0] + '.' + buffer[1].slice(0, 2);
				}
			} else {
				price = String(price).replace(/(?=(?!\b)(\d{3})+$)/g, ',');
				price += '.00';
			}
			return '￥' + price;
		};

		// 超过 maxLength 个字则隐藏多余字，显示 '...'
		this.pagerGridOptions.listCharacterIntercept = (str, maxLength) => {
			if (str.length > maxLength) {
				str = str.slice(0, maxLength) + '...';
			}
			return str;
		};

		this.pagerGridOptions.formModel = this.formModel;
		// 表格子行的展开和收起
		this.pagerGridOptions.handleTreeIcon = entity => {
			entity.extend = !entity.extend;
			if (this.isSelectedGoodsTab) {
				this.isSelectedExtendAll = this.isAllChildrenExtend(this.selectedItems);
			} else {
				this.isExtendAll = this.isAllChildrenExtend(this.resInfo.list);
			}
		};

		// checked 父亲, 所有孩子 checked,
		// 反之 unchecked 父亲, 所有孩子 unchecked
		this.pagerGridOptions.selectTreeRootItem = entity => {
			// if (!this.isMoreThanHundred) {
			entity.checked = !entity.checked;
			entity.partial = false;
			entity.skus && entity.skus.forEach(item => {
				item.checked = entity.checked;
			});
			// 所有父亲状态为 checked， 表格上方的全选当页, 被 checked，反之，被 unchecked。
			this.currentPageChecked = this.isAllChildrenSelected(this.resInfo.list);

			// 将已选商品 push 到 selectedItems 中
			//    -> 如果父亲 checked 并且不存在于 selectedItems 数组中，则将父亲(包括sku数据)整体 push 到数组中；
			//	  -> 如果父亲初始状态为partial, 父亲 checked 并且存在于 selectedItems 数组中，则将父亲(包括sku数据)从已选商品数组中先 splice 掉，然后将整体 push 到数组中；
			//    -> 如果父亲 unchecked 并且存在于 selectedItems 数组中，则将父亲这个整体删除
			//    -> 其它情况不处理
			let entityIndex = this.findEntity(this.selectedItems, entity);
			if (entity.checked && entityIndex === -1) {
				this.selectedItems.push(entity);
			}
			if (entity.checked && entityIndex !== -1) {
				this.selectedItems.splice(entityIndex, 1);
				this.selectedItems.push(entity);
			}
			if (!entity.checked && entityIndex !== -1) {
				this.selectedItems.splice(entityIndex, 1);
			}
			this.getSelectedItemsBuffer();
		};

		// 孩子中的一部分 checked, 父亲半选 partial，全部孩子 checked, 父亲 checked
		this.pagerGridOptions.selectTreeLeafItem = (entity, sku) => {
			sku.checked = !sku.checked;
			entity.checked = this.isAllChildrenSelected(entity.skus);
			entity.partial = this.isSomeChildrenSelected(entity.skus);
			// 所有父亲状态为 checked， 表格上方的全选当页, 被 checked，反之，被 unchecked。
			this.currentPageChecked = this.isAllChildrenSelected(this.resInfo.list);

			// 将已选商品 push 到 selectedItems 中
			//    -> 如果父亲状态是 checked，且不存在于 selectedItems 中, 则将父亲(包括 sku) push 到 selectedItems 数组中；
			//    -> 如果父亲状态是 checked，且存在于 selectedItems 中, 则将父亲(包括sku数据)从已选商品数组中先 splice 掉，然后将整体 push 到数组中；
			//    -> 如果父亲状态是 partial，且存在于 selectedItems 中，则用父亲(包括 sku)替换已存在 entity；
			//    -> 如果父亲状态是 unchecked，则将其从 selectedItems 中删除
			if (entity.checked) {
				let entityIndex = this.findEntity(this.selectedItems, entity);
				if (entityIndex === -1) {
					this.selectedItems.push(entity);
				} else {
					this.selectedItems.splice(entityIndex, 1);
					this.selectedItems.push(entity);
				}
			} else if (entity.partial) {
				let entityIndex = this.findEntity(this.selectedItems, entity);
				if (entityIndex !== -1) {
					this.selectedItems[entityIndex] = entity;
				} else {
					this.selectedItems.push(entity);
				}
			} else {
				let entityIndex = this.findEntity(this.selectedItems, entity);
				entityIndex !== -1 && this.selectedItems.splice(entityIndex, 1);
			}
			this.getSelectedItemsBuffer();
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
		this.selectedPagerGridOptions.isQiake = this.isQiake;
		this.selectedPagerGridOptions.pager = {
			pageNum: 1,
			pageSize: 15,
			pageSizeList: [10, 15, 20, 25, 50]
		};

		// 移除父亲: 从已选商品中删除父亲（包括 sku）。
		// -> selectedItems 和 resInfo.list 是引用关系，因此为了保持状态一致，先改变即将删除的商品状态；
		// -> 然后将其 push 到 selectedItemsBuffer 中（如果已存在，则先删除再 push）。
		// -> 最后执行splice操作，删除该商品。
		this.selectedPagerGridOptions.removeTreeRootItem = entity => {
			let targetIndex = this.findEntity(this.selectedItems, entity);
			if (targetIndex !== -1) {
				this.resetRootItem(entity);
				this.updateSelectedItemsBuffer(entity);
				this.selectedItems.splice(targetIndex, 1);
			}
			// 刷新
			if (this.selectedPagerGridOptions.pager.pageNum !== 1 && this.selectedPagerGridOptions.externalData.length === 1) {
				this.selectedPagerGridOptions.pager.pageNum -= 1;
			}
			this.selectedPagerGridOptions.onRefresh(this.selectedPagerGridOptions);
			// 任意一个父亲被 remove 掉, 表格上方的全选当页, 被 unchecked
			this.currentPageChecked = this.isAllChildrenSelected(this.resInfo.list);
		};

		// 移除孩子: -> 如果部分孩子被移除，则将孩子状态置为 unchecked;
		//          -> 如果全部孩子被移除，则将孩子状态置为 unchecked; 并且删除父亲。
		//          -> selectedItems 和 resInfo.list 是引用关系，因此为了保持状态一致，在删除父亲之前先改变其状态；
		//          -> 然后将其 push 到 selectedItemsBuffer 中（如果已存在，则先删除再 push）。
		this.selectedPagerGridOptions.removeTreeLeafItem = (entity, sku) => {
			let entityIndex = this.findEntity(this.selectedItems, entity);
			let skuIndex = this.findEntity(this.selectedItems[entityIndex].skus, sku);
			if (skuIndex !== -1) {
				this.selectedItems[entityIndex].skus[skuIndex].checked = false;
				if (this.isAllChildrenRemoved(entity.skus)) {
					this.resetRootItem(entity);
					this.updateSelectedItemsBuffer(entity);
					this.selectedItems.splice(entityIndex, 1);
				} else {
					this.selectedItems[entityIndex].partial = true;
					this.selectedItems[entityIndex].checked = false;
					this.updateSelectedItemsBuffer(entity);
				}
			}
			// 刷新
			this.selectedPagerGridOptions.onRefresh(this.selectedPagerGridOptions);
			// 任意一个孩子被 remove 掉, 表格上方的全选当页, 被 unchecked
			this.currentPageChecked = this.isAllChildrenSelected(this.resInfo.list);
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
			const data = []; // 已选商品表格数据
			this.selectedItems.forEach(item => {
				if (!item.isHide) {
					data.push(item);
				}
			});
			// 如果搜索条件含有 sku 相关项或者批量导入的是 sku 商家编码，那么展开 sku，否则不展开 sku
			this.selectedItems.forEach(item => {
				item.extend = this.selectedGoodsSkuSearch || this.isAddSectionExtend;
			});
			// 判断全部展开/全部折叠按钮状态
			this.isSelectedExtendAll = this.isAllChildrenExtend(this.selectedItems);
			// 刷新表格
			this._$ccGrid.refresh(wrapGridData(currentPage, pageSize, data)).then(() => {
				this.showLoading = false;
			});
			// 已选商品数组改变 更新 selectedItemsBuffer
			this.getSelectedItemsBuffer();
		};
		this.selectedPagerGridOptions.conditionLength = this.getConditionLength();
	}

	// 点击简单搜索按钮时，表单重置（不改变引用，只恢复初始值）
	initComplexForm() {
		for (let attr in this.formModel) {
			if (attr !== 'platform' && attr !== 'shopId' && attr !== 'id' && attr !== 'name' && attr !== 'categoriesId') {
				if (Array.isArray(this.formModel[attr])) {
					this.formModel[attr] = [];
				} else {
					this.formModel[attr] = null;
				}
			}
		}
		this.dateRange.start = null;
		this.dateRange.end = null;
	}

	// 获取商品自自定义类目数据
	getShopCatories() {
		genResource(`${this._serverName}${apiPrefix}/shop_categories?platform=${this.formModel.platform}&shopId=${this.formModel.shopId}`, false, null).get().$promise.then(res => {
			let data = res.data || [];
			// 只显示叶子类目
			this.shopCategoriesList = data.filter(item => item.isLeaf === true);
			this.shopCategoriesList.forEach(item => {
				item.name = this.htmlDecodeByRegExp(item.name);
			});
			// 由于商品自定义类目数据是异步请求，所以需要在数据回来以后更新表单中 shopCategoriesId 的值，更新后清空，保证数据只加载一次
			if (this.conditions.shopCategoriesId && this.conditions.shopCategoriesId.length) {
				this.formModel.shopCategoriesId = this.conditions.shopCategoriesId;
				this.conditions.shopCategoriesId = [];
			}
		}).catch(res => {
			if (!this.tips || !this.tips.element) {
				this.tips = this._$ccTips.error('<span style="color: red;">出错提示：</span>后台服务出错，请联系数云客服人员');
			}
		});
	}

	// 获取商品标准类目列表
	getCategories() {
		genResource(`${this._serverName}${apiPrefix}/categories?platform=${this.formModel.platform}&shopId=${this.formModel.shopId}`, false, null).get().$promise.then(res => {
			let data = res.data || [];
			this.categoriesList = data.filter(item => item.isLeaf === true);
			// 由于商品标准类目数据是异步请求，所以需要在数据回来以后更新表单中 categoriesId 的值，更新后清空，保证数据只加载一次
			if (this.conditions.categoriesId) {
				this.formModel.categoriesId = this.conditions.categoriesId;
				this.conditions.categoriesId = null;
			}
			if (!this.formModel.categoriesId) {
				this.formModel.categoriesId = null;
			}
		}).catch(res => {
			if (!this.tips || !this.tips.element) {
				this.tips = this._$ccTips.error('<span style="color: red;">出错提示：</span>后台服务出错，请联系数云客服人员');
			}
		});
	}

	// 获取商品品牌
	getBrands() {
		genResource(`${this._serverName}${apiPrefix}/brands?platform=${this.formModel.platform}&shopId=${this.formModel.shopId}`, false, null).get().$promise.then(res => {
			this.brandsList = res.data || [];
			// 由于商品品牌数据是异步请求，所以需要在数据回来以后更新表单中 brandId 的值，更新后清空，保证数据只加载一次
			if (this.conditions.brandId) {
				this.formModel.brandId = this.conditions.brandId;
				this.conditions.brandId = null;
			}
		}).catch(res => {
			if (!this.tips || !this.tips.element) {
				this.tips = this._$ccTips.error('<span style="color: red;">出错提示：</span>后台服务出错，请联系数云客服人员');
			}
		});
	}

	// 获取商品标签，初始化的时候调用
	getTags() {
		genResource(`${this._serverName}${apiPrefix}/tagSearch?platform=${this.formModel.platform}&tenantId=${this.tenantId}&status=1`, false, null).get().$promise.then(res => {
			res.data = res.data || [];
			if (res.data.length) {
				if (this.conditions.tags && this.conditions.tags.length) {
					// 如果用户传进来的商品标签存在于商品标签列表中，那么将商品标签 push 到 selectedLabels 中
					this.conditions.tags.forEach(tag => {
						let targetIndex = this.findEntity(res.data, tag);
						if (targetIndex !== -1) {
							this.selectedLabels.push(tag);
						}
					});
					// 由于 this.selectedLabels 随着 tab 的切换而被赋值，所以需要获取 selectedLabels 的副本，在关闭面板时传给用户。
					this.tags = cloneDeep(this.selectedLabels);
					this.getTagItemIds(this.selectedLabels); // 更新 form 表单中 tagItemIds的值
					this.getConditionMsg(); // 获取搜索条件信息，条件之间使用';'分隔
					this.pagerGridOptions.conditionLength = this.selectedPagerGridOptions.conditionLength = this.getConditionLength();
				}
			}
		}).catch(res => {
		});
	}

	// 级联菜单 -> 商品标准类目 select 框 change
	categorySelectChange(newValue, oldValue, itemIndex, item) {
		if (this.formModel.categoriesId && item) {
			genResource(`${this._serverName}${apiPrefix}/categories/${item.id}/properties?platform=${this.formModel.platform}&shopId=${this.formModel.shopId}`, false, null).get().$promise
				.then(res => {
					this.propsPidList = res.data || [];
					// 仅在初始化时执行：如果用户传进来的商品属性不为空，那么更新 form 表单的 propsPid 值，并清空 this.conditions.propsPid，保证懒加载
					if (this.conditions.propsPid) {
						this.formModel.propsPid = this.conditions.propsPid;
						this.getConditionMsg();
						this.pagerGridOptions.conditionLength = this.selectedPagerGridOptions.conditionLength = this.getConditionLength();
						this.conditions.propsPid = null;
					} else {
						this.formModel.propsPid = this.propsPid;
					}
				})
				.catch(res => {
					if (!this.tips || !this.tips.element) {
						this.tips = this._$ccTips.error('<span style="color: red;">出错提示：</span>后台服务出错，请联系数云客服人员');
					}
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
			// 仅在初始化时执行：如果用户传进来的商品属性值不为空，那么更新 form 表单的 propsVid 值，并清空 this.conditions.propsVid，保证懒加载
			if (this.conditions.propsVid) {
				this.formModel.propsVid = cloneDeep(this.conditions.propsVid);
				this.getConditionMsg();
				this.pagerGridOptions.conditionLength = this.selectedPagerGridOptions.conditionLength = this.getConditionLength();
				this.conditions.propsVid = null;
			} else {
				if (this.conditions.propsVname) {
					this.formModel.propsVid = this.conditions.propsVname;
					this.getConditionMsg();
					this.pagerGridOptions.conditionLength = this.selectedPagerGridOptions.conditionLength = this.getConditionLength();
					this.conditions.propsVname = null;
				} else {
					this.formModel.propsVid = cloneDeep(this.propsVid);
				}
			}
		} else {
			this.propsVidList = [];
			this.formModel.propsVid = undefined;
			this.formModel.propsVname = null;
		}
	};

	// 店铺 select 框 change
	shopSelectChange(newValue, oldValue, itemIndex, item) {
		this.getShopCatories();
		this.getCategories();
	};

	// 商品属性值 select 框 change
	propsVidSelectChange(newValue, oldValue, itemIndex, item) {
		if (newValue && itemIndex === -1) {
			this.formModel.propsVname = newValue;
		} else {
			this.formModel.propsVname = null;
		}
	};

	// 后端搜索 -> 提交 form 表单前参数处理
	transformParams() {
		this.transformDateParams();
		// 查询参数
		const queryCollection = this.pagerGridOptions.queryParams;
		queryCollection['pageNum'] = 1;
		// 将部分参数属性名的驼峰形式转换成以 '.' 连接的形式
		for (let prop in this.formModel) {
			if (this.formModel.hasOwnProperty(prop)) {
				switch (prop) {
					case 'skusId':
						if (this.formModel[prop].length && !this.formModel[prop][0] && this.formModel[prop][0] !== 0) {
							this.formModel[prop] = [];
						}
						queryCollection['skus' + '.' + 'id'] = this.formModel[prop];
						break;
					case 'skusOuterId':
						queryCollection['skus' + '.' + 'outerId'] = this.formModel[prop];
						break;
					case 'skusPropsVname':
						queryCollection['skus' + '.' + 'props' + '.' + 'vname'] = this.formModel[prop];
						break;
					case 'categoriesId':
						queryCollection['categories' + '.' + 'id'] = this.formModel[prop];
						break;
					case 'shopCategoriesId':
						queryCollection['shopCategories' + '.' + 'id'] = this.formModel[prop];
						break;
					case 'propsPid':
						queryCollection['props' + '.' + 'pid'] = this.formModel[prop];
						break;
					case 'propsVid':
						queryCollection['props' + '.' + 'vid'] = this.formModel.propsVname ? null : this.formModel[prop];
						break;
					case 'propsVname':
						queryCollection['props' + '.' + 'vname'] = this.formModel[prop];
						break;
					case 'id':
						if (this.formModel[prop].length && !this.formModel[prop][0] && this.formModel[prop][0] !== 0) {
							this.formModel[prop] = [];
						}
						queryCollection[prop] = this.formModel[prop];
						break;
					case 'tagItemIds':
						delete queryCollection[prop]; // 后端搜索使用 POST 请求，将 tagItemIds 放到 request body 中
						break;
					case 'status':
						queryCollection[prop] = this.formModel[prop] === '-1' ? null : this.formModel[prop];
						break;
					default:
						queryCollection[prop] = this.formModel[prop];
				}
			}
		}
	}

	// 将时间转换成时间戳格式
	transformDateParams() {
		if (this.dateRange.start) {
			this.formModel.startListTime = Date.parse(this.dateRange.start);
		} else {
			this.formModel.startListTime = null;
		}
		if (this.dateRange.end) {
			this.formModel.endListTime = Date.parse(this.dateRange.end);
		} else {
			this.formModel.endListTime = null;
		}
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
				item.isHide = this.isAllChildrenHide(item.skus);
			}
		});
	}

	// 点击 tab
	tabClick(text) {
		if (text === '已选商品') {
			this.isSelectedGoodsTab = true;
			// 克隆表单数据，保存到allDateRangeModel、allGoodsFormModel、selectedLabelsOfAll中，当切换回全部商品tab时用作数据回显
			this.allDateRangeModel = cloneDeep(this.dateRange);
			this.allGoodsFormModel = cloneDeep(this.formModel);
			this.selectedLabelsOfAll = cloneDeep(this.selectedLabels);
			this.selectedLabels = cloneDeep(this.selectedLabelsOfSelected);
			this.handleForm(this.selectedDateRangeModel, this.selectedGoodsFormModel);
			this.isSelectedExtendAll = this.isAllChildrenExtend(this.selectedItems);
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
			this.selectedLabels = cloneDeep(this.selectedLabelsOfAll);
			this.handleForm(this.allDateRangeModel, this.allGoodsFormModel);
			if (this.selectedItemsBuffer.length) {
				this.dataMerge(this.resInfo.list, this.selectedItemsBuffer);
			} else {
				this.resInfo.list.forEach(item => {
					this.resetRootItem(item);
				});
			}
			if (this.isAddSection) {
				// 当使用批量添加的时候一切表格数据相关请求访问该路径，当使用表单搜索的时候，一切表格数据相关请求访问原来的路径
				this.gridPrefixApi = `${this._serverName}${apiPrefix}/items/batchImportIds`;
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
				this.updateGrid();
				this.isAddSection = false;
				this.isCheckedAll = false;
			}
			// 所有父亲状态为 checked， 表格上方的全选当页, 被 checked，反之，被 unchecked。
			this.currentPageChecked = this.isAllChildrenSelected(this.resInfo.list);
		}
	};

	// tab 切换时 form 表单处理
	handleForm(dateRangeModel, formModel) {
		this.dateRange = cloneDeep(dateRangeModel);
		for (let attr in formModel) {
			if (formModel.hasOwnProperty(attr)) {
				if (attr !== 'propsPid' && attr !== 'propsVid') {
					this.formModel[attr] = cloneDeep(formModel[attr]);
				}
			}
		}
		this.categoriesId = cloneDeep(formModel.categoriesId);
		this.propsPid = cloneDeep(formModel.propsPid);
		this.propsVid = cloneDeep(formModel.propsVid);
		if (this.categoriesId === formModel.categoriesId) {
			this.formModel.propsPid = this.propsPid;
		}
		if (this.categoriesId === formModel.categoriesId && this.propsPid === formModel.propsPid) {
			this.formModel.propsVid = this.propsVid;
		}
	}

	// 筛选
	search(isSelectedGoodsTab) {
		this.gridPrefixApi = `${this._serverName}${apiPrefix}/items`;
		this.pagerGridOptions.resource = this._$resource(this.gridPrefixApi, null, {
			get: {
				method: 'POST'
			}
		});
		let ids = this.getTagItemIds(this.selectedLabels);
		this.formModel.tagItemIds = matchHelper.removeArrayDuplicate(ids);
		this.pagerGridOptions.postData = !this.isSelectedGoodsTab && this.selectedLabels.length ? { tagItemIds: this.formModel.tagItemIds } : {};

		this.isAddSectionExtend = false;
		this.isCheckedAll = false;
		this._$ccValidator.validate(this.goodsSelectorForm).then(() => {
			if (!isSelectedGoodsTab) {
				if (this.formModel.skusPropsVname || this.formModel.skusId.length || this.formModel.skusOuterId) {
					this.allGoodsSkuSearch = true;
				} else {
					this.allGoodsSkuSearch = false;
				}
				this.transformParams();
				this.updateGrid();
				// 当点击搜索后，更新全部全选的查询参数
				this.checkedAllQueryParams = Object.assign({}, this.pagerGridOptions.queryParams);
				delete this.checkedAllQueryParams.pageNum;
				delete this.checkedAllQueryParams.pageSize;
			} else {
				if (this.formModel.skusPropsVname || this.formModel.skusId.length || this.formModel.skusOuterId) {
					this.selectedGoodsSkuSearch = true;
				} else {
					this.selectedGoodsSkuSearch = false;
				}
				this.transformDateParams();
				this.transformSelectedItems();
				matchHelper.match(this.formModel, this.selectedItems, this.formConfig);
				this.selectedItems.forEach(item => {
					if (!item.skus || !item.skus.length) {
						if (this.formModel.skusOuterId || this.formModel.skusPropsVname) {
							item.isHide = true;
						}
					} else {
						if (this.isAllChildrenHide(item.skus)) {
							item.isHide = true;
						}
					}
				});
				// 商品标签筛选单独处理，因为 form 表单中保存的是商品标签对应的商品ID数组，而不是商品标签本身，查询的时候需要直接筛选出包含在商品ID数组中的所有商品
				matchHelper.goodsLabelSearch(this.selectedItems, this.selectedLabels);
				this.selectedPagerGridOptions.onRefresh(this.selectedPagerGridOptions);
			}
		}, () => {});
	};

	// 重置表单，恢复初始值
	reset(formModel, dateRange, formCtrl = null) {
		if (formCtrl) {
			this._$ccValidator.setPristine(formCtrl);
			this.selectedLabels = [];
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
		formModel.shopId = this.shopList[0].shopId;
		formModel.status = '-1';
		dateRange.start = null;
		dateRange.end = null;
	};

	// 更新表格数据（数据从后端请求）
	//    -> update 全部商品中状态
	//    -> update 全选按钮
	updateGrid() {
		this._$ccGrid.refresh(this.pagerGridOptions).then(opts => {});
	}

	refreshGrid() {
		this.pagerGridOptions.queryParams.pageNum = 1;
		this.updateGrid();
	};

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

	// 获取 selectedItems 的副本 selectedItemsBuffer
	getSelectedItemsBuffer() {
		this.selectedItemsBuffer = [];
		this.selectedItems.forEach(item => {
			this.selectedItemsBuffer.push(cloneDeep(item));
		});
	}

	// 更新 selectedItems 的副本 selectedItemsBuffer
	updateSelectedItemsBuffer(entity) {
		let index = this.findEntity(this.selectedItemsBuffer, entity);
		if (index !== -1) {
			this.selectedItemsBuffer.splice(index, 1);
			this.selectedItemsBuffer.push(cloneDeep(entity));
		}
	}

	// 展开/折叠全部
	extendAll(isExtend, data) {
		data.forEach(item => {
			item.extend = isExtend;
		});
	};

	// 全选当页
	selectCurrentPageAll() {
		// currentPageChecked -> 全选当页 (true or false)
		this.currentPageChecked = !this.currentPageChecked;
		this.resInfo.list.forEach(item => {
			item['checked'] = this.currentPageChecked;
			item['partial'] = false;
			item.skus && item.skus.length && item.skus.forEach(sku => {
				sku['checked'] = this.currentPageChecked;
			});
		});
		if (this.currentPageChecked) {
			this.getSelectedItems(this.resInfo.list);
		} else {
			this.delSelectedItems(this.resInfo.list);
		}
		this.getSelectedItemsBuffer();
	};

	// 将 list 去重后的项 push 到已选商品数组中
	getSelectedItems(list) {
		list.forEach(item => {
			let index = this.findEntity(this.selectedItems, item);
			if (index === -1) {
				this.selectedItems.push(item);
			} else {
				this.selectedItems.splice(index, 1);
				this.selectedItems.push(item);
			}
		});
	}

	// 从已选商品数组中删除 list 中包含的项
	delSelectedItems(list) {
		list.forEach(item => {
			let targetIndex = this.findEntity(this.selectedItems, item);
			if (targetIndex !== -1) {
				this.selectedItems.splice(targetIndex, 1);
			}
		});
	}

	formParamsTransform() {
		let exceptList = ['pageNum', 'pageSize', 'tagItemIds'];
		return this.getStandardParams(this.checkedAllQueryParams, exceptList);
	}

	// 将参数对象转换成 & 符号连接的形式
	getStandardParams(params, exceptList = []) {
		let queryParams = cloneDeep(params);
		let paramsArr = [];
		for (let attr in queryParams) {
			if (queryParams.hasOwnProperty(attr) && (queryParams[attr] || queryParams[attr] === 0)) {
				let param = queryParams[attr];
				if (!Array.isArray(param) && exceptList.indexOf(attr) === -1) {
					paramsArr.push(`${attr}=${param}`);
				}
				if (Array.isArray(param)) {
					param.forEach(item => {
						paramsArr.push(`${attr}=${item}`);
					});
				}
			}
		}
		return paramsArr.join('&');
	}

	// 全部全选
	checkedAll() {
		this.resInfo.list.forEach(item => { this.checkRootItem(item); });
		this.data.forEach(item => { this.checkRootItem(item); });
		this.getSelectedItems(this.data);
		this.getSelectedItemsBuffer();
		this.isShowMask = false;
	}

	// 全部不选
	// 将当前全部选择的数据从 selectedItems 和 selectedItemsBuffer 中移除
	uncheckedAll() {
		this.currentPageChecked = false;
		this.data.forEach(item => {
			let selectedItemsIndex = this.findEntity(this.selectedItems, item);
			if (selectedItemsIndex !== -1) {
				this.selectedItems.splice(selectedItemsIndex, 1);
			}
			let selectedItemsBufferIndex = this.findEntity(this.selectedItemsBuffer, item);
			if (selectedItemsBufferIndex !== -1) {
				this.selectedItemsBuffer.splice(selectedItemsBufferIndex, 1);
			}
			let resInfoIndex = this.findEntity(this.resInfo.list, item);
			if (resInfoIndex !== -1) {
				this.resetRootItem(this.resInfo.list[resInfoIndex]);
			}
		});
	}

	// 移除当页
	removeCurrentPage() {
		let removeData = this.selectedPagerGridOptions.externalData;
		removeData.forEach(item => {
			let targetIndex = this.findEntity(this.selectedItems, item);
			if (targetIndex !== -1) {
				this.resetRootItem(this.selectedItems[targetIndex]);
				this.updateSelectedItemsBuffer(this.selectedItems[targetIndex]);
				this.selectedItems.splice(targetIndex, 1);
			}
		});
		// 刷新
		if (this.selectedPagerGridOptions.pager.pageNum !== 1) {
			this.selectedPagerGridOptions.pager.pageNum -= 1;
		}
		this.selectedPagerGridOptions.onRefresh(this.selectedPagerGridOptions);
		this.isCheckedAll = false;
	};

	// 移除全部
	// -> selectedItems 和 resInfo.list 是引用关系，因此为了保持状态一致，在删除父亲之前先改变其状态；
	// -> 然后清空 selectedItemsBuffer
	removeAll() {
		this.selectedItems.forEach(entity => {
			this.resetRootItem(entity);
		});
		this.selectedItemsBuffer.splice(0, this.selectedItemsBuffer.length);
		this.selectedItems.splice(0, this.selectedItems.length);
		// 刷新
		this.selectedPagerGridOptions.onRefresh(this.selectedPagerGridOptions);
		// 表格上方的全选当页, 被 unchecked
		this.currentPageChecked = false;
		this.isCheckedAll = false;
	};

	// 返回一个新数组，新数组元素为原数组中元素对象的某个属性的值
	getNewArray(sourceArr, fieldName) {
		let result = [];
		if (!sourceArr) {
			sourceArr = [];
		}
		sourceArr.forEach(item => {
			result.push(item[fieldName]);
		});
		return result;
	}

	// 从集合中获取 entity 的 index, 找不到返回 -1
	findEntity(collection, entity) {
		return collection.findIndex(item => angular.equals(item.id, entity.id));
	}

	// merge->分页时进行页的切换时需要保持商品被选状态
	dataMerge(goodsArr, selectedGoodsArr) {
		for (let i = 0; i < goodsArr.length; i++) {
			for (let j = 0; j < selectedGoodsArr.length; j++) {
				if (goodsArr[i].id === selectedGoodsArr[j].id) {
					goodsArr[i] = cloneDeep(selectedGoodsArr[j]);
					break;
				}
			}
		}
	}

	// 所有孩子状态都为 checked， 返回 true, 反之返回 false
	isAllChildrenSelected(children) {
		return children && children.every(child => {
			return child.checked;
		});
	}

	// 至少有一个孩子被选中（不包括全部孩子被选的情况）， 返回 true, 反之返回 false
	isSomeChildrenSelected(children) {
		return children && !this.isAllChildrenSelected(children) && children.some(child => {
			return child.checked || child.partial;
		});
	}

	// 所有孩子都被移除， 返回 true, 反之返回 false
	isAllChildrenRemoved(children) {
		return !(this.isAllChildrenSelected(children) || this.isSomeChildrenSelected(children));
	}

	// 所有孩子都隐藏
	isAllChildrenHide(children) {
		return children && children.every(child => {
			return child.isHide;
		});
	}

	// 是否所有孩子都展开
	isAllChildrenExtend(children) {
		return children && children.every(child => {
			return child.extend;
		});
	}

	// 用正则表达式实现html解码
	htmlDecodeByRegExp(str) {
		let s = '';
		if (str.length === 0) {
			return '';
		}
		s = str.replace(/&amp;/g, '&');
		s = s.replace(/&lt;/g, '<');
		s = s.replace(/&gt;/g, '>');
		s = s.replace(/&nbsp;/g, ' ');
		s = s.replace(/&#39;/g, '\'');
		s = s.replace(/&quot;/g, '\"');
		return s;
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
		const uncheckedItems = this.getUncheckedItems(this.resInfo.list);
		if (!targetScope.$parent.$ctrl.ngChecked && this.selectedItems.length + uncheckedItems.length > this._maxSelectedNumber) {
			this.moreThanSelectedMaxNumber(event);
		}
	}

	// 点击商全部全选的 checkbox
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
			let url = this.getPostOpts(totals).url;
			let postData = this.getPostOpts(totals).postData;
			if (totals === 0) {
			} else if (totals + 1 > onceMaxSelectedNumber) {
				this.moreThanSelectedMaxNumber(event);
			} else {
				genResource(url).save(postData, res => {
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
		let url = this.getPostOpts(totals).url;
		let postData = this.getPostOpts(totals).postData;
		if (totals > this._maxSelectedNumber * 2) {
			this.moreThanSelectedMaxNumber(event);
		} else if (totals) {
			this.isShowMask = true;
			genResource(url).save(postData, res => {
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

	getPostOpts(totals) {
		let url = `${this._serverName}${apiPrefix}/items/batchImportIds?pageNum=1&pageSize=${ totals }`;
		let postData = this.addSectionQueryParams;
		if (this.gridPrefixApi === `${this._serverName}${apiPrefix}/items`) {
			// 不是批量导入
			url = `${this._serverName}${apiPrefix}/items?pageNum=1&pageSize=${ totals }&${ this.formParamsTransform() }`;
			postData = this.pagerGridOptions.postData;
		}
		return {url, postData};
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
		this._$ccTips.error(`当前商品超过${ onceMaxSelectedNumber }个，不支持全部选中，请修改条件后重新搜索。`);
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
			if (!this.conditionContent) {
				this._modalInstance.ok([this.selectedItems, {}]);
			} else {
				if (this.tags.length) {
					this.conditionsModel.tags = this.tags;
				} else {
					delete this.conditionsModel.tags;
				}
				delete this.conditionsModel.tagItemIds;
				this._modalInstance.ok([this.selectedItems, this.conditionsModel]);
			}
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
				shopId: this.formModel.shopId,
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
		genResource(`${this._serverName}${apiPrefix}/items/batchImport/result`).save(queryParams, res => {
			let currentTime = Date.parse(new Date());
			this[`addSectionFailedData${currentTime}`] = res.notFound; // 导入失败的数据
			let addSectionTotalsNumber = queryParams['id'].length ? queryParams['id'].length : (queryParams['outerId'].length ? queryParams['outerId'].length : queryParams['skus.outerId'].length); // 导入数据总量
			let successExportNumber = res.foundNum; // 导入成功的数据总量
			let failedExportNumber = res.notFound.length; // 导入失败的数据总量
			let repeatNumber = addSectionTotalsNumber - successExportNumber - failedExportNumber; // 重复的数据量
			// 批量导入结果提示信息
			if (failedExportNumber) {
				let msg = `<span class="check-details" id="batch-${ currentTime }">成功导入${ inputObjHash[obj.inputKey] }${ successExportNumber }个，失败${ failedExportNumber }个</span>`;
				if (repeatNumber > 0) {
					msg = `<span class="check-details" id="batch-${ currentTime }">成功导入${ inputObjHash[obj.inputKey] }${ successExportNumber }个，失败${ failedExportNumber }个，重复${repeatNumber}个</span>`;
				}
				this._$ccTips.error(msg, document.querySelector('.goods-selector'));
				let notFoundMsg = this._$compile(getNotFoundMsg(currentTime, inputObjHash[obj.inputKey]))(this._$scope);
				angular.element(document.querySelector(`#batch-${currentTime}`)).append(notFoundMsg);
			} else {
				let msg = `成功添加${ inputObjHash[obj.inputKey] }${ res.total }个`;
				if (repeatNumber > 0) {
					msg = `成功添加${ inputObjHash[obj.inputKey] }${ res.total }个，重复${ repeatNumber }个`;
				}
				this._$ccTips.success(msg, document.querySelector('.goods-selector'));
			}
		}, res => {
			if (!this.tips || !this.tips.element) {
				this.tips = this._$ccTips.error('<span style="color: red;">出错提示：</span>后台服务出错，请联系数云客服人员');
			}
		});
	}

	// 获取批量导入数据后返回的表格数据
	getBatchImportIds(obj, queryParams) {
		genResource(`${this._serverName}${apiPrefix}/items/batchImportIds`).save(queryParams, res => {
			if (res.data && res.data.length) {
				// 如果查询参数为商品ID或者商品商家编码，则将查询到的商品状态置为 checked
				// 如果查询到参数为 sku 商家编码，则将查询到的商品状态置为 checked，并且展开 sku
				// 然后将处理过的商品去重后放到已选商品数组和已选商品 buffer 数组中，最后跳转到已选商品 tab 页面
				this.isAddSectionExtend = (obj.inputKey === 'skuNumber');
				this.isAddSection = true; // 批量导入
				this.getSelectedItems(res.data);
				this.selectedItems.forEach(entity => {
					entity.extend = (obj.inputKey === 'skuNumber');
					this.checkRootItem(entity);
				});
				this.getSelectedItemsBuffer();
				this.jumpToSelectedGoodsTabs(this._$scope);
			}
		}, res => {
			if (!this.tips || !this.tips.element) {
				this.tips = this._$ccTips.error('<span style="color: red;">出错提示：</span>后台服务出错，请联系数云客服人员');
			}
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
		genResource(`${this._serverName}${apiPrefix}/tagSearch?platform=${this.formModel.platform}&tenantId=${this.tenantId}&status=1`, false, null).get().$promise.then(res => {
			res.data = res.data || [];
			this._$labelChoose.labelChoose(title, res.data, opts).open()
				.result.then(res => {
					this.selectedLabels = res.length ? res : [];
					// 处理商品标签数组，取出所有商品标签对应的商品ID并去重
					this.getTagItemIds(res);
				}, res => {
				});
		}).catch(res => {
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
	getConditionMsg() {
		if (this.conditions && JSON.stringify(this.conditions) !== '{}') {
			this.formConditionConfig = {
				shopId: {
					method: 'queryTitleByValue',
					params: {
						dataList: this.shopList,
						valueName: 'shopId',
						value: this.formModel.shopId,
						titleName: 'shopName',
						title: '店铺名称'
					}
				},
				shopCategoriesId: {
					method: 'queryTitleByValueArray',
					params: {
						dataList: this.shopCategoriesList,
						valueName: 'id',
						value: this.formModel.shopCategoriesId,
						titleName: 'name',
						title: '自定义类目'
					}
				},
				categoriesId: {
					method: 'queryTitleByValue',
					params: {
						dataList: this.categoriesList,
						valueName: 'id',
						value: this.formModel.categoriesId,
						titleName: 'name',
						title: '标准类目'
					}
				},
				propsPid: {
					method: 'queryTitleByValue',
					params: {
						dataList: this.propsPidList,
						valueName: 'id',
						value: this.formModel.propsPid,
						titleName: 'name',
						title: '商品属性'
					}
				},
				propsVid: {
					method: 'queryTitleByValue',
					params: {
						dataList: this.propsVidList,
						valueName: 'id',
						value: this.formModel.propsVid,
						titleName: 'value',
						title: '属性值'
					}
				},
				propsVname: {
					method: 'getValue',
					params: {
						value: this.formModel.propsVname,
						title: '属性值'
					}
				},
				status: {
					method: 'queryTitleByValue',
					params: {
						dataList: this.statusList,
						valueName: 'value',
						value: this.formModel.status,
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
						value: this.formModel.id,
						title: '商品ID'
					}
				},
				maxPrice: {
					method: 'getValue',
					params: {
						value: this.formModel.maxPrice,
						title: '最高价'
					}
				},
				minPrice: {
					method: 'getValue',
					params: {
						value: this.formModel.minPrice,
						title: '最低价'
					}
				},
				name: {
					method: 'getValue',
					params: {
						value: this.formModel.name,
						title: '商品名称'
					}
				},
				outerId: {
					method: 'getValue',
					params: {
						value: this.formModel.outerId,
						title: '商品商家编码'
					}
				},
				skusId: {
					method: 'getValue',
					params: {
						value: this.formModel.skusId,
						title: '商品编号'
					}
				},
				skusOuterId: {
					method: 'getValue',
					params: {
						value: this.formModel.skusOuterId,
						title: 'sku商家编码'
					}
				},
				skusPropsVname: {
					method: 'getValue',
					params: {
						value: this.formModel.skusPropsVname,
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
						value: this.formModel.brandId,
						titleName: 'brandName',
						title: '品牌'
					}
				}
			};
			this.conditionContent = matchHelper.getFormCondition(this.formConditionConfig);
		}
	}

	// 点击添加为搜索条件按钮
	clickCondition() {
		// this.conditionsModel：传给用户的搜索条件对象，和 this.tags 一样，都是为了保证在 tab 切换的时候不受赋值影响。
		for (let attr in this.formModel) {
			if (this.formModel.hasOwnProperty(attr) && attr !== 'platform') {
				let item = this.formModel[attr];
				if (Array.isArray(item) && item.length || !Array.isArray(item) && (item || item === 0)) {
					this.conditionsModel[attr] = cloneDeep(item);
				} else {
					delete this.conditionsModel[attr];
				}
			}
		}
		if (this.dateRange.start) {
			this.conditionsModel['startListTime'] = this.dateRange.start;
		} else {
			delete this.conditionsModel['startListTime'];
		}
		if (this.dateRange.end) {
			this.conditionsModel['endListTime'] = this.dateRange.end;
		} else {
			delete this.conditionsModel['endListTime'];
		}
		// 只有在点击添加为搜索条件的时候才更新 this.tags
		this.tags = cloneDeep(this.selectedLabels);
		this.getConditionMsg();
		this._$ccTips.success('成功添加一组搜索条件', document.querySelector('.goods-selector'));
		this.pagerGridOptions.conditionLength = this.selectedPagerGridOptions.conditionLength = this.getConditionLength();
	}

	getConditionLength() {
		return this.conditionContent ? this.conditionContent.split(';').length : 0;
	}
}
