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
import CustomerProfileViewMode from './customer-profile-view-mode';
import CustomerProfileListMode from './customer-profile-list-mode';
import CustomerDefinedAttributeEditor from './customer-defined-attribute-editor';

export default angular
	.module('ccms.components.customerProfileBoard', [bindHTML, CustomerProfileHeader, CustomerProfileViewMode, CustomerProfileListMode, CustomerDefinedAttributeEditor])
	.provider('$ccCustomerProfileBoard', $ccCustomerProfileBoard)
	.name;
