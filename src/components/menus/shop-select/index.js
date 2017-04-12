/**
 * Created index.js.js into ccms-components
 * Author: Micheal
 * Date  : 2017/04/11 11:39
 * GitHub: https://github.com/maxsmu
 * Description: 店铺选择器
 */
import angular from 'angular';

import './_shop-selector.scss';
import template from './shop-selects.tpl.html';
import ShopSelectsCtrl from './ShopSelectsCtrl';

const shopSelectDDO = {
	template,
	controller: ShopSelectsCtrl,
	controllerAs: '$ctrl',
	bindings: {
		shopSource: '<?',
		shopInfo: '=',
		retract: '<?',
		onRetract: '&?',
		isInit: '<?',
		placeholder: '<?',
		shopItemTpl: '<?'
	}
};

export default angular
	.module('ccms.components.menus.shops', [])
	.component('ccShopSelect', shopSelectDDO)
	.name;
