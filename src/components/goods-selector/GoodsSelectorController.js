import { Inject } from 'angular-es-utils/decorators';
// import { isObject } from 'angular-es-utils/type-auth';

@Inject('$ccTips', '$element', 'modalInstance', 'selectedData', 'shopInfoData')
export default class GoodsSelectorCtrl {

	$onInit() {
		// this.selectedGoods = this._selectedData;
		this.dateRange = {
			start: new Date(2016, 2, 1),
			end: new Date(2020, 2, 31),

			minDate: new Date(2016, 2, 1),
			maxDate: new Date(2020, 2, 31),

			// 是否禁用 (false)
			disabled: false,

			// 是否显示时间 (true)
			dateOnly: true
		};
		// this.formModel = {
		// 	shopName: this.selectedGoods.shopList[0].value,
		// 	shopId: '',
		// 	shopNumber: '',
		// goodsTitle: '',
		// 	goodsCustom: [this.selectedGoods.goodsCustomList[0].value],
		// 	goodsLabel: [],
		// 	standardClassify: '',
		// 	goodsAttr: '',
		// 	goodsAttrValue: [],
		// 	goodsStatus: this.selectedGoods.goodsStatusList[0].value,
		// 	goodsCode: '',
		// 	shopCode: '',
		// 	SKUShopCode: '',
		// 	SKUStandard: '',
		// 	dateFrom: this.dateRange.start,
		// 	dateTo: this.dateRange.end,
		// 	goodsLowPrice: '',
		// 	goodsHighPrice: ''
		// };
		// this.fieldsMap = {
		// 	valueField: 'value',
		// 	displayField: 'title'
		// };
		// this.onSelectChange = function({ model, oldModel, itemIndex, item }) {
		// };
		this.testData = {shopId: 11111, shopName: '数云食堂', plat: 'jos'};
		// this.testData = {shopId: 11111, shopName: '数云食堂', plat: 'taobao'};
		// this.testData = [{shopId: 11111, shopName: '数云食堂', plat: 'taobao'}, {shopId: 10001, shopName: 'JD数云食堂', plat: 'jos'}];
		// this.testData = [{shopId: 10001, shopName: 'JD数云食堂', plat: 'jos'}, {shopId: 11111, shopName: '数云食堂', plat: 'taobao'}];
		this.isShowShopList = this.shopInfoJudge(this.testData);
		this.istaobao = this.taobaoJudge(this.testData);
	}

	// 根据shopInfo是数组还是对象判断是否显示商铺列表,是数组返回true，是对象返回false
	shopInfoJudge(shopInfoData) {
		return shopInfoData.length > 1;
	}
	// 判断是否是淘宝店铺
	taobaoJudge(shopInfoItem) {
		if (this.isShowShopList) {
			return shopInfoItem[0].plat === 'taobao';
		} else {
			return shopInfoItem.plat === 'taobao';
		}
	}
	// 判断是否是简单搜索，注意当没有商铺列表的时候不存在简单搜索
	simpleSearchJudge() {
		return this.isSimpleSearch && !this.isShowShopList;
	}
}
