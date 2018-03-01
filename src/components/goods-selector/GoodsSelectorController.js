import { Inject } from 'angular-es-utils/decorators';


@Inject('$ccTips', '$element', 'modalInstance', 'selectedData')
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
			dateOnly: false
		};
		// this.formModel = {
		// 	shopName: this.selectedGoods.shopList[0].value,
		// 	shopId: '',
		// 	shopNumber: '',
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
	}

}
