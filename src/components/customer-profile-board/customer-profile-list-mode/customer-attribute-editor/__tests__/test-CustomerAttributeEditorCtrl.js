/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-30 17:20
 */

import angular from 'angular';
import { assert } from 'chai';
import sinon from 'sinon';
import injector from 'angular-es-utils/injector';

import CustomerAttributeEditorCtrl from '../CustomerAttributeEditorCtrl.js';

describe('CustomerProfileListModeCtrl', () => {
	let customerAttributeEditorCtrl, sandbox, $httpBackend;

	beforeEach(() => {
		angular.mock.module('app');
		angular.mock.inject($injector => {
			$httpBackend = $injector.get('$httpBackend');
			sandbox = sinon.sandbox.create();
			sandbox.stub(injector, 'get', service => $injector.get(service));
		});

		customerAttributeEditorCtrl = new CustomerAttributeEditorCtrl();
		Object.assign(customerAttributeEditorCtrl, {
			attributeSetting: {
				attributeBlock: [{
					attributeList: [{
						name: 'a'
					}]
				}, {
					attributeList: [{
						name: 'b'
					}]
				}]
			},
			customerData: {},
			updateAttributeBlockOffset: sinon.spy(),
			scrollToAttributeBlock: sinon.spy(),
			_$scope: {
				$watch: sinon.spy()
			},
			_$ccValidator: {
				validate: () => Promise.resolve({})
			},
			_$filter: sinon.spy()
		});
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('$postLink', () => {
		customerAttributeEditorCtrl.$postLink();
		assert.deepEqual(customerAttributeEditorCtrl.attributeSetting.attributeBlock, [{
			attributeList: [{
				name: 'a'
			}]
		}, {
			attributeList: [{
				name: 'b'
			}]
		}]);

		customerAttributeEditorCtrl.attributeSetting.attributeBlock.push({
			type: 'List',
			listData: [{
				period: 6
			}, {
				period: 2
			}]
		});
		customerAttributeEditorCtrl.$postLink();
		assert.deepEqual(customerAttributeEditorCtrl.selectedRfm, {period: 6});
		assert.equal(customerAttributeEditorCtrl.selectedRfmPeriod, 6);
		assert.equal(customerAttributeEditorCtrl._$scope.$watch.called, true);
	});

	it('validateDuplicateNameFn', () => {
		assert.isFunction(customerAttributeEditorCtrl.validateDuplicateNameFn());
		assert.equal(customerAttributeEditorCtrl.validateDuplicateNameFn()('a'), true);
		assert.equal(customerAttributeEditorCtrl.validateDuplicateNameFn()('b'), false);
	});

	it('closeAllAttributeModifyBlock', () => {
		assert.isFunction(customerAttributeEditorCtrl.validateDuplicateNameFn());
		assert.equal(customerAttributeEditorCtrl.validateDuplicateNameFn()('a'), true);
		assert.equal(customerAttributeEditorCtrl.validateDuplicateNameFn()('b'), false);
	});

	it('showAttributeModifyBlock', () => {
		const attriubte = {
			editingValue: false
		};
		customerAttributeEditorCtrl.showAttributeModifyBlock(attriubte);
		assert.equal(customerAttributeEditorCtrl.tmpValue, '');
		assert.equal(attriubte.editingValue, true);
	});

	it('modifyAttributeValue', done => {
		$httpBackend
			.when('POST', 'undefined/fullView/undefined/')
			.respond({});
		const attribute = {
			editingValue: true
		};
		const value = '1';
		customerAttributeEditorCtrl.modifyAttributeValue(attribute, value);
		setTimeout(() => {
			$httpBackend.flush();
			setTimeout(() => {
				assert.equal(attribute.displayValue, '1');
				done();
			}, 50);
		}, 10);
	});

	it('formatValue', () => {
		assert.equal(customerAttributeEditorCtrl.formatValue(1, 'NUMBER_SELECT'), 1);
		assert.equal(customerAttributeEditorCtrl.formatValue('aaa'), 'aaa');
	});

	it('changeCustomerDefinedBlockState', () => {
		assert.equal(customerAttributeEditorCtrl.showCustomerAttributeEditor, false);
		customerAttributeEditorCtrl.changeCustomerDefinedBlockState(true);
		assert.equal(customerAttributeEditorCtrl.showCustomerAttributeEditor, true);
		customerAttributeEditorCtrl.changeCustomerDefinedBlockState(false);
		assert.equal(customerAttributeEditorCtrl.showCustomerAttributeEditor, false);
	});

	/* it('saveCustomerDefinedAttribute', () => {
		const attribute = {
			name: 'bb'
		};
		$httpBackend
			.when('POST', 'undefined/fullView/undefined/')
			.respond({
				name: 'aa'
			});
		$httpBackend
			.when('POST', 'undefined/fullView/undefined/')
			.respond({
				name: 'bb',
				id: '111'
			});
		$httpBackend
			.when('POST', 'undefined/fullView/undefined/')
			.respond({});

		assert.equal(customerAttributeEditorCtrl.attributeSetting.attributeBlock[1].attributeList.length, 1);
		customerAttributeEditorCtrl.saveCustomerDefinedAttribute(attribute);
		$httpBackend.flush();
		assert.equal(customerAttributeEditorCtrl.attributeSetting.attributeBlock[1].attributeList.length, 2);
	});*/
});
