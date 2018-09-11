import angular from 'angular';
import ShopSelectorService from './ShopSelectorService';
import './_shop-selector.scss';

export default angular
	.module('ccms.components.shopSelector', [])
	.value('$ccShopSelector', ShopSelectorService)
	.name;
