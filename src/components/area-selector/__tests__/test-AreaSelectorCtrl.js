/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 1/5/17
 */

import AreaSelectorCtrl from '../AreaSelectorCtrl';
import angular from 'angular';

import {assert} from 'chai';
import sinon from 'sinon';

describe('AreaSelectorCtrl', () => {

	let $controller;
	let areaSelectorCtrl;
	let spy;

	beforeEach(() => {
		angular.mock.module('app');
		angular.mock.inject(_$controller_ => {
			$controller = _$controller_;
		});
		areaSelectorCtrl = $controller(AreaSelectorCtrl, {'modalInstance': {}, 'selectedData': []});
		spy = sinon.spy();
	});

	afterEach(() => {
		$controller = null;
	});

	it('#analyzeAreaSelectedStatusByChildren', () => {
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

	it('#isSelected', () => {
		const elementSelected = { id: '1100', selected: true };
		const elementNotSelected = { id: '1100', selected: false };
		assert.isTrue(areaSelectorCtrl.isSelected(elementSelected));
		assert.isFalse(areaSelectorCtrl.isSelected(elementNotSelected));
	});

	it('#isSelectedAll', () => {
		const elementSelectedAll = { id: '1100', selectedAll: true };
		const elementNotSelectedAll = { id: '1100', selectedAll: false };
		assert.isTrue(areaSelectorCtrl.isSelectedAll(elementSelectedAll));
		assert.isFalse(areaSelectorCtrl.isSelectedAll(elementNotSelectedAll));
	});

	it('#initCommonAreas', () => {
		areaSelectorCtrl.initCommonAreas();
		assert.lengthOf(areaSelectorCtrl.commonAreas, 7);
		spy(areaSelectorCtrl, 'getCommonAreaSelectedStatus');
		sinon.assert.calledOnce(spy);
	});
});
