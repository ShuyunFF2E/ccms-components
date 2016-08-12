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
const API_ADDRESS = 'http://172.18.21.113:8887/fullView';

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
			style: {width: '640px', height: '520px', 'min-width': '640px', 'min-height': '520px', 'padding': 0},
			__body: template,
			controller: controller,
			hasFooter: false,
			uid: 'customer-profile-board'
		};
		ModalService.modal(modalOptions).open();
	}
}

class CustomerProfileBoardService {
	/**
	 * @name queryCustomerProfileData
	 * @param {Object} customerInfo
	 * @returns {Promise}
	 * using $resource to query customer profile data
	 */
	queryCustomerProfileData({nickName = '', shopId = '', platName = ''} = {}) {
		const CustomerProfileResource = genresource(API_ADDRESS);
		return CustomerProfileResource.save(generatorQueryString(nickName, shopId, platName)).$promise;
	}

	/**
	 * @name generateCustomerData
	 * @param {Object} data
	 * @returns {Object}
	 * according to response, generator customer data
	 */
	generateCustomerData(data = {}) {
		console.log(data);
		console.log(Object.keys(data)
			.map(key => {
				switch (key) {
					case 'customer':
					case 'trade':
						return this.concatCustomerAddressZip(data[key].data.data[0]);
					case 'rfm':
						return Object.assign({ rfm: this.setRfmLabel(data[key].data.data) }, this.getLastRfmItem(data[key].data.data));
					case 'tags':
						return { tags: this.getTagsList(data[key].result), marketingResponsivities: data[key].result ? data[key].result.score ? +data[key].result.score : 1 : 1 };
					default:
						return data[key];
				}
			})
			.reduce((pre, curr) => ({...pre, ...curr}), {}));
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
}

export default new CustomerProfileBoardService();
