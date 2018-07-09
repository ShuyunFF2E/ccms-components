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
	 * @params isSupportedSku bool 是否支持 sku，默认支持
	 * @params isSupportedGoodsLabel bool 是否支持商品标签，默认不支持
	 * @params selectedGoods array 外部传进来的已选商品
	 * @params isSupportedAddCondition bool 是否支持添加为搜索条件，默认不支持
	 * */
	goodsSelector(shopInfo, { isOnlyChecked = false, maxSelectedNumber = 100, serverName = '', isSupportedSku = true, isSupportedGoodsLabel = false, isSupportedAddCondition = false }, selectedGoods = []) {

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
				locals: {
					shopInfoData: shopInfo,
					isOnlyChecked: isOnlyChecked,
					maxSelectedNumber: maxSelectedNumber,
					serverName: serverName,
					selectedData: selectedGoods,
					isSupportedSku: isSupportedSku,
					isSupportedGoodsLabel: isSupportedGoodsLabel,
					isSupportedAddCondition: isSupportedAddCondition
				},
				controller: GoodsSelectorController,
				controllerAs: '$ctrl',
				onClose: noop
			}
		);
	}
};

export default GoodsSelectorService;
