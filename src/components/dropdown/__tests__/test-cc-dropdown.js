import { assert } from 'chai';

import angular from 'angular';
import '../../../index';

const {module, inject} = window;

describe('cc-dropdown', () => {
	let dropdownEl, ctrl;
	let $scope;

	beforeEach(module('ccms.components'));
	beforeEach(inject((_$compile_, _$rootScope_) => {
		const html = `
		<cc-dropdown>
			<div>
				<button cc-dropdown-toggle>1号下拉</button>
				<div class="hide" cc-dropdown-panel>
					<div>1号下拉内容</div>
				</div>
			</div>
		</cc-dropdown>
		`;

		$scope = _$rootScope_.$new();

		dropdownEl = _$compile_(html)($scope);
		ctrl = dropdownEl.controller('ccDropdown');
		$scope.$digest();
	}));

	describe('DropdownCtrl', () => {
		it('.isOpen', () => {
			assert.isBoolean(ctrl.isOpen);

			ctrl.isOpen = true;
			assert.strictEqual(ctrl.isOpen, true);

			ctrl.isOpen = false;
			assert.strictEqual(ctrl.isOpen, false);
		});

		it('.open()', () => {
			ctrl.open();
			assert.strictEqual(ctrl.isOpen, true);
		});

		it('.close()', () => {
			ctrl.close();
			assert.strictEqual(ctrl.isOpen, false);
		});

		it('.getElement()', () => {
			assert.strictEqual(ctrl.getElement(), dropdownEl[0]);
		});
	});

	describe('DropdownToggleCtrl', () => {
		let toggleEl;

		beforeEach(() => {
			toggleEl = dropdownEl[0].querySelector('[cc-dropdown-toggle]');
		});

		it('.parent', () => {
			const toggleCtrl = angular.element(toggleEl).controller('ccDropdownToggle');
			assert.strictEqual(toggleCtrl.parent, ctrl);
			assert.instanceOf(toggleCtrl.parent, ctrl.constructor);
		});

		it('.toggle()', () => {
			const openState = ctrl.isOpen;
			ctrl.$$hash = 'xxxkuitos';
			// TODO: need another click
			toggleEl.click();
			assert.strictEqual(ctrl.isOpen, !openState);
		});
	});

	describe('DropdownPanelCtrl', () => {
		let panelEl;

		beforeEach(() => {
			panelEl = dropdownEl[0].querySelector('[cc-dropdown-panel]');
		});

		it('.parent', () => {
			const panelCtrl = angular.element(panelEl).controller('ccDropdownPanel');
			assert.instanceOf(panelCtrl.parent, ctrl.constructor);
		});
	});
});

