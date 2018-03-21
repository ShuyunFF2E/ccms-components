import './_goods-selector.scss';

import ModalService from '../modal/ModalService';
import bodyTemplate from './goods-seletor-body.tpl.html';
import GoodsSelectorController from './GoodsSelectorController';

const noop = () => {
};

/**
 * modal服务
 */
const GoodsSelectorService = {
	/**
	 * @params shopInfo array|object array 表示有店铺选择 object 表示没有店铺选择 (必填)
	 * @params selectedGoods array 已选商品列表 默认是[](可选)
	 * */
	goodsSelector(shopInfo, selectedGoods = []) {

		if (typeof shopInfo === 'undefined') {
			throw new Error('goodsSelector 缺少 shopInfo 参数');
		}

		return ModalService.modal(
			{
				title: '商品选择',
				style: {'width': '1025px', 'min-width': '1025px', 'max-width': '1025px', 'min-height': '530px'},
				fullscreen: false,
				hasFooter: true,
				__body: bodyTemplate,
				locals: {shopInfoData: shopInfo, selectedData: selectedGoods},
				controller: GoodsSelectorController,
				controllerAs: '$ctrl',
				onClose: noop
			}
		);
	}
};

export default GoodsSelectorService;
