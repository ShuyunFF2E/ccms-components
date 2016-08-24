/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-17 09:59
 */

import angular from 'angular';
import { Inject } from 'angular-es-utils';

import {DEFAULT_ATTRIBUTE_SETTING, DefinedTypeOptionList} from '../CustomerAttributeSetting.js';

@Inject('$Validator', '$timeout')
export default class CustomerDefinedAttributeEditorCtrl {
	constructor() {
		this.DefinedTypeOptionList = DefinedTypeOptionList;

		this.validators = {
			attributeName: {
				msg: '属性名称必须为1-20个字符',
				regex: /^(\d|\w|[\u4e00-\u9fa5]){1,20}$/
			},
			duplicate: {
				msg: '属性名不能重复',
				fn: this.validateDuplicateNameFn()
			}
		};
		this.showRemarkTextAreaState = false;
		this.customerDefinedAttribute = angular.copy(DEFAULT_ATTRIBUTE_SETTING); // Object.assign not work for array value
	}

	/**
	 * use to get child ctrl method
	 * @name getChildCtrl
	 * @param child
	 */
	getChildCtrl(child) {
		this.childCtrl = child;
	}

	/**
	 * @name toggleRemarkTextArea
	 */
	toggleRemarkTextArea() {
		this.showRemarkTextAreaState = !this.showRemarkTextAreaState;
		this.showRemarkTextAreaState && (this.tmpRemark = this.customerDefinedAttribute.remark);
	}

	/**
	 * confirm remark
	 * @name confirmRemark
	 */
	confirmRemark() {
		this.customerDefinedAttribute.remark = this.tmpRemark;
		this.toggleRemarkTextArea();
	}

	/**
	 * validate form & call parent saveCustomerDefinedAttribute method
	 * @name confirmCustomerDefinedAttribute
	 */
	confirmCustomerDefinedAttribute() {
		this._$Validator.validate(this.attributeForm).then(() => {
			if ((this.customerDefinedAttribute.type === this.DefinedTypeOptionList[0].value || this.customerDefinedAttribute.type === this.DefinedTypeOptionList[1].value) && !this.customerDefinedAttribute.optional.length) {
				this.childCtrl.showAddAttributeInput.apply(this.childCtrl);
				this._$timeout(() => this.childCtrl.addAttribute.apply(this.childCtrl), 0);
			} else {
				if (this.customerDefinedAttribute.type === this.DefinedTypeOptionList[1].value || this.customerDefinedAttribute.type === this.DefinedTypeOptionList[4].value) {
					this.customerDefinedAttribute.value = Number.parseFloat(this.customerDefinedAttribute.value);
				}
				this.createAttributeFn({attribute: this.customerDefinedAttribute});
			}
		});
	}
}
