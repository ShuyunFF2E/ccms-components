import angular from 'angular';
import { Inject } from 'angular-es-utils/decorators';
import cloneDeep from 'lodash.clonedeep';
import genResource from 'angular-es-utils/rs-generator';

import rowCellTemplate from './tpls/customer-row-cell.tpl.html';
import skuRowCellTemplate from './tpls/customer-sku-row-cell.tpl.html';
import emptyTpl from './tpls/customer-empty.tpl.html';
import selectedEmptyTpl from './tpls/customer-selected-empty.tpl.html';
import bodyTemplate from './tpls/customer-modal-body.tpl.html';
import headerTemplate from './tpls/customer-header.tpl.html';
import footerTemplate from './tpls/customer-footer.tpl.html';
import rowTemplate from './tpls/customer-row.tpl.html';

import matchHelper from './MatchHelper';
import sectionAddCtrl from './SectionAddCtrl';
import { apiPrefix, getExceedSelectedNumberMsg, onceMaxSelectedNumber } from './constant';
import { transformGoodsData } from './utils';


@Inject('$ccTips', '$element', 'modalInstance', 'selectedData', 'maxSelectedNumber', 'serverName',
	'shopInfoData', '$ccValidator', '$resource', '$scope', '$ccGrid', '$ccModal', '$ccGoodsSelector', '$filter', '$sce', '$compile',
	'isSupportedSku')

export default class GoodsSelectorCtrl {

