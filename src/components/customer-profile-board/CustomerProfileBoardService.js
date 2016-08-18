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
import { TagsMapping, RfmLabel } from './CustomerAttributeSetting.js';

const MODAL_TITLE_STRING = '客户基本信息';
const CUSTOMER_PROFILE_API_ADDRESS = 'http://172.18.21.113:8887/fullView';
const CUSTOMER_DEFINED_ATTRIBUTES_DATA_API_ADDRESS = '/customer/:nickName';
const CUSTOMER_DEFINED_ATTRIBUTES_API_ADDRESS = '/properties';

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
		this.CustomerProfileResource = genresource(CUSTOMER_PROFILE_API_ADDRESS);
		this.CustomerDefinedAttributeDataResource = genresource(CUSTOMER_DEFINED_ATTRIBUTES_DATA_API_ADDRESS);
		this.CustomerDefinedAttributeResource = genresource(CUSTOMER_DEFINED_ATTRIBUTES_API_ADDRESS);
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
	queryCustomerDefinedAttributeData({nickName = '', tenantId = ''} = {}) {
		// return this.CustomerDefinedAttributeDataResource.get({nickName, tenantId}).$promise;
		return Promise.resolve([]);
	}

	/**
	 * @name saveCustomerDefinedAttribute
	 * @param {Object} attribute
	 * @returns {Promise}
	 */
	saveCustomerDefinedAttribute(attribute) {
		// return this.CustomerDefinedAttributeResource.save(attribute).$promise;
		return Promise.resolve();
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
						return Object.assign({ rfm: this.setRfmLabel(data[key].data.data) }, this.getLastRfmItem(data[key].data.data));
					case 'tags':
						return {
							tags: this.getTagsList(data[key].result),
							marketingResponsivities: data[key].result ? (data[key].result.score ? +data[key].result.score : 1) : 1
						};
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
		const tmp = rfmList.map(rfm => ({...rfm, period_label: RfmLabel[rfm.period]})).sort((prev, next) => prev.period > next.period ? 1 : -1); // map method will change list order
		tmp.unshift(tmp.pop());
		return tmp;
	}

	mappingDataIntoAttributeBlock(attributeBlock = {}, dataMapping = {}) {
		if (attributeBlock.type === 'List') {
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
	 * @param {string} target
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
