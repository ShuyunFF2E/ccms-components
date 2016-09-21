/**
 * Created with test-MenusCtrl.js
 * @Author: maxsmu
 * @Homepage: https://github.com/maxsmu
 * @Date: 2016-08-17 10:42 AM
 */

import angular from 'angular';
// import { Inject } from 'angular-es-utils/decorators';
// import injector from 'angular-es-utils/injector';

// import MenusCtrl from '../MenusCtrl';
// import $menus from '../MenuService';

// import { assert } from 'chai';

describe('MenusCtrl', $timeout => {

	const menusList = [
		{
			'name': '忠诚度设置',
			'state': 'card',
			'icon': '',
			'children': [
				{
					'name': '积分类型',
					'state': 'card.point',
					'icon': '',
					'children': []
				},
				{
					'name': '等级类型',
					'state': 'card.grade',
					'icon': '',
					'children': []
				}
			]
		},
		{
			'name': 'TAE会员专区',
			'state': 'views',
			'icon': '',
			'children': [
				{
					'name': '界面设置',
					'state': 'views.set',
					'icon': '',
					'children': [
						{
							'name': '手淘',
							'state': 'views.set.st',
							'icon': '',
							'children': []
						}
					]
				},
				{
					'name': '赚积分',
					'state': 'views.point',
					'icon': '',
					'children': [
						{
							'name': '签到',
							'state': 'views.point.sign',
							'icon': '',
							'children': [
								{
									'name': '再签到',
									'state': 'views.point.sign.reload',
									'icon': '',
									'children': []
								}
							]
						}
					]
				}
			]
		},
		{
			'name': '会员等级管理',
			'state': 'grade',
			'icon': '',
			'children': []
		}
	];
	const shopsList = [
		{
			'name': '天猫店铺',
			'value': 'tb',
			'active': true,
			'child': [
				{
					'name': '小猫时尚旗舰店',
					'active': true,
					'value': 'tb-cut',
					'logo': 'http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg'
				},
				{
					'name': '小狗时尚旗舰店',
					'value': 'tb-dog',
					'logo': 'http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg'
				},
				{
					'name': '小仔时尚旗舰店',
					'value': 'tb-cub',
					'logo': 'http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg'
				},
				{
					'name': '洋陽轩旗舰店',
					'value': 'tb-yy',
					'logo': 'http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg'
				}
			]
		},
		{
			'name': '京东店铺',
			'value': 'jd',
			'child': [
				{
					'name': '小猫时尚旗舰店',
					'value': 'jd-cut',
					'logo': 'http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg'
				},
				{
					'name': '小狗时尚旗舰店',
					'value': 'jd-dog',
					'logo': 'http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg'
				},
				{
					'name': '小仔时尚旗舰店',
					'value': 'jd-cub',
					'logo': 'http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg'
				},
				{
					'name': '洋陽轩旗舰店',
					'value': 'jd-yy',
					'logo': 'http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg'
				}
			]
		}
	];

	let $compile;
	let $rootScope;
	let options = {
		unfold: true,
		unfoldClick: unfold => console.log('结果:', unfold),
		menusResource: menusList,
		shopsResource: shopsList,
		searchPlaceholder: '请输入XXX'
	};
	beforeEach(angular.module('app'));

	beforeEach(angular.mock.inject((_$compile_, _$rootScope_) => {
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));

	console.log(JSON.stringify(options), JSON.stringify($compile), JSON.stringify($rootScope));
	// it('Component-menus', () => {
	//	$compile(`<menu-bar
	//		 unfold="${options.unfold}"
	//		 on-unfold="${options.unfoldClick}"
	//		 menu-source="${options.menusResource}"
	//		 shop-source="${options.shopsResource}"
	//		 search-placeholder="${options.searchPlaceholder}"></menu-bar>`)($rootScope);
	//
	//	// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
	//	$rootScope.$digest();
	// });

	console.log(menusList, shopsList);
});
