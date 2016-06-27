/**
 * Created with index.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-02-29 5:24 PM
 * To change this template use File | Settings | File Templates.
 */
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import utils from '../../common/utils';
import MenusDirective from './MenusDirective';
import MenusNodeDirective from './MenusNodeDirective';
import {$Menus} from './MenuService';
import ShopSelectsDirective from './ShopSelectsDirective';
import { SearchShop } from './ShopSelectsFilter';
export default angular
	.module('ccms.components.menus', [uiRouter, utils])
	.component('menuBar', new MenusDirective())
	.component('menuNode', new MenusNodeDirective())
	.component('shopSelect', new ShopSelectsDirective())
	.service('$menus', $Menus)
	.filter('SearchShop', SearchShop)
	.name;
