import angular from 'angular';

function findEntityByName(collection, name) {
	return collection.findIndex(item => angular.equals(item.name, name));
}

function showItemBySupportedSku(item, isSupportedSku) {
	return item.isSkuItem && isSupportedSku || !item.isSkuItem;
}

function showItemBySupportedShopList(item, isShowShopList) {
	return item.name === 'shopId' && isShowShopList || item.name !== 'shopId';
}

function showItemBySupportedTag(item, isSupportedTag) {
	return item.name === 'tagItemIds' && isSupportedTag || item.name !== 'tagItemIds';
}

function showItemByShowToggleSearchBtn(item, isShowToggleSearchBtn) {
	return isShowToggleSearchBtn && item.isSimpleSearchItem || !isShowToggleSearchBtn;
}

function getFormTemplateConfig(fieldSetConfigList, originFormModel, { isSupportedSku, isShowShopList, isSupportedTag, isShowToggleSearchBtn }) {
	let result = {};
	for (let attr in originFormModel) {
		if (originFormModel.hasOwnProperty(attr)) {
			const itemIndex = findEntityByName(fieldSetConfigList, attr);
			if (itemIndex > -1) {
				const item = fieldSetConfigList[itemIndex];
				result[`show-${attr}`] = showItemBySupportedSku(item, isSupportedSku) && showItemBySupportedShopList(item, isShowShopList) &&
										showItemBySupportedTag(item, isSupportedTag) && showItemByShowToggleSearchBtn(item, isShowToggleSearchBtn);
				result[`${attr}Title`] = item.title;
			}
		}
	}
	return result;
}
export {
	getFormTemplateConfig
};

