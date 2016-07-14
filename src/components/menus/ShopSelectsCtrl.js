/**
 * Created with ShopSelectsCtrl.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-04-13 4:31 PM
 */

import angular from 'angular';

import {Inject, EventBus} from 'angular-es-utils';
import $menus from './MenuService';
let autoEventBus;
@Inject('$rootScope', '$filter', '$timeout', '$scope', '$q')
export default class ShopSelectsCtrl {

	$onInit() {
		// - 搜索结果
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
		this.EventBus = EventBus.on('shop:list-switch', () => {
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
	 * 选择店铺并且关闭店铺选择
	 * @param plat
	 * @param shop
	 */
	checkedShop(plat, shop) {

		// - 本次点击店铺信息
		const checked = {plat, shop};

		// - 选择同一个店铺,阻止事件广播
		if (this.active.plat.value !== plat.value || this.active.shop.value !== shop.value) {

			// - 是否自动关闭标记
			const autoClose = $menus.autoClose;

			console.log(autoClose);

			// - 切换店铺延迟对象
			const deferred = this._$q.defer();

			// - 不开启autoClose 则执行同步head info 以及 更新服务
			if (autoClose) {

				this.active = checked;

				// - 更新公用服务$menus中的选中数据
				$menus.shopActive = $menus._active(checked.plat, checked.shop);

				deferred.resolve();
			} else {

				// -
				if (!autoEventBus) {
					autoEventBus = EventBus.on('menu:change', () => {
						$menus.autoClose = true;
					});
				}
			}

			this._$rootScope.$broadcast('shop:change', checked, deferred);
			EventBus.dispatch('shop:change', checked, deferred);

			deferred.promise.then(() => {

				// - 若开启autoClose 则执行修改同步head info以及更新服务
				if (!autoClose) {

					this.active = checked;
					// - 更新公用服务$menus中的选中数据
					$menus.shopActive = $menus._active(checked.plat, checked.shop);
				}

				// - 关闭店铺选择器
				this.closedAnimation = false;

				// - 自动关闭功能开启
				$menus.autoClose = true;
			});
		} else {
			// - 选择同一店铺,关闭店铺选择器
			this.closedAnimation = false;
		}
	}

	/**
	 * 单击查询
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
