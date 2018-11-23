/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 15:10
 */

import angular from 'angular';

import './_customer-attribute-note.scss';
import template from './customer-attribute-note.tpl.html';
import controller from './CustomerAttributeNoteCtrl.js';

const CustomerAttributeNote = {
	template,
	controller,
	bindings: {
		customerAttribute: '<',
		changeToSpecificAttributeBlock: '&'
	}
};

export default angular.module('ccms.components.customerProfileBoard.customerAttributeNote', [])
	.component('ccCustomerAttributeNote', CustomerAttributeNote)
	.name;
