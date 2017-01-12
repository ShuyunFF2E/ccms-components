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

		areaSelectorCtrl = $controller(AreaSelectorCtrl, {
			'modalInstance': {
				ok: function() {},
				_renderDeferred: {
					promise: () => Promise.resolve()
				}
			},
			'selectedData': [],
			'$ccTips': {
				error: () => Promise.resolve()
			},
			$element: {
			}
		});
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
		const elementSelected = {id: '1100', selected: true};
		const elementNotSelected = {id: '1100', selected: false};
		assert.isTrue(areaSelectorCtrl.isSelected(elementSelected));
		assert.isFalse(areaSelectorCtrl.isSelected(elementNotSelected));
	});

	it('#isSelectedAll', () => {
		const elementSelectedAll = {id: '1100', selectedAll: true};
		const elementNotSelectedAll = {id: '1100', selectedAll: false};
		assert.isTrue(areaSelectorCtrl.isSelectedAll(elementSelectedAll));
		assert.isFalse(areaSelectorCtrl.isSelectedAll(elementNotSelectedAll));
	});

	it('#initCommonAreas', () => {
		areaSelectorCtrl.areas = areas;
		areaSelectorCtrl.initCommonAreas();
		assert.lengthOf(areaSelectorCtrl.commonAreas, 6);
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
		assert.lengthOf(areaSelectorCtrl.setAreaStatus('310000', areas, true, ''), 2);
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

	it('#analyzeSelectedData', () => {
		areaSelectorCtrl.selectedValue = [
			{id: '310000,310100,310101', name: ''},
			{id: '310000,310200', name: ''},
			{id: '320000', name: ''}
		];
		areaSelectorCtrl.areas = areas;
		areaSelectorCtrl.analyzeArea = sinon.spy();
		areaSelectorCtrl.analyzeSelectedData();
		sinon.assert.callCount(areaSelectorCtrl.analyzeArea, 3);
		areaSelectorCtrl.analyzeArea.firstCall.calledWith(['310000', '310100', '310101'], 0, areas);
		areaSelectorCtrl.analyzeArea.secondCall.calledWith(['310000', '310200'], 0, areas);
		areaSelectorCtrl.analyzeArea.thirdCall.calledWith(['320000'], 0, areas);
	});

	it('#changeProvince', () => {
		const province = {
			children: [
				{
					id: '110100',
					name: '市辖区',
					children: [
						{id: '110101', name: '东城区', children: null},
						{id: '110102', name: '西城区', children: null}]
				}
			],
			id: '110000',
			name: '北京'
		};
		areaSelectorCtrl.changeProvince(province, province.children);
		assert.deepEqual(areaSelectorCtrl.citys, province.children);
		assert.deepEqual(areaSelectorCtrl.districts, []);
		assert.deepEqual(areaSelectorCtrl.selectedProvince, province);
	});

	it('#changeCity', () => {
		const city = {
			children: [
				{id: '130102', name: '东城区', children: null},
				{id: '130103', name: '桥东区', children: null}

			],
			id: '130100',
			name: '石家庄市'
		};
		areaSelectorCtrl.changeCity(city);
		assert.deepEqual(areaSelectorCtrl.districts, city.children);
		assert.deepEqual(areaSelectorCtrl.selectedCity, city);
	});

	it('#changeParentAreaStatus', () => {
		areaSelectorCtrl.analyzeAreaSelectedStatusByChildren = sinon.spy();
		const selectedProvince = {id: '120000'};
		const selectedCity = {id: '130100'};
		areaSelectorCtrl.changeParentAreaStatus('district', selectedProvince, selectedCity);
		sinon.assert.calledWith(areaSelectorCtrl.analyzeAreaSelectedStatusByChildren, selectedCity);
		areaSelectorCtrl.changeParentAreaStatus('city', selectedProvince, selectedCity);
		sinon.assert.calledWith(areaSelectorCtrl.analyzeAreaSelectedStatusByChildren, selectedProvince);
	});

	it('#changeChildrenAreaStatus', () => {
		areaSelectorCtrl.setSelectedAndSelectedAll = sinon.spy();
		areaSelectorCtrl.setSelectedValue = sinon.spy();
		areaSelectorCtrl.setSelectedAllValue = sinon.spy();
		const area = {id: '120000', name: '天津市', children: [{id: '120100', name: '市辖区'}]};
		const value = true;
		areaSelectorCtrl.changeChildrenAreaStatus(area, value);
		sinon.assert.calledWith(areaSelectorCtrl.setSelectedAndSelectedAll, area, value, value);
		sinon.assert.calledWith(areaSelectorCtrl.setSelectedValue, area.children, value);
		sinon.assert.calledWith(areaSelectorCtrl.setSelectedAllValue, area.children, value);
	});

	it('#changeChildrenStatus', () => {
		areaSelectorCtrl.changeChildrenAreaStatus = sinon.spy();
		const areaA = {id: '120000', name: '天津市', children: [{id: '120100', name: '市辖区'}], selectedAll: true};
		areaSelectorCtrl.changeChildrenStatus(areaA);
		sinon.assert.calledWith(areaSelectorCtrl.changeChildrenAreaStatus, areaA, false);
		const areaB = {id: '120000', name: '天津市', children: [{id: '120100', name: '市辖区'}], selectedAll: false};
		areaSelectorCtrl.changeChildrenStatus(areaB);
		sinon.assert.calledWith(areaSelectorCtrl.changeChildrenAreaStatus, areaB, true);
	});

	it('#changeCheckboxStatus', () => {
		areaSelectorCtrl.changeChildrenStatus = sinon.spy();
		areaSelectorCtrl.changeParentAreaStatus = sinon.spy();
		areaSelectorCtrl.getSelectedAreasByAreaMap = sinon.spy();
		areaSelectorCtrl.getCommonAreaSelectedStatus = sinon.spy();
		const area = {id: '120000', name: '天津市', children: [{id: '120100', name: '市辖区'}]};
		areaSelectorCtrl.changeCheckboxStatus(area, 'province');
		assert.deepEqual(areaSelectorCtrl.selectedProvince, area);
		sinon.assert.calledOnce(areaSelectorCtrl.changeChildrenStatus);
		sinon.assert.calledOnce(areaSelectorCtrl.changeParentAreaStatus);
		sinon.assert.calledOnce(areaSelectorCtrl.getSelectedAreasByAreaMap);
		sinon.assert.calledOnce(areaSelectorCtrl.getCommonAreaSelectedStatus);
	});

	it('#analyzeArea', () => {
		areaSelectorCtrl.setAreaStatus = sinon.spy();
		areaSelectorCtrl.setSelectedValue = sinon.spy();
		areaSelectorCtrl.setSelectedAllValue = sinon.spy();
		areaSelectorCtrl.selectedAreas = [];
		areaSelectorCtrl.analyzeArea(['110000', '110100', '110103'], 0, areaSelectorCtrl.areas, '');
		sinon.assert.callCount(areaSelectorCtrl.setAreaStatus, 3);
		sinon.assert.callCount(areaSelectorCtrl.setSelectedValue, 1);
		sinon.assert.callCount(areaSelectorCtrl.setSelectedAllValue, 1);
	});

	it('#deleteArea', () => {
		areaSelectorCtrl.deleteAreaById = sinon.spy();
		areaSelectorCtrl.getCommonAreaSelectedStatus = sinon.spy();
		areaSelectorCtrl.selectedAreas = [{id: 1}, {id: 2}, {id: 3}];
		areaSelectorCtrl.deleteArea({id: '120000', name: '天津市'}, 20);
		sinon.assert.calledWith(areaSelectorCtrl.deleteAreaById, {
			id: '120000',
			name: '天津市'
		}, 0, areaSelectorCtrl.areas, []);
		sinon.assert.calledOnce(areaSelectorCtrl.getCommonAreaSelectedStatus);
	});

	it('#deleteAreaById', () => {
		areaSelectorCtrl.changeChildrenAreaStatus = sinon.spy();
		areaSelectorCtrl.changeParentAreaStatus = sinon.spy();
		areaSelectorCtrl.deleteAreaById([{id: '110000'}], 0, areas, []);
		sinon.assert.callCount(areaSelectorCtrl.changeChildrenAreaStatus, 1);
		sinon.assert.callCount(areaSelectorCtrl.changeParentAreaStatus, 1);
	});

	it('#ok', () => {
		areaSelectorCtrl.getSelectedValue = sinon.spy();
		areaSelectorCtrl.selectedAreas = [
			[{id: '310000'}, {id: '310100'}, {id: '310101'}],
			[{id: '310000'}, {id: '310200'}], [{id: '320000'}]
		];
		areaSelectorCtrl.ok();
		sinon.assert.callCount(areaSelectorCtrl.getSelectedValue, 3);
	});

	it('#getParentSelectedStatus', () => {
		areaSelectorCtrl.analyzeAreaSelectedStatusByChildren = sinon.spy();
		const commonAreaA = {id: '310000', children: [{id: '310100'}]};
		areaSelectorCtrl.areas = areas;
		areaSelectorCtrl.getParentSelectedStatus(commonAreaA);
		sinon.assert.notCalled(areaSelectorCtrl.analyzeAreaSelectedStatusByChildren);
		const commonAreaB = {id: '310000', children: [{id: '310100', parentId: '310000'}]};
		areaSelectorCtrl.getParentSelectedStatus(commonAreaB);
		sinon.assert.calledOnce(areaSelectorCtrl.analyzeAreaSelectedStatusByChildren);
	});

	it('#getSelectedValue', () => {
		const area = [{id: '310000'}, {id: '310100'}, {id: '310101'}];
		areaSelectorCtrl.selectedAreaString = '';
		areaSelectorCtrl.getSelectedValue(area, 0);
		assert.equal(areaSelectorCtrl.selectedAreaString, '310000,310100,310101');
	});

	it('#getCommonAreaSelectedStatus', () => {
		areaSelectorCtrl.getCommonAreasTree = sinon.spy();
		areaSelectorCtrl.analyzeAreaSelectedStatusByChildren = sinon.spy();
		areaSelectorCtrl.commonAreas = [
			{
				'id': 1,
				'name': '江浙沪',
				'subArea': ['310000', '320000', '330000']
			},
			{
				'id': 2,
				'name': '珠三角',
				'subArea': ['440000,440100', '440000,440300']
			}
		];
		areaSelectorCtrl.getCommonAreaSelectedStatus();
		sinon.assert.callCount(areaSelectorCtrl.getCommonAreasTree, 5);
		sinon.assert.callCount(areaSelectorCtrl.analyzeAreaSelectedStatusByChildren, 2);
	});

	it('#getCommonAreasTree', () => {
		const areaIdArrayA = ['310000', '310100'];
		const areaIdArrayB = ['320000'];
		const areaTrees = [];
		areaSelectorCtrl.areas = [
			{
				'id': '310000',
				'name': '上海市',
				'selected': true,
				'selectedAll': false,
				'children': [
					{
						'id': '310100',
						'name': '市辖区',
						'selected': false,
						'selectedAll': true
					}
				]
			},
			{
				'id': '320000',
				'name': '江苏省',
				'selected': true,
				'selectedAll': true
			}
		];
		areaSelectorCtrl.getCommonAreasTree(areaIdArrayA, areaTrees);
		assert.deepEqual(areaTrees[0], {
			'id': '310100',
			'name': '市辖区',
			'selected': false,
			'selectedAll': true,
			'parentId': '310000'
		});
		areaSelectorCtrl.getCommonAreasTree(areaIdArrayB, areaTrees);
		assert.deepEqual(areaTrees[1], {
			'id': '320000',
			'name': '江苏省',
			'selected': true,
			'selectedAll': true
		});
	});

	it('#selectedCommonArea', () => {
		areaSelectorCtrl.setSelectedAndSelectedAll = sinon.spy();
		areaSelectorCtrl.setCommonAreaStatus = sinon.spy();
		areaSelectorCtrl.getParentSelectedStatus = sinon.spy();
		areaSelectorCtrl.getSelectedAreasByAreaMap = sinon.spy();
		areaSelectorCtrl.getCommonAreaSelectedStatus = sinon.spy();
		areaSelectorCtrl.selectedCommonArea({id: '310000', selectedAll: true});
		assert.deepEqual(areaSelectorCtrl.selectedAreas, []);
		sinon.assert.calledWith(areaSelectorCtrl.setSelectedAndSelectedAll, {id: '310000', selectedAll: true}, false, false);
		sinon.assert.calledOnce(areaSelectorCtrl.setCommonAreaStatus);
		sinon.assert.calledOnce(areaSelectorCtrl.getParentSelectedStatus);
		sinon.assert.calledOnce(areaSelectorCtrl.getSelectedAreasByAreaMap);
		sinon.assert.calledOnce(areaSelectorCtrl.getCommonAreaSelectedStatus);
		areaSelectorCtrl.selectedCommonArea({id: '310000', selectedAll: false});
		sinon.assert.calledWith(areaSelectorCtrl.setSelectedAndSelectedAll, {id: '310000', selectedAll: false}, true, true);
	});

	it('#getSelectedAreasByAreaMap', () => {
		const areasArr = [
			{
				'id': '310000',
				'name': '上海市',
				'selected': true,
				'selectedAll': false,
				'children': [
					{
						'id': '310100',
						'name': '市辖区',
						'selected': false,
						'selectedAll': true
					}
				]
			},
			{
				'id': '320000',
				'name': '江苏省',
				'selected': true,
				'selectedAll': true
			}
		];
		areaSelectorCtrl.selectedAreas = [];
		areaSelectorCtrl.getSelectedAreasByAreaMap(areasArr, []);
		assert.deepEqual(areaSelectorCtrl.selectedAreas, [[{id: '310000', name: '上海市'}, {id: '310100', name: '市辖区'}], [{id: '320000', name: '江苏省'}]]);
	});

	it('#setCommonAreaStatus', () => {
		const commonAreas = [
			{
				'id': 1,
				'name': '江浙沪',
				'subArea': ['310000'],
				'children': [{'id': '310000'}],
				selected: true
			},
			{
				'id': 2,
				'name': '珠三角',
				'subArea': ['310000,310100'],
				'children': [{'id': '310100', 'parentId': '310000'}],
				selected: false
			}
		];
		areaSelectorCtrl.changeChildrenAreaStatus = sinon.spy();
		areaSelectorCtrl.areas = areas;
		areaSelectorCtrl.setCommonAreaStatus(commonAreas[0]);
		sinon.assert.calledWith(areaSelectorCtrl.changeChildrenAreaStatus, areas[0], true);
		areaSelectorCtrl.setCommonAreaStatus(commonAreas[1]);
		sinon.assert.calledWith(areaSelectorCtrl.changeChildrenAreaStatus, areas[0].children[0], false);
	});

	it('#getAreasFromLocalStorage', () => {
		localStorage.getItem = sinon.stub();
		localStorage.setItem = sinon.spy();
		localStorage.getItem.withArgs('CCMS_COMPONENTS_AREA_SELECTOR_DATA').onFirstCall().returns(null).onSecondCall().returns(2);
		assert.equal(areaSelectorCtrl.getAreasFromLocalStorage(), 2);
		sinon.assert.calledTwice(localStorage.getItem);
		sinon.assert.calledOnce(localStorage.setItem);
	});

});
