/**
 * Created with MenusNode.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-03-16 9:04 AM
 * To change this template use File | Settings | File Templates.
 */
import template from './menus-node.tpl.html';
import MenusNodeCtrl from './MenusNodeCtrl';

export default class MenusNode {

	constructor() {

		Object.assign(this, {
			restrict: 'E',
			replace: true,
			template,
			controller: MenusNodeCtrl,
			controllerAs: 'childNode',
			bindToController: true,
			scope: {
				list: '=',
				toggle: '=',
				level: '='
			}
		});
	}
}
