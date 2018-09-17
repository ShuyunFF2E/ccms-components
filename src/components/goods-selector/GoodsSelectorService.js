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
	 * @params tenantId string 租户ID，如果支持商品标签，那么 tenantId 不可为 null
	 * @params selectedGoods array 外部传进来的已选商品
	 * @params isSupportedAddCondition bool 是否支持添加为搜索条件，默认不支持
	 * @params isSingleSelect bool 单选 or 多选 默认是多选
	 * @params isSingleSelectShopList Object 店铺单选/多选，默认是单选
	 * */
	goodsSelector(shopInfo, { isOnlyChecked = false, maxSelectedNumber = 100, serverName = '',
		isSupportedSku = true, tenantId = null, isSupportedAddCondition = false, conditions = {},
		isSingleSelect = false, isSingleSelectShopList = true }, selectedGoods = []) {

		if (typeof shopInfo === 'undefined') {
			throw new Error('goodsSelector 缺少 shopInfo 参数');
		}

		let isTaobao = Array.isArray(shopInfo) ? shopInfo[0].plat === 'top' : shopInfo === 'top';
		if ((isTaobao || !isSingleSelectShopList) && (!tenantId || tenantId === 0)) {
			throw new Error('goodsSelector 缺少 tenantId 参数');
		}

		if (!isSupportedAddCondition && JSON.stringify(conditions) !== '{}') {
			conditions = {};
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
					tenantId: tenantId,
					isSupportedAddCondition: isSupportedAddCondition,
					conditions: conditions,
					isSingleSelect: isSingleSelect,
					isSingleSelectShopList: isSingleSelectShopList
				},
				controller: GoodsSelectorController,
				controllerAs: '$ctrl',
				onClose: noop
			}
		);
	}
};

export default GoodsSelectorService;
