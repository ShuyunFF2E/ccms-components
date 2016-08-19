/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 15:11
 */

import { Inject } from 'angular-es-utils';

import CustomerProfileBoardService from '../../CustomerProfileBoardService.js';

@Inject('$scope', '$Validator')
export default class CustomerAttributeEditorCtrl {
	constructor() {
		this.CustomerProfileBoardService = new CustomerProfileBoardService();

		this.rfmSelectorFieldsMap = {
			valueField: 'period',
			displayField: 'period_label'
		};

		this.showCustomerAttributeEditor = false;
		this.validators = {
			number: {
				msg: '请输入数字',
				regex: /^\d+(\.\d*)?$/
			},
			length: {
				msg: '可选值长度为1-20',
				regex: /^.{1,20}$/
			}
		};
	}

	/**
	 * @name $postLink
	 * set default rfm item & add watch on current selected rfm item
	 */
	$postLink() {
		this.attributeSetting.attributeBlock.forEach(block => {
			if (block.type === 'List' && block.listData && block.listData.length) {
				this.selectedRfm = block.listData[0];
				this.selectedRfmPeriod = this.selectedRfm.period;

				this._$scope.$watch('$ctrl.selectedRfmPeriod', period => (this.selectedRfm = block.listData.filter(rfm => rfm.period === period)[0]));
			}
		});
	}

	closeAllAttributeModifyBlock() {
		this.attributeSetting.attributeBlock.forEach(block => block.attributeList.forEach(attribute => (attribute.editingValue = false)));
	}

	showAttributeModifyBlock(attribute, value = '') {
		this.tmpValue = value;
		this.closeAllAttributeModifyBlock();
		attribute.editingValue = true;
	}

	modifyAttributeValue(attribute, value) {
		this._$Validator.validate(this.attributeModify)
			.then(() => {
				const params = {
					customerno: this.customerData.nickName,
					platform: this.customerData.platName,
					tenantId: this.customerData.tenantId,
					properties: [{
						id: attribute.id,
						value: value
					}]
				};
				return this.CustomerProfileBoardService.updateCustomerDefinedAttributeData(params);
			})
			.then(() => {
				attribute.displayValue = value;
				this.closeAllAttributeModifyBlock();
			});
	}

	changeCustomerDefinedBlockState(state) {
		this.showCustomerAttributeEditor = state;
		this.closeAllAttributeModifyBlock();
		this.updateAttributeBlockOffset();
	}

	saveCustomerDefinedAttribute(attribute) {
		const params = {
			tenantId: this.customerData.tenantId,
			name: attribute.name,
			type: attribute.type,
			isDisable: false,
			remark: attribute.remark
		};
		this.CustomerProfileBoardService.saveCustomerDefinedAttribute(params)
			.then(data => this.customerAttributeSetting[0].attributeBlock[1].attributeList.push(Object.assign(attribute, data)))
			.then(() => this.changeCustomerDefinedBlockState(false));
	}
}
