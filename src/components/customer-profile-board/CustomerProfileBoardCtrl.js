/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

import { Inject } from 'angular-es-utils';

import CustomerAttributeSetting from './CustomerAttributeSetting.js';
import CustomerProfileBoardService from './CustomerProfileBoardService.js';

@Inject('$element', '$scope')
export default class CheckboxController {
	constructor() {
		this.CustomerProfileBoardService = new CustomerProfileBoardService();
		this.customerAttributeSetting = CustomerAttributeSetting;

		this.customerData = {
			'viewType': 'list'
		};

		const {nickName, tenantId, shopId, platName} = this.customerInformation;

		this.CustomerProfileBoardService
			.queryCustomerProfileData(nickName, tenantId, shopId, platName)
			.then(data => this.customerData = (Object.assign({}, this.customerData, this.CustomerProfileBoardService.generateCustomerData(data))))
			.then(() => this._$scope.$digest());
	}

	/**
	 * @name $onInit
	 * controller init method, init true, false values
	 */
	$onInit() {
		this.viewMode = true;
	}

	changeToViewMode() {
		this.viewMode = true;
	}

	changeToListMode() {
		this.viewMode = false;
	}

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

	scrollToAttributeBlock(index = 0) {
		this._$element.ready(() => {
			this._$element[0].querySelectorAll('customer-attribute-editor')[index].scrollIntoView();
		});
	}
}
