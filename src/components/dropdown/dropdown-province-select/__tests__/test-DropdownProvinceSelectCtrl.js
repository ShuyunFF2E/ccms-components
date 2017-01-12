import { assert } from 'chai';

import '../../../index';

const { module, inject } = window;

describe('cc-dropdown-province-select', () => {
	let selectEl, ctrl, scope;

	beforeEach(module('ccms.components'));
	beforeEach(inject((_$compile_, _$rootScope_) => {
		const html = `
			<cc-dropdown-province-select
					placeholder="请选择收货省份"
					model="value"
					style="width: 280px;">
			</cc-dropdown-province-select>
		`;

		scope = _$rootScope_.$new();
		scope.value = [];

		selectEl = _$compile_(html)(scope);
		ctrl = selectEl.controller('ccDropdownProvinceSelect');
		scope.$digest();
	}));

	describe('DropdownProvinceSelectCtrl', () => {
		it('.setValue()', () => {
			ctrl.setValue(['陕西省', '上海']);
			assert.includeMembers(ctrl.model, ['陕西省', '上海']);
			assert.strictEqual(ctrl.model.length, 2);
		});

		it('.setActiveState()', () => {
			ctrl.setActiveState(true);
			assert.strictEqual(ctrl.isActive, true);
			ctrl.setActiveState(false);
			assert.strictEqual(ctrl.isActive, false);
		});

		it('.open()', () => {
			ctrl.open();
			assert.strictEqual(ctrl.isOpen, true);
		});

		it('.close()', () => {
			ctrl.close();
			assert.strictEqual(ctrl.isOpen, false);
		});

		it('.toggle()', done => {
			const openState = ctrl.isOpen;
			ctrl.toggle();
			setTimeout(() => {
				done();
				assert.strictEqual(ctrl.isOpen, !openState);
			}, 0);
		});

		it('.getElement()', () => {
			assert.strictEqual(ctrl.getElement(), selectEl[0]);
		});
	});
});
