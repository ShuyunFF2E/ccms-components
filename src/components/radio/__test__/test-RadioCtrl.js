/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-11 14:36
 */
import { assert } from 'chai';

import RadioCtrl from '../RadioCtrl.js';

describe('RadioCtrl', () => {
	let radioCtrl, bindings;

	before(() => {
		radioCtrl = new RadioCtrl();

		// mock ngModelController
		radioCtrl.ngModelController = {
			$setViewValue: function(value) {
				radioCtrl.ngModel = value;
			}
		};
	});

	it('$onInit', () => {
		bindings = {
			ngModel: false
		};
		Object.assign(radioCtrl, bindings);
		radioCtrl.$onInit();
		assert.deepEqual(radioCtrl.isError, true);

		delete radioCtrl.isError;
		bindings = {
			ngModel: false,
			ngValue: false
		};
		Object.assign(radioCtrl, bindings);
		radioCtrl.$onInit();
		assert.deepEqual(radioCtrl.isError, undefined);
	});

	it('updateNgModel', () => {
		assert.deepEqual(radioCtrl.ngModel, false);
		radioCtrl.updateNgModel(true);
		assert.deepEqual(radioCtrl.ngModel, true);
	});
});
