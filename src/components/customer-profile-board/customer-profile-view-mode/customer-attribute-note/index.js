/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 15:10
 */

import './_customer-attribute-note.scss';
import template from './customer-attribute-note.tpl.html';
import controller from './CustomerAttributeNoteCtrl.js';

const CustomerAttributeNote = {
	template,
	controller,
	bindings: {
		customerAttribute: '<',
		attributesDataMap: '<',
		changeToSpecificAttributeBlock: '&'
	}
};

export default CustomerAttributeNote;
