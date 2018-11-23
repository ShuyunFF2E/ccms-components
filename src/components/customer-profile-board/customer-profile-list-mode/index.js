/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 10:09
 */

import angular from 'angular';

import CustomerAttributeEditor from './customer-attribute-editor';

import './_customer-profile-list-mode.scss';
import template from './customer-profile-list-mode.tpl.html';
import controller from './CustomerProfileListModeCtrl.js';

const CustomerProfileListMode = {
	bindings: {
		attributesSetting: '<',
		customerData: '<',
		scrollToAttributeBlock: '&'
	},
	template,
	controller
};

export default angular.module('ccms.components.customerProfileBoard.customerProfileListMode', [CustomerAttributeEditor])
	.component('ccCustomerProfileListMode', CustomerProfileListMode)
	.name;
