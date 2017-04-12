/**
 * Created with ShopSelectsCtrl.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-04-13 4:31 PM
 */

import angular from 'angular';
import {Inject} from 'angular-es-utils';
import TplReqHelper from '../../../common/utils/tpl-req-helper';
import shopItemTpl from './tpls/shop-item.tpl.html';
import $menus, {dispatchShopChangeStart, isHaveBindShopChangeStart, setCurrentPlatShop} from '../MenuService';

@Inject('$q')
export default class ShopSelectsCtrl {
	constructor() {
		// - 搜索结果
		this.searchName = '';
		this.list = [];
		this.tempList = [];
	}

	$onInit() {
		this.shopItemTpl = TplReqHelper.get(this.shopItemTpl || shopItemTpl);
		this.createShopList();
	}

	$onChanges(bindings) {
		if (bindings.retract) {
			// - 订阅店铺列表收起时触发重置列表
			this.onResetSearchValue();
		}
	}

	/**
	 * 生成 shop list 数据源
	 */
	createShopList() {
		// -店铺列表
		const shops = $menus.getShops(this.shopSource);

		if (shops.isResource) {

			shops.resource
				.$promise
				.then(res => {
					this.list = res || [];
					this.tempList = angular.copy(this.list);
					const platShop = this._getActiveShop(this.list);
					// - 通知
					this.shopInfo = platShop;
					// 选择默认店铺
					setCurrentPlatShop(platShop.plat, platShop.shop);
				});

		} else {
			const resourceIsArray = Array.isArray(shops.resource);
			this.list = resourceIsArray ? shops.resource : [];
			this.tempList = angular.copy(this.list);
			if (resourceIsArray) {
				const platShop = this._getActiveShop(this.list);
				// - 通知
				this.shopInfo = platShop;
				// 选择默认店铺
				setCurrentPlatShop(platShop.plat, platShop.shop);
			}
		}
	}

	/**
	 * 获取当前选中的平台以及店铺
	 * @param list
	 * @private
	 */
	_getActiveShop(list) {
		if (Array.isArray(list)) {
			// -查询所在平台
			const plat = list.find(
					plat => {
						return plat.active;
					}
				) || {};
			// -查询在平台中选中的店铺
			const shop = plat &&
				Array.isArray(plat.child) &&
				plat.child.find(shop => {
					return shop.active;
				}) || {};

			return {
				plat,
				shop
			};
		}
	}

	/**
	 * 选中店铺
	 * @param plat
	 * @param shop
	 */
	onSelected(plat, shop) {
		// - 本次点击店铺信息
		const selectedShop = {plat, shop};

		// - 选择同一个店铺,阻止事件广播
		// - this.shopInfo.plat.value !== plat.value ==> 不同平台时
		// - this.shopInfo.shop.value !== shop.value ==> 不同店铺时
		// - this.isInit ==> 第一次初始化
		if (this.shopInfo.plat.value !== plat.value || this.shopInfo.shop.value !== shop.value || this.isInit) {
			const deferred = this._$q.defer();

			dispatchShopChangeStart(deferred, selectedShop);

			if (!isHaveBindShopChangeStart() && deferred.promise.$$state.status === 0) {

				deferred.resolve();
			}

			deferred.promise.then(() => {
				this.shopInfo = selectedShop;

				setCurrentPlatShop(selectedShop.plat, selectedShop.shop);

				this.retract = false;

				if (typeof this.onRetract === 'function' && !this.isInit) {
					this.onRetract();
				}
			});
		} else {
			this.retract = false;
			if (typeof this.onRetract === 'function' && !this.isInit) {
				this.onRetract();
			}
		}
	}

	/**
	 * 根据搜索内容查询店铺
	 * @param event
	 * @param type
	 * @param name
	 */
	onSearchShop(event, type, name) {
		if (type === 'reset' || type === 'click' || (type === 'keyup' && event.keyCode === 13)) {
			this.list = this.filterShop(angular.copy(this.tempList), name);
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
					if (shop.name.indexOf(name) > -1) {
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
	onResetSearchValue() {
		this.searchName = '';
		this.onSearchShop(null, 'reset');
	}
}
