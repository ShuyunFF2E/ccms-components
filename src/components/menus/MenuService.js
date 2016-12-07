/**
 * Created with MenuService.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-03-10 8:11 PM
 */

import EventBus from 'angular-es-utils/event-bus';
import Deferred from 'angular-es-utils/deferred';

let deferred = new Deferred();
let isHadBeenInitialized = false;
let currentShop = {};

export function reset() {
	currentShop = {};
	isHadBeenInitialized = false;
}
export function setCurrentPlatShop(plat, shop) {

	const selectedShop = {plat, shop};

	currentShop = selectedShop;

	if (isHadBeenInitialized) {
		deferred = new Deferred();
		dispatchShopChange(selectedShop);
	}
	deferred.resolve(currentShop);

	isHadBeenInitialized = true;
}
export function dispatchMenuChange(...args) {
	return EventBus.dispatch('cc:menuChange', ...args);
}

export function dispatchShopChange(...args) {
	return EventBus.dispatch('cc:shopChange', ...args);
}
export function dispatchShopChangeStart(...args) {
	return EventBus.dispatch('cc:shopChangeStart', ...args);
}

export function isHaveBindShopChangeStart() {
	return EventBus.getListeners('cc:shopChangeStart').length > 0;
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

	onMenuChange(listener, scope) {

		const offListener = EventBus.once('cc:menuChange', listener);

		if (scope) {
			scope.$on('$destroy', offListener);
		}

		return offListener;
	},

	onShopChange(listener, scope) {
		const offListener = EventBus.on('cc:shopChange', listener);

		if (scope) {
			scope.$on('$destroy', offListener);
		}

		return offListener;
	},

	onShopChangeStart(listener, scope) {
		const offListener = EventBus.on('cc:shopChangeStart', listener);

		if (scope) {
			scope.$on('$destroy', offListener);
		}

		return offListener;
	},

	shopChangeEnable() {
		EventBus.dispatch('cc:shopStatusChange', true);
	},

	shopChangeDisable() {
		EventBus.dispatch('cc:shopStatusChange', false);
	}

};