	$onInit() {
		this.showLoading = true;
		this.isMoreThanHundred = false;
		// 商品维度选择（是否支持显示sku）
		this.isSupportedSku = this._isSupportedSku;
		// 店铺信息 -> 如果是 array, 说明需要显示店铺列表
		//         -> 如果是 object, 说明是单店铺
		//         -> 其它情况, 需要提示用户, 参数格式不正确
		this.isShowShopList = Array.isArray(this._shopInfoData);
		this.isTaobao = this.isShowShopList ? this._shopInfoData[0].plat === 'top' : this._shopInfoData.plat === 'top';
		// 店铺列表
		this.shopList = this.isShowShopList ? this._shopInfoData : [this._shopInfoData];
		// form 区域日期配置
		this.dateRange = {
			start: null,
			end: null,
			minDate: null,
			maxDate: new Date(),
			disabled: false,
			dateOnly: true
		};
		this.tips = this.pageWarnTips = this.maxNumberTips = null;
		// 商品状态
		this.statusList = [
			{
				'title': '不限',
				'value': null
			},
			{
				'title': '在架',
				'value': '1'
			},
			{
				'title': '下架',
				'value': '0'
			}
		];

		this.shopListFieldsMap = {
			valueField: 'shopId',
			displayField: 'shopName'
		};
		this.shopCategoriesFieldsMap = this.categoriesFieldsMap = this.propsPidFieldsMap = {
			valueField: 'id',
			displayField: 'name'
		};
		this.propsVidFieldsMap = {
			valueField: 'id',
			displayField: 'value'
		};
		this.statusListFieldsMap = {
			valueField: 'value',
			displayField: 'title'
		};

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
		// form 表单搜索配置项
		this.formConfig = {
			shopId: 'equal',
			id: 'equalArray',
			name: 'fuzzySearch',
			shopCategoriesId: 'fuzzymutipleArray',
			categoriesId: 'equal',
			propsPid: 'equal',
			propsVid: 'fuzzySearch',
			propsVname: 'fuzzySearch',
			status: 'equal',
			outerId: 'fuzzySearch',
			startListTime: 'lessEqual',
			endListTime: 'greaterEqual',
			minPrice: 'lessEqual',
			maxPrice: 'greaterEqual'
		};
		this.skuFormConfig = {
			skusOuterId: 'fuzzySearch',
			skusPropsVname: 'fuzzySearch',
			skusId: 'equalArray'
		};

		this.initForm();

		this.allGoodsFormModel = {};
		this.selectedDateRangeModel = cloneDeep(this.dateRange);
		this.selectedGoodsFormModel = cloneDeep(this.formModel);
		// 商品自自定义类目数据
		this.getShopCatories();
		// 商品标准类目列表
		this.getCatories();
		// 全部商品->表格配置
		this.selectedItems = [];
		// selectedItemsBuffer 保存 selectedItems 中数据的副本（深拷贝）。维护 selectedItems 中数据状态。
		// 用作返回上一页时进行数据 merge，保持全部商品 tab 和已选商品 tab 的商品状态（checked/unchecked/partial、extend）一致。
		this.selectedItemsBuffer = [];

		transformGoodsData(this._shopInfoData, this._selectedData, this._serverName, this.isSupportedSku).then(data => {
			if (data && data.length) {
				data.forEach(entity => {
					this.selectedItems.push(entity);
					this.selectedItemsBuffer.push(cloneDeep(entity));
				});
				this.updateGrid();
			}
		});
		this.pagerGridOptions = {
			resource: this._$resource(`${this._serverName}${apiPrefix}/items`),
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
					this.pageWarnTips = this._$ccTips.error('<span class="sd-max-number-error-msg"></span>');
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
					// 全部商品列表 -> 当页数改变的时候，更新列表中的商品状态，保持和已选商品状态一致。
					this.dataMerge(res.list, this.selectedItemsBuffer);
					this.selectedItems.forEach((item, index) => {
						let targetIndex = this.findEntity(res.list, item);
						if (targetIndex !== -1) {
							this.selectedItems.splice(index, 1);
							this.selectedItems.push(res.list[targetIndex]);
						}
					});
					this.currentPageChecked = this.isAllChildrenSelected(res.list);
					res.list.forEach(item => {
						if (this.formModel.skusPropsVname || this.formModel.skusId.length || this.formModel.skusOuterId) {
							item.extend = true;
						} else {
							item.extend = false;
						}
						if (!this.isSupportedSku && item.skus && item.skus.length) {
							delete item.skus;
						}
					});
					this.isExtendAll = this.isAllChildrenExtend(res.list);
				}
				this.resInfo = res;
				return res;
			}
		};
		this.pagerGridOptions.rowCellTemplate = rowCellTemplate;
		this.pagerGridOptions.skuRowCellTemplate = skuRowCellTemplate;
		this.pagerGridOptions.selectedData = this.selectedItems;
		// 获取 sku 标题
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
			const currentPage = opts.pager.pageNum;
			const pageSize = opts.pager.pageSize;
			const data = [];
			this.selectedItems.forEach(item => {
				if (!item.isHide) {
					data.push(item);
				}
			});
			this.selectedItems.forEach(item => {
				if (this.formModel.skusPropsVname || this.formModel.skusId.length || this.formModel.skusOuterId) {
					item.extend = true;
				} else {
					item.extend = false;
				}
			});
			this.isSelectedExtendAll = this.isAllChildrenExtend(this.selectedItems);
			this._$ccGrid.refresh(wrapGridData(currentPage, pageSize, data)).then(() => {
				this.showLoading = false;
			});
		};
	}


	// form 表单初始化
	initForm() {
		this.formModel = {
			platform: this.shopList[0].plat, // 平台
			shopId: this.shopList[0].shopId, // 店铺
			id: [], // 商品ID数组??????????
			name: null, // 商品名称模糊匹配
			shopCategoriesId: [], // shopCategories.id 店铺类目数组
			categoriesId: null, // categories.id 标准类目
			propsPid: null, // props.pid 属性ID
			propsVid: null, // props.vid 属性值ID
			propsVname: null, // props.vid 属性值ID
			status: this.statusList[0].value, // 状态, true 在架, false 不在架
			skusPropsVname: null, // skus.props.vname SKU属性值模糊匹配
			outerId: null, // 商品商家编码
			skusOuterId: null, // skus.outerId SKU 商家编码
			skusId: [], // skus.id SKUID数组-----------
			startListTime: null, // 上架时间起始值, Unix时间戳，毫秒
			endListTime: null, // 上架时间结束值, Unix时间戳，毫秒
			minPrice: null, // 商品价格下限
			maxPrice: null // 商品价格下限
		};
		// 日期组件的特殊性
		this.dateRange.start = null;
		this.dateRange.end = null;
	}
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
		}).catch(res => {
			if (!this.tips || !this.tips.element) {
				this.tips = this._$ccTips.error('<span style="color: red;">出错提示：</span>后台服务出错，请联系数云客服人员');
			}
		});
	}
	// 获取商品标准类目列表
	getCatories() {
		genResource(`${this._serverName}${apiPrefix}/categories?platform=${this.formModel.platform}&shopId=${this.formModel.shopId}`, false, null).get().$promise.then(res => {
			let data = res.data || [];
			this.categoriesList = data.filter(item => item.isLeaf === true);
		}).catch(res => {
			if (!this.tips || !this.tips.element) {
				this.tips = this._$ccTips.error('<span style="color: red;">出错提示：</span>后台服务出错，请联系数云客服人员');
			}
		});
	}
	// 级联菜单 -> 商品标准类目 select 框 change
	categorySelectChange(newValue, oldValue, itemIndex, item) {
		if (this.formModel.categoriesId) {
			genResource(`${this._serverName}${apiPrefix}/categories/${item.id}/properties?platform=${this.formModel.platform}&shopId=${this.formModel.shopId}`, false, null).get().$promise
				.then(res => {
					this.propsPidList = res.data || [];
					this.formModel.propsPid = this.propsPid;
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
			this.formModel.propsVid = cloneDeep(this.propsVid);
		} else {
			this.propsVidList = [];
			this.formModel.propsVid = undefined;
			this.propsVid = undefined;
			this.formModel.propsVname = null;
		}
	};
	// 店铺 select 框 change
	shopSelectChange(newValue, oldValue, itemIndex, item) {
		this.getShopCatories();
		this.getCatories();
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
			this.allDateRangeModel = cloneDeep(this.dateRange);
			this.allGoodsFormModel = cloneDeep(this.formModel);
			this.handleForm(this.selectedDateRangeModel, this.selectedGoodsFormModel);
			this.isSelectedExtendAll = this.isAllChildrenExtend(this.selectedItems);
			this.showLoading = true;
			setTimeout(() => {
				this.selectedPagerGridOptions.pager.pageNum = 1;
				this.selectedPagerGridOptions.onRefresh(this.selectedPagerGridOptions);
			}, 0);
		} else {
			this.isSelectedGoodsTab = false;
			this.selectedDateRangeModel = cloneDeep(this.dateRange);
			this.selectedGoodsFormModel = cloneDeep(this.formModel);
			this.handleForm(this.allDateRangeModel, this.allGoodsFormModel);
			if (this.selectedItemsBuffer.length) {
				this.dataMerge(this.resInfo.list, this.selectedItemsBuffer);
			} else {
				this.resInfo.list.forEach(item => {
					this.resetRootItem(item);
				});
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
		this.checkedAll = false;
		this._$ccValidator.validate(this.goodsSelectorForm).then(() => {
			console.log(this.formModel);
			if (!isSelectedGoodsTab) {
				this.transformParams();
				this.updateGrid();
			} else {
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
				this.selectedPagerGridOptions.onRefresh(this.selectedPagerGridOptions);
			}
		}, () => {});
	};
	// 重置表单，恢复初始值
	reset(formCtrl) {
		this._$ccValidator.setPristine(formCtrl);
		for (let attr in this.formModel) {
			if (this.formModel.hasOwnProperty(attr) && attr !== 'platform' && attr !== 'shopId') {
				if (Array.isArray(this.formModel[attr])) {
					this.formModel[attr] = [];
				} else {
					this.formModel[attr] = null;
				}
			}
		}
		this.dateRange.start = null;
		this.dateRange.end = null;
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
	delSelectedItems(list) {
		list.forEach(item => {
			let targetIndex = this.findEntity(this.selectedItems, item);
			if (targetIndex !== -1) {
				this.selectedItems.splice(targetIndex, 1);
			}
		});
	}
	// 将参数对象转换成 & 符号连接的形式
	formParamsTransform() {
		this.transformParams();
		let queryParams = cloneDeep(this.pagerGridOptions.queryParams);
		let paramsArr = [];
		for (let attr in queryParams) {
			if (queryParams.hasOwnProperty(attr) && (queryParams[attr] || queryParams[attr] === 0)) {
				let param = queryParams[attr];
				if (!Array.isArray(param) && attr !== 'pageNum' && attr !== 'pageSize') {
					paramsArr.push(`${attr}=${param}`);
				}
				if (Array.isArray(param)) {
					param.forEach(item => {
						paramsArr.push(`${attr}=${item}`);
					});
				}
			}
		}
		console.log(paramsArr.join('&'));
		return paramsArr.join('&');
	}
	// 全部全选/全部不选
	selectAll() {
		if (this.checkedAll) {
			this.isShowMask = true;
			this.resInfo.list.forEach(item => { this.checkRootItem(item); });
			let goodsNum = this.pagerGridOptions.pager.totals < onceMaxSelectedNumber ? this.pagerGridOptions.pager.totals : onceMaxSelectedNumber;
			genResource(`${this._serverName}${apiPrefix}/items?pageNum=1&pageSize=${ goodsNum }&${ this.formParamsTransform() }`, false, null).get().$promise.then(res => {
				this.data = res.data || [];
				this.data.forEach(item => { this.checkRootItem(item); });
				this.getSelectedItems(this.data);
				this.getSelectedItemsBuffer();
				this.isShowMask = false;
			});
		} else {
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
	findEntityBySkuOuterId(collection, entity) {
		return collection.findIndex(item => angular.equals(item, entity.skuOuterId));
	}
	findEntityByOuterId(collection, entity) {
		return collection.findIndex(item => angular.equals(item, entity.outerId));
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
	checkCurrentPageBefore(event) {
		const target = event.target;
		const targetScope = angular.element(target).scope();
		const uncheckedItems = this.getUncheckedItems();
		if (!targetScope.$parent.$ctrl.ngChecked && this.selectedItems.length + uncheckedItems.length > this._maxSelectedNumber) {
			this.moreThanSelectedMaxNumber(event);
		}
	}
	checkAllBefore(event) {
		const target = event.target;
		const targetScope = angular.element(target).scope();
		if (!targetScope.$parent.$ctrl.ngChecked) {
			if (onceMaxSelectedNumber <= this._maxSelectedNumber) {
				// 单次全选的最大值小于等于全选商品允许的最大值
				if (this.pagerGridOptions.pager.totals > onceMaxSelectedNumber) { // 测试 20
					if (this.pagerGridOptions.pager.totals > this._maxSelectedNumber) { // 测试 30
						this.moreThanSelectedMaxNumber(event);
					} else {
						this.moreThanOnceSelectedMaxNumber(event);
					}
				}
			} else {
				// 单次全选的最大值大于全选商品允许的最大值
				if (this.pagerGridOptions.pager.totals > this._maxSelectedNumber) {
					this.moreThanSelectedMaxNumber(event);
				}
			}
		}
	}
	getUncheckedItems() {
		return this.resInfo.list.filter(item => {
			return !item.checked && !item.partial;
		});
	}
	// 已选商品数超过已选商品最大允许选择数
	moreThanSelectedMaxNumber(event) {
		event.stopPropagation();
		this.maxNumberTips = this._$ccTips.error(getExceedSelectedNumberMsg(this._maxSelectedNumber));
	}
	// 已选商品数超过单次最大允许全选商品数
	moreThanOnceSelectedMaxNumber(event) {
		event.stopPropagation();
		this.maxNumberTips = this._$ccTips.error(`当前商品超过${ onceMaxSelectedNumber }个，不支持全部选中，请修改条件后重新搜索。`);
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
		this._modalInstance.ok(this.selectedItems);
	}
	// 批量添加 -- 后端查询
	addSection() {
		const modalInstance = this._$ccModal
			.modal({
				scope: this._$scope,
				title: '批量导入商品ID',
				fullscreen: false,
				locals: {
					data: [1, 2, 3]
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
			this.transformParams();
			if (obj.inputKey === 'id') {
				this.pagerGridOptions.queryParams['id'] = obj.inputValue;
			}
			// 需要后端提供接口：使 sku 商家编码和商品商家编码支持数组查询，需要返回导入成功以及导入失败的数据。
			// 根据新接口进行查询，对已选商品数组和已选商品数组的副本进行数据 merge，然后跳转到已选商品 tab 页面
			// TODO TODO TODO
			this.updateGrid();
		}, v => {
			console.log(v);
		});
	}
}
