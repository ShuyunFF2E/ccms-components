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
	 * @param isSupportedChannel: 是否支持平台选项，默认支持
	 * @param platform: 平台
	 * @returns {*|Modal}
	 */
	shopSelector(tenantId, {hasFooter = true, isSingleSelected = false, selectedShop = [], serverName = '', isSupportedChannel = true, platform = null}) {
		if (!tenantId && tenantId !== 0) {
			throw new Error('shopSelector 缺少 tenantId 参数');
		}
		if (!isSupportedChannel && platform) {
			platform = null;
			console.warn('您已配置不支持平台，但是平台参数不为空');
		}
		if (isSupportedChannel && platform && !platform.length) {
			throw new Error('您已配置支持平台，平台数组长度不能为0, 一个平台：platform.length === 1; n个平台：platform.length === n; 不限平台：platform === null');
		}
		return ModalService.modal(
			{
				title: '请选择店铺',
				style: {'width': '1025px', 'min-height': '510px'},
				fullscreen: false,
				hasFooter: hasFooter,
				__body: bodyTemplate,
				locals: {
					isSingleSelected: isSingleSelected,
					tenantId: tenantId,
					selectedShop: selectedShop,
					serverName: serverName,
					isSupportedChannel: isSupportedChannel,
					platform
				},
				controller: ShopSelectorCtrl,
				controllerAs: '$ctrl',
				onClose: () => {}
			}
		);
	}
};

export default ShopSelectorService;
