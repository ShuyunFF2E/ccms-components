/**
 * Created with MenuService.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-03-10 8:11 PM
 */
/**
 * CURRENT - 当前选中平台信息
 * @type {{CURRENT : {}}}
 * @type {{menuChangeTopics : []}}
 * @type {{shopChangeStartTopics : []}}
 * @type {{shopChangeTopics: []}}
 */
export let CONFIG = {
	CURRENT: {},

	menuChangeTopics: [],

	shopChangeStartTopics: [],

	shopChangeTopics: [],

	onListenerHelper(topic, listener, isReset = false) {
		if (typeof listener === 'function') {
			this[topic + 'Topics'].push(listener);
		} else {
			console.error(topic + '注册callback不是函数类型!');
		}

		// -是否需要返回销毁函数
		if (isReset) {
			return this.offListenerHelper.bind(this, topic);
		}
	},

	dispatchListenerHelper(topic, ...args) {
		this[topic + 'Topics'].forEach(listener => {
			listener.apply(null, args);
		});
	},

	offListenerHelper(topic) {
		this[topic + 'Topics'] = [];
	},

	isOnListenerHelper(topic) {
		return this[topic + 'Topics'].length > 0;
	}
};

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
		console.log('onMenuChange');
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
