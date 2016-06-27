/**
 * Created with MenusCtrl.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-02-29 6:52 PM
 * To change this template use File | Settings | File Templates.
 */
import {Inject} from 'angular-es-utils';
import {$Menus} from './MenuService';

@Inject('$menus', '$timeout', '$state', '$rootScope', '$document', '$scope')
export default class MenusCtrl {

	constructor($menus, $timeout, $state, $rootScope, $document, $scope) {
		$timeout(() => {
			this.$state = $state;
			this.$rootScope = $rootScope;
			/**
			 * 二级菜单容器样式
			 * @param menu
			 * @returns {*}
			 */
			this.menuStyle = menu => {
				menu.toggle = typeof menu.toggle === 'undefined'
					? this.$state && this.$state.includes(menu.state)
					: menu.toggle;
				return menu.toggle ? {display: 'block'} : {};
			};

			/**
			 * 单击一级菜单
			 * @param menu
			 */
			this.oneListClick = (menu, $event) => {
				$event.preventDefault();
				menu.toggle = !menu.toggle;
			};


			/**
			 * 展开回调函数
			 * @param opts
			 */
			this.unfoldClick = opts => {
				opts.unfold = !opts.unfold;

				// -判断是否为function 是则执行函数   否则不作为
				(Object.prototype.toString.call(opts.unfoldClick) === '[object Function]')
					? opts.unfoldClick(opts.unfold)
					: null;
			};

			$document.bind('click', event => {
				const target = event.target,
					targetName = target.className,
					shopClosest = target.closest('.shop-choose-wrapper'),
					menusClosest = target.closest('.menu-container');
				// -!targetName.includes('shop-search-clear') 清除点击清空收起店铺选择器的bug
				if (shopClosest === null && menusClosest === null && !targetName.includes('shop-search-clear')) {
					this.shopShow = false;
					$scope.$apply();
				}
			});

			this.activeMenus(this.menus);
		}, 0);

		/**
		 * 当前选中的菜单
		 * @param menus
		 */
		this.activeMenus = (menus = []) => {
			const active = menus.find(menu => {
				return $state.includes(menu.state);
			});
			active ? active.toggleNode = true : null;
			if (active !== undefined && active !== null) {
				const child = active.child;
				Array.isArray(child) && child.length > 0 ? this.activeMenus(child) : null;
			}
		};

		// -初始化配置数据
		this.opts = $Menus.init($scope.menus ? $scope.menus.options : {});

		/**
		 * 获取列表
		 */
		this.getMenus = () => {

			// -菜单列表
			const menus = $Menus.getMenus(this.opts);

			menus.isArray ? this.menus = menus.resource
				: menus.resource
				.$promise
				.then(res => {
					this.menus = res || [];
				});

			// -判断是否开启店铺选择器
			if (this.opts.shops) {

				// -店铺列表
				const shops = $Menus.getShops(this.opts);

				if (shops.isArray) {

					this.shopsInfo = shops.resource;
					this._getActiveShop(this.shopsInfo);

				} else {

					shops.resource
						.$promise
						.then(res => {
							this.shopsInfo = res || [];
							this._getActiveShop(this.shopsInfo);
						});
				}
			}
		};

		/**
		 * 获取当前选中的平台以及店铺
		 * @param list
		 * @private
		 */
		this._getActiveShop = list => {
			this.active = {};

			if (Array.isArray(list)) {

				const plat = list.find(plat => {
						return plat.active;
					}),
					shop = plat && Array.isArray(plat.child) ? plat.child.find(shop => {
						return shop.active;
					}) : {};
				this.active = {
					plat,
					shop
				};

				// -更新服务中的当前选择店铺数据
				$menus.shopActive = $Menus._active(plat, shop);

				// -第一次广播时间通知调用者当前选择的店铺
				$timeout(() => {
					this.$rootScope.$broadcast('shopSelect', $menus.shopActive);
				}, 0);
			}
		};
		this.getMenus();
	}
}
