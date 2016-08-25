/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-17 11:53
 */

import angular from 'angular';

import './_attribute-data-editor.scss';
import template from './attribute-data-editor.tpl.html';
import controller from './AttributeDateEditorCtrl.js';

const CustomerDefinedAttributeDataEditor = {
	bindings: {
		attributeOptionalList: '<',
		numberOnly: '<',
		setChild: '&'
	},
	template,
	controller
};

export default angular.module('ccms.components.customerProfileBoard.attributeDataEditor', [])
	.component('ccAttributeDataEditor', CustomerDefinedAttributeDataEditor)
	.name;
