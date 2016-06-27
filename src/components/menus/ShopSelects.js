/**
 * Created with ShopSelects.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-04-13 4:30 PM
 * To change this template use File | Settings | File Templates.
 */
import './_shop-selector.scss';
import template from './shop-selects.tpl.html';
import ShopSelectsCtrl from './ShopSelectsCtrl';

export default class ShopSelects {

	constructor() {
		Object.assign(this, {
			restrict: 'E',
			replace: true,
			template,
			controller: ShopSelectsCtrl,
			controllerAs: 'shops',
			bindToController: true,
			scope: {
				shops: '=',
				active: '=',
				animation: '='
			}
		});
	}
}
