/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-17 16:04
 */

import angular from 'angular';

import AttributeDataEditor from './attribute-data-editor';

import './_customer-defined-attribute-editor.scss';
import template from './customer-defined-attribute-editor.tpl.html';
import controller from './CustomerDefinedAttributeEditorCtrl.js';

const CustomerDefinedAttributeEditor = {
	bindings: {
		validateDuplicateNameFn: '&',
		createAttributeFn: '&',
		cancelSetting: '&'
	},
	controllerAs: '$ctrlA',
	template,
	controller
};

export default angular.module('ccms.components.customerProfileBoard.customerDefinedAttributeEditor', [AttributeDataEditor])
	.component('ccCustomerDefinedAttributeEditor', CustomerDefinedAttributeEditor)
	.name;
