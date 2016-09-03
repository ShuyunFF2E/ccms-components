/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-30 13:58
 */

import angular from 'angular';
import { assert } from 'chai';
import injector from 'angular-es-utils/injector';
import sinon from 'sinon';

import CustomerProfileBoardCtrl from '../CustomerProfileBoardCtrl.js';

describe('CustomerProfileBoardCtrl', () => {
	let sandbox;

	beforeEach(() => {
		angular.mock.module('app');
		angular.mock.inject($injector => {
			sandbox = sinon.sandbox.create();
			sandbox.stub(injector, 'get', service => $injector.get(service));
		});
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('$onInit', () => {
		const customerProfileBoardCtrl = new CustomerProfileBoardCtrl();
		customerProfileBoardCtrl.$onInit();
		assert.equal(customerProfileBoardCtrl.viewMode, true);
	});

	it('changeToViewMode', () => {
		const customerProfileBoardCtrl = new CustomerProfileBoardCtrl();
		customerProfileBoardCtrl.changeToViewMode();
		assert.equal(customerProfileBoardCtrl.viewMode, true);
	});

	it('changeToListMode', () => {
		const customerProfileBoardCtrl = new CustomerProfileBoardCtrl();
		customerProfileBoardCtrl.$onInit();
		assert.equal(customerProfileBoardCtrl.viewMode, true);
		customerProfileBoardCtrl.changeToListMode();
		assert.equal(customerProfileBoardCtrl.viewMode, false);
	});

	it('changeToSpecificAttributeBlock', () => {
		const customerProfileBoardCtrl = new CustomerProfileBoardCtrl();
		const blockElement = document.createElement('div');
		const attributeBlock1 = document.createElement('cc-customer-attribute-editor');
		const attributeBlock2 = document.createElement('cc-customer-attribute-editor');
		blockElement.appendChild(attributeBlock1);
		blockElement.appendChild(attributeBlock2);
		customerProfileBoardCtrl._$element = [blockElement];
		customerProfileBoardCtrl.$onInit();
		assert.equal(customerProfileBoardCtrl.viewMode, true);

		customerProfileBoardCtrl.changeToSpecificAttributeBlock('consumer');
		assert.equal(customerProfileBoardCtrl.viewMode, false);
	});
});
