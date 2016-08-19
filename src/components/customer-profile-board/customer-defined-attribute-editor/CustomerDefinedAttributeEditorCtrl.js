/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-17 09:59
 */

import { Inject } from 'angular-es-utils';

import {DEFAULT_ATTRIBUTE_SETTING, DefinedTypeOptionList} from '../CustomerAttributeSetting.js';

@Inject('$Validator')
export default class CustomerDefinedAttributeEditorCtrl {
	constructor() {
		this.DefinedTypeOptionList = DefinedTypeOptionList;

		this.validators = {
			attributeName: {
				msg: '属性名称必须为1-20个字符',
				regex: /^(\d|\w|[\u4e00-\u9fa5]){1,20}$/
			}
		};
		this.showAttributeDataEditor = false;
		this.showRemarkTextAreaState = false;
		this.customerDefinedAttribute = Object.assign({}, DEFAULT_ATTRIBUTE_SETTING);
	}

	toggleRemarkTextArea() {
		this.showRemarkTextAreaState = !this.showRemarkTextAreaState;
		this.showRemarkTextAreaState && (this.tmpRemark = this.customerDefinedAttribute.remark);
	}

	confirmRemark() {
		this.customerDefinedAttribute.remark = this.tmpRemark;
		this.toggleRemarkTextArea();
	}

	confirmCustomerDefinedAttribute() {
		this._$Validator.validate(this.attribute).then(() => {
			this.createAttributeFn({attribute: this.customerDefinedAttribute});
		});
	}
}
