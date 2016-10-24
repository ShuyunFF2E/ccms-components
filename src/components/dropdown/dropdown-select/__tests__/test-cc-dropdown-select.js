import { assert } from 'chai';

import '../../../index';

const {module, inject} = window;

describe('cc-dropdown-select', () => {
	let selectEl, ctrl, scope;

	beforeEach(module('ccms.components'));
	beforeEach(inject((_$compile_, _$rootScope_) => {
		const html = `
		<cc-dropdown-select
				placeholder="哈哈哈"
				model="value1"
				datalist="datalist1"
				mapping="fieldsMap"
				onSelectChange="selectChange(model, oldModel)">
		</cc-dropdown-select>
		`;

		scope = _$rootScope_.$new();
		scope.value1 = null;
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
		scope.selectChange = (model, oldModel) => {
			scope.newModel = model;
			scope.oldModel = oldModel;
		};

		selectEl = _$compile_(html)(scope);
		ctrl = selectEl.controller('ccDropdownSelect');
		scope.$digest();
	}));

	describe('DropdownSelectCtrl', () => {
		it('.setModelValue()', done => {
			ctrl.setModelValue('sh');
			assert.strictEqual(ctrl.title, '上海');
			assert.strictEqual(ctrl.model, 'sh');
			ctrl.setModelValue('bj');
			setTimeout(() => {
				done();
				assert.strictEqual(scope.newModel, 'bj');
				assert.strictEqual(scope.oldModel, 'sh');
			}, 0);
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

		it('.selectItemAt()', () => {
			ctrl.selectItemAt(1);
			assert.strictEqual(ctrl.title, '上海');
			assert.strictEqual(ctrl.model, 'sh');
			assert.strictEqual(ctrl.focusIndex, 1);
		});

		it('.clear()', () => {
			ctrl.clear();
			assert.strictEqual(ctrl.title, '');
			assert.strictEqual(ctrl.model, null);
		});

		it('.open()', () => {
			ctrl.open();
			assert.strictEqual(ctrl.isOpen, true);
		});

		it('.close()', () => {
			ctrl.close();
			assert.strictEqual(ctrl.isOpen, false);
		});

		it('.toggle()', () => {
			const openState = ctrl.isOpen;
			ctrl.toggle();
			assert.strictEqual(ctrl.isOpen, !openState);
		});

		it('.getElement()', () => {
			assert.strictEqual(ctrl.getElement(), selectEl[0]);
		});
	});
});

