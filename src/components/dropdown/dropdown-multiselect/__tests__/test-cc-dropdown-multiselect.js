import { assert } from 'chai';

import '../../../index';

const { module, inject } = window;

describe('cc-dropdown-multiselect', () => {
	let selectEl, ctrl, scope;

	beforeEach(module('ccms.components'));
	beforeEach(inject((_$compile_, _$rootScope_) => {
		const html = `
		<cc-dropdown-multiselect
				placeholder="快，快选我。。啊！"
				model="value1"
				datalist="datalist1"
				mapping="fieldsMap">
		</cc-dropdown-multiselect>
		`;

		scope = _$rootScope_.$new();
		scope.value1 = [];
		scope.datalist1 = [
			{title: '北京', value: 'bj'},
			{title: '上海', value: 'sh'},
			{title: '深圳', value: 'sz'},
			{title: '西安', value: 'xa'},
			{title: '南京', value: 'nj'},
			{title: '武汉', value: 'wh'},
			{title: '重庆', value: 'cq'},
			{title: '广州', value: 'gz'}
		];
		scope.fieldsMap = {
			displayField: 'title',
			valueField: 'value'
		};

		selectEl = _$compile_(html)(scope);
		ctrl = selectEl.controller('ccDropdownMultiselect');
		scope.$digest();
	}));

	describe('DropdownMultiselectCtrl', () => {
		it('.setValue()', () => {
			ctrl.setValue(['sh', 'xa']);
			assert.includeMembers(ctrl.model, ['sh', 'xa']);
			assert.strictEqual(ctrl.model.length, 2);
		});

		it('.focusUp()', () => {
			ctrl.focusAt(1);
			ctrl.focusUp();
			assert.strictEqual(ctrl.focusIndex, 0);
		});

		it('.focusDown()', () => {
			ctrl.focusAt(1);
			ctrl.focusDown();
			assert.strictEqual(ctrl.focusIndex, 2);
		});

		it('.clear()', () => {
			ctrl.clear();
			assert.strictEqual(ctrl.title, '');
			assert.isArray(ctrl.selection);
			assert.strictEqual(ctrl.selection.length, 0);
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

