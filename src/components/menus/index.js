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
			collapse: '<?', // 是否关闭其他菜单, 当激活某个子菜单时 默认值是 true
			expandMenus: '<?', // 初始化时, 是否展开所有菜单 (不包含, 含有 active 的子菜单) 默认值是 false
			menuSource: '<',
			shopSource: '<?',
			menuPlaceholder: '<?', // 菜单占位符，可用于做一下自由化的插入功能
			menuPlaceholderClick: '&?',
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
