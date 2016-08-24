/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-18 09:48
 */

import { Inject } from 'angular-es-utils';

@Inject('$Validator')
export default class AttributeDateEditorCtrl {
	$onInit() {
		this.addAttributeState = false;
		this.validators = {
			required: {
				msg: '可选值不能为空',
				fn: (modelValue, viewValue) => {
					const value = modelValue || viewValue || '';
					return !!(value.trim());
				}
			},
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
					return this.attributeOptionalList.indexOf(value.trim()) === -1;
				}
			}
		};

		this.setChild({ child: this });
	}

	$onChanges(obj) {
		if (obj.numberOnly) {
			this.addAttributeState = false;
			this.validator = 'required,length,duplicate' + (obj.numberOnly.currentValue ? ',number' : '');
		}
	}

	/**
	 * @name showAddAttributeInput
	 */
	showAddAttributeInput() {
		this.addAttributeState = true;
		this.attributeValue = '';
	}

	/**
	 * @name addAttribute
	 */
	addAttribute() {
		this._$Validator.validate(this.data).then(() => {
			this.attributeOptionalList.push(this.attributeValue);
			this.addAttributeState = false;
		});
	}

	/**
	 * @name removeAttribute
	 * @param {number} index
	 */
	removeAttribute(index) {
		this.attributeOptionalList.splice(index, 1);
	}
}
