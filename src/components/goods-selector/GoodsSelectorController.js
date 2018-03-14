import { Inject } from 'angular-es-utils/decorators';
import rowCellTemplate from './tpls/customer-row-cell.tpl.html';
import skuRowCellTemplate from './tpls/customer-sku-row-cell.tpl.html';
import emptyTpl from './tpls/customer-empty.tpl.html';

import angular from 'angular';

@Inject('$ccTips', '$element', 'modalInstance', 'selectedData', 'shopInfoData', '$ccValidator', '$resource')

export default class GoodsSelectorCtrl {

	$onInit() {

		let self = this;
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

		this.initForm();

		this.shopFieldsMap = {
			valueField: 'shopName',
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
		this.search = function() {
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
		this.reset = function(formCtrl) {
			this._$ccValidator.setPristine(formCtrl);
			this.initForm();
		};

		// 点击已选商品tab：表单中商铺列表项显示当前商铺，不可更改，其他恢复默认值
		this.isShopListDisabled = false;
		this.oldFormModel = {};
		this.selectedGoodsClick = function() {
			this.oldFormModel = this.deepCopy(this.formModel);
			this.initForm();
			this.formModel.shopName = this.oldFormModel.shopName;
			this.isShopListDisabled = true;
		};
		// 点击全部商品tab：表单显示上一次的选项，商铺列表项可更改
		this.allGoodsClick = function() {
			Object.assign(this.formModel, this.oldFormModel);
			this.isShopListDisabled = false;
		};

		// 表格配置
		this.selectAll = true;
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
			emptyTipTpl: emptyTpl,
			transformer: function(res) {
				res.list.forEach(item => {
					item['checked'] = false;
					item['indeterminate'] = false;
					item['checkedChildrenCount'] = 0;
					item.skus && item.skus.length && item.skus.forEach(item1 => {
						item1['checked'] = false;
						item1['indeterminate'] = false;
					});
				});
				console.log(res.list);
				return res;
			}
		};
		this.pagerGridOptions.rowCellTemplate = rowCellTemplate;
		this.pagerGridOptions.skuRowCellTemplate = skuRowCellTemplate;
		// 表格子行的展开和收起
		this.pagerGridOptions.clickExtend = function(event) {
			let target = event.target;
			let childrenClass = angular.element(target.parentNode.parentNode)[0].id;// goods-x
			let childrenList = document.querySelectorAll('tbody tr.' + childrenClass);
			for (let i = 0; i < childrenList.length; i++) {
				childrenList[i].classList.toggle('hide');
			}
		};
		// 选择父亲则孩子全选，选择部分孩子父亲半选，选择全部孩子父亲选
		this.pagerGridOptions.clickParentItem = function(event) {
			let target = event.target;
			let parentEntity = angular.element(target).scope().$parent.entity;

			parentEntity.checked = !parentEntity.checked;

			let childrenClass = angular.element(target.parentNode.parentNode.parentNode.parentNode)[0].id;// goods-x
			let childrenList = document.querySelectorAll('tbody tr.' + childrenClass);
			for (let i = 0; i < childrenList.length; i++) {
				angular.element(childrenList[i]).scope().sku.checked = parentEntity.checked;
			}

			if (parentEntity.checked) {
				self.selectedItems.push(parentEntity);
				parentEntity.checkedChildrenCount = parentEntity.skus.length;
			} else {
				self.selectedItems.splice(self.findEntity(self.selectedItems, parentEntity), 1);
				parentEntity.checkedChildrenCount = 0;
			}
			parentEntity.indeterminate = false;
			// console.log(self.selectedItems);
		};
		this.pagerGridOptions.clickChildrenItem = function(event) {
			let target = event.target;
			let childrenSku = angular.element(target).scope().$parent.sku;

			let parentId = angular.element(target.parentNode.parentNode.parentNode.parentNode)[0].classList[0];

			let parentEntity = angular.element(document.getElementById(parentId)).scope().entity;
			if (childrenSku.checked) {
				parentEntity.checkedChildrenCount++;
			} else {
				parentEntity.checkedChildrenCount--;
			}
			parentEntity.checked = parentEntity.checkedChildrenCount === parentEntity.skus.length;
			parentEntity.indeterminate = parentEntity.checkedChildrenCount > 0 && parentEntity.checkedChildrenCount < parentEntity.skus.length;
		};
		this.selectedItems = [];
	}
	// form 表单初始化
	initForm() {
		this.formModel = {
			shopName: this.selectedGoods.shopList[0].title,
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
	// 从集合中获取entity的index,找	不到返回-1
	findEntity(collection, entity) {
		return collection.findIndex(item => angular.equals(item, entity));
	}
}
