/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-31 11:05
 */

import angular from 'angular';
import { assert } from 'chai';
import sinon from 'sinon';

import CustomerProfileViewModeCtrl from '../CustomerProfileViewModeCtrl.js';

describe('CustomerProfileViewModeCtrl', () => {
	const customerProfileViewModeCtrl = new CustomerProfileViewModeCtrl();

	before(() => {
		const blockElement = document.createElement('div');
		const element = document.createElement('div');
		element.className = 'customer-profile-view-mode';
		blockElement.appendChild(element);
		const centerElement = document.createElement('div');
		centerElement.className = 'center-icon';
		element.appendChild(centerElement);
		Object.assign(customerProfileViewModeCtrl, {
			attributesSetting: [],
			customerTags: [],
			changeToSpecificAttributeBlock: sinon.spy(),
			_$element: angular.element(blockElement)
		});
	});

	it('$onChanges', () => {
		const obj = {
			customerTags: {
				currentValue: ['a']
			}
		};
		customerProfileViewModeCtrl.$onChanges(obj);
		assert.equal(customerProfileViewModeCtrl.customerTags.length, 0);
	});

	it('isOffsetConflict', () => {
		const occupiedArea = [{
			top: 10,
			left: 10,
			right: 20,
			bottom: 20
		}];
		let elementCoordinate = {
			top: 15,
			left: 0,
			right: 15,
			bottom: 30
		};
		assert.equal(customerProfileViewModeCtrl.isOffsetConflict(elementCoordinate, occupiedArea), true);

		elementCoordinate = {
			top: 0,
			left: 0,
			right: 10,
			bottom: 10
		};
		assert.equal(customerProfileViewModeCtrl.isOffsetConflict(elementCoordinate, occupiedArea), true);

		elementCoordinate = {
			top: 0,
			left: 10,
			right: 20,
			bottom: 20
		};
		assert.equal(customerProfileViewModeCtrl.isOffsetConflict(elementCoordinate, occupiedArea), true);

		elementCoordinate = {
			top: 15,
			left: 15,
			right: 25,
			bottom: 25
		};
		assert.equal(customerProfileViewModeCtrl.isOffsetConflict(elementCoordinate, occupiedArea), true);

		elementCoordinate = {
			top: 0,
			left: 0,
			right: 9,
			bottom: 30
		};
		assert.equal(customerProfileViewModeCtrl.isOffsetConflict(elementCoordinate, occupiedArea), false);

		elementCoordinate = {
			top: 10,
			left: 21,
			right: 31,
			bottom: 30
		};
		assert.equal(customerProfileViewModeCtrl.isOffsetConflict(elementCoordinate, occupiedArea), false);

		elementCoordinate = {
			top: 0,
			left: 0,
			right: 29,
			bottom: 19
		};
		assert.equal(customerProfileViewModeCtrl.isOffsetConflict(elementCoordinate, occupiedArea), false);

		elementCoordinate = {
			top: 21,
			left: 11,
			right: 19,
			bottom: 30
		};
		assert.equal(customerProfileViewModeCtrl.isOffsetConflict(elementCoordinate, occupiedArea), false);
	});
});
