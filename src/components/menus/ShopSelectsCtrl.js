/**
 * Created with ShopSelectsCtrl.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-04-13 4:31 PM
 * To change this template use File | Settings | File Templates.
 */

import angular from 'angular';

import {Inject, EventBus} from 'angular-es-utils';
import {$Menus} from './MenuService';

@Inject('$rootScope', '$filter', '$menus', '$timeout', '$scope')
export default class ShopSelectsCtrl {
	constructor($rootScope, $filter, $menus, $timeout, $scope) {
		this.$rootScope = $rootScope;
		this.$filter = $filter;
		this.$menus = $menus;
		this.searchName = '';
		const unWatch = $scope.$watch('shops.shops.length', newLength => {
			if (newLength > 0) {
				$timeout(() => {
					this.list = angular.copy(this.shops);
				}, 0);
				unWatch();
			}
		});
	}

	/**
	 * 选择店铺
	 * @param plat
	 * @param shop
	 */
	toggleShops(plat, shop) {
		this.active = {
			plat,
			shop
		};
		this.$menus.shopActive = $Menus._active(plat, shop);
		this.$rootScope.$broadcast('shopSelect', this.active);
		EventBus.dispatch('shopSelect', this.active);
		// -关闭店铺选择器
		this.animation = false;
	}

	/**
	 * 单击查询店铺
	 * @param event
	 * @param name
	 */
	clickSearchShop(event, name) {
		event.stopPropagation();

		this.searchShop(name);
	}

	/**
	 * 回车查询
	 * @param event
	 * @param name
	 */
	keyupSearchShop(event, name) {
		if (event.keyCode === 13) {
			this.searchShop(name);
		}
	}

	/**
	 * 根据店铺名称模糊查询店铺
	 * @param name
	 */
	searchShop(name) {
		this.list = this.$filter('SearchShop')(angular.copy(this.shops), name);
	}
}
