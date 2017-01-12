import angular from 'angular';
import {Inject, Bind} from 'angular-es-utils';

@Inject('$scope', '$element')
export default class DropdownProvinceSelectCtrl {

	static provinceData = [
		{
			'name': '华北东北',
			'value': ['北京', '天津', '河北省', '山西省', '黑龙江省', '吉林省', '辽宁省', '内蒙古自治区']
		},
		{
			'name': '华东地区',
			'value': ['上海', '浙江省', '江苏省', '山东省', '安徽省', '福建省']
		},
		{
			'name': '中部西部',
			'value': ['河南省', '湖北省', '湖南省', '江西省', '重庆', '四川省', '云南省', '贵州省',
				'西藏自治区', '宁夏回族自治区', '新疆维吾尔自治区', '青海省', '陕西省', '甘肃省']
		},
		{
			'name': '华南地区',
			'value': ['广东省', '广西壮族自治区', '海南省']
		},
		{
			'name': '其他地区',
			'value': ['台湾省', '香港特别行政区', '澳门特别行政区', '海外']
		}
	];

	constructor() {
		this.title = '';
		this.model = [];
		this.selection = [];
		this.placeholder = '';
		this.autoClose = false;
		this.isOpen = false;
		this.isActive = false;
		this.data = DropdownProvinceSelectCtrl.provinceData;
	}

	$onInit() {
		this._prepareOptions();
		this._prepareWatches();
	}

	$postLink() {
		this._prepareMouseEvents();
		this._prepareKeyboardEvents();
	}

	_prepareOptions() {
		if (!angular.isArray(this.model)) throw new Error('cc-dropdown-province-select: model参数类型为数组');
		this.setSelection(this.model);
	}

	_prepareWatches() {
		let scope = this.getScope();

		scope.$watchCollection(() => this.model, (model, oldModel) => {
			if (!angular.equals(model, oldModel)) {
				this.setSelection(model);
				this.updateTitle();
			}
		});

		scope.$watchCollection(() => this.selection, () => {
			this.updateTitle();
		});
	}

	_prepareMouseEvents() {
		let inputWrapElement = this.getInputWrapElement();
		inputWrapElement.addEventListener('click', this.toggle);
	}

	// TODO support keyboard
	_prepareKeyboardEvents() {
	}

	setTitle(title) {
		this.title = title;
	}

	updateTitle() {
		this.setTitle(this.selection.join(','));
	}

	toggleSelection(item) {
		this._toggleArray(item, this.selection);
	}

	toggleAreaSelection(name) {
		let index = this.data.findIndex(function(area) {
			return area.name === name;
		});

		let intersection1 = this._intersection(this.data[index].value, this.selection);
		let intersection2 = this._intersection(this.selection, this.data[index].value);

		this.selection = this._union(intersection1, intersection2);
	}

	_intersection(arrA, arrB) {
		return arrA.filter(item => {
			return arrB.indexOf(item) === -1;
		});
	}

	_unique(array) {
		let n = [];
		array.forEach(item => {
			if (n.indexOf(item) === -1) n.push(item);
		});
		return n;
	}

	_union(arrA, arrB) {
		return this._unique(arrA.concat(arrB));
	}

	_toggleArray(item, array) {
		let index = array.indexOf(item);
		if (index > -1) {
			array.splice(index, 1);
		} else {
			array.push(item);
		}
		return index;
	}

	isSelected(item) {
		let index = this.selection.indexOf(item);
		return index !== -1;
	}

	confirmSelection() {
		this.setValue(this.selection);
		this.close();
	}

	cancelSelection() {
		this.setSelection(this.model);
		this.close();
	}

	setValue(modelValue) {
		this.model = this._unique(modelValue);
	}

	setSelection(selectValue) {
		this.selection = this._unique(selectValue);
	}

	setActiveState(isActive) {
		this.isActive = isActive;
	}

	@Bind
	toggle() {
		let scope = this.getScope();
		if (this.isOpen) {
			this.close();
		} else {
			this.open();
		}
		scope.$root.$$phase || scope.$apply();
	}

	open() {
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}

	getElement() {
		return this._$element[0];
	}

	getInputWrapElement() {
		return this.getElement().querySelector('.dropdown-select-input-wrap');
	}

	getScope() {
		return this._$scope;
	}
};

