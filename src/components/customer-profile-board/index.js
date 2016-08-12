/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

import angular from 'angular';

import bindHTML from '../bind-html';
import './_customer-profile-board.scss';
import { $ccCustomerProfileBoard } from './CustomerProfileBoardService';
import CustomerProfileHeader from './customer-profile-header';
import { CustomerProfileViewMode, CustomerAttributeNote } from './customer-profile-view-mode';
import { CustomerProfileListMode, CustomerAttributeEditor } from './customer-profile-list-mode';

export default angular
	.module('ccms.components.customerProfileBoard', [bindHTML])
	.service('$ccCustomerProfileBoard', $ccCustomerProfileBoard)
	.component('customerProfileHeader', CustomerProfileHeader)
	.component('customerProfileListMode', CustomerProfileListMode)
	.component('customerAttributeEditor', CustomerAttributeEditor)
	.component('customerProfileViewMode', CustomerProfileViewMode)
	.component('customerAttributeNote', CustomerAttributeNote)
	.name;
