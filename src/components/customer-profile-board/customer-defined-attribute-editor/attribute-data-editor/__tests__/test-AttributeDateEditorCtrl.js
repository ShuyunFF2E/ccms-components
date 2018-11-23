/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-30 15:37
 */

import { assert } from 'chai';

import AttributeDateEditorCtrl from '../AttributeDateEditorCtrl.js';

describe('AttributeDateEditorCtrl', () => {
	const attributeDateEditorCtrl = new AttributeDateEditorCtrl();

	before(() => {
		Object.assign(attributeDateEditorCtrl, {
			attributeOptionalList: [],
			numberOnly: false,
			setChild: () => {},
			_$ccValidator: {
				validate: () => Promise.resolve()
			}
		});
	});

	it('$onInit', () => {
		attributeDateEditorCtrl.$onInit();
		assert.equal(attributeDateEditorCtrl.addAttributeState, false);
	});

	it('$onChanges', () => {
		attributeDateEditorCtrl.$onChanges({
			numberOnly: {
				currentValue: true
			}
		});
		assert.equal(attributeDateEditorCtrl.validator, 'required,length,duplicate,number');
	});

	it('showAddAttributeInput', () => {
		assert.equal(attributeDateEditorCtrl.addAttributeState, false);
		attributeDateEditorCtrl.showAddAttributeInput();
		assert.equal(attributeDateEditorCtrl.addAttributeState, true);
	});

	it('addAttribute', done => {
		assert.equal(attributeDateEditorCtrl.attributeOptionalList.length, 0);
		attributeDateEditorCtrl.addAttribute();
		setTimeout(() => {
			assert.equal(attributeDateEditorCtrl.attributeOptionalList.length, 1);
			done();
		}, 50);
	});

	it('addAttribute', () => {
		attributeDateEditorCtrl.removeAttribute(attributeDateEditorCtrl.attributeOptionalList.length - 1);
		assert.equal(attributeDateEditorCtrl.attributeOptionalList.length, 0);
	});
});
