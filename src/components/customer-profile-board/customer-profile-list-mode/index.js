/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 10:09
 */

import './_customer-profile-list-mode.scss';
import template from './customer-profile-list-mode.tpl.html';
import controller from './CustomerProfileListModeCtrl.js';

import CustomerAttributeEditor from './customer-attribute-editor';

const CustomerProfileListMode = {
	bindings: {
		customerData: '<',
		attributesSetting: '<',
		scrollToAttributeBlock: '&'
	},
	template,
	controller
};

export { CustomerProfileListMode, CustomerAttributeEditor };
