/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-30 16:12
 */

import { assert } from 'chai';
import sinon from 'sinon';

import CustomerProfileListModeCtrl from '../CustomerProfileListModeCtrl.js';

describe('CustomerProfileListModeCtrl', () => {
	const customerProfileListModeCtrl = new CustomerProfileListModeCtrl();

	before(() => {
		const parentElement = document.createElement('div');
		const headerElement = document.createElement('div');
		headerElement.className = 'customer-profile-header';
		parentElement.appendChild(headerElement);
		const blockElement = document.createElement('div');
		parentElement.appendChild(blockElement);
		const panelElement = document.createElement('div');
		panelElement.className = 'right-panel-block';
		blockElement.appendChild(panelElement);
		const editorElement = document.createElement('cc-customer-attribute-editor');
		panelElement.appendChild(editorElement);
		Object.assign(customerProfileListModeCtrl, {
			attributesSetting: [],
			customerData: {},
			scrollToAttributeBlock: sinon.spy(),
			_$element: [blockElement],
			_$timeout: func => func()
		});
	});

	it('$postLink', () => {
		customerProfileListModeCtrl.$postLink();
	});

	it('$onDestroy', () => {
		customerProfileListModeCtrl.$onDestroy();
	});

	it('getAttributeBlockOffsetList', () => {
		assert.deepEqual(customerProfileListModeCtrl.getAttributeBlockOffsetList(), [0]);
	});

	it('updateAttributeBlockOffsetList', done => {
		customerProfileListModeCtrl.updateAttributeBlockOffsetList();
		setTimeout(() => {
			assert.deepEqual(customerProfileListModeCtrl.attributesOffsetList, [0]);
			done();
		}, 100);
	});

	it('getActiveAttributeBlockIndex', () => {
		assert.equal(customerProfileListModeCtrl.getActiveAttributeBlockIndex(0, [0]), 0);
	});
});
