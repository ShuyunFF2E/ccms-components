import ModalService from '../modal/ModalService';
import bodyTemplate from './shop-selector.tpl.html';
import ShopSelectorCtrl from './ShopSelectorCtrl';

const noop = () => {
};

const ShopSelectorService = {
	/**
	 * @param tenantId: 租户ID 必填
	 * @param isOnlyChecked: 是否有footer，默认有
	 * @param isSingleChecked: 单选店铺选择器还是多选店铺选择器，默认是多选
	 * @param selectedShop: 已选店铺
	 * @param isSupportedChannel: 是否支持渠道选项，默认支持
	 * @param serverName
	 * @returns {*|Modal}
	 */
	shopSelector(tenantId, {isOnlyChecked = false, isSingleSelected = false, selectedShop = [], serverName = '', isSupportedChannel = true}) {
		if (!tenantId && tenantId !== 0) {
			throw new Error('shopSelector 缺少 tenantId 参数');
		}
		return ModalService.modal(
			{
				title: '请选择店铺',
				style: {'width': '1025px', 'min-height': '510px'},
				fullscreen: false,
				hasFooter: !isOnlyChecked,
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
				onClose: noop
			}
		);
	}
};

export default ShopSelectorService;
