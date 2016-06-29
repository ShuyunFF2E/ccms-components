/**
 * Created with ShopSelectsCtrl.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-04-13 4:31 PM
 */

import angular from 'angular';

import {Inject, EventBus} from 'angular-es-utils';
import {$Menus} from './MenuService';

@Inject('$rootScope', '$filter', '$menus', '$timeout', '$scope')
export default class ShopSelectsCtrl {

	$onInit() {
		this.searchName = '';
		const unWatch = this._$scope.$watch('shops.shops.length', newLength => {
			if (newLength > 0) {
				this._$timeout(() => {
					this.list = angular.copy(this.shops);
				}, 0);
				unWatch();
			}
		});

		// -订阅店铺列表收起时触发重置列表
		this.EventBus = EventBus.on('retract-shops-list', () => {
			this.searchName = '';
			this.searchShop();
		});
	}

	/**
	 * ctrl销毁时处理相关解除订阅
	 */
	$onDestroy() {
		this.EventBus && this.EventBus();
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
		this._$menus.shopActive = $Menus._active(plat, shop);
		this._$rootScope.$broadcast('shopSelect', this.active);
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
		this.list = this.filterShop(angular.copy(this.shops), name);
	}

	/**
	 * 根据name模糊过滤店铺列表
	 * @param list
	 * @param name
	 * @returns {*}
	 * @constructor
	 */
	filterShop(list, name) {
		let delIndex = [];
		if (name) {
			Array.isArray(list) && list.forEach((plats, index) => {
				plats.result = [];
				Array.isArray(plats.child) && plats.child.forEach(shop => {
					if (shop.name.includes(name)) {
						plats.result.push(shop);
					}
				});
				if (plats.result.length === 0) {
					delIndex.push(plats);
				} else {
					plats.child = plats.result;
					delete plats.result;
				}
			});

			// -删除多余的项
			delIndex.forEach(plat => {
				list.splice(list.indexOf(plat), 1);
			});
		}
		return list;
	}

	/**
	 * 重置查询参数
	 */
	resetSearchValue() {
		this.searchName = '';
		this.searchShop();
	}
}
