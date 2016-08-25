/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 15:11
 */

import { Inject } from 'angular-es-utils';

import CustomerProfileBoardService from '../../CustomerProfileBoardService.js';

@Inject('$scope', '$ccValidator', '$filter')
export default class CustomerAttributeEditorCtrl {
	constructor() {
		this.CustomerProfileBoardService = new CustomerProfileBoardService();
		this.staticAttributeNameList = this.CustomerProfileBoardService.getAttributeList();

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

	/**
	 * generator duplication name fn
	 * @name validateDuplicateNameFn
	 * @returns {Function}
	 */
	validateDuplicateNameFn() {
		const attributeNameList = this.staticAttributeNameList.concat(this.attributeSetting.attributeBlock[1].attributeList.map(attr => attr.name));
		return (modelValue, viewValue) => {
			const value = modelValue || viewValue || '';
			return attributeNameList.indexOf(value.trim()) === -1;
		};
	}

	/**
	 * @name closeAllAttributeModifyBlock
	 */
	closeAllAttributeModifyBlock() {
		this.attributeSetting.attributeBlock.forEach(block => block.attributeList.forEach(attribute => (attribute.editingValue = false)));
	}

	/**
	 * show attribute modify block
	 * @name showAttributeModifyBlock
	 * @param {object} attribute
	 * @param {string} value
	 */
	showAttributeModifyBlock(attribute, value = '') {
		this.tmpValue = attribute.type !== 'DATE_SELECT' ? value : new Date(value);
		this.closeAllAttributeModifyBlock();
		attribute.editingValue = true;
	}

	/**
	 * modify attribute value data
	 * @name modifyAttributeValue
	 * @param {object} attribute
	 * @param {string} value
	 */
	modifyAttributeValue(attribute, value) {
		this._$ccValidator.validate(this.attributeModify)
			.then(() => {
				const params = {
					customerno: this.customerData.nickName,
					platform: this.customerData.platName,
					tenantId: this.customerData.tenantId,
					properties: [{
						id: attribute.id,
						value: attribute.type === 'NUMBER_SELECT' || attribute.type === 'NUMBER_INPUT' ? Number.parseFloat(value) : value
					}]
				};
				return this.CustomerProfileBoardService.updateCustomerDefinedAttributeData(params);
			})
			.then(() => {
				attribute.value = value;
				attribute.displayValue = this.formatValue(value, attribute.type);
				this.closeAllAttributeModifyBlock();
			});
	}

	/**
	 * format display value
	 * @name formatValue
	 * @param {string} value
	 * @param {string} type
	 * @returns {number | string}
	 */
	formatValue(value, type) {
		switch (type) {
			case 'NUMBER_SELECT':
			case 'NUMBER_INPUT':
				return Number.parseFloat(value);
			case 'DATE_SELECT':
				return this._$filter('date')(value, 'yyyy-MM-dd');
			default:
				return value;
		}
	}

	/**
	 * according params state, show | hide customer defined block
	 * @name changeCustomerDefinedBlockState
	 * @param {boolean} state
	 */
	changeCustomerDefinedBlockState(state) {
		this.showCustomerAttributeEditor = state;
		this.closeAllAttributeModifyBlock();
		this.updateAttributeBlockOffset();
		state && this.scrollToAttributeBlock(0);
	}

	/**
	 * save customer defined attribute
	 * 1. get customer plat attribute name
	 * 2. judge attribute name is set in plat
	 * 3. if yes, return the setting, else create plat setting & return the setting
	 * 4. according setting, create the map of customer and plat setting
	 * 5. if success, add attribute into attributeList to display
	 * @name saveCustomerDefinedAttribute
	 * @param {Object} attribute
	 */
	saveCustomerDefinedAttribute(attribute) {
		this.CustomerProfileBoardService.queryCustomerDefinedPlatformAttribute(this.customerData.tenantId)
			.then((data = []) => data.filter(item => item.name === attribute.name)[0])
			// tenant hasn't the attribute, add the attribute to tenant first
			.then(item => item || this.CustomerProfileBoardService.saveCustomerDefinedPlatformAttribute({
				tenantId: this.customerData.tenantId,
				name: attribute.name,
				type: attribute.type,
				optional: attribute.optional,
				isDisable: false,
				remark: attribute.remark
			}))
			// connect the customer attribute with tenant attribute
			.then(attributeObject => Object.assign(attribute, attributeObject) && this.CustomerProfileBoardService.saveCustomerDefinedAttribute({
				customerno: this.customerData.nickName,
				platform: this.customerData.platName,
				tenantId: this.customerData.tenantId,
				properties: [{
					id: attribute.id,
					value: attribute.optional && attribute.optional[0] || ''
				}]
			}))
			// save success, set value to display array
			.then(() => this.attributeSetting.attributeBlock[1].attributeList.push({
				...attribute,
				attribute: attribute.name,
				value: attribute.optional && attribute.optional[0] || '',
				displayValue: attribute.optional && attribute.optional[0] || ''
			}))
			.then(() => this.changeCustomerDefinedBlockState(false))
			.catch(err => console.error(err));
	}
}
