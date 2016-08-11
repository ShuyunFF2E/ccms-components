/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-14
 */

import GridCtrl from '../GridCtrl';
import GRID_TEMPLATES from '../Constant';
import rowCellTemplate from '../tpls/row-cell.tpl.html';

import {assert} from 'chai';

describe('GridCtrl', () => {

	let gridCtrl;

	before(() => {

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
					width: '100px',
					sort: 'name'
				},
				{field: 'age', displayName: '年龄', align: 'center', sort: true},
				{field: 'gender', displayName: '性别', align: 'right'}
			],
			transformer: {
				pageNum: 'currentPage'
			}
		};

		gridCtrl.$onInit();
	});

	it('$onInit', done => {

		const type = 'default'.toUpperCase();

		Promise.all([gridCtrl.headerTemplate, gridCtrl.emptyTipsTemplate])
			.then(tpls => {
				assert.equal(tpls[0], GRID_TEMPLATES[type][0]);
				assert.equal(tpls[1], GRID_TEMPLATES[type][2]);

				const bodyTpl = rowCellTemplate.replace('{::cell-placeholder}', GRID_TEMPLATES[type][1]);
				assert.equal(gridCtrl.bodyTemplate, bodyTpl);

				done();
			});
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

	it('runColumnSorting', () => {

		assert.isArray(gridCtrl.sortConfig, 'sortConfig is Array');
		assert.deepEqual(gridCtrl.sortConfig[1], {prop: 'age', type: 'default'});
		assert.deepEqual(gridCtrl.sortConfig[0], {prop: 'name', type: 'default'});
		assert.isNull(gridCtrl.sortConfig[2], 'this is null');
		gridCtrl.runColumnSorting(1);
		assert.deepEqual(gridCtrl.opts.queryParams, {sortOrder: 'asc', sortProp: 'age', pageNum: 2});
	});
});


