/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-18 11:39
 */

import genresource from 'angular-es-utils/rs-generator';
import ModalService from '../modal/ModalService.js';

import controller from './CustomerProfileBoardCtrl.js';
import template from './customer-profile-board.tpl.html';
import generatorQueryString from './queryStringSchema.js';
import CustomerAttributeSetting, { TagsMapping, RfmLabel } from './CustomerAttributeSetting.js';

const MODAL_TITLE_STRING = '客户基本信息';
const CUSTOMER_DEFINED_ATTRIBUTES_API_PREFIX = '/cc/customer-defined-attribute';
const CUSTOMER_PROFILE_API_PREFIX = '/cc/customer-profile';
const CUSTOMER_PROFILE_API = CUSTOMER_PROFILE_API_PREFIX + '/fullView';
const CUSTOMER_DEFINED_ATTRIBUTES_GET_DATA_API = CUSTOMER_DEFINED_ATTRIBUTES_API_PREFIX + '/customer/:nickName';
const CUSTOMER_DEFINED_ATTRIBUTES_API = CUSTOMER_DEFINED_ATTRIBUTES_API_PREFIX + '/customer';
const CUSTOMER_DEFINED_PLATFORM_ATTRIBUTES_API = CUSTOMER_DEFINED_ATTRIBUTES_API_PREFIX + '/properties';

export class $ccCustomerProfileBoard {
	/**
	 * @name popProfileBoardModal
	 * @param {Object} customerInformation
	 * pop modal of customer profile board
	 */
	popProfileBoardModal(customerInformation = {}) {
		const modalOptions = {
			bindings: {
				customerInformation
			},
			title: MODAL_TITLE_STRING,
			style: {width: '640px', height: '460px', 'min-width': '640px', 'min-height': '460px', 'padding': 0},
			__body: template,
			controller: controller,
			hasFooter: false,
			uid: 'customer-profile-board'
		};
		ModalService.modal(modalOptions).open();
	}
}

class CustomerProfileBoardService {
	constructor() {
		this.CustomerProfileResource = genresource(CUSTOMER_PROFILE_API, true, undefined, undefined, {
			headers: {
				'Content-Type': 'application/graphql'
			}
		});
		this.CustomerDefinedAttributeGetDataResource = genresource(CUSTOMER_DEFINED_ATTRIBUTES_GET_DATA_API);
		this.CustomerDefinedAttributeResource = genresource(CUSTOMER_DEFINED_ATTRIBUTES_API);
		this.CustomerDefinedPlatformAttributeResource = genresource(CUSTOMER_DEFINED_PLATFORM_ATTRIBUTES_API);
	}

	/**
	 * @name queryCustomerProfileData
	 * @param {Object} customerInfo
	 * @returns {Promise}
	 * using $resource to query customer profile data
	 */
	queryCustomerProfileData({nickName = '', shopId = '', platName = ''} = {}) {
		return this.CustomerProfileResource.save(generatorQueryString(nickName, shopId, platName)).$promise;
	}

	/**
	 * @name queryCustomerDefinedAttributeData
	 * @param {Object} customerInfo
	 * @returns {Promise}
	 */
	getCustomerDefinedAttributeData({nickName = '', tenantId = '', platName = 'taobao'} = {}) {
		return this.CustomerDefinedAttributeGetDataResource.get({nickName, tenantId, platform: platName}).$promise;
	}

	/**
	 * @name saveCustomerDefinedAttribute
	 * @param {object} params
	 * @returns {promise}
	 */
	saveCustomerDefinedAttribute(params = {}) {
		return this.CustomerDefinedAttributeResource.save(params).$promise;
	}

	/**
	 * @name updateCustomerDefinedAttributeData
	 * @param {object} params
	 * @returns {promise}
	 */
	updateCustomerDefinedAttributeData(params = {}) {
		return this.CustomerDefinedAttributeResource.update(params).$promise;
	}

	/**
	 * @name queryCustomerDefinedPlatformAttribute
	 * @param {string} tenantId
	 * @returns {promise}
	 */
	queryCustomerDefinedPlatformAttribute(tenantId = '') {
		return this.CustomerDefinedPlatformAttributeResource.query({tenantId}).$promise;
	}

	/**
	 * @name saveCustomerDefinedAttribute
	 * @param {Object} attribute
	 * @returns {Promise}
	 */
	saveCustomerDefinedPlatformAttribute(attribute) {
		return this.CustomerDefinedPlatformAttributeResource.save(attribute).$promise;
	}

	/**
	 * @name generateCustomerData
	 * @param {Object} data
	 * @returns {Object}
	 * according to response, generator customer data
	 */
	generateCustomerData(data = {}) {
		return Object.keys(data)
			.map(key => {
				switch (key) {
					case 'customer':
					case 'trade':
						return this.concatCustomerAddressZip(data[key].data.data[0]);
					case 'rfm':
						return Object.assign({rfm: this.setRfmLabel(data[key].data.data)}, this.getLastRfmItem(data[key].data.data));
					case 'tags':
						return {
							tags: this.getTagsList(data[key].result),
							marketingResponsivities: data[key].result ? (data[key].result.score ? +data[key].result.score : 1) : 1
						};
					case 'memberInfo':
						return Object.keys(data[key]).map(k => data[key][k]).reduce((pre, curr) => ({...pre, ...curr}), {});
					default:
						return data[key];
				}
			})
			.reduce((pre, curr) => ({...pre, ...curr}), {});
	}

