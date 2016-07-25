/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-14
 */

import GridCtrl from '../GridCtrl';
import GridHelper from '../GridHelper';
import TplReqHelper from '../../../common/utils/tpl-req-helper';

import sinon from 'sinon';
import {assert} from 'chai';

describe('GridCtrl', () => {

	let gridCtrl;

	before(() => {

		sinon.stub(GridHelper, 'refresh', gridOptions => GridHelper.fillOpts(gridOptions));
		sinon.stub(TplReqHelper, 'get', () => Promise.resolve(null));

		gridCtrl = new GridCtrl();
		gridCtrl.opts = {
			response: null,
			queryParams: {
				pageNum: 2
			},
			columnsDef: [
				{
					cellTemplate: '<span style="color:blue" ng-bind="entity.name" ng-click="app.click()" tooltip="entity.name" tooltip-append-to-body="true"></span>',
					displayName: '姓名',
					align: 'center',
					width: '100px'
				},
				{field: 'age', displayName: '年龄', align: 'center'},
				{field: 'gender', displayName: '性别', align: 'right'}
			],
			transformer: {
				pageNum: 'currentPage'
			}
		};

		gridCtrl.$onInit();
	});

	it('switchSelectAll', () => {
		gridCtrl.switchSelectAll(true, [{name: 'kuitos'}, {age: 20}]);
		assert.deepEqual(gridCtrl.selectedItems, [{name: 'kuitos'}, {age: 20}]);

		gridCtrl.switchSelectAll(false, [{age: 20}]);
		assert.deepEqual(gridCtrl.selectedItems, [{name: 'kuitos'}]);
	});

	it('switchSelectItem', () => {

		gridCtrl.switchSelectItem(true, {gender: 'xx'});
		assert.deepEqual(gridCtrl.selectedItems, [{name: 'kuitos'}, {gender: 'xx'}]);

		gridCtrl.switchSelectItem(false, {gender: 'xx'});
		assert.deepEqual(gridCtrl.selectedItems, [{name: 'kuitos'}]);
	});

	it('isEntitySelected', () => {

		assert.isTrue(gridCtrl.isEntitySelected({name: 'kuitos'}));
		assert.isFalse(gridCtrl.isEntitySelected({name: 'kuitosx'}));
	});

	it('$allSelected should auto change', () => {

		gridCtrl.opts.data = [{name: 'kuitos'}];
		assert.isTrue(gridCtrl.$allSelected);

		gridCtrl.opts.data = [{name: 'kuitos'}, {age: 10}];
		assert.isFalse(gridCtrl.$allSelected);
	});

});


