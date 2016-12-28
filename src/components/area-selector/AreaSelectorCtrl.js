/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

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
		this.commonAreas = COMMON_AREAS;
		this.analyzeSelectedData();
	}

	/**
	 * @name analyzeSelectedData 解析传入的已选择数据
	 */
	analyzeSelectedData() {
		this.inputValue.map(element => {
			const selectedAreas = element.split(',');
			this.analyzeArea(selectedAreas[0], selectedAreas, 0, this.areas);
		});
	}

	/**
	 * @name analyzeArea 解析选中区域
	 * @param areaId <string> 区域ID
	 * @param selectedAreas <object> 选中区域
	 * @param index <number> 下标
	 * @param areas <object> 区域
	 */
	analyzeArea(areaId, selectedAreas, index, areas) {
		const hasChild = (index < selectedAreas.length - 1);
		const subArea = this.setAreaStatus(areaId, areas, hasChild);
		if (!hasChild) {
			this.setSelectedValue(subArea, true);
			return 0;
		} else {
			this.analyzeArea(selectedAreas[index + 1], selectedAreas, index + 1, subArea);
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
		selectedArea.selected = true;
		selectedArea.selectedAll = !hasChild;
		return selectedArea.children;
	}

	/**
	 * @name changeCheckboxStatus 改变checkbox状态
	 * @param area <object> 区域
	 * @param areaLevel <boolean> 区域等级
	 */
	changeCheckboxStatus(area, areaLevel) {
		this.changeChildrenStatus(area);
		this.changeParentAreaStatus(areaLevel);
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
		area.selected = value;
		area.selectedAll = value;
		this.setSelectedValue(area.children, value);
		this.setSelectedAllValue(area.children, value);
	}

	/**
	 * @name changeParentAreaStatus 改变父亲区域状态
	 * @param areaLevel <string> 区域等级
	 */
	changeParentAreaStatus(areaLevel) {
		if (areaLevel === 'district') {
			this.selectedCity.selected = this.selectedCity.children.some(this.isSelected);
			this.selectedCity.selectedAll = this.selectedCity.children.every(this.isSelectedAll);
		}
		this.selectedProvince.selected = this.selectedProvince.children.some(this.isSelected);
		this.selectedProvince.selectedAll = this.selectedProvince.children.every(this.isSelectedAll);
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
}
