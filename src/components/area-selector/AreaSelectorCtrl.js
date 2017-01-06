/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

import angular from 'angular';
import { Inject } from 'angular-es-utils/decorators';
import { COMMON_AREAS } from './Constant';


@Inject('modalInstance', 'selectedData')
export default class AreaSelectorCtrl {
	constructor() {
		this.init();
	}

	init() {
		this.areas = this.getAreasFromLocalStorage();
		this.provinces = this.areas;
		this.selectedValue = this._selectedData;
		this.selectedAreas = [];
		this.analyzeSelectedData();
		this.initCommonAreas();
	}

	/**
	 * @name getAreasFromLocalStorage 从localStorage获取全部省、市、区县信息
	 */
	getAreasFromLocalStorage() {
		if (!localStorage.getItem('CCMS_COMPONENTS_AREA_SELECTOR_DATA')) {
			const areas = require('./areas.json');
			localStorage.setItem('CCMS_COMPONENTS_AREA_SELECTOR_DATA', angular.toJson(areas));
		}
		return angular.fromJson(localStorage.getItem('CCMS_COMPONENTS_AREA_SELECTOR_DATA'));
	}

	/**
	 * @name initCommonAreas 初始化常用区域
	 */
	initCommonAreas() {
		this.commonAreas = COMMON_AREAS;
		this.getCommonAreaSelectedStatus();
	}

	/**
	 * @name getCommonAreaSelectedStatus 获得常用区域选中状态
	 */
	getCommonAreaSelectedStatus() {
		this.commonAreas.map(commonArea => {
			let areaTrees = [];
			commonArea.subArea.map(areaId => {
				const areaIdArray = areaId.split(',');
				this.getCommonAreasTree(areaIdArray, areaTrees);
			});
			commonArea.children = areaTrees;
			this.analyzeAreaSelectedStatusByChildren(commonArea);
		});
	}

	getCommonAreasTree(areaIdArray, areaTrees) {
		const area = this.areas.find(item => item.id === areaIdArray[0]);
		if (areaIdArray.length === 1) {
			areaTrees.push({id: area.id, name: area.name, selected: area.selected, selectedAll: area.selectedAll});
		} else {
			const subArea = area.children.find(item => item.id === areaIdArray[1]);
			areaTrees.push(
				{
					id: subArea.id,
					name: subArea.name,
					selected: subArea.selected,
					selectedAll: subArea.selectedAll,
					parentId: area.id
				}
			);
		}
	}

	/**
	 * @name analyzeSelectedData 解析传入的已选择数据
	 */
	analyzeSelectedData() {
		this.selectedValue.map(element => {
			this.selectedAreaArray = [];
			const selectedAreas = element.split(',');
			this.analyzeArea(selectedAreas, 0, this.areas);
		});
	}

	/**
	 * @name analyzeArea 解析选中区域
	 * @param selectedAreas <object> 选中区域
	 * @param index <number> 下标
	 * @param areas <object> 区域
	 */
	analyzeArea(selectedAreas, index, areas) {
		const hasChild = (index < selectedAreas.length - 1);
		const subArea = this.setAreaStatus(selectedAreas[index], areas, hasChild);
		if (!hasChild) {
			this.selectedAreas.push(this.selectedAreaArray);
			this.setSelectedValue(subArea, true);
			this.setSelectedAllValue(subArea, true);
		} else {
			this.analyzeArea(selectedAreas, index + 1, subArea);
		}
	}

	/**
	 * @name setSelectedValue 设置selected属性值
	 * @param areas <object> 区域
	 * @param value <boolean> true / false
	 */
	setSelectedValue(areas, value) {
		if (areas) {
			areas.map(element => {
				element.selected = value;
				this.setSelectedValue(element.children, value);
			});
		}
	}

	/**
	 * @name setSelectedAllValue 设置selectedAll属性值
	 * @param areas <object> 区域
	 * @param value <boolean> true / false
	 */
	setSelectedAllValue(areas, value) {
		if (areas) {
			areas.map(element => {
				element.selectedAll = value;
				this.setSelectedAllValue(element.children, value);
			});
		}
	}

