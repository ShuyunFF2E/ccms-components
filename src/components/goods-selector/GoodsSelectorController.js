import { Inject } from 'angular-es-utils/decorators';
// import { isObject } from 'angular-es-utils/type-auth';

@Inject('$ccTips', '$element', 'modalInstance', 'selectedData', 'shopInfoData')
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
			// start: new Date(2016, 2, 10),
			// end: new Date(2016, 2, 20),
			disabled: false,
			dateOnly: true
		};
	}
}
