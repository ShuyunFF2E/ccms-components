/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-03 10:44
 */

import { assert } from 'chai';

import SwitchCtrl from '../SwitchCtrl.js';

describe('SwitchCtrl', () => {
	let switchCtrl, bindings;

	before(() => {
		switchCtrl = new SwitchCtrl();

		// mock ngModelController
		switchCtrl.ngModelController = {
			$setViewValue: function(value) {
				this.ngModel = value;
			}
		};
	});

	it('$onInit', () => {
		bindings = {
			ngModel: false
		};
		Object.assign(switchCtrl, bindings);
		switchCtrl.$onInit();
		assert.deepEqual(switchCtrl.ngModel, false);

		bindings = {
			ngModel: '关',
			ngTrueValue: '关',
			ngFalseValue: '开'
		};
		Object.assign(switchCtrl, bindings);
		switchCtrl.$onInit();
		assert.deepEqual(switchCtrl.ngModel, '关');
	});

	it('get _state', () => {
		bindings = {
			ngModel: false
		};
		Object.assign(switchCtrl, bindings);
		switchCtrl.$onInit();
		assert.deepEqual(switchCtrl._state, false);

		bindings = {
			ngModel: '关',
			ngTrueValue: '关',
			ngFalseValue: '开'
		};
		Object.assign(switchCtrl, bindings);
		switchCtrl.$onInit();
		assert.deepEqual(switchCtrl._state, true);
	});
});
