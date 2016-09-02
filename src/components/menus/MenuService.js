/**
 * Created with MenuService.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-03-10 8:11 PM
 */

import CONFIG from './Constant';

import Deferred from 'angular-es-utils/deferred';

let deferred = new Deferred();
let isInit = true;

export function init() {
	CONFIG.CURRENT = {};
}
export function setCurrentPlatShop(plat, shop) {
	if (!isInit) {
		deferred = new Deferred();
	}

	const selectedShop = {plat, shop};

	CONFIG.CURRENT = selectedShop;

	deferred.resolve(CONFIG.CURRENT);

	dispatchShopChange(selectedShop);

	isInit = false;
}
export function dispatchMenuChange(...args) {
	CONFIG.dispatchListenerHelper('menuChange', ...args);
	offMenuChange();
}
export function offMenuChange() {
	CONFIG.offListenerHelper('menuChange');
}
export function dispatchShopChange(...args) {
	CONFIG.dispatchListenerHelper('shopChange', ...args);
}
export function dispatchShopChangeStart(...args) {
	CONFIG.dispatchListenerHelper('shopChangeStart', ...args);
}

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

	getCurrentPlatShop() {
		return deferred.promise;
	},

	onMenuChange(listener) {
		CONFIG.onListenerHelper('menuChange', listener);
	},

	onShopChange(listener) {
		return CONFIG.onListenerHelper('shopChange', listener, true);
	},

	onShopChangeStart(listener) {
		return CONFIG.onListenerHelper('shopChangeStart', listener, true);
	},

	isOnShopChangeStart() {
		return CONFIG.isOnListenerHelper('shopChangeStart');
	}
};
