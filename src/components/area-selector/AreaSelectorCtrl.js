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
	 * @param areaId <string> 区域ID
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
	 * @name changeCheckboxStatus 改变checkbox状态
	 * @param area <object> 区域
	 * @param areaLevel <boolean> 区域等级
	 */
	changeCheckboxStatus(area, areaLevel) {
		this.changeChildrenStatus(area);
		this.changeParentAreaStatus(areaLevel, this.selectedProvince, this.selectedCity);
		this.selectedAreas = [];
		this.getSelectedAreas(this.areas, []);
	}

	getSelectedAreas(areas, selectedArray) {
		areas.map(item => {
			if (item.selectedAll) {
				selectedArray.push({id: item.id, name: item.name});
				const pushedArea = angular.copy(selectedArray);
				this.selectedAreas.push(pushedArea);
				selectedArray.pop();
			} else if (item.selected && item.children) {
				selectedArray.push({id: item.id, name: item.name});
				this.getSelectedAreas(item.children, selectedArray);
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
	 */
	changeParentAreaStatus(areaLevel, selectedProvince, selectedCity) {
		if (areaLevel === 'district') {
			this.matchCitySelectedStatus(selectedCity);
		}
		this.matchProvinceSelectedStatus(selectedProvince);
	}

	matchCitySelectedStatus(selectedCity) {
		selectedCity.selected = selectedCity.children.some(this.isSelected);
		selectedCity.selectedAll = selectedCity.children.every(this.isSelectedAll);
	}

	matchProvinceSelectedStatus(selectedProvince) {
		selectedProvince.selected = selectedProvince.children.some(this.isSelected);
		selectedProvince.selectedAll = selectedProvince.children.every(this.isSelectedAll);
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
	 * @name deleteArea 删除已选区域
	 * @param area <object> 被删除的区域
	 */
	deleteArea(area, index) {
		let deleteAreaArray = [];
		this.selectedAreas.splice(index, 1);
		this.getAreaById(area, 0, this.areas, deleteAreaArray);
	}

	getAreaById(area, areaIndex, areas, deleteAreaArray) {
		const selectedArea = areas.find(item => item.id === area[areaIndex].id);
		deleteAreaArray.push(selectedArea);
		if (areaIndex === area.length - 1) {
			this.setSelectedAndSelectedAll(selectedArea, false, false);
			this.setSelectedValue(selectedArea.children, false);
			this.setSelectedAllValue(selectedArea.children, false);
			const areaStatus = area.length === 3 ? 'district' : '';
			this.changeParentAreaStatus(areaStatus, deleteAreaArray[0], deleteAreaArray[1]);
		} else {
			this.getAreaById(area, areaIndex + 1, selectedArea.children, deleteAreaArray);
		}
	}

	setSelectedAndSelectedAll(area, selectedValue, selectedAllValue) {
		area.selected = selectedValue;
		area.selectedAll = selectedAllValue;
	}

	selectDistrict(district) {
		this.selectedDistrict = district;
	}
}
