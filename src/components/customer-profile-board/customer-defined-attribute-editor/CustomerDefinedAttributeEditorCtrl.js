/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-17 09:59
 */

import { Inject } from 'angular-es-utils';

import {DefinedTypeOptionList} from './CustomerDefinedAttributeSetting.js';

@Inject('$Validator')
export default class CustomerDefinedAttributeEditorCtrl {
	constructor() {
		this.DefinedTypeOptionList = DefinedTypeOptionList;

		this.validators = {
			attributeName: {
				msg: '属性名称必须为1-20个字符',
				regex: /^(\d|\w){1,20}$/
			}
		};
		this.showAttributeDataEditor = false;
		this.showRemarkTextAreaState = false;
		this.customerDefinedAttribute = {
			name: '',
			remark: '',
			isDisable: false,
			type: this.DefinedTypeOptionList[0].value,
			selector: []
		};
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
			console.log('success', this.customerDefinedAttribute);
		});
	}
}
