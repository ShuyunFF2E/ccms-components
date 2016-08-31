/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-30 15:10
 */

import { assert } from 'chai';
import sinon from 'sinon';

import CustomerDefinedAttributeEditorCtrl from '../CustomerDefinedAttributeEditorCtrl.js';

describe('CustomerProfileBoardCtrl', () => {
	const customerDefinedAttributeEditorCtrl = new CustomerDefinedAttributeEditorCtrl();

	before(() => {
		Object.assign(customerDefinedAttributeEditorCtrl, {
			validateDuplicateNameFn: () => {},
			createAttributeFn: () => {},
			cancelSetting: () => {},
			_$ccValidator: {
				validate: () => Promise.resolve()
			},
			_$timeout: func => func()
		});
	});

	it('$onInit', () => {
		customerDefinedAttributeEditorCtrl.$onInit();
		assert.deepEqual(customerDefinedAttributeEditorCtrl.validators, {
			attributeName: {
				msg: '属性名称必须为1-20个字符',
				regex: /^(\d|\w|[\u4e00-\u9fa5]){1,20}$/
			},
			duplicate: {
				msg: '属性名不能重复',
				fn: customerDefinedAttributeEditorCtrl.validateDuplicateNameFn()
			}
		});
	});

	it('getChildCtrl', () => {
		const showAddAttributeInput = sinon.spy();
		const addAttribute = sinon.spy();
		customerDefinedAttributeEditorCtrl.getChildCtrl({showAddAttributeInput, addAttribute});
		assert.equal(customerDefinedAttributeEditorCtrl.childCtrl.showAddAttributeInput, showAddAttributeInput);
		assert.equal(customerDefinedAttributeEditorCtrl.childCtrl.addAttribute, addAttribute);
	});

	it('toggleRemarkTextArea', () => {
		assert.equal(customerDefinedAttributeEditorCtrl.showRemarkTextAreaState, false);
		customerDefinedAttributeEditorCtrl.toggleRemarkTextArea();
		assert.deepEqual(customerDefinedAttributeEditorCtrl.showRemarkTextAreaState, true);
	});

	it('confirmRemark', () => {
		assert.deepEqual(customerDefinedAttributeEditorCtrl.showRemarkTextAreaState, true);
		customerDefinedAttributeEditorCtrl.confirmRemark();
		assert.deepEqual(customerDefinedAttributeEditorCtrl.showRemarkTextAreaState, false);
	});

	it('confirmCustomerDefinedAttribute', done => {
		customerDefinedAttributeEditorCtrl.confirmCustomerDefinedAttribute();

		setTimeout(() => {
			assert(customerDefinedAttributeEditorCtrl.childCtrl.showAddAttributeInput.called, true);
			assert(customerDefinedAttributeEditorCtrl.childCtrl.addAttribute.called, true);
			done();
		}, 50);
	});
});
