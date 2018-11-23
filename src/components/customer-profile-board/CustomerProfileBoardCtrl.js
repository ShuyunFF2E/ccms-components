/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

import angular from 'angular';
import { Inject } from 'angular-es-utils';

import CustomerAttributeSetting, {DEFAULT_ATTRIBUTE_SETTING} from './CustomerAttributeSetting.js';
import CustomerProfileBoardService from './CustomerProfileBoardService.js';

@Inject('$element', '$filter')
export default class CheckboxController {
	constructor() {
		this.CustomerProfileBoardService = new CustomerProfileBoardService();
		this.customerAttributeSetting = angular.copy(CustomerAttributeSetting);

		this.customerData = {
			...this.customerInformation,
			viewType: 'list' // useless now
		};

		this._loadingData = true;
		this._loadingDataError = false;

		this.CustomerProfileBoardService
			.queryCustomerProfileData(this.customerData)
			.then(data => Object.assign({}, this.customerData, this.CustomerProfileBoardService.generateCustomerData(data)))
			.then(customerData => {
				this.customerTags = customerData.tags;
				this.customerData.marketingResponsivities = customerData.marketingResponsivities;
				this.customerData.mobile = customerData.mobile;
				this.customerAttributeSetting.forEach(setting =>
					setting.attributeBlock.forEach(customerAttributeBlock => {
						if (customerAttributeBlock.name === 'customerDefined') {
							// 设置自定义属性
							customerAttributeBlock.attributeList = (customerData.custom_property_customer || []).map(item => ({
								...DEFAULT_ATTRIBUTE_SETTING,
								...item,
								attribute: item.name,
								displayValue: item.type !== 'DATE_SELECT' ? item.value : this._$filter('date')(item.value, 'yyyy-MM-dd')
							}));
						} else {
							// 设置默认属性
							this.CustomerProfileBoardService.mappingDataIntoAttributeBlock(customerAttributeBlock, customerData);
						}
					})
				);
			})
			.then(() => this._loadingData = false)
			.catch(err => {
				console.error(err.message || err.data.message);
				this._loadingData = false;
				this._loadingDataError = true;
			});
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
		if (this._loadingData || this._loadingDataError) return;
		this.viewMode = true;
	}

	/**
	 * @name changeToListMode
	 * set viewMode false to change view into list mode
	 */
	changeToListMode() {
		if (this._loadingData || this._loadingDataError) return;
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
		setTimeout(() => {
			this._$element[0].querySelectorAll('cc-customer-attribute-editor')[index].scrollIntoView({behavior: 'smooth'});
		}, 0);
	}
}
