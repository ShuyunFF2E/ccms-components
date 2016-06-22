/**
 * Created with MenuService.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-03-10 8:11 PM
 * To change this template use File | Settings | File Templates.
 */
import angular from 'angular';

export class $Menus {

	constructor() {
		this.shopActive = {};
	}

	/**
	 * 数据初始化
	 * @param menuOptions
	 * @returns {void|*}
	 */
	static init(menuOptions) {
		let DEFAULT_CONFIGS = {
			unfold: true, // -展开配置
			unfoldClick: null, // -展开事件
			shops: false, // -店铺
			menusQuery: {}, // -查询menus参数
			shopsQuery: {}, // -查询shops查询参数
			menusResource: null, // -菜单资源$resource
			shopsResource: null,  // -店铺资源$resource
			searchPlaceholder: '请输入店铺名称' // -搜索框placeholder提示文字
		};
		return angular.extend(DEFAULT_CONFIGS, menuOptions);
	}

	/**
	 * 获取菜单列表
	 * @param menuOptions
	 * @returns {*}
	 */
	static getMenus(menuOptions) {
		const isArray = Array.isArray(menuOptions.menusResource),
			resource = isArray ? menuOptions.menusResource
				: menuOptions.menusResource.query(menuOptions.menusQuery);
		return {
			isArray,
			resource
		};
	}

	/**
	 * 获取店铺列表
	 * @param menuOptions
	 */
	static getShops(menuOptions) {
		const isArray = Array.isArray(menuOptions.shopsResource),
			resource = isArray ? menuOptions.shopsResource
				: menuOptions.shopsResource.query(menuOptions.shopsQuery);
		return {
			isArray,
			resource
		};
	}

	/**
	 * 设置shopActive状态值
	 * @param plat
	 * @param shop
	 * @private
	 */
	static _active(plat, shop) {
		return {
			plat,
			shop
		};
	}
}
