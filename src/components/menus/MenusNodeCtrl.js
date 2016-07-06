/**
 * Created with MenusNodeCtrl.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-03-16 9:04 AM
 * To change this template use File | Settings | File Templates.
 */
import {Inject, EventBus} from 'angular-es-utils';

@Inject('$state', '$timeout')
export default class MenusNodeCtrl {

	constructor($state, $timeout) {

		$timeout(() => {
			this.$state = $state;

			// -获取当前选择的菜单项(初始化时)
			const menu = this.getMenu(this.list);
			menu && EventBus.dispatch('menuSelect', menu);
		}, 0);
	}

	/**
	 * 点击菜单
	 * @param node
	 */
	clickParents(node) {
		node.toggleNode = !node.toggleNode;
	};

	/**
	 * 单击菜单时
	 * @param menu
	 */
	clickMenus(menu) {
		EventBus.dispatch('menuSelect', menu);
	};

	/**
	 * 初始化时默认打开的菜单项
	 * @param menus
	 * @returns {*}
	 */
	getMenu(menus = []) {
		return Array.isArray(menus) ? menus.find(item => {
			return item.state === this.$state.current.name;
		}) : {};
	}
}
