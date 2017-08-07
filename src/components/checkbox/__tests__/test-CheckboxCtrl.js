/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-03 10:44
 */

import { assert } from 'chai';

import CheckboxCtrl from '../CheckboxCtrl.js';

describe('CheckboxCtrl', () => {
	let checkboxCtrl, bindings, $event, marked;

	before(() => {
		checkboxCtrl = new CheckboxCtrl();

		// mock ngModelController
		checkboxCtrl.ngModelController = {
			$setViewValue: function(value) {
				checkboxCtrl.ngModel = value;
			}
		};

		marked = 0;

		$event = {
			stopImmediatePropagation() {
				marked++;
			}
		};
	});

	it('$onInit', () => {
		bindings = {
			ngModel: false
		};
		Object.assign(checkboxCtrl, bindings);
		checkboxCtrl.$onInit();
		assert.deepEqual(checkboxCtrl.ngChecked, false);

		delete checkboxCtrl.ngModel;
		bindings = {
			ngChecked: true
		};
		Object.assign(checkboxCtrl, bindings);
		checkboxCtrl.$onInit();
		assert.deepEqual(checkboxCtrl.ngChecked, true);
	});

	it('$onChanges', () => {
		bindings = {
			ngModel: 'f',
			ngTrueValue: 't',
			ngFalseValue: 'f'
		};
		Object.assign(checkboxCtrl, bindings);
		checkboxCtrl.$onInit();
		assert.deepEqual(checkboxCtrl.ngChecked, false);
		checkboxCtrl.$onChanges({ngModel: {currentValue: 't'}});
		assert.deepEqual(checkboxCtrl.ngChecked, true);
	});

	it('toggleClick', () => {
		assert.deepEqual(checkboxCtrl.ngChecked, true);
		checkboxCtrl.toggleClick($event);
		assert.equal(marked, 0);
		assert.deepEqual(checkboxCtrl.ngChecked, false);
		assert.deepEqual(checkboxCtrl.ngModel, 'f');

		bindings = {
			ngDisabled: true
		};
		Object.assign(checkboxCtrl, bindings);
		checkboxCtrl.toggleClick($event);
		assert.equal(marked, 1);
		assert.deepEqual(checkboxCtrl.ngChecked, false);
		assert.deepEqual(checkboxCtrl.ngModel, 'f');

		bindings = {
			ngDisabled: false,
			indeterminate: true
		};
		Object.assign(checkboxCtrl, bindings);
		assert.deepEqual(checkboxCtrl.indeterminate, true);
		checkboxCtrl.toggleClick($event);
		assert.equal(marked, 1);
		assert.deepEqual(checkboxCtrl.indeterminate, false);
		assert.deepEqual(checkboxCtrl.ngChecked, true);
		assert.deepEqual(checkboxCtrl.ngModel, 't');
	});
});
