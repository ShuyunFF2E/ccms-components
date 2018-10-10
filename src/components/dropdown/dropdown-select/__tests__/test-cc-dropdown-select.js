import { assert } from 'chai';
import sinon from 'sinon';

import '../../../index';

const {module, inject} = window;

describe('cc-dropdown-select', () => {
	let selectEl, ctrl, scope, callback;

	beforeEach(module('ccms.components'));
	beforeEach(inject((_$compile_, _$rootScope_) => {
		callback = sinon.spy();
		const html = `
		<cc-dropdown-select
				placeholder="哈哈哈"
				model="value1"
				datalist="datalist1"
				mapping="fieldsMap"
				on-select-change="selectChange(model, oldModel, itemIndex, item)">
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
		scope.selectChange = callback;

		selectEl = _$compile_(html)(scope);
		ctrl = selectEl.controller('ccDropdownSelect');
		scope.$digest();
	}));

	describe('DropdownSelectCtrl', () => {
		it('.setModelValue()', done => {
			ctrl.setModelValue('sh');
			scope.$digest();  // model 重设, 需要触发脏检查
			assert.strictEqual(ctrl.title, '上海');
			assert.strictEqual(ctrl.model, 'sh');

			ctrl.setModelValue('bj');
			scope.$digest();  // model 重设, 需要触发脏检查
			setTimeout(() => {
				assert.strictEqual(callback.getCall(1).args[0], 'bj');
				assert.strictEqual(callback.getCall(1).args[1], 'sh');
				assert.strictEqual(callback.getCall(1).args[2], 0);
				assert.strictEqual(callback.getCall(1).args[3].value, 'bj');
				done(); // done 方法必须最后执行
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

		it('.selectItemAt()', done => {
			ctrl.selectItemAt(1);
			// scope.$digest();  // model 重设, 需要触发脏检查
			setTimeout(() => {
				scope.$apply();
				assert.strictEqual(ctrl.title, '上海');
				assert.strictEqual(ctrl.model, 'sh');
				assert.strictEqual(ctrl.focusIndex, 1);
				done();
			}, 0);

		});
	});
});

// about using setTimeout in UT:
// https://stackoverflow.com/questions/11235815/is-there-a-way-to-get-chai-working-with-asynchronous-mocha-tests

// setTimeout( function () {
// 	// Called from the event loop, not it()
// 	// So only the event loop could capture uncaught exceptions from here
// 	try {
// 		expect( true ).to.equal( false );
// 		done(); // success: call done with no parameter to indicate that it() is done()
// 	} catch( e ) {
// 		done( e ); // failure: call done with an error Object to indicate that it() failed
// 	}
// }, 100 );
