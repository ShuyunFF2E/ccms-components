/**
 * Created with Menus.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-02-29 5:28 PM
 * To change this template use File | Settings | File Templates.
 */
import './_menu.scss';
import template from './menus.tpl.html';
import MenusCtrl from './MenusCtrl';

export default class Menus {

	constructor() {

		Object.assign(this, {
			restrict: 'E',
			template,
			controller: MenusCtrl,
			controllerAs: 'menus',
			bindToController: true,
			scope: {
				options: '='
			}
		});
	}
}
