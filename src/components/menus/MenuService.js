/**
 * Created with MenuService.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-03-10 8:11 PM
 */
export default {
	shopActive: {},
	_autoClose: true,
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
	 * 设置shopActive状态值
	 * @param plat
	 * @param shop
	 */
	_active(plat, shop) {
		return {
			plat,
			shop
		};
	},

	// - 是否自动关闭属性值
	get autoClose() {
		return this._autoClose;
	},

	set autoClose(value) {
		if (typeof value === 'boolean') {

			this._autoClose = value;
		} else {

			throw new Error('autoClose is boolean');
		}
	}
};