	/**
	 * @name setAreaStatus 设置区域状态
	 * @param areaId <string> 区域ID
	 * @param areas <object> 区域等级
	 * @param hasChild <boolean> 是否拥有孩子节点
	 */
	setAreaStatus(areaId, areas, hasChild) {
		let selectedArea = areas.find(item => item.id === areaId);
		this.setSelectedAndSelectedAll(selectedArea, true, !hasChild);
		this.selectedAreaArray.push({ name: selectedArea.name, id: selectedArea.id });
		return selectedArea.children;
	}

	/**
	 * @name changeCheckboxStatus 选择checkbox状态
	 * @param area <object> 被选择checkbox的区域
	 * @param areaLevel <boolean> 区域等级
	 */
	changeCheckboxStatus(area, areaLevel) {
		if (areaLevel === 'province') {
			this.selectedProvince = area;
		}
		this.changeChildrenStatus(area);
		this.changeParentAreaStatus(areaLevel, this.selectedProvince, this.selectedCity);
		this.selectedAreas = [];
		this.getSelectedAreasByAreaMap(this.areas, []);
		this.getCommonAreaSelectedStatus();
	}

	/**
	 * @name getSelectedAreasByAreaMap 获得已选区域的状态通过AreaMap(递归)
	 * @param areas <object> 递归出来不同等级的区域
	 * @param selectedArray <array> 存放被选择的区域
	 */
	getSelectedAreasByAreaMap(areas, selectedArray) {
		areas.map(item => {
			if (item.selectedAll) {
				selectedArray.push({id: item.id, name: item.name});
				const pushedArea = angular.copy(selectedArray);
				this.selectedAreas.push(pushedArea);
				selectedArray.pop();
			} else if (item.selected && item.children) {
				selectedArray.push({id: item.id, name: item.name});
				this.getSelectedAreasByAreaMap(item.children, selectedArray);
			}
		});
		selectedArray.pop();
	}

	/**
	 * @name changeChildrenStatus 改变孩子区域状态
	 * @param area <object> 区域
	 */
	changeChildrenStatus(area) {
		if (area.selectedAll) {
			this.changeChildrenAreaStatus(area, false);
		} else {
			this.changeChildrenAreaStatus(area, true);
		}
	}

	/**
	 * @name changeChildrenAreaStatus 改变孩子区域状态
	 * @param area <object> 区域
	 * @param value <boolean> 区域等级
	 */
	changeChildrenAreaStatus(area, value) {
		this.setSelectedAndSelectedAll(area, value, value);
		this.setSelectedValue(area.children, value);
		this.setSelectedAllValue(area.children, value);
	}

	/**
	 * @name changeParentAreaStatus 改变父亲区域状态
	 * @param areaLevel <string> 区域等级
	 * @param selectedProvince <object> 选中的省份
	 * @param selectedCity <object> 选中的城市
	 */
	changeParentAreaStatus(areaLevel, selectedProvince, selectedCity) {
		if (areaLevel === 'district') {
			this.analyzeAreaSelectedStatusByChildren(selectedCity);
		}
		this.analyzeAreaSelectedStatusByChildren(selectedProvince);
	}

	/**
	 * @name analyzeAreaSelectedStatusByChildren 解析区域selected状态通过所有孩子区域
	 * @param selectedArea <object> 被解析的区域
	 */
	analyzeAreaSelectedStatusByChildren(selectedArea) {
		if (selectedArea.children) {
			selectedArea.selected = selectedArea.children.some(this.isSelected);
			selectedArea.selectedAll = selectedArea.children.every(this.isSelectedAll);
		}
	}

	/**
	 * @name isSelectedAll 是否被选全选
	 * @param element <object> 子区域
	 */
	isSelectedAll(element) {
		return element.selectedAll;
	}

	/**
	 * @name isSelected 是否被选中
	 * @param element <object> 子区域
	 */
	isSelected(element) {
		return element.selected;
	}

	/**
	 * @name changeProvince 切换选中省份
	 * @param province <object> 选中的省份
	 */
	changeProvince(province) {
		this.citys = province.children;
		this.districts = [];
		this.selectedProvince = province;
	}

	/**
	 * @name changeCity 切换选中城市
	 * @param city <object> 选中的城市
	 */
	changeCity(city) {
		this.districts = city.children;
		this.selectedCity = city;
	}

