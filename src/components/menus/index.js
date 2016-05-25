/**
 * Created with index.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-02-29 5:24 PM
 * To change this template use File | Settings | File Templates.
 */
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import {FactoryCreator} from 'angular-es-utils';
import utils from '../../common/utils';
import Menus from './Menus';
import MenusNode from './MenusNode';
import {$Menus} from './MenuService';
import ShopSelect from './ShopSelects';
import { SearchShop } from './ShopSelectsFilter';
export default angular
	.module('ccms.components.menus', [uiRouter, utils])
	.directive('menuBar', FactoryCreator.create(Menus))
	.directive('menuNode', FactoryCreator.create(MenusNode))
	.directive('shopSelect', FactoryCreator.create(ShopSelect))
	.service('$menus', $Menus)
	.filter('SearchShop', SearchShop)
	.name;
