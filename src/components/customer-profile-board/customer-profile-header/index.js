/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 10:09
 */

import angular from 'angular';

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

export default angular.module('ccms.components.customerProfileBoard.customerProfileHeader', [])
	.component('ccCustomerProfileHeader', CustomerProfileHeader)
	.name;
