/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-17 11:53
 */

import './_attribute-data-editor.scss';
import template from './attribute-data-editor.tpl.html';
import controller from './AttributeDateEditorCtrl.js';

const CustomerDefinedAttributeDataEditor = {
	bindings: {
		attributeOptionalList: '<',
		numberOnly: '<',
		setChild: '&'
	},
	controllerAs: '$ctrlA',
	template,
	controller
};

export default CustomerDefinedAttributeDataEditor;
