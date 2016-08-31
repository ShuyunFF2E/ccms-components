/**
 * Created with test-MenuService.js
 * @Author: maxsmu
 * @Homepage: https://github.com/maxsmu
 * @Date: 2016-08-31 3:08 PM
 */

import angular from 'angular';

import { assert } from 'chai';
import $ccMenus from '../MenuService';
import CONFIG from '../Constant';

describe('$ccMenus Service', () => {

	let $resource;

	beforeEach(angular.mock.module('app'));

	beforeEach(angular.mock.inject((_$componentController_, _$resource_) => {
		$resource = _$resource_;
	}));

	it('getMenus', () => {
		let menuResource = $ccMenus.getMenus($resource('/menus'));
		assert.isTrue(menuResource.isResource);
		assert.isArray(menuResource.resource);

		menuResource = $ccMenus.getMenus([]);
		assert.isFalse(menuResource.isResource);
		assert.isArray(menuResource.resource);
	});

	it('getShops', () => {
		let menuResource = $ccMenus.getShops($resource('/shops'));
		assert.isTrue(menuResource.isResource);
		assert.isArray(menuResource.resource);

		menuResource = $ccMenus.getShops([]);
		assert.isFalse(menuResource.isResource);
		assert.isArray(menuResource.resource);
	});

	it('getCurrentPlatShop', () => {
		const current = $ccMenus.getCurrentPlatShop();
		assert.deepEqual(current, CONFIG.CURRENT);
	});

	it('setCurrentPlatShop', () => {

		const plat = {
			name: '天猫',
			value: 'tb',
			child: []
		};
		const shop = {
			name: '店铺',
			value: 'tb-shop'
		};
		$ccMenus.setCurrentPlatShop(plat, shop);
		assert.deepEqual(CONFIG.CURRENT, {plat, shop});
	});

	it('onMenuChange', () => {

		const listener = () => assert.equal(1, 1);
		$ccMenus.onMenuChange(listener);
		assert.isOk(CONFIG.menuChangeTopics.includes(listener));
	});

	it('dispatchMenuChange', () => {

		$ccMenus.onMenuChange(() => assert.equal(1, 1));
		$ccMenus.dispatchMenuChange();
	});

	it('offMenuChange', () => {

		$ccMenus.onMenuChange(() => assert.equal(1, 1));
		$ccMenus.offMenuChange();
		assert.equal(CONFIG.menuChangeTopics.length, 0);
	});

	it('onShopChange', () => {
		const listener = () => assert.equal(1, 1);
		$ccMenus.onShopChange(listener);
		assert.isOk(CONFIG.shopChangeTopics.includes(listener));
	});

	it('dispatchShopChange', () => {

		$ccMenus.onShopChange(() => assert.equal(1, 1));
		$ccMenus.dispatchShopChange({});
	});

	it('onShopChangeStart', () => {
		const listener = () => assert.equal(1, 1);
		$ccMenus.onShopChangeStart(listener);
		assert.isOk(CONFIG.shopChangeStartTopics.includes(listener));
	});

	it('dispatchShopChangeStart', () => {

		$ccMenus.onShopChangeStart(() => assert.equal(1, 1));
		$ccMenus.dispatchShopChangeStart({});
	});

	it('isOnShopChangeStart', () => {

		$ccMenus.onShopChangeStart(() => assert.equal(1, 1));
		$ccMenus.isOnShopChangeStart();
		assert.isOk(CONFIG.shopChangeStartTopics.length);
	});
});
