import ModalService from '../modal/ModalService';
import bodyTemplate from './shop-selector.tpl.html';
import ShopSelectorCtrl from './ShopSelectorCtrl';

const ShopSelectorService = {
	/**
	 * @param tenantId: 租户ID 必填
	 * @param hasFooter: 是否有footer，默认有
	 * @param isSingleSelected: 单选店铺选择器还是多选店铺选择器，默认是多选
	 * @param selectedShop: 已选店铺
	 * @param serverName
	 * @param isSupportedChannel: 是否支持渠道选项，默认支持
	 * @returns {*|Modal}
	 */
	shopSelector(tenantId, {hasFooter = false, isSingleSelected = false, selectedShop = [], serverName = '', isSupportedChannel = true}) {
		if (!tenantId && tenantId !== 0) {
			throw new Error('shopSelector 缺少 tenantId 参数');
		}
		return ModalService.modal(
			{
				title: '请选择店铺',
				style: {'width': '1025px', 'min-height': '510px'},
				fullscreen: false,
				hasFooter: !hasFooter,
				__body: bodyTemplate,
				locals: {
					isSingleSelected: isSingleSelected,
					tenantId: tenantId,
					selectedShop: selectedShop,
					serverName: serverName,
					isSupportedChannel: isSupportedChannel
				},
				controller: ShopSelectorCtrl,
				controllerAs: '$ctrl',
				onClose: () => {}
			}
		);
	}
};

export default ShopSelectorService;
