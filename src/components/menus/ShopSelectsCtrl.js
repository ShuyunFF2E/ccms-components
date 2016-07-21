/**
 * Created with ShopSelectsCtrl.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-04-13 4:31 PM
 */

import angular from 'angular';

import {Inject, EventBus} from 'angular-es-utils';
import $menus from './MenuService';

@Inject('$rootScope', '$filter', '$timeout', '$scope', '$q')
export default class ShopSelectsCtrl {

	$onInit() {
		// - 搜索结果
		this.searchName = '';
		const unWatch = this._$scope.$watch('shops.shopList.length', newLength => {
			if (newLength > 0) {
				this._$timeout(() => {
					this.list = angular.copy(this.shopList);
				}, 0);
				unWatch();
			}
		});

		// -订阅店铺列表收起时触发重置列表
		this.EventBus = EventBus.on('shop:listCollapsed', () => {
			this.searchName = '';
			this.searchShop();
		});
	}

	$onDestroy() {
		if (this.EventBus) {
			this.EventBus();
		}
	}

	selectedShop(plat, shop) {

		// - 本次点击店铺信息
		const selectedShop = {plat, shop};

		// - 选择同一个店铺,阻止事件广播
		if (this.shopInfo.plat.value !== plat.value || this.shopInfo.shop.value !== shop.value) {

			const deferred = this._$q.defer();

			this._$rootScope.$broadcast('shop:changeStart', deferred);

			EventBus.dispatch('shop:changeStart', deferred);

			if (deferred.promise.$$state.status === 0) {
				deferred.resolve();
			}

			deferred.promise.then(() => {

				this.shopInfo = selectedShop;

				$menus.setCurrentPlatShop(selectedShop.plat, selectedShop.shop);

				this._$rootScope.$broadcast('shop:change', selectedShop);

				EventBus.dispatch('shop:change', selectedShop);

				this.collapsed = false;
			});
		} else {

			this.collapsed = false;
		}
	}

	searchShop(event, type, name) {
		if (type === 'reset' || type === 'click' || (type === 'keyup' && event.keyCode === 13)) {
			this.list = this.filterShop(angular.copy(this.shopList), name);
		}
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
		this.searchShop(null, 'reset');
	}
}
