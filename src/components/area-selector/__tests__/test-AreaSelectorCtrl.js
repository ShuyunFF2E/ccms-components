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
	let areas;

	beforeEach(() => {
		angular.mock.module('app');
		angular.mock.inject(_$controller_ => {
			$controller = _$controller_;
		});
		areaSelectorCtrl = $controller(AreaSelectorCtrl, {'modalInstance': {}, 'selectedData': []});
		spy = sinon.spy();
		areas = [
			{
				'id': '310000',
				'name': '上海市',
				'children': [
					{
						'id': '310100',
						'name': '市辖区',
						'children': [
							{'id': '310101', 'name': '黄浦区', 'children': null},
							{'id': '310104', 'name': '徐汇区', 'children': null}
						]
					},
					{
						'id': '310200',
						'name': '县',
						'children': [{'id': '310230', 'name': '崇明县', 'children': null}]
					}
				]
			},
			{
				'id': '320000',
				'name': '江苏省',
				'children': [
					{
						'id': '320100',
						'name': '南京市',
						'children': [
							{'id': '320101', 'name': '市辖区', 'children': null},
							{'id': '320102', 'name': '玄武区', 'children': null},
							{'id': '320103', 'name': '白下区', 'children': null},
							{'id': '320104', 'name': '秦淮区', 'children': null}
						]
					},
					{
						'id': '320200',
						'name': '无锡市',
						'children': [
							{'id': '320201', 'name': '市辖区', 'children': null},
							{'id': '320202', 'name': '崇安区', 'children': null},
							{'id': '320203', 'name': '南长区', 'children': null},
							{'id': '320204', 'name': '北塘区', 'children': null},
							{'id': '320205', 'name': '锡山区', 'children': null}
						]
					},
					{
						'id': '320300',
						'name': '徐州市',
						'children': [
							{'id': '320301', 'name': '市辖区', 'children': null},
							{'id': '320302', 'name': '鼓楼区', 'children': null},
							{'id': '320303', 'name': '云龙区', 'children': null},
							{'id': '320304', 'name': '九里区', 'children': null},
							{'id': '320305', 'name': '贾汪区', 'children': null},
							{'id': '320311', 'name': '泉山区', 'children': null},
							{'id': '320321', 'name': '丰县', 'children': null}
						]
					}
				]
			}
		];
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

	it('#selectDistrict', () => {
		areaSelectorCtrl.initCommonAreas();
		assert.lengthOf(areaSelectorCtrl.commonAreas, 7);
		spy(areaSelectorCtrl, 'getCommonAreaSelectedStatus');
		sinon.assert.calledOnce(spy);
	});

	it('#selectDistrict', () => {
		const district = {'id': '210102', 'name': '和平区', 'children': null};
		areaSelectorCtrl.selectDistrict(district);
		assert.deepEqual(areaSelectorCtrl.selectedDistrict, district);
	});

	it('#setSelectedAndSelectedAll', () => {
		const area = {'id': '210102', 'name': '和平区', 'children': null};
		areaSelectorCtrl.setSelectedAndSelectedAll(area, true, false);
		assert.isTrue(area.selected);
		assert.isFalse(area.selectedAll);
	});

	it('#setAreaStatus', () => {
		areaSelectorCtrl.selectedAreaArray = [];
		spy(areaSelectorCtrl, 'setSelectedAndSelectedAll');
		assert.lengthOf(areaSelectorCtrl.setAreaStatus('310000', areas, true), 2);
		assert.lengthOf(areaSelectorCtrl.selectedAreaArray, 1);
		sinon.assert.calledOnce(spy);
	});

	it('#setSelectedAllValue', () => {
		areaSelectorCtrl.setSelectedAllValue(areas, true);
		assert.isTrue(areas[0].selectedAll);
	});

	it('#setSelectedValue', () => {
		areaSelectorCtrl.setSelectedValue(areas, true);
		assert.isTrue(areas[0].selected);
	});
});