	/**
	 * @name concatCustomerAddressZip
	 * @param {Object} info
	 * @returns {Object}
	 * concat address & zip data into address_zip attribute
	 */
	concatCustomerAddressZip(info = {}) {
		if (!info.receiver_state && !info.receiver_city &&
			!info.receiver_district && !info.receiver_address &&
			!info.receiver_zip) return info;
		return {
			...info,
			address_zip: [
				info.receiver_state || '',
				info.receiver_city || '',
				info.receiver_district || '',
				info.receiver_address || '',
				' ',
				info.receiver_zip || ''
			].join('')
		};
	}

	/**
	 * @name getTagsList
	 * @param {Object} tagObj
	 * @returns {Array}
	 * get tags text list
	 */
	getTagsList(tagObj = {}) {
		return Object.keys(tagObj)
			.filter(key => +tagObj[key])
			.filter(key => typeof TagsMapping[key] !== 'undefined') // don't display negative label
			.map(key => TagsMapping[key]);
	}

	/**
	 * @name getLastRfmItem
	 * @param {Array} rfmList
	 * @returns {Object}
	 * get last rfm item
	 */
	getLastRfmItem(rfmList = []) {
		return rfmList.length ? rfmList.slice().sort((prev, next) => prev.period > next.period ? -1 : 1)[0] : {};
	}

	/**
	 * @name setRfmLabel
	 * @param {Array} rfmList
	 * @returns {Array}
	 * set rfm label into every rfm item
	 */
	setRfmLabel(rfmList = []) {
		if (!rfmList.length) return rfmList;
		const tmp = rfmList.map(rfm => ({
			...rfm,
			period_label: RfmLabel[rfm.period]
		})).sort((prev, next) => prev.period > next.period ? 1 : -1); // map method will change list order
		tmp.unshift(tmp.pop());
		return tmp;
	}

	/**
	 * @name mappingDataIntoAttributeBlock
	 * @param {object} attributeBlock
	 * @param {object} dataMapping
	 */
	mappingDataIntoAttributeBlock(attributeBlock = {}, dataMapping = {}) {
		if (attributeBlock.type === 'List' && dataMapping[attributeBlock.name]) {
			attributeBlock.listData = [...dataMapping[attributeBlock.name]];
			attributeBlock.listData.forEach(data => {
				attributeBlock.attributeList.forEach(attribute => {
					data[attribute.attribute] = this.getAttributeValue(attribute, data);
				});
			});
		}
		this.mappingDataIntoAttributeSetting(attributeBlock.attributeList, dataMapping);
	}

	/**
	 * mapping attribute value into attribute setting object
	 * @param {Array} attributeList
	 * @param {Object} dataMapping
	 */
	mappingDataIntoAttributeSetting(attributeList = [], dataMapping = {}) {
		attributeList.map(attribute => {
			typeof attribute.attributes !== 'undefined' && this.mappingDataIntoAttributeSetting(attribute.attributes, dataMapping);
			attribute.displayValue = this.getAttributeValue(attribute, dataMapping);
			return attribute;
		});
	}

	/**
	 * get attribute value
	 * @param {object} attribute
	 * @param {object} dataMapping
	 */
	getAttributeValue(attribute, dataMapping) {
		if (dataMapping[attribute.attribute] !== undefined) {
			if (attribute.valueMap) {
				return attribute.valueMap[dataMapping[attribute.attribute]];
			} else {
				return (attribute.currency ? this.formatCurrencyNumber(dataMapping[attribute.attribute]) : dataMapping[attribute.attribute]) + attribute.unit;
			}
		} else {
			if (attribute.valueMap) {
				return attribute.valueMap[attribute.defaultValue];
			} else {
				return attribute.defaultValue;
			}
		}
	}

	/**
	 * get all static defined attribute list
	 * @name getAttributeList
	 * @returns {Array}
	 */
	getAttributeList() {
		let attributeList = [];
		CustomerAttributeSetting.forEach(setting =>
			setting.attributeBlock.forEach(customerAttributeBlock =>
				customerAttributeBlock.attributeList.forEach(attribute =>
					attributeList.indexOf(attribute.attribute) === -1 && attributeList.push(attribute.attribute))));
		return attributeList;
	}

	/**
	 * format currency number
	 * @param {number} number
	 * @returns {number} number
	 */
	formatCurrencyNumber(number, fixed = 2) {
		number = parseFloat(number);
		if (!number) number = 0;
		return number.toFixed(fixed);
	}

}

export default CustomerProfileBoardService;
