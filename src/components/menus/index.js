/**
 * Created with index.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-02-29 5:24 PM
 */
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import utils from '../../common/utils';
import {$Menus} from './MenuService';

import './_menu.scss';
import menuBarTemplate from './menus.tpl.html';
import MenusCtrl from './MenusCtrl';

import menuNodeTemplate from './menus-node.tpl.html';
import MenusNodeCtrl from './MenusNodeCtrl';

import './_shop-selector.scss';
import shopSelectTemplate from './shop-selects.tpl.html';
import ShopSelectsCtrl from './ShopSelectsCtrl';

const
	menusBarDDO = {
		template: menuBarTemplate,
		controller: MenusCtrl,
		controllerAs: 'menus',
		bindings: {
			unfold: '=',
			unfoldCallback: '=',
			menusDataResource: '=',
			shopsDataResource: '=',
			searchPlaceholder: '='
		}
	},
	menusNodeDDO = {
		template: menuNodeTemplate,
		controller: MenusNodeCtrl,
		controllerAs: 'childNode',
		bindings: {
			list: '=',
			toggle: '=',
			level: '='
		}
	},
	shopSelectDDO = {
		template: shopSelectTemplate,
		controller: ShopSelectsCtrl,
		controllerAs: 'shops',
		bindings: {
			shops: '=',
			active: '=',
			animation: '=',
			placeholder: '='
		}
	};

export default angular
	.module('ccms.components.menus', [uiRouter, utils])
	.component('menuBar', menusBarDDO)
	.component('menuNode', menusNodeDDO)
	.component('shopSelect', shopSelectDDO)
	.service('$menus', $Menus)
	.name;
