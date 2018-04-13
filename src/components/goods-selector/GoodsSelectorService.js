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
	 * @params isOnlyChecked bool 是否仅允许查看
	 * @params selectedGoods array 已选商品列表 默认是{}(可选)
	 * */
	goodsSelector(shopInfo, isOnlyChecked = false, selectedGoods = []) {

		if (typeof shopInfo === 'undefined') {
			throw new Error('goodsSelector 缺少 shopInfo 参数');
		}
		return ModalService.modal(
			{
				title: '商品选择',
				style: {'width': '1025px', 'min-height': '510px'},
				fullscreen: false,
				hasFooter: !isOnlyChecked,
				__body: bodyTemplate,
				locals: {shopInfoData: shopInfo, isOnlyChecked: isOnlyChecked, selectedData: selectedGoods},
				controller: GoodsSelectorController,
				controllerAs: '$ctrl',
				onClose: noop
			}
		);
	}
};

export default GoodsSelectorService;
