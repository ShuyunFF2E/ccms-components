/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-18 09:48
 */

import { Inject } from 'angular-es-utils';

import CustomerProfileBoardService from '../../CustomerProfileBoardService.js';

@Inject('$Validator')
export default class AttributeDateEditorCtrl {
	constructor() {
		this.CustomerProfileBoardService = new CustomerProfileBoardService();
		this.attributeNameList = this.CustomerProfileBoardService.getAttributeList();
	}

	$onInit() {
		this.addAttributeState = false;
		this.validators = {
			number: {
				msg: '请输入数字',
				regex: /^\d+(\.\d*)?$/
			},
			length: {
				msg: '可选值长度为1-20',
				regex: /^.{1,20}$/
			},
			duplicate: {
				msg: '可选值不能重复',
				fn: (modelValue, viewValue) => {
					const value = modelValue || viewValue || '';
					return this.attributeDataList.indexOf(value.trim()) === -1 && this.attributeNameList.indexOf(value.trim()) === -1;
				}
			}
		};
	}

	$onChanges(obj) {
		if (obj.numberOnly) {
			this.addAttributeState = false;
			this.validator = 'length,duplicate' + (obj.numberOnly.currentValue ? ',number' : '');
		}
	}

	showAddAttributeInput() {
		this.addAttributeState = true;
		this.attributeValue = '';
	}

	addAttribute() {
		this._$Validator.validate(this.data).then(() => {
			this.attributeDataList.push(this.attributeValue);
			this.addAttributeState = false;
		});
	}

	removeAttribute(index) {
		this.attributeDataList.splice(index, 1);
	}
}
