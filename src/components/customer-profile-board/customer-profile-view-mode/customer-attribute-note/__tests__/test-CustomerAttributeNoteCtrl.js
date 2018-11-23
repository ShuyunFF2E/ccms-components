/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-31 14:38
 */

import { assert } from 'chai';

import CustomerAttributeNoteCtrl from '../CustomerAttributeNoteCtrl.js';

describe('CustomerProfileViewModeCtrl', () => {
	const customerAttributeNoteCtrl = new CustomerAttributeNoteCtrl();

	before(() => {
		Object.assign(customerAttributeNoteCtrl, {
			customerAttribute: {
				attributeBlock: [{
					attributeList: [{
						name: 'a',
						isInListMode: true
					}]
				}]
			}
		});
	});

	it('$onInit', () => {
		customerAttributeNoteCtrl.$onInit();
		assert.deepEqual(customerAttributeNoteCtrl.displayAttributeList, [{
			name: 'a',
			isInListMode: true
		}]);
	});
});
