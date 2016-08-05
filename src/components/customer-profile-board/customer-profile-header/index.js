/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 10:09
 */

import './_customer-profile-header.scss';
import template from './customer-profile-header.tpl.html';
import controller from './CustomerProfileHeaderCtrl.js';

const CustomerProfileHeader = {
	bindings: {
		customerData: '<',
		viewMode: '<',
		changeToView: '&',
		changeToList: '&'
	},
	controller,
	template
};

export default CustomerProfileHeader;
