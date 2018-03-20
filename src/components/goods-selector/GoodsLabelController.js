import { Inject } from 'angular-es-utils/decorators';

@Inject('$ccTips', '$element', 'modalInstance', 'goodsLabelInfo')
export default class GoodsLabelController {
	$onInit() {
		this.tree = this._goodsLabelInfo;

		this.selectedIds = [22, 23];

		this.select = (item, data) => {
			console.log(item);// obj
			console.log(data);// true
		};
	}
}
