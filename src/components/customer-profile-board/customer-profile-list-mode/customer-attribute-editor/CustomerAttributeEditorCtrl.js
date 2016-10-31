/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 15:11
 */

import { Inject } from 'angular-es-utils';

import CustomerProfileBoardService from '../../CustomerProfileBoardService.js';

const MONTH_ARRAY = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MONTH_DAY_ARRAY = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

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
	 */
	showAttributeModifyBlock(attribute) {
		const value = typeof attribute.value !== 'undefined' ? attribute.value : attribute.displayValue || attribute.defaultValue || '';
		switch (attribute.type) {
			case 'DATE_SELECT':
				this.tmpValue = new Date(value);
				break;
			case 'MONTH_DAY':
				this.monthArray = MONTH_ARRAY;
				const date = new Date(value);
				if (date) {
					this.tmpMonth = date.getMonth() + 1;
					this.tmpDay = date.getDate();
				} else {
					this.tmpMonth = 1;
					this.tmpDay = 1;
				}
				this.updateDayArray();
				break;
			case 'NUMBER_SELECT':
			case 'CHAR_SELECT':
				if (attribute.optional.indexOf(value) > -1) this.tmpValue = value;
				else this.tmpValue = attribute.optional[0];
				break;
			default:
				this.tmpValue = value;
		}
		this.closeAllAttributeModifyBlock();
		attribute.editingValue = true;
		attribute.displayEditIcon = false;
	}

	/**
	 * modify attribute value data
	 * @name modifyAttributeValue
	 * @param {object} attribute
	 * @param {string} value
	 * @param {boolean} basic
	 */
	modifyAttributeValue(attribute, value, basic) {
		this._$ccValidator.validate(this.attributeModify)
			.then(() => {
				if (attribute.type === 'CHAR_SELECT' && attribute.optionalMap) {
					value = Object
						.keys(attribute.optionalMap)
						.filter(key => attribute.optionalMap[key] === value)[0];
				}
				if (basic) {
					let params;
					if (attribute.type === 'MONTH_DAY') {
						// hack MONTH_DAY type
						params = {
							nickName: this.customerData.nickName,
							tenantId: this.customerData.tenantId,
							condition: `month: ${this.tmpMonth} \n day: ${this.tmpDay}`
						};
					} else {
						params = {
							nickName: this.customerData.nickName,
							tenantId: this.customerData.tenantId,
							condition: attribute.type.match(/NUMBER/)
								? `${attribute.attribute}: ${this.formatValue(value, attribute.type)}`
								: `${attribute.attribute}: "${this.formatValue(value, attribute.type)}"`
						};
					}
					// hack backend bug
					if (attribute.attribute !== 'sex') params.condition += '\nsex: ""';
					return this.CustomerProfileBoardService.updateCustomerDefinedBasicAttributeData(params);
				} else {
					const params = {
						nickName: this.customerData.nickName,
						platName: this.customerData.platName,
						tenantId: this.customerData.tenantId,
						id: attribute.id,
						value: this.formatValue(value, attribute.type)
					};
					return this.CustomerProfileBoardService.updateCustomerDefinedAttributeData(params);
				}
			})
			.then(result => {
				// throw error
				if (!result) throw new Error('Update Attribute Error.');
				if (result.message) throw new Error('Update Attribute Error: ' + result.message);
			})
			.then(() => {
				if (attribute.type === 'MONTH_DAY') value = `${this.tmpMonth}-${this.tmpDay}`;
				if (attribute.type === 'CHAR_SELECT' && attribute.optionalMap) {
					attribute.displayValue = attribute.optionalMap[value];
				} else {
					attribute.displayValue = this.formatValue(value, attribute.type) + attribute.unit;
				}
				this.closeAllAttributeModifyBlock();
			})
			.catch(err => console.info(err));
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
		const defaultValue = this.getDefaultValue(attribute.type);
		const tmpAttribute = {};
		this.CustomerProfileBoardService.queryCustomerDefinedPlatformAttribute(this.customerData.tenantId)
			.then((data = {}) => data.custom_property_properties && data.custom_property_properties.data)
			.then((data = []) => data.filter(item => item.name === attribute.name)[0])
			// tenant hasn't the attribute, add the attribute to tenant first
			.then(item => {
				if (item) return {custom_property_properties: item};
				return this.CustomerProfileBoardService.saveCustomerDefinedPlatformAttribute({
					tenantId: this.customerData.tenantId,
					name: attribute.name,
					type: attribute.type,
					optional: JSON.stringify(attribute.optional),
					isDisable: false,
					remark: attribute.remark
				});
			})
			.then(result => {
				// throw error
				if (!result.custom_property_properties) throw new Error('Create Platform Attribute Error: ' + result);
				if (result.custom_property_properties.message) throw new Error('Create Platform Attribute Error: ' + result.custom_property_properties.message);
				return result.custom_property_properties;
			})
			.then(attribute => Object.assign(tmpAttribute, {
				...attribute,
				value: attribute.optional && attribute.optional[0] || defaultValue
			}))
			// connect the customer attribute with tenant attribute
			.then(attribute => this.CustomerProfileBoardService.saveCustomerDefinedAttribute({
				nickName: this.customerData.nickName,
				platName: this.customerData.platName,
				tenantId: this.customerData.tenantId,
				id: attribute.id,
				value: attribute.optional && attribute.optional[0] || defaultValue
			}))
			.then(result => {
				// throw error
				if (result.message) throw new Error('Create Customer Attribute Error: ' + result.message);
			})
			// save success, set value to display array
			.then(() => this.attributeSetting.attributeBlock[1].attributeList.push({
				...tmpAttribute,
				editable: true,
				attribute: tmpAttribute.name,
				displayValue: tmpAttribute.optional && tmpAttribute.optional[0] || defaultValue
			}))
			.then(() => this.changeCustomerDefinedBlockState(false))
			.catch(err => console.info(err));
	}

	getDefaultValue(type) {
		switch (type) {
			case 'NUMBER_SELECT':
			case 'NUMBER_INPUT':
				return 0;
			case 'DATE_SELECT':
				return this._$filter('date')(new Date(), 'yyyy-MM-dd');
			default:
				return '-';
		}
	}

	updateDayArray() {
		this.dayArray = [];
		for (let day = 1, len = MONTH_DAY_ARRAY[this.tmpMonth - 1]; day <= len; day++) {
			this.dayArray.push(day);
		}
		if (this.tmpDay > this.dayArray.length) this.tmpDay = this.dayArray.length;
	}
}
