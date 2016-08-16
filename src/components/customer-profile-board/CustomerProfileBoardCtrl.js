/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

import { Inject } from 'angular-es-utils';

import CustomerAttributeSetting from './CustomerAttributeSetting.js';
import CustomerProfileBoardService from './CustomerProfileBoardService.js';

@Inject('$element', '$scope', '$timeout')
export default class CheckboxController {
	constructor() {
		this.customerAttributeSetting = CustomerAttributeSetting;

		this.customerData = {
			...this.customerInformation,
			viewType: 'list' // useless now
		};

		CustomerProfileBoardService
			.queryCustomerProfileData(this.customerData)
			.then(data => (this.customerData = Object.assign({}, this.customerData, CustomerProfileBoardService.generateCustomerData(data))));
	}

	/**
	 * @name $onInit
	 * controller init method, init true, false values
	 */
	$onInit() {
		this.viewMode = true;
	}

	/**
	 * @name changeToViewMode
	 * set viewMode true to change view into view mode
	 */
	changeToViewMode() {
		this.viewMode = true;
	}

	/**
	 * @name changeToListMode
	 * set viewMode false to change view into list mode
	 */
	changeToListMode() {
		this.viewMode = false;
	}

	/**
	 * @name changeToSpecificAttributeBlock
	 * @param {String} name
	 * According to block name, scroll view to special block
	 */
	changeToSpecificAttributeBlock(name = '') {
		let index = 0;

		this.changeToListMode();

		for (let attr of this.customerAttributeSetting) {
			if (attr.name === name) break;
			index++;
		}
		index = index >= this.customerAttributeSetting.length ? 0 : index;
		this.scrollToAttributeBlock(index);
	}

	/**
	 * @name scrollToAttributeBlock
	 * @param {Number} index
	 * According to index, scroll view to special block
	 */
	scrollToAttributeBlock(index = 0) {
		this._$timeout(() => {
			this._$element[0].querySelectorAll('customer-attribute-editor')[index].scrollIntoView();
		}, 0, false);
	}
}
