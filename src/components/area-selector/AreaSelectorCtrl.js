/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

import { Inject } from 'angular-es-utils/decorators';
import { CITYS, PROVINCES, DISTRICTS, COMMON_AREAS, INPUT } from './Constant';

@Inject('$ccTips')
export default class AreaSelectorCtrl {
	constructor() {
		this.initArea();
	}

	initArea() {
		this.initProvinces();
		this.commonAreas = COMMON_AREAS;
		this.analyzeProvince();
		this.analyzeCity();
		this.analyzeDistrict();
		this.selectedArea = this.getSelectedArea();
		console.log(this.selectedArea);
	}

	/**
	 * @name getSelectedArea 得到已选区域的对象
	 */
	getSelectedArea() {
		return {province: PROVINCES.find(this.isSelected).name, city: this.citys.find(this.isSelected).name, district: this.districts.find(this.isSelected).name};
	}

	/**
	 * @name isSelected 判断是否选择
	 * @param element <object>
	 */
	isSelected(element) {
		return element.selected;
	}

	/**
	 * @name analyzeProvince 解析省份,初始化城市
	 */
	analyzeProvince() {
		const selectedProvinceId = this.setSelected(PROVINCES, INPUT.province);
		this.getCitysByProviceId(selectedProvinceId);
	}

	/**
	 * @name analyzeCity 解析城市,初始化区县
	 */
	analyzeCity() {
		const selectedCityId = this.setSelected(this.citys, INPUT.city);
		this.getDistrictsByCityId(selectedCityId);
	}

	/**
	 * @name analyzeDistrict 解析区县
	 */
	analyzeDistrict() {
		this.setSelected(this.districts, INPUT.district);
	}

	/**
	 * @name setSelected 设置selector属性
	 * @param area <array> 需要遍历的地区
	 * @param value <string> 已被选中的区域
	 */
	setSelected(area, value) {
		let selectedProvinceId = '';
		area.map(function(element) {
			if (element.name === value) {
				element.selected = true;
				selectedProvinceId = element.id;
			} else {
				element.selected = false;
			}
		});
		return selectedProvinceId;
	}

	/**
	 * 以下为后台交互,类resource方法
	 */
	initProvinces() {
		this.provinces = PROVINCES;
	}

	getCitysByProviceId(provinceId) {
		this.citys = CITYS.find(item => item.id === provinceId).citys;
	}

	getDistrictsByCityId(cityId) {
		this.districts = DISTRICTS.find(item => item.id === cityId).districts;
	}

}
