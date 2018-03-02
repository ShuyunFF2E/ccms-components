import { Inject } from 'angular-es-utils/decorators';

@Inject('$ccTips', '$element', 'modalInstance', 'selectedData', 'shopInfoData', '$ccValidator')
export default class GoodsSelectorCtrl {

	$onInit() {
		// 已选商品列表
		// this.selectedGoods = this._selectedData;

		// 店铺信息 -> 如果是 array, 说明需要显示店铺列表
		//         -> 如果是 object, 说明是单店铺
		//         -> 其它情况, 需要提示用户, 参数格式不正确

		this.isShowShopList = Array.isArray(this._shopInfoData);
		this.isTaobao = this.isShowShopList ? this._shopInfoData[0].plat : this._shopInfoData.plat;

		// form 区域日期配置
		this.dateRange = {
			start: null,
			end: null,
			disabled: false,
			dateOnly: true
		};

		// form 区域model配置
		this.formModel = {
			shopName: null,
			shopId: null,
			shopNumber: null,
			goodsCustom: [],
			goodsLabel: [],
			standardClassify: '',
			goodsAttr: '',
			goodsAttrValue: [],
			goodsStatus: '不限',
			goodsCode: '',
			shopCode: '',
			SKUShopCode: '',
			SKUStandard: '',
			dateFrom: this.dateRange.start,
			dateTo: this.dateRange.end,
			goodsLowPrice: null,
			goodsHighPrice: null
		};

		this.fieldsMap = {
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
			}
		};
		// 表单提交前的校验
		this.search = function() {
			this._$ccValidator.validate(this.goodsSelectorForm).then(() => {
				console.log('校验成功!');
			}, () => {
				console.log('校验失败!');
			});
		};
		// 重置表单，恢复初始值
		this.reset = function(formCtrl) {
			this._$ccValidator.setPristine(formCtrl);
			this.formModel = {
				shopName: '店铺1',
				shopId: '',
				shopNumber: '',
				goodsCustom: ['自定义类目1'],
				goodsLabel: [],
				standardClassify: '',
				goodsAttr: '',
				goodsAttrValue: [],
				goodsStatus: '不限',
				goodsCode: '',
				shopCode: '',
				SKUShopCode: '',
				SKUStandard: '',
				dateFrom: this.dateRange.start,
				dateTo: this.dateRange.end,
				goodsLowPrice: '',
				goodsHighPrice: ''
			};
		};
	}
}
