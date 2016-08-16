/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 10:09
 */

import CustomerAttributeNote from './customer-attribute-note';

import './_customer-profile-view-mode.scss';
import template from './customer-profile-view-mode.tpl.html';
import controller from './CustomerProfileViewModeCtrl.js';

const CustomerProfileViewMode = {
	bindings: {
		attributesSetting: '<',
		customerTags: '<',
		changeToSpecificAttributeBlock: '&'
	},
	controller,
	template
};

export { CustomerProfileViewMode, CustomerAttributeNote };
