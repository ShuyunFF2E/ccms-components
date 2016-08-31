/**
 * Created with MenuService.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-03-10 8:11 PM
 */

import CONFIG from './Constant';

export default {

	getMenus(menusResource) {
		const isResource = menusResource && typeof menusResource.query === 'function',
		// -如果是Resource则返回Resource,否则返回原数据
			resource = !isResource ? menusResource
				: menusResource.query();
		return {
			isResource,
			resource
		};
	},

	getShops(shopsResource) {

		const isResource = shopsResource && typeof shopsResource.query === 'function',

		// -如果是Resource则返回Resource,否则返回原数据
			resource = !isResource ? shopsResource
				: shopsResource.query();
		return {
			isResource,
			resource
		};
	},

	init() {
		CONFIG.CURRENT = {};
	},

	getCurrentPlatShop() {
		return CONFIG.CURRENT;
	},

	setCurrentPlatShop(plat, shop) {
		const selectedShop = {plat, shop};
		CONFIG.CURRENT = selectedShop;
		this.dispatchShopChange(selectedShop);
	},

	onMenuChange(listener) {
		CONFIG.onListenerHelper('menuChange', listener);
	},

	dispatchMenuChange(...args) {
		CONFIG.dispatchListenerHelper('menuChange', ...args);
		this.offMenuChange();
	},

	offMenuChange() {
		CONFIG.offListenerHelper('menuChange');
	},

	onShopChange(listener) {
		return CONFIG.onListenerHelper('shopChange', listener, true);
	},

	dispatchShopChange(...args) {
		CONFIG.dispatchListenerHelper('shopChange', ...args);
	},

	onShopChangeStart(listener) {
		return CONFIG.onListenerHelper('shopChangeStart', listener, true);
	},

	dispatchShopChangeStart(...args) {
		CONFIG.dispatchListenerHelper('shopChangeStart', ...args);
	},

	isOnShopChangeStart() {
		return CONFIG.isOnListenerHelper('shopChangeStart');
	}
};
