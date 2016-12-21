/**
 * Created with MenusNodeCtrl.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-03-16 9:04 AM
 */
import {Inject} from 'angular-es-utils';
import {dispatchMenuChange} from './MenuService';
@Inject('$state', '$timeout', '$scope')
export default class MenusNodeCtrl {

	$onInit() {
		this._$timeout(() => {

			// -获取当前选择的菜单项(初始化时)
			const menu = this.getMenu(this.list);
			if (menu) {
				dispatchMenuChange(menu);
			}
		}, 0);
		this._$scope.$on('$stateChangeSuccess', (event, toState) => {
			if (Array.isArray(this.list)) {
				this.toggle = this.list.some(item => this._$state.includes(item.state));
			}
		});
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
		// - 路由未发生变化时,阻断事件广播
		if (menu.state !== this._$state.current.name) {
			dispatchMenuChange(menu);
		}
	};

	/**
	 * 初始化时默认打开的菜单项
	 * @param menus
	 * @returns {*}
	 */
	getMenu(menus = []) {
		return Array.isArray(menus) ? menus.find(item => {
			return item.state === this._$state.current.name;
		}) : {};
	}
}