	/**
	 * @name deleteArea 删除某个已选区域
	 * @param area <object> 被删除的区域
	 * @param index <number> 被删除区域的下标
	 */
	deleteArea(area, index) {
		let deleteAreaArray = [];
		this.selectedAreas.splice(index, 1);
		this.deleteAreaById(area, 0, this.areas, deleteAreaArray);
		this.getCommonAreaSelectedStatus();
	}

	/**
	 * @name deleteAreaById 删除Area在下方选择框的状态(递归)
	 * @param area <object> 需要被删除的区域
	 * @param areaIndex <boolean> 需要被删除的区域的下标(循环)
	 * @param areas <boolean> 全局维护的Areas Map
	 * @param deleteAreaArray <array> 存放被删除的区域(每个array是object类型)
	 */
	deleteAreaById(area, areaIndex, areas, deleteAreaArray) {
		const selectedArea = areas.find(item => item.id === area[areaIndex].id);
		deleteAreaArray.push(selectedArea);
		if (areaIndex === area.length - 1) {
			this.changeChildrenAreaStatus(selectedArea, false);
			const areaStatus = area.length === 3 ? 'district' : '';
			this.changeParentAreaStatus(areaStatus, deleteAreaArray[0], deleteAreaArray[1]);
		} else {
			this.deleteAreaById(area, areaIndex + 1, selectedArea.children, deleteAreaArray);
		}
	}

	/**
	 * @name setSelectedAndSelectedAll 设置一个区域的selected和selectedAll属性值
	 * @param area <object> 需要被设置的区域
	 * @param selectedValue <boolean> selected值
	 * @param selectedAllValue <boolean> selectedAll值
	 */
	setSelectedAndSelectedAll(area, selectedValue, selectedAllValue) {
		area.selected = selectedValue;
		area.selectedAll = selectedAllValue;
	}

	/**
	 * @name selectDistrict 选中某一个区县
	 * @param district <object> 区县
	 */
	selectDistrict(district) {
		this.selectedDistrict = district;
	}

	/**
	 * @name changeProvinceArea 在常用区域选择对应省份
	 * @param commonArea <object> 选中的常用区域
	 */
	changeProvinceArea(commonArea) {
		this.provinces = [];
		commonArea.map(area => {
			const province = this.areas.find(item => item.id === area);
			this.provinces.push(province);
		});
	}

	/**
	 * @name selectedCommonArea 选择常用区域
	 * @param commonArea <object> 被选择的常用区域
	 */
	selectedCommonArea(commonArea) {
		if (commonArea.selectedAll) {
			this.setSelectedAndSelectedAll(commonArea, false, false);
		} else {
			this.setSelectedAndSelectedAll(commonArea, true, true);
		}
		commonArea.children.map(area => {
			let selectCommonArea = {};
			if (area.parentId) {
				const selectedProvince = this.areas.find(item => item.id === area.parentId);
				selectCommonArea = selectedProvince.children.find(item => item.id === area.id);
			} else {
				selectCommonArea = this.areas.find(item => item.id === area.id);
			}
			this.changeChildrenAreaStatus(selectCommonArea, commonArea.selected);
		});
		this.selectedAreas = [];
		this.getSelectedAreasByAreaMap(this.areas, []);
		this.getCommonAreaSelectedStatus();
	}

	/**
	 * @name getSelectedValue 将已选择的数据解析为ID-String传入格式
	 * @param area <object> 被选择的区域
	 * @param index <number> 下标
	 */
	getSelectedValue(area, index) {
		if (index < area.length - 1) {
			this.selectedAreaString += area[index].id + ',';
			this.getSelectedValue(area, index + 1);
		} else if (index === area.length - 1) {
			this.selectedAreaString += area[index].id;
			this.getSelectedValue(area, index + 1);
		}
	}

	/**
	 * @name ok 点击确认按钮
	 */
	ok() {
		let selectedValue = [];
		this.selectedAreas.map(area => {
			this.selectedAreaString = '';
			this.getSelectedValue(area, 0);
			selectedValue.push(this.selectedAreaString);
		});
		this._modalInstance.ok(selectedValue);
	}
}
