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
		this.template = template;
		this.controller = ShopSelectsCtrl;
		this.controllerAs = 'shops';
		this.bindings = {
			shops: '=',
			active: '=',
			animation: '=',
			placeholder: '='
		};
	}
}
