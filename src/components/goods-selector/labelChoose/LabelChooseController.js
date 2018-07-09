import angular from 'angular';
import { Inject } from 'angular-es-utils/decorators';

@Inject('modalInstance', 'labelList', 'mapping', 'placeholderText', 'selectedLabels', '$scope', '$sce')
export default class LabelChooseController {
	static defaultMapping = {
		displayField: 'title',
		valueField: 'id'
	};

	constructor() {
		this.getScope();
		this.prepareOptions();
	}

	prepareOptions() {
		this.labelName = null;
		this.defaultMapping = LabelChooseController.defaultMapping;
		this.labelList = this._labelList;
		this.mapping = Object.assign({}, this.defaultMapping, this._mapping);
		this.placeholderText = this._placeholderText;
		this.selectedLabels = this._selectedLabels;

		if (this.selectedLabels && this.selectedLabels.length) {
			this.selectedLabels.forEach(item => {
				let targetIndex = this.findEntity(this.labelList, item);
				if (targetIndex !== -1) {
					this.labelList[targetIndex].isSelected = true;
				}
			});
		}
	}

	getScope() {
		this.scope = this._$scope;
	}

	// 点击确定按钮
	ok() {
		this.selectedItems = this.labelList.filter(item => {
			return item.isSelected;
		});
		this._modalInstance.ok(this.selectedItems);
	}

	// 从集合中获取 entity 的 index, 找不到返回 -1
	findEntity(collection, entity) {
		return collection.findIndex(item => angular.equals(item[this.mapping.valueField], entity[this.mapping.valueField]));
	}

	// 高亮显示搜索关键字
	lightText(originText, keyWords) {
		originText = originText || '';
		let reg = new RegExp(keyWords, 'g');
		let result = '';
		if (keyWords && keyWords.length !== 0 && originText.indexOf(keyWords) > -1) {
			result = originText.toString().replace(reg, `<span class="highlight">${keyWords}</span>`);
		} else {
			result = originText.toString();
		}
		return this._$sce.trustAsHtml(result);
	}
}
