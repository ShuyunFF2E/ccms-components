/**
 * CURRENT - 当前选中平台信息
 * @type {{CURRENT: {}}}
 */
export let CONFIG = {
	CURRENT: {}
};

/**
 * Created with MenuService.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-03-10 8:11 PM
 */
export default {

	/**
	 * 获取菜单列表
	 * @param menusResource menus数据源
	 * @returns {*}
	 */
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

	/**
	 * 获取店铺列表
	 * @param shopsResource shops数据源
	 */
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

	/**
	 * 初始化状态值
	 */
	init() {
		CONFIG.CURRENT = {};
	},

	/**
	 * 查询当前选中的平台及店铺
	 * @returns {CURRENT|{}}
	 */
	getCurrentPlatShop() {
		return CONFIG.CURRENT;
	},

	/**
	 * 设置当前选中平台及店铺
	 * @param plat
	 * @param shop
	 */
	setCurrentPlatShop(plat, shop) {
		CONFIG.CURRENT = {plat, shop};
	}
};
