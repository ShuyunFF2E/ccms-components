/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 15:10
 */

import './_customer-attribute-editor.scss';
import template from './customer-attribute-editor.tpl.html';
import controller from './CustomerAttributeEditorCtrl.js';

const CustomerAttributeEditor = {
	template,
	controller,
	controllerAs: '$ctrlA',
	bindings: {
		attributeSetting: '<',
		customerData: '<',
		updateAttributeBlockOffset: '&',
		scrollToAttributeBlock: '&'
	}
};

export default CustomerAttributeEditor;
