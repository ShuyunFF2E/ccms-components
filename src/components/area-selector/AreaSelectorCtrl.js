/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

import angular from 'angular';
import { Inject } from 'angular-es-utils/decorators';
import { INPUT, AREAS, COMMON_AREAS } from './Constant';

@Inject('$ccTips')
export default class AreaSelectorCtrl {
	constructor() {
		this.init();
	}

	init() {
		this.areas = AREAS;
		this.inputValue = INPUT;
		this.selectedAreas = [];
		this.commonAreas = COMMON_AREAS;
		this.analyzeSelectedData();
	}

	/**
	 * @name analyzeSelectedData 解析传入的已选择数据
	 */
	analyzeSelectedData() {
		this.inputValue.map(element => {
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
		selectedArea.selected = selectedArea.children.some(this.isSelected);
		selectedArea.selectedAll = selectedArea.children.every(this.isSelectedAll);
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
			this.setAreaAndChildrenSelectedStatus(selectedArea, false);
			const areaStatus = area.length === 3 ? 'district' : '';
			this.changeParentAreaStatus(areaStatus, deleteAreaArray[0], deleteAreaArray[1]);
		} else {
			this.deleteAreaById(area, areaIndex + 1, selectedArea.children, deleteAreaArray);
		}
	}

	/**
	 * @name setAreaAndChildrenSelectedStatus 设置一个区域以及它孩子区域的selected状态
	 * @param selectedArea <object> 需要被设置的区域
	 * @param value <boolean> selected值
	 */
	setAreaAndChildrenSelectedStatus(selectedArea, value) {
		this.setSelectedAndSelectedAll(selectedArea, value, value);
		this.setSelectedValue(selectedArea.children, value);
		this.setSelectedAllValue(selectedArea.children, value);
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
}
