/**
 * Created with test-MenusCtrl.js.js
 * @Author: maxsmu
 * @Homepage: https://github.com/maxsmu
 * @Date: 2016-08-30 3:04 PM
 */

'use strict';
import {assert} from 'chai';
import angular from 'angular';

import $ccMenus from '../MenuService';

describe('MenuBar Component', () => {
	const menusList = [
		{
			name: '忠诚度设置',
			state: 'card',
			icon: '',
			children: [
				{
					name: '积分类型',
					state: 'card.point',
					icon: '',
					children: []
				}
			]
		},
		{
			name: '会员等级管理',
			state: 'grade',
			icon: '',
			children: []
		}
	];
	const bindings = {
		unfold: true,
		onUnfold: unfold => {
			assert.isNull(null, 'onUnfold is doing');
		},
		menuSource: [],
		shopSource: [],
		searchPlaceholder: '请输入XXX'
	};
	let $componentController, $resource;

	beforeEach(angular.mock.module('app'));

	beforeEach(angular.mock.inject((_$componentController_, _$resource_) => {
		$componentController = _$componentController_;
		$resource = _$resource_;
		// $state = _$state_;
	}));

	it('$onInit', () => {
		const menusCtrl = $componentController('ccMenuBar', null, bindings);
		menusCtrl.$onInit();
		assert.equal(menusCtrl.isInitShopSelect, !!menusCtrl.shopSource);
	});

	it('createMenuList', () => {
		const menusCtrl = $componentController('ccMenuBar', null, bindings);

		// - TODO 此处测试需要完善
		menusCtrl.menuSource = $resource('/menus');
		let menus = $ccMenus.getMenus(menusCtrl.menuSource);

		menusCtrl.createMenuList(menus);

		menus.resource.$promise.then(() => {
			// - resource is function
			assert.isArray(menusCtrl.menuList, 'menuSource is $resource: menuList is Array');
		});

		menusCtrl.menuSource = menusList;
		menus = $ccMenus.getMenus(menusCtrl.menuSource);
		menusCtrl.createMenuList(menus);
		assert.isArray(menusCtrl.menuList, 'menuSource is Array: menuList is Array');
	});

	it('unfoldClick', () => {
		const menusCtrl = $componentController('ccMenuBar', null, bindings);
		let unfold = menusCtrl.unfold;
		menusCtrl.unfoldClick();
		assert.equal(menusCtrl.unfold, !unfold);

		menusCtrl.onUnfold = null;
		unfold = menusCtrl.unfold;
		menusCtrl.unfoldClick();
		assert.equal(menusCtrl.unfold, !unfold);
	});

	it('showShopSelect', () => {
		const menusCtrl = $componentController('ccMenuBar', null, bindings);
		const shopShow = menusCtrl.shopShow;
		menusCtrl.showShopSelect();
		assert.equal(menusCtrl.shopShow, !shopShow);
		assert.isFalse(menusCtrl.isInitShopSelect);

		menusCtrl.shopShow = true;
		menusCtrl.showShopSelect();
		assert.equal(menusCtrl.shopShow, false);
		assert.isFalse(menusCtrl.isInitShopSelect);
	});
});
