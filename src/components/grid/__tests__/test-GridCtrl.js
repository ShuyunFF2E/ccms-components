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
					sortProp: 'name',
					sortOrder: 'asc'
				},
				{field: 'age', displayName: '年龄', align: 'center', sort: 'age'},
				{field: 'remark', displayName: '备注', align: 'center', sortProp: 'remark', sortOrder: 'desc'},
				{field: 'gender', displayName: '性别', align: 'right'}
			],
			transformer: {
				pageNum: 'currentPage'
			},
			onRefresh: () => {
				assert.equal(1, 1, 'grid refresh');
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

	it('toggleSort', () => {

		const columnsDef = gridCtrl.opts.columnsDef;
		let targetSortOrder = getTargetSortOrder(columnsDef[0]);
		gridCtrl.toggleSort(columnsDef[0]);
		assert.equal(columnsDef[0].sortOrder, targetSortOrder, 'sort order is equal');

		targetSortOrder = getTargetSortOrder(columnsDef[1]);
		gridCtrl.toggleSort(columnsDef[1]);
		assert.equal(columnsDef[1].sortOrder, targetSortOrder, 'sort order is equal');

		targetSortOrder = getTargetSortOrder(columnsDef[2]);
		gridCtrl.toggleSort(columnsDef[2]);
		assert.equal(columnsDef[2].sortOrder, targetSortOrder, 'sort order is equal');

		function getTargetSortOrder(column) {
			if (column.sortProp) {
				switch (column.sortOrder) {
					case 'asc':

						return 'desc';
					case 'desc':

						return undefined;
					default:

						return 'asc';
				}
			}
		}
	});

	it('sortGridData', () => {

		gridCtrl.sortGridData(true);

		gridCtrl.sortGridData();

		gridCtrl.opts.columnsDef[0].sortProp = '';
		gridCtrl.opts.columnsDef[1].sortProp = '';
		gridCtrl.opts.columnsDef[2].sortProp = '';
		gridCtrl.sortGridData();
	});
});
