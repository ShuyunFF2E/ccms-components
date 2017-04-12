/**
 * Created with index.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-02-29 5:24 PM
 */
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import utils from '../../common/utils';
import $menus from './MenuService';

import './_menu.scss';
import menuBarTemplate from './menus.tpl.html';
import MenusCtrl from './MenusCtrl';

import menuNodeTemplate from './menus-node.tpl.html';
import MenusNodeCtrl from './MenusNodeCtrl';

import shopSelect from './shop-select';

const menusBarDDO = {
		template: menuBarTemplate,
		controller: MenusCtrl,
		controllerAs: 'menus',
		bindings: {
			unfold: '=',
			onUnfold: '&?',
			menuSource: '<',
			shopSource: '<?',
			searchPlaceholder: '<?',
			shopItemTpl: '<?', // 店铺模板
			shopLogoStyle: '<?', // logo样式
			shopLogoSubConfig: '<?' //  角标配置
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
	};

export default angular
	.module('ccms.components.menus', [uiRouter, utils, shopSelect])
	.component('ccMenuBar', menusBarDDO)
	.component('ccMenuNode', menusNodeDDO)
	.value('$ccMenus', $menus)
	.name;
