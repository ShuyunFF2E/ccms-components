/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 1/5/17
 */

import AreaSelectorCtrl from '../AreaSelectorCtrl';
import angular from 'angular';

import {assert} from 'chai';

describe('AreaSelectorCtrl', () => {

	let $controller;

	beforeEach(() => {
		angular.mock.module('app');
		angular.mock.inject(_$controller_ => {
			$controller = _$controller_;
		});
	});

	afterEach(() => {
		$controller = null;
	});

	it('#analyzeAreaSelectedStatusByChildren', () => {

		const areaSelectorCtrl = $controller(AreaSelectorCtrl, {'modalInstance': {}, 'selectedData': []});
		const selectedArea = {
			children: [
				{id: '310000', name: '上海市', selected: true, selectedAll: false},
				{id: '320000', name: '江苏省', selected: true, selectedAll: false}
			],
			id: 1,
			name: '江浙沪',
			subArea: ['310000', '320000']
		};
		areaSelectorCtrl.analyzeAreaSelectedStatusByChildren(selectedArea);
		assert.isTrue(selectedArea.selected);
		assert.isFalse(selectedArea.selectedAll);
	});
});
