/**
 * Created with MenusCtrl.js
 * @Description:
 * @Author: maxsmu
 * @Date: 2016-02-29 6:52 PM
 */
import angular from 'angular';
import {Inject} from 'angular-es-utils';
import $menus, {reset} from './MenuService';
import EventBus from 'angular-es-utils/event-bus';
import logoUrl from '../../assets/images/logo-default.png';

@Inject('$timeout', '$state', '$rootScope', '$document', '$scope')
export default class MenusCtrl {

	constructor() {
		this.active = {};
		this.shopSelectAvailable = true;
		this.retract = false;
		this.isInitShopSelect = true;
		this.imgDefaultUrl = logoUrl;
	}

	$onInit() {

		// - 重置$menus中的私有变量,原因:各个产品间切换,避免A产品中的数据携带到B产品中
		reset();

		// 初始化数据
		this.collapse = angular.isDefined(this.collapse) ? this.collapse : true;
		this.expandMenus = angular.isDefined(this.expandMenus) ? this.expandMenus : false;

		// - 获取菜单数据
		const menus = $menus.getMenus(this.menuSource);

		// - 生成 menu list 数据
		this.createMenuList(menus);

		this.anyClickShopSelectClosed();

		// 店铺状态变更处理
		this.shopStatusChange();

		this._$scope.$on('$stateChangeSuccess', (event, toState) => {
			this.updateList(this.menuList);
		});

		if (this.shopLogoSubConfig) {
			this.shopLogoSubStyle = this.shopLogoSubConfig.style || {};
			this._$scope.$watch(() => this.active.shop, shop => {
				const config = this.shopLogoSubConfig.getSubImg(shop);
				this.shopLogoSubImg = config.img;
				this.shopLogoSubOpened = config.opened;
			});
		}

	}

	updateList(list) {
		Array.isArray(list) && list.forEach(item => {
			this._$state.includes(item.state) ? item.toggle = item.toggleNode = true : (this.collapse ? item.toggle = item.toggleNode = false : null);
			this.updateList(item.children);
		});
	}

	/**
	 * 店铺状态变更处理
	 */
	shopStatusChange() {
		EventBus.on('cc:shopStatusChange', status => {
			this.shopSelectAvailable = status;
		});
	}

	/**
	 * 展开回调函数
	 */
	unfoldClick() {
		this.unfold = !this.unfold;

		// -判断是否为function 是则执行函数   否则不作为
		this.onUnfold && this.onUnfold({unfold: this.unfold});
	};

	/**
	 * 生成 menu list 数据源
	 */
	createMenuList(menus) {

		// -如果为Resource,则执行查询操作,否则返回原数据
		if (menus.isResource) {

			menus.resource.$promise
				.then(res => {
					this.menuList = res || [];
					this.expandMenus ? this.expandAllMenus(this.menuList) : this.collapseAllMenus(this.menuList);
					this.selectedMenus(this.menuList);
				});
		} else {
			this.menuList = Array.isArray(menus.resource) ? menus.resource : [];
			this.selectedMenus(this.menuList);
		}
	}

	operateAllMenus(menuList = [], expand = true) {
		menuList.forEach(menu => {
			if (menu) {
				menu.toggleNode = expand;
				const child = menu.children;
				Array.isArray(child) && child.length > 0 ? this.operateAllMenus(child) : null;
			}
		});
	}

	/**
	 * 展开所有菜单
	 * @param menuList
	 */
	expandAllMenus(menuList = []) {
		this.operateAllMenus(menuList, true);
	}

	/**
	 * 关闭所有菜单
	 * @param menuList
	 */
	collapseAllMenus(menuList = []) {
		this.operateAllMenus(menuList, false);
	}

	/**
	 * 当前选中的菜单
	 * @param menuList
	 */
	selectedMenus(menuList = []) {
		this._$timeout(() => {
			const active = menuList.find(menu => {
				return this._$state.includes(menu.state);
			});
			active ? active.toggleNode = true : null;
			if (active) {
				const child = active.children;
				Array.isArray(child) && child.length > 0 ? this.selectedMenus(child) : null;
			}
		}, 0);
	}

	/**
	 * 展示店铺列表
	 */
	showShopSelect() {
		this.retract = !this.retract;
		this.isInitShopSelect = false;
	}

	/**
	 * 任意点击关闭
	 */
	anyClickShopSelectClosed() {
		// - 是否展示店铺相关信息
		this.isShowShopInfo = !!this.shopSource;

		if (this.isShowShopInfo) {
			// -点击非有效区域自动关闭shopSelect
			this._$document.bind('click', event => {
				const target = event.target,
					targetClassList = target.classList,
					shopClosest = target.closest('.shop-choose-wrapper'),
					retrackShopClosest = target.closest('.retrack-shop'),
					menusClosest = target.closest('.menu-shop-show');
				// -!targetName.includes('shop-search-clear') 清除点击清空收起店铺选择器问题
				// -!targetName.includes('shop-list-btn') 清除点击查看全部收齐问题
				if (shopClosest === null &&
					retrackShopClosest == null &&
					menusClosest === null && !targetClassList.contains('shop-search-clear') && !targetClassList.contains('menu-constract-icon') && !targetClassList.contains('expand') && !targetClassList.contains('shop-list-btn')
				) {
					if (this.retract) {
						this.retract = false;
						this._$scope.$digest();
					}
				}
			});
		}
	}
}
