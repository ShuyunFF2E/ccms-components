import ModalService from '../modal/ModalService';
import bodyTemplate from './shop-selector.tpl.html';
import ShopSelectorCtrl from './ShopSelectorCtrl';

const noop = () => {
};

const ShopSelectorService = {
	/**
	 * @param isOnlyChecked: 是否有footer，默认有
	 * @param isSingleChecked: 单选店铺选择器还是多选店铺选择器，默认是多选
	 * @returns {*|Modal}
	 */
	shopSelector({ isOnlyChecked = false, isSingleSelected = false }) {
		return ModalService.modal(
			{
				title: '请选择店铺',
				style: {'width': '1025px', 'min-height': '510px'},
				fullscreen: false,
				hasFooter: !isOnlyChecked,
				__body: bodyTemplate,
				locals: {
					isOnlyChecked: isOnlyChecked,
					isSingleSelected: isSingleSelected
				},
				controller: ShopSelectorCtrl,
				controllerAs: '$ctrl',
				onClose: noop
			}
		);
	}
};

export default ShopSelectorService;
