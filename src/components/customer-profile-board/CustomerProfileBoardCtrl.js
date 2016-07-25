/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

import { Inject } from 'angular-es-utils';

import CustomerAttributeSetting from './CustomerAttributeSetting.js';

@Inject('$element')
export default class CheckboxController {
	constructor() {
		this.customerData = {
			'customerId': 1,
			'customerName': 'Hugo BOSS',
			'customerMobile': '1333333333',
			'customerAttr': {},
			'labels': ['夜猫子', '男性用户', '40-49岁', '上班狗', '喵酱', '旺棍'],
			'viewType': 'list'
		};
		this.customerAttributeSetting = CustomerAttributeSetting;
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
