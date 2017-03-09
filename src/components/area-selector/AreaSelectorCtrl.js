/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

import angular from 'angular';
import { Inject } from 'angular-es-utils/decorators';
import { COMMON_AREAS } from './Constant';


@Inject('$ccTips', '$element', 'modalInstance', 'selectedData', 'valueTemplate')
export default class AreaSelectorCtrl {

	static ID_ONLY = true;

	$onInit() {

		// 外部调用参数初始化
		this.selectedValue = this._selectedData;
		this.valueTemplate = this._valueTemplate;

		// 辅助变量初始化以及初始化参数
		this.selectedAreas = [];
		this.errorMessages = [];
		this.searchList = [];
		this.selectedLevelArray = [];
		this.datalist = [];
		this.provinceNumber = 0;
		this.areaNumber = 0;
		this.districtNumber = 0;
		this.areas = this.getAreasFromLocalStorage();
		this.provinces = this.areas;
		this.analyzeSelectedData();
		this.getSelectedAreaNumber();
		this.initCommonAreas();
		this.validateAreasData();
		this.initInstantSearch();
	}

	/**
	 * @name validateAreasData 展示错误信息
	 */
	validateAreasData() {
		if (this.errorMessages.length) {
			setTimeout(() => {
				this._modalInstance._renderDeferred.promise.then(() => {
					this.errorMessages.forEach(errorMessage => {
						this._$ccTips.error(errorMessage, this._$element[0].querySelector('.modal-body'));
					});
				});
			}, 0);
		}
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

	/**
	 * @name getCommonAreasTree 得到选中区域Tree
	 * @param areaIdArray <array> 被逗号分隔后的数组
	 * @param areaTrees <object> 存放选中区域的Tree
	 */
	getCommonAreasTree(areaIdArray, areaTrees) {
		const area = this.areas.find(item => item.id === areaIdArray[0]);
		if (area) {
			if (areaIdArray.length === 1) {
				areaTrees.push({id: area.id, name: area.name, selected: area.selected, selectedAll: area.selectedAll});
			} else {
				const subArea = area.children.find(item => item.id === areaIdArray[1]);
				areaTrees.push({id: subArea.id, name: subArea.name, selected: subArea.selected, selectedAll: subArea.selectedAll, parentId: area.id});
			}
		}
	}

	/**
	 * @name analyzeSelectedData 解析传入的已选择数据
	 */
	analyzeSelectedData() {
		this.selectedValue.map(element => {
			this.selectedAreaArray = [];
			const selectedAreas = element.id.split(',');
			this.analyzeArea(selectedAreas, 0, this.areas, element.name);
		});
	}

	/**
	 * @name analyzeArea 解析选中区域
	 * @param selectedAreas <object> 选中区域
	 * @param index <number> 下标
	 * @param areas <object> 区域
	 * @param areaName <string> 选中区域的名称
	 */
	analyzeArea(selectedAreas, index, areas, areaName) {
		const hasChild = (index < selectedAreas.length - 1);
		const subArea = this.setAreaStatus(selectedAreas[index], areas, hasChild, areaName);
		if (!hasChild) {
			this.selectedAreas.push(this.selectedAreaArray);
			this.setSelectedValue(subArea, true);
			this.setSelectedAllValue(subArea, true);
		} else {
			this.analyzeArea(selectedAreas, index + 1, subArea, areaName);
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
	 * @param areaName <string> 区域名称
	 */
	setAreaStatus(areaId, areas, hasChild, areaName) {
		let selectedArea = areas.find(item => item.id === areaId);
		if (!selectedArea) {
			this.errorMessages.push('因行政区域变动，您原有的设置 [' + areaName + '] 已被删除');
		} else {
			this.setSelectedAndSelectedAll(selectedArea, true, !hasChild);
			this.selectedAreaArray.push({ name: selectedArea.name, id: selectedArea.id });
			return selectedArea.children;
		}
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
		this.getSelectedAreaNumber();
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
		this.getSelectedAreaNumber();
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
	 * @name selectedCommonArea 选择常用区域
	 * @param commonArea <object> 被选择的常用区域
	 */
	selectedCommonArea(commonArea) {
		if (commonArea.selectedAll) {
			this.setSelectedAndSelectedAll(commonArea, false, false);
		} else {
			this.setSelectedAndSelectedAll(commonArea, true, true);
		}
		this.setCommonAreaStatus(commonArea);
		this.getParentSelectedStatus(commonArea);
		this.selectedAreas = [];
		this.getSelectedAreasByAreaMap(this.areas, []);
		this.getCommonAreaSelectedStatus();
		this.getSelectedAreaNumber();
	}

	/**
	 * @name setCommonAreaStatus 设置被选择常用区域的状态
	 * @param commonArea <object> 被选择的常用区域
	 */
	setCommonAreaStatus(commonArea) {
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
	}

	/**
	 * @name getParentSelectedStatus 获得父亲节点的选择状态
	 * @param commonArea <object> 常选区域
	 */
	getParentSelectedStatus(commonArea) {
		if (commonArea.children[0].parentId) {
			const selectedProvince = this.areas.find(item => item.id === commonArea.children[0].parentId);
			this.analyzeAreaSelectedStatusByChildren(selectedProvince);
		}
	}

	/**
	 * @name getSelectedIdAndName 将已选择的数据解析为ID-String传入格式
	 * @param area <object> 被选择的区域
	 * @param index <number> 下标
	 */
	getSelectedIdAndName(area, index) {
		if (index < area.length - 1) {
			this.selectedAreaIds += area[index].id + ',';
			this.selectedAreaNames += area[index].name + ' > ';
			this.getSelectedIdAndName(area, index + 1);
		} else if (index === area.length - 1) {
			this.selectedAreaIds += area[index].id;
			this.selectedAreaNames += area[index].name;
			this.getSelectedIdAndName(area, index + 1);
		}
	}

	/**
	 * @name getSelectedId 将已选择的数据解析为ID-String传入格式
	 * @param area <object> 被选择的区域
	 * @param index <number> 下标
	 */
	getSelectedId(area, index) {
		if (index < area.length - 1) {
			this.selectedAreaString += area[index].id + ',';
			this.getSelectedId(area, index + 1);
		} else if (index === area.length - 1) {
			this.selectedAreaString += area[index].id;
			this.getSelectedId(area, index + 1);
		}
	}

	/**
	 * @name ok 点击确认按钮
	 */
	ok() {
		let selectedValue = [];
		this.selectedAreas.map(area => {
			if (this.valueTemplate) {
				this.getResponseIdAndName(selectedValue, area);
			} else {
				this.getResponseId(selectedValue, area);
			}
		});
		this._modalInstance.ok(selectedValue);
	}

	/**
	 * @name getResponseIdAndName 得到需要返回的Id和Name的数组
	 * @param selectedValue <array> 被选中的值
	 * @param area <array> 遍历出的被选中的地区信息
	 */
	getResponseIdAndName(selectedValue, area) {
		this.selectedAreaIds = '';
		this.selectedAreaNames = '';
		this.getSelectedIdAndName(area, 0);
		selectedValue.push({id: this.selectedAreaIds, name: this.selectedAreaNames});
	}

	/**
	 * @name getResponseId 得到需要返回的Id的数组
	 * @param selectedValue <array> 被选中的值
	 *  @param area <array> 遍历出的被选中的地区信息
	 */
	getResponseId(selectedValue, area) {
		this.selectedAreaString = '';
		this.getSelectedId(area, 0);
		selectedValue.push(this.selectedAreaString);
	}

	/**
	 * @name getSelectedAreaNumber 获得选择的区域的数量
	 */
	getSelectedAreaNumber() {
		this.provinceNumber = 0;
		this.areaNumber = 0;
		this.districtNumber = 0;
		this.countAreaNumber(this.areas, 1);
	}

	/**
	 * @name countAreaNumber 统计区域数量(递归)
	 * @param area <object> 被统计的区域
	 * @param areaLevel <number> 区域等级 1:省份 2:城市 3:区县
	 */
	countAreaNumber(area, areaLevel) {
		area.forEach(value => {
			if (value.selected) {
				this.increaseAreaNumber(areaLevel);
				if (value.children) {
					this.countAreaNumber(value.children, areaLevel + 1);
				}
			}
		});
	}

	/**
	 * @name increaseAreaNumber
	 * @param areaLevel <number> 区域等级 1:省份 2:城市 3:区县
	 */
	increaseAreaNumber(areaLevel) {
		switch (areaLevel) {
			case 1:
				this.provinceNumber ++;
				break;
			case 2:
				this.areaNumber ++;
				break;
			case 3:
				this.districtNumber ++;
		}
	}

	/**
	 * @name searchAreaByKeyword 通过关键字获得匹配的地址信息
	 */
	searchAreaByKeyword(keyword) {
		let currentArea = [];
		let matchedMap = [];
		this.getMatchedAreaByKeyword(this.areas, currentArea, matchedMap, keyword);
		this.searchList = this.getMatchedAreaList(matchedMap);
	}

	/**
	 * @name getMatchedAreaByKeyword 获得
	 * @param areas <object> 搜索的区域
	 * @param currentArea <array> 目前选中的省市区
	 * @param matchedMap <array> 匹配到的Map
	 * @param keyWord <string> 用户输入的关键字
	 */
	getMatchedAreaByKeyword(areas, currentArea, matchedMap, keyWord) {
		for (let area of areas) {
			currentArea.push({name: area.name, id: area.id});
			if (area.name.includes(keyWord)) {
				const matchedArea = angular.copy(currentArea);
				if (matchedMap.length < 10) {
					matchedMap.push(matchedArea);
				} else {
					break;
				}
			}
			if (area.children) {
				this.getMatchedAreaByKeyword(area.children, currentArea, matchedMap, keyWord);
			}
			currentArea.pop();
		}
	}

	/**
	 * @name getMatchedAreaList 获得匹配到的地区列表
	 * @param matchedMap <array> 匹配到的Map
	 */
	getMatchedAreaList(matchedMap) {
		const areaList = [];
		matchedMap.forEach(areas => {
			let areaInfo = {value: '', title: ''};
			areas.forEach(area => {
				areaInfo.value += area.id + ',';
				areaInfo.title += area.name + ' > ';
			});
			areaInfo.value = areaInfo.value.substring(0, areaInfo.value.length - 1);
			areaInfo.title = areaInfo.title.substring(0, areaInfo.title.length - 3);
			areaList.push(areaInfo);
		});
		return areaList;
	}

	/**
	 * @name initInstantSearch 初始化搜索框
	 */
	initInstantSearch() {
		this.options = {
			placeholderText: '请输入区域名称',

			valueField: 'value',
			displayField: 'title',

			// 本地过滤顺序
			localFilterFields: ['value', 'title']
		};
	}

	/**
	 * @name onSelect 在搜索框中选中区域
	 * @param selectedData <object> 在搜索框选中的区域信息
	 */
	onSelect(selectedData) {
		if (selectedData) {
			this.selectedLevelArray = [];
			const selectedIdArray = selectedData.value.split(',');
			this.findAreaByIds(selectedIdArray, 0, this.areas);
			this.changeChildrenAreaStatus(this.selectedArea, true);
			if (selectedIdArray.length === 3) {
				this.changeParentAreaStatus('district', this.selectedLevelArray[0], this.selectedLevelArray[1]);
			} else if (selectedIdArray.length === 2) {
				this.changeParentAreaStatus('', this.selectedLevelArray[0]);
			}
			this.selectedAreas = [];
			this.getSelectedAreasByAreaMap(this.areas, []);
			this.getCommonAreaSelectedStatus();
			this.getSelectedAreaNumber();
		}
	}

	/**
	 * @name findAreaByIds 通过ID的字符串获得地区
	 * @param selectedIdArray <array> 在搜索框选中的区域
	 * @param index <number> selectedIdArray下标
	 * @param areas <object> 待筛选的地区
	 */
	findAreaByIds(selectedIdArray, index, areas) {
		if (index <= selectedIdArray.length) {
			const area = areas.find(item => item.id === selectedIdArray[index]);
			this.selectedLevelArray.push(area);
			if (index === selectedIdArray.length - 1) {
				this.selectedArea = area;
			} else {
				this.findAreaByIds(selectedIdArray, index + 1, area.children);
			}
		}
	}

	/**
	 * @name onSearch 监听用户输入变化
	 * @param datalist <array> 在搜索框选中的区域
	 * @param context <object> 用户输入的值
	 */
	onSearch(datalist, context) {
		this.searchAreaByKeyword(context.searchText);
		this.datalist = this.searchList;
	}
}
