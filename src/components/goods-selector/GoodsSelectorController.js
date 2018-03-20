import { Inject } from 'angular-es-utils/decorators';
import rowCellTemplate from './tpls/customer-row-cell.tpl.html';
import skuRowCellTemplate from './tpls/customer-sku-row-cell.tpl.html';
import emptyTpl from './tpls/customer-empty.tpl.html';

import angular from 'angular';

@Inject('$ccTips', '$element', 'modalInstance', 'selectedData', 'shopInfoData', '$ccValidator', '$resource', 'selectedData', '$scope', '$ccGrid')

export default class GoodsSelectorCtrl {

	$onInit() {
		// 已选商品列表
		// this.selectedGoods = this._selectedData;

		// 店铺信息 -> 如果是 array, 说明需要显示店铺列表
		//         -> 如果是 object, 说明是单店铺
		//         -> 其它情况, 需要提示用户, 参数格式不正确

		this.isShowShopList = Array.isArray(this._shopInfoData);
		this.isTaobao = this.isShowShopList ? this._shopInfoData[0].plat === 'taobao' : this._shopInfoData.plat === 'taobao';

		// form 区域日期配置
		this.dateRange = {
			start: null,
			end: null,
			disabled: false,
			dateOnly: true
		};

		this.shopList = this.isShowShopList ? this._shopInfoData : [this._shopInfoData];
		console.log(this.shopList);
		// 测试数据
		this.selectedGoods = {
			'shopList': this.shopList,
			'goodsCustomList': [
				{
					'title': '不限',
					'value': '不限'
				},
				{
					'title': '自定义类目1',
					'value': '自定义类目1'
				},
				{
					'title': '自定义类目2',
					'value': '自定义类目2'
				},
				{
					'title': '自定义类目3',
					'value': '自定义类目3'
				},
				{
					'title': '自定义类目4',
					'value': '自定义类目4'
				}
			],
			'goodsLabelList': [
				{
					'title': '商品标签1',
					'value': '商品标签1'
				},
				{
					'title': '商品标签2',
					'value': '商品标签2'
				},
				{
					'title': '商品标签3',
					'value': '商品标签3'
				},
				{
					'title': '商品标签4',
					'value': '商品标签4'
				}
			],
			'cascadeSelectMenu': [
				{
					'title': '标准类目1',
					'value': '标准类目1',
					'children': [
						{
							'title': '商品属性1',
							'value': '商品属性1',
							'children': [
								{
									'title': '属性值1',
									'value': '属性值1'
								},
								{
									'title': '属性值2',
									'value': '属性值2'
								}
							]
						},
						{
							'title': '商品属性2',
							'value': '商品属性2',
							'children': [
								{
									'title': '属性值3',
									'value': '属性值3'
								},
								{
									'title': '属性值4',
									'value': '属性值4'
								}
							]
						}
					]
				},
				{
					'title': '标准类目2',
					'value': '标准类目2',
					'children': [
						{
							'title': '商品属性3',
							'value': '商品属性3',
							'children': [
								{
									'title': '属性值5',
									'value': '属性值5'
								},
								{
									'title': '属性值6',
									'value': '属性值6'
								}
							]
						},
						{
							'title': '商品属性4',
							'value': '商品属性4',
							'children': [
								{
									'title': '属性值7',
									'value': '属性值7'
								},
								{
									'title': '属性值8',
									'value': '属性值8'
								}
							]
						}
					]
				}
			],
			'goodsStatusList': [
				{
					'title': '不限',
					'value': '不限'
				},
				{
					'title': '在架',
					'value': '在架'
				},
				{
					'title': '下架',
					'value': '下架'
				}
			]
		};

		this.shopFieldsMap = {
			valueField: 'shopId',
			displayField: 'shopName'
		};
		this.shopFieldsMap = {
			valueField: 'value',
			displayField: 'title'
		};
		this.goodsCustomFieldsMap = {
			valueField: 'value',
			displayField: 'title'
		};
		this.goodsLabelFieldsMap = {
			valueField: 'value',
			displayField: 'title'
		};
		this.standardClassifyFieldsMap = {
			valueField: 'value',
			displayField: 'title'
		};
		this.goodsAttrFieldsMap = {
			valueField: 'value',
			displayField: 'title'
		};
		this.goodsAttrValueFieldsMap = {
			valueField: 'value',
			displayField: 'title'
		};
		this.goodsStatusFieldsMap = {
			valueField: 'value',
			displayField: 'title'
		};

		this.initForm();

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
					const h = parseFloat(this.formModel.goodsHighPrice);
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
					const l = parseFloat(this.formModel.goodsLowPrice);
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

		// 筛选
		this.search = () => {
			this._$ccValidator.validate(this.goodsSelectorForm).then(() => {
				console.log('校验成功!');
			}, () => {
				console.log('校验失败!');
			});
			this.formModel.dateFrom = this.dateRange.start.toLocaleDateString();
			this.formModel.dateTo = this.dateRange.end.toLocaleDateString();
			console.log(this.formModel);
		};
		// 重置表单，恢复初始值
		this.reset = formCtrl => {
			this._$ccValidator.setPristine(formCtrl);
			this.initForm();
		};

		// 点击已选商品tab：表单中商铺列表项显示当前商铺，不可更改，其他恢复默认值
		this.isShopListDisabled = false;
		this.oldFormModel = {};
		this.selectedGoodsClick = () => {
			this.oldFormModel = this.deepCopy(this.formModel);
			this.initForm();
			this.formModel.shopName = this.oldFormModel.shopName;
			this.isShopListDisabled = true;
		};
		// 点击全部商品tab：表单显示上一次的选项，商铺列表项可更改
		this.allGoodsClick = () => {
			Object.assign(this.formModel, this.oldFormModel);
			this.isShopListDisabled = false;
		};

		// 全部商品->表格配置
		this._selectedData.forEach(item => {
			item.checked = true;
			item.partial = false;
			item.skus.forEach(sku => {
				sku.checked = true;
			});
		});
		this.selectedItems = this._selectedData.concat();
		// selectedItemsBuffer 保存 selectedItems 中数据的副本（深拷贝）。维护 selectedItems 中数据状态。
		// 用作返回上一页时进行数据 merge，保持全部商品 tab 和已选商品 tab 的商品状态（checked/unchecked/partial、extend）一致。
		this.selectedItemsBuffer = this._selectedData.concat();
		this.pagerGridOptions = {
			resource: this._$resource('/api/gridData/1'),
			response: null,
			queryParams: {
				pageNum: 1
			},
			columnsDef: [
				{
					field: 'id',
					displayName: '商品ID',
					align: 'left'
				},
				{
					field: 'quantity',
					displayName: '库存',
					align: 'left',
					sortProp: 'storeCount'
				},
				{
					field: 'price',
					displayName: '价格',
					align: 'left'
				},
				{
					field: 'outerId',
					displayName: '商家编码',
					align: 'left'
				}
			],
			headerTpl: '/src/components/goods-selector/tpls/customer-header.tpl.html',
			rowTpl: '/src/components/goods-selector/tpls/customer-row.tpl.html',
			footerTpl: '/src/components/goods-selector/tpls/customer-footer.tpl.html',
			emptyTipTpl: emptyTpl,
			transformer: res => {
				this.resInfo = res;
				this.currentPageChecked = false;
				// 全部商品列表 -> 当页数改变的时候，更新列表中的商品状态，保持和已选商品状态一致。
				this.dataMerge(this.resInfo.list, this.selectedItemsBuffer);
				console.log(this.resInfo);
				return res;
			},
			pager: {
				pageSize: 10
			}
		};
		this.pagerGridOptions.isCheckedGoodsTab = false;
		this.pagerGridOptions.rowCellTemplate = rowCellTemplate;
		this.pagerGridOptions.skuRowCellTemplate = skuRowCellTemplate;
		this.pagerGridOptions.selectedData = this.selectedItems;
		// 表格子行的展开和收起
		this.pagerGridOptions.handleTreeIcon = entity => {
			entity.extend = !entity.extend;
		};
		// 展开/折叠全部
		this.extendAll = (isExtend, data) => {
			data.forEach(item => {
				item.extend = isExtend;
			});
		};
		// checked 父亲, 所有孩子 checked,
		// 反之 unchecked 父亲, 所有孩子 unchecked
		this.pagerGridOptions.selectTreeRootItem = entity => {
			entity.checked = !entity.checked;
			entity.partial = false;
			entity.skus.forEach(item => {
				item.checked = entity.checked;
			});

			// 任意一个父亲被 unchecked 掉, 表格上方的全选当页, 被 unchecked
			if (!entity.checked) {
				this.currentPageChecked = false;
			}
			// 将已选商品 push 到 selectedItems 中
			//    -> 如果父亲 checked 并且不存在于 selectedItems 数组中，则将父亲(包括sku数据)整体 push 到数组中；
			//    -> 如果父亲 unchecked 并且存在于 selectedItems 数组中，则将父亲这个整体删除
			//    -> 其它情况不处理

			let entityIndex = this.findEntity(this.selectedItems, entity);
			if (entity.checked && entityIndex === -1) {
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
			if (!sku.checked) {
				this.currentPageChecked = false;
			}
			// 将已选商品 push 到 selectedItems 中
			//    -> 如果父亲状态是 checked，且不存在于 selectedItems 中, 则将父亲(包括 sku) push 到 selectedItems 数组中；
			//    -> 如果父亲状态是 partial，且存在于 selectedItems 中，则用父亲(包括 sku)替换已存在 entity；
			//    -> 如果父亲状态是 unchecked，则将其从 selectedItems 中删除
			if (entity.checked) {
				if (this.findEntity(this.selectedItems, entity) === -1) {
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
		// 全选当页
		this.selectCurrentPageAll = () => {
			// currentPageChecked -> 全选当页 (true or false)
			this.currentPageChecked = !this.currentPageChecked;
			this.resInfo.list.forEach(item => {
				item.checked = this.currentPageChecked;
				item.partial = false;
				item.skus && item.skus.forEach(sku => {
					sku.checked = this.currentPageChecked;
				});
			});
			if (this.currentPageChecked) {
				this.resInfo.list.forEach(item => {
					if (this.findEntity(this.selectedItems, item) === -1) {
						this.selectedItems.push(item);
					}
				});
			} else {
				this.resInfo.list.forEach(item => {
					let targetIndex = this.findEntity(this.selectedItems, item);
					if (targetIndex !== -1) {
						this.selectedItems.splice(targetIndex, 1);
					}
				});
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
		this.selectedPagerGridOptions.queryParams = {
			pageNum: 1
		};
		this.selectedPagerGridOptions.pager = {
			pageNum: 1,
			pageSize: 10
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
			// 任意一个孩子被 remove 掉, 表格上方的全选当页, 被 unchecked
			this.currentPageChecked = this.isAllChildrenSelected(this.resInfo.list);
		};
		// 移除全部
		// -> selectedItems 和 resInfo.list 是引用关系，因此为了保持状态一致，在删除父亲之前先改变其状态；
		// -> 然后清空 selectedItemsBuffer
		this.removeAll = () => {
			this.selectedItems.forEach(entity => {
				this.resetRootItem(entity);
			});
			this.selectedItemsBuffer.splice(0, this.selectedItemsBuffer.length);
			this.selectedItems.splice(0, this.selectedItems.length);
			// 表格上方的全选当页, 被 unchecked
			this.currentPageChecked = false;
		};
	}
	// form 表单初始化
	initForm() {
		this.formModel = {
			shopName: this.selectedGoods.shopList[0].shopName,
			shopId: null,
			shopNumber: null,
			goodsCustom: [this.selectedGoods.goodsCustomList[0].title],
			goodsLabel: [],
			standardClassify: null,
			goodsAttr: null,
			goodsAttrValue: [],
			goodsStatus: this.selectedGoods.goodsStatusList[0].title,
			goodsCode: null,
			shopCode: null,
			SKUShopCode: null,
			SKUStandard: null,
			dateFrom: null,
			dateTo: null,
			goodsLowPrice: null,
			goodsHighPrice: null
		};
	}
	// 深拷贝,返回新对象
	deepCopy(p, c = {}) {
		for (var i in p) {
			if (typeof p[i] === 'object') {
				c[i] = (p[i].constructor === Array) ? [] : {};
				this.deepCopy(p[i], c[i]);
			} else {
				c[i] = p[i];
			}
		}
		return c;
	}
	// 从集合中获取 entity 的 index, 找不到返回 -1
	findEntity(collection, entity) {
		return collection.findIndex(item => angular.equals(item.id, entity.id));
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
	// 将商品状态恢复成初始状态
	resetRootItem(entity) {
		entity.checked = false;
		entity.partial = false;
		entity.skus && entity.skus.forEach(sku => {
			sku.checked = false;
		});
	}
	// 获取 selectedItems 的副本 selectedItemsBuffer
	getSelectedItemsBuffer() {
		this.selectedItemsBuffer = [];
		this.selectedItems.forEach(item => {
			this.selectedItemsBuffer.push(this.deepCopy(item));
		});
	}
	// 更新 selectedItems 的副本 selectedItemsBuffer
	updateSelectedItemsBuffer(entity) {
		let index = this.findEntity(this.selectedItemsBuffer, entity);
		if (index !== -1) {
			this.selectedItemsBuffer.splice(index, 1);
			this.selectedItemsBuffer.push(this.deepCopy(entity));
		}
	}
	// merge->分页时进行页的切换时需要保持商品被选状态
	dataMerge(goodsArr, selectedGoodsArr) {
		for (let i = 0; i < goodsArr.length; i++) {
			for (let j = 0; j < selectedGoodsArr.length; j++) {
				if (goodsArr[i].id === selectedGoodsArr[j].id) {
					goodsArr[i] = this.deepCopy(selectedGoodsArr[j]);
					break;
				}
			}
		}
	}
}
